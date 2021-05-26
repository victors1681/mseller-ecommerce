<?php

namespace Woocommerce_Preorders;


class Packages
{
    public function __construct()
    {
        if( apply_filters( 'shop_have_free_shipping_based_on_amount', false ) ){
            add_filter( 'woocommerce_package_rates', array( $this , 'remove_free_shpping_method' ), 10, 2 );
        }

        add_filter('woocommerce_cart_shipping_packages', array( &$this, 'generateVendors') );
    }

    function remove_free_shpping_method( $rates, $package ) {

        $shipping_method_id = 'free_shipping'; // sets free shipping as the deactivated method
        $remove_free_method = false;
    
        $total = WC()->cart->get_displayed_subtotal();
        if( $total >= apply_filters( 'set_free_shipping_min_amount', 100 ) ){
            $remove_free_method = true;
        }
        if ( $remove_free_method ) {
            $shipping_methods_disable = array();
            foreach ( $rates as $rate_id => $rate ) {
                if ( $shipping_method_id !== $rate->method_id ) {
                    $shipping_methods_disable[$rate_id] = $rate;
                }
            }
        }

        return !empty( $shipping_methods_disable ) ? $shipping_methods_disable : $rates;
    }

    public function generateVendors($packages)
    {
        /*
         * Needs refactor
         */
        if (get_option('wc_preorders_mode')  == 'individual') {
            $packages = [];
            $packages['ship_via'] = array( 'flat_rate' ); 
            $i=1;
            foreach (WC()->cart->get_cart() as $item) {
                $productId = isset($item['variation_id']) && 0 !== $item['variation_id'] ? $item['variation_id'] : $item['product_id'];
                $p = new Product($productId);
                
                if( $p->isPreOrder()){
                    $vendors[$i][] = $item;
                    $i++;
                } else {
                    $vendors[0][] = $item;
                }
            }
            foreach ($vendors as $key => $vendor_items) {
                $packages[] = array(
                    'contents' => $vendor_items,
                    'contents_cost' => array_sum(wp_list_pluck($vendor_items, 'line_total')),
                    'applied_coupons' => WC()->cart->applied_coupons,
                    'destination' => array(
                        'country' => WC()->customer->get_shipping_country(),
                        'state' => WC()->customer->get_shipping_state(),
                        'postcode' => WC()->customer->get_shipping_postcode(),
                        'city' => WC()->customer->get_shipping_city(),
                        'address' => WC()->customer->get_shipping_address(),
                        'address_2' => WC()->customer->get_shipping_address_2()
                    )
                );
            }
        } else if(get_option('wc_preorders_mode') == 'partial') {
            
            $packages = array();
            $preoders_items = array();
            $regular_items = array();
            $total = WC()->cart->get_displayed_subtotal();

            foreach (WC()->cart->get_cart() as $item) {
                $productId = isset($item['variation_id']) && 0 !== $item['variation_id'] ? $item['variation_id'] : $item['product_id'];
                $p = new Product($productId);
                
                if( $p->isPreOrder()){
                    $preoders_items[] = $item;
                } else {
                    $regular_items[] = $item;
                }
            }
            
 
                if ( $preoders_items ) {
                  
                    $packages[] = array(

                    
                        'ship_via' => ( array_sum( wp_list_pluck( $preoders_items, 'line_total' ) ) >= apply_filters( 'set_free_shipping_min_amount', 100 ) && apply_filters( 'shop_have_free_shipping_based_on_amount', false ) ) ? array('free_shipping') : null ,
                        'contents' => $preoders_items,
                        'contents_cost' => array_sum( wp_list_pluck( $preoders_items, 'line_total' ) ),
                        'applied_coupons' => WC()->cart->applied_coupons,
                        'destination' => array(
                            'country' => WC()->customer->get_shipping_country(),
                            'state' => WC()->customer->get_shipping_state(),
                            'postcode' => WC()->customer->get_shipping_postcode(),
                            'city' => WC()->customer->get_shipping_city(),
                            'address' => WC()->customer->get_shipping_address(),
                            'address_2' => WC()->customer->get_shipping_address_2()
                        )
                    );
                }
                if ( $regular_items ) {
                    $packages[] = array(
                        'ship_via' => ( array_sum( wp_list_pluck( $regular_items, 'line_total' ) ) >= apply_filters( 'set_free_shipping_min_amount', 100 ) && apply_filters( 'shop_have_free_shipping_based_on_amount', false ) ) ? array('free_shipping') : null ,
                        'contents' => $regular_items,
                        'contents_cost' => array_sum( wp_list_pluck( $regular_items, 'line_total' ) ),
                        'applied_coupons' => WC()->cart->applied_coupons,
                        'destination' => array(
                            'country' => WC()->customer->get_shipping_country(),
                            'state' => WC()->customer->get_shipping_state(),
                            'postcode' => WC()->customer->get_shipping_postcode(),
                            'city' => WC()->customer->get_shipping_city(),
                            'address' => WC()->customer->get_shipping_address(),
                            'address_2' => WC()->customer->get_shipping_address_2()
                        )
                    );
                } 
        }


                
        return $packages;
    }
}
