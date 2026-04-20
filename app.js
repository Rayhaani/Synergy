// 1. Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDLTwLq8Le9vYAwRkRcqXPGxFnEqW1yE2E",
  authDomain: "synergy-protocol.firebaseapp.com",
  projectId: "synergy-protocol",
  storageBucket: "synergy-protocol.firebasestorage.app",
  messagingSenderId: "179647543031",
  appId: "1:179647543031:web:388da8a36e1bbbb55d85f2"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database(); // Muna amfani da Realtime Database

const API_URL = "https://synergy-backend-m42p.onrender.com";

// --- SYNERGY MULTI-LEVEL ENGINE (GYARARRE) ---
async function distributeCommissions(currentUser, earnedAmount) {
    const commissionRates = [0.10, 0.05, 0.025]; 
    let currentChild = currentUser;

    for (let i = 0; i < commissionRates.length; i++) {
        try {
            // Nemo bayanan yaro a Realtime Database
            const snapshot = await database.ref('users/' + currentChild).once('value');
            const userData = snapshot.val();
            
            if (!userData || !userData.referredBy) break;
            
            const parentId = userData.referredBy;
            if (parentId === "admin" || parentId === "") break;

            const commission = earnedAmount * commissionRates[i];

            // Biyan uba (Parent)
            const parentRef = database.ref('users/' + parentId);
            const parentSnap = await parentRef.once('value');
            const parentData = parentSnap.val();
            
            let currentBal = (parentData && parentData.balance) ? parentData.balance : 0;
            let currentRefEarn = (parentData && parentData.referralEarnings) ? parentData.referralEarnings : 0;

            await parentRef.update({
                balance: currentBal + commission,
                referralEarnings: currentRefEarn + commission
            });

            console.log(`Level ${i+1} Commission sent to ${parentId}`);
            currentChild = parentId; // Matsa zuwa mataki na gaba

        } catch (error) {
            console.error("Commission Error:", error);
            break; 
        }
    }
}

// 4. Babban Function na Verification
async function executeVerification() {
    const userId = "MAMBA_001"; 
    const watchTime = 65; 

    try {
        const response = await fetch(`${API_URL}/api/verify-task`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, watchTime })
        });
        
        const data = await response.json();
        
        if(data.success) {
            // A. Biyan wanda ya yi kallo
            await updateCloudWallet(userId, 0.50); 
            
            // B. Raba kudin gayyata (Level 1-3) - NAN NE AKA KARA WANNAN
            await distributeCommissions(userId, 0.50);
            
        } else {
            alert("Kallo bai isa ba!");
        }
    } catch (error) {
        console.error("Connection Error:", error);
    }
}

// 3. Function na kara kudi
async function updateCloudWallet(userId, amount) {
    const userRef = database.ref('users/' + userId);
    const snapshot = await userRef.once('value');
    let currentData = snapshot.val();
    let currentBalance = (currentData && currentData.balance) ? currentData.balance : 0;
    
    await userRef.update({
        balance: currentBalance + amount,
        last_update: new Date().toISOString()
    });
    
    alert(`ALHAMDULLILAH! An tura $${amount} zuwa asusunka.`);
}
