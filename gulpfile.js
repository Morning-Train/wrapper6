const
    gulp = require("gulp"),
    babel = require("gulp-babel"),
    browserify = require("gulp-browserify"),
    rename = require("gulp-rename");

gulp.task("default", ["dist"], () => {
});

/*
 -------------------------------
 Build with babel
 -------------------------------
 */

gulp.task("build", () => {
    return gulp.src("./src/**/*.js")
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(gulp.dest("./build"));
});

/*
 -------------------------------
 Dist with browserify
 -------------------------------
 */

gulp.task('dist', ["build"], function () {
    gulp.src('build/index.js')
        .pipe(browserify({
            insertGlobals: false,
            debug: false
        }))
        .pipe(rename("wrapper6.js"))
        .pipe(gulp.dest('./dist'))
});
