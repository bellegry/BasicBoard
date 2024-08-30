document.addEventListener("DOMContentLoaded", () => {
  fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
      console.log("Header loaded"); // test
      document.body.insertAdjacentHTML("afterbegin", data);
      return loadScript("assets/scripts/token.js"); // token.js 로드 완료 후 header.js 로드
    })
    .then(() => {
      return loadScript("assets/scripts/header.js");
    })
    .catch((error) => console.error("Error loading header or scripts:", error));
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
