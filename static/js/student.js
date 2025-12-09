document.addEventListener("DOMContentLoaded", () => {

    const studentName = document.querySelector('#studentName');
    const studentLastname = document.querySelector('#studentLastname');
    const studentFirstname = document.querySelector('#studentFirstname');
    const studentCourse = document.querySelector('#studentCourse');
    const studentLevel = document.querySelector('#studentLevel');
    const editBtn = document.querySelector('#editBtn');
    const addStudentBtn = document.querySelector('#addStudentBtn');

    const tableBody = document.querySelector("table tbody");

    let editingRow = null; // Track which row is being edited

    // ✅ ENABLE FIELDS BY DEFAULT when page loads
    enableFields();
    editBtn.disabled = true; // Keep EDIT button disabled initially

    // ------------ CHECK FOR NEW STUDENT DATA FROM SCAN PAGE ------------
    const newStudentData = sessionStorage.getItem('newStudent');
    if (newStudentData) {
        const student = JSON.parse(newStudentData);
        
        if (student.isEdit && student.editId) {
            // Update existing student
            const rows = tableBody.querySelectorAll('tr');
            rows.forEach(row => {
                if (row.cells[0].textContent === student.editId) {
                    row.cells[1].textContent = student.idno;
                    row.cells[2].textContent = student.lastname;
                    row.cells[3].textContent = student.firstname;
                    row.cells[4].textContent = student.course;
                    row.cells[5].textContent = student.level;
                }
            });
        } else {
            // Add new student to table
            const row = document.createElement("tr");
            const newId = tableBody.children.length + 1;

            row.innerHTML = `
                <td>${newId}</td>
                <td>${student.idno}</td>
                <td>${student.lastname}</td>
                <td>${student.firstname}</td>
                <td>${student.course}</td>
                <td>${student.level}</td>
                <td class="action-icons">
                    <i class="fa-solid fa-eye view-icon"></i>
                    <i class="fa-solid fa-trash delete-icon"></i>
                </td>
            `;

            tableBody.appendChild(row);
            attachRowEvents();
        }
        
        // Clear the sessionStorage
        sessionStorage.removeItem('newStudent');
        
        // ✅ Clear form and re-enable fields for next entry
        clearForm();
        enableFields();
        editBtn.disabled = true;
    }

    // ------------ ADD STUDENT BUTTON ------------
    addStudentBtn.addEventListener("click", () => {
        // Validate that all fields are filled
        const idno = studentName.value.trim();
        const lastname = studentLastname.value.trim();
        const firstname = studentFirstname.value.trim();
        const course = studentCourse.value;
        const level = studentLevel.value;

        if (!idno || !lastname || !firstname || !course || !level) {
            alert('Please fill out all fields before adding a student.');
            return;
        }

        // Store form data to pass to scan page
        const formData = {
            idno: idno,
            lastname: lastname,
            firstname: firstname,
            course: course,
            level: level
        };

        sessionStorage.setItem('formData', JSON.stringify(formData));

        // Redirect to scan page
        window.location.href = '/students/scan';
    });

    // ------------ EDIT BUTTON (redirects to scan page with data) -------------
    editBtn.addEventListener("click", () => {
        if (editingRow) {
            // Get current data from form
            const idno = studentName.value;
            const lastname = studentLastname.value;
            const firstname = studentFirstname.value;
            const course = studentCourse.value;
            const level = studentLevel.value;
            const rowId = editingRow.cells[0].textContent;
            
            // Redirect to scan page with student data
            window.location.href = `/students/scan?edit=true&id=${rowId}&idno=${encodeURIComponent(idno)}&lastname=${encodeURIComponent(lastname)}&firstname=${encodeURIComponent(firstname)}&course=${encodeURIComponent(course)}&level=${encodeURIComponent(level)}`;
        } else {
            alert('Please select a student by clicking the eye icon first.');
        }
    });

    function enableFields() {
        studentName.disabled = false;
        studentLastname.disabled = false;
        studentFirstname.disabled = false;
        studentCourse.disabled = false;
        studentLevel.disabled = false;
    }

    function disableFields() {
        studentName.disabled = true;
        studentLastname.disabled = true;
        studentFirstname.disabled = true;
        studentCourse.disabled = true;
        studentLevel.disabled = true;
    }

    function clearForm() {
        studentName.value = "";
        studentLastname.value = "";
        studentFirstname.value = "";
        studentCourse.value = "";
        studentLevel.value = "";
        editingRow = null;
        
        // Reset avatar to default icon
        const avatarDiv = document.getElementById('studentAvatar');
        if (avatarDiv) {
            avatarDiv.innerHTML = '<i class="fa-solid fa-user" id="defaultIcon" style="font-size: 60px; color: #999;"></i>';
        }
    }

    // ------------ ADD VIEW/DELETE FUNCTION TO ROWS -------------
    function attachRowEvents() {
        // VIEW icon - toggle between view mode and input mode
        document.querySelectorAll(".view-icon").forEach((icon) => {
            icon.onclick = function() {
                const row = this.parentElement.parentElement;
                
                // Check if clicking the same row again (toggle behavior)
                if (editingRow === row && studentName.disabled) {
                    // Clicking same student again - clear and enable for adding new student
                    clearForm();
                    enableFields();
                    editBtn.disabled = true;
                    editingRow = null;
                    return;
                }
                
                editingRow = row;

                // Load data into form
                const idno = row.cells[1].textContent;
                studentName.value = idno;
                studentLastname.value = row.cells[2].textContent;
                studentFirstname.value = row.cells[3].textContent;
                studentCourse.value = row.cells[4].textContent;
                studentLevel.value = row.cells[5].textContent;

                // Disable fields (read-only mode)
                disableFields();
                
                // Enable EDIT button
                editBtn.disabled = false;

                // Load student image if exists in localStorage
                const studentImage = localStorage.getItem(`student_image_${idno}`);
                const avatarDiv = document.getElementById('studentAvatar');
                const defaultIcon = document.getElementById('defaultIcon');
                
                if (studentImage && avatarDiv) {
                    // Hide default icon and show image
                    if (defaultIcon) defaultIcon.style.display = 'none';
                    
                    // Clear and add image
                    avatarDiv.innerHTML = `<img src="${studentImage}" style="width: 100%; height: 100%; object-fit: cover;" />`;
                    
                    console.log('Student image loaded for IDNO:', idno);
                } else {
                    // Reset to default icon if no image
                    if (avatarDiv) {
                        avatarDiv.innerHTML = '<i class="fa-solid fa-user" id="defaultIcon" style="font-size: 60px; color: #999;"></i>';
                    }
                    console.log('No image found for IDNO:', idno);
                }
            };
        });

        // DELETE icon
        document.querySelectorAll(".delete-icon").forEach((icon) => {
            icon.onclick = function() {
                if (confirm("Are you sure you want to delete this student?")) {
                    const row = this.parentElement.parentElement;
                    const idno = row.cells[1].textContent;
                    
                    // ✅ Delete student image from localStorage
                    localStorage.removeItem(`student_image_${idno}`);
                    
                    // Remove row
                    row.remove();
                    reorderTableIDs();
                    clearForm();
                    
                    // ✅ Re-enable fields after delete
                    enableFields();
                    editBtn.disabled = true;
                    editingRow = null;
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