-- Table: public.users

-- DROP TABLE public.users;

CREATE TABLE public.users
(
    id character varying(32) COLLATE pg_catalog."default" NOT NULL,
    -- updating from v0.0.135:
    -- ALTER TABLE public.users ADD avatar_url character varying(128);
    -- ALTER TABLE public.users ADD nickname character varying(64);
    avatar_url character varying(128),
    nickname character varying(64),
    settings jsonb,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

-- Table: public.tokens

-- DROP TABLE public.tokens;

CREATE TABLE public.tokens
(
    token character varying(36) COLLATE pg_catalog."default" NOT NULL,
    id character varying(32) NOT NULL,
    expiry timestamp without time zone NOT NULL,
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
    userid character varying(32) COLLATE pg_catalog."default" NOT NULL,
    -- migrating from v0.0.138:
    -- ALTER TABLE public.forms ALTER id TYPE character varying(64) COLLATE pg_catalog."default";
    -- ALTER TABLE public.submissions ALTER formid TYPE character varying(64) COLLATE pg_catalog."default";
    id character varying(64) COLLATE pg_catalog."default" NOT NULL,
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
    id bigserial NOT NULL,
    formid character varying(64) COLLATE pg_catalog."default",
    time timestamp NOT NULL DEFAULT NOW(),
    data jsonb,
    CONSTRAINT submissions_pkey PRIMARY KEY (id),
    CONSTRAINT submissions_formid_fkey FOREIGN KEY (formid)
        REFERENCES public.forms (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
