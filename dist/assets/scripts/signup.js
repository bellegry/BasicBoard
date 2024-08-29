// 비밀번호 일치 여부 실시간 체크
document.getElementById("password").addEventListener("input", checkPasswords);
document.getElementById("confirmPassword").addEventListener("input", checkPasswords);

function checkPasswords() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const messageElement = document.getElementById("passwordMatchMessage");

  if (password === confirmPassword) {
    messageElement.textContent = "Passwords match!";
    messageElement.style.color = "green";
  } else {
    messageElement.textContent = "Passwords do not match!";
    messageElement.style.color = "red";
  }
}

// ID 중복 확인
document.getElementById("checkUserId").addEventListener("click", async function () {
  const userId = document.getElementById("userId").value;
  const userIdCheckMessage = document.getElementById("userIdCheckMessage");

  try {
    const response = await fetch(`/api/users/check-id?userId=${userId}`);
    const data = await response.json();

    if (response.ok) {
      userIdCheckMessage.textContent = "ID is available!";
      userIdCheckMessage.style.color = "green";
    } else {
      userIdCheckMessage.textContent = data.message || "ID is already taken!";
      userIdCheckMessage.style.color = "red";
    }
  } catch (error) {
    userIdCheckMessage.textContent = "Error checking ID.";
    userIdCheckMessage.style.color = "red";
  }
});

// 이메일 중복 확인
document.getElementById("checkEmail").addEventListener("click", async function () {
  const email = document.getElementById("email").value;
  const emailCheckMessage = document.getElementById("emailCheckMessage");

  try {
    const response = await fetch(`/api/users/check-email?email=${email}`);
    const data = await response.json();

    if (response.ok) {
      emailCheckMessage.textContent = "Email is available!";
      emailCheckMessage.style.color = "green";
    } else {
      emailCheckMessage.textContent = data.message || "Email is already taken!";
      emailCheckMessage.style.color = "red";
    }
  } catch (error) {
    emailCheckMessage.textContent = "Error checking Email.";
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
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json(); // 서버에서 반환된 JSON 데이터를 처리

    if (response.ok) {
      alert("Sign up successful!");
      window.location.href = "/login.html"; // 성공 시 로그인 페이지로 리디렉션
    } else {
      alert(data.message || "Sign up failed");
    }
  } catch (error) {
    alert("An error occurred: " + error.message);
  }
});
