ALTER TABLE marcas
  ADD COLUMN IF NOT EXISTS institucion_id UUID REFERENCES instituciones(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_marcas_institucion_id ON marcas(institucion_id);
