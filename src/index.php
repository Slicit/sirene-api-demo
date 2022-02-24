<?php

require_once __DIR__ . '/Api/Router.php';
require_once __DIR__ . '/Api/Sirene.php';
require_once __DIR__ . '/Curl/Request.php';
require_once __DIR__ . '/Curl/Response.php';
require_once __DIR__ . '/Json/Response.php';

use Api\Router;
use Api\Sirene;

try {
    (new Router([
        [
            'pattern' => '#^\/search\/(.*)$#',
            'class' => Sirene::class,
            'method' => 'search'
        ],
        [
            'pattern' => '#^\/show\/(.*)$#',
            'class' => Sirene::class,
            'method' => 'show'
        ]
    ]))->listen();
} catch (\Exception $e) {
    // Oups something went bad at least!
    die('it\'s over!');
}