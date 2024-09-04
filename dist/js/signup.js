// 비밀번호 일치 여부 실시간 체크
document.getElementById("password").addEventListener("input", checkPasswords);
document.getElementById("confirmPassword").addEventListener("input", checkPasswords);

function checkPasswords() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const messageElement = document.getElementById("passwordMatchMessage");

  if (password === confirmPassword) {
    messageElement.textContent = "비밀번호가 일치합니다.";
    messageElement.style.color = "green";
  } else {
    messageElement.textContent = "비밀번호가 일치하지 않습니다!";
    messageElement.style.color = "red";
  }
}

// ID 중복 확인
document.getElementById("checkUserId").addEventListener("click", async function () {
  const userId = document.getElementById("userId").value;
  const userIdCheckMessage = document.getElementById("userIdCheckMessage");

  try {
    const response = await fetch(`/api/user/check-id?userId=${userId}`);
    const data = await response.json();

    if (response.ok) {
      userIdCheckMessage.textContent = "사용가능한 ID입니다.";
      userIdCheckMessage.style.color = "green";
    } else {
      userIdCheckMessage.textContent = data.message || "사용중인 ID입니다!";
      userIdCheckMessage.style.color = "red";
    }
  } catch (error) {
    userIdCheckMessage.textContent = "아이디를 체크하는 도중 에러가 발생했습니다.";
    userIdCheckMessage.style.color = "red";
  }
});

// 이메일 중복 확인
document.getElementById("checkEmail").addEventListener("click", async function () {
  const email = document.getElementById("email").value;
  const emailCheckMessage = document.getElementById("emailCheckMessage");

  try {
    const response = await fetch(`/api/user/check-email?email=${email}`);
    const data = await response.json();

    if (response.ok) {
      emailCheckMessage.textContent = "사용가능한 Email입니다.";
      emailCheckMessage.style.color = "green";
    } else {
      emailCheckMessage.textContent = data.message || "사용중인 Email입니다!";
      emailCheckMessage.style.color = "red";
    }
  } catch (error) {
    emailCheckMessage.textContent = "Email을 체크하는 도중 에러가 발생했습니다!";
    emailCheckMessage.style.color = "red";
  }
});

// 폼 제출 시 비밀번호 일치 여부 확인 및 서버에 데이터 전송
document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // 비밀번호 일치 여부 확인
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return; // 비밀번호가 일치하지 않으면 폼 제출 중단
  }

  // 요청할 데이터 객체
  const userData = {
    userId: document.getElementById("userId").value,
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: password, // 확인된 비밀번호 저장
    phone: document.getElementById("phone").value,
    role: "user", // 기본 role 설정 (예: user)
  };

  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json(); // 서버에서 반환된 JSON 데이터를 처리

    if (response.ok) {
      alert("환영합니다!");
      window.location.href = "../bong/login.html"; // 성공 시 로그인 페이지로 리디렉션
    } else {
      alert(data.message || "가입에 실패했습니다.");
    }
  } catch (error) {
    alert("에러내용: " + error.message);
  }
});
