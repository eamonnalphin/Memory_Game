let strings = {}; //the strings file


initialSetup();


/**
 * Does some initial setup on the page
 * like getting strings and pulling the user score.
 */
function initialSetup(){
    $(document).ready(function(){
        console.log("ready");
        $.getJSON("../Resources/Strings.json",function(data){
            strings = data;
            pullUserScoreFromSession();
        });

    })
}




/**
 * Pulls the user's score from session storage and displays it.
 */
function pullUserScoreFromSession(){
        let userScore = getValueFromSessionStorage(strings.scoreKey);
        console.log("User scored: " + userScore + " Points");
        $("#userScore").text(userScore + " Points");
        $("#scoreField").attr("value",userScore);
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