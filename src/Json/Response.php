<?php

namespace Json;

/**
 * Class Response
 * @package Json
 */
class Response
{
    /**
     * Response constructor.
     * @param array $payload
     */
    public function __construct(array $payload)
    {
        http_response_code(array_key_exists('error', $payload) ? 400 : 200);
        header('Access-Control-Allow-Origin: *');
        header('Content-type: application/json');
        $jsonResponse = json_encode($payload, JSON_PRETTY_PRINT);
        die($jsonResponse);
    }
}