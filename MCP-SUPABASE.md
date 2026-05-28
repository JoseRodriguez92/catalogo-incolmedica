# Configuración MCP de Supabase

Este archivo explica cómo conectar GitHub Copilot a tu base de datos Supabase usando Model Context Protocol (MCP).

## ¿Qué es MCP?

MCP (Model Context Protocol) permite que GitHub Copilot acceda directamente a tu base de datos Supabase para:

- Consultar datos en tiempo real
- Generar queries SQL precisas basadas en tu esquema
- Sugerir código basado en tu estructura de datos real

## Configuración

### 1. Obtener la cadena de conexión de Supabase

Ve a tu dashboard de Supabase:

1. Navega a: https://supabase.com/dashboard/project/zuqootrpmikaclglrckz/settings/database
2. En la sección **Connection String**, copia la cadena que dice "Connection Pooling"
3. Debe verse así: `postgresql://postgres.zuqootrpmikaclglrckz:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

### 2. Configurar el archivo MCP

Edita el archivo `.vscode/mcp.json` y reemplaza:

```json
{
  "mcpServers": {
    "supabase-postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://postgres.zuqootrpmikaclglrckz:[TU-PASSWORD-AQUI]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
      ]
    }
  }
}
```

**Reemplaza `[TU-PASSWORD-AQUI]`** con la contraseña de tu base de datos Supabase.

### 3. Alternativa: Usar variables de entorno (más seguro)

Si prefieres no poner la contraseña en el archivo JSON, puedes usar variables de entorno:

**Opción A: Agregar a `.env.local`**

```bash
DATABASE_URL="postgresql://postgres.zuqootrpmikaclglrckz:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

**Opción B: Configuración del sistema**
En Windows PowerShell:

```powershell
$env:DATABASE_URL = "postgresql://postgres.zuqootrpmikaclglrckz:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

Luego modifica `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "supabase-postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${env:DATABASE_URL}"
      }
    }
  }
}
```

### 4. Reiniciar VS Code

Después de configurar, reinicia VS Code para que GitHub Copilot reconozca el nuevo servidor MCP.

## Verificar que funciona

Una vez configurado, puedes preguntarle a GitHub Copilot cosas como:

- "¿Qué tablas tengo en mi base de datos?"
- "Muéstrame el esquema de la tabla productos"
- "Dame un query para obtener todos los productos activos"

Copilot ahora tendrá acceso directo a tu esquema de Supabase y podrá dar respuestas más precisas.

## Solución de problemas

### Error: "Connection refused"

- Verifica que la cadena de conexión sea correcta
- Asegúrate de usar el **Connection Pooling** URL (puerto 6543), no el Direct Connection

### Error: "Authentication failed"

- Verifica que la contraseña sea correcta
- La contraseña debe estar URL-encoded si contiene caracteres especiales

### No aparece en Copilot

- Reinicia VS Code completamente
- Verifica que el archivo `.vscode/mcp.json` tenga el formato JSON correcto
- Revisa la consola de salida de Copilot en VS Code (View > Output > GitHub Copilot)

## Recursos

- [Documentación MCP](https://modelcontextprotocol.io/)
- [Supabase Database Settings](https://supabase.com/dashboard/project/zuqootrpmikaclglrckz/settings/database)
- [GitHub Copilot MCP Guide](https://code.visualstudio.com/docs/copilot/copilot-extensibility-overview)
