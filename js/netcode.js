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

var boardData = firebase.database().ref('chessData');
var activityData = firebase.database().ref('activity');

// Notifications
// https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
function askNotificationPermission() {
    // function to actually ask the permissions
    function handlePermission(permission) {
        // Whatever the user answers, we make sure Chrome stores the information
        if (!('permission' in Notification)) {
            Notification.permission = permission;
        }

        // set the button to shown or hidden, depending on what the user answers
        if (Notification.permission === 'denied' || Notification.permission === 'default') {
            console.log('Notifications Blocked');
        } else {
            console.log('Notifications Allowed');
        }
    }

    // Let's check if the browser supports notifications
    if (!"Notification" in window) {
        console.log("This browser does not support notifications.");
    } else {
        if (checkNotificationPromise()) {
            Notification.requestPermission()
                .then((permission) => {
                    handlePermission(permission);
                })
        } else {
            Notification.requestPermission(function (permission) {
                handlePermission(permission);
            });
        }
    }
}
function checkNotificationPromise() {
    try {
      Notification.requestPermission().then();
    } catch(e) {
      return false;
    }

    return true;
  }

askNotificationPermission();