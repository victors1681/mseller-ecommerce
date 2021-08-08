<?php

namespace WPGraphQL\CardNet\Api;

use GraphQL\Error\UserError;

class CardNetApi
{

    private $base_url = '';
    private $private_key = '';

    function __construct()
    {
        if (get_option('cardnet_test_mode') == "1") {
            $this->base_url = get_option('cardnet_demo_base_url');
            $this->private_key = get_option('cardnet_demo_api_key');
        } else {
            $this->base_url = get_option('cardnet_base_url');
            $this->private_key = get_option('cardnet_api_key');
        }
    }

    public static function init()
    {
        add_action('graphql_register_types', [__CLASS__, 'register_cardnet_customer_fields']);
    }

    private function getApiHeaders()
    {
        return  array(
            'timeout' => 10,
            'headers' => array(
                'Content-Type' => 'application/json',
                'Authorization' => "Basic {$this->private_key}"
            )
        );
    }

    function get_customer($customerId)
    {
        $api_url = "{$this->base_url}/customer/{$customerId}";

        $response = wp_remote_get(esc_url_raw($api_url), $this->getApiHeaders());

        if (!is_array($response) && is_wp_error($response)) {
            // Work with the $result data
            throw new \GraphQL\Error\UserError(__($response->get_error_message(), 'wp-graphql'));
        }

        $api_response = json_decode(wp_remote_retrieve_body($response), true);
        $result = $api_response['Response'];

        //graphql_debug($api_response['Response']['CustomerId'] );
        //  throw new \GraphQL\Error\UserError( __( strval($api_response), 'wp-graphql' ) );
        return $result;
    }
}