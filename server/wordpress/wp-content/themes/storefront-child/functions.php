<?php

add_action('wp_enqueue_scripts', 'enqueue_parent_styles');
function enqueue_parent_styles()
{
	wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
}

/**
 * 
 * ALLOW CUSTOMER TO PLACE A ORDER.
 * https://github.com/wp-graphql/wp-graphql-woocommerce/issues/147
 */
function authorized($authorized, $order_id = null, $input)
{
	if (!$authorized) {

		$user = wp_get_current_user();


		if (!empty($user)) {
			$user_id = $user->data->ID;
			$customer_id = $input['customerId'];


			if (!isset($customer_id) || $customer_id == $user_id) {
				return true;
			}
		}
	}

	return $authorized;
}

add_filter('graphql_woocommerce_authorized_to_create_orders', 'authorized', 1, 3);

function assign_customer_id_to_current_user($order)
{
	$user = wp_get_current_user();

	if (!empty($user)) {
		$user_id = $user->data->ID;
		$customer_id = $order->get_customer_id();

		if (!$customer_id) {
			$order->set_customer_id($user_id);
			$order->save();
		}
	}

	return $order;
}
add_filter('graphql_woocommerce_after_order_create', 'assign_customer_id_to_current_user');