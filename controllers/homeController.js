const showHome = (req, res) => {
  res.render('home/index', { title: 'Home' });
};

const showAbout = (req, res) => {
  res.render('home/about', { title: 'About' });
};

const showContact = (req, res) => {
  res.render('home/contact', { title: 'Contact' });
};

module.exports = { showHome, showAbout, showContact };
