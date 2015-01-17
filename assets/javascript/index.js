var router = require('router');
var about = require('./about');
var react = require('./react');

// Add routes to initialize code based on the page the user is on.
new router()
  .case('/', function () {
    console.log('this is home page.');
  })
  .case('/about', about.init)
  .case('/react', react.init)
  .match(location.pathname);