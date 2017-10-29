/*
 * notify.js - by Pratik Desai {desai@pratyk.com}
 * Enables Browser Desktop Notifications + Audio Notifications using <audio> tag
 *
 */

// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
    console.log(Notification.permission);
    if (Notification.permission !== "granted") Notification.requestPermission();
});

// could be deprecated
function permit() {
    if (Notification.permission !== "granted") Notification.requestPermission();

}

// function to trigger notifications
function desktopAlert() {
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chrome, Firefox or Safari.');
        return;
    }
    if (Notification.permission !== "granted") 
        Notification.requestPermission();
    else {
        var notification = new Notification('TomatoTimer', {
            icon: 'http://tomato-timer.com/tom.gif',
            body: "Your time is up!!",
        });
        setTimeout(notification.close.bind(notification), 6000);
        notification.onclick = function () {
            window.focus();
        };
    }
}

// control audio notifications
function buzzer() {
    // TODO: hardcoded for testing - remove once settings modal is implemented
    // var alertoption = localStorage.getItem("alertoption");
    var alertoption = 'ding';
    // var volumeoption = localStorage.getItem("volumeoption");
    var volumeoption = '0.5';
    
    var soundsPath = '/public/sounds/';

    var choice = new Array();
    choice[0] = soundsPath + alertoption + '.mp3';
    choice[1] = soundsPath + alertoption + '.ogg';
    choice[2] = soundsPath + alertoption + '.wav';

    var alarm = new Howl({
        urls: choice,
        volume: volumeoption
    });
    alarm.play();
    desktopAlert();
}