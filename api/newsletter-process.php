<?php
require_once 'config.php';

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendResponse(false, "Invalid request method.");
}

// CSRF Protection
$csrf_token = $_POST['csrf_token'] ?? '';

if (!verifyCsrfToken($csrf_token)) {
    sendResponse(false, "Invalid CSRF token. Please refresh the page.");
}

// Input Sanitization
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);

// Validation
if (!$email) {
    sendResponse(false, "Email is required.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, "Invalid email format.");
}

// Database Connection Simulation (Prepared Statements for Newsletter)
/*
try {
    // $pdo = new PDO("mysql:host=localhost;dbname=tajawaz_db", "user", "password");
    // $stmt = $pdo->prepare("INSERT INTO subscribers (email, subscribed_at) VALUES (:email, NOW())");
    // $stmt->execute([':email' => $email]);
} catch (PDOException $e) {
    error_log("DB Error: " . $e->getMessage());
    sendResponse(false, "Internal error.");
}
*/

// Email Notification (Optional)
$to = "hello@markoagency.com";
$subject = "New Newsletter Subscription";
$message = "New subscriber: $email";
$headers = "From: noreply@tajawaz.my.id\r\n";
$headers .= "Reply-To: $email\r\n";

// We don't necessarily need to fail if the admin notification fails, but for now we'll return success
mail($to, $subject, $message, $headers);

sendResponse(true, "Thank you for subscribing!");
?>
