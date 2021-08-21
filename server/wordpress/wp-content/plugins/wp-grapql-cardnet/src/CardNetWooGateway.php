<?php

namespace WPGraphQL\CardNet;

use WC_Settings_API;
use WP_Error;
use GraphQL\Error\UserError;

defined('ABSPATH') or exit;

/**
 * CardNet Credit Card
 *
 * Provides a Credit Card Payment Gateway.
 *
 */
class CardNetWooGateway extends \WC_Payment_Gateway
{

    public function __construct()
    {


        $this->id = 'carnetpayment';
        $this->icon = apply_filters('woocommerce_cod_icon', '');
        $this->method_title = __('Tarjeta de crédito', 'woocommerce');
        $this->method_description = "Pago por medio de trarjeta de crédito";
        $this->has_fields = false;

        $this->init_form_fields();
        $this->init_settings();


        // Define user set variables
        $this->title        = $this->get_option('title');
        $this->description  = $this->get_option('description');
        $this->instructions = $this->get_option('instructions', $this->description);
        $this->enabled = $this->get_option('enabled');
        $this->testmode = 'yes' === $this->get_option('cardnet_test_mode');

        $this->publishable_key = $this->testmode ?  $this->get_option('cardnet_demo_public_api_key') : $this->get_option('cardnet_public_api_key');

        $this->private_key = $this->testmode ? $this->get_option('cardnet_demo_api_key') : $this->get_option('cardnet_api_key');

        $this->base_url = $this->testmode ? $this->get_option('cardnet_demo_base_url') : $this->get_option('cardnet_base_url');

        // Actions
        add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));
        add_action('woocommerce_thankyou_' . $this->id, array($this, 'thankyou_page'));
        //add_filter('woocommerce_payment_complete_order_status', array($this, 'change_payment_complete_order_status'), 10, 3);

        // We need custom JavaScript to obtain a token
        //add_action( 'wp_enqueue_scripts', array( $this, 'payment_scripts' ) );


        // Customer Emails
        add_action('woocommerce_email_before_order_table', array($this, 'email_instructions'), 10, 3);

        // You can also register a webhook here
        // add_action( 'woocommerce_api_{webhook name}', array( $this, 'webhook' ) );


    }


    public function init_form_fields()
    {
        $this->form_fields = array(
            'enabled'            => array(
                'title'   => __('Enable/Disable', 'woocommerce'),
                'type'    => 'checkbox',
                'label'   => __('Enable CardNet', 'woocommerce'),
                'default' => 'yes'
            ),

            'title' => array(
                'title'       => __('Title', 'woocommerce'),
                'type'        => 'text',
                'description' => __('This controls the title for the payment method the customer sees during checkout.', 'woocommerce'),
                'default'     => __('CardNet', 'woocommerce'),
                'desc_tip'    => true,
            ),

            'description' => array(
                'title'       => __('Description', 'woocommerce'),
                'type'        => 'textarea',
                'description' => __('Payment method description that the customer will see on your checkout.', 'woocommerce'),
                'default'     => __('Please remit payment to Store Name upon pickup or delivery.', 'woocommerce'),
                'desc_tip'    => true,
            ),

            'instructions' => array(
                'title'       => __('Instructions', 'woocommerce'),
                'type'        => 'textarea',
                'description' => __('Instructions that will be added to the thank you page and emails.', 'woocommerce'),
                'default'     => '',
                'desc_tip'    => true,
            ),
            'cardnet_test_mode' => array(
                'title'       => 'Test mode',
                'label'       => 'Enable Test Mode',
                'type'        => 'checkbox',
                'description' => 'Place the payment gateway in test mode using test API keys.',
                'default'     => 'yes',
                'desc_tip'    => true,
            ),
            'cardnet_demo_public_api_key' => array(
                'title'       => 'Demo Public Key',
                'type'        => 'text'
            ),
            'cardnet_demo_api_key' => array(
                'title'       => 'Demo Private Key',
                'type'        => 'password',
            ),
            'cardnet_demo_base_url' => array(
                'title'       => 'Test Base URL',
                'type'        => 'text',
                'description' => 'https://lab.cardnet.com.do/servicios/tokens/v1',
                'placeholder' => 'https://lab.cardnet.com.do/servicios/tokens/v1'
            ),
            'cardnet_public_api_key' => array(
                'title'       => 'Live Publishable Key',
                'type'        => 'text'
            ),
            'cardnet_api_key' => array(
                'title'       => 'Live Private Key',
                'type'        => 'password'
            ),
            'cardnet_base_url' => array(
                'title'       => 'Live Base URL',
                'type'        => 'text',
                'description' => 'https://servicios.cardnet.com.do/servicios/tokens/v1',
                'placeholder' => 'https://servicios.cardnet.com.do/servicios/tokens/v1'
            ),
        );
    }

    public function process_payment($order_id)
    {

        $order = wc_get_order($order_id);
        $currency = get_woocommerce_currency();
        $total = $order->get_total();
        $taxes = $order->get_tax_totals();
        $trxToken = $order->get_meta("TrxToken");
        $ipAddress = $order->get_customer_ip_address();

        $customerUserAgent = $order->get_customer_user_agent();

        graphql_debug(json_encode($order->get_transaction_id()));

        $taxTotal = 0;
        foreach ($taxes as $code => $tax) {
            $taxTotal += $tax->amount;
        }

        $payload = [
            "TrxToken" => $trxToken,
            "Order" => strval($order_id),
            "Amount" =>  floor(bcmul($total, 100)),
            "Currency" => $currency,
            "Capture" => true,
            "CustomerIP" => $ipAddress,
            "CustomerUserAgent" => $customerUserAgent,
            "DataDo" =>  [
                "Tax" => floor(bcmul($taxTotal, 100)),
                "Invoice" => strval($order_id)
            ]
        ];



        //make api request
        $api = new \WPGraphQL\CardNet\CardNetApi();
        $response_raw_data = $api->add_new_purchase($payload);
        $response = \WPGraphQL\CardNet\CardNetPurchase::mapPurchase($response_raw_data);


        $status = $response["transaction"]["status"];
        $isApproved = $status == "Approved";
        $description = $response["transaction"]["description"];
        $transactionStatusId = $response["transaction"]["transactionStatusId"];
        $transactionID = $response["transaction"]["transactionID"];
        $approveCode = $response["transaction"]["approvalCode"];
        $created = $response["transaction"]["created"];

        $order->update_meta_data('status', $status);
        $order->update_meta_data('description', $description);
        $order->update_meta_data('transactionStatusId', $transactionStatusId);
        $order->update_meta_data('transactionID', $transactionID);
        $order->update_meta_data('created', $created);
        $order->update_meta_data('aapproveCode', $approveCode);

        //TransactionStatusId
        // 1 Approved
        // 2 Pending
        // 3 Preauthorized
        // 4 Rejected



        //pending  
        if ($transactionStatusId == 2) {
            $order->update_status('pending-payment', 'CardNet status is on pending state');
            //$order->update_status('on-hold', __('Awaiting CardNet', 'woocommerce'));
        }

        //Rejected or preautorized
        if ($transactionStatusId == 4 || !$isApproved) {
            graphql_debug(json_encode($response));
            //wc_add_notice("No se pudo relizar la transacción por favor intentarlo nuevamente", 'error');
            throw new UserError(__("No se pudo relizar la transacción por favor intentarlo nuevamente", 'wp-graphql'));

            return;
        }

        if ($isApproved) {
            // we received the payment
            $order->payment_complete();
        }

        // Remove cart
        WC()->cart->empty_cart();

        $order->save();
        // Return thankyou redirect
        return array(
            'result'    => 'success',
            'redirect'  => $this->get_return_url($order)
        );
    }


    /**
     * Output for the order received page.
     */
    public function thankyou_page()
    {
        if ($this->instructions) {
            echo wpautop(wptexturize($this->instructions));
        }
    }


    /**
     * Add content to the WC emails.
     *
     * @param WC_Order $order Order object.
     * @param bool     $sent_to_admin  Sent to admin.
     * @param bool     $plain_text Email format: plain text or HTML.
     */
    public function email_instructions($order, $sent_to_admin, $plain_text = false)
    {
        if ($this->instructions && !$sent_to_admin && $this->id === $order->get_payment_method()) {
            echo wp_kses_post(wpautop(wptexturize($this->instructions)) . PHP_EOL);
        }
    }
}