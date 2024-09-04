document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/posts")
    .then((response) => response.json())
    .then((posts) => {
      const postTableBody = document.querySelector("#postTable tbody");
      postTableBody.innerHTML = ""; // Clear existing rows

      posts.forEach((post, index) => {
        const row = document.createElement("tr");

        // Formatting the date to be more readable
        const formattedDate = new Date(post.date).toLocaleDateString(); // Assuming `post.date` is the correct field

        row.innerHTML = `
          <td>${index + 1}</td>
          <td><a href="read.html?id=${post._id}">${post.title}</a></td>
          <td>${post.writer}</td>
          <td>${formattedDate}</td>
        `;
        postTableBody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching posts:", error));
});
