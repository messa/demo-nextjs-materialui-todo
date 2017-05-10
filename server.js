const express = require('express')
const next = require('next')
const bodyParser = require('body-parser')

require('babel-register')

const getModel = require('./model').default
const model = getModel();

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = express()

  server.use(bodyParser.json())

  server.use((req, res, next) => {
    req.model = model;
    next()
  })

  server.get('/api/todo-items/all', (req, res) => {
    return res.json({todoItems: req.model.getTodoItems()})
  })

  server.post('/api/todo-items/mark-finished', (req, res) => {
    setTimeout(() => {
      const itemId = req.body.todoItemId;
      const finishedDate = new Date().toISOString();
      model.updateTodoItem(itemId, { finishedDate });
      return res.json({ finishedDate, todoItems: req.model.getTodoItems() })
    }, 1500);
  })

  server.post('/api/todo-items/mark-unfinished', (req, res) => {
    setTimeout(() => {
      const itemId = req.body.todoItemId;
      const finishedDate = null;
      model.updateTodoItem(itemId, { finishedDate });
      return res.json({ finishedDate, todoItems: req.model.getTodoItems() })
    }, 1500);
  })

  server.post('/api/todo-items/mark-deleted', (req, res) => {
    setTimeout(() => {
      const itemId = req.body.todoItemId;
      const deletedDate = new Date().toISOString();
      model.updateTodoItem(itemId, { deletedDate });
      return res.json({ deletedDate, todoItems: req.model.getTodoItems() })
    }, 1500);
  })

  server.post('/api/todo-items/add', (req, res) => {
    setTimeout(() => {
      const newTodoItem = model.addTodoItem(req.body.newTodoItem);
      return res.json({ newTodoItem, todoItems: req.model.getTodoItems() })
    }, 1500);
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})

// Source:
// https://learnnextjs.com/basics/server-side-support-for-clean-urls/create-a-custom-server
