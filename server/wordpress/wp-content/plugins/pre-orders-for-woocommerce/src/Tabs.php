<?php

namespace Woocommerce_Preorders;

class Tabs
{
    public function __construct()
    {
        // Variations tab
        add_action('woocommerce_product_after_variable_attributes', [$this, 'customVariationsFields'], 10, 3); // After all Variation fields

        // Inventory tab
        add_action('woocommerce_product_options_stock_status', [$this, 'customSimpleFields']);

        add_action('woocommerce_save_product_variation', [$this, 'customVariationsFieldsSave'], 10, 2);
        add_action('woocommerce_process_product_meta', [$this, 'customSimpleFieldsSave'], 10, 2);
    }

    /*
     * Add our Custom Fields to variable products
     */
    public function customVariationsFields($loop, $variation_data, $variation)
    {
        echo '<div class="options_group form-row form-row-full">';
        woocommerce_wp_checkbox(
            [
                'id' => '_is_pre_order_' . $variation->ID,
                'label' => __('Pre Order Product', 'preorders'),
                'description' => __(' Check this if you want to offer this product as pre-order', 'preorders'),
                'value' => get_post_meta($variation->ID, '_is_pre_order', true)
            ]
        );

        woocommerce_wp_text_input(
            [
                'id' => '_pre_order_date_' . $variation->ID,
                'label' => __('Pre Order Date', 'preorders'),
                'placeholder' => date('Y-m-d h:i:s'),
                'class' => 'datepicker',
                'desc_tip' => true,
                'description' => __('Choose when the product will be available.', 'preorders'),
                'value' => get_post_meta($variation->ID, '_pre_order_date', true)
            ]
        );

        echo '</div>';
    }

    /*
     * Save our variable product fields
     */
    public function customVariationsFieldsSave($post_id)
    {
        // $variation_id = $_POST['variable_post_id'][array_keys($_POST['variable_post_id'])[0]];
        $product = wc_get_product($post_id);

        $is_pre_order_variation = isset($_POST['_is_pre_order_' . $post_id]) ? 'yes' : 'no';
        $product->update_meta_data('_is_pre_order', $is_pre_order_variation);

        if ($is_pre_order_variation == 'yes') {
            $pre_order_date_value = esc_html($_POST['_pre_order_date_' . $post_id]);
            $product->update_meta_data('_pre_order_date', esc_attr($pre_order_date_value));
        }

        $product->save();
    }

    public function customSimpleFields()
    {
        echo '<div class="options_group form-row form-row-full hide_if_variable">';
        woocommerce_wp_checkbox(
            [
                'id' => '_is_pre_order',
                'label' => __('Pre Order Product', 'preorders'),
                'description' => __(' Check this if you want to offer this product as pre-order', 'preorders'),
                'value' => get_post_meta(get_the_ID(), '_is_pre_order', true),
            ]
        );

        woocommerce_wp_text_input(
            array(
            'id'          => '_pre_order_date',
            'label'       => __('Pre Order Date', 'preorders'),
            'placeholder' => date('Y-m-d h:i:s'),
            'class'       => 'datepicker',
            'desc_tip'    => true,
            'description' => __("Choose when the product will be available.", "preorders"),
            'value' => get_post_meta(get_the_ID(), '_pre_order_date', true)
            )
        );

        echo '</div>';
    }

    public function customSimpleFieldsSave($post_id)
    {
        $product = wc_get_product($post_id);
        $is_pre_order = isset($_POST['_is_pre_order']) ? 'yes' : 'no';
        $product->update_meta_data('_is_pre_order', $is_pre_order);

        if ($is_pre_order == 'yes') {
            $pre_order_date_value = esc_html($_POST['_pre_order_date']);
            $product->update_meta_data('_pre_order_date', esc_attr($pre_order_date_value));
        } else {
            $product->update_meta_data('_pre_order_date', '');
        }

        $product->save();
    }
}
