// MMO Journal dark theme initialization
document.documentElement.classList.add('mmoj-dark');

// Google Analytics initialization
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-26211653-3');

window.onerror = function(err, uri, line) {
    gtag('event', 'exception', {'description': uri + ':' + line + ': ' + err});
    return false;
};

// Dark theme loading 
/*
* localStorage will only store strings
* This means that if it has the value 'false',
* It will be truey and incorrectly cause the
* dark theme to load.
*/
if (localStorage.getItem('darkTheme') !== 'true') {
    document.getElementById('dark-theme-styles').disabled = true;
}
