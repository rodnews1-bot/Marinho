param (
    [switch]$SkipGit = $false
)

Write-Host "Iniciando processo de deploy do Marinho Advocacia..." -ForegroundColor Cyan

Write-Host "1. Preparando o build de producao..."
npm install
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "O build falhou. O deploy foi cancelado."
    exit 1
}

Write-Host "2. Enviando os arquivos para a VPS (Hostinger)..." -ForegroundColor Yellow
scp -r dist/* root@72.60.247.50:/var/www/marinho/
if ($LASTEXITCODE -ne 0) {
    Write-Error "A cópia dos arquivos para o servidor falhou."
    exit 1
}
Write-Host "Arquivos copiados com sucesso!" -ForegroundColor Green

if (-not $SkipGit) {
    Write-Host "3. Salvando as alteracoes no GitHub..." -ForegroundColor Yellow
    git add .
    $dataAtual = Get-Date -Format "dd-MM-yyyy HH:mm"
    git commit -m "Deploy automático: $dataAtual"
    git push origin main
    Write-Host "Backup no GitHub concluido!" -ForegroundColor Green
}

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "DEPLOY FINALIZADO COM SUCESSO! 🎉" -ForegroundColor Green
Write-Host "Sua plataforma ja esta atualizada em https://rodrigomarinho.com.br" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
