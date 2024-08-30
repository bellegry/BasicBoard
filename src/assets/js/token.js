console.log("token.js loaded");

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000); // 현재 시간을 초 단위로 변환
    return payload.exp < currentTime; // 토큰 만료 시간을 현재 시간과 비교
  } catch (error) {
    console.error("Invalid token:", error);
    return true; // 토큰이 유효하지 않으면 만료된 것으로 간주
  }
}

// DOM이 이미 로드된 상태라면 바로 실행, 그렇지 않다면 이벤트 리스너 추가
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runTokenScript);
} else {
  runTokenScript();
}

function runTokenScript() {
  const logout = () => {
    localStorage.removeItem("token"); // 토큰 삭제
    alert("Your session has expired. Please log in again.");
    window.location.href = "/login.html"; // 로그인 페이지로 리디렉션
  };

  // 여기에 추가적으로 필요할 로직을 작성할 수 있습니다.
}
