
// Run $ expresso

/**
 * Module dependencies.
 */

var app = require('../app');
describe('api', function(){
  describe('GET /', function(){
    it('should return title as Express', function(res){
    		res.body.should.be.a('object');
    })
    
  })
});