<?php

namespace MSeller;

use Kreait\Firebase\Factory;

class FirebaseIntegration
{

    public function __construct()
    {
        add_action('graphql_register_types', [__CLASS__, 'add_user_mutation_input_fields']);
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
                'type' => 'string',
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
}