const PORT = process.env.PORT ?? 8000 //will be adding the port in the KINSTA App..
const express = require('express')
const {v4:uuidv4} = require('uuid') //from documentation
const cors = require('cors')
const app = express()
const pool = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


app.use(cors())
app.use(express.json())

//get all todos (:)
app.get('/todos/:userEmail', async (req, res) => {
    
    const userEmail = req.params.userEmail
    
    try {
        const todos = await pool.query('SELECT * FROM todos WHERE user_email = $1',[userEmail])
        res.json(todos.rows) //send database results to localhost:8000/todos
    } catch (err) {
        console.error(err)
    }
})


// Create a new todo
app.post('/todos', async (req, res) => {
    
    const {user_email, title, progress, date } = req.body;
    const id = uuidv4()

    try {
       
        const newToDo = await pool.query(
            'INSERT INTO todos (id, user_email, title, progress, date) VALUES ($1, $2, $3, $4, $5)',
            [id, user_email, title, progress, date])
            res.json(newToDo)
          
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Bad Request' });
    }
})

/// edit a todo
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { user_email, title, progress, date } = req.body;

    try {
      const editToDo = await pool.query(
        'UPDATE todos SET user_email =$1, title = $2, progress = $3, date = $4 WHERE id = $5;',
        [user_email, title, progress, date, id]
      );
      res.json(editToDo);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Bad Request' });
    }
  });

  // Delete a todo
  app.delete('/todos/:id', async (req, res) => {
        const {id} = req.params
        try {
            const deleteToDo = await pool.query('DELETE FROM todos WHERE id = $1;', [id])
            res.json(deleteToDo);
        } catch (err) {
        console.error(err);}
  })
  

//signup endpoint
app.post('/signup', async (req, res) => {

 const {email, password } = req.body
 const salt = bcrypt.genSaltSync(10)
 const hashedPassword = bcrypt.hashSync(password, salt)  
 
 try {

    const signUp = await pool.query('INSERT INTO users (email, hashed_password) VALUES ($1, $2)', [email, hashedPassword])
    const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'}) //from documentation
    res.json({email, token})

} catch (err) {
    console.error(err);
    if (err) {
        res.json({detail:err.detail})
    }

}


})

//login endpoint
app.post('/login', async (req, res) => {
    const {email, password } = req.body
    
    try {
        const users = await pool.query('SELECT * FROM users WHERE email =$1', [email])

       if (!users.rows.length) return res.json({detail: 'User does not exist'})

       const success = await bcrypt.compare(password, users.rows[0].hashed_password)
       const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'}) //from documentation
       
       if (success) {
        res.json({ 'email' : users.rows[0].email, token })
       } else {
        res.json({detail: "login failed" })
       }
    } catch (err) {
    console.error(err);}

})



app.listen(PORT, ()=> console.log(`listening on port ${PORT}`)) 