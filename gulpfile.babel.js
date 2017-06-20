import gulp from 'gulp';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import runSequence from 'run-sequence';
import gulpLoadPlugins from 'gulp-load-plugins';
import spritesmith from 'gulp.spritesmith';
import merge from 'merge-stream';
const $ = gulpLoadPlugins();

const webpackConfig = require('./webpack.config.babel');

// path
const FRONTEND_ASSETS_PATH = './frontend'
const DIST_BASE_PATH = process.argv[2].indexOf('static') > -1 ? './static/build' : './web/static';
const MOCK_PATH = './static';

// modules
gulp.task('sass', () => {
  return gulp.src(`${FRONTEND_ASSETS_PATH}/stylesheets/**/*.scss`)
    .pipe($.plumber())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe(gulp.dest(`${DIST_BASE_PATH}/stylesheets`));
});

// TODO: add tasks => shell:obelisk, eslint, autoprefixer, sprite, copy, clean, imagemin, rename:js, rename:css

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
  }));

  console.log(`${DIST_BASE_PATH}/images`);

  return merge(
    spriteData.img.pipe(gulp.dest(`${DIST_BASE_PATH}/images`)),
    spriteData.css.pipe(gulp.dest(`${FRONTEND_ASSETS_PATH}/stylesheets/var`))
  );
});

gulp.task('build', (callback) => {
  runSequence(
    'sass',
    'webpack',
    // 'shell:obelisk',
    callback
  );
});

gulp.task('watch', () => {
  gulp.watch(`${FRONTEND_ASSETS_PATH}/javascripts/**/*`, { interval: 500 }, ['webpack']); // eslint
  gulp.watch(`${FRONTEND_ASSETS_PATH}/stylesheets/**/*.scss`, { interval:500 }, ['sass']);
  // gulp.watch(`${MOCK_PATH}/pages/**/*`, `${MOCK_PATH}/posts/**/*`, `${MOCK_PATH}/themes/**/*`, { interval:500 }, ['shell:obelisk']);
  // sprite
  // copy
});

// client commands
gulp.task('serve:static', () => {
  runSequence('build', 'watch');
});

gulp.task('serve:app', () => {
  runSequence('build', 'watch');
});

gulp.task('dist:app', () => {
  // runSequence('build', 'watch', 'autoprefixer', imagemin, uglify, rename:js, rename:css);
});
