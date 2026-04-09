--
-- PostgreSQL database dump
--

\restrict gZsqclpUWVnH0fHXYp2OyHnPeqJi2WkGyRfPzrb0VfXIe3uhcFCnabw25fXgyNh

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: citas_estado_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.citas_estado_enum AS ENUM (
    'pendiente',
    'confirmada',
    'cancelada',
    'realizada'
);


--
-- Name: contratos_estado_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.contratos_estado_enum AS ENUM (
    'activo',
    'vencido',
    'cancelado',
    'por_vencer'
);


--
-- Name: propiedades_estado_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.propiedades_estado_enum AS ENUM (
    'disponible',
    'arrendada',
    'vendida',
    'inactiva'
);


--
-- Name: propiedades_operacion_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.propiedades_operacion_enum AS ENUM (
    'arriendo',
    'venta',
    'arriendo_venta'
);


--
-- Name: propiedades_tipo_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.propiedades_tipo_enum AS ENUM (
    'apartamento',
    'casa',
    'local',
    'oficina',
    'bodega',
    'lote',
    'finca'
);


--
-- Name: usuarios_rol_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.usuarios_rol_enum AS ENUM (
    'super_admin',
    'admin_inmuebles',
    'admin_contratos'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: citas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.citas (
    id integer NOT NULL,
    "propiedadId" integer,
    "propiedadTitulo" character varying,
    "clienteNombre" character varying NOT NULL,
    "clienteEmail" character varying NOT NULL,
    "clienteTelefono" character varying NOT NULL,
    fecha date NOT NULL,
    hora time without time zone NOT NULL,
    mensaje text,
    estado public.citas_estado_enum DEFAULT 'pendiente'::public.citas_estado_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: citas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.citas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: citas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.citas_id_seq OWNED BY public.citas.id;


--
-- Name: contratos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contratos (
    id integer NOT NULL,
    "propiedadId" integer NOT NULL,
    "propiedadTitulo" character varying NOT NULL,
    "arrendatarioNombre" character varying NOT NULL,
    "arrendatarioEmail" character varying NOT NULL,
    "arrendatarioTelefono" character varying,
    "arrendatarioCedula" character varying,
    "valorMensual" bigint NOT NULL,
    "fechaInicio" date NOT NULL,
    "fechaFin" date NOT NULL,
    estado public.contratos_estado_enum DEFAULT 'activo'::public.contratos_estado_enum NOT NULL,
    notas text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: contratos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contratos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contratos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contratos_id_seq OWNED BY public.contratos.id;


--
-- Name: propiedades; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.propiedades (
    id integer NOT NULL,
    titulo character varying NOT NULL,
    tipo public.propiedades_tipo_enum NOT NULL,
    operacion public.propiedades_operacion_enum NOT NULL,
    localidad character varying NOT NULL,
    barrio character varying,
    direccion character varying,
    precio bigint NOT NULL,
    area numeric(10,2),
    habitaciones integer,
    banos integer,
    pisos integer,
    descripcion text,
    caracteristicas character varying,
    imagenes json,
    "imagenPrincipal" character varying,
    estado public.propiedades_estado_enum DEFAULT 'disponible'::public.propiedades_estado_enum NOT NULL,
    publicada boolean DEFAULT true NOT NULL,
    destacada boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: propiedades_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.propiedades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: propiedades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.propiedades_id_seq OWNED BY public.propiedades.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    rol public.usuarios_rol_enum DEFAULT 'admin_inmuebles'::public.usuarios_rol_enum NOT NULL,
    telefono character varying,
    activo boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: citas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.citas ALTER COLUMN id SET DEFAULT nextval('public.citas_id_seq'::regclass);


--
-- Name: contratos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contratos ALTER COLUMN id SET DEFAULT nextval('public.contratos_id_seq'::regclass);


--
-- Name: propiedades id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.propiedades ALTER COLUMN id SET DEFAULT nextval('public.propiedades_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: citas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.citas (id, "propiedadId", "propiedadTitulo", "clienteNombre", "clienteEmail", "clienteTelefono", fecha, hora, mensaje, estado, "createdAt") FROM stdin;
\.


--
-- Data for Name: contratos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contratos (id, "propiedadId", "propiedadTitulo", "arrendatarioNombre", "arrendatarioEmail", "arrendatarioTelefono", "arrendatarioCedula", "valorMensual", "fechaInicio", "fechaFin", estado, notas, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: propiedades; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.propiedades (id, titulo, tipo, operacion, localidad, barrio, direccion, precio, area, habitaciones, banos, pisos, descripcion, caracteristicas, imagenes, "imagenPrincipal", estado, publicada, destacada, "createdAt", "updatedAt") FROM stdin;
4	Local en Galerías	local	arriendo	Galerías			2500000	14.00	\N	\N	\N	Local comercial en zona de alto tráfico.		["https://res.cloudinary.com/dpw6t5acx/image/upload/v1775697006/hmr-propiedades/uaanojqwgbyfxokjbhpx.png","https://res.cloudinary.com/dpw6t5acx/image/upload/v1775697020/hmr-propiedades/q0gcnln0eakqutwqjirp.png"]	https://res.cloudinary.com/dpw6t5acx/image/upload/v1775697006/hmr-propiedades/uaanojqwgbyfxokjbhpx.png	disponible	f	t	2026-04-05 14:15:27.317902	2026-04-09 00:52:50.377948
3	Apto en Cedritos	apartamento	venta	Cedritos	\N	\N	380000000	70.00	3	3	2	Apartamento dúplex en el mejor sector de Cedritos.	Parqueadero, seguridad 24h, ascensor	\N	\N	disponible	f	t	2026-04-05 14:15:27.312498	2026-04-09 00:52:51.501465
2	Local en Zipaquirá	local	arriendo	Zipaquirá	\N	\N	7500000	186.00	\N	2	1	Local comercial a una cuadra del centro turístico de Zipaquirá.	Área libre	\N	\N	disponible	f	t	2026-04-05 14:15:27.307888	2026-04-09 00:52:52.256533
1	Local en Zipaquirá	local	venta	Zipaquirá	\N	Cra. 7 #63-45	750000000	186.00	\N	2	1	Local comercial a una cuadra del centro turístico de Zipaquirá.	Área libre	\N	\N	disponible	f	t	2026-04-05 14:15:27.301496	2026-04-09 00:52:53.171313
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuarios (id, nombre, email, password, rol, telefono, activo, "createdAt", "updatedAt") FROM stdin;
1	Ivonne Maritza Rojas	grupoinmobiliariohmr@gmail.com	$2b$10$zkhm9z14iWKXHMB6rtlZ8eSQRCsQCjMO1SP0g7NYQsB.ab3vE510q	super_admin	3505063604	t	2026-04-05 14:15:27.277951	2026-04-05 14:15:27.277951
\.


--
-- Name: citas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.citas_id_seq', 7, true);


--
-- Name: contratos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contratos_id_seq', 2, true);


--
-- Name: propiedades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.propiedades_id_seq', 4, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, true);


--
-- Name: citas PK_43851fd780e10030fbe5bb1b912; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT "PK_43851fd780e10030fbe5bb1b912" PRIMARY KEY (id);


--
-- Name: contratos PK_cfae35069d6f59da899c17ed397; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contratos
    ADD CONSTRAINT "PK_cfae35069d6f59da899c17ed397" PRIMARY KEY (id);


--
-- Name: usuarios PK_d7281c63c176e152e4c531594a8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY (id);


--
-- Name: propiedades PK_ee3a1dc8c0d17c197d54bc2ff37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.propiedades
    ADD CONSTRAINT "PK_ee3a1dc8c0d17c197d54bc2ff37" PRIMARY KEY (id);


--
-- Name: usuarios UQ_446adfc18b35418aac32ae0b7b5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE (email);


--
-- PostgreSQL database dump complete
--

\unrestrict gZsqclpUWVnH0fHXYp2OyHnPeqJi2WkGyRfPzrb0VfXIe3uhcFCnabw25fXgyNh

