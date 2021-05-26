<?php

namespace Woocommerce_Preorders;

class Shop
{
    public function __construct()
    {
        add_filter('woocommerce_product_add_to_cart_text', [$this,'changeButtonText'], 10, 1);
        add_filter('woocommerce_product_single_add_to_cart_text', [$this,'changeButtonText'], 10, 1);
        add_filter('woocommerce_available_variation', [$this,'changeButtonTextForVariableProducts'], 10, 3);
        add_action('woocommerce_before_add_to_cart_form', [$this,'beforeAddToCartBtn'], 10);
    }
    public function beforeAddToCartBtn()
    {
        global $post,$product;
        if ($product !== null && 'yes' == get_option('wc_preorders_avaiable_date_single_product')) {
            if ('yes' == get_post_meta($post->ID, '_is_pre_order', true) && strtotime(get_post_meta($post->ID, '_pre_order_date', true)) > time()) {
                $timeFormat = date_i18n(get_option('date_format'), strtotime(get_post_meta($post->ID, '_pre_order_date', true))) ;

                $text =  $this->replaceDateTxt(get_option('wc_preorders_avaiable_date_text'), $timeFormat) ;
                
                echo apply_filters('preorder_avaiable_date_text', $text);
            }
        }
    }
    public function changeButtonTextForVariableProducts($data, $product, $variation)
    {
        if (get_post_meta($variation->get_id(), '_is_pre_order', true) == 'yes') {
            $data['is_pre_order'] = true;
        }
        return $data;
    }
        
    /**
         * replace the Available date Text field
         *
         * @param [str] $string
         * @return void
         */
    public function replaceDateTxt($string, $timeFormat)
    {
        $find = array("{date_format}");
        $replace = array($timeFormat);

        return str_replace($find, $replace, $string);
    }

    public function changeButtonText($text)
    {
        global $post, $product;
       
        if ($product !== null) {
            if ('yes' == get_post_meta($post->ID, '_is_pre_order', true) && strtotime(get_post_meta($post->ID, '_pre_order_date', true)) > time()) {
                return get_option('wc_preorders_button_text');
            }
        }
        

        return $text;
    }
}
