<?php

namespace WPGraphQL\CardNet;

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
            'Content-Type' => 'application/json',
            'Authorization' => "Basic {$this->private_key}"
        );
    }

    function isErrors($api_response)
    {
        $errors = $api_response['Errors'];
        $response = $api_response['Response'];

        if ($errors && count($errors) > 0) {
            $err = $errors[0];
            throw new UserError(__($err['Message'], 'wp-graphql'));
        }

        if ($errors == null && $response == null) {

            throw new UserError(__("Client not found, thridParty api returned null", 'wp-graphql'));
        }
    }

    function get_customer($customerId)
    {

        $api_url = "{$this->base_url}/customer/{$customerId}";

        $response = wp_remote_get(esc_url_raw($api_url), ['headers' => $this->getApiHeaders()]);

        if (is_wp_error($response)) {
            // Work with the $result data
            throw new UserError(__($response->get_error_message(), 'wp-graphql'));
        }

        $api_response = json_decode(wp_remote_retrieve_body($response), true);
        $result = $api_response['Response'];
        $this->isErrors($api_response);

        return $result;
    }



    function add_new_customer($payload)
    {
        $api_url = "{$this->base_url}/customer";

        $requestData = array('headers' => $this->getApiHeaders(), 'body' => wp_json_encode($payload));
        $response = wp_remote_post(esc_url_raw($api_url), $requestData);


        if (is_wp_error($response)) {

            // Work with the $result data
            throw new UserError(__($response->get_error_message(), 'wp-graphql'));
        }

        $api_response = json_decode(wp_remote_retrieve_body($response), true);
        $result = $api_response['Response'];

        $this->isErrors($api_response);

        return $result;
    }



    function update_customer($payload)
    {
        $customerId = strval($payload['customerId']);

        $api_url = "{$this->base_url}/customer/{$customerId}/update";

        $requestData = array('headers' => $this->getApiHeaders(), 'body' => wp_json_encode($payload));
        $response = wp_remote_post(esc_url_raw($api_url), $requestData);


        if (is_wp_error($response)) {
            // Work with the $result data
            throw new UserError(__($response->get_error_message(), 'wp-graphql'));
        }

        $api_response = json_decode(wp_remote_retrieve_body($response), true);
        $result = $api_response['Response'];

        $this->isErrors($api_response);

        return $result;
    }


    function update_payment_profile($payload)
    {
        $customerId = strval($payload['customerId']);

        $api_url = "{$this->base_url}/customer/{$customerId}/PaymentProfileUpdate";


        $requestData = array('headers' => $this->getApiHeaders(), 'body' => wp_json_encode($payload));
        $response = wp_remote_post(esc_url_raw($api_url), $requestData);


        if (is_wp_error($response)) {
            // Work with the $result data
            throw new UserError(__($response->get_error_message(), 'wp-graphql'));
        }

        $api_response = json_decode(wp_remote_retrieve_body($response), true);
        $result = $api_response['Response'];

        $this->isErrors($api_response);

        return $result;
    }

    function delete_payment_profile($payload)
    {
        $customerId = strval($payload['customerId']);

        $api_url = "{$this->base_url}/customer/{$customerId}/PaymentProfileDelete";


        $requestData = array('headers' => $this->getApiHeaders(), 'body' => wp_json_encode($payload));
        $response = wp_remote_post(esc_url_raw($api_url), $requestData);


        if (is_wp_error($response)) {
            // Work with the $result data
            throw new UserError(__($response->get_error_message(), 'wp-graphql'));
        }

        $api_response = json_decode(wp_remote_retrieve_body($response), true);
        $result = $api_response['Response'];

        $this->isErrors($api_response);

        return $result;
    }
}