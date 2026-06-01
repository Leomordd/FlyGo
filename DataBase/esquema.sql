--
-- PostgreSQL database dump
--

\restrict QXfNTMZxn7GHfqEnsLdUJd1gwkg9wyAEHs1jhVyj55r1Wdl6qGjmPfkT2rFLhTD

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

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
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: current_app_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.current_app_user() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid;
$$;


ALTER FUNCTION public.current_app_user() OWNER TO postgres;

--
-- Name: refresh_package_rating(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.refresh_package_rating() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE packages
  SET
    rating_avg   = (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews
                    WHERE package_id = COALESCE(NEW.package_id, OLD.package_id)
                      AND is_visible = true),
    rating_count = (SELECT COUNT(*) FROM reviews
                    WHERE package_id = COALESCE(NEW.package_id, OLD.package_id)
                      AND is_visible = true)
  WHERE id = COALESCE(NEW.package_id, OLD.package_id);
  RETURN NULL;
END;
$$;


ALTER FUNCTION public.refresh_package_rating() OWNER TO postgres;

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activities (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(150) NOT NULL,
    destination_id uuid NOT NULL,
    description text,
    price_per_person integer NOT NULL,
    duration_hours numeric(5,2),
    currency character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    tags character varying(50)[],
    max_participants integer,
    cover_image_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT activities_duration_hours_check CHECK ((duration_hours > (0)::numeric)),
    CONSTRAINT activities_max_participants_check CHECK ((max_participants > 0)),
    CONSTRAINT activities_price_per_person_check CHECK ((price_per_person >= 0))
);


ALTER TABLE public.activities OWNER TO postgres;

--
-- Name: booking_travelers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking_travelers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    booking_id uuid NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    document_type character varying(20) NOT NULL,
    document_number character varying(50) NOT NULL,
    birth_date date,
    nationality character varying(60),
    is_lead boolean DEFAULT false NOT NULL,
    CONSTRAINT booking_travelers_document_type_check CHECK (((document_type)::text = ANY ((ARRAY['passport'::character varying, 'dni'::character varying, 'cedula'::character varying, 'other'::character varying])::text[])))
);


ALTER TABLE public.booking_travelers OWNER TO postgres;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    package_id uuid NOT NULL,
    travelers_count smallint NOT NULL,
    total_price integer NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    travel_date date NOT NULL,
    booked_at timestamp with time zone DEFAULT now() NOT NULL,
    cancelled_at timestamp with time zone,
    special_requests text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT bookings_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'confirmed'::character varying, 'cancelled'::character varying, 'completed'::character varying, 'refunded'::character varying])::text[]))),
    CONSTRAINT bookings_total_price_check CHECK ((total_price >= 0)),
    CONSTRAINT bookings_travelers_count_check CHECK ((travelers_count >= 1))
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- Name: destinations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.destinations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(150) NOT NULL,
    country character varying(100) NOT NULL,
    region character varying(100),
    city character varying(100),
    tags character varying(50)[],
    climate_type character varying(30),
    latitude numeric(9,6),
    longitude numeric(9,6),
    description text,
    cover_image_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT destinations_climate_type_check CHECK (((climate_type)::text = ANY ((ARRAY['tropical'::character varying, 'desert'::character varying, 'mediterranean'::character varying, 'temperate'::character varying, 'polar'::character varying, 'continental'::character varying, 'highland'::character varying])::text[])))
);


ALTER TABLE public.destinations OWNER TO postgres;

--
-- Name: flights; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flights (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    airline character varying(100) NOT NULL,
    flight_number character varying(20) NOT NULL,
    origin_iata character varying(3) NOT NULL,
    destination_iata character varying(3) NOT NULL,
    departure_at timestamp with time zone NOT NULL,
    arrival_at timestamp with time zone NOT NULL,
    cabin_class character varying(20) DEFAULT 'economy'::character varying NOT NULL,
    price_per_person integer NOT NULL,
    seats_available integer DEFAULT 0 NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT arrival_after_departure CHECK ((arrival_at > departure_at)),
    CONSTRAINT flights_cabin_class_check CHECK (((cabin_class)::text = ANY ((ARRAY['economy'::character varying, 'premium_economy'::character varying, 'business'::character varying, 'first'::character varying])::text[]))),
    CONSTRAINT flights_price_per_person_check CHECK ((price_per_person >= 0)),
    CONSTRAINT flights_seats_available_check CHECK ((seats_available >= 0))
);


