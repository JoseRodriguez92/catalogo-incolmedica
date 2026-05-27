# 🚀 Configuración de Supabase

## 📋 Requisitos previos

1. **Cuenta de Supabase**: Crea una cuenta en [supabase.com](https://supabase.com)
2. **Proyecto creado**: Crea un nuevo proyecto en el dashboard de Supabase
3. **Supabase CLI** (para generar types automáticamente):
   ```bash
   npm install -g supabase
   ```

## 🔧 Configuración paso a paso

### 1. Obtener las credenciales de Supabase

Ve a tu proyecto en Supabase Dashboard:

1. Ve a **Project Settings** → **API**
2. Copia los siguientes valores:
   - **Project URL**: Tu `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: Tu `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **service_role key**: Tu `SUPABASE_SERVICE_ROLE_KEY` (¡Solo para servidor!)

### 2. Configurar variables de entorno

Edita el archivo `.env.local` en la raíz del proyecto con tus credenciales:

```env
# URL de tu proyecto Supabase
NEXT_PUBLIC_SUPABASE_URL="https://tu-project-id.supabase.co"

# Anon/Public key (segura para usar en el cliente)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Service Role Key (¡SOLO para servidor!)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Generar types automáticamente desde tu base de datos

Primero, actualiza el script en `package.json` con tu **Project ID**:

```json
"types:supabase": "supabase gen types typescript --project-id TU_PROJECT_ID --schema public > types/database.types.ts"
```

Para obtener tu Project ID:

- Ve a **Project Settings** → **General** en el dashboard
- Copia el **Reference ID**

Luego ejecuta:

```bash
pnpm types:supabase
```

Esto generará automáticamente los tipos TypeScript basados en tus tablas de Supabase.

## 📖 Uso

### En componentes del cliente (Client Components)

```tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function MiComponente() {
  const [datos, setDatos] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    async function cargarDatos() {
      const { data } = await supabase.from("productos").select("*");

      setDatos(data || []);
    }

    cargarDatos();
  }, []);

  return <div>{/* Tu UI aquí */}</div>;
}
```

### En Server Components y Server Actions

```tsx
import { createClient } from "@/lib/supabase/server";

export default async function MiPagina() {
  const supabase = await createClient();

  const { data: productos } = await supabase.from("productos").select("*");

  return <div>{/* Tu UI aquí */}</div>;
}
```

### En Server Actions

```tsx
"use server";

import { createClient } from "@/lib/supabase/server";

export async function crearProducto(formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("productos")
    .insert({
      nombre: formData.get("nombre"),
      precio: formData.get("precio"),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

## 📁 Estructura de archivos

```
proyecto/
├── lib/
│   └── supabase/
│       ├── client.ts    # Cliente para componentes del navegador
│       └── server.ts    # Cliente para Server Components/Actions
├── types/
│   └── database.types.ts # Types generados automáticamente
└── .env.local           # Variables de entorno
```

## 🔒 Seguridad

- ✅ **NUNCA** expongas `SUPABASE_SERVICE_ROLE_KEY` en el cliente
- ✅ Usa **Row Level Security (RLS)** en tus tablas de Supabase
- ✅ La `anon key` es segura para usar en el cliente
- ✅ Configura políticas de seguridad en el dashboard de Supabase

## 🔄 Actualizar types después de cambios en la BD

Cada vez que modifiques la estructura de tus tablas en Supabase:

```bash
pnpm types:supabase
```

Esto mantendrá tus tipos TypeScript sincronizados con tu base de datos.

## 📚 Recursos

- [Documentación oficial de Supabase](https://supabase.com/docs)
- [Supabase con Next.js App Router](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
