require('dotenv').config();

const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const connectDatabase = require('./config/database');
const attachCurrentUser = require('./middleware/currentUser');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const homeRoutes = require('./routes/homeRoutes');
const authRoutes = require('./routes/authRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const responseRoutes = require('./routes/responseRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

const readMongodbUri = () => {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined. Copy .env.example to .env, or set it in your hosting dashboard.');
    process.exit(1);
  }

  return process.env.MONGODB_URI;
};

const readSessionSecret = () => {
  if (process.env.SESSION_SECRET) {
    return process.env.SESSION_SECRET;
  }

  if (isProduction) {
    console.error('SESSION_SECRET must be set when NODE_ENV is production.');
    process.exit(1);
  }

  return 'local-development-session-secret';
};

if (isProduction) {
  app.set('trust proxy', 1);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: readSessionSecret(),
  resave: false,
  saveUninitialized: false,
  proxy: isProduction,
  store: MongoStore.create({
    mongoUrl: readMongodbUri(),
    collectionName: 'sessions',
    ttl: 60 * 60 * 24
  }),
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.formInput = req.flash('formInput')[0] || {};
  next();
});

app.use(attachCurrentUser);

app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/surveys', surveyRoutes);
app.use('/s', responseRoutes);
app.use('/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`Server started on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to start the server:', error.message);
    process.exit(1);
  }
};

startServer();
