description: [Como fazer o Deploy do Marinho Advocacia]
---
# Deploy Marinho Automático para a VPS
Este workflow contém o script oficial que o agente deve usar sempre que o usuário pedir para fazer deploy, subir pro ar, enviar as atualizações ou publicar o site.

### Passos da publicação
1. Verifique se o projeto está pronto e se buildar:
```bash
npm install
npm run build
```

// turbo-all
2. Envie os arquivos buildados da pasta `dist` via SCP direto para o seu servidor VPS oficial (Hostinger).
```bash
scp -o BatchMode=yes -r dist/* root@72.60.247.50:/var/www/marinho/
```
*Observação importante: A conexão SSH/SCP na máquina destino não pede senha, então esse comando executa perfeitamente de forma programática. Se pedir, aborte e peça intervenção do usuário.*

3. Salve e Envie o código modificado para o GitHub como backup do projeto:
```bash
git add .
git commit -m "Deploy automático: Atualização do sistema $(date +%d-%m-%Y)"
git push origin main
```

**Nota para o assistente virtual:** Após executar isso, notifique o usuário como Sucesso e diga que o novo sistema está publicado em `https://rodrigomarinho.com.br`.
