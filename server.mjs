import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.API_PORT || 3001;

/* =========================================================
   VERIFICAÇÃO DA API KEY
========================================================= */

if (!process.env.OPENAI_API_KEY) {
  console.error('');
  console.error('======================================');
  console.error(' ERRO: OPENAI_API_KEY não encontrada');
  console.error('======================================');
  console.error('');
  console.error(
    'Crie um arquivo .env na raiz do projeto com:'
  );
  console.error('');
  console.error(
    'OPENAI_API_KEY=sua_chave_da_openai'
  );
  console.error('');

  process.exit(1);
}

/* =========================================================
   OPENAI
========================================================= */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================================================
   TESTE DA API
========================================================= */

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'HackaApp AI Server funcionando.',
  });
});

/* =========================================================
   CHAT DA IA
========================================================= */

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    /* -----------------------------------------------
       Verifica se recebeu mensagens
    ------------------------------------------------ */

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Mensagens inválidas.',
      });
    }

    /* -----------------------------------------------
       Filtra somente mensagens válidas
    ------------------------------------------------ */

    const conversation = messages
      .filter(
        (message) =>
          message &&
          (message.role === 'user' ||
            message.role === 'assistant') &&
          typeof message.content === 'string' &&
          message.content.trim().length > 0
      )
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    if (conversation.length === 0) {
      return res.status(400).json({
        error: 'Nenhuma mensagem válida foi enviada.',
      });
    }

    console.log('');
    console.log('======================================');
    console.log(' Nova mensagem recebida');
    console.log(' Mensagens:', conversation.length);
    console.log('======================================');

    /* -----------------------------------------------
       Chamada para a OpenAI
    ------------------------------------------------ */

    const response = await openai.responses.create({
      model: 'gpt-5.6-luna',

      instructions: `
Você é o Dev Assistant da HackaApp.

Você é um tutor de programação para estudantes.

Sua função é ajudar o aluno a entender os conteúdos da plataforma.

REGRAS:

- Responda sempre em português do Brasil.
- Explique de maneira clara e didática.
- Não invente informações.
- Quando explicar programação, use exemplos de código quando forem úteis.
- Explique o código depois do exemplo.
- Se o aluno estiver com dificuldade, simplifique a explicação.
- Não entregue apenas a resposta: ajude o aluno a entender o raciocínio.
- Seja amigável e objetivo.
- Não seja excessivamente longo.
- Use Markdown quando isso melhorar a leitura.
- Para código, use blocos Markdown.
- Se a pergunta não tiver relação com programação ou estudos, responda educadamente.
      `,

      input: conversation,
    });

    /* -----------------------------------------------
       Pega o texto retornado
    ------------------------------------------------ */

    const answer = response.output_text;

    if (!answer || answer.trim().length === 0) {
      console.error(
        'A OpenAI não retornou texto.'
      );

      return res.status(500).json({
        error:
          'A OpenAI não retornou uma resposta.',
      });
    }

    console.log('Resposta da OpenAI recebida.');

    /* -----------------------------------------------
       Retorna para o React
    ------------------------------------------------ */

    return res.json({
      answer,
    });
  } catch (error) {
    console.error('');
    console.error('======================================');
    console.error(' ERRO NA OPENAI');
    console.error('======================================');
    console.error(error);
    console.error('');

    /* -----------------------------------------------
       Erro de autenticação
    ------------------------------------------------ */

    if (error?.status === 401) {
      return res.status(401).json({
        error:
          'A chave da OpenAI é inválida ou não foi configurada corretamente.',
      });
    }

    /* -----------------------------------------------
       Erro de limite/créditos
    ------------------------------------------------ */

    if (error?.status === 429) {
      return res.status(429).json({
        error:
          'A OpenAI recusou a solicitação por limite de uso ou falta de créditos.',
      });
    }

    /* -----------------------------------------------
       Erro geral
    ------------------------------------------------ */

    return res.status(500).json({
      error:
        'Não foi possível obter uma resposta da inteligência artificial.',
    });
  }
});

/* =========================================================
   INICIA SERVIDOR
========================================================= */
app.post('/api/mental-health', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Mensagens inválidas.',
      });
    }

    const conversation = messages
      .filter(
        (message) =>
          message &&
          (message.role === 'user' ||
            message.role === 'assistant') &&
          typeof message.content === 'string' &&
          message.content.trim().length > 0
      )
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    if (conversation.length === 0) {
      return res.status(400).json({
        error: 'Nenhuma mensagem válida foi enviada.',
      });
    }

    console.log('');
    console.log('======================================');
    console.log(' SAÚDE MENTAL - NOVA MENSAGEM');
    console.log(' Mensagens:', conversation.length);
    console.log('======================================');

    const response = await openai.responses.create({
      model: 'gpt-5.6-luna',

      instructions: `
Você é o assistente de apoio emocional da HackaApp.

Você NÃO é psicólogo, psiquiatra, médico ou terapeuta.
Nunca afirme ser um profissional de saúde.

Sua função é:
- ouvir de forma acolhedora;
- ajudar o adolescente a organizar o que está sentindo;
- oferecer orientações gerais e seguras;
- incentivar a busca por ajuda humana quando necessário.

Regras:
- Responda em português do Brasil.
- Seja acolhedor, calmo e sem julgamentos.
- Não faça diagnósticos.
- Não prescreva medicamentos.
- Não minimize sentimentos.
- Não diga que a pessoa "com certeza" possui algum transtorno.
- Não substitua atendimento profissional.
- Incentive conversar com um adulto de confiança quando apropriado.
- Para adolescentes em sofrimento importante, incentive apoio profissional.
- Nunca forneça instruções de autolesão ou suicídio.

Quando o usuário pedir ajuda profissional:
- não invente nomes de psicólogos;
- indique o Cadastro Nacional de Profissionais de Psicologia;
- pode indicar CAPS/CAPS i;
- pode indicar o Pode Falar;
- pode indicar o CVV 188.

Em situações de risco imediato:
- oriente a procurar um adulto de confiança;
- não ficar sozinho(a);
- procurar UPA, pronto-socorro ou hospital;
- ligar para SAMU 192;
- ligar para CVV 188.

Responda de forma humana e objetiva.
      `,

      input: conversation,
    });

    const answer = response.output_text;

    if (!answer || !answer.trim()) {
      return res.status(500).json({
        error:
          'A OpenAI não retornou uma resposta.',
      });
    }

    console.log(
      'Resposta da saúde mental recebida com sucesso.'
    );

    return res.status(200).json({
      answer,
    });
  } catch (error) {
    console.error('');
    console.error('======================================');
    console.error(' ERRO NA SAÚDE MENTAL');
    console.error('======================================');
    console.error(error);
    console.error('');

    if (error?.status === 401) {
      return res.status(401).json({
        error:
          'A chave da OpenAI é inválida ou não foi configurada corretamente.',
      });
    }

    if (error?.status === 429) {
      return res.status(429).json({
        error:
          'A OpenAI recusou a solicitação por limite de uso ou créditos.',
      });
    }

    return res.status(500).json({
      error:
        'Não foi possível obter uma resposta da IA de saúde mental.',
    });
  }
});
app.listen(PORT, () => {
  console.log('');
  console.log('======================================');
  console.log('       HACKAAPP AI SERVER');
  console.log('======================================');
  console.log(` API: http://localhost:${PORT}`);
  console.log(` Health: http://localhost:${PORT}/api/health`);
  console.log(' OpenAI: conectado');
  console.log('======================================');
  console.log('');
});