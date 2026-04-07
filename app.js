const API_URL = "https://synergy-backend-m42p.onrender.com"; 

// 1. Wannan function din zai dauko kudin mamba daga ajiya (Storage)
function getBalance() {
    let currentBalance = localStorage.getItem('synergy_balance') || "0.00";
    return parseFloat(currentBalance);
}

// 2. Wannan zai kara kudi idan kallo ya yi kyau
function updateWalletUI(amount) {
    let newBalance = getBalance() + amount;
    localStorage.setItem('synergy_balance', newBalance.toFixed(2));
    
    // Idan akwai element mai id="wallet-balance" a shafin, zai sauya
    const balanceDisplay = document.getElementById('wallet-balance');
    if (balanceDisplay) {
        balanceDisplay.innerText = "$" + newBalance.toFixed(2);
    }
}

// 3. Wannan shi ne babban aikin (The Verification)
async function executeVerification() {
    const userId = "MAMBA_001"; // Daga baya zamu sa na kowa ya zama daban
    const watchTime = 65; 

    try {
        const response = await fetch(`${API_URL}/api/verify-task`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, watchTime })
        });
        
        const data = await response.json();
        
        if(data.success) {
            // IDAN YA YI NASARA: Muna kara $0.50 (Naira 750 misali)
            updateWalletUI(0.50); 
            alert("ALHAMDULLILAH! An tura $0.50 zuwa Wallet dinka. Sabon Balance: $" + localStorage.getItem('synergy_balance'));
        } else {
            alert("Kallo bai isa ba!");
        }
    } catch (error) {
        alert("Akwai matsala da Server!");
    }
}
