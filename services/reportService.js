import { executeQuery } from "../database/database.js";

const getDate = () => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    today = yyyy+'-'+mm+'-'+('0' + dd).slice(-2);
    return today;
}

const getReportForm = async (request, session) => {
    const param = request.url.search.substring(1);
    let data = {
        morning: false,
        evening: false,
        date: getDate(),
        mood: 3,
        errors: [],
        prev_morning: false,
        prev_evening: false
    };
    if (param) {
        if (param.startsWith('morning')) {
            data.morning = true;
            data['sleep'] = null;
            data['quality'] = 3;
            return data;
        } else {
            data.evening = true;
            data['sports'] = null;
            data['study'] = null;
            data['eating'] = 3;
            return data;
        }
    } else {
        const userId = (await session.get('user')).id
        const morning = await executeQuery('SELECT * FROM morning_report where date = $1 AND user_id =  $2', getDate(), userId);
        const evening = await executeQuery('SELECT * FROM evening_report where date = $1 AND user_id =  $2', getDate(), userId);
        if (morning && morning.rows.length > 0) {
            data.prev_morning =  true
        }
        if (evening && evening.rows.length > 0) {
            data.prev_evening = true
        }
        return data
    }
}

const postMorningForm = async (params, session) => {
    const date = params.get('morning');
    const sleep = params.get('sleep');
    const quality = params.get('quality');
    const mood = params.get('mood')
    const data = {
        morning: false,
        evening: false,
        date: getDate(),
        sleep: null,
        quality: 3,
        mood: 3,
        prev_morning: false,
        prev_evening: false,
        errors: []
    };
    if (!sleep || sleep < 0) {
        data.errors.push('Sleep duration must be entered, must be a number (can be decimal), and cannot be negative')
        data.date = date;
        data.sleep = sleep;
        data.quality = quality;
        data.mood = mood;
        data.morning = true
        return data;
    } 
    const userId = (await session.get('user')).id
    const res = await executeQuery('SELECT * FROM morning_report where date = $1 AND user_id =  $2', date, userId);
    if (res) {
        await executeQuery('DELETE FROM morning_report where date = $1 AND user_id =  $2', date, userId);
    } 
    await executeQuery('INSERT INTO morning_report (date, sleep_duration, sleep_quality, mood, user_id) VALUES ($1, $2, $3, $4, $5)', date, sleep, quality, mood, userId)
    const morning = await executeQuery('SELECT * FROM morning_report where date = $1 AND user_id =  $2', getDate(), userId);
    const evening = await executeQuery('SELECT * FROM evening_report where date = $1 AND user_id =  $2', getDate(), userId);
    if (morning && morning.rows.length > 0) {
        data.prev_morning =  true
    }
    if (evening && evening.rows.length > 0) {
        data.prev_evening = true
    }
    return data
}


const postEveneingForm = async (params, session) => {
    const date = params.get('evening');
    const sports = params.get('sports');
    const study = params.get('study');
    const eating = params.get('eating')
    const mood = params.get('mood')
    const data = {
        morning: false,
        evening: false,
        date: new Date(),
        sports: null,
        study: null,
        eating: 3,
        mood: 3,
        prev_morning: false,
        prev_evening: false,
        errors: []
    };
    if (!sports || sports < 0 || !study || study < 0) {
        data.errors.push('Time spent on sports and exercise and time spent studying are reported in hours, must be entered, must be a number (can be decimal), and cannot be negative')
        data.date = date;
        data.sports = sports;
        data.study = study;
        data.eating = eating;
        data.mood = mood;
        data.evening = true
        return data;
    }
    const userId = (await session.get('user')).id
    const res = await executeQuery('SELECT * FROM evening_report where date = $1 AND user_id =  $2', date, userId);
    if (res) {
        await executeQuery('DELETE FROM evening_report where date = $1 AND user_id =  $2', date, userId);
    } 
    await executeQuery('INSERT INTO evening_report (date, sport_duration, study_duration, eating, mood, user_id) VALUES ($1, $2, $3, $4, $5, $6)', date, sports, study, eating, mood, userId)
    const morning = await executeQuery('SELECT * FROM morning_report where date = $1 AND user_id =  $2', getDate(), userId);
    const evening = await executeQuery('SELECT * FROM evening_report where date = $1 AND user_id =  $2', getDate(), userId);
    if (morning && morning.rows.length > 0) {
        data.prev_morning =  true
    }
    if (evening && evening.rows.length > 0) {
        data.prev_evening = true
    }
    return data
}


export { getReportForm, postMorningForm, postEveneingForm }