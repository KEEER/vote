BEGIN;

SELECT
    CASE version WHEN 1 THEN 1
                 ELSE asin(100 + version)
    END
    FROM public.version;

UPDATE public.version SET version = 2;

-- Table: public.submission_tags

-- DROP TABLE public.submission_tags;

CREATE TABLE public.submission_tags
(
    id bigserial NOT NULL,
    name character varying(64) NOT NULL,
    lower_name character varying(64) NOT NULL,
    CONSTRAINT submission_tags_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

CREATE INDEX IDX_submission_tags_name ON public.submission_tags (name);
CREATE INDEX IDX_submission_tags_lower_name ON public.submission_tags (lower_name);

-- Table: public.submission_tagmap

-- DROP TABLE public.submission_tagmap;

CREATE TABLE public.submission_tagmap
(
    id bigserial NOT NULL,
    submission_id bigint NOT NULL,
    tag_id bigint NOT NULL,
    CONSTRAINT submission_tagmap_pkey PRIMARY KEY (id),
    CONSTRAINT submission_tagmap_tag_id_fkey FOREIGN KEY (tag_id)
        REFERENCES public.submission_tags (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT submission_tagmap_submission_id_fkey FOREIGN KEY (submission_id)
        REFERENCES public.submissions (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

CREATE INDEX IDX_submission_tagmap_tag_id ON public.submission_tagmap (tag_id);
CREATE INDEX IDX_submission_tagmap_submission_id ON public.submission_tagmap (submission_id);

COMMIT;
