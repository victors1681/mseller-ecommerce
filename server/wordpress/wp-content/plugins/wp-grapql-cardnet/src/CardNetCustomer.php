<?php

namespace WPGraphQL\CardNet;

use WPGraphQL\CardNet\CardNetApi;
use WPGraphQL\CardNet\CardNetUtils;

class CardNetCustomer
{
    public function init()
    {
        // add_action('graphql_register_types', [$this, 'register_cardnet_customer_fields'], 10);

        add_action('graphql_register_types', ['\WPGraphQL\CardNet\CardNetCustomer', 'register_cardnet_customer_fields'], 10);
    }


    public static function getCurrentCardNetCustomerId()
    {
        $userData = wp_get_current_user();
        $cardNetCustomerId = get_user_meta($userData->ID, 'cardnetCustomerId', true);

        return $cardNetCustomerId;
    }

    /**
     * Only Admin user can perform action using customerId from the query parameter
     * if the user is not admin its take the customerId from the current session. 
     */
    public static function getCustomerId($payload)
    {
        if (current_user_can('administrator') && isset($payload['customerId'])) {
            return strval($payload['customerId']);
        }
        return self::getCurrentCardNetCustomerId();
    }

    public static function mapPaymentProfile($paymentsIn)
    {
        $payments = array();
        foreach ($paymentsIn as $payment) {

            array_push($payments, [
                "paymentProfileId" => $payment["PaymentProfileId"],
                "paymentMediaId" => $payment["PaymentMediaId"],
                "brand" => $payment["Brand"],
                "cardOwner" => $payment["CardOwner"],
                "bin" => $payment["Bin"],
                "issuerBank" => $payment["IssuerBank"],
                "type" => $payment["Type"],
                "token" => $payment["Token"],
                "expiration" => $payment["Expiration"],
                "last4" => $payment["Last4"],
                "enabled" => $payment["Enabled"],
            ]);
        }

        return $payments;
    }
    public static function mapCustomerObject($result)
    {
        return [
            'customerId' => $result['CustomerId'],
            'created' => $result['Created'],
            'commerceCustomerId' => $result['CommerceCustomerId'],
            'owner' => $result['Owner'],
            'email' => $result['Email'],
            'enabled' => $result['Enabled'],
            'shippingAddress' => $result['ShippingAddress'],
            'billingAddress' => $result['BillingAddress'],
            'plans' => $result['Plans'],
            'additionalData' => $result['AdditionalData'],
            'paymentProfiles' => self::mapPaymentProfile($result['PaymentProfiles']),
            'captureURL' => $result['CaptureURL'],
            'uniqueID' => $result['UniqueID'],
            'URL' => $result['URL'],
            'firstName' => $result['FirstName'],
            'lastName' => $result['LastName'],
            'docNumber' => $result['DocNumber'],
            'documentTypeId' => $result['DocumentTypeId'],
            'phoneNumber' => $result['PhoneNumber'],
        ];
    }

