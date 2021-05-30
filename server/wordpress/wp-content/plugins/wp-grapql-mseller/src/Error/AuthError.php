<?php
namespace MSeller\Error;

use RuntimeException;
use GraphQL\Error\ClientAware;

/**
 * Error caused by actions of GraphQL clients. Can be safely displayed to a client...
 */
class AuthError extends RuntimeException implements ClientAware
{
    /**
     * @return bool
     */
    public function isClientSafe()
    {
        return true;
    }

    /**
     * @return string
     */
    public function getCategory()
    {
        return 'auth';
    }
}
