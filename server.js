const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Vinus',
    database: 'Vinus',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (username === undefined || email === undefined || password === undefined) {
            throw new Error('Invalid request body. Make sure all required fields are provided.');
        }

        const connection = await pool.promise().getConnection();


        const [existingUsers] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUsers.length > 0) {

            res.status(409).json({ success: false, message: 'User already exists. Please sign in.' });
            connection.release();
            return;
        }


        const [result] = await connection.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
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


        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

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


app.get('/index.html', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// app.get('/quiz.css', (req, res) => {
//     res.setHeader('Content-Type', 'text/css');
//     res.sendFile(__dirname + '/quiz.css');
// });

// app.get('/cddcdc.js', (req, res) => {
//     res.setHeader('Content-Type', 'application/javascript');
//     res.sendFile(__dirname + '/cddcdc.js');
// });

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// app.get('/jonatan-pie-3l3RwQdHRHg-unsplash.jpg', (req, res) => {
//     res.sendFile(__dirname + '/jonatan-pie-3l3RwQdHRHg-unsplash.jpg');
// });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
