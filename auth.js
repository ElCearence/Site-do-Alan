// URL base do seu backend Flask
const API_BASE_URL = 'https://alan.gabiru-server.site';

// --- Funções de Navegação ---

/**
 * Navega para um caminho de arquivo HTML especificado.
 * @param {string} filePath - O caminho do arquivo HTML (ex: 'login.html', 'home.html').
 */
function navigateTo(filePath) {
    console.log(`Navegando para: ${filePath}`);
    window.location.href = filePath;
}

// --- Lógica de Autenticação para Registro ---

/**
 * Lida com o envio do formulário de registro.
 * Envia os dados do usuário para o backend Flask.
 * @param {Event} e - O evento de envio do formulário.
 */
async function handleRegisterSubmit(e) {
    e.preventDefault(); // Impede o recarregamento padrão da página
    console.log('handleRegisterSubmit chamado.');

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const messageElement = document.getElementById('register-message');

    messageElement.textContent = ''; // Limpa mensagens anteriores
    messageElement.style.color = ''; // Reseta a cor

    if (password !== confirmPassword) {
        messageElement.textContent = 'As senhas não coincidem!';
        messageElement.style.color = 'red';
        console.warn('Senhas não coincidem.');
        return;
    }

    try {
        console.log('Enviando requisição de registro para:', `${API_BASE_URL}/registrar`);
        const response = await fetch(`${API_BASE_URL}/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome: name, email: email, senha: password }),
        });

        const data = await response.json();
        console.log('Resposta do backend (registro):', data);

        if (response.ok) {
            messageElement.textContent = data.message;
            messageElement.style.color = 'green';
            document.getElementById('register-form').reset();
            setTimeout(() => {
                navigateTo('login.html');
            }, 1500);
        } else {
            messageElement.textContent = data.error || data.erro || 'Erro ao registrar usuário.';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Erro de rede ou no servidor (registro):', error);
        messageElement.textContent = 'Erro de conexão com o servidor. Tente novamente mais tarde.';
        messageElement.style.color = 'red';
    }
}

// --- Lógica de Autenticação para Login ---

/**
 * Lida com o envio do formulário de login.
 * Envia as credenciais do usuário para o backend Flask.
 * @param {Event} e - O evento de envio do formulário.
 */
async function handleLoginSubmit(e) {
    e.preventDefault(); // Impede o recarregamento padrão da página
    console.log('handleLoginSubmit chamado.');

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const messageElement = document.getElementById('login-message');

    messageElement.textContent = ''; // Limpa mensagens anteriores
    messageElement.style.color = ''; // Reseta a cor

    console.log('Tentando login com:', { email, password });

    try {
        console.log('Enviando requisição de login para:', `${API_BASE_URL}/login`);
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Importante: para enviar cookies de sessão
            body: JSON.stringify({ email: email, senha: password }),
        });

        const data = await response.json();
        console.log('Resposta do backend (login):', response.status, data);

        if (response.ok) {
            messageElement.textContent = data.message;
            messageElement.style.color = 'green';
            sessionStorage.setItem('isLoggedIn', 'true'); // Armazena o estado de login
            console.log('Login bem-sucedido. sessionStorage.isLoggedIn definido como true.');
            document.getElementById('login-form').reset();
            setTimeout(() => {
                navigateTo('index.html'); // Redireciona para a nova página principal (index.html)
            }, 1000);
        } else {
            messageElement.textContent = data.error || 'Credenciais inválidas.';
            messageElement.style.color = 'red';
            console.error('Falha no login:', data.error || 'Erro desconhecido.');
        }
    } catch (error) {
        console.error('Erro de rede ou no servidor (login):', error);
        messageElement.textContent = 'Erro de conexão com o servidor. Tente novamente mais tarde.';
        messageElement.style.color = 'red';
    }
}


// --- Funções de Acessibilidade ---

let contrasteAtivo = false;
let leituraAtiva = false;
let fonteAtual = 16; // Inicializado com o valor padrão do CSS
let librasAtivo = false;

/**
 * Altera o tamanho da fonte da página.
 * @param {number} incremento - Valor a ser adicionado (positivo para aumentar, negativo para diminuir).
 */
function alterarFonte(incremento) {
  fonteAtual += incremento;
  document.documentElement.style.setProperty('--fonte-base', fonteAtual + 'px');
  console.log('Tamanho da fonte alterado para:', fonteAtual);
}

/**
 * Reseta o tamanho da fonte e o espaçamento da linha para os valores padrão.
 */
function resetarFonte() {
  fonteAtual = 16; // Volta ao tamanho padrão
  document.documentElement.style.setProperty('--fonte-base', fonteAtual + 'px');
  document.body.style.lineHeight = '1.6'; // Volta ao line-height padrão
  console.log('Fonte resetada para padrão.');
}

/**
 * Alterna o modo de alto contraste da página.
 */
function alternarContraste() {
  contrasteAtivo = !contrasteAtivo;
  document.body.classList.toggle("alto-contraste", contrasteAtivo);
  console.log('Alto contraste:', contrasteAtivo ? 'Ativo' : 'Inativo');
}

/**
 * Inicia ou para a leitura em voz alta do conteúdo principal da página.
 */
function alternarLeitura() {
  if (!leituraAtiva) {
    const mainContent = document.querySelector('main');
    if (mainContent) {
        const msg = new SpeechSynthesisUtterance(mainContent.innerText);
        speechSynthesis.speak(msg);
        leituraAtiva = true;
        msg.onend = () => leituraAtiva = false;
        console.log('Leitura em voz alta iniciada.');
    } else {
        console.warn('Conteúdo principal para leitura não encontrado (tag <main>).');
    }
  } else {
    speechSynthesis.cancel();
    leituraAtiva = false;
    console.log('Leitura em voz alta parada.');
  }
}

/**
 * Ativa o "Modo Idoso", que aumenta a fonte e o espaçamento da linha.
 */
function modoIdoso() {
  alterarFonte(4); // Aumenta a fonte em 4px
  document.body.style.lineHeight = '2'; // Aumenta o espaçamento da linha
  console.log('Modo Idoso ativado.');
}

/**
 * Aplica um filtro de daltonismo alterando as variáveis CSS de cor.
 * @param {string} tipo - O tipo de daltonismo ('protanopia', 'deuteranopia', 'tritanopia', 'none').
 */
function aplicarFiltro(tipo) {
  const root = document.documentElement;
  switch (tipo) {
    case 'protanopia':
      root.style.setProperty('--cor-primaria', '#666');
      root.style.setProperty('--cor-secundaria', '#ccc');
      root.style.setProperty('--cor-destaque', '#999');
      break;
    case 'deuteranopia':
      root.style.setProperty('--cor-primaria', '#0033aa');
      root.style.setProperty('--cor-secundaria', '#ffaa33');
      root.style.setProperty('--cor-destaque', '#dd7733');
      break;
    case 'tritanopia':
      root.style.setProperty('--cor-primaria', '#880088');
      root.style.setProperty('--cor-secundaria', '#55aa55');
      root.style.setProperty('--cor-destaque', '#ffaa00');
      break;
    default: // Volta às cores padrão
      root.style.setProperty('--cor-primaria', '#0055aa');
      root.style.setProperty('--cor-secundaria', '#ffaa00');
      root.style.setProperty('--cor-destaque', '#dd3333');
  }
  console.log('Filtro de daltonismo aplicado:', tipo);
}

/**
 * Alterna a visibilidade do container VLibras.
 */
function alternarLibras() {
  librasAtivo = !librasAtivo;
  const container = document.getElementById('libras-container');
  container.classList.toggle('oculto', !librasAtivo);

  // Adiciona o iframe VLibras apenas se estiver ativado e ainda não existir
  if (librasAtivo && !container.querySelector('iframe')) {
      const iframe = document.createElement('iframe');
      // CORRIGIDO: Usando HTTPS para o VLibras
      iframe.src = "https://www.vlibras.gov.br/app";
      iframe.width = "100%";
      iframe.height = "400";
      iframe.title = "VLibras Plugin";
      container.appendChild(iframe);
      console.log('VLibras iframe adicionado.');
  } else if (!librasAtivo && container.querySelector('iframe')) {
      // Opcional: remover o iframe quando desativado para liberar recursos
      // container.removeChild(container.querySelector('iframe'));
      console.log('VLibras desativado.');
  }
}

// --- Lógica de Logoff ---

/**
 * Realiza o processo de logoff do usuário.
 * Envia uma requisição POST para o backend e limpa o estado de login no frontend.
 */
async function fazerLogoff() {
  console.log('Tentando fazer logoff...');
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Importante para enviar o cookie de sessão
    });

    if (response.ok) {
      console.log('Logoff bem-sucedido no backend.');
    } else {
      console.error('Falha na requisição de logoff:', response.status, response.statusText);
      const errorData = await response.json();
      console.error('Mensagem de erro do backend:', errorData.error || errorData.message);
    }
  } catch (error) {
    console.error('Erro ao tentar fazer a requisição de logoff:', error);
  } finally {
    sessionStorage.removeItem('isLoggedIn');
    console.log('sessionStorage.isLoggedIn removido. Redirecionando para login.html.');
    navigateTo('login.html'); // Redireciona para a página de login
  }
}


// --- Inicialização e Lógica de Proteção de Rota ---

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM completamente carregado. Iniciando script auth.js.');

    const path = window.location.pathname; // Obtém o caminho atual da URL

    // Lógica de proteção para a página principal (index.html)
    if (path.endsWith('/') || path.endsWith('/index.html')) {
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
            console.log('Usuário não logado. Redirecionando para login.html.');
            navigateTo('login.html');
            return; // Impede que o restante do script seja executado para esta página
        } else {
            console.log('Usuário logado. Permanecendo em index.html.');
            // Se o usuário está logado e está em index.html, pode carregar conteúdo protegido
            // Exemplo: mostrar o ID do usuário logado (se disponível no backend)
            // fetchUserData(); // Você precisaria de uma função para isso
        }
    }
    // Lógica de proteção para a página de login (login.html)
    else if (path.endsWith('/login.html')) {
        if (sessionStorage.getItem('isLoggedIn') === 'true') {
            console.log('Usuário já logado. Redirecionando para index.html.');
            navigateTo('index.html');
            return;
        }
    }
    // Lógica de proteção para a página de registro (register.html)
    else if (path.endsWith('/register.html')) {
        if (sessionStorage.getItem('isLoggedIn') === 'true') {
            console.log('Usuário já logado. Redirecionando para index.html.');
            navigateTo('index.html');
            return;
        }
    }
    // Lógica de proteção para a página site.html (se for uma página de conteúdo protegida)
    else if (path.endsWith('/site.html')) {
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
            console.log('Usuário não logado. Redirecionando para login.html.');
            navigateTo('login.html');
            return;
        }
    }


    // Adiciona o listener de evento ao formulário de registro (se existir na página)
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
        console.log('Listener de submit para formulário de registro anexado.');
    } else {
        console.log('Formulário de registro (id="register-form") não encontrado nesta página.');
    }

    // Adiciona o listener de evento ao formulário de login (se existir na página)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
        console.log('Listener de submit para formulário de login anexado.');
    } else {
        console.log('Formulário de login (id="login-form") não encontrado nesta página.');
    }

    // Expondo as funções globalmente para que possam ser chamadas do HTML
    window.alterarFonte = alterarFonte;
    window.resetarFonte = resetarFonte;
    window.alternarContraste = alternarContraste;
    window.alternarLeitura = alternarLeitura;
    window.modoIdoso = modoIdoso;
    window.aplicarFiltro = aplicarFiltro;
    window.alternarLibras = alternarLibras;
    window.navigateTo = navigateTo;
    window.fazerLogoff = fazerLogoff;
    console.log('Funções de acessibilidade e navegação expostas globalmente.');
});
