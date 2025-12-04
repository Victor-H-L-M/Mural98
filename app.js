console.log('APP.JS CARREGADO');

const formUsuario = document.getElementById('form-usuario');
const formRecado = document.getElementById('form-recado');
const listaRecados = document.getElementById('lista-recados');

const API_URL = 'http://localhost:4000';


formUsuario.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nomeUsuario').value;

  try {
    const res = await fetch(`${API_URL}/usuario_id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nome })
    });

    if (!res.ok) {
      throw new Error('Erro ao cadastrar usuário');
    }

    alert('Usuário cadastrado com sucesso!');
    formUsuario.reset();

  } catch (err) {
    console.error(err);
    alert('Erro ao cadastrar usuário');
  }
});


async function carregarRecados() {
  try {
    const res = await fetch(`${API_URL}/recados`);
    const dados = await res.json();

    listaRecados.innerHTML = '';

dados.forEach(recado => {
  const li = document.createElement('li');

  let nomeUsuario = 'Usuário';

  if (recado.usuario_id && recado.usuario_id.length > 0) {
    nomeUsuario = recado.usuario_id[0].nome;
  }

  li.textContent = `${nomeUsuario}: ${recado.mensagem}`;
  listaRecados.appendChild(li);
});

  } catch (err) {
    console.error('Erro ao carregar recados:', err);
  }
}

formRecado.addEventListener('submit', async (e) => {
  e.preventDefault();

  const mensagem = document.getElementById('mensagem').value;
  const usuario_id = document.getElementById('usuarioId').value;

  try {
    const res = await fetch(`${API_URL}/recados`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mensagem,
        usuario_id
      })
    });

    if (!res.ok) {
      throw new Error('Erro ao enviar recado');
    }

    formRecado.reset();
    carregarRecados();

  } catch (err) {
    console.error(err);
    alert('Erro ao enviar recado');
  }
});

async function carregarRecados() {
    console.log('CARREGAR RECADOS CHAMADO');
  try {
    const res = await fetch(`${API_URL}/recados`);
    const dados = await res.json();

  console.log(dados);

    listaRecados.innerHTML = '';

    dados.forEach(recado => {
      const li = document.createElement('li');

      let nomeUsuario = 'Usuário';

      // Fix: Check if usuario_id is an object with a nome property
      if (recado.usuario_id && recado.usuario_id.nome) {
        nomeUsuario = recado.usuario_id.nome;
      }

      li.textContent = `${nomeUsuario}: ${recado.mensagem}`;
      listaRecados.appendChild(li);
    });

  } catch (err) {
    console.error('Erro ao carregar recados:', err);
  }
}