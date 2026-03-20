window.onload = async () => {

  const token = localStorage.getItem("token")

  const res = await fetch("http://localhost:5000/files", {
    headers: {
      Authorization: token
    }
  })

  const files = await res.json()

  const fileList = document.getElementById("fileList")
  fileList.innerHTML = ""

  files.forEach(file => {

    const div = document.createElement("div")

    div.innerHTML = `
      <p>${file.filename}</p>

      <a href="http://localhost:5000/uploads/${file.filename}" download>
        <button>Download</button>
      </a>

      <button onclick="deleteFile('${file._id}')">Delete</button>
    `

    fileList.appendChild(div)
  })
}


// DELETE FUNCTION
async function deleteFile(id) {

  const token = localStorage.getItem("token")

  await fetch(`http://localhost:5000/files/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token
    }
  })

  alert("File Deleted ❌")
  location.reload()
}