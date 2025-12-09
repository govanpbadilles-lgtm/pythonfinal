document.addEventListener("DOMContentLoaded", () => {

    const emailInput = document.querySelector('.form-group input[type="email"]');
    const passwordInput = document.querySelector('#passwordField');
    const togglePassword = document.querySelector('#togglePassword');
    const saveBtn = document.querySelector('.btn-save');
    const cancelBtn = document.querySelector('.btn-cancel');

    const tableBody = document.querySelector("table tbody");

    let editingRow = null; // Track which row is being edited

    // ------------ TOGGLE PASSWORD VISIBILITY -------------
    togglePassword.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");
        } else {
            passwordInput.type = "password";
            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");
        }
    });

    // ------------ SAVE USER -------------
    saveBtn.addEventListener("click", () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert("Please fill out all fields.");
            return;
        }

        // Basic email validation
        if (!email.includes('@')) {
            alert("Please enter a valid email address.");
            return;
        }

        if (editingRow) {
            // Update existing row
            editingRow.cells[1].textContent = email;
            editingRow.cells[2].textContent = password;

            editingRow = null;
            saveBtn.textContent = "SAVE";

        } else {
            // Add NEW user
            const row = document.createElement("tr");

            const newId = tableBody.children.length + 1;

            row.innerHTML = `
                <td>${newId}</td>
                <td>${email}</td>
                <td>${password}</td>
                <td class="action-icons">
                    <i class="fa-solid fa-pen edit-icon"></i>
                    <i class="fa-solid fa-trash delete-icon"></i>
                </td>
            `;

            tableBody.appendChild(row);
        }

        clearForm();
        attachRowEvents();
    });

    // ------------ CANCEL BUTTON -------------
    cancelBtn.addEventListener("click", clearForm);

    function clearForm() {
        emailInput.value = "";
        passwordInput.value = "";
        editingRow = null;
        saveBtn.textContent = "SAVE";
    }

    // ------------ ADD EDIT/DELETE FUNCTION TO ROWS -------------
    function attachRowEvents() {
        document.querySelectorAll(".edit-icon").forEach((icon) => {
            icon.onclick = function() {
                const row = this.parentElement.parentElement;
                editingRow = row;

                emailInput.value = row.cells[1].textContent;
                passwordInput.value = row.cells[2].textContent;

                saveBtn.textContent = "UPDATE";
            };
        });

        document.querySelectorAll(".delete-icon").forEach((icon) => {
            icon.onclick = function() {
                if (confirm("Are you sure you want to delete this user?")) {
                    const row = this.parentElement.parentElement;
                    row.remove();
                    reorderTableIDs();
                }
            };
        });
    }

    // ------------ REORDER ID AFTER DELETE -------------
    function reorderTableIDs() {
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach((row, index) => {
            row.cells[0].textContent = index + 1;
        });
    }

    // Activate functionality on initial rows
    attachRowEvents();
});