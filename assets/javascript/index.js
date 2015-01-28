var router = require('router');
var about = require('./about');
var react = require('./react');
var spa = require('./spa');

// Add routes to initialize code based on the page the user is on.
new router()
  .case('/', function () {
    console.log('this is home page.');
  })
  .case('/about', about.init)
  .case('/react', react.init)
  .case('/spa', spa.init)
  .match(location.pathname);