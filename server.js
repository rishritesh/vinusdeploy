const express = require('express');
const { Pool } = require('pg');                                                                       
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();


const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




// const pool = mysql.createPool({
//     host: 'localhost:3306',
    
//     user: 'root',
//     password: 'root',
//     database: 'hello',
//     waitForConnections: true,
//     connectionLimit: 100,
//     queueLimit: 0
// });

//const mysql = require('mysql');

// const pool = new Pool({
//     host: 'localhost', // Specify only the hostname or IP address here
//     port: 5432,        // Specify the port separately
//     user: 'vinus',
//     password: 'root',
//     database: 'project',
//     waitForConnections: true,
//     connectionLimit: 100,
//     queueLimit: 0
// });

//connecting to db 
// const pool = new Pool({
//     user: 'vinus',
//     host: 'localhost',
//     database: 'project',
//     password: 'root',
//     port: 5432,
//   });


//configuration for vercel
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL ,
  });


// import { sql } from '@vercel/postgres';
 
// const likes = 100;
// const { rows, fields } =
//   await sql`SELECT * FROM posts WHERE likes > ${likes} LIMIT 5;`;
// app.post('/register', async (req, res) => {
//     const { name, email, password, confirm_password } = req.body;


    //console.log(email)

//     try {
//         if (name === undefined || email === undefined || password === undefined || confirm_password === undefined) {
//             throw new Error('Invalid request body. Make sure all required fields are provided.');
//         }

//         const client = await pool.connect();


        
//         const [existingUsers] = await client.query('SELECT * FROM useraccount WHERE email = $1', [email]);



//         console.log(existingUsers)
//         if (!email.match(/@gmail\.com$/)) {
//             return res.status(400).send('Only Gmail accounts are allowed for registration.');
//         }

//         if (existingUsers.length > 0) {
//             res.status(409).json({ success: false, message: 'User already exists. Please sign in.' });


//             client.release();
//             return;
//         }
//         console.log(name);

        
//         const result = await client.query('INSERT INTO useraccount (name, email, password, confirm_password) VALUES ($1, $2, $3, $4)', [name, email, password, confirm_password]);


//         // const [result] = await client.query('INSERT INTO useraccount (name, email, password, confirm_password) VALUES ($!, $2, $3, $4)', [name, email, password, confirm_password]);
//         client.release();

//         res.redirect('/index.html');
//         return;
//     } catch (error) {
//         console.error("Error signing up user:", error);
//         res.status(500).json({ success: false, message: `Error signing up user: ${error.message}` });
//     }
// });


app.post('/register', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    console.log(name, email, password, confirm_password)

try {
    if (name === undefined || email === undefined || password === undefined || confirm_password === undefined) {
        throw new Error('Invalid request body. Make sure all required fields are provided.');
    }

    // Define an async function to wrap your code
    async function signUpUser() {
        const client = await Pool.connect();

        const existingUsersQuery = 'SELECT * FROM useraccount WHERE email = $1';
        const { rows: existingUsers } = await client.query(existingUsersQuery, [email]);

        console.log(existingUsers);
        if (!email.match(/@gmail\.com$/)) {
            return res.status(400).send('Only Gmail accounts are allowed for registration.');
        }

        if (existingUsers.length > 0) {
            res.status(409).json({ success: false, message: 'User already exists. Please sign in.' });
            client.release();
            return;
        }

        const insertUserQuery = 'INSERT INTO useraccount (name, email, password, confirm_password) VALUES ($1, $2, $3, $4)';
        const insertUserValues = [name, email, password, confirm_password];
        await client.query(insertUserQuery, insertUserValues);

        client.release();

        res.redirect('/index.html');
    }

    // Call the async function
    signUpUser().catch(error => {
        console.error("Error signing up user:", error);
        res.status(500).json({ success: false, message: `Error signing up user: ${error.message}` });
    });
} catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ success: false, message: `Error signing up user: ${error.message}` });
}

})
















// try {
//     if (name === undefined || email === undefined || password === undefined || confirm_password === undefined) {
//         throw new Error('Invalid request body. Make sure all required fields are provided.');
//     }

//     const client = await Pool.connect();

//     const existingUsersQuery = 'SELECT * FROM useraccount WHERE email = $1';
//     const { rows: existingUsers } = await client.query(existingUsersQuery, [email]);

//     console.log(existingUsers);
//     if (!email.match(/@gmail\.com$/)) {
//         return res.status(400).send('Only Gmail accounts are allowed for registration.');
//     }

//     if (existingUsers.length > 0) {
//         res.status(409).json({ success: false, message: 'User already exists. Please sign in.' });
//         client.release();
//         return;
//     }

//     const insertUserQuery = 'INSERT INTO useraccount (name, email, password, confirm_password) VALUES ($1, $2, $3, $4)';
//     const insertUserValues = [name, email, password, confirm_password];
//     await client.query(insertUserQuery, insertUserValues);

