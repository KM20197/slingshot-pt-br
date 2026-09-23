$ErrorActionPreference = 'Stop'

Set-Location -LiteralPath $PSScriptRoot

if (-not (Test-Path -LiteralPath 'package.json') -or -not (Test-Path -LiteralPath 'source\index.original.html')) {
    Write-Error 'Este script deve estar na raiz do projeto Slingshot Brasil.'
    exit 1
}

$expectedHash = 'A8CE3636C328828FB311A505EC38603345C9AC5F08AE1BE8C01969818F1D8D61'
$actualHash = (Get-FileHash -LiteralPath 'source\index.original.html' -Algorithm SHA256).Hash
if ($actualHash -ne $expectedHash) {
    Write-Error "A fonte original mudou: $actualHash"
    exit 1
}

if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
    Write-Error 'Node.js e npm são necessários para executar as verificações.'
    exit 1
}

& npm.cmd run verify
if ($LASTEXITCODE -ne 0) {
    Write-Error "npm run verify falhou com exit $LASTEXITCODE"
    exit 1
}

& git.exe diff --check
if ($LASTEXITCODE -ne 0) {
    Write-Error 'git diff --check encontrou problemas.'
    exit 1
}

& git.exe diff --cached --check
if ($LASTEXITCODE -ne 0) {
    Write-Error 'git diff --cached --check encontrou problemas.'
    exit 1
}

$untracked = @(& git.exe ls-files --others --exclude-standard)
if ($LASTEXITCODE -ne 0) {
    Write-Error 'Não foi possível listar arquivos novos ainda não rastreados.'
    exit 1
}
if ($untracked.Count -gt 0) {
    Write-Output "AVISO: $($untracked.Count) arquivo(s) não rastreado(s) não entram no git diff --check. Revise e adicione-os antes do commit."
}

Write-Output 'PASS: fonte original, build, testes e diffs rastreados sem erros.'
exit 0
