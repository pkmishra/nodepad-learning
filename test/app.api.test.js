
// Run $ expresso

/**
 * Module dependencies.
 */
/*
process.env.NODE_ENV = 'test';
var should = require('should');   
var app = require('../app');
var document = app.Document;

describe('nodepad application api', function(){
	describe('create document', function(){
		it('should return the document created', function(){
			var d = new document({ title: "testtitle", data: "testnotes" });
			d.save();
			document.findById(d._id, function(err, doc){
				doc.should.have.property('title','testtitle');
				doc.should.have.property('data','testnotes');
				//doc.remove();
			});
		});
	});
	describe('update document', function(){	
		it('should save modified document', function(){
			var d = new document({ title: "testtitle1", data: "testnotes1" });
			d.save();
			document.findById(d._id, function(err, doc){
				doc.title = 'newtitle1';
				doc.data = 'newnotes1';
				doc.save();
				doc.should.have.property('title','newtitle1');
				doc.should.have.property('data','newnotes1');
				//doc.remove();
			});
		});
	});
	describe('delete document', function(){	
		it('should delete all documents', function(){
			var d = new document({ title: "testtitle2", data: "testnotes3" });
			d.save();
			document.find(function(err, documents){
				documents.forEach(function(d){
		 		    d.remove();	
		 		}); 	
		 	});
		});
	});
});

*/