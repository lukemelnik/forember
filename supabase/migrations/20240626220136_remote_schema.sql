create extension if not exists "vector" with schema "extensions";


create table "public"."embeddings" (
    "id" bigint generated always as identity not null,
    "content" text not null,
    "embedding" vector(384)
);


alter table "public"."embeddings" enable row level security;

create table "public"."fragment" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid default auth.uid(),
    "question" text,
    "answer" text,
    "image_url" text,
    "interval" smallint not null default '1'::smallint,
    "is_complete" boolean default false,
    "last_shown_at" timestamp with time zone,
    "next_show_date" timestamp with time zone
);


alter table "public"."fragment" enable row level security;

create table "public"."practice_session" (
    "user_id" uuid not null,
    "created_at" date not null default CURRENT_DATE,
    "session_duration" integer,
    "session_id" uuid not null default gen_random_uuid(),
    "session_score" smallint not null,
    "total_questions" integer not null,
    "right_answers" integer not null
);


alter table "public"."practice_session" enable row level security;

create table "public"."profile" (
    "user_id" uuid not null,
    "first_name" text,
    "last_name" text,
    "created_at" timestamp without time zone
);


alter table "public"."profile" enable row level security;

CREATE INDEX embeddings_embedding_idx ON public.embeddings USING hnsw (embedding vector_ip_ops);

CREATE UNIQUE INDEX embeddings_pkey ON public.embeddings USING btree (id);

CREATE UNIQUE INDEX fragment_pkey ON public.fragment USING btree (id);

CREATE UNIQUE INDEX practice_session_pkey ON public.practice_session USING btree (session_id);

CREATE UNIQUE INDEX profile_pkey ON public.profile USING btree (user_id);

alter table "public"."embeddings" add constraint "embeddings_pkey" PRIMARY KEY using index "embeddings_pkey";

alter table "public"."fragment" add constraint "fragment_pkey" PRIMARY KEY using index "fragment_pkey";

alter table "public"."practice_session" add constraint "practice_session_pkey" PRIMARY KEY using index "practice_session_pkey";

alter table "public"."profile" add constraint "profile_pkey" PRIMARY KEY using index "profile_pkey";

alter table "public"."fragment" add constraint "fragment_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."fragment" validate constraint "fragment_user_id_fkey";

alter table "public"."practice_session" add constraint "practice_session_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."practice_session" validate constraint "practice_session_user_id_fkey";

alter table "public"."profile" add constraint "profile_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profile" validate constraint "profile_user_id_fkey";

set check_function_bodies = off;

create or replace view "public"."daily_user_sessions" as  SELECT practice_session.user_id,
    practice_session.created_at AS session_date,
    to_char((practice_session.created_at)::timestamp with time zone, 'Month DD'::text) AS month_and_day,
    count(practice_session.session_id) AS session_count,
    sum(practice_session.session_duration) AS total_session_duration,
    sum(practice_session.total_questions) AS total_questions,
    sum(practice_session.right_answers) AS total_right_answers
   FROM practice_session
  GROUP BY practice_session.user_id, practice_session.created_at
  ORDER BY practice_session.created_at DESC;


create or replace view "public"."daily_user_sessions_last_seven_days" as  SELECT practice_session.user_id,
    practice_session.created_at AS session_date,
    to_char((practice_session.created_at)::timestamp with time zone, 'Month DD'::text) AS month_and_day,
    count(practice_session.session_id) AS session_count,
    round(((sum(practice_session.session_duration) / 60))::double precision) AS total_session_duration_minutes,
    sum(practice_session.total_questions) AS total_questions,
    sum(practice_session.right_answers) AS total_right_answers
   FROM practice_session
  WHERE (practice_session.created_at >= (now() - '7 days'::interval))
  GROUP BY practice_session.user_id, practice_session.created_at
  ORDER BY practice_session.created_at DESC;


CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profile (user_id, created_at)
  values (new.id, new.created_at);
  return new;
end;
$function$
;

grant delete on table "public"."embeddings" to "anon";

grant insert on table "public"."embeddings" to "anon";

grant references on table "public"."embeddings" to "anon";

grant select on table "public"."embeddings" to "anon";

grant trigger on table "public"."embeddings" to "anon";

grant truncate on table "public"."embeddings" to "anon";

grant update on table "public"."embeddings" to "anon";

grant delete on table "public"."embeddings" to "authenticated";

grant insert on table "public"."embeddings" to "authenticated";

grant references on table "public"."embeddings" to "authenticated";

grant select on table "public"."embeddings" to "authenticated";

