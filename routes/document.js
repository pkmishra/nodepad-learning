module.exports = function(app){
var Document = app.Document;	
// Document list

app.get('/', function(req, res) {
    res.redirect('/documents');
});

app.get('/documents.:format?', function(req, res) {
  Document.find(function(err, documents) {
    switch (req.params.format) {
      case 'json':
        res.send(documents.map(function(d) {
          return d.__doc;
        }));
      break;

      default:
        res.render('documents/index.jade', {
          locals: { documents: documents }
        });
    }
  });
});

app.get('/documents/:id.:format?/edit', function(req, res) {
  Document.findById(req.params.id, function(err, d) {
    res.render('documents/edit.jade', {
      locals: { d: d }
    });
  });
});

app.get('/documents/new', function(req, res) {
  res.render('documents/new.jade', {
    locals: { d: new Document() }
  });
});

// Create document 
app.post('/documents.:format?', function(req, res) {
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
app.get('/documents/:id.:format?', function(req, res) {
  Document.findById(req.params.id, function(err, d) {
    switch (req.params.format) {
      case 'json':
        res.send(d.__doc);
      break;

      default:
        res.render('documents/show.jade', {
          locals: { d: d }
        });
    }
  });
});

// Update document
app.put('/documents/:id.:format?', function(req, res) {
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
app.del('/documents/:id.:format?', function(req, res) {
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