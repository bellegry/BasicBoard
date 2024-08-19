import gulp from "gulp";
import gulpSass from "gulp-sass";
import cleanCSS from "gulp-clean-css";
import * as sass from "sass";
import { deleteAsync } from "del";
import browserSync from "browser-sync";

// gulp-sass와 sass 컴파일러 연결
const scssCompiler = gulpSass(sass);
const server = browserSync.create();

// SCSS 파일을 컴파일하고 minify
function styles() {
  return gulp
    .src("src/assets/styles/**/*.scss")
    .pipe(scssCompiler().on("error", scssCompiler.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest("dist/assets/styles"))
    .pipe(server.stream()); // 스타일 변경 시 자동으로 브라우저에 반영
}

// components 폴더의 HTML 파일을 dist로 복사
function htmlComponents() {
  return gulp.src("src/components/**/*.html").pipe(gulp.dest("dist")).pipe(server.stream());
}

// src 폴더의 루트에 있는 index.html을 dist로 복사
function htmlIndex() {
  return gulp.src("src/*.html").pipe(gulp.dest("dist")).pipe(server.stream());
}

// 스크립트 파일을 dist로 복사
function scripts() {
  return gulp.src("src/assets/js/**/*.js").pipe(gulp.dest("dist/assets/scripts")).pipe(server.stream()); // 스크립트 변경 시 자동으로 브라우저에 반영
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

  gulp.watch("src/assets/styles/**/*.scss", styles);
  gulp.watch("src/components/**/*.html", htmlComponents);
  gulp.watch("src/*.html", htmlIndex); // 루트에 있는 HTML 파일도 감시
  gulp.watch("src/assets/js/**/*.js", scripts);
}

// 개발 환경 (dev) Task
export const dev = gulp.series(clean, gulp.parallel(styles, htmlComponents, htmlIndex, scripts), watchFiles);

// 빌드 (build) Task
export const build = gulp.series(clean, gulp.parallel(styles, htmlComponents, htmlIndex, scripts));

// 기본 Task
export default build;
