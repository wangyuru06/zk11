var gulp = require('gulp');
var server = require('gulp-webserver');
var path = require('path');
var url = require('url');
var fs = require('fs');
var sass = require('gulp-sass');
var data = require('./mock/index.json')
var mincss = require('gulp-clean-css');
var autocss = require('gulp-autoprefixer');
var minjs = require('gulp-uglify');
var es5 = require('gulp-babel');
var minhtml = require('gulp-htmlmin')
gulp.task('sass', function() { //编译SASS
    return gulp.watch('./src/scss/*.scss', function() { //监听
        setCss('./src/css/');
    })
})

function setCss(url) {
    gulp.src('./src/scss/*.scss') //读取文件
        .pipe(sass())
        .pipe(mincss())
        .pipe(autocss({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest(url))
}

function servercss(pathurl) {
    return gulp.src('./' + pathurl + '/')
        .pipe(server({
            port: 8085,
            open: true,
            middleware: function(req, res) { //中间件
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    return false;
                }
                if (pathname === '/api/index') {
                    res.end(JSON.stringify(data))
                }
                if (pathname === '/')
                    pathname = pathname === '/' ? 'index.html' : pathname;
                res.end(fs.readFileSync(path.join(__dirname, pathurl, pathname)))
            }
        }))
}

gulp.task('mincss', function() {
    setCss('./build/css');
})

gulp.task('minjs', function() {
    return gulp.src(['./src/js/*.js', '!./src/js/lib/*.js'])
        .pipe(es5({
            presets: 'es2015'
        }))
        .pipe(minjs())
        .pipe(gulp.dest('./build/js'))
})

gulp.task('minhtml', function() {
    return gulp.src('./src/**/*.html')
        .pipe(minhtml({
            removeComments: true, //清除HTML注释
            collapseWhitespace: true, //压缩HTML
            collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
        }))
        .pipe(gulp.dest('./build'))
})

gulp.task('coplibjs', function() {
    return gulp.src('./src/js/lib/*.js')
        .pipe(gulp.dest('./build/js/lib'))
})

gulp.task('dev', ['sass'], function() {
    servercss('src')
});

gulp.task('build', ['mincss', 'minjs', 'coplibjs', 'minhtml'], function() {

    servercss('build')
})