ALTER TABLE public.flights OWNER TO postgres;

--
-- Name: hotels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hotels (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(150) NOT NULL,
    destination_id uuid NOT NULL,
    address character varying(255),
    stars smallint,
    amenities character varying(50)[],
    price_per_night integer NOT NULL,
    total_rooms integer,
    rating numeric(3,2),
    cover_image_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT hotels_price_per_night_check CHECK ((price_per_night >= 0)),
    CONSTRAINT hotels_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric))),
    CONSTRAINT hotels_stars_check CHECK (((stars >= 1) AND (stars <= 5))),
    CONSTRAINT hotels_total_rooms_check CHECK ((total_rooms > 0))
);


ALTER TABLE public.hotels OWNER TO postgres;

--
-- Name: package_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.package_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    package_id uuid NOT NULL,
    item_type character varying(20) NOT NULL,
    item_id uuid NOT NULL,
    day_number smallint,
    order_in_day smallint DEFAULT 1 NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT package_items_day_number_check CHECK ((day_number >= 1)),
    CONSTRAINT package_items_item_type_check CHECK (((item_type)::text = ANY ((ARRAY['flight'::character varying, 'hotel'::character varying, 'rental'::character varying, 'activity'::character varying])::text[])))
);


ALTER TABLE public.package_items OWNER TO postgres;

--
-- Name: packages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.packages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    destination_id uuid NOT NULL,
    duration_days smallint NOT NULL,
    price_per_person integer NOT NULL,
    min_travelers smallint DEFAULT 1 NOT NULL,
    max_travelers smallint,
    currency character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    status character varying(20) DEFAULT 'draft'::character varying NOT NULL,
    tags character varying(50)[],
    rating_avg numeric(3,2) DEFAULT 0,
    rating_count integer DEFAULT 0 NOT NULL,
    available_from date,
    available_to date,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT availability_range_ok CHECK (((available_to IS NULL) OR (available_from IS NULL) OR (available_to >= available_from))),
    CONSTRAINT max_travelers_ok CHECK (((max_travelers IS NULL) OR (max_travelers >= min_travelers))),
    CONSTRAINT packages_duration_days_check CHECK ((duration_days >= 1)),
    CONSTRAINT packages_min_travelers_check CHECK ((min_travelers >= 1)),
    CONSTRAINT packages_price_per_person_check CHECK ((price_per_person >= 0)),
    CONSTRAINT packages_rating_avg_check CHECK (((rating_avg >= (0)::numeric) AND (rating_avg <= (5)::numeric))),
    CONSTRAINT packages_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'active'::character varying, 'paused'::character varying, 'archived'::character varying])::text[])))
);


ALTER TABLE public.packages OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    booking_id uuid NOT NULL,
    amount integer NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    method character varying(30) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    provider_ref character varying(150),
    paid_at timestamp with time zone,
    failure_reason text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT payments_amount_check CHECK ((amount > 0)),
    CONSTRAINT payments_method_check CHECK (((method)::text = ANY ((ARRAY['credit_card'::character varying, 'debit_card'::character varying, 'bank_transfer'::character varying, 'mercado_pago'::character varying, 'paypal'::character varying, 'crypto'::character varying, 'cash'::character varying])::text[]))),
    CONSTRAINT payments_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'processing'::character varying, 'paid'::character varying, 'failed'::character varying, 'refunded'::character varying, 'disputed'::character varying])::text[])))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: questionnaire_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questionnaire_sessions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    status character varying(20) DEFAULT 'in_progress'::character varying NOT NULL,
    answers_snapshot jsonb,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    CONSTRAINT questionnaire_sessions_status_check CHECK (((status)::text = ANY ((ARRAY['in_progress'::character varying, 'completed'::character varying, 'abandoned'::character varying])::text[])))
);


ALTER TABLE public.questionnaire_sessions OWNER TO postgres;

--
-- Name: recommendations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recommendations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    package_id uuid NOT NULL,
    score numeric(5,4) NOT NULL,
    reason character varying(60),
    was_clicked boolean DEFAULT false NOT NULL,
    was_booked boolean DEFAULT false NOT NULL,
    generated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT recommendations_score_check CHECK (((score >= (0)::numeric) AND (score <= (1)::numeric)))
);


ALTER TABLE public.recommendations OWNER TO postgres;

