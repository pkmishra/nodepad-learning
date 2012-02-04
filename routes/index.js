
/*
 * GET home page.
 */
module.exports = function(app, loadUser){
	app.get('/', function(req, res){
	  res.render('index.jade', { title: 'Express' });
	  //res.redirect('/documents');
	});
}