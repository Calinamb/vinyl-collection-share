const usernameInput = document.getElementById("reg-username");
const passwordInput = document.getElementById("reg-password");
const consentInput = document.getElementById("reg-consent");
const registerBtn = document.getElementById("registerBtn");
const message = document.getElementById("reg-message");

console.log("Register scriptet er lastet!");

const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
    console.log("Fant knappen!");
} else {
    console.error("Fant IKKE knappen!");
}

registerBtn.addEventListener("click", async (event) => {
   
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const consent = consentInput.checked;

    message.innerText = ""; // Nullstill tidligere meldinger

    if (!username || !password) {
        message.innerText = "Please fill in all fields.";
        return;
    }

    if (!consent) {
        message.innerText = "You must agree to the terms.";
        return;
    }

    try {
        const response = await fetch("/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, consent })
        });

        const data = await response.json();

        if (response.ok) {
            alert("User created successfully! You can now login.");
            window.location.href = "index.html";
        } else {

            message.innerText = data?.error || "Registration failed. Please try again.";
        }
    } catch (err) {
        console.error("Register error:", err);
        message.innerText = "Server error. Try again later.";
    }
});