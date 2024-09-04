console.log("header.js loaded");

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runHeaderScript);
} else {
  runHeaderScript();
}

function runHeaderScript() {
  const token = localStorage.getItem("token");

  const loginButton = document.querySelector(".auth.login");
  const logoutButton = document.querySelector(".auth.logout");
  const signupButton = document.querySelector(".auth.signup");
  const mypageButton = document.querySelector(".auth.mypage");

  if (token && !isTokenExpired(token)) {
    loginButton.classList.remove("active");
    signupButton.classList.remove("active");
    mypageButton.classList.add("active");
    logoutButton.classList.add("active");
    logoutButton.addEventListener("click", logout);
  } else {
    loginButton.classList.add("active");
    signupButton.classList.add("active");
    mypageButton.classList.remove("active");
    logoutButton.classList.remove("active");
  }
}

function logout() {
  localStorage.removeItem("token");
  alert("다음에 다시만나요!");
  window.location.href = "/";
}

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (e) {
    console.error("Error decoding token:", e);
    return true;
  }
}
