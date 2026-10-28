--
-- PostgreSQL database dump
--

\restrict qknfEIM92wwJbU9rAObFnDN65RqvMrgpRC83QwRKHOMNWNdqBznxq9DgdZa39DP

-- Dumped from database version 15.19
-- Dumped by pg_dump version 15.19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: maintenances_status_enum; Type: TYPE; Schema: public; Owner: fleetcore_user
--

CREATE TYPE public.maintenances_status_enum AS ENUM (
    'SCHEDULED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public.maintenances_status_enum OWNER TO fleetcore_user;

--
-- Name: maintenances_type_enum; Type: TYPE; Schema: public; Owner: fleetcore_user
--

CREATE TYPE public.maintenances_type_enum AS ENUM (
    'PREVENTIVE',
    'CORRECTIVE'
);


ALTER TYPE public.maintenances_type_enum OWNER TO fleetcore_user;

--
-- Name: mechanics_status_enum; Type: TYPE; Schema: public; Owner: fleetcore_user
--

CREATE TYPE public.mechanics_status_enum AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public.mechanics_status_enum OWNER TO fleetcore_user;

--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: fleetcore_user
--

CREATE TYPE public.users_role_enum AS ENUM (
    'ADMIN',
    'TECHNICIAN'
);


ALTER TYPE public.users_role_enum OWNER TO fleetcore_user;

--
-- Name: vehicles_status_enum; Type: TYPE; Schema: public; Owner: fleetcore_user
--

CREATE TYPE public.vehicles_status_enum AS ENUM (
    'AVAILABLE',
    'IN_MAINTENANCE',
    'INACTIVE'
);


ALTER TYPE public.vehicles_status_enum OWNER TO fleetcore_user;

--
-- Name: workshops_status_enum; Type: TYPE; Schema: public; Owner: fleetcore_user
--

CREATE TYPE public.workshops_status_enum AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public.workshops_status_enum OWNER TO fleetcore_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: maintenances; Type: TABLE; Schema: public; Owner: fleetcore_user
--

CREATE TABLE public.maintenances (
    id integer NOT NULL,
    type public.maintenances_type_enum NOT NULL,
    description character varying NOT NULL,
    mileage integer NOT NULL,
    "scheduledStart" timestamp without time zone NOT NULL,
    "scheduledEnd" timestamp without time zone NOT NULL,
    status public.maintenances_status_enum DEFAULT 'SCHEDULED'::public.maintenances_status_enum NOT NULL,
    "workPerformed" character varying,
    "finalCost" numeric(10,2),
    "completionDate" timestamp without time zone,
    "finalMileage" integer,
    "vehicleId" integer NOT NULL,
    "mechanicId" integer NOT NULL,
    "workshopId" integer NOT NULL
);


ALTER TABLE public.maintenances OWNER TO fleetcore_user;

--
-- Name: maintenances_id_seq; Type: SEQUENCE; Schema: public; Owner: fleetcore_user
--

CREATE SEQUENCE public.maintenances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.maintenances_id_seq OWNER TO fleetcore_user;

--
-- Name: maintenances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fleetcore_user
--

ALTER SEQUENCE public.maintenances_id_seq OWNED BY public.maintenances.id;


--
-- Name: mechanics; Type: TABLE; Schema: public; Owner: fleetcore_user
--

CREATE TABLE public.mechanics (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    specialty character varying NOT NULL,
    status public.mechanics_status_enum DEFAULT 'ACTIVE'::public.mechanics_status_enum NOT NULL
);


ALTER TABLE public.mechanics OWNER TO fleetcore_user;

--
-- Name: mechanics_id_seq; Type: SEQUENCE; Schema: public; Owner: fleetcore_user
--

CREATE SEQUENCE public.mechanics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mechanics_id_seq OWNER TO fleetcore_user;

--
-- Name: mechanics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fleetcore_user
--

ALTER SEQUENCE public.mechanics_id_seq OWNED BY public.mechanics.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: fleetcore_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    role public.users_role_enum DEFAULT 'TECHNICIAN'::public.users_role_enum NOT NULL
);


ALTER TABLE public.users OWNER TO fleetcore_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: fleetcore_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO fleetcore_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fleetcore_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: fleetcore_user
--

