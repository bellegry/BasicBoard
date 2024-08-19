document.querySelector("#postForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const writer = document.querySelector("#writer").value;
  const title = document.querySelector("#title").value;
  const content = document.querySelector("#content").value;

  const postData = { writer, title, content };

  fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Post created:", data);
      window.location.href = "list.html"; // Redirect to post list
    })
    .catch((error) => console.error("Error creating post:", error));
});
