-- roles
insert into roles (nombre) values
('cliente'), ('agente'), ('proveedor');

-- usuarios
insert into usuarios (nombre, email, password, rol_id) values
('juan perez', 'juan@mail.com', '12345', 1),
('laura torres', 'laura@mail.com', '12345', 1),
('mario lopez', 'mario@mail.com', '12345', 2),
('viajes hoteles sa', 'hotel@mail.com', '12345', 3),
('skyline airlines', 'airline@mail.com', '12345', 3);



-- clientes
insert into clientes (nombre, email, telefono, usuario_id) values
-- ('juan perez', 'juan@mail.com', '3001112233', 1),
-- ('laura torres', 'laura@mail.com', '3014445566', 2),
('camila suarez', 'csuarez@mail.com', '3002221547', 3);


-- agentes
insert into agentes (nombre, usuario_id) values
('mario lopez', 3);

-- proveedores
insert into proveedores (nombre, tipo, api_token, usuario_id) values
('viajes hoteles sa', 'hotel', 'tokenhotel123', 4),
('skyline airlines', 'aerolinea', 'tokenair123', 5);

-- aerolineas
insert into aerolineas (nombre) values
('skyline airlines');

-- aeropuertos
insert into aeropuertos (nombre, ciudad, pais) values
('el dorado', 'bogotá', 'colombia'),
('jfk', 'nueva york', 'estados unidos');

-- vuelos (en COP)
insert into vuelos (aerolinea_id, origen_id, destino_id, fecha, asientos_disponibles, precio) values
(1, 1, 2, '2025-06-10 08:00:00', 10, 4800000),
(1, 2, 1, '2025-06-17 20:00:00', 100, 4600000);

-- hoteles
insert into hoteles (nombre, ciudad, estrellas, proveedor_id) values
('hotel andes', 'bogotá', 4, 1),
('hotel central park', 'nueva york', 5, 1);

-- habitaciones (en COP)
insert into habitaciones (hotel_id, numero, tipo, precio) values
(1, '101', 'doble', 1200000),
(1, '102', 'suite', 2000000),
(2, '201', 'doble', 1800000);

-- paquetes (en COP)
insert into paquetes (nombre, descripcion, hotel_id, vuelo_id, precio_total) values
('paquete bogotá - nyc', 'viaje ida con hotel incluido', 2, 1, 6600000),
('paquete nyc - bogotá', 'viaje retorno con hotel', 1, 2, 6400000);

-- promociones
insert into promociones (nombre, descuento, paquete_id, fecha_inicio, fecha_fin) values
('promo verano', 25.00, 1, '2025-06-01', '2025-06-30'),
('regreso feliz', 15.00, 2, '2025-06-01', '2025-06-20'),
('vacaciones', 10.00, , '2025-08-01', '2025-08-20');

--Promociones aplicadas

insert into paquete_promocion(paquete_id, promocion_id) values 
('1, 1'),
('2, 2');

-- reservas (con descuento aplicado)
insert into reservas (cliente_id, paquete_id, fecha_reserva, total, estado) values
(1, 1, '2025-04-01', 4950000, 'pagado'),   
(2, 2, '2025-04-05', 5440000, 'pagado'),
(1, 1, '2025-01-01', 6600000, 'pagado'),
(1, 2, '2025-02-01', 6400000, 'pagado'),
(1, 1, '2025-03-01', 6600000, 'pagado'),
(1, 1, '2025-05-01', 6600000, 'pagado'),
(1, 2, '2025-05-01', 6400000, 'pagado');

-- reserva_habitaciones
insert into reserva_habitaciones (reserva_id, habitacion_id, fecha_entrada, fecha_salida) values
(1, 3, '2025-06-10', '2025-06-14'),
(2, 1, '2025-06-17', '2025-06-21');

-- reserva_vuelos
insert into reserva_vuelos (reserva_id, vuelo_id) values
(1, 1),
(2, 2);
