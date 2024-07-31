//
//    The Dark Mode System
//

// helper functions to toggle dark mode
function enableDarkMode() {
	document.body.classList.add('dark-mode');
	localStorage.setItem('theme', 'dark');
}
function disableDarkMode() {
	document.body.classList.remove('dark-mode');
	localStorage.setItem('theme', 'light');
}

// determines a new users dark mode preferences
function detectColorScheme() {
	// default to the light theme
	let theme = 'light';

	// check localStorage for a saved 'theme' variable. if it's there, the user has visited before, so apply the necessary theme choices
	if (localStorage.getItem('theme')) {
		theme = localStorage.getItem('theme');
	}
	// if it's not there, check to see if the user has applied dark mode preferences themselves in the browser
	else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		theme = 'dark';
	}

	// if there is no preference set, the default of light will be used. apply accordingly
	theme === 'dark' ? enableDarkMode() : disableDarkMode();
}

// run on page load
detectColorScheme();

// add event listener to the dark mode button toggle
document.getElementById('dark-mode-toggle').addEventListener('click', () => {
	// on click, check localStorage for the dark mode value, use to apply the opposite of what's saved
	localStorage.getItem('theme') === 'light' ? enableDarkMode() : disableDarkMode();
});


const faqItems = Array.from(document.querySelectorAll('.cs-faq-item'));
        for (const item of faqItems) {
            const onClick = () => {
            item.classList.toggle('active')
        }
        item.addEventListener('click', onClick)
        }
		function updateClock() {
			const gmtTime = new Date().toUTCString(); ('nl-NL', {timeZone: 'America/Edmonton'});
			const cetTime = new Date().toLocaleString('nl-NL', {timeZone: 'Europe/Berlin'});
			const estTime = new Date().toLocaleString('nl-NL', {timeZone: 'America/New_York'});
		
			document.getElementById('gmt').innerHTML = gmtTime;
			document.getElementById('cet').innerHTML = cetTime;
			document.getElementById('est').innerHTML = estTime;
		}
		
		setInterval(updateClock, 1000);    
		
		