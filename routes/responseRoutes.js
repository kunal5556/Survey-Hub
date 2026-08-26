const express = require('express');
const responseController = require('../controllers/responseController');
const { validate } = require('../middleware/validate');
const { buildResponseSchema } = require('../validators/responseValidator');

const router = express.Router();

router.use('/:slug', responseController.loadPublicSurvey);

router.get('/:slug', responseController.showPublicSurvey);
router.post('/:slug', responseController.requireOpenSurvey, validate({
  schema: (req) => buildResponseSchema(req.survey.questions),
  data: (req) => req.body.answers || {},
  redirectTo: (req) => `/s/${req.params.slug}`
}), responseController.submitResponse);
router.get('/:slug/thank-you', responseController.showThankYou);

module.exports = router;
