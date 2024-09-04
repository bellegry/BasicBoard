import gulp from "gulp";
import gulpSass from "gulp-sass";
import cleanCSS from "gulp-clean-css";
import flatten from "gulp-flatten";
import * as sass from "sass";
import { deleteAsync } from "del";
import browserSync from "browser-sync";

// gulp-sass와 sass 컴파일러 연결
const scssCompiler = gulpSass(sass);
const server = browserSync.create();

// SCSS 파일을 컴파일하고 minify
function styles() {
  return gulp
    .src("src/**/*.scss") // 하위 모든 폴더의 SCSS 감시
    .pipe(scssCompiler().on("error", scssCompiler.logError))
    .pipe(cleanCSS())
    .pipe(flatten())
    .pipe(gulp.dest("dist/css/"))
    .pipe(server.stream());
}

// HTML 파일을 dist로 복사
function htmlComponents() {
  // index.html은 dist에 저장
  gulp.src("src/index.html").pipe(gulp.dest("dist")).pipe(server.stream());

  // 나머지 HTML 파일은 dist/html/에 저장
  return gulp.src(["src/**/*.html", "!src/index.html"]).pipe(flatten()).pipe(gulp.dest("dist/bong")).pipe(server.stream());
}

// 스크립트 파일을 dist로 복사
function scripts() {
  return gulp
    .src("src/**/*.js") // 하위 모든 폴더의 JS 감시
    .pipe(flatten())
    .pipe(gulp.dest("dist/js/"))
    .pipe(server.stream());
}

// dist 폴더 정리
async function clean() {
  await deleteAsync(["dist"]);
}

// 파일 변경 감지 및 실시간 반영
function watchFiles() {
  server.init({
    server: {
      baseDir: "dist",
    },
  });

  gulp.watch("src/**/*.scss", styles);
  gulp.watch("src/**/*.html", htmlComponents);
  gulp.watch("src/**/*.js", scripts);
}

// 개발 환경 (dev) Task
export const dev = gulp.series(clean, gulp.parallel(styles, htmlComponents, scripts), watchFiles);

// 빌드 (build) Task
export const build = gulp.series(clean, gulp.parallel(styles, htmlComponents, scripts));

// 기본 Task
export default build;
