function minutesSecondsFilter() {
    'ngInject';

    return (seconds) => {        
        // console.log(seconds);
        var min = Math.floor(seconds / 60);
        var secs = seconds - (min * 60);

        return ('0' + min).slice(-2) + ':' + ('0' + secs).slice(-2);     
    }
}

export default minutesSecondsFilter;
