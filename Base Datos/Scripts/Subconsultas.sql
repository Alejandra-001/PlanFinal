-- 1. Paquetes con precio superior al promedio
select nombre, precio_total
from paquetes
where precio_total > (
    select avg(precio_total) from paquetes
);

-- 2. Clientes que no han viajado en el último año
select nombre
from clientes
where id not in (
    select distinct cliente_id
    from reservas
    where fecha_reserva >= current_date - interval 1 year
);

-- 3. Vuelos con ocupación superior al 80%
select id, fecha, asientos_disponibles
from vuelos
where asientos_disponibles < (
    select 0.2 * max(asientos_disponibles) from vuelos
);

-- 4. Hoteles con todas sus habitaciones reservadas en una fecha
select h.nombre
from hoteles h
where not exists (
    select 1
    from habitaciones ha
    where ha.hotel_id = h.id
    and ha.id not in (
        select habitacion_id
        from reserva_habitaciones
        where fecha_entrada <= '2025-06-10'
        and fecha_salida >= '2025-06-10'
    )
);

-- 5. Promociones que no han sido aplicadas
SELECT nombre
FROM promociones
WHERE paquete_id NOT IN (
    SELECT DISTINCT paquete_id FROM reservas
    WHERE paquete_id IS NOT NULL
);



