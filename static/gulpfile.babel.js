import gulp from 'gulp';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import runSequence from 'run-sequence';
import gulpLoadPlugins from 'gulp-load-plugins';
import spritesmith from 'gulp.spritesmith';
import merge from 'merge-stream';
import del from 'del';
const $ = gulpLoadPlugins();

const webpackConfig = require('./webpack.config.babel');

// path
const FRONTEND_ASSETS_PATH = './frontend';
const isStaticEnv = process.argv[2].indexOf('static') > -1;
const DIST_BASE_PATH = isStaticEnv ? './build' : '../web/static';
const MOCK_PATH = '.';

// modules
gulp.task('sass', () => {
  return gulp.src(`${FRONTEND_ASSETS_PATH}/stylesheets/**/*.scss`)
    .pipe($.plumber())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe(gulp.dest(`${DIST_BASE_PATH}/stylesheets`));
});

// TODO: add serve tasks  => shell:obelisk, eslint
// TODO: add dist tasks  => autoprefixer, imagemin, rename:js, rename:css

gulp.task('webpack', () => {
  return webpackStream(webpackConfig, webpack)
    .pipe($.plumber())
    .pipe(gulp.dest(`${DIST_BASE_PATH}/javascripts`));
});

gulp.task('sprite', () => {
  const spriteData = gulp.src(`${FRONTEND_ASSETS_PATH}/images/sprite/*.png`).pipe(spritesmith({
    imgName : 'sprite.png',
    cssName : '_sprite-data.scss',
    imgPath : `/images/sprite.png`,
    cssFormat : 'scss'
    // default engine is pixelsmith, a node-based spritesmith engine
  }));

  return merge(
    spriteData.img.pipe(gulp.dest(`${DIST_BASE_PATH}/images`)),
    spriteData.css.pipe(gulp.dest(`${FRONTEND_ASSETS_PATH}/stylesheets/var`))
  );
});

gulp.task('copy', () => {
  return gulp.src([
      `${FRONTEND_ASSETS_PATH}/images/**/*`,
      `!${FRONTEND_ASSETS_PATH}/images/sprite/*`
    ])
    .pipe(gulp.dest(`${DIST_BASE_PATH}/images`));
});

gulp.task('shell:obelisk', $.shell.task('mix obelisk build'));

gulp.task('clean', del.bind(null, [
  `${DIST_BASE_PATH}/images`,
  `${DIST_BASE_PATH}/stylesheets`,
  `${DIST_BASE_PATH}/javascripts`
], {
  force: true
}));

gulp.task('webserver', () => {
  gulp.src(DIST_BASE_PATH)
    .pipe($.webserver({
      host: 'localhost',
      port: 8000,
      livereload: false
    }));
});

gulp.task('build', (callback) => {
  runSequence(
    'clean',
    'shell:obelisk',
    'copy',
    'sprite',
    'sass',
    'webpack',
    callback
  );
});

gulp.task('watch', () => {
  gulp.watch(`${FRONTEND_ASSETS_PATH}/javascripts/**/*`, { interval: 500 }, ['webpack']); // eslint
  gulp.watch(`${FRONTEND_ASSETS_PATH}/stylesheets/**/*.scss`, { interval:500 }, ['sass']);
  gulp.watch(`${FRONTEND_ASSETS_PATH}/images/**/*`, { interval:500 }, ['copy', 'sprite']);

  if (isStaticEnv) {
    gulp.watch([`${MOCK_PATH}/pages/**/*`, `${MOCK_PATH}/posts/**/*`, `${MOCK_PATH}/themes/**/*`], { interval:500 }, [/* 'shell:obelisk' */ 'build']);
  }
});

// client commands
gulp.task('serve:static', () => {
  runSequence('build', 'webserver', 'watch');
});

gulp.task('serve:app', () => {
  runSequence('build', 'watch');
});

gulp.task('dist:app', () => {
  // runSequence('build', 'autoprefixer', imagemin, uglify, rename:js, rename:css);
});
