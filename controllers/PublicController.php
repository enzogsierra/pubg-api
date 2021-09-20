<?php

namespace Controllers;
use MVC\Router;

class PublicController
{
    public static function index(Router $router)
    {
        $player = $_POST["id"] ?? "";

        if($_SERVER["REQUEST_METHOD"] === "POST")
        {
            header("Location: /user?id=${player}");
        }

        $router->render("public/index", 
        [
            "player" => $player,
            "response" => $_GET["response"] ?? ""
        ]);
    }

    public static function user(Router $router)
    {
        $player = $_GET["id"] ?? "";
        if(!preg_match('/^[a-zA-Z0-9-_]{3,16}+$/', $player)) // Invalid pubg nick
        {
            header("Location: /?response=1");
        }

        $router->render("public/user", 
        [
            "player" => $player
        ]);
    }

    public static function match(Router $router)
    {
        $router->render("public/match", 
        [
            "match" => $_GET["id"] ?? ""
        ]);
    }
}
