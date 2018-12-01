var gulp = require('gulp');
var gulpRename = require('gulp-rename'); // TODO: 'gulp-rename' is required 2x, here and in rename var
var replace = require('gulp-replace')
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
gulp.task('sass:watch', function (done) {
  var sassWatcher = gulp.watch(scssFiles);
  sassWatcher.on('all', gulp.parallel('sass'));
  done();
});

gulp.task('gulp-config', function () {
  // SEE: https://scotch.io/tutorials/properly-set-environment-variables-for-angular-apps-with-gulp-ng-config
  fs.writeFileSync('./src/js/config/app.constants.blueprint.json', JSON.stringify(constantsBlueprint[ENV])); // write blueprint JSON
  return gulp.src('./src/js/config/app.constants.blueprint.json') // create constants.js file containing angular constants module def
    .pipe(
      gulpNgConfig('app', {
        createModule: false
      })
    )
    .pipe(gulpRename('app.constants.js')) // rename app.constants.blueprint.js to app.constants.js
    .pipe(gulp.dest('./src/js/config')) // output app.constants.js to config dir
});

gulp.task('views', gulp.series(function () {
  return gulp.src(viewFiles)
    .pipe(templateCache({
      standalone: true
    }))    
    .pipe(replace(/templateCache.put\("\//g, 'templateCache.put("')) // kludge breaking forward slash out of every template in templateCache (SEE: https://github.com/miickel/gulp-angular-templatecache/issues/117)
    .on('error', interceptErrors)    
    .pipe(gulpRename("app.templates.js"))    
    .pipe(gulp.dest('./src/js/config/'));
}));

function runBrowserify() {
  return browserify('./src/js/app.js')
    .transform(babelify, { presets: ["es2015"] })
    .transform(ngAnnotate)
    .bundle()
    .on('error', interceptErrors)
    //Pass desired output filename to vinyl-source-stream
    .pipe(source('main.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest('./build/'));  
}

gulp.task('browserify', gulp.series(gulp.series('views'), runBrowserify));

gulp.task('html', function () {
  return gulp.src("src/index.html")
    .on('error', interceptErrors)
    .pipe(gulp.dest('./build/'));
});


// This task is used for building production ready
// minified JS/CSS files into the dist/ folder
gulp.task('build', gulp.series(gulp.parallel('html', 'browserify'), function () {
  var html = gulp.src("build/index.html")
    .pipe(gulp.dest('./dist/'));

  var js = gulp.src("build/main.js")
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));

  return merge(html, js);
}));

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
gulp.task('default', gulp.series(gulp.parallel('html', 'gulp-config', 'browserify', 'sass', 'sass:watch', 'sounds', 'vendor_build_assets'), function () {
  if (process.env.NODE_ENV === 'production') {
    connect.server({ // ** THIS IS DEFINITELY NOT THE RIGHT WAY TO WORK THIS - HAVING THIS gulp-connect server SERVE Express server??? **
      root: "./build",
      // livereload: true,
      host: '0.0.0.0', // added to fix Heroku R10 $PORT binding issue SEE: https://github.com/schickling/gulp-webserver/issues/94
      port: process.env.PORT || 8080 // process.env.PORT provided by Heroku
    });
  } else {
    browserSync.init(['./build/**/**.**'], {
      server: "./build",
      // port: 4000,
      port: process.env.PORT || 8080, // process.env.PORT provided by Heroku
      // reloadDebounce: 4000, // wait 2 seconds before checking for any further updates - SEE: https://browsersync.io/docs/options#option-reloadDebounce *DOESN'T SEEM TO WORK
      notify: false,
      ui: {
        port: 4001
      }
    });    
  }

  // gulp.watch([jsFiles, scssFiles], gulp.parallel('browserify')); // REFERENCE: Gulp 3.x syntax
  var jsScssWatcher = gulp.watch([jsFiles, scssFiles]);
  jsScssWatcher.on('all', runBrowserify);

  var htmlWatcher = gulp.watch("src/index.html");
  htmlWatcher.on('all', gulp.parallel('html'))

  var viewWatcher = gulp.watch(viewFiles);
  viewWatcher.on('all', gulp.parallel('views'));
    
}));

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
