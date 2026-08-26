const express = require('express');
const surveyController = require('../controllers/surveyController');
const questionRoutes = require('./questionRoutes');
const { isAuthenticated } = require('../middleware/auth');
const loadOwnedSurvey = require('../middleware/ownership');
const { validate } = require('../middleware/validate');
const { surveySchema } = require('../validators/surveyValidator');

const router = express.Router();

router.use(isAuthenticated);

router.get('/', surveyController.listSurveys);
router.get('/new', surveyController.showCreateForm);
router.post('/', validate({
  schema: surveySchema,
  redirectTo: () => '/surveys/new'
}), surveyController.createSurvey);

router.use('/:id/questions', questionRoutes);

router.get('/:id', loadOwnedSurvey, surveyController.showSurvey);
router.get('/:id/edit', loadOwnedSurvey, surveyController.showEditForm);
router.get('/:id/results', loadOwnedSurvey, surveyController.showResults);

router.put('/:id', loadOwnedSurvey, validate({
  schema: surveySchema,
  redirectTo: (req) => `/surveys/${req.params.id}/edit`
}), surveyController.updateSurvey);
router.delete('/:id', loadOwnedSurvey, surveyController.deleteSurvey);

router.put('/:id/publish', loadOwnedSurvey, surveyController.publishSurvey);
router.put('/:id/close', loadOwnedSurvey, surveyController.closeSurvey);
router.put('/:id/reopen', loadOwnedSurvey, surveyController.reopenSurvey);

module.exports = router;
