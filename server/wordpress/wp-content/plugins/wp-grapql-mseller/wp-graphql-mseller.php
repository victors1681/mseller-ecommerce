<?php

/**
 * Plugin Name: WPGraphQL MSeller
 * Plugin URI: https://github.com/victors1681/customers
 * Description: Custom Fields for MSeller to WPGraphQL schema.
 * Version: 0.0.1
 * Author: Victor Santos
 * Author URI: https://mseller.app
 * Text Domain: wp-graphql-mseller 
 *
 * @package     WPGraphQL\MSeller
 * @author      victor santos
 * @license     GPL-3
 */


namespace MSeller;

require_once("vendor/autoload.php");

use Kreait\Firebase\Factory;
use MSeller\Admin;

//Register namespace
spl_autoload_register(function ($class) {

  $namespace = 'MSeller\\';
  $path      = 'src';

  // Bail if the class is not in our namespace.
  if (0 !== strpos($class, $namespace)) {
    return;
  }

  // Remove the namespace.
  $class = str_replace($namespace, '', $class);

  // Build the filename.
  $file = realpath(__DIR__ . "/{$path}");
  $file = $file . DIRECTORY_SEPARATOR . str_replace('\\', DIRECTORY_SEPARATOR, $class) . '.php';

  // If the file exists for the class name, load it.
  if (file_exists($file)) {
    include($file);
  }
});





class MSeller_Firebase
{

  public function __construct()
  {
    add_action('graphql_register_types', [__CLASS__, 'add_user_mutation_input_fields']);

    add_action('graphql_user_object_mutation_update_additional_data', [__CLASS__, 'update_jwt_fields_during_mutation'], 10, 5);
  }

  public static function getDatabase()
  {
    $options = get_option('mseller_options');
    $credentials = $options['firebase_credentials'];
    $url = $options['firebase_url'];

    $factory = (new Factory)
      ->withServiceAccount($credentials)
      ->withDatabaseUri($url);

    return $factory->createDatabase();
  }

  public static function saveToken(string $token, \WP_User $currentUser)
  {
    if (!$token) {
      return;
    }
    $db = self::getDatabase();
    $db->getReference('tokens/' . $currentUser->data->ID)->set([
      'email' => $currentUser->user_email,
      'firstName' => $currentUser->user_firstname,
      'lastName' => $currentUser->user_lastname,
      'token' => $token
    ]);
  }


  public static function add_user_mutation_input_fields()
  {

    /**
     * Register new field to Login to send the APN Token
     */

    $fields = [
      'fcmToken' => [
        'type'        => 'string',
        'description' => __('Firebase Cloud Messaging Token FCM Token'),
      ]
    ];


    $mutations_to_add_fields_to = apply_filters('graphql_jwt_auth_add_user_mutation_input_fields', [
      'RegisterCustomerInput',
      'LoginInput',
    ]);

    if (!empty($mutations_to_add_fields_to) && is_array($mutations_to_add_fields_to)) {
      foreach ($mutations_to_add_fields_to as $mutation) {
        register_graphql_fields($mutation, $fields);
      }
    }
  }


  public static function update_jwt_fields_during_mutation($user_id, array $input, $mutation_name)
  {

    //After user register using graphql set the cooke for the session
    //Same for login and refresh token


    if ($mutation_name === "registerCustomer") {
      $user = get_userdata($user_id);
      if (isset($user->ID)) {
        wp_set_auth_cookie($user_id, true, true);
      }
    }

    if (isset($input['fcmToken'])) {
      if ($input['fcmToken'] !== '') {
        /**
         * MSeller save phone token on firebase
         */

        $user = get_userdata($user_id);
        self::saveToken($input['fcmToken'], $user);
      }
    }
  }
}


/**
 * Start JWT_Authentication.
 */
function init()
{
  Admin::init();
  return new MSeller_Firebase();
}
add_action('plugins_loaded', '\MSeller\init', 1);