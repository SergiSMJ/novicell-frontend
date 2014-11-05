var gulp = require('gulp');
var svgo = require('imagemin-svgo');
var lib = require('../lib.js');
var plumber = require('gulp-plumber');
var config = require('../../gulp-config.json');
var newer = require('gulp-newer');
var resources = require('../resources.json');
var gulpif = require('gulp-if');
var path = require('path');
var util = require('util');

var taskName = "Icons task";

var notifySuccess = lib.notifySuccess(taskName);
var notifyError = lib.notifyError(taskName);
var errorHandler = lib.createErrorHandler(notifyError);

var minifyIcons = function (p, successMessage) {
    var paths = p.map(function (z) {
        return path.join(config.basePath, z);
    });

    var destination = path.join(path.join(config.basePath, config.distPath), config.icons.dist);

    return gulp.src(paths)
        .pipe(plumber(errorHandler))
        .pipe(newer(destination))
        .pipe(svgo())
        .pipe(gulp.dest(destination))
        .pipe(gulpif(config.notifyOnSuccess, notifySuccess(successMessage)));
};

gulp.task('minify-icons', function () {
    return config.bundles.filter(function (b) {
        return b.icons != null;
    }).map(function (b) {
        return minifyIcons(b.icons, util.format(resources.minifyIconsSuccess, b.name));
    });
});

gulp.task('icons', ['minify-icons']);