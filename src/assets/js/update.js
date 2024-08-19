document.addEventListener("DOMContentLoaded", function () {
  const postId = new URLSearchParams(window.location.search).get("id");

  if (!postId) {
    alert("Invalid Post ID");
    return;
  }

  // 기존 게시글 로드
  fetch(`/api/posts/${postId}`)
    .then((response) => response.json())
    .then((post) => {
      document.querySelector("#writer").value = post.writer;
      document.querySelector("#title").value = post.title;
      document.querySelector("#content").value = post.content;
    })
    .catch((error) => console.error("Error fetching post:", error));

  // 게시글 수정
  document.querySelector("#updatePostForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedPost = {
      writer: document.querySelector("#writer").value,
      title: document.querySelector("#title").value,
      content: document.querySelector("#content").value,
    };

    fetch(`/api/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPost),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Post updated successfully");
        window.location.href = "list.html"; // 수정 후 목록 페이지로 이동
      })
      .catch((error) => console.error("Error updating post:", error));
  });
});
