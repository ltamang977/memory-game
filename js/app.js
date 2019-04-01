/*
 * Create a list that holds all of your cards
 */
const cards = ['fa-diamond', 'fa-diamond',
              'fa-paper-plane-o', 'fa-paper-plane-o',
              'fa-anchor', 'fa-anchor',
              'fa-bolt', 'fa-bolt',
              'fa-cube', 'fa-cube',
              'fa-leaf', 'fa-leaf',
              'fa-bicycle', 'fa-bicycle',
              'fa-bomb', 'fa-bomb'];

let openCards = [];
let moveCounter=0;
let hasStarted = false;
let matchCount = 0;
let noMatchCount = 0;
let gameInterval;
let timeTaken;

const stars = document.querySelector('#stars');
let displayTime = document.querySelector('.displayTime');

let modal = document.getElementById('winModal');
modal.style.display = "none";
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

const closeBtn = document.querySelector('.closeBtn');
closeBtn.addEventListener('click', closeModal);

const reset = document.querySelector('.restart');
reset.addEventListener('click', resetHandler);

const restartBtn = document.querySelector('#restartBtn');
restartBtn.addEventListener('click', closeModal);

display();
configure();


function configure(){
  const cardList = document.querySelectorAll('.card');
  cardList.forEach(card => card.addEventListener('click', clickHandler));

  while(stars.hasChildNodes()){
      stars.removeChild(stars.childNodes[0]);
  }

  for(let i=0; i<3; i++){
      stars.appendChild(createStar());
  }

}

function createStar(){
  let li = document.createElement("li");
  li.style.listStyle = 'none';
  li.style.display = 'inline';

  let icon = document.createElement("i");
  icon.className = 'fa fa-star';
  li.appendChild(icon);
  return li;
}

function resetHandler(){
    openCards = [];
    moveCounter = 0;
    hasStarted = false;
    matchCount = 0;
    noMatchCount = 0;
    display();
    configure();
    clearInterval(gameInterval);
    displayTime.innerHTML = "00:00";
}

function display(){
  shuffle(cards);
  let cardHTML = cards.map(function(card){
    return formatCardHTML(card);
  });

  let deck = document.querySelector('.deck');
  deck.innerHTML = cardHTML.join('');

  let moves = document.querySelector('.movesCount');
  moves.innerText = moveCounter;
}

function formatCardHTML(card){
  return "<li class=\"card\" data-card=\""+card+"\"><i class=\"fa "+card+"\"></i></li>";
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function timer() {
    let minutes = 0;
    let seconds = 0;
    gameInterval = setInterval(function () {
        seconds = parseInt(seconds, 10) + 1;
        minutes = parseInt(minutes, 10);
        if (seconds >= 60) {
            minutes += 1;
            seconds = 0;
        }
        seconds = seconds < 10 ? "0" + seconds : seconds;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        displayTime.innerHTML = minutes + ":" + seconds;
        timeTaken = displayTime.innerText;
    }, 1000);
}

function clickHandler(){
  if(!hasStarted){
    hasStarted=true;
    timer();
  }
  if(!this.classList.contains('match')
     && !(this.classList.contains('open') && this.classList.contains('show'))
      ){

      openCard(this);
      updateMoves();

      if(openCards.length>=2){
          checkForMatch();
      }
  }
}

function openCard(card){
    openCards.push(card);
    card.classList.add('open','show');
}

function updateMoves(){
    moveCounter++;
    let moves = document.querySelector('.movesCount');
    moves.innerText = moveCounter;
}

function checkForMatch(){
  let isMatch = openCards[0].dataset.card === openCards[1].dataset.card;
  isMatch ? updateMatch() : closeCards();

}

function updateMatch(){
  openCards[0].classList.add('match');
  openCards[1].classList.add('match');

  openCards = [];
  matchCount++;
  if(stars.childElementCount<5 && matchCount===cards.length/4){
     stars.appendChild(createStar());

  }

  if(matchCount===cards.length/2){
    openModal();
  }
}

function closeCards(){
  noMatchCount++;
  setTimeout(function(){
      openCards.forEach(function(c){
          c.classList.remove('open', 'show');
      });
      updateStars();
      openCards = [];
  }, 500);
}

function updateStars(){
    if(noMatchCount === 7) {
      if(stars.hasChildNodes()) {
        stars.removeChild(stars.childNodes[0]);
      }

    } else if (noMatchCount === 12) {
      if (stars.hasChildNodes()) {
        stars.removeChild(stars.childNodes[0]);

      }

    } else if (noMatchCount === 20) {
      if (stars.hasChildNodes()) {
        stars.removeChild(stars.childNodes[0]);

      }
    }
}

function openModal(){
    modal.style.display="block";
    document.querySelector(".time-taken").innerText = timeTaken;
    document.querySelector(".star-ratings").innerText = stars.childElementCount;
    clearInterval(gameInterval);
}

function closeModal(){
    modal.style.display="none";
    resetHandler();
}
