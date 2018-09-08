var gulp = require('gulp');
var gulpRename = require('gulp-rename');
var fs = require('file-system');
var using = require('gulp-using');
// var gulpExpress   = require('gulp-express'); // ADD "gulp-express": "*" to package.json
// var debug         = require('debug');
var connect = require('gulp-connect'); // add "gulp-connect": "^2.0.6", to package.json *NOTE: gulp-connect DEPRECATED
// var webserver     = require('gulp-webserver'); // NOTE: DON'T use Express and gulp-webserver concurrently DUH!!!
var notify = require('gulp-notify');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');
var ngAnnotate = require('browserify-ngannotate');
var browserSync = require('browser-sync').create();
var rename = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var merge = require('merge-stream');
var sass = require('gulp-sass');
var log = require('fancy-log');
var gulpNgConfig = require('gulp-ng-config');
var constantsBlueprint = require('./src/js/config/app.constants.blueprint.js'); // require config module (AppConstants)

require('dotenv').load(); // loads .env file in root directory
var ENV = process.env.NODE_ENV || 'development'; // default to development if no NODE_ENV specified

// Where our files are located
var jsFiles = "src/js/**/*.js";
var viewFiles = "src/js/**/*.html";

var interceptErrors = function (error) {
  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
};

var scssFiles = "./src/public/stylesheets/sass/**/*.scss";
var cssFiles = "./build/";

gulp.task('sass', function () {
  return gulp.src(scssFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(cssFiles));
});
gulp.task('sass:watch', function () {
  gulp.watch(scssFiles, ['sass']);
});

gulp.task('gulp-config', function () {
  // SEE: https://scotch.io/tutorials/properly-set-environment-variables-for-angular-apps-with-gulp-ng-config
  fs.writeFileSync('./src/js/config/app.constants.blueprint.json', JSON.stringify(constantsBlueprint[ENV])); // write blueprint JSON
  gulp.src('./src/js/config/app.constants.blueprint.json') // create constants.js file containing angular constants module def
    .pipe(
      gulpNgConfig('app', {
        createModule: false
      })
    )
    .pipe(gulpRename('app.constants.js')) // rename app.constants.blueprint.js to app.constants.js
    .pipe(gulp.dest('./src/js/config')) // output app.constants.js to config dir
});

gulp.task('browserify', ['views'], function () {
  return browserify('./src/js/app.js')
    .transform(babelify, { presets: ["es2015"] })
    .transform(ngAnnotate)
    .bundle()
    .on('error', interceptErrors)
    //Pass desired output filename to vinyl-source-stream
    .pipe(source('main.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest('./build/'));
});

gulp.task('html', function () {
  return gulp.src("src/index.html")
    .on('error', interceptErrors)
    .pipe(gulp.dest('./build/'));
});

gulp.task('views', function () {
  return gulp.src(viewFiles)
    .pipe(templateCache({
      standalone: true
    }))
    .on('error', interceptErrors)
    .pipe(rename("app.templates.js"))
    .pipe(gulp.dest('./src/js/config/'));
});

// This task is used for building production ready
// minified JS/CSS files into the dist/ folder
gulp.task('build', ['html', 'browserify'], function () {
  var html = gulp.src("build/index.html")
    .pipe(gulp.dest('./dist/'));

  var js = gulp.src("build/main.js")
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));

  return merge(html, js);
});

gulp.task('sounds', function () {
  return gulp.src('./src/public/sounds/*')
    .on('error', interceptErrors)
    .pipe(gulp.dest('./build/assets/sounds/'))
})

gulp.task('vendor_build_assets', function () {
  return gulp.src('./src/vendor/javascripts/vendor_build_scripts/*')
    .on('error', interceptErrors)
    .pipe(gulp.dest('./build/'))
})

// CONDITIONALLY launch server => browser-sync (LOCAL) || gulp-connect (PRODUCTION) 
gulp.task('default', ['html', 'gulp-config', 'browserify', 'sass', 'sass:watch', 'sounds', 'vendor_build_assets'], function () {
  if (process.env.NODE_ENV === 'production') {
    log('PROD')
    connect.server({ // ** THIS IS DEFINITELY NOT THE RIGHT WAY TO WORK THIS - HAVING THIS gulp-connect server SERVE Express server??? **
      root: "./build",
      // livereload: true,
      port: process.env.PORT || 8080 // process.env.PORT provided by Heroku
    });
  } else {
    log('!PROD')
    browserSync.init(['./build/**/**.**'], {
      server: "./build",
      // port: 4000,
      port: process.env.PORT || 8080, // process.env.PORT provided by Heroku
      notify: false,
      ui: {
        port: 4001
      }
    });    
  }

  gulp.watch([jsFiles, scssFiles], ['browserify']);
  gulp.watch("src/index.html", ['html']);
  gulp.watch(viewFiles, ['views']);
  
});

// // * ATTEMPTS at implementing non-browserSync server. SEE: https://www.sitepoint.com/deploying-heroku-using-gulp-node-git/
// gulp.task('default', ['html', 'browserify', 'sass', 'sass:watch', 'sounds', 'vendor_build_assets'], function () {
//   // browserSync.init(['./build/**/**.**'], {
//   //   server: "./build",
//   //   // port: 4000,
//   //   port: process.env.PORT || 8080, // process.env.PORT provided by Heroku
//   //   notify: false,
//   //   ui: {
//   //     port: 4001
//   //   }

//   /* ATTEMPTED to use gulp-connect, but it appears to be deprecated */
//   // connect.server({ // TODO: need 'gulp-connect' package, SEE: https://www.npmjs.com/package/gulp-connect
//   //   root: 'client/src/js',
//   //   port: process.env.PORT || 3000, // localhost:5000
//   //   livereload: false
//   // });
//   connect.server({ // ** THIS IS DEFINITELY NOT THE RIGHT WAY TO WORK THIS - HAVING THIS gulp-connect server SERVE Express server??? **
//     root: "./build",
//     // livereload: true,
//     port: process.env.PORT || 8080 // process.env.PORT provided by Heroku
//   });

//   /* ATTEMPTED to use gulp-webserver SEE: https://github.com/schickling/gulp-webserver */
//   // gulp.src('./build/**/**.**')
//   //   // .pipe(using())
//   //   .pipe(webserver({
//   //     // fallback: 'index.html',
//   //     livereload: false,
//   //     // directoryListing: true,
//   //     // open: true
//   //   }));

//   /* ATTEMPT to use gulp-express server - https://www.npmjs.com/package/gulp-express */
//   // gulpExpress.run(['app.js'])
//   //   .transform(babelify, {presets: ["es2015"]});
//   // gulpExpress.run('build/app.js')

//   gulp.watch("src/index.html", ['html']);
//   gulp.watch(viewFiles, ['views']);
//   // gulp.watch([jsFiles, scssFiles], ['browserify']);
// });
