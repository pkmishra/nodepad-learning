
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    jade = require('jade'),
    mongoose = require('mongoose'),
    models = require('./models'),
    should = require('should'),
    Document,
    db,
    User,
    LoginToken;
var app = module.exports = express.createServer();
// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
    app.use(express.logger());
    app.use(express.logger({ format: ':method :uri' }));
 	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
 	db = mongoose.connect('mongodb://localhost/nodepad-development');
});

app.configure('production', function(){
	app.use(express.logger());
    app.use(express.errorHandler());
    db = mongoose.connect('mongodb://localhost/nodepad-production'); 
});


app.configure('test', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
 	db = mongoose.connect('mongodb://localhost/nodepad-test');
});

models.defineModels(mongoose, function() {
  app.Document = Document = mongoose.model('Document');
})

// Routes
//app.get('/', routes.index);

require('./routes/document')(app);
require('./routes/index')(app);
require('./routes/test')(app);



if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d, environment: %s", app.address().port, app.settings.env)
}
