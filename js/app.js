// js/app.js

/* ===== 1. Service Worker ===== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('SW registrado:', reg.scope))
      .catch((err) => console.error('Erro no SW:', err));
  });
}

/* ===== 2. Elementos da página ===== */
const form = document.getElementById('form-emoji');
const campoEmoji = document.getElementById('emoji');
const campoSignificado = document.getElementById('significado');
const botaoSalvar = document.getElementById('btn-salvar');
const botaoCancelar = document.getElementById('btn-cancelar');
const corpoTabela = document.getElementById('tabela-corpo');

/* ===== 3. Dados (guardados no navegador) ===== */
const CHAVE = 'morfosintaxe-itens';

function carregar() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
  } catch {
    return [];
  }
}

function salvar(itens) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(itens));
  } catch (err) {
    mostrarAviso('Não foi possível salvar no navegador.');
  }
}

let itens = carregar();
let idEmEdicao = null;

/* ===== 4. Avisos ===== */
const aviso = document.createElement('p');
aviso.className = 'aviso';
aviso.hidden = true;
form.prepend(aviso);

function mostrarAviso(texto, tipo = 'erro') {
  aviso.textContent = texto;
  aviso.dataset.tipo = tipo;
  aviso.hidden = false;
}

function limparAviso() {
  aviso.hidden = true;
  aviso.textContent = '';
}

/* ===== 5. Validação ===== */
function ehSoEmoji(texto) {
  const semEspacos = texto.replace(/\s/g, '');
  if (!semEspacos) return false;
  const letrasOuNumeros = /[\p{L}\p{N}]/u;
  return /\p{Extended_Pictographic}/u.test(semEspacos) && !letrasOuNumeros.test(semEspacos);
}

/* ===== 6. Desenhar a tabela ===== */
function renderizar() {
  corpoTabela.innerHTML = '';

  if (itens.length === 0) {
    const tr = document.createElement('tr');
    tr.className = 'vazio';
    const td = document.createElement('td');
    td.colSpan = 3;
    td.textContent = 'Nenhum emoji cadastrado ainda.';
    tr.appendChild(td);
    corpoTabela.appendChild(tr);
    return;
  }

  itens.forEach((item) => {
    const tr = document.createElement('tr');

    const tdEmoji = document.createElement('td');
    tdEmoji.textContent = item.emoji;

    const tdSignificado = document.createElement('td');
    tdSignificado.textContent = item.significado;

    const tdAcoes = document.createElement('td');

    const btnEditar = document.createElement('button');
    btnEditar.type = 'button';
    btnEditar.className = 'btn-editar';
    btnEditar.dataset.id = item.id;
    btnEditar.textContent = 'Editar';

    const btnExcluir = document.createElement('button');
    btnExcluir.type = 'button';
    btnExcluir.className = 'btn-excluir';
    btnExcluir.dataset.id = item.id;
    btnExcluir.textContent = 'Excluir';

    tdAcoes.append(btnEditar, ' ', btnExcluir);
    tr.append(tdEmoji, tdSignificado, tdAcoes);
    corpoTabela.appendChild(tr);
  });
}

/* ===== 7. Modo edição ===== */
function sairDaEdicao() {
  idEmEdicao = null;
  form.reset();
  botaoSalvar.textContent = 'Salvar';
  botaoCancelar.hidden = true;
}

botaoCancelar.addEventListener('click', () => {
  limparAviso();
  sairDaEdicao();
});

/* ===== 8. Enviar o formulário ===== */
form.addEventListener('submit', (e) => {
  e.preventDefault(); // não recarrega a página
  limparAviso();

  const emoji = campoEmoji.value.trim();
  const significado = campoSignificado.value.trim();

  if (!ehSoEmoji(emoji)) {
    mostrarAviso('Digite apenas emojis no campo "Emoji".');
    campoEmoji.focus();
    return;
  }

  if (significado.length < 2) {
    mostrarAviso('Digite o significado do emoji.');
    campoSignificado.focus();
    return;
  }

  if (idEmEdicao !== null) {
    // atualiza o item existente
    itens = itens.map((item) =>
      item.id === idEmEdicao ? { ...item, emoji, significado } : item
    );
    mostrarAviso('Item atualizado.', 'ok');
  } else {
    // adiciona um item novo no topo da lista
    itens.unshift({ id: Date.now(), emoji, significado });
    mostrarAviso('Item salvo.', 'ok');
  }

  salvar(itens);
  renderizar();
  sairDaEdicao();
  campoEmoji.focus();
  setTimeout(limparAviso, 2000);
});

limparAvisoAoDigitar();

function limparAvisoAoDigitar() {
  [campoEmoji, campoSignificado].forEach((campo) =>
    campo.addEventListener('input', limparAviso)
  );
}

/* ===== 9. Botões Editar e Excluir ===== */
corpoTabela.addEventListener('click', (e) => {
  const botao = e.target.closest('button');
  if (!botao) return;

  const id = Number(botao.dataset.id);
  const item = itens.find((i) => i.id === id);
  if (!item) return;

  if (botao.classList.contains('btn-editar')) {
    idEmEdicao = id;
    campoEmoji.value = item.emoji;
    campoSignificado.value = item.significado;
    botaoSalvar.textContent = 'Atualizar';
    botaoCancelar.hidden = false;
    limparAviso();
    campoEmoji.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (botao.classList.contains('btn-excluir')) {
    if (!confirm(`Excluir "${item.emoji}"?`)) return;
    itens = itens.filter((i) => i.id !== id);
    salvar(itens);
    if (idEmEdicao === id) sairDaEdicao();
    renderizar();
  }
});

/* ===== 10. Botão "Instalar app" ===== */
let eventoInstalacao = null;
const botaoInstalar = document.getElementById('btn-instalar');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  eventoInstalacao = e;
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

/* ===== 11. Início ===== */
renderizar();