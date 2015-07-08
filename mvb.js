var http = require('http');
var mdb = require('moviedb')('e093af7f7b8667c03d8db3a018dcd884')
var async = require('async');

http.createServer(function (req, res) {
  mdb.searchMovie({query: 'Alien'}, function(err, resp) {
    if (err) {
      return res.end('ERROR');
    }
    async.map(resp.results, function (result, cb) {
      mdb.movieInfo({ id: result.id }, cb);
    }, function (err, results) {
      if (err) {
        return res.end('ERROR');
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      var html = '<!DOCTYPE html><meta charset="utf-8"><title>alien posters</title>';
      html += results.map(function (result) {
        return '<img src="http://image.tmdb.org/t/p/w500' + result.poster_path + '" alt="' + result.title + '">';
      });
      res.end(html);
    });
  });
}).listen(4000);
