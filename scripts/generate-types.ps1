$output = npx supabase gen types typescript --project-id zuqootrpmikaclglrckz --schema public
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$outputPath = Join-Path $PSScriptRoot "..\types\database.types.ts"
[System.IO.File]::WriteAllLines($outputPath, $output, $utf8NoBom)
Write-Host "Tipos generados correctamente con codificación UTF-8" -ForegroundColor Green
