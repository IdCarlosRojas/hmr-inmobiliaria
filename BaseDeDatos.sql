CREATE DATABASE IF NOT EXISTS estateops_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE estateops_db;

SET FOREIGN_KEY_CHECKS = 0;
DROP VIEW IF EXISTS `vw_resumen_pagos_cliente`;
DROP VIEW IF EXISTS `vw_solicitudes_evaluacion_asesor`;
DROP VIEW IF EXISTS `vw_clientes_directorio_comercial`;
DROP VIEW IF EXISTS `vw_usuarios_sin_datos_sensibles`;
DROP VIEW IF EXISTS `vw_catalogo_publico_propiedades`;

DROP TABLE IF EXISTS `mantenimiento`;
DROP TABLE IF EXISTS `seguimiento`;
DROP TABLE IF EXISTS `reporte`;
DROP TABLE IF EXISTS `notificacion`;
DROP TABLE IF EXISTS `documento`;
DROP TABLE IF EXISTS `pago`;
DROP TABLE IF EXISTS `contrato`;
DROP TABLE IF EXISTS `solicitud_arrendamiento`;
DROP TABLE IF EXISTS `visita`;
DROP TABLE IF EXISTS `propiedad`;
DROP TABLE IF EXISTS `propietario`;
DROP TABLE IF EXISTS `cliente`;
DROP TABLE IF EXISTS `administrador`;
DROP TABLE IF EXISTS `usuario`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `usuario` (
  `idUsuario` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(80) NOT NULL,
  `apellido` varchar(80) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `contrasenaHash` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `rol` enum('Administrador','Asesor','Cliente') NOT NULL,
  `estado` enum('Activo','Inactivo','Bloqueado') NOT NULL DEFAULT 'Activo',
  `fechaCreacion` datetime NOT NULL,
  `ultimoAcceso` datetime DEFAULT NULL,
  `resetToken` varchar(120) DEFAULT NULL,
  `resetTokenExpiry` datetime DEFAULT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `uq_usuario_correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `administrador` (
  `idAdministrador` int unsigned NOT NULL,
  `areaResponsable` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`idAdministrador`),
  CONSTRAINT `fk_administrador_usuario`
    FOREIGN KEY (`idAdministrador`) REFERENCES `usuario` (`idUsuario`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cliente` (
  `idCliente` int unsigned NOT NULL,
  `tipoDocumento` enum('CC','CE','Pasaporte','NIT','Otro') NOT NULL DEFAULT 'CC',
  `numeroDocumento` varchar(30) NOT NULL,
  `direccion` varchar(180) DEFAULT NULL,
  `preferencias` text,
  PRIMARY KEY (`idCliente`),
  UNIQUE KEY `uq_cliente_documento` (`numeroDocumento`),
  CONSTRAINT `fk_cliente_usuario`
    FOREIGN KEY (`idCliente`) REFERENCES `usuario` (`idUsuario`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `propietario` (
  `idPropietario` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `tipoDocumento` varchar(25) NOT NULL,
  `numeroDocumento` varchar(30) NOT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `telefono` varchar(20) NOT NULL,
  `direccionContacto` varchar(180) DEFAULT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  PRIMARY KEY (`idPropietario`),
  UNIQUE KEY `uq_propietario_documento` (`numeroDocumento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `propiedad` (
  `idPropiedad` int unsigned NOT NULL AUTO_INCREMENT,
  `idPropietario` int unsigned NOT NULL,
  `codigoInmueble` varchar(30) NOT NULL,
  `tipo` enum('Casa','Apartamento','Local','Oficina','Lote','Otro') NOT NULL,
  `operacion` enum('Arriendo','Venta','Ambos') NOT NULL,
  `direccion` varchar(200) NOT NULL,
  `ciudad` varchar(80) NOT NULL,
  `barrio` varchar(100) DEFAULT NULL,
  `descripcion` text,
  `areaM2` decimal(10,2) DEFAULT NULL,
  `habitaciones` tinyint unsigned DEFAULT NULL,
  `banos` tinyint unsigned DEFAULT NULL,
  `precio` decimal(12,2) NOT NULL,
  `estado` enum('Disponible','Reservada','Arrendada','Vendida','Inactiva') NOT NULL DEFAULT 'Disponible',
  `fechaRegistro` datetime NOT NULL,
  `titulo` varchar(150) DEFAULT NULL,
  `localidad` varchar(100) DEFAULT NULL,
  `pisos` tinyint unsigned DEFAULT NULL,
  `caracteristicas` text,
  `imagenes` json DEFAULT NULL,
  `imagenPrincipal` varchar(500) DEFAULT NULL,
  `publicada` tinyint(1) NOT NULL DEFAULT '1',
  `destacada` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idPropiedad`),
  UNIQUE KEY `uq_propiedad_codigo` (`codigoInmueble`),
  KEY `idx_propiedad_propietario` (`idPropietario`),
  CONSTRAINT `fk_propiedad_propietario`
    FOREIGN KEY (`idPropietario`) REFERENCES `propietario` (`idPropietario`)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `visita` (
  `idVisita` int unsigned NOT NULL AUTO_INCREMENT,
  `idCliente` int unsigned NOT NULL,
  `idPropiedad` int unsigned NOT NULL,
  `idAsesor` int unsigned DEFAULT NULL,
  `fechaHora` datetime NOT NULL,
  `estado` enum('Pendiente','Confirmada','Realizada','Cancelada','NoAsistio') NOT NULL DEFAULT 'Pendiente',
  `observaciones` text,
  PRIMARY KEY (`idVisita`),
  KEY `idx_visita_cliente` (`idCliente`),
  KEY `idx_visita_propiedad` (`idPropiedad`),
  KEY `idx_visita_asesor` (`idAsesor`),
  CONSTRAINT `fk_visita_cliente`
    FOREIGN KEY (`idCliente`) REFERENCES `cliente` (`idCliente`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_visita_propiedad`
    FOREIGN KEY (`idPropiedad`) REFERENCES `propiedad` (`idPropiedad`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_visita_asesor`
    FOREIGN KEY (`idAsesor`) REFERENCES `usuario` (`idUsuario`)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `solicitud_arrendamiento` (
  `idSolicitud` int unsigned NOT NULL AUTO_INCREMENT,
  `idCliente` int unsigned NOT NULL,
  `idPropiedad` int unsigned NOT NULL,
  `fechaSolicitud` datetime NOT NULL,
  `ingresosMensuales` decimal(12,2) DEFAULT NULL,
  `estado` enum('Recibida','EnRevision','Aprobada','Rechazada','Retirada') NOT NULL DEFAULT 'Recibida',
  `observaciones` text,
  PRIMARY KEY (`idSolicitud`),
  KEY `idx_solicitud_cliente` (`idCliente`),
  KEY `idx_solicitud_propiedad` (`idPropiedad`),
  CONSTRAINT `fk_solicitud_cliente`
    FOREIGN KEY (`idCliente`) REFERENCES `cliente` (`idCliente`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_solicitud_propiedad`
    FOREIGN KEY (`idPropiedad`) REFERENCES `propiedad` (`idPropiedad`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `contrato` (
  `idContrato` int unsigned NOT NULL AUTO_INCREMENT,
  `idCliente` int unsigned NOT NULL,
  `idPropiedad` int unsigned NOT NULL,
  `idPropietario` int unsigned NOT NULL,
  `tipoContrato` enum('Arrendamiento','Compraventa','Otro') NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date DEFAULT NULL,
  `valorMensual` decimal(12,2) DEFAULT NULL,
  `valorTotal` decimal(14,2) DEFAULT NULL,
  `estado` enum('Borrador','Vigente','Finalizado','Cancelado') NOT NULL DEFAULT 'Borrador',
  `fechaCreacion` datetime NOT NULL,
  `firmado` tinyint(1) NOT NULL DEFAULT '0',
  `fechaFirma` datetime DEFAULT NULL,
  PRIMARY KEY (`idContrato`),
  KEY `idx_contrato_cliente` (`idCliente`),
  KEY `idx_contrato_propiedad` (`idPropiedad`),
  KEY `idx_contrato_propietario` (`idPropietario`),
  CONSTRAINT `fk_contrato_cliente`
    FOREIGN KEY (`idCliente`) REFERENCES `cliente` (`idCliente`)
    ON DELETE RESTRICT,
  CONSTRAINT `fk_contrato_propiedad`
    FOREIGN KEY (`idPropiedad`) REFERENCES `propiedad` (`idPropiedad`)
    ON DELETE RESTRICT,
  CONSTRAINT `fk_contrato_propietario`
    FOREIGN KEY (`idPropietario`) REFERENCES `propietario` (`idPropietario`)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `pago` (
  `idPago` int unsigned NOT NULL AUTO_INCREMENT,
  `idContrato` int unsigned NOT NULL,
  `periodo` char(7) NOT NULL,
  `fechaVencimiento` date NOT NULL,
  `fechaPago` date DEFAULT NULL,
  `valor` decimal(12,2) NOT NULL,
  `metodoPago` enum('Transferencia','Efectivo','Tarjeta','Otro') DEFAULT NULL,
  `referenciaPago` varchar(100) DEFAULT NULL,
  `estado` enum('Pendiente','Pagado','Vencido','Anulado') NOT NULL DEFAULT 'Pendiente',
  `observaciones` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idPago`),
  KEY `idx_pago_contrato` (`idContrato`),
  CONSTRAINT `fk_pago_contrato`
    FOREIGN KEY (`idContrato`) REFERENCES `contrato` (`idContrato`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `documento` (
  `idDocumento` int unsigned NOT NULL AUTO_INCREMENT,
  `idContrato` int unsigned DEFAULT NULL,
  `idPropiedad` int unsigned DEFAULT NULL,
  `idUsuarioCarga` int unsigned NOT NULL,
  `nombreArchivo` varchar(180) NOT NULL,
  `tipoDocumento` enum('Contrato','Identificacion','Certificado','Foto','Otro') NOT NULL,
  `rutaArchivo` varchar(500) NOT NULL,
  `mimeType` varchar(100) DEFAULT NULL,
  `fechaCarga` datetime NOT NULL,
  `estado` enum('Activo','Archivado','Eliminado') NOT NULL DEFAULT 'Activo',
  PRIMARY KEY (`idDocumento`),
  KEY `idx_documento_contrato` (`idContrato`),
  KEY `idx_documento_propiedad` (`idPropiedad`),
  KEY `idx_documento_usuario` (`idUsuarioCarga`),
  CONSTRAINT `fk_documento_contrato`
    FOREIGN KEY (`idContrato`) REFERENCES `contrato` (`idContrato`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_documento_propiedad`
    FOREIGN KEY (`idPropiedad`) REFERENCES `propiedad` (`idPropiedad`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_documento_usuario`
    FOREIGN KEY (`idUsuarioCarga`) REFERENCES `usuario` (`idUsuario`)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `notificacion` (
  `idNotificacion` int unsigned NOT NULL AUTO_INCREMENT,
  `idUsuario` int unsigned NOT NULL,
  `titulo` varchar(120) NOT NULL,
  `mensaje` text NOT NULL,
  `tipo` enum('Contrato','Pago','Visita','Solicitud','Sistema') NOT NULL,
  `fechaCreacion` datetime NOT NULL,
  `fechaLectura` datetime DEFAULT NULL,
  `estado` enum('Pendiente','Enviada','Leida','Error') NOT NULL DEFAULT 'Enviada',
  PRIMARY KEY (`idNotificacion`),
  KEY `idx_notificacion_usuario` (`idUsuario`),
  CONSTRAINT `fk_notificacion_usuario`
    FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reporte` (
  `idReporte` int unsigned NOT NULL AUTO_INCREMENT,
  `idAdministrador` int unsigned NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `tipo` enum('Propiedades','Contratos','Pagos','Clientes','Visitas','General') NOT NULL,
  `fechaGeneracion` datetime NOT NULL,
  `parametros` json DEFAULT NULL,
  `rutaArchivo` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`idReporte`),
  KEY `idx_reporte_administrador` (`idAdministrador`),
  CONSTRAINT `fk_reporte_administrador`
    FOREIGN KEY (`idAdministrador`) REFERENCES `administrador` (`idAdministrador`)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `seguimiento` (
  `idSeguimiento` int unsigned NOT NULL AUTO_INCREMENT,
  `idUsuarioResponsable` int unsigned NOT NULL,
  `idCliente` int unsigned DEFAULT NULL,
  `idPropiedad` int unsigned DEFAULT NULL,
  `idSolicitud` int unsigned DEFAULT NULL,
  `fechaActividad` datetime NOT NULL,
  `tipoActividad` enum('Llamada','Correo','Reunion','Nota','CambioEstado','Otro') NOT NULL,
  `descripcion` text NOT NULL,
  PRIMARY KEY (`idSeguimiento`),
  KEY `idx_seguimiento_responsable` (`idUsuarioResponsable`),
  KEY `idx_seguimiento_cliente` (`idCliente`),
  KEY `idx_seguimiento_propiedad` (`idPropiedad`),
  KEY `idx_seguimiento_solicitud` (`idSolicitud`),
  CONSTRAINT `fk_seguimiento_responsable`
    FOREIGN KEY (`idUsuarioResponsable`) REFERENCES `usuario` (`idUsuario`)
    ON DELETE RESTRICT,
  CONSTRAINT `fk_seguimiento_cliente`
    FOREIGN KEY (`idCliente`) REFERENCES `cliente` (`idCliente`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_seguimiento_propiedad`
    FOREIGN KEY (`idPropiedad`) REFERENCES `propiedad` (`idPropiedad`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_seguimiento_solicitud`
    FOREIGN KEY (`idSolicitud`) REFERENCES `solicitud_arrendamiento` (`idSolicitud`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `mantenimiento` (
  `idMantenimiento` int unsigned NOT NULL AUTO_INCREMENT,
  `idPropiedad` int unsigned NOT NULL,
  `tipo` enum('Correctivo','Preventivo') NOT NULL DEFAULT 'Correctivo',
  `descripcion` text NOT NULL,
  `prioridad` enum('Baja','Media','Alta') NOT NULL DEFAULT 'Media',
  `estado` enum('Pendiente','EnProceso','Completado','Cancelado') NOT NULL DEFAULT 'Pendiente',
  `responsable` varchar(120) DEFAULT NULL,
  `fechaProgramada` date DEFAULT NULL,
  `fechaCompletado` datetime DEFAULT NULL,
  `costo` decimal(12,2) DEFAULT NULL,
  `notas` text,
  `fechaCreacion` datetime NOT NULL,
  PRIMARY KEY (`idMantenimiento`),
  KEY `idx_mantenimiento_propiedad` (`idPropiedad`),
  CONSTRAINT `fk_mantenimiento_propiedad`
    FOREIGN KEY (`idPropiedad`) REFERENCES `propiedad` (`idPropiedad`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELIMITER //

CREATE TRIGGER `trg_usuario_before_insert`
BEFORE INSERT ON `usuario`
FOR EACH ROW
BEGIN
  SET NEW.correo = LOWER(TRIM(NEW.correo));
  IF NEW.fechaCreacion IS NULL THEN
    SET NEW.fechaCreacion = NOW();
  END IF;
  IF LEFT(NEW.contrasenaHash, 4) NOT IN ('$2a$', '$2b$', '$2y$')
     AND CHAR_LENGTH(NEW.contrasenaHash) <> 64 THEN
    SET NEW.contrasenaHash = SHA2(NEW.contrasenaHash, 256);
  END IF;
END //

CREATE TRIGGER `trg_usuario_before_update`
BEFORE UPDATE ON `usuario`
FOR EACH ROW
BEGIN
  SET NEW.correo = LOWER(TRIM(NEW.correo));
  IF NEW.contrasenaHash <> OLD.contrasenaHash
     AND LEFT(NEW.contrasenaHash, 4) NOT IN ('$2a$', '$2b$', '$2y$')
     AND CHAR_LENGTH(NEW.contrasenaHash) <> 64 THEN
    SET NEW.contrasenaHash = SHA2(NEW.contrasenaHash, 256);
  END IF;
END //

DELIMITER ;

INSERT INTO `usuario` (`nombre`, `apellido`, `correo`, `contrasenaHash`, `telefono`, `rol`, `estado`, `fechaCreacion`, `ultimoAcceso`, `resetToken`, `resetTokenExpiry`) VALUES
('Zahira', 'González', 'zahira.gonzalez@estateops.com', 'AdminHMR01*', '3001112233', 'Administrador', 'Activo', '2026-08-01 08:00:00', '2026-11-18 07:30:00', NULL, NULL),
('Juan Carlos', 'Rojas', 'juan.rojas@estateops.com', 'AdminHMR02*', '3002223344', 'Administrador', 'Activo', '2026-08-01 08:15:00', '2026-11-18 07:45:00', NULL, NULL),
('Juan Camilo', 'Garzón', 'camilo.garzon@estateops.com', 'AdminHMR03*', '3003334455', 'Administrador', 'Activo', '2026-08-02 09:00:00', '2026-11-17 18:20:00', NULL, NULL),
('David', 'Rojas', 'david.rojas@estateops.com', 'AdminHMR04*', '3004445566', 'Administrador', 'Activo', '2026-08-02 09:15:00', '2026-11-17 16:10:00', NULL, NULL),
('Alison', 'Garnica', 'alison.garnica@estateops.com', 'AdminHMR05*', '3005556677', 'Administrador', 'Activo', '2026-08-03 10:00:00', '2026-11-18 07:10:00', NULL, NULL),
('Jimmy', 'Pulido', 'jimmy.pulido@estateops.com', 'AdminHMR06*', '3006667788', 'Administrador', 'Activo', '2026-08-03 10:30:00', '2026-11-16 14:00:00', NULL, NULL),
('María', 'Fernández', 'maria.fernandez@gmail.com', 'Cliente07*', '3101234567', 'Cliente', 'Activo', '2026-09-01 10:00:00', '2026-11-17 15:30:00', NULL, NULL),
('Jorge', 'Ramírez', 'jorge.ramirez@hotmail.com', 'Cliente08*', '3112345678', 'Cliente', 'Activo', '2026-09-05 11:20:00', '2026-11-16 09:40:00', NULL, NULL),
('Camila', 'Torres', 'camila.torres@outlook.com', 'Cliente09*', '3123456789', 'Cliente', 'Activo', '2026-09-10 14:00:00', '2026-11-18 06:50:00', NULL, NULL),
('Daniel', 'Vargas', 'daniel.vargas@gmail.com', 'Cliente10*', '3134567890', 'Cliente', 'Activo', '2026-09-15 16:30:00', '2026-11-15 19:00:00', 'tok_reset_9812ab34cd', '2026-11-19 19:00:00'),
('Sofía', 'Castro', 'sofia.castro@yahoo.com', 'Cliente11*', '3145678901', 'Cliente', 'Activo', '2026-10-01 09:00:00', '2026-11-14 12:15:00', NULL, NULL),
('Mateo', 'Morales', 'mateo.morales@gmail.com', 'Cliente12*', '3156789012', 'Cliente', 'Activo', '2026-10-10 10:45:00', '2026-11-17 11:05:00', NULL, NULL),
('Valentina', 'Ortiz', 'valentina.ortiz@gmail.com', 'Cliente13*', '3167890123', 'Cliente', 'Activo', '2026-10-20 13:00:00', '2026-11-12 08:30:00', NULL, NULL),
('Alejandro', 'Gutiérrez', 'alejo.gutierrez@outlook.com', 'Cliente14*', '3178901234', 'Cliente', 'Activo', '2026-11-15 17:00:00', NULL, NULL, NULL),
('Esteban', 'Díaz', 'esteban.diaz@estateops.com', 'Asesor15*', '3201112233', 'Asesor', 'Activo', '2026-08-15 08:30:00', '2026-11-18 07:40:00', NULL, NULL),
('Paula', 'Sánchez', 'paula.sanchez@estateops.com', 'Asesor16*', '3212223344', 'Asesor', 'Activo', '2026-08-15 08:45:00', '2026-11-18 07:20:00', NULL, NULL),
('Diego', 'Romero', 'diego.romero@estateops.com', 'Asesor17*', '3223334455', 'Asesor', 'Activo', '2026-09-01 09:00:00', '2026-11-17 17:00:00', NULL, NULL),
('Luisa', 'Herrera', 'luisa.herrera@estateops.com', 'Asesor18*', '3234445566', 'Asesor', 'Activo', '2026-11-10 09:00:00', '2026-11-17 10:00:00', NULL, NULL);

INSERT INTO `administrador` (`idAdministrador`, `areaResponsable`) VALUES
(1, 'Dirección Académica y Auditoría'),
(2, 'Arquitectura de Software y Base de Datos'),
(3, 'Desarrollo Backend y APIs'),
(4, 'Desarrollo Frontend y Catálogo Web'),
(5, 'Gestión Documental y Contratos'),
(6, 'Operaciones y Mantenimiento');

INSERT INTO `cliente` (`idCliente`, `tipoDocumento`, `numeroDocumento`, `direccion`, `preferencias`) VALUES
(7, 'CC', '1019001001', 'Calle 100 # 15-20, Bogotá', 'Apartamento de 2 habitaciones cerca a vías principales'),
(8, 'CC', '1019001002', 'Carrera 7 # 45-10, Bogotá', 'Casa amplia en sector residencial del norte'),
(9, 'CE', '50987612', 'Calle 72 # 10-34, Bogotá', 'Local comercial con alto tráfico peatonal'),
(10, 'NIT', '900456789-1', 'Av. El Dorado # 68C-61, Bogotá', 'Oficina corporativa con salas de juntas'),
(11, 'CC', '1020304050', 'Carrera 15 # 85-30, Bogotá', 'Apartaestudio moderno en Chapinero o Usaquén'),
(12, 'Pasaporte', 'AB987654', 'Calle 127 # 19-40, Bogotá', 'Apartamento en venta con vista exterior y balcón'),
(13, 'CC', '1032456789', 'Av. Suba # 115-45, Bogotá', 'Casa o apartamento familiar con parqueadero doble'),
(14, 'CC', '1018456123', 'Calle 53 # 24-12, Bogotá', 'Bodega o local comercial en zona central');

INSERT INTO `propietario` (`nombre`, `tipoDocumento`, `numeroDocumento`, `correo`, `telefono`, `direccionContacto`, `estado`) VALUES
('Grupo Inmobiliario HMR S.A.S.', 'NIT', '900987654-3', 'gerencia@inmobiliariahmr.com', '6017458900', 'Calle 93 # 12-14 Of. 402', 'Activo'),
('Roberto Gómez Bolaños', 'CC', '19283746', 'roberto.gomez@gmail.com', '3151112233', 'Carrera 11 # 82-01', 'Activo'),
('Inversiones El Nogal S.A.S.', 'NIT', '901234567-8', 'contacto@elnogal.co', '6013102030', 'Calle 78 # 11-20', 'Activo'),
('Esperanza Gómez Patiño', 'CC', '51987654', 'esperanza.gp@hotmail.com', '3162223344', 'Av. Pepe Sierra # 15-40', 'Activo'),
('Beatriz Pinzón Solano', 'CC', '35498712', 'betty.pinzon@yahoo.com', '3184445566', 'Calle 53 # 13-45', 'Activo'),
('Constructora Sabana Norte S.A.', 'NIT', '860002130-5', 'comercial@sabananorte.com', '6016001122', 'Calle 116 # 7-15', 'Activo'),
('Hernán Peláez Restrepo', 'CC', '14253647', 'hernan.pelaez@outlook.com', '3117778899', 'Calle 106 # 18-35', 'Activo');

INSERT INTO `propiedad` (`idPropietario`, `codigoInmueble`, `tipo`, `operacion`, `direccion`, `ciudad`, `barrio`, `descripcion`, `areaM2`, `habitaciones`, `banos`, `precio`, `estado`, `fechaRegistro`, `titulo`, `localidad`, `pisos`, `caracteristicas`, `imagenes`, `imagenPrincipal`, `publicada`, `destacada`) VALUES
(1, 'HMR-001', 'Apartamento', 'Arriendo', 'Calle 100 # 15-30 Apt 401', 'Bogotá', 'Chicó Norte', 'Apartamento iluminado con balcón, cocina integral abierta y dos garajes cubiertos.', 88.50, 2, 2, 3600000.00, 'Arrendada', '2026-08-10 10:00:00', 'Apartamento Moderno en Chicó Norte', 'Chapinero', 1, 'Ascensor, Vigilancia 24/7, Gimnasio, Salón Comunal', '["/uploads/propiedades/hmr001_1.jpg", "/uploads/propiedades/hmr001_2.jpg"]', '/uploads/propiedades/hmr001_1.jpg', 1, 1),
(2, 'HMR-002', 'Casa', 'Arriendo', 'Carrera 20 # 145-12', 'Bogotá', 'Cedritos', 'Casa familiar de tres niveles con jardín interior, estudio y cuarto de servicio.', 175.00, 4, 3, 5400000.00, 'Arrendada', '2026-08-15 11:30:00', 'Amplia Casa Familiar en Cedritos', 'Usaquén', 3, 'Jardín privado, Chimenea, Zona BBQ, 2 Parqueaderos', '["/uploads/propiedades/hmr002_1.jpg", "/uploads/propiedades/hmr002_2.jpg"]', '/uploads/propiedades/hmr002_1.jpg', 1, 1),
(3, 'HMR-003', 'Local', 'Arriendo', 'Calle 72 # 13-40 Local 102', 'Bogotá', 'Zona G', 'Local comercial esquinero con vitrina de doble altura sobre vía principal.', 52.00, 0, 1, 4900000.00, 'Disponible', '2026-09-01 09:15:00', 'Local Comercial Esquinero Zona G', 'Chapinero', 1, 'Vitrina en vidrio templado, Depósito, Luz trifásica', '["/uploads/propiedades/hmr003_1.jpg"]', '/uploads/propiedades/hmr003_1.jpg', 1, 1),
(4, 'HMR-004', 'Oficina', 'Arriendo', 'Carrera 7 # 71-21 Ofi 802', 'Bogotá', 'Rosales', 'Oficina ejecutiva con vista panorámica a los cerros orientales y sala de juntas.', 74.00, 2, 2, 4100000.00, 'Reservada', '2026-09-10 14:00:00', 'Oficina Corporativa Torre Carrera 7', 'Chapinero', 1, 'Aire acondicionado, Planta eléctrica, Sala de juntas', '["/uploads/propiedades/hmr004_1.jpg", "/uploads/propiedades/hmr004_2.jpg"]', '/uploads/propiedades/hmr004_1.jpg', 1, 0),
(5, 'HMR-005', 'Apartamento', 'Arriendo', 'Carrera 15 # 63-40 Apt 302', 'Bogotá', 'Chapinero Central', 'Apartaestudio funcional ideal para estudiantes o ejecutivos, cerca a TransMilenio.', 44.00, 1, 1, 1950000.00, 'Arrendada', '2026-09-18 10:00:00', 'Apartaestudio Central en Chapinero', 'Chapinero', 1, 'Lavandería comunal, Terraza BBQ, Portería', '["/uploads/propiedades/hmr005_1.jpg"]', '/uploads/propiedades/hmr005_1.jpg', 1, 0),
(6, 'HMR-006', 'Apartamento', 'Venta', 'Calle 134 # 19-50 Apt 1203', 'Bogotá', 'Contador', 'Apartamento dúplex recién remodelado con terraza privada y acabados de lujo.', 120.00, 3, 3, 690000000.00, 'Disponible', '2026-10-01 16:20:00', 'Apartamento Dúplex en Venta Contador', 'Usaquén', 2, 'Terraza privada, Estufa de inducción, 2 Garajes en línea', '["/uploads/propiedades/hmr006_1.jpg", "/uploads/propiedades/hmr006_2.jpg"]', '/uploads/propiedades/hmr006_1.jpg', 1, 1),
(1, 'HMR-007', 'Casa', 'Ambos', 'Calle 170 # 54-12', 'Bogotá', 'Villa del Prado', 'Casa esquinera apta para vivienda multifamiliar o sede administrativa.', 215.00, 5, 4, 6200000.00, 'Disponible', '2026-10-12 12:10:00', 'Casa Esquinera Uso Mixto Villa del Prado', 'Suba', 2, 'Patio cubierto, Ante-jardín, 3 Parqueaderos', '["/uploads/propiedades/hmr007_1.jpg"]', '/uploads/propiedades/hmr007_1.jpg', 1, 0),
(3, 'HMR-008', 'Lote', 'Venta', 'Autopista Norte Km 19 Lote 8', 'Bogotá', 'Guaymaral', 'Lote plano urbanizado con acometidas de servicios públicos listas para construir.', 480.00, 0, 0, 520000000.00, 'Disponible', '2026-10-20 08:45:00', 'Lote Urbanizado Sector Guaymaral', 'Suba', 1, 'Cerramiento perimetral, Vía pavimentada, Uso residencial', '["/uploads/propiedades/hmr008_1.jpg"]', '/uploads/propiedades/hmr008_1.jpg', 1, 0),
(4, 'HMR-009', 'Otro', 'Arriendo', 'Calle 13 # 68-45 Bodega 3', 'Bogotá', 'Montevideo', 'Bodega industrial de doble altura con piso de alta resistencia y zona de oficinas.', 320.00, 2, 2, 8800000.00, 'Disponible', '2026-11-01 09:00:00', 'Bodega Logística Zona Industrial Montevideo', 'Fontibón', 2, 'Altura libre 8m, Muelle de carga, Energía trifásica', '["/uploads/propiedades/hmr009_1.jpg"]', '/uploads/propiedades/hmr009_1.jpg', 1, 0),
(2, 'HMR-010', 'Apartamento', 'Arriendo', 'Carrera 24 # 40-18 Apt 201', 'Bogotá', 'La Soledad', 'Apartamento clásico de techos altos en sector patrimonial de Teusaquillo.', 95.00, 3, 2, 2700000.00, 'Inactiva', '2026-11-05 14:45:00', 'Apartamento Clásico en La Soledad', 'Teusaquillo', 1, 'Pisos en madera natural, Estudio independiente, Balcón', '["/uploads/propiedades/hmr010_1.jpg"]', '/uploads/propiedades/hmr010_1.jpg', 0, 0);

INSERT INTO `visita` (`idCliente`, `idPropiedad`, `idAsesor`, `fechaHora`, `estado`, `observaciones`) VALUES
(7, 1, 15, '2026-08-20 10:00:00', 'Realizada', 'Cliente conforme con iluminación y distribución. Procede a solicitud.'),
(8, 2, 16, '2026-08-22 11:30:00', 'Realizada', 'Visita en familia; aprobaron el espacio del patio.'),
(9, 3, 17, '2026-11-19 14:00:00', 'Confirmada', 'Revisará adecuaciones permitidas para cafetería.'),
(10, 4, 15, '2026-11-10 09:30:00', 'Realizada', 'Empresa interesada en tomar la oficina por 2 años.'),
(11, 5, 16, '2026-09-22 15:00:00', 'Realizada', 'Visita puntual y radicación inmediata de documentos.'),
(12, 6, 17, '2026-11-20 16:00:00', 'Confirmada', 'Segunda visita con arquitecto para revisar terraza.'),
(13, 7, NULL, '2026-11-22 10:30:00', 'Pendiente', 'Agendada desde el portal web; pendiente asignar asesor.'),
(9, 9, NULL, '2026-11-23 11:00:00', 'Pendiente', 'Solicitud de recorrido técnico en bodega; sin asesor aún.');

INSERT INTO `solicitud_arrendamiento` (`idCliente`, `idPropiedad`, `fechaSolicitud`, `ingresosMensuales`, `estado`, `observaciones`) VALUES
(7, 1, '2026-08-21 09:00:00', 11500000.00, 'Aprobada', 'Aprobada con póliza de arrendamiento sin codeudor.'),
(8, 2, '2026-08-23 10:15:00', 17500000.00, 'Aprobada', 'Documentación laboral y extractos verificados.'),
(11, 5, '2026-09-23 11:00:00', 6800000.00, 'Aprobada', 'Codeudor con finca raíz validado exitosamente.'),
(10, 4, '2026-11-11 14:30:00', 28000000.00, 'EnRevision', 'Validando cámara de comercio y estados financieros.'),
(9, 3, '2026-11-15 16:00:00', 14000000.00, 'Recibida', 'Radicada en línea; pendiente estudio de crédito.'),
(13, 7, '2026-11-16 12:00:00', 9000000.00, 'Rechazada', 'Capacidad de endeudamiento insuficiente para el canon.');

INSERT INTO `contrato` (`idCliente`, `idPropiedad`, `idPropietario`, `tipoContrato`, `fechaInicio`, `fechaFin`, `valorMensual`, `valorTotal`, `estado`, `fechaCreacion`, `firmado`, `fechaFirma`) VALUES
(7, 1, 1, 'Arrendamiento', '2026-09-01', '2027-08-31', 3600000.00, 43200000.00, 'Vigente', '2026-08-25 10:00:00', 1, '2026-08-28 16:30:00'),
(8, 2, 2, 'Arrendamiento', '2026-09-01', '2027-08-31', 5400000.00, 64800000.00, 'Vigente', '2026-08-26 11:00:00', 1, '2026-08-29 11:15:00'),
(11, 5, 5, 'Arrendamiento', '2026-10-01', '2027-09-30', 1950000.00, 23400000.00, 'Vigente', '2026-09-26 15:00:00', 1, '2026-09-29 17:45:00'),
(10, 4, 4, 'Arrendamiento', '2026-12-01', '2027-11-30', 4100000.00, 49200000.00, 'Borrador', '2026-11-14 09:30:00', 0, NULL),
(12, 6, 6, 'Compraventa', '2026-11-25', NULL, NULL, 690000000.00, 'Borrador', '2026-11-17 10:00:00', 0, NULL);

INSERT INTO `pago` (`idContrato`, `periodo`, `fechaVencimiento`, `fechaPago`, `valor`, `metodoPago`, `referenciaPago`, `estado`, `observaciones`) VALUES
(1, '2026-09', '2026-09-05', '2026-09-03', 3600000.00, 'Transferencia', 'PSE-901122', 'Pagado', 'Primer canon mensual'),
(1, '2026-10', '2026-10-05', '2026-10-04', 3600000.00, 'Transferencia', 'PSE-902233', 'Pagado', 'Pago oportuno'),
(1, '2026-11', '2026-11-05', '2026-11-05', 3600000.00, 'Tarjeta', 'TC-774411', 'Pagado', 'Pago mes noviembre'),
(2, '2026-09', '2026-09-05', '2026-09-05', 5400000.00, 'Transferencia', 'TR-551100', 'Pagado', 'Canon septiembre al día'),
(2, '2026-10', '2026-10-05', '2026-10-06', 5400000.00, 'Efectivo', 'EF-00312', 'Pagado', 'Recaudo en oficina principal'),
(2, '2026-11', '2026-11-05', NULL, 5400000.00, NULL, NULL, 'Vencido', 'En gestión de cobro preventivo'),
(3, '2026-10', '2026-10-05', '2026-10-02', 1950000.00, 'Transferencia', 'PSE-883321', 'Pagado', 'Primer canon apartaestudio'),
(3, '2026-11', '2026-11-05', NULL, 1950000.00, NULL, NULL, 'Pendiente', 'Acuerdo de pago para el 20 de noviembre');

INSERT INTO `documento` (`idContrato`, `idPropiedad`, `idUsuarioCarga`, `nombreArchivo`, `tipoDocumento`, `rutaArchivo`, `mimeType`, `fechaCarga`, `estado`) VALUES
(1, 1, 5, 'contrato_arriendo_HMR001.pdf', 'Contrato', '/uploads/contratos/contrato_HMR001.pdf', 'application/pdf', '2026-08-28 16:40:00', 'Activo'),
(2, 2, 5, 'contrato_arriendo_HMR002.pdf', 'Contrato', '/uploads/contratos/contrato_HMR002.pdf', 'application/pdf', '2026-08-29 11:30:00', 'Activo'),
(3, 5, 5, 'contrato_arriendo_HMR005.pdf', 'Contrato', '/uploads/contratos/contrato_HMR005.pdf', 'application/pdf', '2026-09-29 18:00:00', 'Activo'),
(NULL, 1, 15, 'certificado_tradicion_HMR001.pdf', 'Certificado', '/uploads/propiedades/tradicion_HMR001.pdf', 'application/pdf', '2026-08-10 10:15:00', 'Activo'),
(NULL, 3, 17, 'plano_local_HMR003.pdf', 'Otro', '/uploads/propiedades/plano_HMR003.pdf', 'application/pdf', '2026-09-01 09:30:00', 'Activo'),
(4, 4, 2, 'rut_empresa_daniel_vargas.pdf', 'Identificacion', '/uploads/clientes/rut_daniel.pdf', 'application/pdf', '2026-11-11 14:40:00', 'Activo');

INSERT INTO `notificacion` (`idUsuario`, `titulo`, `mensaje`, `tipo`, `fechaCreacion`, `fechaLectura`, `estado`) VALUES
(7, 'Contrato Firmado Exitosamente', 'Tu contrato de arrendamiento para HMR-001 ya está vigente.', 'Contrato', '2026-08-28 16:35:00', '2026-08-28 17:00:00', 'Leida'),
(8, 'Recordatorio de Canon Vencido', 'El pago del periodo 2026-11 para la casa HMR-002 se encuentra vencido.', 'Pago', '2026-11-07 08:00:00', NULL, 'Enviada'),
(9, 'Visita Confirmada en Zona G', 'Tu visita al local HMR-003 está confirmada con el asesor Diego Romero.', 'Visita', '2026-11-17 09:00:00', '2026-11-17 09:25:00', 'Leida'),
(10, 'Solicitud en Estudio', 'Estamos validando los documentos financieros para la oficina HMR-004.', 'Solicitud', '2026-11-12 10:00:00', '2026-11-12 11:10:00', 'Leida'),
(2, 'Mantenimiento Urgente Reportado', 'Se registró una solicitud de prioridad Alta en el inmueble HMR-002.', 'Sistema', '2026-11-15 14:00:00', '2026-11-15 14:15:00', 'Leida'),
(13, 'Visita Pendiente de Asignación', 'Hemos recibido tu solicitud de visita para la casa HMR-007.', 'Visita', '2026-11-18 07:00:00', NULL, 'Pendiente');

INSERT INTO `reporte` (`idAdministrador`, `nombre`, `tipo`, `fechaGeneracion`, `parametros`, `rutaArchivo`) VALUES
(1, 'Inventario_Propiedades_Nov2026', 'Propiedades', '2026-11-01 08:00:00', '{"ciudad": "Bogotá", "publicada": true}', '/exports/inventario_nov2026.pdf'),
(2, 'Estado_Contratos_Vigentes_Q4', 'Contratos', '2026-11-05 09:30:00', '{"estado": "Vigente", "firmado": true}', '/exports/contratos_vigentes_q4.pdf'),
(5, 'Cartera_Pagos_Noviembre_2026', 'Pagos', '2026-11-10 11:00:00', '{"periodo": "2026-11"}', '/exports/cartera_nov2026.xlsx'),
(6, 'Gestion_Comercial_Asesores', 'Visitas', '2026-11-15 16:00:00', '{"mes": 11, "anio": 2026}', '/exports/visitas_asesores_nov2026.pdf');

INSERT INTO `seguimiento` (`idUsuarioResponsable`, `idCliente`, `idPropiedad`, `idSolicitud`, `fechaActividad`, `tipoActividad`, `descripcion`) VALUES
(15, 7, 1, 1, '2026-08-22 10:30:00', 'Llamada', 'Confirmación de aprobación de póliza y agendamiento de firma.'),
(16, 8, 2, 2, '2026-08-24 14:00:00', 'Correo', 'Envío de inventario físico del inmueble antes de la entrega.'),
(15, 10, 4, 4, '2026-11-12 11:30:00', 'Reunion', 'Reunión con representante legal para revisar cláusulas de adecuación.'),
(17, 9, 3, 5, '2026-11-16 09:45:00', 'Nota', 'Cliente solicita 15 días de gracia para adecuación del local.'),
(16, 11, 5, 3, '2026-09-25 16:20:00', 'CambioEstado', 'Solicitud marcada como Aprobada tras validar codeudor.'),
(17, 12, 6, NULL, '2026-11-17 15:10:00', 'Llamada', 'Cliente interesado en oferta de contado para el apartamento dúplex.');

INSERT INTO `mantenimiento` (`idPropiedad`, `tipo`, `descripcion`, `prioridad`, `estado`, `responsable`, `fechaProgramada`, `fechaCompletado`, `costo`, `notas`, `fechaCreacion`) VALUES
(1, 'Preventivo', 'Mantenimiento semestral de calentador a gas y revisión de grifería.', 'Baja', 'Completado', 'ServiHogar Bogotá S.A.S.', '2026-10-15', '2026-10-15 15:30:00', 180000.00, 'Equipo operando al 100%, sin fugas.', '2026-10-10 09:00:00'),
(2, 'Correctivo', 'Reparación de filtración en cubierta del tercer nivel y resane de techo.', 'Alta', 'EnProceso', 'Construcciones & Cubiertas Ruiz', '2026-11-19', NULL, 950000.00, 'Se impermeabilizó el área externa; falta pintura interior.', '2026-11-15 13:45:00'),
(4, 'Preventivo', 'Limpieza y recarga de gas de unidades de aire acondicionado de la oficina.', 'Media', 'Pendiente', 'ClimaTech Colombia', '2026-11-24', NULL, 420000.00, 'Programado antes del ingreso del nuevo arrendatario.', '2026-11-16 10:20:00'),
(7, 'Correctivo', 'Cambio de chapa principal de seguridad y ajuste de portón vehicular.', 'Media', 'Completado', 'Cerrajeros Express 24h', '2026-10-28', '2026-10-28 17:00:00', 310000.00, 'Se entregaron 4 juegos de llaves nuevas a administración.', '2026-10-25 11:00:00'),
(9, 'Preventivo', 'Revisión de tablero eléctrico trifásico y lubricación de persiana metálica.', 'Alta', 'Pendiente', 'Ingeniería Eléctrica del Norte', '2026-11-21', NULL, 650000.00, 'Requisito técnico previo a exhibición comercial.', '2026-11-17 08:30:00');

DELIMITER //

CREATE TRIGGER `trg_contrato_after_insert`
AFTER INSERT ON `contrato`
FOR EACH ROW
BEGIN
  DECLARE v_codigo VARCHAR(30);

  SELECT codigoInmueble INTO v_codigo
  FROM propiedad
  WHERE idPropiedad = NEW.idPropiedad;

  IF NEW.estado = 'Vigente' THEN
    UPDATE propiedad
    SET estado = IF(NEW.tipoContrato = 'Compraventa', 'Vendida', 'Arrendada')
    WHERE idPropiedad = NEW.idPropiedad;

    INSERT INTO notificacion (`idUsuario`, `titulo`, `mensaje`, `tipo`, `fechaCreacion`, `estado`)
    VALUES (
      NEW.idCliente,
      'Contrato Activado en EstateOps',
      CONCAT('Tu contrato de ', NEW.tipoContrato, ' para el inmueble ', v_codigo, ' ya se encuentra vigente.'),
      'Contrato',
      NOW(),
      'Enviada'
    );
  END IF;
END //

CREATE TRIGGER `trg_contrato_after_update`
AFTER UPDATE ON `contrato`
FOR EACH ROW
BEGIN
  DECLARE v_codigo VARCHAR(30);

  IF OLD.estado <> 'Vigente' AND NEW.estado = 'Vigente' THEN
    SELECT codigoInmueble INTO v_codigo
    FROM propiedad
    WHERE idPropiedad = NEW.idPropiedad;

    UPDATE propiedad
    SET estado = IF(NEW.tipoContrato = 'Compraventa', 'Vendida', 'Arrendada')
    WHERE idPropiedad = NEW.idPropiedad;

    INSERT INTO notificacion (`idUsuario`, `titulo`, `mensaje`, `tipo`, `fechaCreacion`, `estado`)
    VALUES (
      NEW.idCliente,
      'Contrato Formalizado y Vigente',
      CONCAT('El contrato #', NEW.idContrato, ' del inmueble ', v_codigo, ' ha cambiado a estado Vigente.'),
      'Contrato',
      NOW(),
      'Enviada'
    );
  END IF;
END //

CREATE TRIGGER `trg_solicitud_after_update`
AFTER UPDATE ON `solicitud_arrendamiento`
FOR EACH ROW
BEGIN
  DECLARE v_codigo VARCHAR(30);

  IF OLD.estado <> NEW.estado THEN
    SELECT codigoInmueble INTO v_codigo
    FROM propiedad
    WHERE idPropiedad = NEW.idPropiedad;

    INSERT INTO notificacion (`idUsuario`, `titulo`, `mensaje`, `tipo`, `fechaCreacion`, `estado`)
    VALUES (
      NEW.idCliente,
      'Actualización en tu Solicitud de Arrendamiento',
      CONCAT('Tu solicitud para el inmueble ', v_codigo, ' cambió de estado a: ', NEW.estado, '.'),
      'Solicitud',
      NOW(),
      'Enviada'
    );
  END IF;
END //

CREATE TRIGGER `trg_pago_before_insert`
BEFORE INSERT ON `pago`
FOR EACH ROW
BEGIN
  IF NEW.fechaPago IS NOT NULL AND NEW.estado = 'Pendiente' THEN
    SET NEW.estado = 'Pagado';
  END IF;
END //

CREATE TRIGGER `trg_mantenimiento_after_insert`
AFTER INSERT ON `mantenimiento`
FOR EACH ROW
BEGIN
  DECLARE v_codigo VARCHAR(30);
  DECLARE v_idAdmin INT UNSIGNED;

  IF NEW.prioridad = 'Alta' THEN
    SELECT codigoInmueble INTO v_codigo
    FROM propiedad
    WHERE idPropiedad = NEW.idPropiedad;

    SELECT idAdministrador INTO v_idAdmin
    FROM administrador
    ORDER BY idAdministrador ASC
    LIMIT 1;

    IF v_idAdmin IS NOT NULL THEN
      INSERT INTO notificacion (`idUsuario`, `titulo`, `mensaje`, `tipo`, `fechaCreacion`, `estado`)
      VALUES (
        v_idAdmin,
        'Alerta de Mantenimiento Prioridad Alta',
        CONCAT('Se registró un mantenimiento ', NEW.tipo, ' urgente para el inmueble ', v_codigo, '.'),
        'Sistema',
        NOW(),
        'Enviada'
      );
    END IF;
  END IF;
END //

DELIMITER ;

CREATE OR REPLACE VIEW `vw_catalogo_publico_propiedades` AS
SELECT
  p.idPropiedad,
  p.codigoInmueble,
  p.titulo,
  p.tipo,
  p.operacion,
  p.ciudad,
  p.localidad,
  p.barrio,
  p.descripcion,
  p.areaM2,
  p.habitaciones,
  p.banos,
  p.pisos,
  p.precio,
  p.estado,
  p.caracteristicas,
  p.imagenes,
  p.imagenPrincipal,
  p.destacada,
  p.fechaRegistro
FROM propiedad p
WHERE p.publicada = 1
  AND p.estado IN ('Disponible', 'Reservada');

CREATE OR REPLACE VIEW `vw_usuarios_sin_datos_sensibles` AS
SELECT
  u.idUsuario,
  CONCAT(u.nombre, ' ', u.apellido) AS nombreCompleto,
  CONCAT(LEFT(u.correo, 3), '***@', SUBSTRING_INDEX(u.correo, '@', -1)) AS correoEnmascarado,
  u.rol,
  u.estado,
  u.fechaCreacion,
  u.ultimoAcceso
FROM usuario u;

CREATE OR REPLACE VIEW `vw_clientes_directorio_comercial` AS
SELECT
  c.idCliente,
  CONCAT(u.nombre, ' ', u.apellido) AS nombreCliente,
  c.tipoDocumento,
  CONCAT('******', RIGHT(c.numeroDocumento, 4)) AS documentoEnmascarado,
  u.telefono,
  c.preferencias,
  u.estado AS estadoCuenta
FROM cliente c
INNER JOIN usuario u ON c.idCliente = u.idUsuario;

CREATE OR REPLACE VIEW `vw_solicitudes_evaluacion_asesor` AS
SELECT
  s.idSolicitud,
  s.fechaSolicitud,
  CONCAT(u.nombre, ' ', u.apellido) AS solicitante,
  p.codigoInmueble,
  p.titulo AS inmueble,
  p.precio AS canonMensual,
  s.estado AS estadoSolicitud,
  s.observaciones
FROM solicitud_arrendamiento s
INNER JOIN cliente c ON s.idCliente = c.idCliente
INNER JOIN usuario u ON c.idCliente = u.idUsuario
INNER JOIN propiedad p ON s.idPropiedad = p.idPropiedad;

CREATE OR REPLACE VIEW `vw_resumen_pagos_cliente` AS
SELECT
  pg.idPago,
  pg.idContrato,
  ct.idCliente,
  p.codigoInmueble,
  pg.periodo,
  pg.fechaVencimiento,
  pg.fechaPago,
  pg.valor,
  pg.metodoPago,
  IF(pg.referenciaPago IS NULL, 'N/A', CONCAT('***', RIGHT(pg.referenciaPago, 4))) AS referenciaEnmascarada,
  pg.estado
FROM pago pg
INNER JOIN contrato ct ON pg.idContrato = ct.idContrato
INNER JOIN propiedad p ON ct.idPropiedad = p.idPropiedad;
