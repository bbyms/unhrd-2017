var gulp = require("gulp"),
sass = require('gulp-sass'),
cssnano = require('gulp-cssnano'),
ejs = require("gulp-ejs"),
watch = require("gulp-watch"),
autoprefixer = require('autoprefixer'),
svgSprite = require('gulp-svg-sprite'),
browserSync = require('browser-sync').create();

// SVG Config
var config = {
  mode: {
    symbol: { // symbol mode to build the SVG
      dest: 'sprite', // destination folder
      sprite: 'sprite.svg', //sprite name
      example: true // Build sample page
    }
  },
  svg: {
    xmlDeclaration: false, // strip out the XML attribute
    doctypeDeclaration: false // don't include the !DOCTYPE declaration
  }
};

gulp.task('serve', function() {

  browserSync.init({
    server: "dist/"
  });

  gulp.watch('assets/sass/**/*.scss', ['sass']);
  gulp.watch('assets/templates/**/*.ejs', ['templates']);
  gulp.watch('dist/css/main.css').on('change', browserSync.reload);
  gulp.watch('dist/*.html').on('change', browserSync.reload);
});

gulp.task('sass', function () {
  return gulp.src('assets/sass/**/*.scss')
  .pipe(sass())
  .pipe(cssnano())
  .pipe(gulp.dest('./dist/css'))
  .pipe(browserSync.stream());
});

gulp.task('templates', function () {
  return gulp.src('assets/templates/*.ejs')
  .pipe(ejs({},{}, {ext:'.html'}))
  .pipe(gulp.dest('./dist'))
  .pipe(browserSync.stream());
});

gulp.task('sprite-page', function() {
  return gulp.src('assets/svg/**/*.svg')
  .pipe(svgSprite(config))
  .pipe(gulp.dest('./dist/'));
});

gulp.task('sprite-shortcut', function() {
  return gulp.src('dist/sprite/sprite.svg')
  .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function() {
  gulp.watch(['assets/sass/**/*.scss'] , ['sass']);
  gulp.watch('assets/templates/*.ejs' , ['templates']);
  gulp.watch('assets/svg/*.svg' , ['svg']);
});

gulp.task('svg', ['sprite-page', 'sprite-shortcut']);

gulp.task('default', ['serve']);
