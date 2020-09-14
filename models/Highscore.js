let db = require('../util/database');

/**
 * Model for the Highscore table.
 */
class Highscore {

    constructor(Name,Score){
        this._Name = Name;
        this._Score = Score;
    }

    get ID(){
        return this._ID;
    }

    set ID(newID){
        this._ID = newID;
    }

    //Get the player name
    get Name(){
        return this._Name;
    }

    //set the player name
    set Name(newName){
        this._Name = newName
    }

    //get the player score
    get Score(){
        return this._Score;
    }

    //set the player score.
    set Score(newScore){
        this._Score = newScore;
    }

    /**
     * Insert the data from this object into the DB.
     * @param successCallback called on successful insertion
     * @param failureCallback called on failed insertion.
     */
    insertToDB(callBack){
        let savename = this.Name.replace("'","''"); //remove apostraphes from the names.
        let insertQuery = "INSERT INTO HIGHSCORES(NAME,SCORE) VALUES('"+savename+"', "+this.Score+")"

        db.execute(insertQuery,function(err,results,fields){
            if(results != undefined){
                console.log("Data Inserted.");
                console.log("1");
                this._ID = results.insertId;
                callBack(true);
            }else{
                console.log("error inserting data: " + err);
                callBack(false);
            }

        });
    }

    toString(){
        return "{"+this._Name + ", " + this._Score+"}";
    }

}

module.exports = Highscore;