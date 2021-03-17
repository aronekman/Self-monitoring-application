import { authenticate, login, getData } from "../../services/authenticationService.js"

const landingPage = async({render, session}) => {
    render('landingPage.ejs', {
        authenticated: await session.get('authenticated'),
        user: await session.get('user'),
        data: await getData(session)
    })
}


const showRegistrationForm  = async({render}) => {
    render('register.ejs', {data: []})
}

const postRegistrationForm = async({request, render}) => {
    render('register.ejs', {data: await authenticate(request)});
}

const showLoginForm = async({render}) => {
    render('login.ejs', {message: ''})
}

const postLoginForm = async({session, request, render}) => {
    render('login.ejs', {message: await login(request, session)});
}

const logOut = async({session, response}) => {
    await session.set('authenticated', false)
    await session.set('user', {})
    response.body = `<html>
        <body>
            <p>Logged out</p>
            <a href='/' >back to home page</a>
        </body>
    </html>`
}

export { landingPage, showRegistrationForm, postRegistrationForm, showLoginForm, postLoginForm, logOut }