<?php

if (!defined('WCPO_PLUGIN_URL')) {
    define('WCPO_PLUGIN_URL', plugin_dir_url(__FILE__) . '../');
}

add_action('plugins_loaded', function () {
    load_plugin_textdomain('preorders', false, basename(dirname(__FILE__)) . '/i18n');
});

// Cron interval. Default = once per hour
define('WCPO_CRON_INTERVAL', 'hourly');


// Load custom e-mails
function wcpoAddPreordersCustomEmail($email_classes)
{
    // include our custom email class
    require_once WCPO_PLUGIN_DIR . '/src/emails/class-wc-email-customer-preorder-available.php';
    require_once WCPO_PLUGIN_DIR . '/src/emails/class-wc-email-new-preorder.php';
    // add the email class to the list of email classes that WooCommerce loads
  
    //$email_classes['WC_Preorders_Email'] = new WC_Preorder_Email();
    $email_classes['WC_New_Pre_Order_Email'] = new WC_Email_New_Pre_Order();
    return $email_classes;
}
add_filter('woocommerce_email_classes', 'wcpoAddPreordersCustomEmail');

if (in_array('woocommerce-product-bundles/woocommerce-product-bundles.php', apply_filters('active_plugins', get_option('active_plugins')), true)) {
    // TODO: compatibility with product bundles
}
