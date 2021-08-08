<?php

namespace WPGraphQL\CardNet;

defined('ABSPATH') or exit;


class CardNetWooGateway extends \WC_Payment_Gateway
{

    public function __construct()
    {

        $this->id = 'CardNet Payment';
        $this->icon = apply_filters('woocommerce_offline_icon', '');
        $this->has_fields = false;
        $this->method_title = "Tarjeta de crédito";
        $this->method_description = "Pago por medio de trarjeta de crédito";

        $this->init_form_fields();
        $this->init_settings();

        // Define user set variables
        $this->title        = $this->get_option('title');
        $this->description  = $this->get_option('description');
        $this->instructions = $this->get_option('instructions', $this->description);

        // Actions
        add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));
        add_action('woocommerce_thankyou_' . $this->id, array($this, 'thankyou_page'));

        // Customer Emails
        add_action('woocommerce_email_before_order_table', array($this, 'email_instructions'), 10, 3);
    }

    public function init_form_fields()
    {

        $this->form_fields = apply_filters('wc_offline_form_fields', array(

            'enabled' => array(
                'title'   => __('Enable/Disable', 'wc-gateway-offline'),
                'type'    => 'checkbox',
                'label'   => __('Enable CardNet', 'wc-gateway-offline'),
                'default' => 'yes'
            ),

            'title' => array(
                'title'       => __('Title', 'wc-gateway-offline'),
                'type'        => 'text',
                'description' => __('This controls the title for the payment method the customer sees during checkout.', 'wc-gateway-offline'),
                'default'     => __('CardNet', 'wc-gateway-offline'),
                'desc_tip'    => true,
            ),

            'description' => array(
                'title'       => __('Description', 'wc-gateway-offline'),
                'type'        => 'textarea',
                'description' => __('Payment method description that the customer will see on your checkout.', 'wc-gateway-offline'),
                'default'     => __('Please remit payment to Store Name upon pickup or delivery.', 'wc-gateway-offline'),
                'desc_tip'    => true,
            ),

            'instructions' => array(
                'title'       => __('Instructions', 'wc-gateway-offline'),
                'type'        => 'textarea',
                'description' => __('Instructions that will be added to the thank you page and emails.', 'wc-gateway-offline'),
                'default'     => '',
                'desc_tip'    => true,
            ),
        ));
    }

    public function process_payment($order_id)
    {

        $order = wc_get_order($order_id);

        // Mark as on-hold (we're awaiting the payment)
        $order->update_status('on-hold', __('Awaiting CardNet', 'wc-gateway-offline'));

        // Remove cart
        WC()->cart->empty_cart();

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
     * @access public
     * @param WC_Order $order
     * @param bool $sent_to_admin
     * @param bool $plain_text
     */
    public function email_instructions($order, $sent_to_admin, $plain_text = false)
    {

        if ($this->instructions && !$sent_to_admin && 'offline' === $order->payment_method && $order->has_status('on-hold')) {
            echo wpautop(wptexturize($this->instructions)) . PHP_EOL;
        }
    }
}