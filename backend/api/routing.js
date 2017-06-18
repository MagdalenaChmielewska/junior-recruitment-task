const express = require('express'),
      validate = require('express-validation'),
      Validation = require('./validation.js')
      bodyParser = require('body-parser'),
      Db = require('./../db.js');
      
const dbFile = "db.db";
const database = new Db(dbFile)

const api = express()

api.use(bodyParser.json());

/** 
 * Read all tasks
 */
api.get('/tasks', function (req, res, next) {
  database.readTasks(function(err, result) {
    if(err) next(err)
    else res.json(result)
  });  
})

/** 
 * Create new task
 */
api.post('/tasks', validate(Validation.addingTaskSchema), function (req, res, next) {
  database.createTask(req.body.description, function(err, result) { 
    if(err) next(err)
    else res.status(201).end()
  });
})

/** 
 * Delete task with given id
 */
api.delete('/tasks/:id', function (req, res, next) {
  database.deleteTask(req.params.id, function(err, result) {  
    if(err) next(err)
    else res.end()
  });  
})

/** 
 * Update task with given id
 */
api.patch('/tasks/:id', validate(Validation.updatingTaskSchema),  function (req, res, next) {
  database.updateTask(req.params.id, req.body.completed, function(err, result) { 
    if(err) next(err)
    else res.end()
  });  
})

module.exports = api;
