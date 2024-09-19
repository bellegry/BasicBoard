// 로그인 상태 확인 함수
function checkLoginStatus() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
    window.location.href = "../bong/login.html"; // 로그인 페이지로 리디렉션
  }
}

// 페이지가 로드될 때 로그인 상태를 확인
document.addEventListener("DOMContentLoaded", checkLoginStatus);

// 글 작성 폼 제출
async function submitPost() {
  const token = localStorage.getItem("token");

  const postData = {
    title: document.getElementById("postTitle").value,
    content: document.getElementById("postContent").value,
  };

  try {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
      },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      alert("게시글이 작성되었습니다!");
      window.location.href = `../bong/postDetail.html?id=${_id}`;
    } else {
      const errorData = await response.json();
      alert(`게시글 작성 실패: ${errorData.message}`);
    }
  } catch (error) {
    console.error("게시글 작성 중 오류:", error);
    alert("게시글 작성 중 오류가 발생했습니다.");
  }
}

// 글 작성 폼 제출 이벤트 리스너
document.getElementById("createPostForm").addEventListener("submit", function (e) {
  e.preventDefault(); // 기본 폼 제출 방지
  submitPost(); // 글 작성 함수 호출
});
