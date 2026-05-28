-- Crear enum para categoría de logos
CREATE TYPE categoria_logo AS ENUM ('principal', 'secundario', 'normal');

-- Agregar columna categoria a la tabla instituciones_logos
ALTER TABLE instituciones_logos 
ADD COLUMN categoria categoria_logo NOT NULL DEFAULT 'normal';

-- Crear índice para mejorar consultas por categoría
CREATE INDEX idx_instituciones_logos_categoria ON instituciones_logos(categoria);

-- Comentario para documentar el cambio
COMMENT ON COLUMN instituciones_logos.categoria IS 
'Categoría del logo: principal (para usar en header/branding principal), secundario (usos alternativos), normal (archivo general)';
