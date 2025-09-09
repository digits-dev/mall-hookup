<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'mall_hookup' => [
        'pos_supplier_url' => env('POS_SUPPLIER_URL'),
        'pos_supplier_retrieve_url' => env('POS_SUPPLIER_RETRIEVE_URL'),
        'pos_supplier_api_key' => env('POS_SUPPLIER_API_KEY'),
        'pos_supplier_retrieve_api_key' => env('POS_SUPPLIER_RETRIEVE_API_KEY'),
        'secrey_key' => env('MALL_HOOKUP_SECRET_KEY')
    ]

];