export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categorias: {
        Row: {
          activo: boolean | null
          created_at: string | null
          descripcion: string | null
          icono: string | null
          id: string
          institucion_id: string | null
          nombre: string
          orden: number | null
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          icono?: string | null
          id?: string
          institucion_id?: string | null
          nombre: string
          orden?: number | null
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          icono?: string | null
          id?: string
          institucion_id?: string | null
          nombre?: string
          orden?: number | null
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categorias_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categorias_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones_con_horarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categorias_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones_con_usuarios"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "categorias_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "registros_con_institucion"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "categorias_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "usuarios_con_instituciones"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "categorias_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos: {
        Row: {
          activo: boolean | null
          created_at: string | null
          descripcion: string | null
          id: string
          mime_type: string | null
          nombre: string
          tamano_bytes: number | null
          tipo: Database["public"]["Enums"]["tipo_documento"] | null
          updated_at: string | null
          url: string
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          id?: string
          mime_type?: string | null
          nombre: string
          tamano_bytes?: number | null
          tipo?: Database["public"]["Enums"]["tipo_documento"] | null
          updated_at?: string | null
          url: string
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          id?: string
          mime_type?: string | null
          nombre?: string
          tamano_bytes?: number | null
          tipo?: Database["public"]["Enums"]["tipo_documento"] | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      horarios_atencion: {
        Row: {
          activo: boolean | null
          created_at: string | null
          dia_semana: number
          hora_apertura: string
          hora_cierre: string
          id: string
          institucion_id: string
          notas: string | null
          numero_contacto: string | null
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          dia_semana: number
          hora_apertura: string
          hora_cierre: string
          id?: string
          institucion_id: string
          notas?: string | null
          numero_contacto?: string | null
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          dia_semana?: number
          hora_apertura?: string
          hora_cierre?: string
          id?: string
          institucion_id?: string
          notas?: string | null
          numero_contacto?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "horarios_atencion_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "horarios_atencion_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones_con_horarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "horarios_atencion_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones_con_usuarios"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "horarios_atencion_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "registros_con_institucion"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "horarios_atencion_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "usuarios_con_instituciones"
            referencedColumns: ["institucion_id"]
          },
        ]
      }
      instituciones: {
        Row: {
          activo: boolean | null
          correo_contacto: string | null
          created_at: string | null
          descripcion: string | null
          id: string
          latitude: number | null
          longitude: number | null
          nombre: string
          telefono: string | null
          ubicacion: string | null
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          correo_contacto?: string | null
          created_at?: string | null
          descripcion?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nombre: string
          telefono?: string | null
          ubicacion?: string | null
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          correo_contacto?: string | null
          created_at?: string | null
          descripcion?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nombre?: string
          telefono?: string | null
          ubicacion?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      instituciones_logos: {
        Row: {
          activo: boolean | null
          categoria: Database["public"]["Enums"]["categoria_logo"]
          created_at: string | null
          id: string
          institucion_id: string
          nombre: string | null
          orden: number | null
          tipo: Database["public"]["Enums"]["tipo_logo"]
          updated_at: string | null
          url: string
        }
        Insert: {
          activo?: boolean | null
          categoria?: Database["public"]["Enums"]["categoria_logo"]
          created_at?: string | null
          id?: string
          institucion_id: string
          nombre?: string | null
          orden?: number | null
          tipo?: Database["public"]["Enums"]["tipo_logo"]
          updated_at?: string | null
          url: string
        }
        Update: {
          activo?: boolean | null
          categoria?: Database["public"]["Enums"]["categoria_logo"]
          created_at?: string | null
          id?: string
          institucion_id?: string
          nombre?: string | null
          orden?: number | null
          tipo?: Database["public"]["Enums"]["tipo_logo"]
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "instituciones_logos_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instituciones_logos_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones_con_horarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instituciones_logos_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones_con_usuarios"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "instituciones_logos_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "registros_con_institucion"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "instituciones_logos_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "usuarios_con_instituciones"
            referencedColumns: ["institucion_id"]
          },
        ]
      }
      instituciones_registros_formulario: {
        Row: {
          acepta_politica_privacidad: boolean | null
          asignado_a: string | null
          correo_electronico: string
          created_at: string | null
          estado: Database["public"]["Enums"]["tipo_estado_registro"] | null
          fecha_respuesta: string | null
          id: string
          institucion_id: string | null
          ip_origen: unknown
          mensaje: string
          nombre_completo: string
          notas_internas: string | null
          origen: string | null
          prioridad: Database["public"]["Enums"]["tipo_prioridad"] | null
          telefono: string
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          acepta_politica_privacidad?: boolean | null
          asignado_a?: string | null
          correo_electronico: string
          created_at?: string | null
          estado?: Database["public"]["Enums"]["tipo_estado_registro"] | null
          fecha_respuesta?: string | null
          id?: string
          institucion_id?: string | null
          ip_origen?: unknown
          mensaje: string
          nombre_completo: string
          notas_internas?: string | null
          origen?: string | null
          prioridad?: Database["public"]["Enums"]["tipo_prioridad"] | null
          telefono: string
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          acepta_politica_privacidad?: boolean | null
          asignado_a?: string | null
          correo_electronico?: string
          created_at?: string | null
          estado?: Database["public"]["Enums"]["tipo_estado_registro"] | null
          fecha_respuesta?: string | null
          id?: string
          institucion_id?: string | null
          ip_origen?: unknown
          mensaje?: string
          nombre_completo?: string
          notas_internas?: string | null
          origen?: string | null
          prioridad?: Database["public"]["Enums"]["tipo_prioridad"] | null
          telefono?: string
          updated_at?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instituciones_registros_formulario_asignado_a_fkey"
            columns: ["asignado_a"]
            isOneToOne: false
            referencedRelation: "instituciones_con_usuarios"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "instituciones_registros_formulario_asignado_a_fkey"
            columns: ["asignado_a"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instituciones_registros_formulario_asignado_a_fkey"
            columns: ["asignado_a"]
            isOneToOne: false
            referencedRelation: "usuarios_con_instituciones"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "instituciones_registros_formulario_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instituciones_registros_formulario_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones_con_horarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instituciones_registros_formulario_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones_con_usuarios"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "instituciones_registros_formulario_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "registros_con_institucion"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "instituciones_registros_formulario_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "usuarios_con_instituciones"
            referencedColumns: ["institucion_id"]
          },
        ]
      }
      instituciones_usuarios: {
        Row: {
          activo: boolean | null
          created_at: string | null
          fecha_asignacion: string | null
          fecha_desvinculacion: string | null
          id: string
          institucion_id: string
          notas: string | null
          rol_institucion:
            | Database["public"]["Enums"]["tipo_rol_institucion"]
            | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          fecha_asignacion?: string | null
          fecha_desvinculacion?: string | null
          id?: string
          institucion_id: string
          notas?: string | null
          rol_institucion?:
            | Database["public"]["Enums"]["tipo_rol_institucion"]
            | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          fecha_asignacion?: string | null
          fecha_desvinculacion?: string | null
          id?: string
          institucion_id?: string
          notas?: string | null
          rol_institucion?:
            | Database["public"]["Enums"]["tipo_rol_institucion"]
            | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "instituciones_usuarios_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instituciones_usuarios_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones_con_horarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instituciones_usuarios_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones_con_usuarios"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "instituciones_usuarios_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "registros_con_institucion"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "instituciones_usuarios_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "usuarios_con_instituciones"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "instituciones_usuarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "instituciones_con_usuarios"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "instituciones_usuarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instituciones_usuarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_con_instituciones"
            referencedColumns: ["user_id"]
          },
        ]
      }
      marcas: {
        Row: {
          activo: boolean | null
          created_at: string | null
          descripcion: string | null
          id: string
          institucion_id: string | null
          logo_url: string | null
          nombre: string
          sitio_web: string | null
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          id?: string
          institucion_id?: string | null
          logo_url?: string | null
          nombre: string
          sitio_web?: string | null
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          id?: string
          institucion_id?: string | null
          logo_url?: string | null
          nombre?: string
          sitio_web?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marcas_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marcas_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones_con_horarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marcas_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones_con_usuarios"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "marcas_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "registros_con_institucion"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "marcas_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "usuarios_con_instituciones"
            referencedColumns: ["institucion_id"]
          },
        ]
      }
      productos: {
        Row: {
          activo: boolean | null
          created_at: string | null
          descripcion: string | null
          destacado: boolean | null
          dimensiones: string | null
          id: string
          imagen_principal: string | null
          institucion_id: string | null
          marca_id: string | null
          moneda: string | null
          nombre: string
          nuevo: boolean | null
          peso_kg: number | null
          precio: number
          precio_iva: number | null
          referencia: string | null
          sku: string
          stock: number | null
          stock_minimo: number | null
          unidad_venta: Database["public"]["Enums"]["tipo_unidad_venta"] | null
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          destacado?: boolean | null
          dimensiones?: string | null
          id?: string
          imagen_principal?: string | null
          institucion_id?: string | null
          marca_id?: string | null
          moneda?: string | null
          nombre: string
          nuevo?: boolean | null
          peso_kg?: number | null
          precio: number
          precio_iva?: number | null
          referencia?: string | null
          sku: string
          stock?: number | null
          stock_minimo?: number | null
          unidad_venta?: Database["public"]["Enums"]["tipo_unidad_venta"] | null
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          destacado?: boolean | null
          dimensiones?: string | null
          id?: string
          imagen_principal?: string | null
          institucion_id?: string | null
          marca_id?: string | null
          moneda?: string | null
          nombre?: string
          nuevo?: boolean | null
          peso_kg?: number | null
          precio?: number
          precio_iva?: number | null
          referencia?: string | null
          sku?: string
          stock?: number | null
          stock_minimo?: number | null
          unidad_venta?: Database["public"]["Enums"]["tipo_unidad_venta"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones_con_horarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones_con_usuarios"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "productos_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "registros_con_institucion"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "productos_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "usuarios_con_instituciones"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "productos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
        ]
      }
      productos_categorias: {
        Row: {
          categoria_id: string
          created_at: string | null
          id: string
          principal: boolean | null
          producto_id: string
        }
        Insert: {
          categoria_id: string
          created_at?: string | null
          id?: string
          principal?: boolean | null
          producto_id: string
        }
        Update: {
          categoria_id?: string
          created_at?: string | null
          id?: string
          principal?: boolean | null
          producto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "productos_categorias_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_categorias_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_categorias_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos_completos"
            referencedColumns: ["id"]
          },
        ]
      }
      productos_documentos: {
        Row: {
          created_at: string | null
          documento_id: string
          id: string
          orden: number | null
          producto_id: string
        }
        Insert: {
          created_at?: string | null
          documento_id: string
          id?: string
          orden?: number | null
          producto_id: string
        }
        Update: {
          created_at?: string | null
          documento_id?: string
          id?: string
          orden?: number | null
          producto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "productos_documentos_documento_id_fkey"
            columns: ["documento_id"]
            isOneToOne: false
            referencedRelation: "documentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_documentos_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_documentos_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos_completos"
            referencedColumns: ["id"]
          },
        ]
      }
      productos_imagenes: {
        Row: {
          created_at: string | null
          id: string
          orden: number | null
          producto_id: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          orden?: number | null
          producto_id?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          orden?: number | null
          producto_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "productos_imagenes_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_imagenes_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos_completos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      instituciones_con_horarios: {
        Row: {
          activo: boolean | null
          correo_contacto: string | null
          descripcion: string | null
          horarios: Json | null
          id: string | null
          latitude: number | null
          longitude: number | null
          nombre: string | null
          telefono: string | null
          ubicacion: string | null
        }
        Relationships: []
      }
      instituciones_con_usuarios: {
        Row: {
          activo: boolean | null
          avatar_url: string | null
          email: string | null
          fecha_asignacion: string | null
          fecha_desvinculacion: string | null
          full_name: string | null
          institucion_id: string | null
          institucion_nombre: string | null
          rol_institucion:
            | Database["public"]["Enums"]["tipo_rol_institucion"]
            | null
          user_id: string | null
        }
        Relationships: []
      }
      productos_completos: {
        Row: {
          activo: boolean | null
          categorias: Json | null
          created_at: string | null
          descripcion: string | null
          destacado: boolean | null
          dimensiones: string | null
          documentos: Json | null
          id: string | null
          imagen_principal: string | null
          institucion_id: string | null
          marca_id: string | null
          marca_logo: string | null
          marca_nombre: string | null
          moneda: string | null
          nombre: string | null
          nuevo: boolean | null
          peso_kg: number | null
          precio: number | null
          precio_iva: number | null
          referencia: string | null
          sku: string | null
          stock: number | null
          stock_minimo: number | null
          unidad_venta: Database["public"]["Enums"]["tipo_unidad_venta"] | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones_con_horarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "instituciones_con_usuarios"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "productos_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "registros_con_institucion"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "productos_institucion_id_fkey"
            columns: ["institucion_id"]
            isOneToOne: false
            referencedRelation: "usuarios_con_instituciones"
            referencedColumns: ["institucion_id"]
          },
          {
            foreignKeyName: "productos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
        ]
      }
      registros_con_institucion: {
        Row: {
          asignado_email: string | null
          asignado_nombre: string | null
          correo_electronico: string | null
          created_at: string | null
          estado: Database["public"]["Enums"]["tipo_estado_registro"] | null
          id: string | null
          institucion_id: string | null
          institucion_nombre: string | null
          mensaje: string | null
          nombre_completo: string | null
          prioridad: Database["public"]["Enums"]["tipo_prioridad"] | null
          telefono: string | null
        }
        Relationships: []
      }
      usuarios_con_instituciones: {
        Row: {
          activo: boolean | null
          email: string | null
          fecha_asignacion: string | null
          full_name: string | null
          institucion_id: string | null
          institucion_nombre: string | null
          institucion_telefono: string | null
          institucion_ubicacion: string | null
          rol_institucion:
            | Database["public"]["Enums"]["tipo_rol_institucion"]
            | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_institucion_users: {
        Args: { inst_uuid: string }
        Returns: {
          email: string
          fecha_asignacion: string
          full_name: string
          rol_institucion: string
          user_id: string
        }[]
      }
      get_nombre_dia: { Args: { dia: number }; Returns: string }
      get_registros_pendientes: {
        Args: { limite?: number }
        Returns: {
          correo_electronico: string
          created_at: string
          id: string
          institucion_nombre: string
          mensaje: string
          nombre_completo: string
          telefono: string
        }[]
      }
      get_registros_stats: {
        Args: { inst_id?: string }
        Returns: {
          cerrados: number
          en_proceso: number
          pendientes: number
          respondidos: number
          spam: number
          total: number
        }[]
      }
      get_user_instituciones: {
        Args: { user_uuid: string }
        Returns: {
          activo: boolean
          descripcion: string
          institucion_id: string
          nombre: string
          rol_institucion: string
          telefono: string
        }[]
      }
    }
    Enums: {
      categoria_logo: "principal" | "secundario" | "normal"
      tipo_documento:
        | "ficha_tecnica"
        | "manual_usuario"
        | "certificado"
        | "brochure"
        | "imagen"
        | "video"
        | "catalogo"
        | "otro"
      tipo_estado_registro:
        | "pendiente"
        | "en_proceso"
        | "respondido"
        | "cerrado"
        | "spam"
      tipo_logo:
        | "logotipo"
        | "isotipo"
        | "version_oscura"
        | "version_clara"
        | "favicon"
        | "banner"
        | "otro"
      tipo_prioridad: "baja" | "normal" | "alta" | "urgente"
      tipo_rol_institucion:
        | "usuario"
        | "administrador"
        | "supervisor"
        | "vendedor"
        | "tecnico"
      tipo_unidad_venta:
        | "unidad"
        | "caja"
        | "paquete"
        | "kit"
        | "conjunto"
        | "metro"
        | "litro"
        | "kilogramo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      categoria_logo: ["principal", "secundario", "normal"],
      tipo_documento: [
        "ficha_tecnica",
        "manual_usuario",
        "certificado",
        "brochure",
        "imagen",
        "video",
        "catalogo",
        "otro",
      ],
      tipo_estado_registro: [
        "pendiente",
        "en_proceso",
        "respondido",
        "cerrado",
        "spam",
      ],
      tipo_logo: [
        "logotipo",
        "isotipo",
        "version_oscura",
        "version_clara",
        "favicon",
        "banner",
        "otro",
      ],
      tipo_prioridad: ["baja", "normal", "alta", "urgente"],
      tipo_rol_institucion: [
        "usuario",
        "administrador",
        "supervisor",
        "vendedor",
        "tecnico",
      ],
      tipo_unidad_venta: [
        "unidad",
        "caja",
        "paquete",
        "kit",
        "conjunto",
        "metro",
        "litro",
        "kilogramo",
      ],
    },
  },
} as const
