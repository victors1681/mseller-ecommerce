<?php

namespace Woocommerce_Preorders;

class Order
{
    public function __construct()
    {
        add_filter('manage_edit-shop_order_columns', [$this, 'preorderCustomColumn'], 20);
        add_action('manage_shop_order_posts_custom_column', [$this, 'preorderCustomColumnContent']);
    }

    public function preorderCustomColumn($columns)
    {
        $newColumns = [];
        foreach ($columns as $columnName => $columnInfo) {
            $newColumns[$columnName] = $columnInfo;
            if ('order_total' === $columnName) {
                $newColumns['order_preorder_date'] = __('Preorder Date', 'preorders');
            }
        }

        return $newColumns;
    }

    public function getPreOrderDate($order)
    {
        if (get_post_meta($order->ID, 'preorder_date', true) == '' && get_post_meta($order->ID, '_preorder_date', true) == '') {
            return;
        }
        $metaKey = ( get_post_meta($order->ID, '_preorder_date', true) != '' ) ? '_preorder_date' : 'preorder_date';
        $shippingDate = strtotime(get_post_meta($order->ID, $metaKey, true));
        
        $now = time();
        $diff = round(($shippingDate - $now) / (60 * 60 * 24));
        if ($diff > 0) {
            return sprintf(
                /* translators: number of days. */
                __('Available in %s days', 'preorders'), $diff
            );
        } elseif ($diff == 0) {
            return __('Available today', 'preorders');
        } else {
            return __('Already shipped', 'preorders');
        }
    }

    public function preorderCustomColumnContent($column)
    {
        if ('order_preorder_date' === $column) {
            global $post;
            echo $this->getPreOrderDate($post);
        }
    }
}