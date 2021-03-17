import { executeQuery } from "../database/database.js";
import { bcrypt } from "../deps.js"

const authenticate = async (request) => {
    const body = request.body();
    const params = await body.value;
    
    const email = params.get('email');
    const password = params.get('password');
    const data = {
        email: "",
        errors: [],
        message: ""
    }
    const existingUsers = await executeQuery("SELECT * FROM users WHERE email = $1", email);
    if (existingUsers.rowCount > 0) { 
        data.errors.push('The email is already reserved.')
    }
    if (password.length < 5) {
        data.errors.push('The password is too short')
    }
    if (data.errors.length > 0) {
        data.email = email;
    } else {
        const hash = await bcrypt.hash(password);
        await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, hash);  
        data.message = "Registration successfull!"
    }
    return data;
    
}

const login = async (request, session) => {
    const body = request.body();
    const params = await body.value;

    const email = params.get('email');
    const password = params.get('password');

    const res = await executeQuery("SELECT * FROM users WHERE email = $1;", email);
    if (res.rowCount === 0) {
        return 'Invalid email or password';
    }
    const userObj = res.rowsOfObjects()[0];

    const hash = userObj.password;

    const passwordCorrect = await bcrypt.compare(password, hash);
    if (!passwordCorrect) {
        return 'Invalid email or password';
    }
    await session.set('authenticated', true);
    await session.set('user', {
      id: userObj.id,
      email: userObj.email
    });
    return 'Login successfull!';
}

const getData = async (session) => {
    const yesterday = (await executeQuery("Select Round(AVG(mood), 2) FROM (select mood,date from evening_report UNION ALL select mood,date from morning_report) as sub WHERE date = Date 'yesterday'")).rows[0][0]
    const today = (await executeQuery("Select Round(AVG(mood), 2) FROM (select mood,date,user_id from evening_report UNION ALL select mood,date,user_id from morning_report) as sub WHERE date = Date 'Now'")).rows[0][0]
    return {today: today, yesterday: yesterday}
}

export { authenticate, login, getData }