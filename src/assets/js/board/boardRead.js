console.log(`boardRead.js load`);
const postContentDiv = document.querySelector("#postContent");

postContentDiv.innerHTML("바보");

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");
console.log(postId);

document.addEventListener("DOMContentLoaded", function () {
  // 게시글 정보 가져오기
  if (postId) {
    fetch(`/api/posts/${postId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        response.json();
      })
      .then((post) => {
        // post 객체가 존재하는지 확인
        if (!post) {
          throw new Error("Post not found");
        }
        console.log(post); // post 객체의 내용을 콘솔에서 확인

        const formattedDate = post.date ? new Date(post.date).toLocaleDateString() : "No date available";

        postContentDiv.innerHTML = `
                  <h2>${post.title}</h2>
                  <p>Written by: ${post.userId}</p>
                  <p>${post.content}</p>
                  <p>${post.createdAt}</p>
              `;
      })
      .catch((error) => console.error("Error fetching post:", error));
  } else {
    console.error("No post ID found in URL.");
  }

  // Update 버튼 클릭 시 update.html로 이동
  document.getElementById("updatePostBtn").addEventListener("click", function () {
    window.location.href = `update.html?id=${postId}`;
  });

  // 글 삭제
  document.getElementById("deletePostBtn").addEventListener("click", function () {
    if (confirm("Are you sure you want to delete this post?")) {
      fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            alert("Post deleted successfully");
            window.location.href = "list.html"; // 목록 페이지로 이동
          } else {
            alert("Failed to delete post");
          }
        })
        .catch((error) => console.error("Error deleting post:", error));
    }
  });
});
