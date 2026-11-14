/* Theme switcher: TV show / dark / light, persisted in localStorage. */
(function () {
	'use strict';

	var STORAGE_KEY = 'wwtbam-theme';
	var DEFAULT_THEME = 'show';
	var THEMES = ['show', 'dark', 'light'];
	var THEME_COLORS = {
		show: '#05062a',
		dark: '#08090c',
		light: '#eef1f8'
	};

	var root = document.documentElement;
	var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-theme-value]'));
	var meta = document.querySelector('meta[name="theme-color"]');

	if (!buttons.length) return;

	function isTheme(value) {
		return THEMES.indexOf(value) !== -1;
	}

	function currentTheme() {
		var theme = root.getAttribute('data-theme');
		return isTheme(theme) ? theme : DEFAULT_THEME;
	}

	function applyTheme(theme, persist) {
		if (!isTheme(theme)) theme = DEFAULT_THEME;

		root.setAttribute('data-theme', theme);

		buttons.forEach(function (button) {
			var isActive = button.getAttribute('data-theme-value') === theme;
			button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
		});

		if (meta) meta.setAttribute('content', THEME_COLORS[theme]);

		if (persist) {
			try {
				localStorage.setItem(STORAGE_KEY, theme);
			} catch (e) {
				/* storage unavailable: theme still applies for this page view */
			}
		}
	}

	buttons.forEach(function (button) {
		button.addEventListener('click', function () {
			applyTheme(button.getAttribute('data-theme-value'), true);
		});
	});

	// Keep tabs in sync when another one changes the theme.
	window.addEventListener('storage', function (event) {
		if (event.key === STORAGE_KEY && isTheme(event.newValue)) {
			applyTheme(event.newValue, false);
		}
	});

	applyTheme(currentTheme(), false);
})();
