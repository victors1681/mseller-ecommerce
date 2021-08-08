<?php

namespace WPGraphQL\CardNet;

use WPGraphQL\CardNet\Api;

class CarNetCustomer
{
    public static function init()
    {
        add_action('graphql_register_types', [__CLASS__, 'register_cardnet_customer_fields']);
    }

    function register_cardnet_customer_fields()
    {

        /**
         * PaymentProfile Object
         */
        register_graphql_object_type('PaymentProfiles', [
            'description' => __('Payment Profiles', 'Este objeto es obtenido luego de ingresar un medio de pago, en este se informan los datos de un medio de pago registrado por el cliente al que está asociado, o sea el número de la tarjeta. La información ser obtenida a través de la consulta del cliente'),
            'fields' => [
                'PaymentProfileId' => [
                    'type' => 'Int',
                    'description' => __('Identificador del perfil de pago registrado para el Customer.', 'cardnet'),
                ],
                'PaymentMediaId' => [
                    'type' => 'Int',
                    'description' => __('Nombre asociado a la marca de la tarjeta de pago, por ejemplo “VISA”.', 'cardnet'),
                ],
                'IssuerBank' => [
                    'type' => 'String',
                    'description' => __('Tipo de medio de pago, por ejemplo “CreditCard”', 'cardnet'),
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
                'Last4' => [
                    'type' => 'Boolean',
                    'description' => __('Determina si el perfil se encuentra habilitado para realizar pagos.', 'cardnet'),
                ]
            ]
        ]);

        /**
         * Customer Object
         */

        register_graphql_object_type('CardnetCustomer', [
            'description' => __('Carnet Customer Object', 'cardnet'),
            'fields' => [
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
                    'type' => 'String',
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
            ]
        ]);


        /**
         * Resolver
         */

        register_graphql_field('RootQuery', 'cardnetCustomer', [
            'type' => 'CardnetCustomer',
            'description' => __('Describe what the field should be used for', 'cardnet'),
            'args' => [
                'customerId' => [
                    'type' => array('non_null' => 'Int'),
                    'description' => __('The ID of the customer', 'cardnet'),
                ]
            ],
            'resolve' => function ($source, $args, $context, $info) {

                $customerId = $args['customerId'];

                $carnetApi = new \WPGraphQL\CardNet\Api\CardNetApi();

                $result = $carnetApi->get_customer($customerId);

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
                    'paymentProfiles' => $result['PaymentProfiles'],
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
        ]);
    }
}