--
-- Name: rentals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rentals (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    type character varying(30) NOT NULL,
    name character varying(150) NOT NULL,
    destination_id uuid NOT NULL,
    provider character varying(100),
    price_per_day integer NOT NULL,
    capacity smallint,
    currency character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    features character varying(50)[],
    cover_image_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT rentals_capacity_check CHECK ((capacity >= 1)),
    CONSTRAINT rentals_price_per_day_check CHECK ((price_per_day >= 0)),
    CONSTRAINT rentals_type_check CHECK (((type)::text = ANY ((ARRAY['car'::character varying, 'motorcycle'::character varying, 'bicycle'::character varying, 'boat'::character varying, 'motorhome'::character varying, 'scooter'::character varying, 'quad'::character varying, 'other'::character varying])::text[])))
);


ALTER TABLE public.rentals OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    package_id uuid NOT NULL,
    booking_id uuid NOT NULL,
    rating smallint NOT NULL,
    comment text,
    images_urls text[],
    is_visible boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_preferences (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    budget_min integer,
    budget_max integer,
    currency character varying(3) DEFAULT 'USD'::character varying NOT NULL,
    travelers_count smallint DEFAULT 1 NOT NULL,
    traveler_type character varying(30),
    duration_min_days smallint,
    duration_max_days smallint,
    destination_types character varying(50)[],
    activities character varying(50)[],
    accommodation_types character varying(50)[],
    meal_preference character varying(30),
    mobility_needs character varying(30),
    pet_friendly boolean DEFAULT false NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT budget_range_ok CHECK (((budget_max IS NULL) OR (budget_min IS NULL) OR (budget_max >= budget_min))),
    CONSTRAINT duration_range_ok CHECK (((duration_max_days IS NULL) OR (duration_min_days IS NULL) OR (duration_max_days >= duration_min_days))),
    CONSTRAINT user_preferences_budget_max_check CHECK ((budget_max >= 0)),
    CONSTRAINT user_preferences_budget_min_check CHECK ((budget_min >= 0)),
    CONSTRAINT user_preferences_duration_min_days_check CHECK ((duration_min_days >= 1)),
    CONSTRAINT user_preferences_meal_preference_check CHECK (((meal_preference)::text = ANY ((ARRAY['none'::character varying, 'breakfast'::character varying, 'half_board'::character varying, 'full_board'::character varying, 'all_inclusive'::character varying])::text[]))),
    CONSTRAINT user_preferences_mobility_needs_check CHECK (((mobility_needs)::text = ANY ((ARRAY['none'::character varying, 'wheelchair'::character varying, 'reduced_mobility'::character varying])::text[]))),
    CONSTRAINT user_preferences_traveler_type_check CHECK (((traveler_type)::text = ANY ((ARRAY['solo'::character varying, 'couple'::character varying, 'family_kids'::character varying, 'family_adult'::character varying, 'group_friends'::character varying, 'business'::character varying])::text[]))),
    CONSTRAINT user_preferences_travelers_count_check CHECK ((travelers_count >= 1))
);


