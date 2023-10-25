"use strict"

const {src, dest} = require("gulp");
const ghPages = require('gh-pages');
const gulp = require("gulp");
const twig = require('gulp-twig');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const rigger = require("gulp-rigger");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const del = require("del");
const notify = require("gulp-notify");

const srcPath = "src/";
const distPath = "dist/";

const path = {
  build: {
    html: distPath,
    css: distPath + "assets/css/",
    js: "dist/assets/js/",
    fonts: distPath + "assets/fonts/",
    img: distPath + "assets/images/",
  },
  src: {
    html: srcPath + "*.twig",
    css: srcPath + "assets/scss/*.scss",
    js: srcPath + "assets/js/*.js",
    fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
    img: srcPath + "assets/images/**/*.{jpg,jpeg,png,gif,svg}",
  },
  watch: {
    html: srcPath + "**/*.twig",
    js: srcPath + "assets/js/**/*.js",
    css: srcPath + "assets/scss/**/*.scss",
    fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
    img: srcPath + "assets/images/**/*.{jpg,jpeg,png,gif,svg}",
  },
  clean: "./" + distPath
}

function html() {
  return src(path.src.html, {base: srcPath})
    .pipe(plumber())
    .pipe(twig())
    .pipe(rename({ extname: '' }))
    .pipe(rename({ extname: '.html' }))
    .pipe(dest(path.build.html))
}

function css() {
  return src(path.src.css, {base: srcPath + "assets/scss/"})
    .pipe(plumber({
      errorHandler: function(err) {
        notify.onError({
          title: "SCSS Error",
          message: "Error: <%= error.message %>",
        })(err);
        this.emit('end');
      }
    }))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssbeautify())
    .pipe(dest(path.build.css))
    .pipe(cssnano({
      zindex: false,
      discardComments: {
        removeAll: true
      }
    }))
    .pipe(removeComments())
    .pipe(rename({
      suffix: ".min",
      extname: ".css"
    }))
    .pipe(dest(path.build.css))
}

function js() {
  return src(path.src.js)
    .pipe(plumber({
      errorHandler: function(err) {
        notify.onError({
          title: "JavaScript Error",
          message: "Error: <%= error.message %>",
        })(err);
        this.emit('end')
      }
    }))
    .pipe(rigger())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('main.js'))
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min",
      extname: ".js"
    }))
    .pipe(dest(path.build.js))
};

function fonts() {
  return src(path.src.fonts, {base: srcPath + "assets/fonts/"})
};

function images() {
  return src(path.src.img)
    .pipe(dest(path.build.img));
};

function clean() {
  return del(path.clean);
};

function watchFiles() {
  gulp.watch([srcPath + "**/*.twig"], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.fonts], fonts);
  gulp.watch([path.watch.img], images);
};

function deploy(cb) {
  ghPages.publish('dist', cb);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, fonts, images));
const watch = gulp.parallel(build, watchFiles);

exports.html = html;
exports.css = css;
exports.js = js;
exports.fonts = fonts;
exports.images = images;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.deploy = deploy;