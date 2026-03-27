import { post } from "../modules/fetchManager.mjs";
import { t } from "../modules/i18n.mjs";

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

loginBtn.addEventListener("click", async () => {
    e.preventDefault()
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    message.style.color = "red";
    message.innerText = "";

    if (!username || !password) {
        message.innerText = t("error_fill_login");
        return;
    }

    try {
        const data = await post("/users/login", { username, password });

        const userId = data.user?.id;
        if (!userId) {
            message.innerText = t("error_no_user_id");
            return;
        }

        localStorage.setItem("userId", userId);
        localStorage.setItem("username", username);

        message.style.color = "green";
        message.innerText = t("login_success");
        setTimeout(() => window.location.href = "app.html", 1500);

    } catch (err) {
        message.innerText = err.message || t("error_login_failed");
    }
});x