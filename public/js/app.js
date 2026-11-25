if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => console.log('SW registrado:', registration.scope))
      .catch((error) => console.error('Erro no SW:', error));
  });
}

let eventoInstalacao = null;
const botaoInstalar = document.getElementById('btn-instalar');

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  eventoInstalacao = event;
  if (botaoInstalar) botaoInstalar.hidden = false;
});

if (botaoInstalar) {
  botaoInstalar.addEventListener('click', async () => {
    if (!eventoInstalacao) return;
    eventoInstalacao.prompt();
    await eventoInstalacao.userChoice;
    eventoInstalacao = null;
    botaoInstalar.hidden = true;
  });
}

window.addEventListener('appinstalled', () => {
  if (botaoInstalar) botaoInstalar.hidden = true;
});
