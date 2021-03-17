import { executeQuery } from "../database/database.js";

const getWeekly = async(id, week) => {
    const data = {
        sleep: null,
        sport: null,
        study: null,
        quality: null,
        mood: null
    }
    if (week) {
        week = week.split('-')
        const year = week[0]
        week = week[1].substring(1)
        data.sleep = (await executeQuery('Select Round(AVG(sleep_duration)::numeric, 2) FROM morning_report  WHERE EXTRACT(week FROM date) = $1 AND user_id = $2 And EXTRACT(year FROM date) = $3', week, id, year)).rows[0][0]
        data.sport = (await executeQuery('Select Round(AVG(sport_duration)::numeric, 2) FROM evening_report  WHERE EXTRACT(week FROM date) = $1 AND user_id = $2 AND EXTRACT(year FROM date) = $3', week, id, year)).rows[0][0]
        data.study = (await executeQuery('Select Round(AVG(study_duration)::numeric, 2) FROM evening_report  WHERE EXTRACT(week FROM date) = $1 AND user_id = $2 AND EXTRACT(year FROM date) = $3', week, id, year)).rows[0][0]
        data.quality = (await executeQuery('Select Round(AVG(sleep_quality), 2) FROM morning_report  WHERE EXTRACT(week FROM date) = $1 AND user_id = $2 AND EXTRACT(year FROM date) = $3', week, id, year)).rows[0][0]
        data.mood = (await executeQuery('select Round(AVG(mood), 2) as AM FROM(select mood,date,user_id from evening_report UNION ALL select mood,date,user_id from morning_report) as sub WHERE EXTRACT(week FROM date) = $1 AND user_id = $2 AND EXTRACT(year FROM date) = $3', week, id, year)).rows[0][0]
    } else {
        data.sleep = (await executeQuery("Select Round(AVG(sleep_duration)::numeric, 2) FROM morning_report  WHERE EXTRACT(week FROM date) = EXTRACT(week FROM NOW()) - 1 AND user_id = $1 AND EXTRACT(year FROM date) = Extract(year from now() - interval '1 week')", id)).rows[0][0]
        data.sport = (await executeQuery("Select Round(AVG(sport_duration)::numeric, 2) FROM evening_report  WHERE EXTRACT(week FROM date) = EXTRACT(week FROM NOW()) - 1 AND user_id = $1 AND EXTRACT(year FROM date) = Extract(year from now() - interval '1 week')", id)).rows[0][0]
        data.study = (await executeQuery("Select Round(AVG(study_duration)::numeric, 2) FROM evening_report  WHERE EXTRACT(week FROM date) = EXTRACT(week FROM NOW()) - 1 AND user_id = $1 AND EXTRACT(year FROM date) = Extract(year from now() - interval '1 week')", id)).rows[0][0]
        data.quality = (await executeQuery("Select Round(AVG(sleep_quality), 2) FROM morning_report  WHERE EXTRACT(week FROM date) = EXTRACT(week FROM NOW()) - 1 AND user_id = $1 AND EXTRACT(year FROM date) = Extract(year from now() - interval '1 week')", id)).rows[0][0]
        data.mood = (await executeQuery("select Round(AVG(mood), 2) as AM FROM(select mood,date,user_id from evening_report UNION ALL select mood,date,user_id from morning_report) as sub WHERE EXTRACT(week FROM date) = EXTRACT(week FROM NOW()) - 1 AND user_id = $1 AND EXTRACT(year FROM date) = Extract(year from now() - interval '1 week')", id)).rows[0][0]
    }
    return data
}

