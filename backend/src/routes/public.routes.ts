import { Router } from 'express'

import { validateBody } from '../middlewares/validateBody'
import { authenticate } from '../middlewares/authMiddleware'

import * as userCtrl from './user/user.ctrl'
import * as reportCtrl from './report/report.ctrl'
import * as submissionCtrl from './submission/submission.ctrl'

const router: Router = Router()

router.post('/login',
  validateBody(userCtrl.USER_CREDENTIALS_SCHEMA),
  userCtrl.loginUser)

router.get('/users',
  authenticate,
  userCtrl.getUsers)
router.post('/user',
  authenticate,
  validateBody(userCtrl.USER_CREATE_SCHEMA),
  userCtrl.createUser)

router.get('/reports',
  authenticate,
  reportCtrl.getReports)
router.post('/report',
  authenticate,
  validateBody(reportCtrl.REPORT_CREATE_SCHEMA),
  reportCtrl.createReport)

router.get('/submissions',
  authenticate,
  submissionCtrl.getSubmissions)
router.post('/submission',
  authenticate,
  validateBody(submissionCtrl.SUBMISSION_CREATE_SCHEMA),
  submissionCtrl.createSubmission)

export default router