    public static function register_cardnet_customer_fields()
    {

        /**
         * PaymentProfile Object
         */

        $paymentProfileFields = [
            'PaymentProfileId' => [
                'type' => 'Int',
                'description' => __('Identificador del perfil de pago registrado para el Customer.', 'cardnet'),
            ],
            'PaymentMediaId' => [
                'type' => 'Int',
                'description' => __('Nombre asociado a la marca de la tarjeta de pago, por ejemplo “VISA”.', 'cardnet'),
            ],
            'Brand' => [
                'type' => 'String',
                'description' => __('Tipo de tarjeta'),
            ],
            'CardOwner' => [
                'type' => 'String',
                'description' => __('Nombre del propietario de la tarjeta'),
            ],
            'IssuerBank' => [
                'type' => 'String',
                'description' => __('Tipo de medio de pago, por ejemplo “CreditCard”', 'cardnet'),
            ],
            'Type' => [
                'type' => 'String',
                'description' => __('Tipo de pago'),
            ],
            'Token' => [
                'type' => 'String',
                'description' => __('Dato que representa al medio de pago registrado sin exponer los datos sensibles del mismo.
                Este dato será utilizado para realizar transacciones de pago mediante el medio de pago registrado.', 'cardnet'),
            ],
            'Expiration' => [
                'type' => 'String',
                'description' => __('Fecha de expiración del medio de pago (si corresponde). Formato: yyyyMM', 'cardnet'),
            ],
            'Last4' => [
                'type' => 'Int',
                'description' => __('Últimos 4 dígitos de la tarjeta de pago (si corresponde).', 'cardnet'),
            ],
            'Enabled' => [
                'type' => 'Boolean',
                'description' => __('Determina si el perfil se encuentra habilitado para realizar pagos.', 'cardnet'),
            ]
        ];

        /**
         * Register Custom Object
         */

        register_graphql_object_type('PaymentProfiles', [
            'description' => __('Payment Profiles', 'Este objeto es obtenido luego de ingresar un medio de pago, en este se informan los datos de un medio de pago registrado por el cliente al que está asociado, o sea el número de la tarjeta. La información ser obtenida a través de la consulta del cliente'),
            'fields' => $paymentProfileFields
        ]);

        $customerFields = [
            'CustomerId' => [
                'type' => 'Int',
                'description' => __('Identificador del cliente.', 'cardnet'),
            ],
            'Created' => [
                'type' => 'String',
                'description' => __('Fecha y hora del momento de la creación del cliente.
              Este campo está presente en la respuesta a consultas.
              No se incluye o valida en la creación o actualizaciones del objeto.', 'cardnet'),
            ],
            'CommerceCustomerId' => [
                'type' => 'String',
                'description' => __('Identificador del cliente en el comercio. Este valor es generado
                y utilizado internamente por el comercio para identificar al cliente dentro de la plataforma.', 'cardnet'),
            ],
            'FirstName' => [
                'type' => 'String',
                'description' => __('Nombre del cliente', 'cardnet'),
            ],
            'LastName' => [
                'type' => 'String',
                'description' => __('Apellido del cliente.', 'cardnet'),
            ],
            'Owner' => [
                'type' => 'String',
                'description' => __('Determina si el usuario fue registrado por el comercio, a través de Cardnet o anónimo.
              Valores posibles: “Our”, “Commerce”, “Anonymous”.
              Este campo está presente en la respuesta a consultas.
              No se incluye o valida en la creación o actualizaciones del objeto.', 'cardnet'),
            ],
            'Email' => [
                'type' => 'String',
                'description' => __('Email del cliente', 'cardnet'),
            ],
            'PhoneNumber' => [
                'type' => 'String',
                'description' => __('Teléfono de contacto del cliente.', 'cardnet'),
            ],
            'Enabled' => [
                'type' => 'Boolean',
                'description' => __('Customer activated', 'cardnet'),
            ],
            'ShippingAddress' => [
                'type' => 'String',
                'description' => __('ShippingAddress', 'cardnet'),
            ],
            'BillingAddress' => [
                'type' => 'String',
                'description' => __('BillingAddress', 'cardnet'),
            ],
            'Plans' => [
                'type' => 'String',
                'description' => __('Reservado', 'cardnet'),
            ],
            'UniqueID' => [
                'type' => 'String',
                'description' => __('Identificador único de la compra. Este valor opcional permite identificar una compra única y evitar la duplicación de transacciones en caso de errores de comunicación (ver más en Conceptos / Identificador único).', 'cardnet'),
            ],
            'AdditionalData' => [
                'type' => 'String',
                'description' => __('Lista de datos de tipo “Clave:Valor” para almacenar información extra.', 'cardnet'),
            ],
            'PaymentProfiles' => [
                'type' => ['list_of' => 'PaymentProfiles'],
                'description' => __('Lista de objetos PaymentProfile con información de los medios de pago registrados por el Customer.', 'cardnet'),
            ],
            'URL' => [
                'type' => 'String',
                'description' => __('URL donde se puede acceder a la información del Cliente (ej. /v1/customer/{customer-id}).', 'cardnet'),
            ],
            'DocumentTypeId' => [
                'type' => 'Int',
                'description' => __('Tipo de documento del cliente', 'cardnet'),
            ],
            'DocNumber' => [
                'type' => 'String',
                'description' => __('Documento del cliente', 'cardnet'),
            ],
            'CaptureURL' => [
                'type' => 'String',
                'description' => __('URL de captura de datos de tarjeta (es la URL que se debe abrir en un iframe para iniciar el proceso de captura de datos sensibles). Solo es válida para Customers de tipo “Commerce”.', 'cardnet'),
            ],
        ];


        /**
         * Register Cardnet Customer Object
         */

        register_graphql_object_type('CardNetCustomer', [
            'description' => __('CardNet Customer', 'Información del cliente que realiza el pago. Algunos medios de pago pueden requerir información adicional del cliente para poder tramitar la autorización.'),
            'fields' => $customerFields
        ]);


        /**
         * Resolver
         */

        register_graphql_field('RootQuery', 'cardnetCustomer', [
            'type' => 'CardNetCustomer',
            'description' => __('Describe what the field should be used for', 'cardnet'),
            'args' => [
                'customerId' => [
                    'type' => 'Int',
                    'description' => __('The ID of the customer', 'cardnet'),
                ]
            ],
            'resolve' => function ($source, $args, $context, $info) {

                CardNetUtils::isAuthenticated();
                $customerId = self::getCustomerId($args);

                $carnetApi = new CardNetApi();

                $result = $carnetApi->get_customer($customerId);

                $mapped = self::mapCustomerObject($result);
                return $mapped;
            }
        ]);


        $customerInput = [

            'CommerceCustomerId' => [
                'type' => 'String',
                'description' => __('Identificador del cliente en el comercio. Este valor es generado
                    y utilizado internamente por el comercio para identificar al cliente dentro de la plataforma.', 'cardnet'),
            ],
            'FirstName' => [
                'type' => 'String',
                'description' => __('Nombre del cliente', 'cardnet'),
            ],
            'LastName' => [
                'type' => 'String',
                'description' => __('Apellido del cliente.', 'cardnet'),
            ],
            'PhoneNumber' => [
                'type' => 'String',
                'description' => __('Teléfono de contacto del cliente.', 'cardnet'),
            ],
            'Enabled' => [
                'type' => 'Boolean',
                'description' => __('Customer activated', 'cardnet'),
            ],
            'ShippingAddress' => [
                'type' => 'String',
                'description' => __('ShippingAddress', 'cardnet'),
            ],
            'BillingAddress' => [
                'type' => 'String',
                'description' => __('BillingAddress', 'cardnet'),
            ],
            'AdditionalData' => [
                'type' => 'String',
                'description' => __('Lista de datos de tipo “Clave:Valor” para almacenar información extra.', 'cardnet'),
            ],
            'DocumentTypeId' => [
                'type' => 'Int',
                'description' => __('Tipo de documento del cliente', 'cardnet'),
            ],
            'DocNumber' => [
                'type' => 'String',
                'description' => __('Documento del cliente', 'cardnet'),
            ]
        ];


        $updatePaymentProfileInput = [

            'PaymentProfileId' => [
                'type' => ['non_null' => 'Int'],
                'description' => __('Payment Profile ID to update'),
            ],
            'customerId' => [
                'type' =>  'Int',
                'description' => __('Only admin can use this, if not it will use the current CustomerId'),
            ],
            'Expiration' => [
                'type' => 'string',
                'description' => __('credit card expiration date'),
            ],
            'Enabled' => [
                'type' => 'Boolean',
                'description' => __('Payment Method enable or disabled'),
            ]
        ];

        $removePaymentProfileInput = [
            'customerId' => [
                'type' =>  'Int',
                'description' => __('Only admin can use this, if not it will use the current CustomerId'),
            ],
            'PaymentProfileId' => [
                'type' => ['non_null' => 'Int'],
                'description' => __('Payment Profile ID to update'),
            ]
        ];

        $enablePaymentInput = [
            'customerId' => [
                'type' =>  'Int',
                'description' => __('Only admin can use this, if not it will use the current CustomerId'),
            ],
            'ActivationCode' => [
                'type' => ['non_null' => 'Int'],
                'description' => __('Código de activación emitido por el banco emisor de la tarjeta'),
            ],
            'Token' => [
                'type' => ['non_null' => 'Int'],
                'description' => __('Token de la tarjeta a activar'),
            ]
        ];



        /**
         * New Customer
         */

        function getNewInputs($customerInput)
        {
            $customerInput["Email"] = [
                'type' => array('non_null' => 'String'),
                'description' => __('Email del cliente', 'cardnet'),
            ];

            return $customerInput;
        }


        register_graphql_mutation('addCardnetCustomer', [
            'inputFields'  => getNewInputs($customerInput),
            'outputFields' => $customerFields,
            'mutateAndGetPayload' => function ($input, $context, $info) {

                CardNetUtils::isAuthenticated();

                $carnetApi = new CardNetApi();
                $result = $carnetApi->add_new_customer($input);
                return self::mapCustomerObject($result);
            }
        ]);


        /**
         * Update Customer
         */

        function getUpdateInputs($customerInput)
        {
            $customerInput["customerId"] =  [
                'type' =>  'Int',
                'description' => __('Only admin can use this, if not it will use the current CustomerId'),
            ];

            $customerInput["Email"] = [
                'type' => 'String',
                'description' => __('Email del cliente', 'cardnet'),
            ];

            return $customerInput;
        }

        /**
         * Update Customer
         */

        register_graphql_mutation('updateCardnetCustomer', [
            'inputFields'  => getUpdateInputs($customerInput),
            'outputFields' => $customerFields,
            'mutateAndGetPayload' => function ($input, $context, $info) {

                CardNetUtils::isAuthenticated();
                $customerId = self::getCustomerId($input);

                $carnetApi = new CardNetApi();
                $result = $carnetApi->update_customer($input, $customerId);
                return self::mapCustomerObject($result);
            }
        ]);


        /**
         * Update Payment
         */

        register_graphql_mutation('updateCardnetPaymentProfile', [
            'inputFields'  => $updatePaymentProfileInput,
            'outputFields' => $customerFields,
            'mutateAndGetPayload' => function ($input, $context, $info) {

                CardNetUtils::isAuthenticated();
                $customerId = self::getCustomerId($input);

                $carnetApi = new CardNetApi();
                $result = $carnetApi->update_payment_profile($input, $customerId);
                return self::mapCustomerObject($result);
            }
        ]);


        /**
         * Remove Payment
         */

        register_graphql_mutation('deleteCardnetPaymentProfile', [
            'inputFields'  => $removePaymentProfileInput,
            'outputFields' => [
                'customer' => [
                    'type' =>  'CardNetCustomer',
                ]
            ],
            'mutateAndGetPayload' => function ($input, $context, $info) {

                CardNetUtils::isAuthenticated();
                $customerId = self::getCustomerId($input);

                $carnetApi = new CardNetApi();
                $result = $carnetApi->delete_payment_profile($input, $customerId);
                return ["customer" => self::mapCustomerObject($result)];
            }
        ]);

        /**
         * Enable Payment
         */

        register_graphql_mutation('activateCardnetPayment', [
            'inputFields'  => $enablePaymentInput,
            'outputFields' => $customerFields,
            'mutateAndGetPayload' => function ($input, $context, $info) {

                CardNetUtils::isAuthenticated();
                $customerId = self::getCustomerId($input);

                $carnetApi = new CardNetApi();
                $result = $carnetApi->activate_payment($input, $customerId);
                return self::mapCustomerObject($result);
            }
        ]);
    }
}