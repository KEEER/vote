-- Table: public.users

-- DROP TABLE public.users;

CREATE TABLE public.users
(
    id bigserial NOT NULL,
    name character varying(32) COLLATE pg_catalog."default" NOT NULL,
    lower_name character varying(32) COLLATE pg_catalog."default" NOT NULL,
    avatar_url character varying(128) COLLATE pg_catalog."default",
    nickname character varying(64) COLLATE pg_catalog."default",
    pro_expires timestamp,
    settings jsonb,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

CREATE INDEX IDX_users_name ON public.users (name);
CREATE INDEX IDX_users_lower_name ON public.users (lower_name);

-- Table: public.tokens

-- DROP TABLE public.tokens;

CREATE TABLE public.tokens
(
    token character varying(36) COLLATE pg_catalog."default" NOT NULL,
    id bigint NOT NULL,
    expiry timestamp NOT NULL,
    CONSTRAINT tokens_pkey PRIMARY KEY (token)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

-- Table: public.forms

-- DROP TABLE public.forms;

CREATE TABLE public.forms
(
    title character varying(256) COLLATE pg_catalog."default" NOT NULL,
    pages jsonb[] NOT NULL,
    questions jsonb[] NOT NULL,
    theme character varying(32) COLLATE pg_catalog."default" NOT NULL,
    plugins character varying(32)[] COLLATE pg_catalog."default",
    data jsonb,
    user_id bigint NOT NULL,
    id bigserial NOT NULL,
    name character varying(64) COLLATE pg_catalog."default" NOT NULL,
    lower_name character varying(64) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT forms_pkey PRIMARY KEY (id),
    CONSTRAINT forms_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

CREATE INDEX IDX_forms_name ON public.forms (name);
CREATE INDEX IDX_forms_lower_name ON public.forms (lower_name);

-- Table: public.submissions

-- DROP TABLE public.submissions;

CREATE TABLE public.submissions
(
    id bigserial NOT NULL,
    time timestamp NOT NULL DEFAULT NOW(),
    data jsonb,
    form_id bigint,
    CONSTRAINT submissions_pkey PRIMARY KEY (id),
    CONSTRAINT submissions_form_id_fkey FOREIGN KEY (form_id)
        REFERENCES public.forms (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

CREATE INDEX IDX_submissions_form_id ON public.submissions (form_id);

-- Table: public.version

-- DROP TABLE public.version;

CREATE TABLE public.version
(
    version integer NOT NULL
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

INSERT INTO public.version VALUES (1);
