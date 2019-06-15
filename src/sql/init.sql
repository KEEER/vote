-- Table: public.users

-- DROP TABLE public.users;

CREATE TABLE public.users
(
    id character varying(32) COLLATE pg_catalog."default" NOT NULL,
    settings jsonb,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

-- Table: public.forms

-- DROP TABLE public.forms;

CREATE TABLE public.forms
(
    userid character varying(32) COLLATE pg_catalog."default" NOT NULL,
    id character varying(32) COLLATE pg_catalog."default" NOT NULL,
    title character varying(256) COLLATE pg_catalog."default" NOT NULL,
    pages jsonb[] NOT NULL,
    questions jsonb[] NOT NULL,
    theme character varying(32) COLLATE pg_catalog."default" NOT NULL,
    plugins character varying(32)[] COLLATE pg_catalog."default",
    data jsonb,
    CONSTRAINT forms_pkey PRIMARY KEY (id),
    CONSTRAINT forms_id_key UNIQUE (id)
,
    CONSTRAINT forms_userid_fkey FOREIGN KEY (userid)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

-- Table: public.submissions

-- DROP TABLE public.submissions;

CREATE TABLE public.submissions
(
    id integer NOT NULL,
    formid character varying(32) COLLATE pg_catalog."default" NOT NULL,
    data jsonb,
    CONSTRAINT submissions_pkey PRIMARY KEY (id),
    CONSTRAINT formid FOREIGN KEY (formid)
        REFERENCES public.forms (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

-- Table: public.session

-- DROP TABLE public.session;

CREATE TABLE public.session
(
    id text COLLATE pg_catalog."default" NOT NULL,
    expiry timestamp without time zone NOT NULL,
    data jsonb,
    CONSTRAINT session_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
