/** @jsx React.DOM */

var React = require('react');
var App = require('./App.js');

module.exports = {
  init: function () {
    console.log('reactbuild.jsx init');

    React.render(<App/>, document.getElementById('result'));
  }
};