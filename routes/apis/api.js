import { getSummary, getDate } from "../../services/SummarizationService.js"

const getSummaryApi = async({response}) => {
    response.body = await getSummary()
}

const getDateApi = async({response,  params})  => {
    const date = `${params.year}-${params.month}-${params.day}`
    response.body = await getDate(date)
}

export { getSummaryApi, getDateApi }