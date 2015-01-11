# Getting Started

#### 1. Install gulp, browserify globally:

```sh
$ npm install --global gulp
$ npm install --global browserify
```

#### 2. Clone repo from github:

```sh
$ git clone https://github.com/cage1016/GAE-clinetAPI-browerify-gulp-boilerplates.git
```

#### 2. Install proejct module from package.json, bower file:

```sh
$ npm install
$ bower install
```

#### 4. Install Google API Python client

```sh
$ wget https://google-api-python-client.googlecode.com/files/google-api-python-client-gae-1.2.zip
$ unzip google-api-python-client-gae-1.2.zip
```

#### 4. Run gulp:

```sh
$ gulp build
```

#### 5. Check result

```sh
$ dev_appserver.py .
```

#### 6. modify application

go `app.yaml` to modify your `your-application-id`

#### 7. Add WEB_CLIENT_ID, WEB_CLIENT_ID_SECRET, DEVELOPER_KEY

go `lib/config.py` to modify your `WEB_CLIENT_ID`, `WEB_CLIENT_ID_SECRET` and `DEVELOPER_KEY` as you need.


# How Browserify bundle with gulp?

```sh
assets
├── javascript
│   ├── about
│   │   ├── datetime-picker.js
│   │   └── index.js
│   └── index.js
└── stylesheet
    └── custom.css
```

Above is assets file structure we setup. Let we see how it work.

```js
// assets/javascript/index.js

var router = require('router');
var about = require('./about');

// Add routes to initialize code based on the page the user is on.
new router()
  .case('/', function () {
    console.log('this is home page.');
  })
  .case('/about', about.init)
  .match(location.pathname);
```

`assets/javascript/index.js` This is our client javascript entry point. We can initialize different object in each route has benn executed via include `router` package.

```js
// assets/javascript/about/index.js

var datetimePicker = require('./datetime-picker');

module.exports = {
    init: function () {
        datetimePicker.init();
    }
};
```

```js
// assets/javascript/about/datetime-picker.js

// this is not the jquery or react installed from npm, it is the global object
// from script tag and we will use literalify to make them require-able
var $ = require('jquery');
require('moment');
require('eonasdan-bootstrap-datetimepicker');
require('bootstrap');

module.exports = {

    init: function () {
        this.addDatetimePickerHandler();
    },

    addDatetimePickerHandler: function () {
        $(function () {
            $('#datetimepicker2').datetimepicker({
                minuteStepping: 1,
                format: 'YYYY/MM/DD HH:mm',
                use24hours: true
            });
        });
    }
};
```
[Eonasdan/bootstrap-datetimepicker](https://github.com/Eonasdan/bootstrap-datetimepicker) In about route, we have a bootstap-datetimepicker plugin need to initialize. datetimepicker require `jQuery`, `Moment.js`, `Bootstrap.js`, `Bootstap Datepicker script` and other CSS file.


```js
// gulefile.js

gulp.task('javascript:browserify', function () {
    browserify().transform(literalify.configure({
        // map module names with global objects
        'jquery': 'window.$',
        'bootstrap': 'window.$',
        'eonasdan-bootstrap-datetimepicker': 'window.$',
        'moment': 'window.moment'
    }))
      .add('./assets/javascript/index.js')
      .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(isProd(uglify()))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/javascript/'));
});
```

> If the libraries you want to browserify are designed for client-side environment (browsers), do not try to find them on npm and then browserify them to the client. Because for many libraries like jquery, jquery-ui, twitter bootstrap, they relies on global object to work properly. The solution is just load those libraries through the script tag like the traditional way that we used to do (can also be installed with a package manager like [bower](http://bower.io/)) and use browserify with [literalify](https://github.com/pluma/literalify) transform to pretend those libraries are actual CommonJS modules.
> by - [Browserify - Bring Nodejs modules to browsers](http://truongtx.me/2014/03/20/browserify-bring-nodejs-modules-to-browser/)


