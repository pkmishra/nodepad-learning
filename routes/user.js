module.exports = function(app, loadUser){
var User = app.User;	
// Document list
// Users
app.get('/users/new', function(req, res) {
  res.render('users/new.jade', {
    locals: { user: new User() }
  });
});

app.post('/users.:format?', function(req, res) {
  var user = new User(req.body.user);

  function userSaved() {
    req.flash('info', 'Your account has been created');
    switch (req.params.format) {
      case 'json':
        res.send(user.__doc);
      break;

      default:
        req.session.user_id = user.id;
        res.redirect('/documents');
    }
  }

  function userSaveFailed() {
     req.flash('error', 'Account creation failed');
    res.render('users/new.jade', {
      locals: { user: user }
    });
  }

  user.save(userSaved, userSaveFailed);
});
}
