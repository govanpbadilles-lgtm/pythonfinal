document.addEventListener("DOMContentLoaded", () => {
    const attendanceDate = document.getElementById('attendanceDate');
    const attendanceTableBody = document.getElementById('attendanceTableBody');
    const presentCountEl = document.getElementById('presentCount');
    const absentCountEl = document.getElementById('absentCount');
    const totalCountEl = document.getElementById('totalCount');
    const loadAttendanceBtn = document.getElementById('loadAttendanceBtn');
    const markAllPresentBtn = document.getElementById('markAllPresentBtn');
    const saveAttendanceBtn = document.getElementById('saveAttendanceBtn');

    // Set today's date by default
    const today = new Date().toISOString().split('T')[0];
    attendanceDate.value = today;

    // Initialize attendance tracking
    let attendanceRecords = {};

    // Load saved attendance for today
    loadAttendanceForDate(today);

    // Update summary counts
    function updateSummary() {
        let present = 0;
        let absent = 0;
        
        const rows = attendanceTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const presentBtn = row.querySelector('.present-btn');
            const absentBtn = row.querySelector('.absent-btn');
            
            if (presentBtn.classList.contains('active')) {
                present++;
            } else if (absentBtn.classList.contains('active')) {
                absent++;
            }
        });

        presentCountEl.textContent = present;
        absentCountEl.textContent = absent;
        totalCountEl.textContent = rows.length;
    }

    // Handle status button clicks
    function attachStatusButtons() {
        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const row = this.closest('tr');
                const presentBtn = row.querySelector('.present-btn');
                const absentBtn = row.querySelector('.absent-btn');
                
                // Remove active class from both buttons
                presentBtn.classList.remove('active');
                absentBtn.classList.remove('active');
                
                // Add active class to clicked button
                this.classList.add('active');
                
                updateSummary();
            });
        });
    }

    // Mark all students as present
    markAllPresentBtn.addEventListener('click', () => {
        const rows = attendanceTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const presentBtn = row.querySelector('.present-btn');
            const absentBtn = row.querySelector('.absent-btn');
            
            presentBtn.classList.add('active');
            absentBtn.classList.remove('active');
        });
        
        updateSummary();
    });

    // Save attendance
    saveAttendanceBtn.addEventListener('click', () => {
        const date = attendanceDate.value;
        const rows = attendanceTableBody.querySelectorAll('tr');
        const attendanceData = [];

        rows.forEach(row => {
            const studentId = row.cells[1].textContent;
            const lastname = row.cells[2].textContent;
            const firstname = row.cells[3].textContent;
            const presentBtn = row.querySelector('.present-btn');
            const absentBtn = row.querySelector('.absent-btn');
            
            let status = 'unmarked';
            if (presentBtn.classList.contains('active')) {
                status = 'present';
            } else if (absentBtn.classList.contains('active')) {
                status = 'absent';
            }

            attendanceData.push({
                studentId,
                lastname,
                firstname,
                status
            });
        });

        // Save to localStorage
        const key = `attendance_${date}`;
        localStorage.setItem(key, JSON.stringify(attendanceData));
        
        alert(`Attendance saved successfully for ${date}!`);
    });

    // Load attendance for a specific date
    function loadAttendanceForDate(date) {
        const key = `attendance_${date}`;
        const savedData = localStorage.getItem(key);
        
        if (savedData) {
            const attendanceData = JSON.parse(savedData);
            
            // Apply saved attendance to table
            const rows = attendanceTableBody.querySelectorAll('tr');
            rows.forEach(row => {
                const studentId = row.cells[1].textContent;
                const record = attendanceData.find(a => a.studentId === studentId);
                
                const presentBtn = row.querySelector('.present-btn');
                const absentBtn = row.querySelector('.absent-btn');
                
                // Reset buttons
                presentBtn.classList.remove('active');
                absentBtn.classList.remove('active');
                
                if (record) {
                    if (record.status === 'present') {
                        presentBtn.classList.add('active');
                    } else if (record.status === 'absent') {
                        absentBtn.classList.add('active');
                    }
                }
            });
            
            updateSummary();
        } else {
            // Clear all selections if no saved data
            const rows = attendanceTableBody.querySelectorAll('tr');
            rows.forEach(row => {
                const presentBtn = row.querySelector('.present-btn');
                const absentBtn = row.querySelector('.absent-btn');
                presentBtn.classList.remove('active');
                absentBtn.classList.remove('active');
            });
            updateSummary();
        }
    }

    // Load attendance button
    loadAttendanceBtn.addEventListener('click', () => {
        const date = attendanceDate.value;
        if (date) {
            loadAttendanceForDate(date);
        } else {
            alert('Please select a date first.');
        }
    });

    // Initialize
    attachStatusButtons();
    updateSummary();
});