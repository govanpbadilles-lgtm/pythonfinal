// Wait until full page loads
document.addEventListener("DOMContentLoaded", () => {

    // -------------------------------
    // LOGIN Button Redirection
    // -------------------------------
    const loginBtn = document.querySelector(".header-login-btn");

    if (loginBtn) {
        loginBtn.addEventListener("click", (e) => {
            console.log("LOGIN button clicked");
            // Disable to prevent double-click
            loginBtn.style.pointerEvents = "none";
        });
    }

    // -------------------------------
    // Auto-remove flash messages
    // -------------------------------
    const flashMessages = document.querySelector(".flash-messages");

    if (flashMessages) {
        setTimeout(() => {
            flashMessages.style.opacity = "0";
            flashMessages.style.transition = "0.4s";

            setTimeout(() => {
                flashMessages.remove();
            }, 400);
        }, 3000); // 3 seconds
    }

    // -------------------------------
    // Simple QR "loading animation"
    // -------------------------------
    const qrBox = document.querySelector(".qr-code-placeholder");

    if (qrBox) {
        qrBox.addEventListener("click", () => {
            qrBox.classList.toggle("active-scan");

            if (qrBox.classList.contains("active-scan")) {
                qrBox.innerText = "Scanning...";
            } else {
                qrBox.innerText = "";
            }
        });
    }
});
