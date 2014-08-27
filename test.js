
var express = require('express');
var http = require('http');
var request = require('supertest');
var parse = require('./');

describe('parse-bearer-token', function () {
  [
    ['express', function createExpressApp() {
      var app = express();
      app.get('/', function (req, res) {
        var token = parse(req);
        res.status(200).send(String(token));
      });
      return app;
    }],
    ['http', function createNativeApp() {
      var app = http.createServer(function (req, res) {
        var token = parse(req);
        res.writeHead(200, { 'content-type': 'text/plain' });
        res.end(String(token));
      });
      return app;
    }],
  ].forEach(function (map) {
    var name = map[0];
    var factory = map[1];
    describe('given an ' + name + ' app', function () {
      var app;
      before(function () {
        app = factory();
      });

      it('should parse the bearer token', function (done) {
        request(app)
        .get('/')
        .set('authorization', 'bearer thetoken')
        .expect('thetoken')
        .end(done);
      });

      it('should return null with no authorization header', function (done) {
        request(app)
        .get('/')
        .expect('null')
        .end(done);
      });

      it('should return null with a malformed bearer', function (done) {
        request(app)
        .get('/')
        .set('authorization', 'bearer')
        .expect('null')
        .end(done);
      });

      it('should return null on non-bearer auth', function (done) {
        request(app)
        .get('/')
        // foo:bar
        .set('authorization', 'basic Zm9vOmJhcg==')
        .expect('null')
        .end(done);
      });
    });
  });
});
