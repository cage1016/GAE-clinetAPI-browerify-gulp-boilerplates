var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var cleancss = require('gulp-cleancss');
var concat = require('gulp-concat');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var inline = require('rework-plugin-inline');
var jshint = require('gulp-jshint');
var path = require('path');
var prefix = require('gulp-autoprefixer');
var rework = require('gulp-rework');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var suit = require('rework-suit');
var uglify = require('gulp-uglify');
var literalify = require('literalify');
var watchify = require('watchify');
var reactify = require('reactify');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var streamify = require('gulp-streamify');
var notify = require('gulp-notify');
var glob = require('glob');
var react = require("gulp-react");
var ngHtml2Js = require("gulp-ng-html2js");

// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [];

// Bower External dependencies
var bowerDependencies = {
  // map module names with global objects
  'jquery': 'window.$',
  'bootstrap': 'window.$',
  'eonasdan-bootstrap-datetimepicker': 'window.$',
  'moment': 'window.moment',
  'react': 'window.React',
  'angular': 'window.angular',
  'angular-route': 'window.angular'
};

var browserifyTask = function (options) {

  // Our app bundler
  var appBundler = browserify({
    entries: [options.src], // Only need initial file, browserify finds the rest
    transform: [reactify], // We want to convert JSX to normal javascript
    debug: options.development, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: options.development // Requirement of watchify
  }).transform(literalify.configure(bowerDependencies));

  // We set our dependencies as externals on our app bundler when developing
  (options.development ? dependencies : []).forEach(function (dep) {
    appBundler.external(dep);
  });

  // The rebundle process
  var rebundle = function () {
    var start = Date.now();
    console.log('Building APP bundle');
    appBundler.bundle()
      //.pipe(ngAnnotate())
      .on('error', gutil.log)
      .pipe(source('bundle.js'))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(gulp.dest(options.dest))
      .pipe(gulpif(options.development, livereload()))
      .pipe(notify(function () {
        console.log('APP bundle built in ' + (Date.now() - start) + 'ms');
      }));
  };

  // Fire up Watchify when developing
  if (options.development) {
    appBundler = watchify(appBundler);
    appBundler.on('update', rebundle);
  }

  rebundle();

  // We create a separate bundle for our dependencies as they
  // should not rebundle on file changes. This only happens when
  // we develop. When deploying the dependencies will be included
  // in the application bundle
  if (options.development) {

    var testFiles = glob.sync('./specs/**/*-spec.js');
    var testBundler = browserify({
      entries: testFiles,
      debug: true, // Gives us sourcemapping
      transform: [reactify],
      cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
    });

    dependencies.forEach(function (dep) {
      testBundler.external(dep);
    });

    var rebundleTests = function () {
      var start = Date.now();
      console.log('Building TEST bundle');
      testBundler.bundle()
        .on('error', gutil.log)
        .pipe(source('specs.js'))
        .pipe(gulp.dest(options.dest))
        .pipe(livereload())
        .pipe(notify(function () {
          console.log('TEST bundle built in ' + (Date.now() - start) + 'ms');
        }));
    };

    testBundler = watchify(testBundler);
    testBundler.on('update', rebundleTests);
    rebundleTests();

    // Remove react-addons when deploying, as it is only for
    // testing
    if (!options.development) {
      dependencies.splice(dependencies.indexOf('react-addons'), 1);
    }

    // Run the vendor bundle
    var start = new Date();
    console.log('Building VENDORS bundle');
    gulp.src([
      './bower_components/jquery/dist/jquery.js',
      './bower_components/angular/angular.js',
      './bower_components/angular-route/angular-route.js',
      './bower_components/react/react.js',
      './bower_components/todc-bootstrap/dist/js/bootstrap.js',
      './bower_components/moment/min/moment.min.js',
      './bower_components/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js',
    ])
      .pipe(concat('vendors.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public/javascript'))
      .pipe(notify(function () {
        console.log('VENDORS bundle built in ' + (Date.now() - start) + 'ms');
      }));

  }

};

var cssTask = function (options) {
  if (options.development) {
    var run = function () {
      console.log(arguments);
      var start = new Date();
      console.log('Building CSS bundle');
      gulp.src(options.src)
        .pipe(concat('main.css'))
        .pipe(gulp.dest(options.dest))
        .pipe(gulpif(options.development, livereload()))
        .pipe(notify(function () {
          console.log('CSS bundle built in ' + (Date.now() - start) + 'ms');
        }));
    };
    run();
    gulp.watch(options.src, run);
  } else {
    gulp.src(options.src)
      .pipe(concat('main.css'))
      .pipe(cssmin())
      .pipe(gulp.dest(options.dest));
  }
};

var htmlTask = function (options) {
  var run = function () {
    gulp.src(options.src)
      .pipe(livereload());
  };
  gulp.watch(options.src, run);
};


var nghtmlTask = function (options) {
  if (options.development) {
    var run = function () {
      console.log(arguments);
      var start = new Date();
      console.log('Building ng-html2js bundle');
      gulp.src(options.src)
        .pipe(ngHtml2Js({
          moduleName: "MyAwesomePartials",
          prefix: "/partials"
        }))
        .pipe(concat("partials.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./public/javascript"));
    };

    run();
    gulp.watch(options.src, run);
  } else {
    gulp.src(options.src)
      .pipe(ngHtml2Js({
        moduleName: "MyAwesomePartials",
        prefix: "/partials"
      }))
      .pipe(gulp.dest("./public/javascript"));
  }
};


gulp.task('images', function () {
  gulp.src('./assets/images/**/*')
    .pipe(gulp.dest('./public/images'));
});

// Fonts
gulp.task('fonts', function () {
  return gulp.src([
    './bower_components/todc-bootstrap/dist/fonts/**/*.*'])
    .pipe(gulp.dest('./public/fonts/'));
});

gulp.task('lint', function () {
  return gulp.src([
    './gulpfile.js',
    './assets/javascript/**/*.js'
  ])
    .pipe(react())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});


// Starts our development workflow
gulp.task('default', ['lint', 'fonts', 'images'], function () {

  browserifyTask({
    development: true,
    src: './assets/javascript/index.js',
    dest: './public/javascript/'
  });

  cssTask({
    development: true,
    src: [
      './bower_components/todc-bootstrap/dist/css/bootstrap.css',
      './bower_components/todc-bootstrap/dist/css/tdoc-bootstrap.css',
      './bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
      './assets/stylesheet/custom.css'
    ],
    dest: './public/css'
  });

  htmlTask({
    src: './templates/**/*'
  });

  nghtmlTask({
    development: true,
    src: './assets/javascript/**/*.html'
  });

});