CREATE TABLE public.vehicles (
    id integer NOT NULL,
    plate character varying NOT NULL,
    brand character varying NOT NULL,
    model character varying NOT NULL,
    year integer NOT NULL,
    mileage integer DEFAULT 0 NOT NULL,
    status public.vehicles_status_enum DEFAULT 'AVAILABLE'::public.vehicles_status_enum NOT NULL
);


ALTER TABLE public.vehicles OWNER TO fleetcore_user;

--
-- Name: vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: fleetcore_user
--

CREATE SEQUENCE public.vehicles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vehicles_id_seq OWNER TO fleetcore_user;

--
-- Name: vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fleetcore_user
--

ALTER SEQUENCE public.vehicles_id_seq OWNED BY public.vehicles.id;


--
-- Name: workshops; Type: TABLE; Schema: public; Owner: fleetcore_user
--

CREATE TABLE public.workshops (
    id integer NOT NULL,
    name character varying NOT NULL,
    address character varying NOT NULL,
    status public.workshops_status_enum DEFAULT 'ACTIVE'::public.workshops_status_enum NOT NULL
);


ALTER TABLE public.workshops OWNER TO fleetcore_user;

--
-- Name: workshops_id_seq; Type: SEQUENCE; Schema: public; Owner: fleetcore_user
--

CREATE SEQUENCE public.workshops_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.workshops_id_seq OWNER TO fleetcore_user;

--
-- Name: workshops_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fleetcore_user
--

ALTER SEQUENCE public.workshops_id_seq OWNED BY public.workshops.id;


--
-- Name: maintenances id; Type: DEFAULT; Schema: public; Owner: fleetcore_user
--

ALTER TABLE ONLY public.maintenances ALTER COLUMN id SET DEFAULT nextval('public.maintenances_id_seq'::regclass);


--
-- Name: mechanics id; Type: DEFAULT; Schema: public; Owner: fleetcore_user
--

