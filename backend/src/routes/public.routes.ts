import { Router } from 'express'

import { validateBody, authenticate, parseQueryParams } from '../middlewares'

import * as userCtrl from './user/user.ctrl'
import * as reviewCtrl from './review/review.ctrl'
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

router.get('/reviews',
  authenticate,
  parseQueryParams(reviewCtrl.REVIEW_LIST_QUERY_PARAMS),
  reviewCtrl.getReviews)
router.post('/review',
  authenticate,
  validateBody(reviewCtrl.REVIEW_CREATE_SCHEMA),
  reviewCtrl.createReview)

router.get('/submissions',
  authenticate,
  submissionCtrl.getSubmissions)
router.post('/submission',
  authenticate,
  validateBody(submissionCtrl.SUBMISSION_CREATE_SCHEMA),
  submissionCtrl.createSubmission)

export default router
