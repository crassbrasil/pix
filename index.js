
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Doação via Pix</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 2rem; background: #f4f4f4; }
    .container { max-width: 600px; margin: auto; background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); text-align: center; }
    .btn { padding: 12px 24px; margin: 10px; font-size: 16px; border: none; border-radius: 6px; background-color: #4CAF50; color: white; cursor: pointer; }
    .btn:hover { background-color: #45a049; }
    #modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); align-items: center; justify-content: center; }
    .modal-content { background: white; padding: 2rem; border-radius: 10px; text-align: center; }
    #qrcode { margin: 20px 0; }
    .hidden { display: none; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Contribua com uma doação</h1>
    <p>Escolha um valor:</p>
    <div id="buttons">
      <button class="btn" data-amount="30">R$30</button>
      <button class="btn" data-amount="50">R$50</button>
      <button class="btn" data-amount="100">R$100</button>
      <button class="btn" data-amount="150">R$150</button>
      <button class="btn" data-amount="200">R$200</button>
      <button class="btn" data-amount="250">R$250</button>
      <button class="btn" data-amount="350">R$350</button>
      <button class="btn" data-amount="400">R$400</button>
      <button class="btn" data-amount="600">R$600</button>
      <button class="btn" data-amount="800">R$800</button>
      <button class="btn" data-amount="1000">R$1000</button>
    </div>
  </div>

  <div id="modal">
    <div class="modal-content">
      <h2>Gerando Pix...</h2>
      <div id="loading">Aguarde...</div>
      <div id="pix-info" class="hidden">
        <p><strong>Copie e cole o código Pix:</strong></p>
        <textarea id="pix-code" rows="3" style="width:100%"></textarea>
        <button class="btn" onclick="copyPix()">Copiar</button>
        <div id="qrcode"></div>
      </div>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <script>
    const buttons = document.querySelectorAll('.btn');
    const modal = document.getElementById('modal');
    const loading = document.getElementById('loading');
    const pixInfo = document.getElementById('pix-info');
    const pixCode = document.getElementById('pix-code');
    const qrcodeDiv = document.getElementById('qrcode');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const amount = btn.getAttribute('data-amount');
        showModal();
        fetch('/api/pix.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: amount })
        })
        .then(res => res.json())
        .then(data => {
          if (data && data.pix) {
            pixCode.value = data.pix;
            qrcodeDiv.innerHTML = "";
            new QRCode(qrcodeDiv, data.pix);
            showPixInfo();
          } else {
            loading.innerText = "Erro ao gerar Pix.";
          }
        });
      });
    });

    function showModal() {
      modal.style.display = 'flex';
      loading.style.display = 'block';
      pixInfo.classList.add('hidden');
    }

    function showPixInfo() {
      loading.style.display = 'none';
      pixInfo.classList.remove('hidden');
    }

    function copyPix() {
      pixCode.select();
      document.execCommand("copy");
    }
  </script>
</body>
</html>
