<?php
require_once 'config.php';

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    sendResponse(false, "Invalid request method.");
}

// CSRF Protection
$headers = getallheaders();
$csrf_token = $_POST['csrf_token'] ?? ''; // Expect token in body or header

if (!verifyCsrfToken($csrf_token)) {
    sendResponse(false, "Invalid CSRF token. Please refresh the page.");
}

// Input Sanitization
$firstname = filter_input(INPUT_POST, 'first-name', FILTER_SANITIZE_SPECIAL_CHARS);
$lastname = filter_input(INPUT_POST, 'last-name', FILTER_SANITIZE_SPECIAL_CHARS);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_SPECIAL_CHARS);
$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_SPECIAL_CHARS);

// Validation
if (!$firstname || !$email || !$subject || !$message) {
    sendResponse(false, "All required fields must be filled.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, "Invalid email format.");
}

// Database Connection Simulation (Prepared Statements)
/*
try {
    // $pdo = new PDO("mysql:host=localhost;dbname=tajawaz_db", "user", "password");
    // $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // $stmt = $pdo->prepare("INSERT INTO contacts (first_name, last_name, email, subject, message, created_at) VALUES (:fn, :ln, :em, :sb, :msg, NOW())");
    // $stmt->execute([
    //     ':fn' => $firstname,
    //     ':ln' => $lastname,
    //     ':em' => $email,
    //     ':sb' => $subject,
    //     ':msg' => $message
    // ]);
} catch (PDOException $e) {
    // Log error securely
    error_log("Database Error: " . $e->getMessage());
    sendResponse(false, "Internal server error. Please try again later.");
}
*/

// Email Sending
$to = "hello@markoagency.com"; // Configure this via env var in real production
$email_subject = "Contact Form: " . $subject;
$email_body = "You have received a new message from your website contact form.\n\n" .
    "Name: $firstname $lastname\n" .
    "Email: $email\n" .
    "Subject: $subject\n" .
    "Message:\n$message";

$headers = "From: noreply@tajawaz.my.id\r\n"; // Use a valid domain email
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($to, $email_subject, $email_body, $headers)) {
    sendResponse(true, "Message sent successfully!");
} else {
    // In production, log this error
    error_log("Mail sending failed for $email");
    sendResponse(false, "Failed to send message. Please try again later.");
}
?>
