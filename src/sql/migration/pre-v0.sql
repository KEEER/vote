-- migrating from v0.0.138:
ALTER TABLE public.forms ALTER id TYPE character varying(64) COLLATE pg_catalog."default";
ALTER TABLE public.submissions ALTER formid TYPE character varying(64) COLLATE pg_catalog."default";

-- migrating from v0.0.135:
ALTER TABLE public.users ADD avatar_url character varying(128);
ALTER TABLE public.users ADD nickname character varying(64);
