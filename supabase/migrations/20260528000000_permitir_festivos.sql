-- Modificar la restricción dia_valido para permitir el valor 7 (Festivo)
-- Primero eliminamos la restricción actual
ALTER TABLE horarios_atencion 
DROP CONSTRAINT IF EXISTS dia_valido;

-- Agregamos la nueva restricción que permite valores de 0 a 7
-- 0 = Domingo, 1-6 = Lunes-Sábado, 7 = Festivo
ALTER TABLE horarios_atencion 
ADD CONSTRAINT dia_valido CHECK (dia_semana >= 0 AND dia_semana <= 7);

-- Comentario para documentar el cambio
COMMENT ON CONSTRAINT dia_valido ON horarios_atencion IS 
'Permite valores 0-6 para días de la semana (Domingo-Sábado) y 7 para festivos';
