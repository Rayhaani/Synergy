https://synergy-backend-m42p.onrender.com
const API_URL = "https://synergy-backend-m42p.onrender.com"; 

function completeTask(user_id, time_spent) {
    // Wannan code din zai tambayi server din daka gina ko mutum ya kalla sosai
    fetch(`${API_URL}/api/verify-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: user_id,
            watchTime: time_spent // Misali sakan 60
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            // Idan kallo ya cika, mamba zai ga Code dinsa
            document.getElementById('displayCode').innerText = data.code;
            alert("An Karbi Kallonku! Code dinku ya fito.");
        } else {
            alert("Ba ku kalla har sakan 60 ba!");
        }
    });
}
