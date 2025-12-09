document.addEventListener("DOMContentLoaded", () => {

    // ------------------------------------------------
    // Redirect "Register" button
    // ------------------------------------------------
    const registerBtn = document.querySelector(".btn-register");
    if (registerBtn) {
        registerBtn.addEventListener("click", () => {
            window.location.href = "/register";
        });
    }

    // ------------------------------------------------
    // Disable LOGIN button on FORM submit (prevent spam)
    // ------------------------------------------------
    const loginForm = document.querySelector("form");
    const loginBtn = document.querySelector(".btn-login");
    
    if (loginForm && loginBtn) {
        loginForm.addEventListener("submit", (e) => {
            // Disable button only on valid form submission
            loginBtn.disabled = true;
            loginBtn.innerText = "Processing...";
            
            // Optional: Re-enable after 3 seconds as a safety measure
            setTimeout(() => {
                loginBtn.disabled = false;
                loginBtn.innerText = "LOGIN";
            }, 3000);
        });
    }

    // ------------------------------------------------
    // Auto-hide flash messages after 3 seconds
    // ------------------------------------------------
    const flashBox = document.querySelector(".flash-messages");
    if (flashBox) {
        setTimeout(() => {
            flashBox.style.opacity = "0";
            flashBox.style.transition = "0.4s";

            setTimeout(() => {
                flashBox.remove();
            }, 400);

        }, 3000);
    }

    // ------------------------------------------------
    // Optional: Double-click password field to toggle visibility
    // ------------------------------------------------
    const passwordInput = document.querySelector("input[name='password']");
    if (passwordInput) {
        passwordInput.addEventListener("dblclick", () => {
            passwordInput.type =
                passwordInput.type === "password" ? "text" : "password";
        });
    }

});