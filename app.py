from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = 'a_very_secret_key_for_flashing_messages'


@app.route('/')
def qr_reader():
    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login_page():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        # Temporary login (replace with DB)
        if email == 'admin@example.com' and password == '12345':
            flash('Login successful!', 'success')
            return redirect(url_for('user_management'))   # <----- FIXED
        else:
            flash('Invalid email or password.', 'error')
            return render_template('login.html')

    return render_template('login.html')


@app.route('/user-management')
def user_management():
    return render_template('user_management.html')  # <--- Must exist


if __name__ == '__main__':
    app.run(debug=True)
