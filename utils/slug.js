const crypto = require('crypto');
const Survey = require('../models/Survey');

const generateShareSlug = async () => {
  let slug = crypto.randomBytes(6).toString('hex');

  while (await Survey.exists({ shareSlug: slug })) {
    slug = crypto.randomBytes(6).toString('hex');
  }

  return slug;
};

module.exports = generateShareSlug;
