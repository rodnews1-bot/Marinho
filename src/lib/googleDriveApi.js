import { gapi } from 'gapi-script';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// O escopo de leitura do Drive para ver arquivos.
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

export const initGoogleDriveApi = () => {
  return new Promise((resolve, reject) => {
    try {
      gapi.load('client:auth2', () => {
        gapi.client.init({
          clientId: CLIENT_ID,
          scope: SCOPES,
          plugin_name: "Marinho CRM Docs",
        }).then(() => {
          resolve(gapi.auth2.getAuthInstance());
        }).catch((err) => {
          console.error("Erro ao inicializar Google API:", err);
          reject(err);
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const signInToGoogle = async () => {
  const authInstance = gapi.auth2.getAuthInstance();
  if (!authInstance.isSignedIn.get()) {
    await authInstance.signIn();
  }
  return authInstance.currentUser.get().getAuthResponse().access_token;
};

// Extrai o Folder ID de uma URL do Drive
export const extractFolderId = (url) => {
  if (!url) return null;
  const match = url.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  
  // Alternative format
  const match2 = url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match2) return match2[1];
  
  return null;
};

// Busca todos os PDFs e Docs dentro da pasta
export const listFilesInFolder = async (folderId, accessToken) => {
  const query = `'${folderId}' in parents and (mimeType='application/pdf' or mimeType='application/vnd.google-apps.document' or mimeType='text/plain') and trashed=false`;
  
  const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType)&access_token=${accessToken}`);
  const data = await response.json();
  
  if (data.error) throw new Error(data.error.message);
  return data.files || [];
};

export const readDriveFileParams = async (fileId, accessToken, mimeType) => {
  if (mimeType === 'application/pdf') {
     // A leitura de PDF cru exige um parser como pdf.js, então vamos retornar que baixamos,
     // mas para simplicidade na resposta da API o Google Docs export faz o texto cru!
     return "Função de leitura direta de PDF ainda requer backend ou conversor. Nomes extraídos do drive por segurança.";
  }
  
  // Se for Google Docs, exportamos para texto puro.
  if (mimeType === 'application/vnd.google-apps.document') {
     const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain&access_token=${accessToken}`);
     return await res.text();
  }

  // Se for texto.
  if (mimeType === 'text/plain') {
     const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&access_token=${accessToken}`);
     return await res.text();
  }
  
  return "";
};
