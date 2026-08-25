const { questionSchema } = require('../validators/surveyValidator');
const { questionTypes, choiceQuestionTypes, questionTypeLabels } = require('../utils/questionTypes');

const buildQuestionInput = (body) => {
  const input = {
    text: body.text,
    type: body.type,
    required: body.required === 'on'
  };

  if (choiceQuestionTypes.includes(body.type)) {
    input.options = [].concat(body.options || [])
      .map((option) => option.trim())
      .filter((option) => option !== '');
  }

  return input;
};

const questionFormData = (req, extra) => Object.assign({
  survey: req.survey,
  questionTypes,
  choiceQuestionTypes,
  questionTypeLabels
}, extra);

const loadQuestion = (req, res, next) => {
  const question = req.survey.questions.id(req.params.questionId);

  if (!question) {
    req.flash('error', 'That question could not be found');
    return res.redirect(`/surveys/${req.survey._id}`);
  }

  req.question = question;
  next();
};

const showAddForm = (req, res) => {
  res.render('questions/new', questionFormData(req, { title: 'Add Question' }));
};

const addQuestion = async (req, res) => {
  const { error, value } = questionSchema.validate(buildQuestionInput(req.body));
  if (error) {
    req.flash('error', error.details[0].message);
    return res.redirect(`/surveys/${req.survey._id}/questions/new`);
  }

  req.survey.questions.push(value);
  await req.survey.save();

  req.flash('success', 'Question added');
  res.redirect(`/surveys/${req.survey._id}`);
};

const showEditForm = (req, res) => {
  res.render('questions/edit', questionFormData(req, { title: 'Edit Question', question: req.question }));
};

const updateQuestion = async (req, res) => {
  const { error, value } = questionSchema.validate(buildQuestionInput(req.body));
  if (error) {
    req.flash('error', error.details[0].message);
    return res.redirect(`/surveys/${req.survey._id}/questions/${req.question._id}/edit`);
  }

  req.question.set(value);
  await req.survey.save();

  req.flash('success', 'Question updated');
  res.redirect(`/surveys/${req.survey._id}`);
};

const moveQuestion = async (req, res) => {
  const questions = req.survey.questions;
  const currentIndex = questions.findIndex((question) => question._id.equals(req.question._id));
  const targetIndex = req.body.direction === 'up' ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex >= 0 && targetIndex < questions.length) {
    const [movedQuestion] = questions.splice(currentIndex, 1);
    questions.splice(targetIndex, 0, movedQuestion);
    await req.survey.save();
  }

  res.redirect(`/surveys/${req.survey._id}`);
};

const deleteQuestion = async (req, res) => {
  req.question.deleteOne();
  await req.survey.save();

  req.flash('success', 'Question removed');
  res.redirect(`/surveys/${req.survey._id}`);
};

module.exports = {
  loadQuestion,
  showAddForm,
  addQuestion,
  showEditForm,
  updateQuestion,
  moveQuestion,
  deleteQuestion
};
