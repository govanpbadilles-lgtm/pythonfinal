document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");
    const email = document.querySelector("input[name='email']");
    const password = document.querySelector("input[name='password']");
    const confirmPassword = document.querySelector("input[name='confirm_password']");

    // Validate passwords match in real-time
    confirmPassword.addEventListener("input", () => {
        if (confirmPassword.value !== password.value) {
            confirmPassword.style.border = "2px solid red";
        } else {
            confirmPassword.style.border = "2px solid green";
        }
    });

    form.addEventListener("submit", (event) => {

        // Check empty fields
        if (!username.value.trim() || !email.value.trim() || !password.value.trim() || !confirmPassword.value.trim()) {
            event.preventDefault();
            alert("Please fill all fields.");
            return;
        }

        // Check password match
        if (password.value !== confirmPassword.value) {
            event.preventDefault();
            alert("Passwords do not match!");
            return;
        }

        // Check password length
        if (password.value.length < 5) {
            event.preventDefault();
            alert("Password must be at least 5 characters long.");
            return;
        }
    });

});
document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");
    const email = document.querySelector("input[name='email']");
    const password = document.querySelector("input[name='password']");
    const confirmPassword = document.querySelector("input[name='confirm_password']");

    // Validate passwords match in real-time
    confirmPassword.addEventListener("input", () => {
        if (confirmPassword.value !== password.value) {
            confirmPassword.style.border = "2px solid red";
        } else {
            confirmPassword.style.border = "2px solid green";
        }
    });

    form.addEventListener("submit", (event) => {

        // Check empty fields
        if (!email.value.trim() || !password.value.trim() || !confirmPassword.value.trim()) {
            event.preventDefault();
            alert("Please fill all fields.");
            return;
        }

        // Check password match
        if (password.value !== confirmPassword.value) {
            event.preventDefault();
            alert("Passwords do not match!");
            return;
        }

        // Check password length
        if (password.value.length < 5) {
            event.preventDefault();
            alert("Password must be at least 5 characters long.");
            return;
        }
    });

});
