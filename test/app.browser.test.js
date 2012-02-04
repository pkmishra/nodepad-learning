
// Run $ expresso

/**
 * Module dependencies.
 */
process.env.NODE_ENV = 'test';
var app = require('../app'),
	should = require('should'),
    Browser = require('zombie'),
    document = app.Document;
browser = new Browser();


describe('nodepad application', function(){
	describe('browser testing ', function(){	
 	   it('Visit to default page should redirect to login page', function(done){
			browser.visit('http://localhost:3000',{debug:true}, function(){
				browser.statusCode.should.equal(200);
				done();
			});
		});
		 it('After submitting login information user should be taken to document list page', function(done){
			browser.visit('/sessions/new', function(){
				browser.statusCode.should.equal(200);
				browser
				.fill('user[email]', 'pkmishra@gmail.com')
				.fill('user[password]', 'password')
				.pressButton('Log In', function(){
					browser.statusCode.should.equal(200);
					browser.text('a.destroy').should.include('Log Out');
					done();	
				});
				
			});
		});	
	});	
});

