const express = require('express');
const questionController = require('../controllers/questionController');
const loadOwnedSurvey = require('../middleware/ownership');

const router = express.Router({ mergeParams: true });

router.use(loadOwnedSurvey);

router.get('/new', questionController.showAddForm);
router.post('/', questionController.addQuestion);

router.use('/:questionId', questionController.loadQuestion);

router.get('/:questionId/edit', questionController.showEditForm);
router.put('/:questionId', questionController.updateQuestion);
router.put('/:questionId/move', questionController.moveQuestion);
router.delete('/:questionId', questionController.deleteQuestion);

module.exports = router;
