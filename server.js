const express = require('express');
const mysql = require('mysql2');                                                                       
const bodyParser = require('body-parser');
const path = require('path');


const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const pool = mysql.createPool({
    host: 'localhost',
    
    user: 'root',
    password: 'Vinus',
    database: 'Project',
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});


app.post('/register', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;

    try {
        if (name === undefined || email === undefined || password === undefined || confirm_password === undefined) {
            throw new Error('Invalid request body. Make sure all required fields are provided.');
        }

        const connection = await pool.promise().getConnection();


        const [existingUsers] = await connection.execute('SELECT * FROM UserAccount WHERE email = ?', [email]);

        if (!email.match(/@gmail\.com$/)) {
            return res.status(400).send('Only Gmail accounts are allowed for registration.');
        }

        if (existingUsers.length > 0) {
            res.status(409).json({ success: false, message: 'User already exists. Please sign in.' });


            connection.release();
            return;
        }


        const [result] = await connection.execute('INSERT INTO UserAccount (name, email, password, confirm_password) VALUES (?, ?, ?, ?)', [name, email, password, confirm_password]);
        connection.release();

        res.redirect('/index.html');
        return;
    } catch (error) {
        console.error("Error signing up user:", error);
        res.status(500).json({ success: false, message: `Error signing up user: ${error.message}` });
    }
});



app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const connection = await pool.promise().getConnection();


        const [rows] = await connection.execute('SELECT * FROM UserAccount WHERE email = ?', [email]);

        connection.release();


        if (rows.length > 0) {
            const test = rows[0];


            if (test.password === password) {

                res.redirect('/index.html');
                return;
            } else {

                res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
        } else {

            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Error signing in user:", error);
        res.status(500).json({ success: false, message: `Error signing in user: ${error.message}` });
    }
});

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const connection = await pool.promise().getConnection();


        const [rows] = await connection.execute('SELECT * FROM UserAccount WHERE email = ?', [email]);

        connection.release();

    } catch (error) {
        console.error("Email not match:", error);
        res.status(500).json({ success: false, message: `Error signing in user: ${error.message}` });
    }
});
app.use(express.static(path.join(__dirname, 'public')));

// Define routes for HTML files
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/quiz_expression_with_grep.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'quiz_expression_with_grep.html'));
});

app.get('/quiz_file_management.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'quiz_file_management.html'));
});

app.get('/quiz_intro.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'quiz_intro.html'));
});

app.get('/quiz_linux_advance.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'quiz_linux_advance.html'));
});

app.get('/quiz_linux_basics.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'quiz_linux_basics.html'));
});

app.get('/quiz_managing_users_groups.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'quiz_managing_users_groups.html'));
});

app.get('/quiz_permissions.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'quiz_permissions.html'));
});

app.get('/quiz_vim_editing.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'quiz_vim_editing.html'));
});

app.get('/quizzes.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'quizzes.html'));
});

app.get('/result_intro.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'result_intro.html'));
});

app.get('/login.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/tutorials.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tutorials.html'));
});

app.get('/tutorial_basic_commands.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'tutorial_basic_commands.html'));
});

app.get('/tutorial_expression_with_grep.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'tutorial_expression_with_grep.html'));
});

app.get('/tutorial_file_management.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'tutorial_file_management.html'));
});

app.get('/tutorial_intro.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'tutorial_intro.html'));
});

app.get('/tutorial_linux_advance.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'tutorial_linux_advance.html'));
});

app.get('/tutorial_managing_users_groups.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'tutorial_managing_users_groups.html'));
});

app.get('/tutorial_permissions.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'tutorial_permissions.html'));
});

app.get('/tutorial_vim_editing.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'tutorial_vim_editing.html'));
});

app.get('/vinus.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'vinus.jpg'));
});



const PORT = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
