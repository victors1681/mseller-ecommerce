<?php

namespace Woocommerce_Preorders;

class Checkout
{
    private $preordersMode;
    private $cart;
    private $emailIds;

    public function __construct()
    {
        $this->preordersMode = get_option('wc_preorders_mode');

        $this->cart = new Cart();
        if ('either' === $this->preordersMode) {
            add_filter('woocommerce_add_to_cart_validation', [$this->cart, 'allowOneTypeOnly'], 99, 2);
        }

        if (!\in_array(get_option('wc_preorders_mode'), ['whole', 'either'], true)) {
            add_action('woocommerce_thankyou', [$this, 'purgePreOrderedItems'], 9999, 1);
        } else {
            add_action('woocommerce_thankyou', [$this, 'checkGeneratedOrderStatus'], 9999, 1);
        }
        
        add_action('woocommerce_checkout_update_order_meta', [$this, 'managePreOrders'], 10, 2);
        add_action('woocommerce_order_status_changed', [$this,'emailNotifications'], 10, 4);
        add_filter('woocommerce_payment_complete_order_status', [$this,'setPreroderStatus'], 10, 3);
        add_filter('woocommerce_billing_fields', [$this, 'addShippingDateField']);
    }
    /**
     * Set main order status 'pre-ordered' after payment complete
     *
     * @param [string] $status
     * @param [int] $order_id
     * @param [type] $order
     * @return status
     */
    public function setPreroderStatus($status, $order_id, $order)
    {
        if (get_post_meta($order_id, '_preorder_date', true)) {
            return 'pre-ordered';
        }

        return $status;
    }
    /**
     * send preorder related emails
     *
     * @param [int] $order_id
     * @param [string] $old_status
     * @param [string] $new_status
     * @param [object] $order
     * @return void
     */
    public function emailNotifications($order_id, $old_status, $new_status, $order)
    {
        if ($old_status == 'pending' && $new_status == 'pre-ordered') {
          
            // Send "New Email" notification (to customer)
            WC()->mailer()->get_emails()['WC_Email_Customer_Invoice']->trigger($order_id);
            WC()->mailer()->get_emails()['WC_Email_New_Order']->trigger($order_id);
        }
    }
    

    /**
     * Sends normal order and invoice email to the customer when the user arrives to the thank you page.
     */
    public function sendOrderEmail($orderId)
    {
        $orderObj = wc_get_order($orderId);
        $email_new_order = WC()->mailer()->get_emails()['WC_Email_New_Order'];
        $emailProcessingOrder = WC()->mailer()->get_emails()['WC_Email_Customer_Processing_Order'];
        $emailOnHoldOrder = WC()->mailer()->get_emails()['WC_Email_Customer_On_Hold_Order'];
        $emailCompletedOrder = WC()->mailer()->get_emails()['WC_Email_Customer_Completed_Order'];

      
        $hasPreorderedProductsOnly = count($orderObj->get_items()) === count($this->getPreorderedProducts($orderObj));

        // We're only firing these emails if there's only a non-preordered product present.
        if (!$hasPreorderedProductsOnly) {
            $email_new_order->trigger($orderId);
            if ($orderObj->get_status() == 'on-hold') {
                $emailOnHoldOrder->trigger($orderId);
            } elseif ($orderObj->get_status() ==  'processing') {
                $emailProcessingOrder->trigger($orderId);
            } elseif ($orderObj->get_status() ==  'completed') {
                $emailCompletedOrder->trigger($orderId);
            }
        }
    }


    public function addShippingDateField($fields)
    {
        if (!is_checkout() && !is_cart()) {
            return $fields;
        }
        if ('no' === get_option('wc_preorders_always_choose_date')) {
            $class = ['disabled-input', 'form-row-wide'];
        } else {
            $class = ['form-row-wide'];
        }
        global $woocommerce;
        $cart = $woocommerce->cart->get_cart();
        $this->cart->checkPreOrderProducts($cart);
        if (\count($this->cart->getPreOrderProducts()) > 0) {
            $fields['preorder_date'] = [
                'label' => __('Pre order Date', 'preorders'),
                'type' => 'text',
                'class' => $class,
                'description' => __('Please enter the date when you want to receive your order', 'preorders'),
                // 'input_class'   => 'datepicker',
                'priority' => 35,
                'required' => true,
                'default' => $this->cart->getOldestDate(),
                'custom_attributes' => ['data-pre_order_date' => $this->cart->getOldestDate()],
            ];
        }

        return $fields;
    }

    public function manageShippingCosts($rates, $package)
    {
        $factor = 1;
        if ('individual' === $this->preordersMode) {
            /*
            * If we are on "individual" mode, then we will have to multiply it by the number of
            * orders that we are going to generate.
            */
            global $woocommerce;
            $cart = $woocommerce->cart->get_cart();
            $this->cart->checkPreOrderProducts($cart);
            if (\count($this->cart->getPreOrderProducts()) > 0) {
                $factor = 1 + \count($this->cart->getPreOrderProducts());
            }
        } elseif ('partial' === $this->preordersMode) {
            /*
            * If we are in partial mode and the "multiply shipping" option is enabled,
            * then we will have to multiply our shipping costs by 2
            */
            $factor = 2;
        }
        foreach ($rates as $id => $rate) {
            $rates[$id]->cost *= $factor;
        }

        return $rates;
    }

