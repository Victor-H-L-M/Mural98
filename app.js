// APP.JS CARREGADO
console.log('APP.JS CARREGADO');

const formUsuario = document.getElementById('form-usuario');
const formRecado = document.getElementById('form-recado');
const listaRecados = document.getElementById('lista-recados');

// Remover a barra final para evitar // ao concatenar
const API_URL = 'https://mural98-j11w.vercel.app';

if (!formUsuario) console.warn('form-usuario não encontrado no DOM');
if (!formRecado) console.warn('form-recado não encontrado no DOM');
if (!listaRecados) console.warn('lista-recados não encontrado no DOM');

if (formUsuario) {
  formUsuario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeUsuario')?.value?.trim();

    if (!nome) {
      alert('Por favor, preencha o nome do usuário.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/usuario_id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome })
      });

      if (!res.ok) {
        // tenta ler texto ou json com mensagem de erro para debug
        let detalhe = '';
        try {
          detalhe = await res.text();
        } catch (err) {
          detalhe = '(não foi possível ler o corpo da resposta)';
        }
        console.error('Falha ao cadastrar usuário', res.status, detalhe);
        throw new Error(`Erro ao cadastrar usuário (status ${res.status}): ${detalhe}`);
      }

      // opcional: ler resposta JSON para obter id criado
      let dados = null;
      try {
        dados = await res.json();
      } catch (err) {
        // sem corpo JSON
      }

      alert('Usuário cadastrado com sucesso!' + (dados && (dados.id || dados._id) ? ` ID: ${dados.id || dados._id}` : ''));
      formUsuario.reset();

    } catch (err) {
      console.error(err);
      alert(err.message || 'Erro ao cadastrar usuário');
    }
  });
}

if (formRecado) {
  formRecado.addEventListener('submit', async (e) => {
    e.preventDefault();

    const mensagem = document.getElementById('mensagem')?.value;
    const usuario_id = document.getElementById('usuarioId')?.value;

    if (!mensagem || !usuario_id) {
      alert('Preencha todos os campos do recado.');
      return;
    }

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
        let detalhe = '';
        try {
          detalhe = await res.text();
        } catch (err) {
          detalhe = '(não foi possível ler o corpo da resposta)';
        }
        console.error('Falha ao enviar recado', res.status, detalhe);
        throw new Error(`Erro ao enviar recado (status ${res.status}): ${detalhe}`);
      }

      formRecado.reset();
      carregarRecados();

    } catch (err) {
      console.error(err);
      alert(err.message || 'Erro ao enviar recado');
    }
  });
}

// Função unificada para carregar recados (retirada duplicação)
async function carregarRecados() {
  console.log('CARREGAR RECADOS CHAMADO');
  try {
    const res = await fetch(`${API_URL}/recados`);
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Erro ao buscar recados (status ${res.status}): ${txt}`);
    }
    const dados = await res.json();

    console.log('Recados recebidos:', dados);

    listaRecados.innerHTML = '';

    dados.forEach(recado => {
      const li = document.createElement('li');

      let nomeUsuario = 'Usuário';

      // Lida com diferentes formatos possíveis de usuario_id
      if (recado.usuario_id) {
        if (typeof recado.usuario_id === 'string' || typeof recado.usuario_id === 'number') {
          nomeUsuario = String(recado.usuario_id);
        } else if (Array.isArray(recado.usuario_id) && recado.usuario_id.length > 0) {
          nomeUsuario = recado.usuario_id[0]?.nome || String(recado.usuario_id[0]) || 'Usuário';
        } else if (recado.usuario_id.nome) {
          nomeUsuario = recado.usuario_id.nome;
        }
      }

      li.textContent = `${nomeUsuario}: ${recado.mensagem}`;
      listaRecados.appendChild(li);
    });

  } catch (err) {
    console.error('Erro ao carregar recados:', err);
  }
}

// Carrega ao iniciar (se o elemento existir)
if (listaRecados) {
  carregarRecados();
}
