document.addEventListener("DOMContentLoaded", () => {
  // Header 로드
  fetch("../bong/header.html")
    .then((response) => response.text())
    .then((data) => {
      console.log("Header loaded");
      document.body.insertAdjacentHTML("afterbegin", data);
      return loadScript("../js/token.js"); // token.js 로드 완료 후 header.js 로드
    })
    .then(() => {
      return loadScript("../js/header.js");
    })
    .catch((error) => console.error("Error loading header or scripts:", error));

  // Footer 로드
  fetch("../bong/footer.html")
    .then((response) => response.text())
    .then((data) => {
      console.log("Footer loaded");
      document.body.insertAdjacentHTML("beforeend", data); // body 끝에 삽입
    })
    .catch((error) => console.error("Error loading footer:", error));
});

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
