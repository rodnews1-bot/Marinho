// Login do administrador validado no servidor (autenticação do Direitando).
// O navegador nunca guarda nem compara senha: recebe um token assinado pelo servidor,
// que é conferido de novo a cada abertura do painel.
// As chamadas vão para /_auth/* no próprio domínio; o nginx encaminha ao serviço de autenticação.

const ANON_KEY = import.meta.env.VITE_DIREITANDO_ANON_KEY || '';
const STORAGE_KEY = 'marinho_admin_session';

// Contas com acesso ao painel do escritório (titular do workspace no Direitando).
const ADMIN_EMAILS = ['contato@direitando.com.br'];

const isAdminEmail = (email) => ADMIN_EMAILS.includes(String(email || '').trim().toLowerCase());

async function request(path, { method = 'GET', token, body } = {}) {
  const res = await fetch(`/_auth/${path}`, {
    method,
    headers: {
      apikey: ANON_KEY,
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

function saveSession(data) {
  const session = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    email: data.user?.email || data.email,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function clearAdminSession() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('marinho_admin_token'); // chave do login antigo, sem validade
}

export async function signInAdmin(email, password) {
  if (!isAdminEmail(email)) return { ok: false, error: 'Credenciais inválidas.' };
  const res = await request('token?grant_type=password', { method: 'POST', body: { email: String(email).trim().toLowerCase(), password } });
  if (res.status === 429) return { ok: false, error: 'Muitas tentativas. Aguarde alguns minutos.' };
  if (!res.ok || !res.data?.access_token || !isAdminEmail(res.data.user?.email)) return { ok: false, error: 'Credenciais inválidas.' };
  return { ok: true, session: saveSession(res.data) };
}

// Confere a sessão guardada com o servidor; renova o token se tiver expirado.
export async function restoreAdminSession() {
  const session = readSession();
  if (!session?.access_token) {
    clearAdminSession();
    return null;
  }
  let user = await request('user', { token: session.access_token });
  if (!user.ok && session.refresh_token) {
    const renewed = await request('token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: session.refresh_token } });
    if (renewed.ok && renewed.data?.access_token) {
      saveSession(renewed.data);
      user = await request('user', { token: renewed.data.access_token });
    }
  }
  if (!user.ok || !isAdminEmail(user.data?.email)) {
    clearAdminSession();
    return null;
  }
  return { email: user.data.email };
}

export async function signOutAdmin() {
  const session = readSession();
  clearAdminSession();
  if (session?.access_token) await request('logout', { method: 'POST', token: session.access_token }).catch(() => {});
}