ALTER TABLE public.user_preferences OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    phone character varying(30),
    avatar_url text,
    role character varying(20) DEFAULT 'customer'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['customer'::character varying, 'admin'::character varying, 'agent'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activities (id, title, destination_id, description, price_per_person, duration_hours, currency, tags, max_participants, cover_image_url, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: booking_travelers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.booking_travelers (id, booking_id, first_name, last_name, document_type, document_number, birth_date, nationality, is_lead) FROM stdin;
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (id, user_id, package_id, travelers_count, total_price, currency, status, travel_date, booked_at, cancelled_at, special_requests, updated_at) FROM stdin;
\.


--
-- Data for Name: destinations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.destinations (id, name, country, region, city, tags, climate_type, latitude, longitude, description, cover_image_url, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: flights; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flights (id, airline, flight_number, origin_iata, destination_iata, departure_at, arrival_at, cabin_class, price_per_person, seats_available, currency, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: hotels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hotels (id, name, destination_id, address, stars, amenities, price_per_night, total_rooms, rating, cover_image_url, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: package_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.package_items (id, package_id, item_type, item_id, day_number, order_in_day, notes, created_at) FROM stdin;
\.


--
-- Data for Name: packages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.packages (id, title, description, destination_id, duration_days, price_per_person, min_travelers, max_travelers, currency, status, tags, rating_avg, rating_count, available_from, available_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, booking_id, amount, currency, method, status, provider_ref, paid_at, failure_reason, created_at) FROM stdin;
\.


--
-- Data for Name: questionnaire_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.questionnaire_sessions (id, user_id, status, answers_snapshot, started_at, completed_at) FROM stdin;
\.


--
-- Data for Name: recommendations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recommendations (id, user_id, package_id, score, reason, was_clicked, was_booked, generated_at) FROM stdin;
\.


--
-- Data for Name: rentals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rentals (id, type, name, destination_id, provider, price_per_day, capacity, currency, features, cover_image_url, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, user_id, package_id, booking_id, rating, comment, images_urls, is_visible, created_at) FROM stdin;
\.


--
-- Data for Name: user_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_preferences (id, user_id, budget_min, budget_max, currency, travelers_count, traveler_type, duration_min_days, duration_max_days, destination_types, activities, accommodation_types, meal_preference, mobility_needs, pet_friendly, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, first_name, last_name, phone, avatar_url, role, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: booking_travelers booking_travelers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_travelers
    ADD CONSTRAINT booking_travelers_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: destinations destinations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destinations
    ADD CONSTRAINT destinations_pkey PRIMARY KEY (id);


--
-- Name: flights flights_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flights
    ADD CONSTRAINT flights_pkey PRIMARY KEY (id);


--
-- Name: hotels hotels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotels
    ADD CONSTRAINT hotels_pkey PRIMARY KEY (id);


--
-- Name: package_items package_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package_items
    ADD CONSTRAINT package_items_pkey PRIMARY KEY (id);


--
-- Name: packages packages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT packages_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: questionnaire_sessions questionnaire_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionnaire_sessions
    ADD CONSTRAINT questionnaire_sessions_pkey PRIMARY KEY (id);


--
-- Name: recommendations recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_pkey PRIMARY KEY (id);


--
-- Name: recommendations recommendations_user_id_package_id_generated_at_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_user_id_package_id_generated_at_key UNIQUE (user_id, package_id, generated_at);


--
-- Name: rentals rentals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rentals
    ADD CONSTRAINT rentals_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_user_id_booking_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_booking_id_key UNIQUE (user_id, booking_id);


--
-- Name: user_preferences user_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (id);


--
-- Name: user_preferences user_preferences_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_key UNIQUE (user_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_activities_destination; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activities_destination ON public.activities USING btree (destination_id);


--
-- Name: idx_activities_tags; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activities_tags ON public.activities USING gin (tags);


--
-- Name: idx_bk_travelers_booking; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bk_travelers_booking ON public.booking_travelers USING btree (booking_id);


--
-- Name: idx_bookings_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_date ON public.bookings USING btree (travel_date);


--
-- Name: idx_bookings_package; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_package ON public.bookings USING btree (package_id);


--
-- Name: idx_bookings_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_status ON public.bookings USING btree (status);


--
-- Name: idx_bookings_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_user ON public.bookings USING btree (user_id);


--
-- Name: idx_destinations_country; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_destinations_country ON public.destinations USING btree (country);


--
-- Name: idx_destinations_name_trgm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_destinations_name_trgm ON public.destinations USING gin (name public.gin_trgm_ops);


--
-- Name: idx_destinations_tags; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_destinations_tags ON public.destinations USING gin (tags);


--
-- Name: idx_flights_depart; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_flights_depart ON public.flights USING btree (departure_at);


--
-- Name: idx_flights_route; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_flights_route ON public.flights USING btree (origin_iata, destination_iata);


--
-- Name: idx_hotels_destination; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_hotels_destination ON public.hotels USING btree (destination_id);


--
-- Name: idx_hotels_stars; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_hotels_stars ON public.hotels USING btree (stars);


--
-- Name: idx_packages_destination; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_packages_destination ON public.packages USING btree (destination_id);


--
-- Name: idx_packages_price; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_packages_price ON public.packages USING btree (price_per_person);


--
-- Name: idx_packages_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_packages_status ON public.packages USING btree (status);


--
-- Name: idx_packages_tags; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_packages_tags ON public.packages USING gin (tags);


--
-- Name: idx_payments_booking; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_booking ON public.payments USING btree (booking_id);


--
-- Name: idx_payments_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_status ON public.payments USING btree (status);


--
-- Name: idx_pkg_items_item; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pkg_items_item ON public.package_items USING btree (item_type, item_id);


--
-- Name: idx_pkg_items_package; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pkg_items_package ON public.package_items USING btree (package_id);


--
-- Name: idx_qs_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_qs_user ON public.questionnaire_sessions USING btree (user_id);


--
-- Name: idx_reco_score; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reco_score ON public.recommendations USING btree (user_id, score DESC);


--
-- Name: idx_reco_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reco_user ON public.recommendations USING btree (user_id);


--
-- Name: idx_rentals_destination; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rentals_destination ON public.rentals USING btree (destination_id);


--
-- Name: idx_rentals_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rentals_type ON public.rentals USING btree (type);


--
-- Name: idx_reviews_package; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_package ON public.reviews USING btree (package_id);


--
-- Name: idx_reviews_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_user ON public.reviews USING btree (user_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: bookings trg_bookings_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: packages trg_packages_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_packages_updated BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: reviews trg_review_rating; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_review_rating AFTER INSERT OR DELETE OR UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.refresh_package_rating();


--
-- Name: users trg_users_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: activities activities_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destinations(id);


--
-- Name: booking_travelers booking_travelers_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_travelers
    ADD CONSTRAINT booking_travelers_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id);


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: hotels hotels_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotels
    ADD CONSTRAINT hotels_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destinations(id);


--
-- Name: package_items package_items_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package_items
    ADD CONSTRAINT package_items_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id) ON DELETE CASCADE;


--
-- Name: packages packages_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT packages_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destinations(id);


--
-- Name: payments payments_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: questionnaire_sessions questionnaire_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questionnaire_sessions
    ADD CONSTRAINT questionnaire_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: recommendations recommendations_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id) ON DELETE CASCADE;


--
-- Name: recommendations recommendations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: rentals rentals_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rentals
    ADD CONSTRAINT rentals_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destinations(id);


--
-- Name: reviews reviews_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: reviews reviews_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id);


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_preferences user_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: activities; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

--
-- Name: booking_travelers; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.booking_travelers ENABLE ROW LEVEL SECURITY;

--
-- Name: bookings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

--
-- Name: destinations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

--
-- Name: flights; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.flights ENABLE ROW LEVEL SECURITY;

--
-- Name: hotels; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;

--
-- Name: booking_travelers own booking travelers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "own booking travelers" ON public.booking_travelers USING ((booking_id IN ( SELECT bookings.id
   FROM public.bookings
  WHERE (bookings.user_id = public.current_app_user()))));


--
-- Name: bookings own bookings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "own bookings" ON public.bookings USING ((user_id = public.current_app_user()));


--
-- Name: payments own payments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "own payments" ON public.payments FOR SELECT USING ((booking_id IN ( SELECT bookings.id
   FROM public.bookings
  WHERE (bookings.user_id = public.current_app_user()))));


--
-- Name: user_preferences own preferences; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "own preferences" ON public.user_preferences USING ((user_id = public.current_app_user()));


--
-- Name: questionnaire_sessions own qs sessions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "own qs sessions" ON public.questionnaire_sessions USING ((user_id = public.current_app_user()));


--
-- Name: recommendations own recommendations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "own recommendations" ON public.recommendations FOR SELECT USING ((user_id = public.current_app_user()));


--
-- Name: reviews own reviews; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "own reviews" ON public.reviews USING ((user_id = public.current_app_user()));


--
-- Name: users own user row; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "own user row" ON public.users USING ((id = public.current_app_user()));


--
-- Name: package_items; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.package_items ENABLE ROW LEVEL SECURITY;

--
-- Name: packages; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

--
-- Name: payments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

--
-- Name: activities public read activities; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public read activities" ON public.activities FOR SELECT USING ((is_active = true));


--
-- Name: destinations public read destinations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public read destinations" ON public.destinations FOR SELECT USING ((is_active = true));


--
-- Name: flights public read flights; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public read flights" ON public.flights FOR SELECT USING ((is_active = true));


--
-- Name: hotels public read hotels; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public read hotels" ON public.hotels FOR SELECT USING ((is_active = true));


--
-- Name: packages public read packages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public read packages" ON public.packages FOR SELECT USING (((status)::text = 'active'::text));


--
-- Name: package_items public read pkg_items; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public read pkg_items" ON public.package_items FOR SELECT USING (true);


--
-- Name: rentals public read rentals; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "public read rentals" ON public.rentals FOR SELECT USING ((is_active = true));


--
-- Name: questionnaire_sessions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.questionnaire_sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: recommendations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

--
-- Name: rentals; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;

--
-- Name: reviews; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

--
-- Name: user_preferences; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict QXfNTMZxn7GHfqEnsLdUJd1gwkg9wyAEHs1jhVyj55r1Wdl6qGjmPfkT2rFLhTD