grant trigger on table "public"."embeddings" to "authenticated";

grant truncate on table "public"."embeddings" to "authenticated";

grant update on table "public"."embeddings" to "authenticated";

grant delete on table "public"."embeddings" to "service_role";

grant insert on table "public"."embeddings" to "service_role";

grant references on table "public"."embeddings" to "service_role";

grant select on table "public"."embeddings" to "service_role";

grant trigger on table "public"."embeddings" to "service_role";

grant truncate on table "public"."embeddings" to "service_role";

grant update on table "public"."embeddings" to "service_role";

grant delete on table "public"."fragment" to "anon";

grant insert on table "public"."fragment" to "anon";

grant references on table "public"."fragment" to "anon";

grant select on table "public"."fragment" to "anon";

grant trigger on table "public"."fragment" to "anon";

grant truncate on table "public"."fragment" to "anon";

grant update on table "public"."fragment" to "anon";

grant delete on table "public"."fragment" to "authenticated";

grant insert on table "public"."fragment" to "authenticated";

grant references on table "public"."fragment" to "authenticated";

grant select on table "public"."fragment" to "authenticated";

grant trigger on table "public"."fragment" to "authenticated";

grant truncate on table "public"."fragment" to "authenticated";

grant update on table "public"."fragment" to "authenticated";

grant delete on table "public"."fragment" to "service_role";

grant insert on table "public"."fragment" to "service_role";

grant references on table "public"."fragment" to "service_role";

grant select on table "public"."fragment" to "service_role";

grant trigger on table "public"."fragment" to "service_role";

grant truncate on table "public"."fragment" to "service_role";

grant update on table "public"."fragment" to "service_role";

grant delete on table "public"."practice_session" to "anon";

grant insert on table "public"."practice_session" to "anon";

grant references on table "public"."practice_session" to "anon";

grant select on table "public"."practice_session" to "anon";

grant trigger on table "public"."practice_session" to "anon";

grant truncate on table "public"."practice_session" to "anon";

grant update on table "public"."practice_session" to "anon";

grant delete on table "public"."practice_session" to "authenticated";

grant insert on table "public"."practice_session" to "authenticated";

grant references on table "public"."practice_session" to "authenticated";

grant select on table "public"."practice_session" to "authenticated";

grant trigger on table "public"."practice_session" to "authenticated";

grant truncate on table "public"."practice_session" to "authenticated";

grant update on table "public"."practice_session" to "authenticated";

grant delete on table "public"."practice_session" to "service_role";

grant insert on table "public"."practice_session" to "service_role";

grant references on table "public"."practice_session" to "service_role";

grant select on table "public"."practice_session" to "service_role";

grant trigger on table "public"."practice_session" to "service_role";

grant truncate on table "public"."practice_session" to "service_role";

grant update on table "public"."practice_session" to "service_role";

grant delete on table "public"."profile" to "anon";

grant insert on table "public"."profile" to "anon";

grant references on table "public"."profile" to "anon";

grant select on table "public"."profile" to "anon";

grant trigger on table "public"."profile" to "anon";

grant truncate on table "public"."profile" to "anon";

grant update on table "public"."profile" to "anon";

grant delete on table "public"."profile" to "authenticated";

grant insert on table "public"."profile" to "authenticated";

grant references on table "public"."profile" to "authenticated";

grant select on table "public"."profile" to "authenticated";

grant trigger on table "public"."profile" to "authenticated";

grant truncate on table "public"."profile" to "authenticated";

grant update on table "public"."profile" to "authenticated";

grant delete on table "public"."profile" to "service_role";

grant insert on table "public"."profile" to "service_role";

grant references on table "public"."profile" to "service_role";

grant select on table "public"."profile" to "service_role";

grant trigger on table "public"."profile" to "service_role";

grant truncate on table "public"."profile" to "service_role";

grant update on table "public"."profile" to "service_role";

create policy "Allow users to see their own fragments"
on "public"."fragment"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Enable delete for users based on user_id"
on "public"."fragment"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."fragment"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable update for users based on user_id"
on "public"."fragment"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable delete for users based on user_id"
on "public"."practice_session"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable select for users based on user_id"
on "public"."practice_session"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can insert sessions based on user_id"
on "public"."practice_session"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable select for users based on user_id"
on "public"."profile"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable update for users based on user_id"
on "public"."profile"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id));


CREATE TRIGGER create_embedding AFTER INSERT OR UPDATE ON public.fragment FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('http://localhost:3000', 'POST', '{"Content-type":"application/json"}', '{}', '1000');


