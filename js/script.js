/* Who Wants to Be a Millionaire — soundboard logic (no external dependencies). */
(function () {
	'use strict';

	/* Physical key codes, so the rows mirror the keyboard rows on QWERTY,
	   QWERTZ, AZERTY, Dvorak… The answers row uses the first three keys of the
	   bottom letter row (Z X C on QWERTY, Y X C on QWERTZ, W X C on AZERTY). */
	var keyCodes = [
		'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5',
		'KeyQ', 'KeyW', 'KeyE', 'KeyR',
		'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK',
		'KeyZ', 'KeyX', 'KeyC'
	];

	var audios = Array.prototype.slice.call(document.querySelectorAll('audio[data-code]'));
	var keys = Array.prototype.slice.call(document.querySelectorAll('.key[data-code]'));
	var currentPlayer = null;
	var currentKey = null;

	function audioForKey(keyCode) {
		for (var i = 0; i < audios.length; i++) {
			if (audios[i].getAttribute('data-code') === keyCode) {
				return audios[i];
			}
		}
		return null;
	}

	function keyForAudio(audio) {
		return document.querySelector('.key[data-code="' + audio.getAttribute('data-code') + '"]');
	}

	function seekbarFor(keyCode) {
		return document.getElementById('seekbar-' + keyCode);
	}

	function setPlaying(key, isPlaying) {
		if (!key) return;
		key.classList.toggle('playing', isPlaying);
	}

	function stopAudio(audio) {
		audio.pause();
		audio.currentTime = 0;
		var bar = seekbarFor(audio.getAttribute('data-code'));
		if (bar) bar.value = 0;
	}

	/**
	 * Play / pause / restart a sound.
	 * Starting a new sound stops the previous one.
	 */
	function triggerSound(keyCode) {
		var audio = audioForKey(keyCode);
		if (!audio) return;

		var key = keyForAudio(audio);

		if (currentPlayer && currentPlayer !== audio) {
			stopAudio(currentPlayer);
			setPlaying(currentKey, false);
		}

		if (audio.paused) {
			var playback = audio.play();
			if (playback && typeof playback.catch === 'function') {
				// Autoplay policy or missing file: don't leave the card in the "playing" state.
				playback.catch(function () {
					setPlaying(key, false);
				});
			}
			setPlaying(key, true);
		} else {
			// Pressing the same card again pauses and rewinds it.
			stopAudio(audio);
			setPlaying(key, false);
		}

		currentPlayer = audio;
		currentKey = key;
	}

	audios.forEach(function (audio) {
		var bar = seekbarFor(audio.getAttribute('data-code'));

		audio.addEventListener('timeupdate', function () {
			if (!bar) return;
			bar.value = audio.duration ? audio.currentTime / audio.duration : 0;
		});

		/* A new playback always starts from 0: reveal the bar again. */
		audio.addEventListener('play', function () {
			if (bar) bar.classList.remove('is-fading');
		});

		audio.addEventListener('ended', function () {
			setPlaying(keyForAudio(audio), false);

			if (currentPlayer === audio) {
				currentPlayer = null;
				currentKey = null;
			}

			if (!bar) return;

			/* Keep the bar at its final value for a moment (so it stays visible
			   until the very end of the sound, even with output latency), then
			   fade it out. The value snaps back to 0 only while it is hidden;
			   revealing it earlier showed the fill shrinking back to empty. */
			setTimeout(function () {
				if (!audio.paused) return; // restarted during the hold

				bar.classList.add('is-fading');

				setTimeout(function () {
					/* Restarted during the fade: the play handler already
					   revealed the bar, so keep the fresh progress. */
					if (!audio.paused) return;

					audio.currentTime = 0;
					bar.value = 0;
				}, 300);
			}, 350);
		});
	});

	keys.forEach(function (key) {
		key.addEventListener('click', function () {
			triggerSound(key.getAttribute('data-code'));
		});
	});

	window.addEventListener('keydown', function (event) {
		if (event.repeat) return;
		if (event.ctrlKey || event.metaKey || event.altKey) return;
		if (keyCodes.indexOf(event.code) === -1) return;

		triggerSound(event.code);
	});
})();
