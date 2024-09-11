/// 유효성검사 추가
// 서버로 못넘어가게
// 폼 제출 시 유효성 검사 및 회원가입 요청
document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  // 요청할 데이터 객체
  const userData = {
    userId: document.getElementById("userId").value.trim(),
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value,
    confirmPassword: document.getElementById("confirmPassword").value,
    phone: document.getElementById("phone").value.trim(),
  };

  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      alert("회원가입이 완료되었습니다!");
      window.location.href = "../bong/login.html"; // 성공 시 로그인 페이지로 리디렉션
    } else {
      // 서버에서 받은 에러 메시지를 출력
      handleValidationErrors(data.errors);
    }
  } catch (error) {
    alert("에러 발생: " + error.message);
  }
});

// 서버에서 전달받은 유효성 검사 에러 메시지 표시
function handleValidationErrors(errors) {
  errors.forEach((error) => {
    const field = error.param; // 유효성 검사 실패한 필드명

    // 필드별로 에러 메시지 표시
    const errorMessageElement = document.getElementById(`${field}Error`);
    if (errorMessageElement) {
      errorMessageElement.textContent = error.msg;
      errorMessageElement.style.color = "red";
    }
  });
}

// 실시간으로 검수
import { validateUserId, validateEmail, validatePassword, validatePasswordMatch, validatePhone } from "./validation.js";

document.getElementById("userId").addEventListener("input", function () {
  const userId = document.getElementById("userId").value.trim();
  const userIdError = document.getElementById("userIdError");
  validateUserId(userId, userIdError);
});

document.getElementById("email").addEventListener("input", function () {
  const email = document.getElementById("email").value.trim();
  const emailError = document.getElementById("emailError");
  validateEmail(email, emailError);
});

document.getElementById("password").addEventListener("input", function () {
  const password = document.getElementById("password").value;
  const passwordError = document.getElementById("passwordError");
  validatePassword(password, passwordError);
});

document.getElementById("confirmPassword").addEventListener("input", function () {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const confirmPasswordError = document.getElementById("confirmPasswordError");
  validatePasswordMatch(password, confirmPassword, confirmPasswordError);
});

document.getElementById("phone").addEventListener("input", function () {
  const phone = document.getElementById("phone").value.trim();
  const phoneError = document.getElementById("phoneError");
  validatePhone(phone, phoneError);
});

// 버튼입력시 서버에 아이디 이메일 중복 검수
import { checkUserId, checkEmail } from "./validation.js";

// ID 중복 확인
document.getElementById("checkUserId").addEventListener("click", async function () {
  const userId = document.getElementById("userId").value;
  const userIdCheckMessage = document.getElementById("userIdCheckMessage");

  await checkUserId(userId, userIdCheckMessage);
});

// Email 중복 확인
document.getElementById("checkEmail").addEventListener("click", async function () {
  const email = document.getElementById("email").value;
  const emailCheckMessage = document.getElementById("emailCheckMessage");

  await checkEmail(email, emailCheckMessage);
});
