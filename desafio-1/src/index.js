const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express()
app.use(express.json())

const users = []

function checksExistsUserAccount(req, res, next) {
  const {username} = req.headers

  const user = users.find((user) => user.username === username)

  if(!user) {
    return res.status(400).json({error: "User is not found"})
  }
  req.user = user

  return next()
}

app.post('/users', (req, res) => {
  const { name, username } = req.body

  userAlreadyExists = users.some(user => user.username === username)

  if(userAlreadyExists) {
    return res.status(400).json({error: "user already exists"})
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  })

  return res.status(201).json({message: "User Create"})
})

app.get('/todos', checksExistsUserAccount, (req, res) => {
  const { user } = req

  return res.json(user.todos)
})

app.post('/todos', checksExistsUserAccount, (req, res) => {
  const { title, deadline } = req.body
  const {user} = req

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo)

  return res.status(201).json(todo)
})

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  const {id} = req.params
  const {title, deadline} = req.body
  const {user} = req

  const todo = user.todos.find(todoItem => todoItem.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found!' });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return res.json(todo);
})

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  const { id } = req.params;
  const { user } = req;

  const todo = user.todos.find(todoItem => todoItem.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found!' });
  }

  todo.done = true;

  return res.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  const { id } = req.params;
  const { user } = req;

  const todo = user.todos.find(todoItem => todoItem.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found!' });
  }

  user.todos.splice(todo, 1);

  return res.status(204).send();
});

app.listen(3333)
