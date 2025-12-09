from flask import Flask, render_template, request, redirect, url_for, flash, session

app = Flask(__name__)
app.secret_key = 'a_very_secret_key_for_flashing_messages'

# Temporary storage for registered users
users = {
    "admin@example.com": "12345"   # Default admin user
}

@app.route('/')
def qr_reader():
    return render_template('index.html')


# ---------------- ATTENDANCE MANAGEMENT ----------------
@app.route('/attendance')
def attendance():
    if 'user' not in session:
        flash("Please login first!", "error")
        return redirect(url_for('login'))

    return render_template('attendance.html')


# ---------------- LOGIN ----------------
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        # Check login
        if email in users and users[email] == password:
            session['user'] = email
            flash('Login successful!', 'success')
            return redirect(url_for('admin_dashboard'))
        else:
            flash('Invalid email or password.', 'error')
            return redirect(url_for('login'))

    return render_template('login.html')


# ---------------- REGISTER ----------------
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        confirm = request.form.get('confirm_password')

        # Password check
        if password != confirm:
            flash("Passwords do not match!", "error")
            return redirect(url_for('register'))

        # Duplicate check
        if email in users:
            flash("Email already registered!", "error")
            return redirect(url_for('register'))

        # Save new user
        users[email] = password
        flash("Registration successful!", "success")
        return redirect(url_for('login'))

    return render_template('register.html')


# ---------------- ADMIN DASHBOARD ----------------
@app.route('/admin')
def admin_dashboard():
    if 'user' not in session:
        flash("Please login first!", "error")
        return redirect(url_for('login'))

    return render_template('admin.html')


# ---------------- STUDENT MANAGEMENT ----------------
@app.route('/students')
def student_management():
    if 'user' not in session:
        flash("Please login first!", "error")
        return redirect(url_for('login'))

    return render_template('student.html')


# ---------------- STUDENT SCAN (ADD/EDIT WITH CAMERA) ----------------
@app.route('/students/scan')
def student_scan():
    if 'user' not in session:
        flash("Please login first!", "error")
        return redirect(url_for('login'))

    return render_template('student_scan.html')


# ---------------- LOGOUT ----------------
@app.route('/logout')
def logout():
    session.pop('user', None)
    flash("Logged out successfully.", "success")
    return redirect(url_for('login'))


# ---------------- MAIN ----------------
if __name__ == '__main__':
    app.run(debug=True)
