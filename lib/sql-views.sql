-- these aren't easy to keep track of in Supabase so I'm logging them here for version control

-- create view that aggregates sessions so that there's only one per day
create view 
  daily_user_sessions 
  with (security_invoker=on)
  as
select
  user_id,
  DATE(created_at) as session_date,
  TO_CHAR(DATE(created_at), 'Month DD') AS month_and_day,
  count(session_id) as session_count,
  sum(session_duration) as total_session_duration,
  sum(total_questions) as total_questions,
  sum(right_answers) as total_right_answers
from
  practice_session
group by
  user_id,
  session_date
order by 
  session_date desc;

  -- data for the last seven days 

CREATE VIEW daily_user_sessions_last_seven_days 
with (security_invoker=on)
AS
SELECT
  user_id,
  DATE(created_at) AS session_date,
  TO_CHAR(DATE(created_at), 'Month DD') AS month_and_day,
  COUNT(session_id) AS session_count,
  ROUND(SUM(session_duration) / 60) AS total_session_duration_minutes,
  SUM(total_questions) AS total_questions,
  SUM(right_answers) AS total_right_answers
FROM
  practice_session
WHERE
  created_at >= NOW() - INTERVAL '7 days'
GROUP BY
  user_id,
  session_date
ORDER BY
  session_date DESC;