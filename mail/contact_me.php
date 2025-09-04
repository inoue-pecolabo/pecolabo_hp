<?php
// セキュリティヘッダーの設定
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// CSRFトークンの検証
session_start();
if (!isset($_POST['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    http_response_code(403);
    echo json_encode(['error' => 'CSRF token mismatch']);
    exit;
}

// レート制限の実装（簡易版）
$ip = $_SERVER['REMOTE_ADDR'];
$rate_limit_file = sys_get_temp_dir() . '/contact_rate_' . md5($ip);
$current_time = time();
$rate_limit_window = 300; // 5分間
$max_requests = 3; // 5分間に3回まで

if (file_exists($rate_limit_file)) {
    $data = json_decode(file_get_contents($rate_limit_file), true);
    if ($data && $current_time - $data['first_request'] < $rate_limit_window) {
        if ($data['count'] >= $max_requests) {
            http_response_code(429);
            echo json_encode(['error' => 'Too many requests. Please try again later.']);
            exit;
        }
        $data['count']++;
    } else {
        $data = ['first_request' => $current_time, 'count' => 1];
    }
} else {
    $data = ['first_request' => $current_time, 'count' => 1];
}
file_put_contents($rate_limit_file, json_encode($data));

// 入力値の検証とサニタイズ
function validateInput($data, $type = 'string', $max_length = 1000) {
    if (empty($data)) {
        return false;
    }
    
    $data = trim($data);
    if (strlen($data) > $max_length) {
        return false;
    }
    
    switch ($type) {
        case 'email':
            return filter_var($data, FILTER_VALIDATE_EMAIL);
        case 'phone':
            return preg_match('/^[\d\-\+\(\)\s]+$/', $data);
        case 'name':
            return preg_match('/^[a-zA-Z0-9\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+$/', $data);
        default:
            return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    }
}

// 必須フィールドの検証
$name = validateInput($_POST['name'] ?? '', 'name', 100);
$email = validateInput($_POST['email'] ?? '', 'email', 255);
$phone = validateInput($_POST['phone'] ?? '', 'phone', 20);
$message = validateInput($_POST['message'] ?? '', 'string', 2000);

if (!$name || !$email || !$phone || !$message) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input data']);
    exit;
}

// メール送信の設定（環境変数から取得）
$to_email = $_ENV['CONTACT_EMAIL'] ?? 'puokoi@gmail.com';
$from_email = $_ENV['FROM_EMAIL'] ?? 'noreply@pecolabo.com';

// メール送信の実装
$subject = "PecoLabo お問い合わせ: " . $name;
$body = "PecoLaboウェブサイトから新しいお問い合わせがありました。\n\n";
$body .= "詳細:\n";
$body .= "お名前: " . $name . "\n";
$body .= "メールアドレス: " . $email . "\n";
$body .= "電話番号: " . $phone . "\n";
$body .= "お問い合わせ内容:\n" . $message . "\n";
$body .= "\n送信日時: " . date('Y-m-d H:i:s') . "\n";
$body .= "送信者IP: " . $_SERVER['REMOTE_ADDR'] . "\n";

// メールヘッダーの設定
$headers = [
    'From: ' . $from_email,
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit'
];

// メール送信
$success = mail($to_email, $subject, $body, implode("\r\n", $headers));

if ($success) {
    // ログの記録
    error_log("Contact form submitted successfully from: " . $email);
    echo json_encode(['success' => true, 'message' => 'お問い合わせありがとうございます。']);
} else {
    error_log("Contact form submission failed from: " . $email);
    http_response_code(500);
    echo json_encode(['error' => 'メール送信に失敗しました。しばらく時間をおいて再度お試しください。']);
}
?>
