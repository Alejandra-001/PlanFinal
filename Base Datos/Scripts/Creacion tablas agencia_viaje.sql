create database agencia_viaje;
use agencia_viaje;

-- tabla roles
create table roles (
    id int auto_increment primary key,
    nombre varchar(50) not null
);

-- tabla usuarios
create table usuarios (
    id int auto_increment primary key,
    nombre varchar(100),
    email varchar(100) unique,
    password varchar(100),
    rol_id int,
    foreign key (rol_id) references roles(id)
);

-- tabla clientes
create table clientes (
    id int auto_increment primary key,
    nombre varchar(100),
    email varchar(100),
    telefono varchar(20),
    usuario_id int,
    foreign key (usuario_id) references usuarios(id)
);

-- tabla agentes
create table agentes (
    id int auto_increment primary key,
    nombre varchar(100),
    usuario_id int,
    foreign key (usuario_id) references usuarios(id)
);

-- tabla proveedores
create table proveedores (
    id int auto_increment primary key,
    nombre varchar(100),
    tipo enum('hotel', 'aerolinea') not null,
    api_token varchar(255),
    usuario_id int,
    foreign key (usuario_id) references usuarios(id)
);

-- tabla aerolineas
create table aerolineas (
    id int auto_increment primary key,
    nombre varchar(100)
);

-- tabla aeropuertos
create table aeropuertos (
    id int auto_increment primary key,
    nombre varchar(100),
    ciudad varchar(100),
    pais varchar(100)
);

-- tabla vuelos
create table vuelos (
    id int auto_increment primary key,
    aerolinea_id int,
    origen_id int,
    destino_id int,
    fecha datetime,
    asientos_disponibles int,
    precio decimal(10,2),
    foreign key (aerolinea_id) references aerolineas(id),
    foreign key (origen_id) references aeropuertos(id),
    foreign key (destino_id) references aeropuertos(id)
);

-- tabla hoteles
create table hoteles (
    id int auto_increment primary key,
    nombre varchar(100),
    ciudad varchar(100),
    estrellas int,
    proveedor_id int,
    foreign key (proveedor_id) references proveedores(id)
);

-- tabla habitaciones
create table habitaciones (
    id int auto_increment primary key,
    hotel_id int,
    numero varchar(10),
    tipo varchar(50),
    precio decimal(10,2),
    foreign key (hotel_id) references hoteles(id)
);

-- tabla paquetes
create table paquetes (
    id int auto_increment primary key,
    nombre varchar(100),
    descripcion text,
    hotel_id int,
    vuelo_id int,
    precio_total decimal(10,2),
    foreign key (hotel_id) references hoteles(id),
    foreign key (vuelo_id) references vuelos(id)
);

-- tabla promociones
create table promociones (
    id int auto_increment primary key,
    nombre varchar(100),
    descuento decimal(5,2),
    paquete_id int,
    fecha_inicio date,
    fecha_fin date,
    foreign key (paquete_id) references paquetes(id)
);

-- tabla paquetes relacion promociones
create table paquete_promocion (
    id int auto_increment primary key,
    paquete_id int not null,
    promocion_id int not null,
    foreign key (paquete_id) references paquetes(id),
    foreign key (promocion_id) references promociones(id)
);


-- tabla reservas
create table reservas (
    id int auto_increment primary key,
    cliente_id int,
    paquete_id int,
    fecha_reserva date,
    total decimal(10,2),
    estado enum('pendiente', 'pagado', 'cancelado'),
    foreign key (cliente_id) references clientes(id),
    foreign key (paquete_id) references paquetes(id)
);

-- tabla reserva_habitaciones
create table reserva_habitaciones (
    id int auto_increment primary key,
    reserva_id int,
    habitacion_id int,
    fecha_entrada date,
    fecha_salida date,
    foreign key (reserva_id) references reservas(id),
    foreign key (habitacion_id) references habitaciones(id)
);

-- tabla reserva_vuelos
create table reserva_vuelos (
    id int auto_increment primary key,
    reserva_id int,
    vuelo_id int,
    foreign key (reserva_id) references reservas(id),
    foreign key (vuelo_id) references vuelos(id)
);
