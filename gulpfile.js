var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var cleancss = require('gulp-cleancss');
var concat = require('gulp-concat');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var inline = require('rework-plugin-inline');
var jshint = require('gulp-jshint');
var path = require('path');
var prefix = require('gulp-autoprefixer');
var rework = require('gulp-rework');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var suit = require('rework-suit');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var es = require('event-stream');
var literalify = require('literalify');
var watchify = require('watchify');
var livereload = require('gulp-livereload');


function isProd(transform) {
    // Assume prod unless NODE_ENV starts with 'dev'.
    return gulpIf(!/^dev/.test(process.env.NODE_ENV), transform);
}

gulp.task('css', function () {
    var target = gulp.src('./templates/_head.html');

    var vendorCSSStream = gulp.src([
        './bower_components/todc-bootstrap/dist/css/bootstrap.css',
        './bower_components/todc-bootstrap/dist/css/tdoc-bootstrap.css',
        './bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
        './assets/stylesheet/custom.css'
    ])
        .pipe(concat('main.min.css'))
        .pipe(rework(suit(), inline('./assets/images'), {sourcemap: true}))
        .pipe(prefix('> 1%', 'last 2 version', 'Safari >= 5.1',
            'ie >= 10', 'Firefox ESR'))
        .pipe(isProd(cleancss({keepSpecialComments: 0})))
        .pipe(gulp.dest('./public/css'));

    return target.pipe(inject(es.merge(vendorCSSStream)))
        .pipe(gulp.dest('./templates'));
});

gulp.task('images', function () {
    gulp.src('./assets/images/**/*')
        .pipe(gulp.dest('./public/images'));
});

gulp.task('lint', function () {
    return gulp.src([
        './gulpfile.js',
        './assets/javascript/**/*.js'
    ])
        .pipe(jshint({
            browser: true,
            boss: true,
            expr: true,
            node: true,
            scripturl: true,
            quotmark: 'single'
        }))
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

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


gulp.task('javascript:static', function () {
    var target = gulp.src('./templates/base.html');

    var vendorJSStream = gulp.src([
        './bower_components/jquery/dist/jquery.js',
        './bower_components/todc-bootstrap/dist/js/bootstrap.js',
        './bower_components/moment/min/moment.min.js',
        './bower_components/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js'
    ])
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/javascript'));

    return target.pipe(inject(es.merge(vendorJSStream)))
        .pipe(gulp.dest('./templates'));
});

gulp.task('javascript', [
    'javascript:static',
    'javascript:browserify'
]);


// Fonts
gulp.task('fonts', function () {
    return gulp.src([
        './bower_components/todc-bootstrap/dist/fonts/**/*.*'])
        .pipe(gulp.dest('./public/fonts/'));
});

gulp.task('watch', ['javascript', 'css', 'images'], function () {
    gulp.watch('./assets/stylesheet/**/*.css', ['css']);
    gulp.watch('./assets/images/**/*', ['images']);
    gulp.watch('./assets/javascript/**/*.js', ['javascript']);

    // start live reload server
    //livereload.listen(35729);
});

gulp.task('build', ['lint', 'javascript', 'css', 'images', 'fonts']);