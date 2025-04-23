-- 1. paquetes con su hotel y vuelo incluido

select 
    paquetes.id as paquete_id,
    paquetes.nombre as nombre_paquete,
    hoteles.nombre as nombre_hotel,
    vuelos.id as vuelo_id,
    vuelos.fecha as fecha_vuelo
from paquetes
join hoteles on paquetes.hotel_id = hoteles.id
join vuelos on paquetes.vuelo_id = vuelos.id;



-- 2. reservas completas con información de cliente y paquete
select 
    reservas.id as reserva_id,
    clientes.nombre as cliente,
    paquetes.nombre as paquete,
    reservas.fecha_reserva,
    reservas.total,
    reservas.estado
from reservas
join clientes on reservas.cliente_id = clientes.id
join paquetes on reservas.paquete_id = paquetes.id;


-- 3. vuelos con información de aerolínea y aeropuertos
select 
    vuelos.id as vuelo_id,
    aerolineas.nombre as aerolinea,
    aeropuerto_origen.nombre as aeropuerto_origen,
    aeropuerto_destino.nombre as aeropuerto_destino,
    vuelos.fecha,
    vuelos.asientos_disponibles,
    vuelos.precio
from vuelos
join aerolineas on vuelos.aerolinea_id = aerolineas.id
join aeropuertos as aeropuerto_origen on vuelos.origen_id = aeropuerto_origen.id
join aeropuertos as aeropuerto_destino on vuelos.destino_id = aeropuerto_destino.id;


-- 4. promociones aplicables a paquetes específicos
select 
    promociones.nombre as promocion,
    promociones.descuento,
    promociones.fecha_inicio,
    promociones.fecha_fin,
    paquetes.nombre as paquete
from promociones
join paquetes on promociones.paquete_id = paquetes.id;


-- 5. habitaciones reservadas con información de hotel y cliente
select 
    reserva_habitaciones.id as reserva_habitacion_id,
    hoteles.nombre as hotel,
    habitaciones.numero as numero_habitacion,
    clientes.nombre as cliente,
    reserva_habitaciones.fecha_entrada,
    reserva_habitaciones.fecha_salida
from reserva_habitaciones
join habitaciones on reserva_habitaciones.habitacion_id = habitaciones.id
join hoteles on habitaciones.hotel_id = hoteles.id
join reservas on reserva_habitaciones.reserva_id = reservas.id
join clientes on reservas.cliente_id = clientes.id;

