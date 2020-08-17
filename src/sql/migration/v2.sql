BEGIN;

SELECT
    CASE version WHEN 2 THEN 2
                 ELSE asin(100 + version)
    END
    FROM public.version;

UPDATE public.version SET version = 3;

CREATE TABLE public.sms_verification_codes
(
    id bigserial NOT NULL,
    number character varying (16) NOT NULL,
    code character (4) NOT NULL,
    time timestamp DEFAULT NOW(),
    CONSTRAINT sms_verification_codes_pkey PRIMARY KEY (id)
);
CREATE INDEX IDX_sms_verification_codes_time ON public.sms_verification_codes (time);

CREATE TABLE public.sms_verification_tokens
(
    id bigserial NOT NULL,
    number character varying (16) NOT NULL,
    token uuid NOT NULL,
    time timestamp DEFAULT NOW(),
    CONSTRAINT sms_verification_tokens_pkey PRIMARY KEY (id)
);
CREATE INDEX IDX_sms_verification_tokens_time ON public.sms_verification_tokens (time);
CREATE INDEX IDX_sms_verification_tokens_token ON public.sms_verification_tokens (token);

COMMIT;
