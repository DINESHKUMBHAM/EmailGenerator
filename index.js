function nextPhase() {
    document.getElementById('phase1').classList.add('hidden');
    document.getElementById('phase2').classList.remove('hidden');
}

function goToOptions() {
    document.getElementById('phase2').classList.add('hidden');
    document.getElementById('phase3').classList.remove('hidden');
}

function goBack() {
    document.getElementById('phase3').classList.add('hidden');
    document.getElementById('phase2').classList.remove('hidden');
}

function goHome() {
    document.getElementById('phase3').classList.add('hidden');
    document.getElementById('phase1').classList.remove('hidden');
}

// 🔹 Show custom topic input when "Other" is selected
function checkOtherTopic() {
    let topicDropdown = document.getElementById("topic");
    let customTopicInput = document.getElementById("customTopic");

    if (topicDropdown.value === "Other") {
        customTopicInput.classList.remove("hidden");
    } else {
        customTopicInput.classList.add("hidden");
    }
}

function generateEmail() {
    let sender = document.getElementById('sender').value.trim();
    let receiver = document.getElementById('receiver').value.trim();
    let topicDropdown = document.getElementById('topic');
    let customTopicInput = document.getElementById('customTopic');
    let topic = topicDropdown.value === "Other" ? customTopicInput.value.trim() : topicDropdown.value;
    let recipientEmail = document.getElementById('recipientEmail').value.trim();
    let specialinstructions = document.getElementById('specialinstructions').value.trim() || "Write correctly";
    let emailOutput = document.getElementById('emailOutput');

    if (!sender || !receiver || !topic || !recipientEmail) {
        alert("Please fill in all fields.");
        return;
    }

    emailOutput.value = "Generating email...";

    fetch("http://localhost:3000/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender, receiver, topic, email: recipientEmail, specialinstructions })
    })
    .then(response => response.json())
    .then(data => {
        emailOutput.value = data.email;
    })
    .catch(error => {
        console.error("Error:", error);
        emailOutput.value = "Error generating email. Please check your server.";
    });
}

function sendEmail() {
    let sender = document.getElementById('sender').value.trim();
    let recipientEmail = document.getElementById('recipientEmail').value.trim();
    let emailContent = document.getElementById('emailOutput').value.trim();

    if (!sender || !recipientEmail || !emailContent) {
        alert("Please fill in all fields.");
        return;
    }

    fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender, recipientEmail, emailContent })
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error("Error:", error));
}
