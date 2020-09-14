var express = require('express');
let db = require('../util/database');
var router = express.Router();
const Highscore = require('../models/Highscore');
let scoreTableName = "HIGHSCORES";

/* GET leaderboard page.*/
router.get('/', function(req, res, next) {
    renderPage(res, null);
});


/*handles a file posting data with action = "/leaderboard"*/
router.post("/",function(req,res){
    console.log("posted: " + req.body.name);
    console.log("posted: " + req.body.score);
    let name = req.body.name;
    let score = parseInt(req.body.score);

    let newScore = new Highscore(name, score);
    console.log("newscore: " + newScore.Name + " " + newScore.Score);
    newScore.insertToDB(function(outcome){
        renderPage(res, newScore);
    });


});



/**
 * Renders the page with data.
 */
function renderPage(res, playerScore){
    console.log("2");
    pullScores(function(scores){

        //get just the scores.
        let justnumbers = scores.slice().map(function(v){return v.Score});

        //get unique scores
        let uniqueScores = []
        justnumbers.forEach(function(item, index){
            if(uniqueScores.indexOf(item) == -1){
                uniqueScores.push(item);
            }
        });

        //sort unique scores to determine rank
        uniqueScores = uniqueScores.sort(function(a,b){return b-a});

        //set default values.
        let name = "";
        let score = 0;
        let playerRank = "none";

        if(playerScore != null){
            name = playerScore.Name;
            score = playerScore.Score;
            playerRank = uniqueScores.indexOf(score)+1;
        }



        res.render('leaderboard', {
            title: 'LeaderBoard',
            scores: scores,
            playerName: name,
            playerScore: score,
            playerRank: playerRank
        });
    })
}

/**
 * Pulls the scores from the database and runs the callback.
 * @param callback
 */
function pullScores(callback){
    let scores = [];
    let pullQuery = "SELECT * FROM " + scoreTableName +" ORDER BY SCORE DESC LIMIT 5;"


    db.execute(pullQuery,function(err,results,fields){
        console.log(results);
        if(results == undefined){results = []}

        for(let i = 0; i < results.length; i++){
            let thisID = results[i].ID;
            let thisName = results[i].NAME;
            let thisScore = results[i].SCORE;
            let newScore = new Highscore(thisName,thisScore)
            scores.push(newScore);
        }

        callback(scores)

    })

}

module.exports = router;
