//client side view updating.
let sessionStorage = window.sessionStorage; //local storage
let normalPoint = 1; //a normal point
let streakBonusMultiplier = 5; //a user gets a multiple of points for maintaining a streak.

let minRows = 5; //the minimum number of rows
let minCols = 5; //the minimum number of columns
let startTiles = 5; //the starting number of tiles
let minTiles = 4; //the minimum number of highlighted tiles.
let strings = {}; //the strings file

initialSetup();


/**
 * Does some initial setup on the page
 * like getting strings and preparing the button.
 */
function initialSetup(){
    $(document).ready(function(){
        console.log("ready");
        $.getJSON("../Resources/Strings.json",function(data){
            strings = data;

            $("#startEndButton").html(strings.startButtonText);
            $("#startEndButton").addClass('playGameBtn')

        })
    })
}


/**
 * Called when the user clicks the play or terminate button
 */
function toggleStartEndButton(){

    if($("#startEndButton").hasClass("playGameBtn")){
        //going from stopped to playing
        $("#startEndButton").removeClass("playGameBtn btn-primary");
        $("#startEndButton").addClass("endGameBtn btn-danger");
        $("#startEndButton").html(strings.endButtonText);
        newGame();
    }else{
        if(confirmTerminate()){
            //going from playing to stopped
            $("#startEndButton").addClass("playGameBtn btn-primary");
            $("#startEndButton").removeClass("endGameBtn btn-danger");
            $("#startEndButton").html(strings.startButtonText);
        }
    }
}


function confirmTerminate(){
    var quit = confirm("Are you sure you want to end the game?");
    if(quit){
        endGame();
        return true;
    }else{
        return false;
    }
}



/**
 * Called when the game ends.
 */
function endGame(){
    console.log("Ending game");
    resetTable();
    window.location.href = 'Summary'
}

/**
 * Start a new game.
 */
function newGame(){
    console.log("new game");
    saveSessionValue(strings.scoreKey,0);
    saveSessionValue(strings.streakKey,0);

    resetTable();

    let numRows = minRows;
    let numCols = minCols;
    let numTiles = startTiles;
    let tilesToRemember = getTileToRemember(numRows,numCols, numTiles);

    buildTable(numRows, numCols, tilesToRemember);

    flashTilesToRemember(tilesToRemember);
}






/**
 * Creates the next level
 * @param oldNumRows the original number of rows
 * @param oldNumCols the original number of columns
 * @param pass true if the user passed the previous level.
 */
function nextLevel(oldNumRows, oldNumCols,pass){
    resetTable();
    updateScoreDisplay();

    let numRows = oldNumRows;
    let numCols = oldNumCols;
    //resize the table
    if(pass){
        //keep it square.
        if(numCols > numRows){
            numRows += 1;
        }else{
            numCols += 1;
        }
    }else {
        if (numCols == minCols && numRows == minRows) {
            //do nothing.
        } else if (numCols > numRows) {
            numCols -= 1;
        } else {
            numRows -= 1;
        }
    }



    let numTiles = Math.floor((numRows * numCols)/minTiles)-2

    let tilesToRemember = getTileToRemember(numRows,numCols, numTiles);

    buildTable(numRows, numCols, tilesToRemember);

    flashTilesToRemember(tilesToRemember);



}





/**
 * Removes the game table from the screen.
 */
function resetTable(){
    $("#gameTable").empty();
}


/**
 * Flashes the tiles to remember.
 * @param tilesToRemember
 */
function flashTilesToRemember(tilesToRemember){
    highlightTiles(tilesToRemember);
    setTimeout(deHighlightTiles,3000,tilesToRemember);
}

/**
 * Highlights the tiles to remember.
 * @param tilesToRemember
 */
function highlightTiles(tilesToRemember){

    tilesToRemember.forEach(function(item,index){
        $("#"+item).addClass("highlightedCell");
    })
}

/**
 * Dehighlights the tiles to remember.
 * @param tilesToRemember
 */
function deHighlightTiles(tilesToRemember){
    rotateTableAndStopAnyAngle(90);
    tilesToRemember.forEach(function(item,index){
        $("#"+item).removeClass("highlightedCell");
    })
}


/**
 * Gets the angle the table is currently at.
 * @return {number} the angle of the table in degrees.
 */
function getAngle(){
    let angleMatrix = $('#gameTable').css('transform');
    if(angleMatrix == 'none'){
        angleMatrix = 'matrix(0,0,0,0)'
    }

    var values = angleMatrix.split('(')[1];
    values = values.split(')')[0];
    values = values.split(',');
    var a = values[0];
    var b = values[1];

    var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));

    if(angle<0){
        angle = angle + 360;
    }

    //console.log('Current Angle = ' + angle + 'deg');

    return angle;
}


/**
 * Offsets the table by the given degrees
 * @param delta the number of degrees to offset the table.
 */
function rotateTableAndStopAnyAngle(delta){

    let currentAngle = getAngle();
    let newAngle = currentAngle + delta;

    //console.log("new angle: " + newAngle);


    $('#gameTable').animate({  borderSpacing: newAngle }, {
        step: function(now,fx) {
            $('#spinNoise')[0].play();
            $(this).css('transform','rotate('+now+'deg)');
        },
        duration:'slow',
        complete: function(){
            if(newAngle == 360){
                console.log("resetting")
                $(this).css('transform','rotate(0deg)')
                $(this).css('border-spacing','0')
            }
        }
    },'linear')


}



