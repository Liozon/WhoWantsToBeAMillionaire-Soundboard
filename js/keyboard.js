/* Keyboard-layout detection.
   The soundboard is triggered by physical key position (event.code), so the
   letters printed on the cards must follow the user's actual keyboard layout
   (AZERTY, QWERTZ, Dvorak, …). The answers row uses the first three keys of
   the bottom letter row, labelled with that layout's letters. */
(function () {
	'use strict';

	/* US QWERTY labels, used until the real layout is known. */
	var FALLBACK = {
		Digit1: '1', Digit2: '2', Digit3: '3', Digit4: '4', Digit5: '5',
		KeyQ: 'Q', KeyW: 'W', KeyE: 'E', KeyR: 'R',
		KeyA: 'A', KeyS: 'S', KeyD: 'D', KeyF: 'F', KeyG: 'G', KeyH: 'H', KeyJ: 'J', KeyK: 'K',
		KeyZ: 'Z', KeyX: 'X', KeyC: 'C'
	};

	var cards = Array.prototype.slice.call(document.querySelectorAll('.key[data-code]'));
	if (!cards.length) return;

	var labels = {};
	var code;
	for (code in FALLBACK) {
		if (Object.prototype.hasOwnProperty.call(FALLBACK, code)) labels[code] = FALLBACK[code];
	}

	function labelFor(keyCode, value) {
		/* The number row always prints 1–5, even on layouts where the unshifted
		   character is something else (AZERTY: &é"'(-). */
		if (keyCode.indexOf('Digit') === 0) return keyCode.slice(-1);
		if (!value) return '';
		return String(value).toUpperCase();
	}

	function render() {
		cards.forEach(function (card) {
			var keyCode = card.getAttribute('data-code');
			var keycap = card.querySelector('.btnTitle');
			var label = labelFor(keyCode, labels[keyCode]);

			if (keycap) keycap.textContent = label;
			if (label) card.setAttribute('title', 'Shortcut: ' + label);
		});
	}

	/* Chromium exposes the real key layout (secure contexts only). */
	function detectLayout() {
		if (!navigator.keyboard || typeof navigator.keyboard.getLayoutMap !== 'function') {
			return;
		}

		navigator.keyboard.getLayoutMap().then(function (layoutMap) {
			cards.forEach(function (card) {
				var keyCode = card.getAttribute('data-code');
				var value = layoutMap.get(keyCode);
				if (value) labels[keyCode] = value;
			});
			render();
		}).catch(function () {
			/* keep the fallback labels */
		});
	}

	/* Browsers without the Keyboard API (Firefox, Safari): learn from the keys
	   the user actually presses and update the matching card. */
	window.addEventListener('keydown', function (event) {
		var keyCode = event.code;
		if (!keyCode || !Object.prototype.hasOwnProperty.call(labels, keyCode)) return;
		if (keyCode.indexOf('Digit') === 0) return;
		if (!event.key || event.key.length !== 1 || !/[a-z]/i.test(event.key)) return;

		labels[keyCode] = event.key;
		render();
	});

	render();
	detectLayout();
})();
