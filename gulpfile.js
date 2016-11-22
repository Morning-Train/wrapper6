const
    gulp = require("gulp"),
    babel = require("gulp-babel");

gulp.task("default", ["build"], () => {});
gulp.task("build", () => {
    return gulp.src("./src/**/*.js")
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(gulp.dest("./build"));
});