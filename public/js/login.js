const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

loginBtn.addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        message.innerText = "Please enter both username and password.";
        message.style.color = "orange";
        return;
    }

    try {
        const response = await fetch("/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        console.log("Server response:", data); 

        if (response.ok) {
           
            const idToStore = data.userId || (data.user && data.user.id);

            if (idToStore) {
                // Save to localStorage
                localStorage.setItem("userId", idToStore);
                localStorage.setItem("username", username);
                
                message.innerText = "Logged in! Redirecting...";
                message.style.color = "green";

                // Redirect to the main app
                window.location.href = "app.html";
            } else {
                console.error("No ID found in the server response.");
                message.innerText = "Error: Could not retrieve user ID from server.";
                message.style.color = "red";
            }
        } else {
            message.innerText = data.error || "Login failed. Please try again.";
            message.style.color = "red";
        }
    } catch (err) {
        console.error("Login error:", err);
        message.innerText = "Connection error. Is the server running?";
        message.style.color = "red";
    }
});