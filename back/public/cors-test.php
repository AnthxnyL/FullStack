<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 3600");

// Si c'est une requête OPTIONS préliminaire, on s'arrête ici
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Pour une requête GET ou POST, renvoyer un message
$response = [
    'message' => 'Connexion CORS réussie!',
    'method' => $_SERVER['REQUEST_METHOD'],
    'timestamp' => date('Y-m-d H:i:s'),
    'headers' => getallheaders(),
    'request' => $_REQUEST,
];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $response['files'] = $_FILES;
    $response['post'] = $_POST;
}

echo json_encode($response);
