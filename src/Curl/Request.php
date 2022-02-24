<?php

namespace Curl;

/**
 * Class Request
 * @package Curl
 */
class Request
{
    /**
     * @param $endpoint
     * @param array $getParams
     * @param array $headers
     * @return Response
     */
    public static function get($endpoint, array $getParams = [], array $headers = []): Response
    {
        $request = curl_init();
        if (!empty($getParams)) {
            // Handling pre-built uris with query!
            if (strpos($endpoint, '?') === false) {
                $endpoint .= '?' . http_build_query($getParams);
            } else {
                $endpoint .= '&' . http_build_query($getParams);
            }
        }

        # Setting options
        curl_setopt($request, CURLOPT_URL, $endpoint);
        curl_setopt($request, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($request, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($request, CURLOPT_TIMEOUT, 10);

        if ($headers !== null) {
            curl_setopt($request, CURLOPT_HTTPHEADER, $headers);
        }

        # Call
        $result = curl_exec($request);
        $statusCode = curl_getinfo($request, CURLINFO_HTTP_CODE);

        // Closing connection!
        curl_close($request);

        return new Response($result, $statusCode);
    }
}