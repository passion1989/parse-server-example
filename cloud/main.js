
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

require('cloud/twillo.js')
