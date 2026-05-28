@echo off
chcp 65001 >nul
npx supabase gen types typescript --project-id zuqootrpmikaclglrckz --schema public > types\database.types.ts
echo Tipos generados correctamente con codificación UTF-8
