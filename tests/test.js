var request = require('supertest');

describe('loading express', function() {
	var server;
	//beforeEach(function() {
	//	server = require('../main3000');
	//});
	
	beforeEach(function() {
		server = require('../main3000')();
	});

	afterEach(function(done) {
		server.close(done);
	});

	it('responds to basic call', function testMain (done) {
		request(server).get('/').expect(200, done);
	});

	it('responds to /recent', function testRecent (done) {
		request(server).get('/recent').expect(200, done);
	});

	it('responds to /university', function testUniversity (done) {
		request(server).get('/state').expect(200, done);
	});

	it('should not respond to /random', function testNoResponse (done) {
		request(server).get('/random').expect(404, done);
	});
});
