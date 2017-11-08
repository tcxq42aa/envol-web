var express = require('express');
var compression = require('compression');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var proxy = require('http-proxy-middleware');
var session = require('express-session')
var FileStore = require('session-file-store')(session);
var querystring = require('querystring');
var routes = require('./routes/index').router;
var users = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if(app.get('env') == 'dev') {
  app.use('/dist', proxy({target: 'http://127.0.0.1:8081', changeOrigin: true}));
}
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {maxAge:1000*60*60}));
app.use(session({
  store: new FileStore(),
  secret: 'keyboard cat',
  cookie: { maxAge: 700000 },
  resave: true,
  saveUninitialized: true
}))


app.all(function(req, res, next){
  next()
})
app.use('/', routes);
app.use('/api/userSemester', users);

var serverHost = 'http://127.0.0.1:8080'
if(app.get('env') == 'dev') {
  serverHost = 'http://support.envol.vip'
  // serverHost = 'http://127.0.0.1:8080'
}
app.use('/api', proxy({
  target: serverHost,
  changeOrigin: true,
  pathRewrite: function (path, req) {
    var q = ''
    if(req.session.userInfo && req.session.userInfo.openid) {
      let qy = Object.assign({}, req.query);
      qy.openid = qy.openId = req.session.userInfo.openid;
      q = '?' + querystring.stringify(qy)
    }
    return req.path + q
  },
  onProxyReq: function(proxyReq, req, res){
    if(req.session.userInfo && req.session.userInfo.openid) {
      proxyReq.setHeader('openid', req.session.userInfo.openid);
      proxyReq.setHeader('openId', req.session.userInfo.openid);
    }
  }
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
