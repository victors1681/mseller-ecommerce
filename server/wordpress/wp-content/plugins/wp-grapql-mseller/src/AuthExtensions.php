<?php

namespace MSeller;

use Exception;

class AuthExtensions
{

    public function __construct()
    {
        add_action('graphql_register_types', [__CLASS__, 'register_custom_graphql'], 10);
        add_action(
            'graphql_user_object_mutation_update_additional_data',
            [__CLASS__, 'update_jwt_fields_during_mutation'],
            10,
            5
        );
    }


    function register_custom_graphql()
    {
        register_graphql_mutation('logout', [

            'inputFields' => null,
            'outputFields' =>  [
                'status' => [
                    'type' => 'Boolean',
                    'description' => __('response'),
                ]
            ],
            'mutateAndGetPayload' => function ($input, $context, $info) {
                try {
                    wp_logout();

                    return [
                        "status" => true
                    ];
                } catch (Exception $e) {
                    graphql_debug($e);
                }
                return [
                    "status" => false
                ];
            }
        ]);
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
                FirebaseIntegration::saveToken($input['fcmToken'], $user);
            }
        }
    }
}