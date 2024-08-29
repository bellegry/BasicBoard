document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const userData = {
    userId: document.getElementById("userId").value,
    password: document.getElementById("password").value,
  };

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // 서버 응답이 제대로 왔는지 확인
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 서버로 로그인 요청
    const data = await response.json();
    console.log("Data : " + data);

    if (response.ok) {
      // 로그인 성공 시 토큰 저장 및 리다이렉션
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      window.location.href = "/index.html"; // 메인 페이지로 이동
    } else {
      console.log(data.message || "Login failed");
    }
  } catch (error) {
    console.log("An error occurred: " + error.message);
  }
});
