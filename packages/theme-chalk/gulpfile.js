'use strict';

const { series, src, dest } = require('gulp');
const sass = require('gulp-sass'); // 编译gulp工具
const autoprefixer = require('gulp-autoprefixer'); // 添加厂商前缀
const cssmin = require('gulp-cssmin'); // 压缩css

function compile() {
  return src('./src/*.scss') // src下的所有scss文件
    .pipe(sass.sync()) // 把scss文件编译成css
    .pipe(autoprefixer({ // 基于目标浏览器版本，添加厂商前缀
      browsers: ['ie > 9', 'last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin()) // 压缩css
    .pipe(dest('./lib')); // 输出到lib下
}

function copyfont() {
  return src('./src/fonts/**') // 读取src/fonts下的所有文件
    .pipe(cssmin())
    .pipe(dest('./lib/fonts')); // 输出到lib/fonts下
}

exports.build = series(compile, copyfont);