    public function managePreOrders($orderId, $data)
    {
        $order = wc_get_order($orderId);

        // Calculate shipping split factor
        $factor = $this->getSplitShippingFactor($order);

        
        /*
        * Case #1: treat the whole order as a pre-order
        * Check if the order is of type partial or individual, and if not set the whole order as pre-ordered
        */
        if (isset($data['preorder_date'])) {
            update_post_meta($orderId, '_preorder_date', esc_attr($data['preorder_date']));
            $order->set_status('wc-pre-ordered');
        }

        /**
         * Option number 4 is treated as a whole but only with preordered products, we're checking here
         * if we're only having preordered products whether we're on the 1st or 4th option as
         * both are treated as whole orders, the difference being having mixed products with the first option.
         */
        if ($this->orderHasOnlyPreorderedProducts($order, $this->cart)) {
            $this->emailIds['preorderIds'][] = $orderId;
        }

             

        // main action firing emails.
        do_action('preorder_email', $this->emailIds);
    }

    public function orderHasOnlyPreorderedProducts($orderObj, $cartObj)
    {
        return count($orderObj->get_items()) === count($cartObj->getPreOrderProducts());
    }

    public function checkGeneratedOrderStatus($order_id)
    {
        $order = wc_get_order($order_id);
        $items = $order->get_data();
        $this->cart->checkPreOrderProducts($items);
        if (\count($this->cart->getPreOrderProducts()) > 0) {
            $order->update_status('pre-ordered');
        }
    }

    /*
     * Check generated order and look for pre-order items.
     * If we are using case #2, then we must first check if all items are pre-ordered, and if so just change the order status.
     * Otherwise, if we are using case #3, we will have to remove the parent order.
     */
    public function purgePreOrderedItems($orderId)
    {
        $order = wc_get_order($orderId);

        if (count($order->get_items()) === count($this->getPreorderedProducts($order))) {
            return;
        }
            
        $order = wc_get_order($orderId);
        $items = $order->get_items();
        $diff = 0;
        foreach ($items as $key => $product) {
            if (('yes' === get_post_meta($product->get_product_id(), '_is_pre_order', true) && strtotime(get_post_meta($product->get_product_id(), '_pre_order_date', true)) > time()) || 'yes' === get_post_meta($product->get_variation_id(), '_is_pre_order', true) && strtotime(get_post_meta($product->get_variation_id(), '_pre_order_date', true)) > time()) {
                $deleteKeys[] = wc_delete_order_item($key);
                $diff += $product->get_total();
            }
        }
        $newTotal = $order->calculate_totals() - $diff;

        $order->set_total($newTotal);
        $order->save();
    }


    public function checkWholeOrders($order_id)
    {
        if (get_post_meta($order_id, '_pre_order_date', true)) {
            $order = wc_get_order($order_id);
            $order->set_status('wc-pre-ordered');
            $order->save();
        }
    }

    private function getPreorderedProducts($order)
    {
        $preorderedProducts = [];
        foreach ($order->get_items() as $item) {
            $productId = 0 !== $item->get_variation_id() ? $item->get_variation_id() : $item->get_product_id();
            $isPreOrder = get_post_meta($productId, '_pre_order_date', true);
            if ($isPreOrder && strtotime($isPreOrder) > time()) {
                $preorderedProducts[] = $item;
            }
        }

        return $preorderedProducts;
    }

    // Get the shipping total and split it into the amount of orders generated
    private function getSplitShippingFactor($order)
    {
        if ('yes' !== get_option('wc_preorders_multiply_shipping')) {
            return 1;
        }

        // If we are working on partial mode, then we will split it in 2 halves
        if ('partial' === $this->preordersMode) {
            return 2;
            // Otherwise we will have to split it by the amount of orders that we have
        }
        if ('individual' === $this->preordersMode) {
            return 1 + \count($this->getPreorderedProducts($order));
        }

        return 1;
    }

    private function getFilteredFields($prefix, $fields)
    {
        return $this->stripFieldsPrefix($prefix, $this->filterFields($prefix, $fields));
    }

    private function stripFieldsPrefix($prefix, $fields)
    {
        return array_combine(
            array_map(
                function ($k) use ($prefix) {
                    return str_replace($prefix, '', $k);
                },
                array_keys($fields)
            ),
            array_values($fields)
        );
    }

    private function filterFields($prefix, $fields)
    {
        return array_filter($fields, function ($key) use ($prefix) {
            return 0 === strpos($key, $prefix);
        }, ARRAY_FILTER_USE_KEY);
    }
}
