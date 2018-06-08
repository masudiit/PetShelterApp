const express = require('express');
const partials = require('express-partials');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const config = require('config');

const app = express();

const port = process.env.PORT || config.get('App.Port');
app.use(partials());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');


const nav = [{
  link: '/pets',
  title: 'Pets'
}
];

const routes = require('./src/routes');

app.use('/pets', routes.petRouteFunc(nav));


app.get('/', (req, res) => {
  res.redirect('/pets');
});


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(port, () => {
  debug(`Listening on port ${chalk.green(port)}`);
});

