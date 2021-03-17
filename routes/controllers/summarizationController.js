import { getWeekly, getMonthly} from "../../services/SummarizationService.js"

const getSummary = async({render, session}) => {
    const id = (await session.get('user')).id
    render('summary.ejs', {
        week: await getWeekly(id),
        month: await getMonthly(id)
    })
}

const postSummary = async({render, request, session}) => {
    const id = (await session.get('user')).id
    const body = request.body();
    const params = await body.value;
    const week = params.get('week');
    const month = params.get('month');
    render('summary.ejs', {
        week: await getWeekly(id, week),
        month: await getMonthly(id, month)
    })
}

export { getSummary, postSummary }