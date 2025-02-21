function generateEmail() {
    let sender = document.getElementById('sender').value.trim();
    let receiver = document.getElementById('receiver').value.trim();
    let topic = document.getElementById('topic').value.trim();

    if (!sender || !receiver || !topic) {
        alert("Please fill in all fields.");
        return;
    }

    fetch("http://localhost:3000/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender, receiver, topic })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Response from server:", data); // ✅ Correct logging
        document.getElementById('emailOutput').innerText = data.email;
    })
    .catch(error => console.error("Error:", error));
}
