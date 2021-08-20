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

// add_action( 'graphql_register_types', 'mseller_wpgraphql_schema' );

// function mseller_wpgraphql_schema() {
//     register_graphql_object_type( 'CustomType', [
//         'description' => __( 'Describe what a CustomType is', 'your-textdomain' ),
//         'fields' => [
//           'testField' => [
//             'type' => 'String',
//             'description' => __( 'Describe what testField should be used for', 'your-textdomain' ),
//           ],
//           'count' => [
//             'type' => 'Int',
//             'description' => __( 'Describe what the count field should be used for', 'your-textdomain' ),
//           ],
//         ],
//       ] );

//   register_graphql_field( 'CustomerAddress', 'customField', [
//     'type' => 'CustomType',
//     'description' => __( 'Describe what the field should be used for', 'your-textdomain' ),
//     'resolve' => function($root, $args, $context, $info) {
//         return [
//             'count' => 5,
//             'testField' => 'test value...' + $args['name'],
//           ];
//     }
//   ] );
// };