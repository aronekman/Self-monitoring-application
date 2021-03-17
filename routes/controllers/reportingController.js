import { getReportForm, postMorningForm, postEveneingForm } from "../../services/reportService.js"

const showReportForm = async({request, render, session}) => {
    render('reporting.ejs', await getReportForm(request, session))
}

const postReportForm = async({response, request, render, session}) => {
    const body = request.body();
    const params = await body.value;
    if (params.has('morning')) {
        render('reporting.ejs', await postMorningForm(params, session, response));
    } else if (params.has('evening')) {
        render('reporting.ejs', await postEveneingForm(params, session, response))
    }
}

export { showReportForm, postReportForm }