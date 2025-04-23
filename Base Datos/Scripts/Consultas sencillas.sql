use agencia_viajes



-- 1. paquetes con descuento mayor al 20%
select nombre, descuento
from promociones
where descuento > 20;

-- 2. reservas realizadas en el último mes
select id, cliente_id, fecha_reserva
from reservas
where fecha_reserva >= current_date - interval 1 month;

-- 3. vuelos con asientos disponibles
select id, aerolinea_id, fecha, asientos_disponibles
from vuelos
where asientos_disponibles > 0;

-- 4. hoteles con valoración mayor a 4 estrellas
select nombre, ciudad, estrellas
from hoteles
where estrellas > 4;

-- 5. clientes con más de 5 reservas
select cliente_id
from reservas
group by cliente_id
having count(id) >5;
