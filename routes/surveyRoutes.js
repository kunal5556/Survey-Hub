const express = require('express');
const surveyController = require('../controllers/surveyController');
const questionRoutes = require('./questionRoutes');
const { isAuthenticated } = require('../middleware/auth');
const loadOwnedSurvey = require('../middleware/ownership');

const router = express.Router();

router.use(isAuthenticated);

router.get('/', surveyController.listSurveys);
router.get('/new', surveyController.showCreateForm);
router.post('/', surveyController.createSurvey);

router.use('/:id/questions', questionRoutes);

router.get('/:id', loadOwnedSurvey, surveyController.showSurvey);
router.get('/:id/edit', loadOwnedSurvey, surveyController.showEditForm);
router.put('/:id', loadOwnedSurvey, surveyController.updateSurvey);
router.delete('/:id', loadOwnedSurvey, surveyController.deleteSurvey);

module.exports = router;
