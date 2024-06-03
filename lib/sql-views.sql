
create view
  distinct_user_sessions as
with
  filtered_by_user as (
    select
      *,
      DATE (created_at) as created_date
    from
      practice_session
  ),
  distinct_created_at as (
    select distinct
      on (user_id, created_date) *
    from
      filtered_by_user
    order by
      user_id,
      created_date,
      created_at
  );


VIEW FOR AGGREGATED SESSIONS: create view
  daily_user_sessions as
select
  user_id,
  DATE(created_at) as session_date,
  TO_CHAR(DATE(created_at), 'Day') AS day_of_week,
  count(session_id) as session_count,
  sum(session_duration) as total_session_duration,
  sum(total_questions) as total_questions,
  sum(right_answers) as total_right_answers
from
  practice_session
group by
  user_id,
  session_date;