ALTER TABLE ONLY public.mechanics ALTER COLUMN id SET DEFAULT nextval('public.mechanics_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: fleetcore_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vehicles id; Type: DEFAULT; Schema: public; Owner: fleetcore_user
--

ALTER TABLE ONLY public.vehicles ALTER COLUMN id SET DEFAULT nextval('public.vehicles_id_seq'::regclass);


--
-- Name: workshops id; Type: DEFAULT; Schema: public; Owner: fleetcore_user
--

ALTER TABLE ONLY public.workshops ALTER COLUMN id SET DEFAULT nextval('public.workshops_id_seq'::regclass);


--
-- Data for Name: maintenances; Type: TABLE DATA; Schema: public; Owner: fleetcore_user
--

COPY public.maintenances (id, type, description, mileage, "scheduledStart", "scheduledEnd", status, "workPerformed", "finalCost", "completionDate", "finalMileage", "vehicleId", "mechanicId", "workshopId") FROM stdin;
1	PREVENTIVE	Mantenimiento preventivo general	15000	2026-10-01 09:00:00	2026-10-01 11:00:00	COMPLETED	Cambio de aceite y revisión general	350000.00	2026-10-01 11:00:00	15000	1	2	1
2	CORRECTIVE	Revisión de sistema de frenos	8000	2026-10-27 09:00:00	2026-10-27 12:00:00	IN_PROGRESS	\N	\N	\N	\N	3	3	1
3	PREVENTIVE	Inspección programada	22000	2026-11-02 09:00:00	2026-11-02 11:00:00	SCHEDULED	\N	\N	\N	\N	2	2	1
\.


--
-- Data for Name: mechanics; Type: TABLE DATA; Schema: public; Owner: fleetcore_user
--

COPY public.mechanics (id, name, email, specialty, status) FROM stdin;
2	Carlos Mendoza	tech1@fleetcore.com	Motor	ACTIVE
3	Andrés Pérez	tech2@fleetcore.com	Frenos	ACTIVE
4	Luis Torres	luis@fleetcore.com	Electricidad	INACTIVE
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: fleetcore_user
--

COPY public.users (id, email, password, role) FROM stdin;
1	admin@fleetcore.com	$2b$10$K5HkWWek4zVlsriqVqj2nO2eBSSJ3b4ME2hn1prnNfLCjnDNleQJi	TECHNICIAN
2	tech1@fleetcore.com	$2b$10$ayiCZ3GKiLwEDeYnQnxPbeH9iXLzISGNLzWlrOZDZhfAieTtC0NKi	TECHNICIAN
3	tech2@fleetcore.com	$2b$10$ayiCZ3GKiLwEDeYnQnxPbeH9iXLzISGNLzWlrOZDZhfAieTtC0NKi	TECHNICIAN
\.


--
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: fleetcore_user
--

COPY public.vehicles (id, plate, brand, model, year, mileage, status) FROM stdin;
1	FCR101	Toyota	Hilux	2023	15000	AVAILABLE
2	FCR102	Chevrolet	NPR	2022	22000	AVAILABLE
3	FCR103	Ford	Ranger	2024	8000	IN_MAINTENANCE
4	FCR104	Nissan	Frontier	2021	30000	INACTIVE
\.


--
-- Data for Name: workshops; Type: TABLE DATA; Schema: public; Owner: fleetcore_user
--

COPY public.workshops (id, name, address, status) FROM stdin;
1	Taller Central	Calle 30 #20-10	ACTIVE
2	Taller Norte	Carrera 50 #80-20	INACTIVE
\.


--
-- Name: maintenances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fleetcore_user
--

SELECT pg_catalog.setval('public.maintenances_id_seq', 3, true);


--
-- Name: mechanics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fleetcore_user
--

SELECT pg_catalog.setval('public.mechanics_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fleetcore_user
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: vehicles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fleetcore_user
--

SELECT pg_catalog.setval('public.vehicles_id_seq', 4, true);


--
-- Name: workshops_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fleetcore_user
--

SELECT pg_catalog.setval('public.workshops_id_seq', 2, true);


--
-- Name: vehicles PK_18d8646b59304dce4af3a9e35b6; Type: CONSTRAINT; Schema: public; Owner: fleetcore_user
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY (id);


--
-- Name: mechanics PK_2c0ed23afc0cc7ff361c17e53df; Type: CONSTRAINT; Schema: public; Owner: fleetcore_user
--

ALTER TABLE ONLY public.mechanics
    ADD CONSTRAINT "PK_2c0ed23afc0cc7ff361c17e53df" PRIMARY KEY (id);


--
-- Name: maintenances PK_62403473bd524a42d58589aa78b; Type: CONSTRAINT; Schema: public; Owner: fleetcore_user
--

ALTER TABLE ONLY public.maintenances
    ADD CONSTRAINT "PK_62403473bd524a42d58589aa78b" PRIMARY KEY (id);


--
-- Name: workshops PK_6d0e82a124f5b53df91c8989848; Type: CONSTRAINT; Schema: public; Owner: fleetcore_user
--

ALTER TABLE ONLY public.workshops
    ADD CONSTRAINT "PK_6d0e82a124f5b53df91c8989848" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: fleetcore_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: fleetcore_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: vehicles UQ_ec7181ebdab798d97070122a5bf; Type: CONSTRAINT; Schema: public; Owner: fleetcore_user
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT "UQ_ec7181ebdab798d97070122a5bf" UNIQUE (plate);


--
-- Name: maintenances FK_3a9ba7c05e1ffba00560d11f364; Type: FK CONSTRAINT; Schema: public; Owner: fleetcore_user
--

ALTER TABLE ONLY public.maintenances
    ADD CONSTRAINT "FK_3a9ba7c05e1ffba00560d11f364" FOREIGN KEY ("mechanicId") REFERENCES public.mechanics(id);


--
-- Name: maintenances FK_75331cd2a0f0c22bcb2fc4f6d6a; Type: FK CONSTRAINT; Schema: public; Owner: fleetcore_user
--

ALTER TABLE ONLY public.maintenances
    ADD CONSTRAINT "FK_75331cd2a0f0c22bcb2fc4f6d6a" FOREIGN KEY ("workshopId") REFERENCES public.workshops(id);


--
-- Name: maintenances FK_daa193fdfccde41a2ed4de8a474; Type: FK CONSTRAINT; Schema: public; Owner: fleetcore_user
--

ALTER TABLE ONLY public.maintenances
    ADD CONSTRAINT "FK_daa193fdfccde41a2ed4de8a474" FOREIGN KEY ("vehicleId") REFERENCES public.vehicles(id);


--
-- PostgreSQL database dump complete
--

\unrestrict qknfEIM92wwJbU9rAObFnDN65RqvMrgpRC83QwRKHOMNWNdqBznxq9DgdZa39DP

