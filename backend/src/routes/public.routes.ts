import { Router } from 'express'

import { validateBody, authenticate, parseQueryParams } from '../middlewares'

import * as courseCtrl from './course/course.ctrl'
import * as modelCtrl from './model/model.ctrl'
import * as reviewCtrl from './review/review.ctrl'
import * as reviewFlowCtrl from './review_flow/review_flow.ctrl'
import * as searchCtrl from './search/search.ctrl'
import * as submissionCtrl from './submission/submission.ctrl'
import * as userCtrl from './user/user.ctrl'

const router: Router = Router()

router.post('/login',
  validateBody(userCtrl.USER_CREDENTIALS_SCHEMA),
  userCtrl.loginUser)

router.get('/courses',
  authenticate,
  courseCtrl.getCourses)

router.get('/model/clusters',
  authenticate,
  modelCtrl.getClusters)
router.post('/model/cluster',
  authenticate,
  validateBody(modelCtrl.RUN_CLUSTERING_SCHEMA),
  modelCtrl.runClustering)

router.get('/reviews',
  authenticate,
  parseQueryParams(reviewCtrl.REVIEW_LIST_QUERY_PARAMS),
  reviewCtrl.getReviews)
router.post('/review',
  authenticate,
  validateBody(reviewCtrl.REVIEW_CREATE_SCHEMA),
  reviewCtrl.createReview)

router.get('/reviewflows',
  authenticate,
  parseQueryParams(reviewFlowCtrl.REVIEW_FLOW_LIST_QUERY_PARAMS),
  reviewFlowCtrl.getReviewFlows)
router.post('/reviewflow',
  authenticate,
  validateBody(reviewFlowCtrl.REVIEW_FLOW_CREATE_SCHEMA),
  reviewFlowCtrl.createReviewFlow)

router.get('/search',
  authenticate,
  parseQueryParams(searchCtrl.SEARCH_QUERY_PARAMS),
  searchCtrl.searchSubmissions)

router.get('/submissions',
  authenticate,
  submissionCtrl.getSubmissions)
router.post('/submission',
  authenticate,
  validateBody(submissionCtrl.SUBMISSION_CREATE_SCHEMA),
  submissionCtrl.createSubmission)

router.get('/users',
  authenticate,
  userCtrl.getUsers)
router.post('/user',
  authenticate,
  validateBody(userCtrl.USER_CREATE_SCHEMA),
  userCtrl.createUser)

export default router
