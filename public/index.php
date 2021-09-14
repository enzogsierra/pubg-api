<?php
require_once __DIR__ . "/../include.php";

use MVC\Router;
use Controllers\PublicController;

$router = new Router();
$router->get("/", [PublicController::class, "index"]);
$router->post("/", [PublicController::class, "index"]);
$router->get("/user", [PublicController::class, "user"]);
$router->get("/match", [PublicController::class, "match"]);
$router->checkRoutes();