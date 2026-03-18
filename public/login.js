// Vi henter elementene vi laget i index.html
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

loginBtn.addEventListener("click", async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;


    if (!username || !password) {
        message.innerText = "Please enter both username and password.";
        return;
    }

    try {
       
        const response = await fetch("/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
           
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("username", username);

            window.location.href = "app.html";
        } else {

            message.innerText = data.error || "Login failed. Please try again.";
        }
    } catch (err) {
        console.error("Login error:", err);
        message.innerText = "Connection error. Is the server running?";
    }
});