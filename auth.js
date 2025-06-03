// URL base do seu backend Flask
const API_BASE_URL = 'https://alan.gabiru-server.site';

// --- Funções de Navegação ---

/**
 * Navega para um caminho de arquivo HTML especificado.
 * @param {string} filePath - O caminho do arquivo HTML (ex: 'login.html', 'home.html').
 */
function navigateTo(filePath) {
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

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    // O backend Flask fornecido não usa 'username', apenas 'nome' e 'email'
    // const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const messageElement = document.getElementById('register-message');

    messageElement.textContent = ''; // Limpa mensagens anteriores
    messageElement.style.color = ''; // Reseta a cor

    if (password !== confirmPassword) {
        messageElement.textContent = 'As senhas não coincidem!';
        messageElement.style.color = 'red';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome: name, email: email, senha: password }),
        });

        const data = await response.json();

        if (response.ok) {
            messageElement.textContent = data.message;
            messageElement.style.color = 'green';
            // Limpa o formulário após o registro bem-sucedido
            document.getElementById('register-form').reset();
            // Redireciona para a página de login após um pequeno atraso
            setTimeout(() => {
                navigateTo('login.html');
            }, 1500);
        } else {
            messageElement.textContent = data.error || data.erro || 'Erro ao registrar usuário.';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Erro de rede ou no servidor:', error);
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

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const messageElement = document.getElementById('login-message');

    messageElement.textContent = ''; // Limpa mensagens anteriores
    messageElement.style.color = ''; // Reseta a cor

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Importante: para enviar cookies de sessão
            body: JSON.stringify({ email: email, senha: password }),
        });

        const data = await response.json();

        if (response.ok) {
            messageElement.textContent = data.message;
            messageElement.style.color = 'green';
            sessionStorage.setItem('isLoggedIn', 'true'); // Armazena o estado de login
            // Limpa o formulário
            document.getElementById('login-form').reset();
            // Redireciona para a página principal (menu.html) após um pequeno atraso
            setTimeout(() => {
                navigateTo('menu.html'); // Redireciona para menu.html
            }, 1000);
        } else {
            messageElement.textContent = data.error || 'Credenciais inválidas.';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Erro de rede ou no servidor:', error);
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
}

/**
 * Reseta o tamanho da fonte e o espaçamento da linha para os valores padrão.
 */
function resetarFonte() {
  fonteAtual = 16; // Volta ao tamanho padrão
  document.documentElement.style.setProperty('--fonte-base', fonteAtual + 'px');
  document.body.style.lineHeight = '1.6'; // Volta ao line-height padrão
}

/**
 * Alterna o modo de alto contraste da página.
 */
function alternarContraste() {
  contrasteAtivo = !contrasteAtivo;
  document.body.classList.toggle("alto-contraste", contrasteAtivo);
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
    } else {
        console.warn('Conteúdo principal para leitura não encontrado (tag <main>).');
    }
  } else {
    speechSynthesis.cancel();
    leituraAtiva = false;
  }
}

/**
 * Ativa o "Modo Idoso", que aumenta a fonte e o espaçamento da linha.
 */
function modoIdoso() {
  alterarFonte(4); // Aumenta a fonte em 4px
  document.body.style.lineHeight = '2'; // Aumenta o espaçamento da linha
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
      iframe.src = "https://www.vlibras.gov.br/app";
      iframe.width = "100%";
      iframe.height = "400";
      iframe.title = "VLibras Plugin";
      container.appendChild(iframe);
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
    // O endpoint de logout do Flask não espera um body, apenas o cookie de sessão.
    // 'credentials: include' é crucial para enviar o cookie.
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
      // Opcional: Logar o erro do backend se houver
      const errorData = await response.json();
      console.error('Mensagem de erro do backend:', errorData.error || errorData.message);
    }
  } catch (error) {
    console.error('Erro ao tentar fazer a requisição de logoff:', error);
  } finally {
    // Sempre limpa o estado de login no frontend e redireciona,
    // independentemente do sucesso da requisição ao backend,
    // para garantir que o usuário não permaneça "logado" no frontend.
    sessionStorage.removeItem('isLoggedIn');
    navigateTo('login.html'); // Redireciona para a página de login
  }
}


// --- Inicialização ---

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se o usuário já está logado ao carregar a página de login
    // Se sim, redireciona para a página principal (menu.html)
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        navigateTo('menu.html'); // Redireciona para menu.html
        return; // Impede que o restante do script seja executado
    }

    // Adiciona o listener de evento ao formulário de registro (se existir na página)
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }

    // Adiciona o listener de evento ao formulário de login (se existir na página)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
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
    window.fazerLogoff = fazerLogoff; // Expondo a função de logoff
});
