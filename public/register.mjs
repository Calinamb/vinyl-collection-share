import { post } from "../modules/fetchManager.mjs";
import { t } from "../modules/i18n.mjs";

const usernameInput = document.getElementById("reg-username");
const passwordInput = document.getElementById("reg-password");
const consentInput = document.getElementById("reg-consent");
const message = document.getElementById("reg-message");
const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const consent = consentInput.checked;

    message.style.color = "red";
    message.innerText = "";

    if (!username || !password) {
        message.innerText = t("error_fill_fields");
        return;
    }

    if (!consent) {
        message.innerText = t("error_agree_terms");
        return;
    }

    try {
        await post("/users", { username, password, consent });
        message.style.color = "green";
        message.innerText = t("register_success");
        setTimeout(() => window.location.href = "index.html", 1500);
    } catch (err) {
        message.innerText = err.message || t("error_register_failed");
    }
});