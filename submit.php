<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

function respond($status, $message)
{
    http_response_code($status);
    echo json_encode(array('message' => $message), JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, 'Please submit the survey form.');
}

if (isset($_SERVER['CONTENT_LENGTH']) && (int) $_SERVER['CONTENT_LENGTH'] > 10000) {
    respond(413, 'Your response is too long. Please shorten it and try again.');
}

// Quietly ignore automated submissions that fill the hidden honeypot field.
if (!empty($_POST['website'])) {
    respond(200, 'Thank you. Your suggestion has been received.');
}

$allowedPriorities = array(
    'Roads and public transport',
    'Flooding, drainage and erosion',
    'Water and sanitation',
    'Electricity and energy',
    'Healthcare and emergency services',
    'Schools, skills and youth support',
    'Jobs, small businesses and cost of living',
    'Public safety and security',
    'Housing and urban renewal',
    'Waste collection and the environment',
    'Government services and accountability',
    'Other community need'
);
$allowedUrgencies = array(
    'Immediately / within 6 months',
    'Within the next year',
    'Important longer-term priority'
);

$priority = isset($_POST['priority']) ? trim((string) $_POST['priority']) : '';
$urgency = isset($_POST['urgency']) ? trim((string) $_POST['urgency']) : '';
$community = isset($_POST['community']) ? trim(strip_tags((string) $_POST['community'])) : '';
$intervention = isset($_POST['intervention']) ? trim(strip_tags((string) $_POST['intervention'])) : '';

if (!in_array($priority, $allowedPriorities, true)) {
    respond(422, 'Please choose a priority need from the list.');
}
if (!in_array($urgency, $allowedUrgencies, true)) {
    respond(422, 'Please choose when action is most needed.');
}
if ($community !== '' && strlen($community) > 500) {
    respond(422, 'Please shorten the community or area name.');
}
if ($intervention === '' || strlen($intervention) > 6000) {
    respond(422, 'Please add a suggestion of up to 1,200 characters.');
}

$community = str_replace(array("\r", "\n", "\0"), ' ', $community);
$intervention = str_replace("\0", '', $intervention);
$message = "New Lagos community priority suggestion\r\n\r\n";
$message .= "Priority need: {$priority}\r\n";
$message .= 'Community / LGA / LCDA: ' . ($community !== '' ? $community : 'Not specified') . "\r\n";
$message .= "Requested timeframe: {$urgency}\r\n\r\n";
$message .= "Suggested quick intervention:\r\n{$intervention}\r\n";
$message .= "\r\nSubmitted through VoteKOH.com.ng\r\n";

$headers = "From: VoteKOH Survey <info@votekoh.com.ng>\r\n";
$headers .= "Reply-To: info@votekoh.com.ng\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= 'X-Mailer: PHP/' . phpversion();

$sent = @mail('info@votekoh.com.ng', 'VoteKOH Lagos priorities survey', $message, $headers);
if (!$sent) {
    error_log('VoteKOH survey email could not be accepted by the mail transport.');
    respond(500, 'The email service could not accept your suggestion just now. Please try again later.');
}

respond(200, 'Thank you. Your suggestion has been sent.');
