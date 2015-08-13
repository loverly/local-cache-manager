// Start a basic web server to serve the example page

var express = require('express');
var app = express();
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: [],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {}
};

app.use(express.static('examples/client-side/public', options));
app.listen(8080); // Start the server on 8080
console.log('Listening on port 8080');