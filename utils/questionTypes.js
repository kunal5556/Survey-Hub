const questionTypeLabels = {
  'single-choice': 'Single choice',
  'multiple-choice': 'Multiple choice',
  'short-text': 'Short text',
  'rating': 'Rating'
};

const questionTypes = Object.keys(questionTypeLabels);

const choiceQuestionTypes = ['single-choice', 'multiple-choice'];

module.exports = { questionTypes, choiceQuestionTypes, questionTypeLabels };
