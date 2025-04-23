-- Modificación de datos en distintas tablas
use agencia_viajes;
-- 1. Cambiar el nombre de un cliente
UPDATE clientes SET nombre = 'Carlos Mendoz' WHERE id = 1;

-- 2. Actualizar el número de teléfono de un cliente
UPDATE clientes SET telefono = '3214567890' WHERE id = 2;

-- 3. Cambiar el estado de una reserva a 'cancelado'
UPDATE reservas SET estado = 'cancelado' WHERE id = 3;

-- 4. Actualizar el precio de una habitación
UPDATE habitaciones SET precio = 1500000 WHERE id = 3;

-- 5. Aumentar el descuento de una promoción
UPDATE promociones SET descuento = 25.00 WHERE id = 3;
