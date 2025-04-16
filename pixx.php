<?php
header('Content-Type: application/json'); // Define o tipo de resposta como JSON

// Defina as credenciais da sua API Nexus Tech
$publicKey = 'pk_live_FUF01RbBgi0V4BXctjUyLEcqFIDs3d';
$privateKey = 'sk_live_n2DcGrRa4ZpxPmtf3QAHszDhCeT2iYj6J7rs6LwawK';

// Endpoint da API Nexus Tech (o URL exato pode variar conforme a documentação)
$nexusApiUrl = 'https://api.nexustech.com.br/pix';

// Verifica se a requisição é POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Obtém os dados enviados (ex: valor do Pix)
    $input = json_decode(file_get_contents('php://input'), true);
    $amount = $input['amount'] ?? 0;

    if ($amount <= 0) {
        echo json_encode(['error' => 'Valor inválido para o Pix.']);
        exit;
    }

    // Dados a serem enviados para a API do Nexus Tech
    $data = [
        'amount' => $amount,
        'publicKey' => $publicKey,
    ];

    // Inicializa a requisição cURL para a API do Nexus Tech
    $ch = curl_init($nexusApiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $privateKey, // Usando a chave secreta como token
    ]);

    // Executa a requisição e obtém a resposta
    $response = curl_exec($ch);

    // Verifica erros na requisição
    if(curl_errno($ch)) {
        echo json_encode(['error' => 'Erro na requisição: ' . curl_error($ch)]);
        exit;
    }

    // Fecha a conexão cURL
    curl_close($ch);

    // Retorna a resposta da API do Nexus Tech
    echo $response;
} else {
    // Caso não seja uma requisição POST
    echo json_encode(['error' => 'Método HTTP inválido. Utilize POST.']);
}
?>
