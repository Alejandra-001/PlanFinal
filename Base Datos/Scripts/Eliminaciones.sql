-- Eliminación de registros con precaución

-- 1. Eliminar una promoción
DELETE FROM promociones WHERE id = 4;

-- 2. Eliminar una reserva cancelada
DELETE FROM reservas WHERE estado = 'cancelado' AND id = 8;

-- 3. Eliminar una habitación específica
DELETE FROM habitaciones WHERE id = 4;

-- 4. Eliminar un cliente que no tenga reservas
DELETE FROM clientes WHERE id = 4 AND id NOT IN (SELECT cliente_id FROM reservas);

-- 5. Eliminar una aerolínea sin vuelos registrados
DELETE FROM aerolineas WHERE id = 2 AND id NOT IN (SELECT aerolinea_id FROM vuelos);
