<?php

namespace MSeller;

use Exception;

class AuthExtensions
{

    public function __construct()
    {
        add_action('graphql_register_types', [__CLASS__, 'register_custom_graphql'], 10);
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
}