module.exports = function(app, loadUser){
	app.get('/test', function(req, res){
	  res.render('test', { title: 'test' })
	});
}