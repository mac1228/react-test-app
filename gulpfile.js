let gulp = require('gulp');
let LiveServer = require('gulp-live-server');
let browserSync = require('browser-sync');
let babelify = require('babelify');
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let uglify = require('gulp-uglify');
let watchify = require('watchify');
let tsify = require('tsify');
let sourcemaps = require('gulp-sourcemaps');
let buffer = require('vinyl-buffer');
let sass = require('gulp-sass');
let concat = require('gulp-concat');
let autoprefixer = require('gulp-autoprefixer');
let gulpif = require('gulp-if');
let del = require('del');

let path = {
  SRC_HTML: 'app/**/*.html',
  SRC_TSX: 'app/**/*.tsx',
  SRC_SCSS: 'app/**/*.scss',
  OUT_JS: 'app.js',
  OUT_CSS: 'style.css',
  DEV_DIR: 'dist/development',
  PROD_DIR: 'dist/production',
  ENTRY_POINT: 'app/app.tsx'
};

let b = browserify({
  entries: path.ENTRY_POINT,
  debug: true,
  cache: {},
  packageCache: {},
  plugin: [watchify, tsify]
});

let setEnv = function(env){
  process.env.NODE_ENV = env === 'production' ? 'production': 'development';
};

let buildHtml = function(env){
  return gulp.src(path.SRC_HTML)
  .pipe(gulpif(env === 'production', gulp.dest(path.PROD_DIR), gulp.dest(path.DEV_DIR)));
};

let buildCss = function(env, hasSourcemaps){
  return gulp.src(path.SRC_SCSS)
  .pipe(gulpif(hasSourcemaps, sourcemaps.init({loadMaps: true})))
  .pipe(concat(path.OUT_CSS))
  .pipe(gulpif(env === 'production', sass({outputStyle:'compressed'}), sass()).on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(gulpif(hasSourcemaps, sourcemaps.write('.')))
  .pipe(gulpif(env === 'production', gulp.dest(path.PROD_DIR), gulp.dest(path.DEV_DIR)));
};

let buildJs = function(env, hasSourcemaps){
  return b.transform('babelify', {
      presets: ['env'],
      extensions: ['.tsx']
  })
  .bundle()
  .pipe(source(path.OUT_JS))
  .pipe(gulpif(env === 'production' || hasSourcemaps, buffer()))
  .pipe(gulpif(hasSourcemaps, sourcemaps.init({loadMaps: true})))
  .pipe(gulpif(env === 'production', uglify()))
  .pipe(gulpif(hasSourcemaps, sourcemaps.write('.')))
  .pipe(gulpif(env === 'production', gulp.dest(path.PROD_DIR), gulp.dest(path.DEV_DIR)));
};

let serve = function(env){
  let server = new LiveServer('server/server.js', {env: {NODE_ENV: env}});
  server.start();
  browserSync.init(null, {
    proxy:'http://localhost:7777',
    port: 9001,
    ghostMode: false
  });
};

/* DEV Gulp Tasks*/
gulp.task('set-dev-env', function(){
  return setEnv('development');
});

gulp.task('build-html-dev', function(){
  return buildHtml('development');
});

gulp.task('build-js-dev', function(){
  return buildJs('development', false);
});

gulp.task('build-css-dev', function(){
  return buildCss('development', false);
});

gulp.task('build-dev', ['set-dev-env', 'build-html-dev', 'build-js-dev', 'build-css-dev']);

gulp.task('serve-dev', ['set-dev-env','build-html-dev', 'build-js-dev', 'build-css-dev'], function(){
  serve('development');
});

gulp.task('watch-dev', ['serve-dev'], function(){
  gulp.watch(path.SRC_TSX, ['build-js-dev']);

  gulp.watch(path.SRC_HTML, function(event){
    let fullPath = event.path;
    gulp.src('app/app.html').pipe(gulp.dest(path.DEV_DIR));
  });

  gulp.watch(path.SRC_SCSS, ['build-css-dev']);

  gulp.watch(path.DEV_DIR + '/*', browserSync.reload);
});

/* PROD Gulp Tasks*/
gulp.task('set-prod-env', function(){
  return setEnv('production');
});

gulp.task('build-html-prod', function(){
  return buildHtml('production');
});

gulp.task('build-js-prod', function(){
  return buildJs('production', false);
});

gulp.task('build-js-prod-with-sourcemaps', function(){
  return buildJs('production', true);
});

gulp.task('build-css-prod', function(){
  return buildCss('production', false);
});

gulp.task('build-css-prod-with-sourcemaps', function(){
  return buildCss('production', true);
});

gulp.task('build-prod', ['set-prod-env', 'build-html-prod', 'build-js-prod', 'build-css-prod']);

gulp.task('build-prod-with-sourcemaps', ['set-prod-env', 'build-html-prod', 'build-js-prod-with-sourcemaps', 'build-css-prod-with-sourcemaps']);

gulp.task('serve-prod', ['set-prod-env','build-html-prod', 'build-js-prod', 'build-css-prod'], function(){
  serve('production');
});

gulp.task('serve-prod-with-sourcemaps', ['set-prod-env','build-html-prod', 'build-js-prod-with-sourcemaps', 'build-css-prod-with-sourcemaps'], function(){
  serve('production');
});

gulp.task('watch-prod', ['serve-prod'], function(){
  gulp.watch(path.SRC_TSX, ['build-js-prod']);

  gulp.watch(path.SRC_HTML, function(event){
    let fullPath = event.path;
    gulp.src('app/app.html').pipe(gulp.dest(path.PROD_DIR));
  });

  gulp.watch(path.SRC_SCSS, ['build-css-prod']);

  gulp.watch(path.PROD_DIR + '/*', browserSync.reload);
});

gulp.task('watch-prod-with-sourcemaps', ['serve-prod-with-sourcemaps'], function(){
  gulp.watch(path.SRC_TSX, ['build-js-prod-with-sourcemaps']);

  gulp.watch(path.SRC_HTML, function(event){
    let fullPath = event.path;
    gulp.task('build-html-prod')();
  });

  gulp.watch(path.SRC_SCSS, ['build-css-prod-with-sourcemaps']);

  gulp.watch(path.PROD_DIR + '/*', browserSync.reload);
});