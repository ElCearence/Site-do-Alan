let contrasteAtivo = false;
let leituraAtiva = false;
let fonteAtual = 16;
let librasAtivo = false;

function alterarFonte(incremento) {
  fonteAtual += incremento;
  document.documentElement.style.setProperty('--fonte-base', fonteAtual + 'px');
}

function resetarFonte() {
  fonteAtual = 16;
  document.documentElement.style.setProperty('--fonte-base', fonteAtual + 'px');
  document.body.style.lineHeight = '1.6';
}

function alternarContraste() {
  contrasteAtivo = !contrasteAtivo;
  document.body.classList.toggle("alto-contraste", contrasteAtivo);
}

function alternarLeitura() {
  if (!leituraAtiva) {
    const msg = new SpeechSynthesisUtterance(document.querySelector('main').innerText);
    speechSynthesis.speak(msg);
    leituraAtiva = true;
    msg.onend = () => leituraAtiva = false;
  } else {
    speechSynthesis.cancel();
    leituraAtiva = false;
  }
}

function modoIdoso() {
  alterarFonte(4);
  document.body.style.lineHeight = '2';
}

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
    default:
      root.style.setProperty('--cor-primaria', '#0055aa');
      root.style.setProperty('--cor-secundaria', '#ffaa00');
      root.style.setProperty('--cor-destaque', '#dd3333');
  }
}

function alternarLibras() {
  librasAtivo = !librasAtivo;
  const container = document.getElementById('libras-container');
  container.classList.toggle('oculto', !librasAtivo);
}

async function fazerLogoff() {
  const userId = localStorage.getItem('userId'); // Assume que o ID do usuário está no localStorage

  if (userId) {
    console.log('ID de usuário encontrado:', userId, '. Tentando fazer logoff via POST...');
    try {
      // Substitua '/api/logoff' pela URL real do seu endpoint de backend
      const response = await fetch('https://alan.gabiru-server.site/logout', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Envia o ID do usuário no corpo da requisição
        body: JSON.stringify({ userId: userId }) 
      });

      if (response.ok) {
        console.log('Logoff via POST bem-sucedido.');
        // Redireciona após o sucesso do POST
        // Substitua 'menu.html' pela URL de destino desejada
        window.location.href = "menu.html"; 
      } else {
        console.error('Falha na requisição POST de logoff:', response.status, response.statusText);
        // Decide o que fazer em caso de falha no POST.
        // Por enquanto, redireciona mesmo assim, mas pode ser alterado.
        // alert('Houve um problema ao registrar o logoff, mas você será redirecionado.'); // Opcional
        // Substitua 'menu.html' pela URL de destino desejada
        window.location.href = "menu.html"; 
      }

      // pinto
    } catch (error) {
      console.error('Erro ao tentar fazer a requisição POST de logoff:', error);
      // Decide o que fazer em caso de erro de rede/fetch.
      // Por enquanto, redireciona mesmo assim.
      // alert('Erro de conexão ao tentar registrar o logoff, mas você será redirecionado.'); // Opcional
      // Substitua 'menu.html' pela URL de destino desejada
      window.location.href = "menu.html"; 
    }
  } else {
    console.log('Nenhum ID de usuário encontrado. Redirecionando diretamente.');
    // Se não houver ID de usuário, redireciona diretamente
    // Substitua 'menu.html' pela URL de destino desejada
    window.location.href = "menu.html"; 
  }
}

