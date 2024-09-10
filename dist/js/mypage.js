function fetchUserProfile() {
  const token = localStorage.getItem("token"); // 로컬 스토리지에서 JWT 토큰 가져오기

  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "../bong/login.html"; // 토큰이 없으면 로그인 페이지로 리다이렉트
    return;
  }

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
      document.getElementById("_id").value = data._id; // DB ID
      document.getElementById("userId").value = data.userId; // 사용자 ID
      document.getElementById("name").value = data.name; // 이름
      document.getElementById("password").value = data.password; // 비밀번호
      document.getElementById("email").value = data.email; // 이메일
      document.getElementById("phone").value = data.phone; // 전화번호
      document.getElementById("role").value = data.role; // 권한
    })
    .catch((error) => {
      console.error("프로필 가져오기 오류:", error);
    });
}

document.addEventListener("DOMContentLoaded", fetchUserProfile); // DOM이 로드된 후 프로필 정보 가져오기
