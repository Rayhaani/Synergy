// 1. Naka Firebase Config din da ka samo
const firebaseConfig = {
  apiKey: "AIzaSyDLTwLq8Le9vYAwRkRcqXPGxFnEqW1yE2E",
  authDomain: "synergy-protocol.firebaseapp.com",
  projectId: "synergy-protocol",
  storageBucket: "synergy-protocol.firebasestorage.app",
  messagingSenderId: "179647543031",
  appId: "1:179647543031:web:388da8a36e1bbbb55d85f2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 2. Link din Backend dinka na Render
const API_URL = "https://synergy-backend-m42p.onrender.com";

// 3. Function na kara kudi a Cloud (Firebase)
async function updateCloudWallet(userId, amount) {
    const userRef = database.ref('users/' + userId);
    
    userRef.once('value', (snapshot) => {
        let currentData = snapshot.val();
        let currentBalance = (currentData && currentData.balance) ? currentData.balance : 0;
        let newBalance = currentBalance + amount;
        
        userRef.update({
            balance: newBalance,
            last_update: new Date().toISOString()
        }).then(() => {
            alert(`ALHAMDULLILAH! An tura $${amount} zuwa asusunka.`);
            // Nuna sabon balance idan akwai wurin nuna shi a shafin
            const balanceDisplay = document.getElementById('wallet-balance');
            if (balanceDisplay) {
                balanceDisplay.innerText = "$" + newBalance.toFixed(2);
            }
        });
    });
}

// 4. Babban Function na Verification (Wanda button dinka yake kira)
async function executeVerification() {
    // A yanzu kowa zai zama MAMBA_001, daga baya zamu sa kowa ya zama daban
    const userId = "MAMBA_001"; 
    const watchTime = 65; // Misali na sakan 65

    console.log("Checking with Render Backend...");

    try {
        const response = await fetch(`${API_URL}/api/verify-task`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, watchTime })
        });
        
        const data = await response.json();
        
        if(data.success) {
            // Idan Render ya tabbatar, sai mu kara kudi a Firebase
            updateCloudWallet(userId, 0.50); 
        } else {
            alert("Kallo bai isa ba! Ba za a tura kudi ba.");
        }
    } catch (error) {
        console.error("Connection Error:", error);
        alert("Ba a samu haduwa da Server ba.");
    }
                }
