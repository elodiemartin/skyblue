<?php
require_once 'vendor/autoload.php';

$router = new AltoRouter();

/**Création des routes */

$router->map('GET', '/', ['c' => 'HomeController', 'a' => 'index']);
$router->map('GET', '/json', ['c' => 'HomeController', 'a' => 'apiJSON']);

$match = $router->match();

if($match == false){
    $controller = 'App\\Controller\\HomeController';
    $action = 'error';
    $params = [];
}else {
    $controller = 'App\\Controller\\'.$match['target']['c'];
    $action = $match['target']['a'];
    $params = $match['params'];
}

$object = new $controller();
$print = $object->{$action}($params);

echo($print);
?>