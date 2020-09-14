var express = require('express');
let db = require('../util/database');

var router = express.Router();
let scoreTableName = "HIGHSCORES";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Assignment 1: Memory Game'
  });
});

module.exports = router;
checkForAndCreateHighScoreTable();





/**
 * Checks if the high score table exists and creates it if it doesn't.
 */
function checkForAndCreateHighScoreTable(){
  tableExists(scoreTableName,createHighScoreTable, null);
}


/**
 * Checks if a table exists and runs callbacks.
 * @param tableName the table to check for
 * @param callback_false: function to call if table does not exist.
 * @param callback_true: function to call if table does exist.
 */
function tableExists(tableName, callback_false, callback_true){

  let tableExistsQuery = "SELECT 1 from " + tableName + " LIMIT 1";

  db.execute(tableExistsQuery)
      .then((data) => {
        console.log(" table exists data: " + data)
        try {
          callback_true();
        }catch (err){
          console.log("error with callback: " + err)
        }
      })
      .catch((error) => {
        console.log("table exists query error: " + error);
        try{
          callback_false()
        }catch(err){
          console.log("Error with callback: " + err)
        };
      })
}

/**
 * Creates the high score table.
 */
function createHighScoreTable(){

  let createTableQuery = "CREATE TABLE "+scoreTableName+"(" +
      "ID INT NOT NULL AUTO_INCREMENT," +
      "INDEX (ID)," +
      "NAME VARCHAR(255) NOT NULL," +
      "SCORE INT NOT NULL," +
      "PRIMARY KEY (ID)" +
      ");";

  db.execute(createTableQuery)
      .then((data)=> {
        console.log("create table data:" + data);
      })
      .catch((error)=>{
        console.log("create table error " + error);
      })


}