// ---------------- Constants ----------------------------//



//----------------- Variables (State) --------------------//
// Phases: 0-Start Screen  1-Setup  2-Battle  3-End of Game

let game = {
  phase:0,
  player:1,
}



// ---------------- Cached Element References ------------//
const btnNext = document.querySelector('#btn-next')
const btnRestart = document.querySelector(`#btn-restart`)
const message = document.querySelector('#message')

// --------------- Event Listeners -----------------------//
btnNext.addEventListener('click', nextPhase)
btnRestart.addEventListener('click', init)


//---------------- Functions -----------------------------//
init()

function render(){
  if (game.phase === 0){
    btnNext.hidden = false
    btnRestart.hidden = true
    message.textContent = "Start a two player game"
  } else if (game.phase === 1){
    btnNext.hidden = true
    btnRestart.hidden = false
    message.textContent = `Player ${game.player} place your ships`
  }
}

function init(){
  game.phase = 0
  game.player = 1
  render()
}

function nextPhase(){
  game.phase += 1
  render()
}



