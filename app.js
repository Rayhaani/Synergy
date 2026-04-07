const API_URL = "https://synergy-backend-m42p.onrender.com"; 

// Wannan zai rika verify na mamba
function executeVerification() {
    const userId = "MAMBA_" + Math.floor(Math.random() * 1000); // Misali na mamba
    const watchTime = 65; // Misali sakan 65 mamba ya kalla

    console.log("Connecting to Synergy Backend...");

    fetch(`${API_URL}/api/verify-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: userId,
            watchTime: watchTime 
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            alert("ALHAMDULLILAH! Code dinka shi ne: " + data.code);
            // Idan kana da wani wuri a UI da kake son nuna kudin, zaka saka anan
        } else {
            alert("Kallo bai isa ba! Server ta ce ba ku kalla har sakan 60 ba.");
        }
    })
    .catch(err => {
        console.error("Server Error:", err);
        alert("Akwai matsala wajen hadawa da Server. Duba intanet dinka.");
    });
}