/**
 * Will build a table with the given number of rows and columns.
 * @param numRows the number of rows
 * @param numCols the number of columns.
 * @param tilesToRemember the tiles the user has to remember
 */
function buildTable(numRows, numCols, tilesToRemember){
    //create the table parent object.
    let gameTable = $("<table/>").addClass("table table-responsive")

    let chosenTiles = []

    //build the table.
    for(let i = 0; i < numRows; i++){

        let thisRow = $("<tr/>");

        for(let j = 0; j < numCols; j++){

            //create the cell
            let thisCell = $("<td/>")

            //create the cell contents, the tile
            let tile = $("<div/>").addClass("tile mx-auto");
            let cellID = "cell_" + i + j;
            //tile.text(cellID);
            tile.attr('id',cellID);


            //set what happens on clicking
            tile.click(function(){
               //console.log("clicked: " + $(this).text());

               let thisTileID = $(this).attr('id');


               if(tilesToRemember.indexOf(thisTileID)!=-1){
                   //this tile is a chosen tile
                   $(this).addClass("highlightedCell");
               }else{
                   $(this).addClass("wrongTile");
               }

               //no undo. Whatever's clicked gets added.
                if(chosenTiles.indexOf(thisTileID) == -1){
                    chosenTiles.push(thisTileID);
                }
                console.log("chosen tiles: " + chosenTiles);

               if(chosenTiles.length == tilesToRemember.length) {

                    if(checkTiles(chosenTiles,tilesToRemember)){
                        alert(strings.successMessage);
                        incrementScoreAndSave(normalPoint);
                        nextLevel(numRows,numCols,true)
                    }else{
                        alert (strings.failureMessage);
                        decrementScoreAndSave(normalPoint);
                        nextLevel(numRows,numCols,false);
                    }
               }

            });

            //add the tile to the cell
            thisCell.append(tile);

            //add the cell to the row.
            thisRow.append(thisCell)
        }

        gameTable.append(thisRow);

    }

    $("#gameTable").append(gameTable);

}


/**
 * Returns a list of tile ID's to remember
 * @param numRows the number of rows to choose from
 * @param numCols the number of columns to choose from
 * @param numTiles the number of tiles to remember.
 */
function getTileToRemember(numRows, numCols, numTiles){

    let tilesToRemember = [];

    for(let i = 0; i < numTiles; i++){
        let randomRow = getRandomIntegerUpToInclNumber(numRows);
        let randomCol = getRandomIntegerUpToInclNumber(numCols);
        let tileID = "cell_"+randomRow + randomCol;
        if(!tilesToRemember.includes(tileID)){
            //console.log(tileID);
            tilesToRemember.push(tileID);
        }else{
            i--;
        }
    }

    return tilesToRemember;
}

/**
 * Returns a random integer from 0 up to & including the max number.
 * @param max the maximum acceptable number.
 * @return {number}
 */
function getRandomIntegerUpToInclNumber(max){
    return Math.floor(Math.random() * max);
}

/**
 * Checks if the chosen tiles matches the tiles to remember.
 * @param chosenTiles
 * @param tilesToRemember
 * @return {boolean}
 */
function checkTiles(chosenTiles, tilesToRemember){

    let matches = 0;

    if(chosenTiles.length == tilesToRemember.length){
        for(let i = 0; i < tilesToRemember.length; i++){
            if(chosenTiles.includes(tilesToRemember[i])){
                matches += 1;
             }
        }
    }

    return matches == tilesToRemember.length;

}


/********
 * Score handling
 ********/

/**
 * Increments the score by the given value and saves it.
 * @param number
 */
function incrementScoreAndSave(number){
    let score = parseInt(getValueFromSessionStorage(strings.scoreKey));
    let streak = parseInt(getValueFromSessionStorage(strings.streakKey));
    streak+=1;
    if(streak>1){
        number += (streak * streakBonusMultiplier);
    }
    score += number;
    saveSessionValue(strings.scoreKey,score);
    saveSessionValue(strings.streakKey,streak);
}

/**
 * Decrement the score by the given value and save it
 * @param number
 */
function decrementScoreAndSave(number){
    let score = parseInt(getValueFromSessionStorage(strings.scoreKey));
    let streak = 0;
    score -= number;

    if(score<0){
        score=0;
    }

    saveSessionValue(strings.streakKey,streak);
    saveSessionValue(strings.scoreKey,score);

    if(score<=0){
        endGame();
    }
}


/**
 * Saves the item with the given name to session storage.
 * @param name the name of the value
 * @param value the value itself.
 */
function saveSessionValue(name, value){
    try{
        sessionStorage.setItem(name,value);
    }catch(err){
        console.log("error with session storage: " + err);
    }

}


/**
 * Retrieves a value from session storage.
 * @param name the name of the value to retrieve.
 */
function getValueFromSessionStorage(name){
    let item = "";

    try{
        item = sessionStorage.getItem(name);
    }catch(err){
        console.log("error retrieving data" + err);
    }

    return item;
}


/**
 * Updates the score display on the game screen.
 */
function updateScoreDisplay(){
    let score = getValueFromSessionStorage(strings.scoreKey);
    console.log("new score: " + score);
    $("#scoreDiv").text(score)

}

