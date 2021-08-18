<?php


namespace WPGraphQL\CardNet;

use MSeller\Error\AuthError;

class CardNetUtils
{

    public static function isAuthenticated()
    {
        if (!is_user_logged_in()) {
            throw new AuthError(__('User not authorized', 'wp-graphql-jwt-authentication'));
        }
    }

    public static function isAdmin()
    {
        if (!is_user_logged_in()) {
            throw new AuthError(__('User not authorized. Admin resource', 'wp-graphql-jwt-authentication'));
        }
    }
}