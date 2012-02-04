module.exports = function(app, loadUser){
var Document = app.Document;
// Document list


app.get('/documents.:format?',loadUser, function(req, res) {
  Document.find(function(err, documents) {
    switch (req.params.format) {
      case 'json':
        res.send(documents.map(function(d) {
          return d.__doc;
        }));
      break;

      default:
        res.render('documents/index.jade', {
          locals: { documents: documents, currentUser: req.currentUser }
        });
    }
  });
});

app.get('/documents/:id.:format?/edit',loadUser, function(req, res) {
  Document.findById(req.params.id, function(err, d) {
    res.render('documents/edit.jade', {
      locals: { d: d, currentUser: req.currentUser }
    });
  });
});

app.get('/documents/new',loadUser, function(req, res) {
  res.render('documents/new.jade', {
    locals: { d: new Document() , currentUser: req.currentUser}
  });
});

// Create document 
app.post('/documents.:format?',loadUser, function(req, res) {
  var d = new Document(req.body.d);
  d.save(function() {
    switch (req.params.format) {
      case 'json':
        res.send(d.__doc);
       break;

       default:
        res.redirect('/documents');
    }
  });
});

// Read document
app.get('/documents/:id.:format?',loadUser, function(req, res) {
  Document.findById(req.params.id, function(err, d) {
    switch (req.params.format) {
      case 'json':
        res.send(d.__doc);
      break;

      default:
        res.render('documents/show.jade', {
          locals: { d: d, currentUser: req.currentUser }
        });
    }
  });
});

// Update document
app.put('/documents/:id.:format?',loadUser, function(req, res) {
  Document.findById(req.body.d.id, function(err, d) {
    d.title = req.body.d.title;
    d.data = req.body.d.data;
    d.save(function() {
      switch (req.params.format) {
        case 'json':
          res.send(d.__doc);
         break;

         default:
          res.redirect('/documents');
      }
    });
  });
});

// Delete document
app.del('/documents/:id.:format?',loadUser, function(req, res) {
  Document.findById(req.params.id, function(err, d) {
    d.remove(function() {
      switch (req.params.format) {
        case 'json':
          res.send('true');
         break;

         default:
          res.redirect('/documents');
      } 
    });
  });
});
}