//     client.release();

//     res.redirect('/index.html');
//     return;
// } catch (error) {
//     console.error("Error signing up user:", error);
//     res.status(500).json({ success: false, message: `Error signing up user: ${error.message}` });
// }
 




// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     console.log(email,password);

//     try {
//         const client = await pool.connect();


//         const [rows] = await client.query('SELECT * FROM useraccount WHERE email = ?', [email]);

//         client.release();


//         if (rows.length > 0) {
//             const test = rows[0];

//             console.log(test==password)
//             console.log(typeof (test.password))
//             console.log(typeof +password)


//             if (test.password === +password) {

//                 res.redirect('/index.html');
//                 return;
//             } else {

//                 res.status(401).json({ success: false, message: 'Invalid email or password' });
//             }
//         } else {

//             res.status(401).json({ success: false, message: 'Invalid email or password' });
//         }
//     } catch (error) {
//         console.error("Error signing in user:", error);
//         res.status(500).json({ success: false, message: `Error signing in user: ${error.message}` });
//     }
// });

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log(email,password);

    try {
        const client = await pool.connect();

        // Query to fetch user details based on email
        const query = 'SELECT * FROM useraccount WHERE email = $1';
        const { rows } = await client.query(query, [email]);

        client.release();

        if (rows.length > 0) {
            const user = rows[0];

            // Check if the provided password matches the stored password
            if (user.password === password) {
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


// app.post('/forgot-password', async (req, res) => {
//     const { email, password } = req.body;
//     console.log(email,password)

//     try {
//         const client = await pool.connect();
//         const [rows] = await client.query('SELECT * FROM useraccount WHERE email = ?', [email]);
        
        
        
//         if (rows.length > 0) {
//             const test = rows[0];

            


//             if (test.email === email) {

//                 const [result] = await connection.execute('UPDATE useraccount SET password = ?,confirm_password = ? WHERE email = ?', [password,password,email]);
//                 console.log(result)
                
//                 res.redirect('/index.html');
//                 client.release();
//                 return;
//             } else {

//                 res.status(401).json({ success: false, message: 'Invalid email' });
//             }
//         } else {

//             res.status(401).json({ success: false, message: 'Invalid email or password' });
//         }
    
//     } catch (error) {
//         console.error("Email not match:", error);
//         res.status(500).json({ success: false, message: `Error signing in user: ${error.message}` });
//     }
// });

app.post('/forgot-password', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)

    try {
        const client = await pool.connect();
        const query = 'SELECT * FROM useraccount WHERE email = $1';
        const { rows } = await client.query(query, [email]);

        if (rows.length > 0) {
            const user = rows[0];

            if (user.email === email) {
                const updateQuery = 'UPDATE useraccount SET password = $1, confirm_password = $2 WHERE email = $3';
                const updateValues = [password, password, email];
                await client.query(updateQuery, updateValues);

                res.redirect('/index.html');
                client.release();
                return;
            } else {
                res.status(401).json({ success: false, message: 'Invalid email' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Invalid email' });
        }
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ success: false, message: `Error updating password: ${error.message}` });
    }
});



app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, './files/login.html'));
});
// Define routes for HTML files
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'files/index.html'));
});

app.get('/quiz_expression_with_grep.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'files/quiz_expression_with_grep.html'));
});

app.get('/quiz_file_management.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'files/quiz_file_management.html'));
});

app.get('/quiz_intro.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'files/quiz_intro.html'));
});

app.get('/quiz_linux_advance.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'files/quiz_linux_advance.html'));
});

app.get('/quiz_linux_basics.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'files/quiz_linux_basics.html'));
});

app.get('/quiz_managing_users_groups.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'files/quiz_managing_users_groups.html'));
});

app.get('/quiz_permissions.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'files/quiz_permissions.html'));
});

app.get('/quiz_vim_editing.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'files/quiz_vim_editing.html'));
});

app.get('/quizzes.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'files/quizzes.html'));
});

app.get('/result_intro.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'files/result_intro.html'));
});

app.get('/login.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'files/login.html'));
});

app.get('/tutorials.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'files/tutorials.html'));
});

app.get('/tutorial_basic_commands.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'files/tutorial_basic_commands.html'));
});

app.get('/tutorial_expression_with_grep.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'files/tutorial_expression_with_grep.html'));
});

app.get('/tutorial_file_management.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'files/tutorial_file_management.html'));
});

app.get('/tutorial_intro.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'files/tutorial_intro.html'));
});

app.get('/tutorial_linux_advance.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'files/tutorial_linux_advance.html'));
});

app.get('/tutorial_managing_users_groups.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'files/tutorial_managing_users_groups.html'));
});

app.get('/tutorial_permissions.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'files/tutorial_permissions.html'));
});

app.get('/tutorial_vim_editing.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'files/tutorial_vim_editing.html'));
});

app.get('/vinus.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'vinus.jpg'));
});



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
