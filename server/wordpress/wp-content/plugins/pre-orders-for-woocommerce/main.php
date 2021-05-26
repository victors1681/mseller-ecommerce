<?php
/**
 * Plugin Name: Preorders for WooCommerce
 * Plugin URI: https://brightplugins.com/
 * Description: Ultimate Preorders Plugin for WooCommerce.
 * Version: 1.2
 * Domain Path: /etc/i18n/languages/.
 * WC tested up to: 5.1.0
 * Tested up to: 5.6
 * WC requires at least: 3.9
 * Author: Bright Plugins
 * Author URI: https://brightplugins.com
 * Text Domain: preorders
 */

defined('ABSPATH') || exit;

// Define WCPO_PLUGIN_DIR.
if (!defined('WCPO_PLUGIN_DIR')) {
    define('WCPO_PLUGIN_DIR', __DIR__);
}
if (!defined('WCPO_PLUGIN_BASE')) {
    define('WCPO_PLUGIN_BASE', plugin_basename(__FILE__));
}
define('WCPO_PLUGIN_VER', '1.2');

use Woocommerce_Preorders\Bootstrap;
use Woocommerce_Preorders\Packages;

// Check if WooCommerce is active
if (in_array('woocommerce/woocommerce.php', apply_filters('active_plugins', get_option('active_plugins')), true)) {
    // Put your plugin code here

    add_action('woocommerce_loaded', function () {
        require_once WCPO_PLUGIN_DIR.'/vendor/autoload.php';
        require_once WCPO_PLUGIN_DIR.'/etc/conf.php';

        $bootstrap = new Bootstrap();
        register_activation_hook(__FILE__, [$bootstrap, 'defaultOptions']);

        $package = new Packages();
    });
} else {
    add_action('admin_notices', function () {
        $class = 'notice notice-error';
        $message = __('Oops! looks like WooCommerce is disabled. Please, enable it in order to use WooCommerce Pre-Orders.', 'preorders');
        printf('<div class="%1$s"><p>%2$s</p></div>', esc_attr($class), esc_html($message));
    });
}

if (get_option('bpwcavi-dismiss')) {
    add_action('before_preoder_settings_tab', 'bpWaviPlugin');
}
function bpWaviPlugin()
{
    ?>
    <div class="notice notice-success bp-new-alert">
        <div class="bp-logo"><img src="<?php echo WCPO_PLUGIN_URL.'media/img/bp-logo.png'; ?>" alt="Bright Plugins logo"><span>30% OFF</span></div>
        <div class="exclusive-txt">Exclusive Deal on our new plugin: </div>
        <div class="wcavi-img-banner">
            <img width="100%" src="<?php echo WCPO_PLUGIN_URL.'media/img/Variation-Images-for-WooCommerce-600x383.png'; ?>" alt="Bright Plugins logo"> 
           
        </div>
        <a target="_blank" class="new-link-bp" href="https://brightplugins.com/additional-variation-images-for-woocommerce/" >Additional Variation Images for WooCommerce </a>
        
    </div>
    <?php
}
