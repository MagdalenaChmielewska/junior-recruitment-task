const sqlite3 = require('sqlite3').verbose(),
      fs = require('fs')

class Db {
    constructor(dbFile) {
      this.dbFile = dbFile;

      if(!this.dbExists()) {
        this.createDb()
      }

      this.db = new sqlite3.Database(this.dbFile, sqlite3.OPEN_READWRITE);  
    }

    /** 
     * This function checks if db exists in expected location.
     */
    dbExists() {
      return fs.existsSync(this.dbFile)
    }

    /** 
     * If db does not exist, this function will create db file and initialize it with expected tables.
     */
    createDb() {
      if(!this.dbExists())
      {
        fs.openSync(this.dbFile, 'w');

        const db = new sqlite3.Database(this.dbFile, sqlite3.OPEN_READWRITE);  

        db.run(
            `CREATE TABLE IF NOT EXISTS tasks (
              id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 
              description TEXT NOT NULL,
              completed INTEGER DEFAULT 0
            )`
        )
      } 
    }

    /** 
     * Function allows to add task with given description to db
     * @param  {string} description - description of new task which should be added to database
     * @param  {function} onFinish - callback which will be triggered on database instert completion
     */
    createTask(description, onFinish) {
      this.db.run("INSERT INTO tasks (description) VALUES (?)", [description], onFinish)
    }

    /** 
     * Function allows to read all tasks from db
     * @param  {function} onFinish - callback which will be triggered after when all data is read from db
     */
    readTasks(onFinish) {
      this.db.all("SELECT * FROM tasks", onFinish)
    }
    
    /** 
     * Function allows to update existing task with given id
     * @param  {number} id - task id, it will be used to find task which values should be updated
     * @param  {Object} completed - task completion value to be set
     * @param  {function} onFinish - callback which will be triggered on database update completion
     */
    updateTask(id, completed, onFinish){
      this.db.run("UPDATE tasks SET completed=? WHERE id=?", [completed, id], onFinish)
    }

    /** 
     * Function allows to delete task with given id
     * @param  {number} id - task id, it will be used to find task which should be deleted
     * @param  {function} onFinish - callback which will be triggered on database delete completion
     */
    deleteTask(id, onFinish) {
      this.db.run("DELETE FROM tasks WHERE id=(?)", id, onFinish)
    } 
}

module.exports = Db;
