# WhoWantsToBeAMillionaire-Soundboard

This soundboard has all the sounds from the TV game show "Who wants to be a millionaire ?".

This soundboard is forked from the awesome work of [mayurcybercz's Rick Sanchez soundboard](https://github.com/mayurcybercz/RickSanchez-Soundboard "Rick Sanchez soundboard").

This soundboard supports:

* Keyboard inputs, to start each sound with more control
* Keycaps that follow your own physical keyboard layout (AZERTY, QWERTZ, Dvorak…), detected in the browser
  * the answers row uses the first three keys of your bottom letter row: `Z-X-C` on QWERTY, `Y-X-C` on QWERTZ/Swiss, `W-X-C` on AZERTY
* Matching sounds loudness
* Responsive layout
* On desktop, the whole board fits on one screen: one row per section, no scrolling
* A seekbar (entire button) for each sound, to know how many time is remaining
* Pause the current sound when pressing on the same sound
* Pause the previous sound before playing the new sound

## Interface

* Three colour themes, switchable from the header and remembered between visits:
  * **Show** (default) — the deep blue / gold look of the game's on-screen graphics
  * **Dark** — neutral charcoal with the same gold accent
  * **Light** — white panels with navy text
* On touch devices (phones, tablets) the keyboard shortcuts are hidden, since the cards are simply tapped instead

## Fonts

The show's real typefaces (Copperplate Gothic and ITC Conduit) are commercial, so this project uses free, self-hosted lookalikes — no CDN, no external requests:

* [Balthazar](https://fonts.google.com/specimen/Balthazar) for the logo and titles (Copperplate Gothic substitute)
* [Barlow](https://fonts.google.com/specimen/Barlow) for the interface (ITC Conduit substitute)

Both are licensed under the SIL Open Font License; the licence texts are in `fonts/`.
