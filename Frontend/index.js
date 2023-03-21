const form = document.querySelector("#pdf-upload-form");
const statusMessage = document.querySelector("#status-message");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const pdfFile = document.querySelector("#pdf-file-input").files[0];
  const formData = new FormData();
  formData.append("pdf-file", pdfFile);

  fetch("http://127.0.0.1:3000/upload", {
    method: "POST",
    body: formData
  })
  .then(response => response.text())
  .then(data => {
    statusMessage.textContent = data;
    form.reset();
  })
  .catch(error => {
    console.error(error);
    statusMessage.textContent = "An error occurred while uploading the PDF file";
  });
});
