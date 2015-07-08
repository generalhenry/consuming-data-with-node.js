var http = require('http');
var jsdom = require('jsdom');
var async = require('async');


http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<!DOCTYPE html><meta charset="utf-8"><title>Alient Posters</title>'); 
  jsdom.env('http://www.imdb.com/find?q=alien&s=tt&ref_=fn_al_tt_mr', function (errors, window) {
    if (errors) {
      throw errors;
    }
    const links = window.document.querySelectorAll('.result_text a');
    window.close();
    async.each(links, function (link, cb) {
      jsdom.env(link.href, function (errors, window) {
        if (errors) {
          throw errors;
        }
        const image = window.document.querySelector('#img_primary img');
        window.close();
        if (image) {
          res.write(image.outerHTML.replace('ia.media-imdb.com', 'htilford.com:5001'));
        }
        cb();
      });
    }, function (err) {
      if (err) {
        throw err;
      }
      res.end();
    });
  });
}).listen(5000);

http.createServer(function (req, res) {
  const url = req.url;
  http.get('http://ia.media-imdb.com' + url, function (resp) {
    resp.pipe(res);
  });
}).listen(5001);
