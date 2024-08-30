console.log("header.js loaded"); // 가장 첫 줄에 추가

// DOM이 이미 로드된 상태라면 바로 실행, 그렇지 않다면 이벤트 리스너 추가
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runHeaderScript);
} else {
  runHeaderScript();
}

function runHeaderScript() {
  const token = localStorage.getItem("token");
  console.log("Token in header.js:", token);

  const authLink = document.getElementById("authLink");
  if (!authLink) {
    console.error("Auth link element not found.");
    return;
  }

  if (token && !isTokenExpired(token)) {
    console.log("Token is valid. Changing link text to 'Logout'.");
    authLink.textContent = "Logout";
    authLink.href = "#";
    authLink.addEventListener("click", () => {
      logout();
    });
  } else {
    console.log("Token is invalid or expired.");
  }
}
