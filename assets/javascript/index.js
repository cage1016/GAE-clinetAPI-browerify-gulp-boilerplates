var router = require('router');
var about = require('./about');

// Add routes to initialize code based on the page the user is on.
new router()
  .case('/', function () {
    console.log('this is home page.');
  })
  .case('/about', about.init)
  .match(location.pathname);