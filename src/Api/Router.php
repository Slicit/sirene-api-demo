<?php

namespace Api;

use Json\Response as JsonResponse;

/**
 * Class Router
 * @package Api
 */
class Router
{
    /**
     * @var array
     */
    protected $routes;

    /**
     * Router constructor.
     * @param $routes
     */
    public function __construct($routes)
    {
        $this->routes = $routes;
    }

    public function listen()
    {
        try {
            $currentPath = $_SERVER['PATH_INFO'];

            foreach ($this->routes as $route) {
                // If we find a matching route, then we should get a JsonResponse
                if (preg_match($route['pattern'], $currentPath, $matches) === 1) {

                    $page = (int) ($_GET['page'] ?? 1);
                    $perPage = (int) ($_GET['per_page'] ?? 10);

                    $reflectedClass = new \ReflectionClass($route['class']);
                    $reflectedClass->getMethod($route['method'])->invokeArgs((new $route['class']()), [
                        $matches[1],
                        $page,
                        $perPage
                    ]);
                }
            }

            // Otherwise it's dead end, we can stop!
            throw new \Exception('Unknown route.');
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => true,
                'message' => $e->getMessage()
            ]);
        }
    }
}