const getMonthly = async(id, month) => {
    const data = {
        sleep: null,
        sport: null,
        study: null,
        quality: null,
        mood: null
    }
    if (month) {
        month = month.split('-')
        const year = month[0]
        month = month[1]
        data.sleep = (await executeQuery('Select Round(AVG(sleep_duration)::numeric, 2) FROM morning_report  WHERE EXTRACT(month FROM date) = $1 AND user_id = $2 And EXTRACT(year FROM date) = $3', month, id, year)).rows[0][0]
        data.sport = (await executeQuery('Select Round(AVG(sport_duration)::numeric, 2) FROM evening_report  WHERE EXTRACT(month FROM date) = $1 AND user_id = $2 And EXTRACT(year FROM date) = $3', month, id, year)).rows[0][0]
        data.study = (await executeQuery('Select Round(AVG(study_duration)::numeric, 2) FROM evening_report  WHERE EXTRACT(month FROM date) = $1 AND user_id = $2 And EXTRACT(year FROM date) = $3', month, id, year)).rows[0][0]
        data.quality = (await executeQuery('Select Round(AVG(sleep_quality), 2) FROM morning_report  WHERE EXTRACT(month FROM date) = $1 AND user_id = $2 And EXTRACT(year FROM date) = $3', month, id, year)).rows[0][0]
        data.mood = (await executeQuery('select Round(AVG(mood), 2) as AM FROM(select mood,date,user_id from evening_report UNION ALL select mood,date,user_id from morning_report) as sub WHERE EXTRACT(month FROM date) = $1 AND user_id = $2 And EXTRACT(year FROM date) = $3', month, id, year)).rows[0][0]
    } else {
        data.sleep = (await executeQuery("Select Round(AVG(sleep_duration)::numeric, 2) FROM morning_report  WHERE EXTRACT(month FROM date) = EXTRACT(month FROM NOW()) - 1 AND user_id = $1 AND EXTRACT(year FROM date) = Extract(year from now() - interval '1 week')", id)).rows[0][0]
        data.sport = (await executeQuery("Select Round(AVG(sport_duration)::numeric, 2) FROM evening_report  WHERE EXTRACT(month FROM date) = EXTRACT(month FROM NOW()) - 1 AND user_id = $1 AND EXTRACT(year FROM date) = Extract(year from now() - interval '1 week')", id)).rows[0][0]
        data.study = (await executeQuery("Select Round(AVG(study_duration)::numeric, 2) FROM evening_report  WHERE EXTRACT(month FROM date) = EXTRACT(month FROM NOW()) - 1 AND user_id = $1 AND EXTRACT(year FROM date) = Extract(year from now() - interval '1 week')", id)).rows[0][0]
        data.quality = (await executeQuery("Select Round(AVG(sleep_quality), 2) FROM morning_report  WHERE EXTRACT(month FROM date) = EXTRACT(month FROM NOW()) - 1 AND user_id = $1 AND EXTRACT(year FROM date) = Extract(year from now() - interval '1 week')", id)).rows[0][0]
        data.mood = (await executeQuery("select Round(AVG(mood), 2) as AM FROM(select mood,date,user_id from evening_report UNION ALL select mood,date,user_id from morning_report) as sub WHERE EXTRACT(month FROM date) = EXTRACT(month FROM NOW()) - 1 AND user_id = $1 AND EXTRACT(year FROM date) = Extract(year from now() - interval '1 week')", id)).rows[0][0]
    }
    return data
}

const getSummary = async() => {
    const res = await executeQuery("Select AVG(sleep_duration) as sleep_duration, AVG(sport_duration) AS sport_duration, AVG(study_duration) as study_duration, AVG(sleep_quality) as sleep_quality, AVG(sub.mood) as mood FROM (select mood, date FROM evening_report UNION ALL select mood, date FROM morning_report) AS sub FULL JOIN morning_report ON morning_report.date = sub.date FULL JOIN evening_report ON evening_report.date = sub.date WHERE sub.date > NOW() - interval '7 day' AND sub.date <= Date 'today'")
    return res.rowsOfObjects()[0]
}

const getDate = async (date) => {
    const res = await executeQuery('Select AVG(sleep_duration) as sleep_duration, AVG(sport_duration) AS sport_duration, AVG(study_duration) as study_duration, AVG(sleep_quality) as sleep_quality, AVG(sub.mood) as mood FROM (select mood, date FROM evening_report UNION ALL select mood, date FROM morning_report) AS sub FULL JOIN morning_report ON morning_report.date = sub.date FULL JOIN evening_report ON evening_report.date = sub.date WHERE sub.date = $1', date)
    return res.rowsOfObjects()[0]
}

export { getWeekly, getMonthly, getSummary, getDate }