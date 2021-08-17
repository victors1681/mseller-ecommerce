<?php

/**
 * Plugin Name: WPGraphQL CardNet
 * Plugin URI: https://github.com/victors1681/customers
 * Description: Carnet Graphql Tokinizer.
 * Version: 0.0.1
 * Author: Victor Santos
 * Author URI: https://mseller.app
 * Text Domain: wp-graphql-cardnet
 *
 * @package     WPGraphQL\Cardnet
 * @author      victor santos
 * @license     GPL-3
 */


//namespace WPGraphQL\CardNet;


spl_autoload_register(function ($class) {

	$namespace = 'WPGraphQL\CardNet\\';
	$path      = 'src';

	// Bail if the class is not in our namespace.
	if (0 !== strpos($class, $namespace)) {
		return;
	}

	// Remove the namespace.
	$class = str_replace($namespace, '', $class);

	// Build the filename.
	$file = realpath(__DIR__ . "/{$path}");
	$file = $file . DIRECTORY_SEPARATOR . str_replace('\\', DIRECTORY_SEPARATOR, $class) . '.php';

	// If the file exists for the class name, load it.
	if (file_exists($file)) {
		include($file);
	}
});



if (!class_exists('\WPGraphQL\CardNet')) :

	/**
	 * Class - CardNet
	 */
	final class CardNet
	{
		/**
		 * Stores the instance of the CardNet class
		 *
		 * @var CardNet The one true CardNet
		 * @since  0.0.1
		 * @access private
		 */
		private static $instance;

		/**
		 * The instance of the CardNet object
		 *
		 * @return object|CardNet - The one true CardNet
		 * @since  0.0.1
		 * @access public
		 */
		public static function instance()
		{
			if (!isset(self::$instance) && !(self::$instance instanceof CardNet)) {
				self::$instance = new CardNet;
				self::$instance->setup_constants();
			}

			self::$instance->init();

			/**
			 * Fire off init action
			 *
			 * @param CarNet $instance The instance of the Init_Carnet class
			 */
			do_action('graphql_carned_init', self::$instance);

			/**
			 * Return the Init_CardNet Instance
			 */
			return self::$instance;
		}
		private function setup_constants()
		{
			// Plugin version. 
			// Plugin Folder Path.
			// if (!defined('WPGRAPHQL_CARDNET_BASE_URL')) {
			// 	define('WPGRAPHQL_CardNet_PLUGIN_DIR', plugin_dir_path(__FILE__));
			// }
		}
		private static function init()
		{
			// Initialize the GraphQL fields for managing tokens.
			\WPGraphQL\CardNet\CardNetCustomer::init();
		}
	}
endif;




/**
 * Start CardNet.
 */
function init()
{
	new \WPGraphQL\CardNet\CardNetConfig();
	return CardNet::instance();
}


if (!in_array('woocommerce/woocommerce.php', apply_filters('active_plugins', get_option('active_plugins')))) return;



/**
 * Add the gateway to WC Available Gateways
 * 
 * @since 1.0.0
 * @param array $gateways all available WC gateways
 * @return array $gateways all WC gateways + cardnet
 */
function cardnet_add_to_gateways($gateways)
{
	$gateways[] = '\WPGraphQL\CardNet\CardNetWooGateway';
	return $gateways;
}



add_action('plugins_loaded', 'init', 11);
add_filter('woocommerce_payment_gateways', '\WPGraphQL\CardNet\cardnet_add_to_gateways');