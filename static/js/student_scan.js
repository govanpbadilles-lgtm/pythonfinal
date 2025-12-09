document.addEventListener("DOMContentLoaded", () => {

    // Form elements
    const studentIdno = document.querySelector('#studentIdno');
    const studentLastname = document.querySelector('#studentLastname');
    const studentFirstname = document.querySelector('#studentFirstname');
    const studentCourse = document.querySelector('#studentCourse');
    const studentLevel = document.querySelector('#studentLevel');
    const saveBtn = document.querySelector('#saveBtn');
    const cancelBtn = document.querySelector('#cancelBtn');

    // Camera elements
    const coverVideo = document.querySelector('#coverVideo');
    const coverCanvas = document.querySelector('#coverCanvas');
    const captureBtn = document.querySelector('#captureBtn');
    const capturedImage = document.querySelector('#capturedImage');
    const noImage = document.querySelector('#noImage');

    let coverStream = null;
    let capturedImageData = null;

    // ------------ AUTO-START CAMERA ON PAGE LOAD ------------
    async function startCamera() {
        try {
            coverStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user' } 
            });
            coverVideo.srcObject = coverStream;
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Error accessing camera: ' + error.message);
        }
    }

    // Start camera automatically
    startCamera();

    // ------------ CAPTURE BUTTON ------------
    captureBtn.addEventListener('click', () => {
        if (coverStream) {
            // Set canvas size to match video
            coverCanvas.width = coverVideo.videoWidth;
            coverCanvas.height = coverVideo.videoHeight;
            
            // Draw video frame to canvas
            const context = coverCanvas.getContext('2d');
            context.drawImage(coverVideo, 0, 0);
            
            // Get image data
            capturedImageData = coverCanvas.toDataURL('image/png');
            
            // Display captured image in result section
            capturedImage.src = capturedImageData;
            capturedImage.style.display = 'block';
            noImage.style.display = 'none';
            
            console.log('Image captured successfully');
        } else {
            alert('Camera is not active. Please refresh the page.');
        }
    });

    // ------------ SAVE BUTTON ------------
    saveBtn.addEventListener('click', () => {
        const idno = studentIdno.value.trim();
        const lastname = studentLastname.value.trim();
        const firstname = studentFirstname.value.trim();
        const course = studentCourse.value;
        const level = studentLevel.value;

        if (!idno || !lastname || !firstname || !course || !level) {
            alert('Please fill out all fields.');
            return;
        }

        // Save captured image to localStorage with student IDNO as key
        if (capturedImageData) {
            localStorage.setItem(`student_image_${idno}`, capturedImageData);
        }

        // Store student data in sessionStorage to pass back to student management page
        const studentData = {
            idno: idno,
            lastname: lastname,
            firstname: firstname,
            course: course,
            level: level,
            coverImage: capturedImageData,
            isEdit: urlParams.has('edit'),
            editId: urlParams.get('id')
        };

        // Save to sessionStorage
        sessionStorage.setItem('newStudent', JSON.stringify(studentData));
        
        // Stop camera before leaving
        if (coverStream) {
            coverStream.getTracks().forEach(track => track.stop());
        }
        
        alert('Student saved successfully!');
        
        // Redirect back to student management page
        window.location.href = '/students';
    });

    // ------------ CANCEL BUTTON ------------
    cancelBtn.addEventListener('click', () => {
        // Stop camera
        if (coverStream) {
            coverStream.getTracks().forEach(track => track.stop());
        }
        
        // Redirect back to student management
        window.location.href = '/students';
    });

    // ------------ LOAD EDIT DATA IF EXISTS ------------
    // Check if we're in edit mode (data passed via URL params or session)
    const urlParams = new URLSearchParams(window.location.search);
    
    // Load from URL params (for EDIT button)
    if (urlParams.has('edit')) {
        const studentId = urlParams.get('id');
        const idno = urlParams.get('idno');
        const lastname = urlParams.get('lastname');
        const firstname = urlParams.get('firstname');
        const course = urlParams.get('course');
        const level = urlParams.get('level');
        
        if (idno) studentIdno.value = idno;
        if (lastname) studentLastname.value = lastname;
        if (firstname) studentFirstname.value = firstname;
        if (course) studentCourse.value = course;
        if (level) studentLevel.value = level;
    } 
    // Load from sessionStorage (for ADD button)
    else {
        const formData = sessionStorage.getItem('formData');
        if (formData) {
            const data = JSON.parse(formData);
            studentIdno.value = data.idno || '';
            studentLastname.value = data.lastname || '';
            studentFirstname.value = data.firstname || '';
            studentCourse.value = data.course || '';
            studentLevel.value = data.level || '';
            
            // Clear sessionStorage
            sessionStorage.removeItem('formData');
        }
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (coverStream) {
            coverStream.getTracks().forEach(track => track.stop());
        }
    });

});