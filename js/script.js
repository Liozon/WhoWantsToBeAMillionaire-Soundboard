var currentPlayer;
function playSound(e) {

    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const thissound = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
    //console.log(key);

    if (currentPlayer && currentPlayer != thissound) {
        currentPlayer.pause();
        currentPlayer.currentTime = 0;
    }

    if (thissound.paused) {
        thissound.play();
    } else {
        thissound.pause();
        thissound.currentTime = 0;
        currentPlayer = thissound;
    }

    currentPlayer = thissound;
    if (!audio) return; //stop func from running 

    //when played a key in succession, it will call play again even if the previous play is running
    //i.e it rewinds to the start

    key.classList.add('playing');

}


function removeTransition(e) {
    if (e.propertyName == 'transform') return; //skip if it is not a transform

    //this is always the object upon which fn is called
    this.classList.remove('playing');
}


const keys = document.querySelectorAll('.key');
//arrow fn which works as this keyword,i.e a sinle element of array
keys.forEach(key => key.addEventListener('transitionend', removeTransition));

// Trigger sound on click
keys.forEach(key => key.addEventListener('click', function (event) {
    var element = event.target.getAttribute('data-key')
    window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: element, which: element }));
}));

window.addEventListener('keydown', playSound);

//when you have an array, you cant listen on every single element
//so you need to loop through each element and listen explicitly