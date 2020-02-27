BEGIN;

ALTER TABLE public.users RENAME id TO name;
ALTER TABLE public.users DROP CONSTRAINT users_pkey CASCADE;
ALTER TABLE public.users ADD id bigserial NOT NULL;
ALTER TABLE public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE public.users ADD lower_name character varying(32);
UPDATE public.users SET lower_name = LOWER(name);
ALTER TABLE public.users ALTER lower_name SET NOT NULL;
ALTER TABLE public.users ADD pro_expires timestamp;
CREATE INDEX IDX_users_name ON public.users (name);
CREATE INDEX IDX_users_lower_name ON public.users (lower_name);

TRUNCATE TABLE public.tokens;
ALTER TABLE public.tokens DROP id;
ALTER TABLE public.tokens ADD id bigint NOT NULL;
ALTER TABLE public.tokens ADD CONSTRAINT tokens_id_fkey FOREIGN KEY (id)
  REFERENCES public.users (id) MATCH SIMPLE
  ON UPDATE CASCADE
  ON DELETE CASCADE;

ALTER TABLE public.forms ADD user_id bigint;
UPDATE public.forms SET user_id = ( SELECT id FROM public.users WHERE name = userid );
ALTER TABLE public.forms ALTER user_id SET NOT NULL;
ALTER TABLE public.forms ADD CONSTRAINT forms_user_id_fkey FOREIGN KEY (user_id)
  REFERENCES public.users (id) MATCH SIMPLE
  ON UPDATE CASCADE
  ON DELETE CASCADE;
ALTER TABLE public.forms DROP userid;
ALTER TABLE public.forms RENAME id TO temp_name;
ALTER TABLE public.forms DROP CONSTRAINT forms_pkey;
ALTER TABLE public.forms ADD id bigserial NOT NULL;
ALTER TABLE public.forms ADD CONSTRAINT forms_pkey PRIMARY KEY (id);

ALTER TABLE public.submissions ADD form_id bigint;
UPDATE public.submissions SET form_id = ( SELECT id FROM public.forms WHERE temp_name = formid );
ALTER TABLE public.submissions DROP CONSTRAINT submissions_formid_fkey;
ALTER TABLE public.submissions DROP formid;
ALTER TABLE public.submissions ADD CONSTRAINT submissions_form_id_fkey FOREIGN KEY (form_id)
  REFERENCES public.forms (id) MATCH SIMPLE
  ON UPDATE CASCADE
  ON DELETE CASCADE;
CREATE INDEX IDX_submissions_form_id ON public.submissions (form_id);

ALTER TABLE public.forms ADD name character varying(64) COLLATE pg_catalog."default";
UPDATE public.forms SET name = ( SELECT name[2] FROM regexp_split_to_array(temp_name, '/') AS name );
ALTER TABLE public.forms ALTER name SET NOT NULL;
ALTER TABLE public.forms ADD lower_name character varying(64) COLLATE pg_catalog."default";
UPDATE public.forms SET lower_name = LOWER(name);
ALTER TABLE public.forms ALTER lower_name SET NOT NULL;
CREATE INDEX IDX_forms_name ON public.forms (name);
CREATE INDEX IDX_forms_lower_name ON public.forms (lower_name);
ALTER TABLE public.forms DROP temp_name;

CREATE TABLE public.version (
  version integer NOT NULL
)
WITH (
  OIDS = FALSE
);
INSERT INTO public.version VALUES (1);

COMMIT;
