const express = require('express');
const questionController = require('../controllers/questionController');
const loadOwnedSurvey = require('../middleware/ownership');
const { validate } = require('../middleware/validate');
const { questionSchema } = require('../validators/surveyValidator');

const router = express.Router({ mergeParams: true });

const validateQuestion = (redirectTo) => validate({
  schema: questionSchema,
  data: (req) => questionController.buildQuestionInput(req.body),
  redirectTo
});

router.use(loadOwnedSurvey);
router.use(questionController.requireDraftSurvey);

router.get('/new', questionController.showAddForm);
router.post('/', validateQuestion((req) => `/surveys/${req.params.id}/questions/new`), questionController.addQuestion);

router.use('/:questionId', questionController.loadQuestion);

router.get('/:questionId/edit', questionController.showEditForm);
router.put('/:questionId', validateQuestion((req) => `/surveys/${req.params.id}/questions/${req.params.questionId}/edit`), questionController.updateQuestion);
router.put('/:questionId/move', questionController.moveQuestion);
router.delete('/:questionId', questionController.deleteQuestion);

module.exports = router;
