
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    jade = require('jade'),
    mongoose = require('mongoose'),
    util = require('util'),
    mongoStore = require('connect-mongodb'),
    models = require('./models'),
    path = require('path'),
    stylus = require('stylus'),
    //markdown = require('markdown').markdown,
    Document,
    db,
    User,
    LoginToken;
var app = module.exports = express.createServer();
app.helpers(require('./helpers.js').helpers);
app.dynamicHelpers(require('./helpers.js').dynamicHelpers);
// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({store: mongoStore(app.set('db-uri')), secret : 'nodepad-learning-secret#123'}));
  app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }))
  app.use(express.methodOverride());
  app.use(stylus.middleware({ src: __dirname + '/public' }));
  //app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
    app.use(express.logger());
    app.use(express.logger({ format: ':method :uri' }));
 	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
 	app.set('db-uri', 'mongodb://localhost/nodepad-development');
 	app.set('view options', {
    	pretty: true
  	});
});

app.configure('production', function(){
	app.use(express.logger());
    app.use(express.errorHandler());
    app.set('db-uri', 'mongodb://localhost/nodepad-production');
});


app.configure('test', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
 	app.set('db-uri', 'mongodb://localhost/nodepad-test');
  	app.set('view options', {
    	pretty: true
  	});  
});

models.defineModels(mongoose, function() {
  app.Document = Document = mongoose.model('Document');
  app.User = User = mongoose.model('User');
  app.LoginToken = LoginToken = mongoose.model('LoginToken');
   db = mongoose.connect(app.set('db-uri'));
})

// Error handling
function NotFound(msg) {
  this.name = 'NotFound';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

util.inherits(NotFound, Error);

app.get('/404', function(req, res) {
  throw new NotFound;
});

app.get('/500', function(req, res) {
  throw new Error('An expected error');
});

app.get('/bad', function(req, res) {
  unknownMethod();
});

app.error(function(err, req, res, next) {
  if (err instanceof NotFound) {
    res.render('404.jade', { status: 404 });
  } else {
    next(err);
  }
});

app.error(function(err, req, res) {
  res.render('500.jade', {
    status: 500,
    locals: {
      error: err
    } 
  });
});

function authenticateFromLoginToken(req, res, next) {
  var cookie = JSON.parse(req.cookies.logintoken);

  LoginToken.findOne({ email: cookie.email,
                       series: cookie.series,
                       token: cookie.token }, (function(err, token) {
    if (!token) {
      res.redirect('/sessions/new');
      return;
    }

    User.findOne({ email: token.email }, function(err, user) {
      if (user) {
        req.session.user_id = user.id;
        req.currentUser = user;

        token.token = token.randomToken();
        token.save(function() {
          res.cookie('logintoken', token.cookieValue, { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
          next();
        });
      } else {
        res.redirect('/sessions/new');
      }
    });
  }));
}


function loadUser(req, res, next) {
  if (req.session.user_id) {
    User.findById(req.session.user_id, function(err, user) {
      if (user) {
        req.currentUser = user;
        next();
      } else {
        res.redirect('/sessions/new');
      }
    });
  } else if (req.cookies.logintoken) {
    authenticateFromLoginToken(req, res, next);
  } else {
    res.redirect('/sessions/new');
  }
}

// Routes
//app.get('/', routes.index);
app.get('/', loadUser, function(req, res) {
    res.redirect('/documents');
});


require('./routes/document')(app, loadUser);
require('./routes/user')(app, loadUser);
require('./routes/session')(app, loadUser);
require('./routes/index')(app, loadUser);
require('./routes/test')(app, loadUser);



if (!module.parent) {
  app.listen(3000);
  console.log('Express server listening on port %d, environment: %s', app.address().port, app.settings.env)
  //console.log('Using connect %s, Express %s, Jade %s', connect.version, express.version, jade.version);
}
