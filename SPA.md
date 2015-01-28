# Add Angular SPA serve as new route.


```javascript
assets/javascript
└── spa
    ├── controllers
    │   ├── ViewCtrl.js
    │   └── WelcomeCtrl.js
    ├── index.js
    └── views
        ├── a.html
        └── b.html
```

We add new folder `spa` in `assets/javascript`. `spa/index.js` still is route entry point and we can boostrap angular application here.

```javascript
// assets/javascript/spa/index.js

var angular = require('angular');
var route = require('angular-route');
var WelcomeCtrl = require('./controllers/WelcomeCtrl');
var ViewCtrl = require('./controllers/ViewCtrl');

module.exports = {
  init: function () {
    console.log('spa init');

    angular.element(document).ready(function () {
      var app = angular.module('myApp', ['ngRoute', 'MyAwesomePartials']);
      app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
          when('/', {
            templateUrl: '/partialsspa/views/a.html',
            controller: WelcomeCtrl
          }).
          when('/views/:id', {
            templateUrl: '/partialsspa/views/b.html',
            controller: ViewCtrl
          }).
          otherwise({redirectTo: '/'});
      }]);

      angular.bootstrap(document, ['myApp']);
      angular.element('html').addClass('ng-app: myApp');
    });

  }
};
```

Be an Angular application, we can setup our file structure by speraration of concerns, controllers have their own folder, views have their own folder etc.
In `spa/index.js` entry point. We include `angular` and `angular-route` (both of them we defined in `gulefile.js`), `WeclomeCtr` and `ViewCtrl`. 


## [gulp-ng-html2js](https://github.com/marklagendijk/gulp-ng-html2js/blob/master/README.md)

> A plugin for [gulp](https://github.com/wearefractal/gulp) which generates AngularJS modules, which pre-load your HTML code into the [$templateCache](http://docs.angularjs.org/api/ng.%24templateCache). This way AngularJS doesn't need to request the actual HTML files anymore.

 
```javascript
// gulpfile.js

var ngHtml2Js = require("gulp-ng-html2js");

gulp.src("./assets/javascript/**/*.html")
    .pipe(ngHtml2Js({
        moduleName: "MyAwesomePartials",
        prefix: "/partials"
    }))
    .pipe(concat("partials.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./public/javascript"));
```

We can convert our `spa/views/*.html` into angular `$templateCache` by `gulp-ng-html2js` and inject `MyAwesomePartials` module to our angular application as usual.

Last step. Dont't forget to include `partials.min.js`

```html
// base.html

<script src="/public/javascript/vendors.js"></script>
<script src="/public/javascript/bundle.js"></script>
<script src="/public/javascript/partials.min.js"></script> <--- minify angular $templateCache module
```



