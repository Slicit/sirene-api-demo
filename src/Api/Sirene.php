<?php

namespace Api;

use Curl\Request;
use Json\Response as JsonResponse;

/**
 * Class Sirene
 * @package Api
 */
class Sirene
{
    CONST ENDPOINT = 'https://entreprise.data.gouv.fr/api/sirene/v1';
    CONST FULLTEXT = '/full_text/%s';
    CONST SIRET = '/siret/%s';

    /**
     * @param string $fulltext
     * @param int $page
     * @param int $perPage
     * @return JsonResponse
     */
    public function search(string $fulltext, int $page = 1, int $perPage = 10): JsonResponse
    {
        try {
            $endpoint = self::ENDPOINT . sprintf(self::FULLTEXT, $this->filterInputs($fulltext));
            $results = Request::get($endpoint, [
                'page' => $page,
                'per_page' => $perPage
            ]);

            $payload = [
                'success' => true,
                'collection' => $results->getResult(true)
            ];
        } catch (\Exception $e) {
            $payload = [
                'error' => true,
                'message' => $e->getMessage()
            ];
        }

        return new JsonResponse($payload);
    }

    /**
     * @param string $siret
     * @return JsonResponse
     */
    public function show(string $siret): JsonResponse
    {
        try {
            $endpoint = self::ENDPOINT . sprintf(self::SIRET, $this->filterInputs($siret));
            $results = Request::get($endpoint);

            $payload = [
                'success' => true,
                'item' => $results->getResult(true)
            ];
        } catch (\Exception $e) {
            $payload = [
                'error' => true,
                'message' => $e->getMessage()
            ];
        }

        return new JsonResponse($payload);
    }

    /**
     * @param $fulltext
     * @return string
     */
    public function filterInputs($fulltext): string
    {
        return str_replace(' ', '-', trim($fulltext));
    }
}