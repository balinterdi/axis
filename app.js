
function handleError(){
  console.error('error:', e);
}

process.on('uncaughtException', handleError);

try {
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/result/:id', routes.result);
app.get('/stats', routes.stats);
app.get('/stats/age', routes.age);
app.get('/stats/lang', routes.lang);
app.get('/stats/startup', routes.startup);
app.get('/age_vs_lib', routes.age_vs_lib);
app.post('/submit', routes.submit);
app.post('/email', routes.email);

app.listen(3002, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
} catch (e) {
  handleError(e);
}
