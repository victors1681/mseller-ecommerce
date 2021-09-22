<?php

/**
 * Register the login mutation to the WPGraphQL Schema
 *
 * @package WPGraphQL\JWT_Authentication
 * @since 0.0.1
 */

namespace WPGraphQL\JWT_Authentication;

use GraphQL\Type\Definition\ResolveInfo;
use WPGraphQL\AppContext;
use WPGraphQL\Data\UserMutation;

/**
 * Class - Login
 */
class Login
{
	/**
	 * Register the mutation.
	 */
	public static function register_mutation()
	{
		register_graphql_mutation(
			'login',
			[
				'description'         => __('Login a user. Request for an authToken and User details in response', 'wp-graphql-jwt-authentication'),
				'inputFields'         => [
					'username' => [
						'type'        => ['non_null' => 'String'],
						'description' => __('The username used for login. Typically a unique or email address depending on specific configuration', 'wp-graphql-jwt-authentication'),
					],
					'password' => [
						'type'        => ['non_null' => 'String'],
						'description' => __('The plain-text password for the user logging in.', 'wp-graphql-jwt-authentication'),
					],
				],
				'outputFields'        => [
					'authToken'    => [
						'type'        => 'String',
						'description' => __('JWT Token that can be used in future requests for Authentication', 'wp-graphql-jwt-authentication'),
					],
					'refreshToken' => [
						'type'        => 'String',
						'description' => __('A JWT token that can be used in future requests to get a refreshed jwtAuthToken. If the refresh token used in a request is revoked or otherwise invalid, a valid Auth token will NOT be issued in the response headers.', 'wp-graphql-jwt-authentication'),
					],
					'user'         => [
						'type'        => 'User',
						'description' => __('The user that was logged in', 'wp-graphql-jwt-authentication'),
					],
				],
				'mutateAndGetPayload' => function ($input, AppContext $context, ResolveInfo $info) {
					// Login the user in and get an authToken and user in response.
					$response = Auth::login_and_get_token(sanitize_user($input['username']), trim($input['password']), trim($input['apnToken']));

					//Custom Implementation to fire a event after the mutation is complete to update firebase fcm
					//MSeller Plugin
					if (!empty($response) && isset($response['id'])) {
						$userId = $response['id'];
						UserMutation::update_additional_user_object_data($userId, $input, 'login', $context, $info);
					}

					return $response;
				},
			]
		);
	}
}