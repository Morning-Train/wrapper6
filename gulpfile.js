var gulp = require("gulp"),
    uglify = require("gulp-uglify"),
    watch = require("gulp-watch"),
    clean = require("gulp-clean"),
    babelify = require("babelify"),
    browserify = require("browserify"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    sourcemaps = require("gulp-sourcemaps"),
    rename = require("gulp-rename");

//
// Javascript compiler
//

function compileJs( src, dest ) {
    var fileName = src.split("/").pop();

    return browserify(src, { debug: true })
        .transform(babelify, { presets: ["es2015"]})
        .bundle()
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(source(fileName))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(gulp.dest(dest))
        .pipe(sourcemaps.write(dest));
}

//
// Default task
//

gulp.task("default", [ "minify" ], () => {});

//
// Watch task
//

gulp.task("watch", () => {
    return watch("./src/**/*.js", () => {
        gulp.start("minify");
    });
});

//
// Javascript compile task
//

gulp.task("cleanup", () => {
    return gulp.src("./dist/**/*.js").pipe(clean());
});

gulp.task("build", ["cleanup"], () => {
    return compileJs("./src/wrapper6.js", "./dist");
});

gulp.task("minify", ["build"], () => {
    return gulp.src("./dist/wrapper6.js")
        .pipe(uglify())
        .pipe(rename("wrapper6.min.js"))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(gulp.dest("./dist"))
        .pipe(sourcemaps.write("./dist"));
});