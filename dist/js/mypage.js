const token = localStorage.getItem("token");

function checkLoginStatus() {
  if (!token) {
    // 로그인이 안 되어 있으면 login.html로 리디렉션
    alert("로그인이 필요합니다.");
    window.location.href = "../bong/login.html"; // login.html로 리디렉션
  } else {
    // 토큰이 있으면 사용자 프로필 정보를 불러옴
    fetchUserProfile();
  }
}

// 회원 정보 읽기
function fetchUserProfile() {
  const token = localStorage.getItem("token");

  fetch("/api/user/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 포함
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("프로필 정보를 가져오지 못했습니다.");
      }
      return response.json(); // 서버 응답을 JSON 형식으로 변환
    })
    .then((data) => {
      // 폼 필드에 사용자 프로필 데이터 넣기
      console.log("data : " + JSON.stringify(data, null, 2));
      // document.getElementById("_id").value = data._id; // DB ID
      // document.getElementById("userId").value = data.userId; // 사용자 ID
      document.getElementById("name").value = data.name; // 이름
      // document.getElementById("password").value = data.password; // 비밀번호
      document.getElementById("email").value = data.email; // 이메일
      document.getElementById("phone").value = data.phone; // 전화번호
      // document.getElementById("role").value = data.role; // 권한
    })
    .catch((error) => {
      console.error("프로필 가져오기 오류:", error);
    });
}

// 회원 정보 수정
function updateUserProfile() {
  const token = localStorage.getItem("token");

  const userData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    newPassword: document.getElementById("newPassword").value, // 새 비밀번호
    confirmPassword: document.getElementById("confirmPassword").value, // 비밀번호 확인
  };

  // 비밀번호가 다를 경우 클라이언트에서 먼저 체크
  if (userData.newPassword !== userData.confirmPassword) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  fetch("/api/user/profile", {
    method: "PUT", // 프로필 업데이트는 PUT 메서드로
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData), // 사용자 데이터를 JSON 형식으로 서버에 전송
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("프로필 업데이트 중 오류가 발생했습니다.");
      }
      return response.json();
    })
    .then((data) => {
      alert("프로필이 성공적으로 업데이트되었습니다!");

      // 갱신된 JWT 토큰을 저장
      if (data.token) {
        localStorage.setItem("token", data.token); // 새 토큰을 localStorage에 저장
      }

      // 수정된 정보를 반영하기 위해 프로필을 다시 불러옴
      checkLoginStatus();

      console.log("수정된 사용자 데이터:", +JSON.stringify(data, null, 2));
    })
    .catch((error) => {
      console.error("프로필 업데이트 중 오류 발생:", error);
    });
}

// 회원 탈퇴
function deleteUserProfile() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "/login.html";
    return;
  }

  // 사용자 탈퇴 확인
  if (!confirm("정말로 회원 탈퇴를 하시겠습니까?")) {
    return;
  }

  fetch("/api/user/profile", {
    method: "DELETE", // DELETE 메서드 사용
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("회원 탈퇴 중 문제가 발생했습니다.");
      }
      return response.json();
    })
    .then((data) => {
      alert(data.message);

      // 회원 탈퇴 후, 메인 페이지로 이동
      localStorage.removeItem("token"); // 토큰 삭제
      window.location.href = "../index.html";
    })
    .catch((error) => {
      console.error("회원 탈퇴 오류:", error);
    });
}

// 페이지가 로드될 때 로그인 상태를 확인
document.addEventListener("DOMContentLoaded", checkLoginStatus);

// 회원 탈퇴 버튼 이벤트 리스너 추가
document.getElementById("deleteAccountButton").addEventListener("click", deleteUserProfile);

// 프로필 수정 폼 제출 처리
document.getElementById("profileForm").addEventListener("submit", (e) => {
  e.preventDefault(); // 폼 기본 제출 방지
  updateUserProfile(); // 프로필 업데이트 함수 호출
  checkLoginStatus(); // 업데이트 후 새로 토큰 정보 읽어오기
});

// 유효성검사
// 실시간 검수
import { validateUserId, validateEmail, validatePassword, validatePasswordMatch } from "./validation.js";

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

// 버튼 입력시 이메일 중복 검수
import { checkEmail } from "./validation.js";

document.getElementById("checkEmail").addEventListener("click", async function () {
  const email = document.getElementById("email").value;
  const emailCheckMessage = document.getElementById("emailCheckMessage");

  await checkEmail(email, emailCheckMessage);
});
