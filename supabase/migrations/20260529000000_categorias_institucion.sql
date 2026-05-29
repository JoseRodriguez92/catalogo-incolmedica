-- Agrega institucion_id a categorias para que cada institución tenga sus propias categorías

ALTER TABLE categorias
  ADD COLUMN IF NOT EXISTS institucion_id UUID REFERENCES instituciones(id) ON DELETE CASCADE;

-- Índice para acelerar queries por institución
CREATE INDEX IF NOT EXISTS idx_categorias_institucion_id ON categorias(institucion_id);

-- Las categorías existentes sin institución quedan con NULL (categorías globales legacy)
-- A futuro todas las nuevas deben tener institucion_id
