document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");

  // 게시글 정보 가져오기
  if (postId) {
    fetch(`/api/posts/${postId}`)
      .then((response) => response.json())
      .then((post) => {
        const postContentDiv = document.querySelector("#postContent");

        // Formatting the date to be more readable
        const formattedDate = new Date(post.date).toLocaleDateString(); // Assuming `post.date` is the correct field

        postContentDiv.innerHTML = `
                  <h2>${post.title}</h2>
                  <p>Written by: ${post.writer}</p>
                  <p>${post.content}</p>
                  <p>${formattedDate}</p>
              `;
      })
      .catch((error) => console.error("Error fetching post:", error));
  }

  if (!postId) {
    console.error("No post ID found in URL.");
    return;
  }

  // 글 삭제
  document.getElementById("deletePost").addEventListener("click", function () {
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
