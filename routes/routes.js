import { Router } from "../deps.js";
import { landingPage, showRegistrationForm, postRegistrationForm, showLoginForm, postLoginForm, logOut } from "./controllers/authController.js";
import { showReportForm, postReportForm } from "./controllers/reportingController.js";
import { getSummary, postSummary } from "./controllers/summarizationController.js"
import { getSummaryApi, getDateApi} from "./apis/api.js"

const router = new Router();

router.get('/', landingPage);
router.get('/auth/registration', showRegistrationForm);
router.post('/auth/registration', postRegistrationForm);
router.get('/auth/login', showLoginForm);
router.post('/auth/login', postLoginForm);
router.post('/auth/logout', logOut);
router.get('/auth/logout', logOut);
router.get('/behavior/reporting', showReportForm)
router.post('/behavior/reporting', postReportForm)
router.get('/behavior/summary', getSummary)
router.post('/behavior/summary', postSummary)
router.get('/api/summary', getSummaryApi)
router.get('/api/summary/:year/:month/:day', getDateApi)

export { router };