const { choiceQuestionTypes, ratingScale } = require('./questionTypes');

const isAnswered = (value) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== undefined && value !== null && value !== '';
};

const collectAnswers = (question, responses) => responses
  .map((response) => response.answers.find((answer) => answer.question.equals(question._id)))
  .filter((answer) => answer && isAnswered(answer.value))
  .map((answer) => answer.value);

const withPercentages = (counts, total) => counts.map((entry) => ({
  label: entry.label,
  count: entry.count,
  percentage: total === 0 ? 0 : Math.round((entry.count / total) * 100)
}));

const countChoices = (question, values) => question.options.map((option) => ({
  label: option,
  count: values.filter((value) => [].concat(value).includes(option)).length
}));

const countRatings = (values) => ratingScale.map((rating) => ({
  label: String(rating),
  count: values.filter((value) => Number(value) === rating).length
}));

const averageRating = (values) => {
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce((sum, value) => sum + Number(value), 0);
  return Math.round((total / values.length) * 10) / 10;
};

const summariseQuestion = (question, responses) => {
  const values = collectAnswers(question, responses);
  const summary = {
    id: question._id.toString(),
    text: question.text,
    type: question.type,
    required: question.required,
    answered: values.length
  };

  if (choiceQuestionTypes.includes(question.type)) {
    return Object.assign(summary, { counts: withPercentages(countChoices(question, values), values.length) });
  }

  if (question.type === 'rating') {
    return Object.assign(summary, {
      average: averageRating(values),
      counts: withPercentages(countRatings(values), values.length)
    });
  }

  return Object.assign(summary, { texts: values });
};

const buildSurveyResults = (survey, responses) => ({
  totalResponses: responses.length,
  questions: survey.questions.map((question) => summariseQuestion(question, responses))
});

const buildChartData = (results) => results.questions
  .filter((question) => question.counts)
  .map((question) => ({
    id: question.id,
    type: question.type,
    labels: question.counts.map((entry) => entry.label),
    counts: question.counts.map((entry) => entry.count)
  }));

module.exports = { buildSurveyResults, buildChartData };
