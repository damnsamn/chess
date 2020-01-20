// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyApPkggzWG7E7zErkItwf8CpvFUKgcYwuQ",
    authDomain: "chess-6ca3d.firebaseapp.com",
    databaseURL: "https://chess-6ca3d.firebaseio.com",
    projectId: "chess-6ca3d",
    storageBucket: "chess-6ca3d.appspot.com",
    messagingSenderId: "569773641961",
    appId: "1:569773641961:web:f4fcb9e46eeeed6fda6078"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var gameData;
var boardData = firebase.database().ref('boardData');
var activityData = firebase.database().ref('activity');

function newGame(password) {
    // gameData = firebase.database().ref()

    let allGames = [];

    firebase.database().ref().once('value',
        data => {

            function incrementGame(array, i) {
                if (array.includes("game" + i)) {
                    incrementGame(array, i + 1)
                } else {
                    gameData = firebase.database().ref("game" + i);
                    boardData = firebase.database().ref(`${gameData.key}/boardData`);
                    activityData = firebase.database().ref(`${gameData.key}/activity`);
                }
            }

            if (data.val())
                allGames = Object.keys(data.val());
            console.log(allGames);
            let i = 1;
            incrementGame(allGames, i);

            console.log(gameData.key);

        },
        err => console.log(err)
    );
}