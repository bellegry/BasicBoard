document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const userData = {
    userId: document.getElementById("userId").value,
    password: document.getElementById("password").value,
  };

  // 서버로 로그인 요청
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // 서버로부터 응답받은 json을 data에 담음
    const data = await response.json();

    // 응답이 잘 이뤄졌다면
    if (response.ok) {
      // 로그인 성공 시 토큰 저장 및 리다이렉션
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      window.location.href = "/index.html"; // 메인 페이지로 이동
    } else {
      // 서버에서 반환한 에러 메시지를 alert로 표시
      alert(data.message || "로그인 실패");
    }
  } catch (error) {
    console.log("An error occurred: " + error.message);
    alert("서버 오류가 발생했습니다.");
  }
});
