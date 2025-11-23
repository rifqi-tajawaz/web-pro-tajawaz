<?php
require_once 'config.php';

$token = generateCsrfToken();

sendResponse(true, "Token generated", ['csrf_token' => $token]);
?>
