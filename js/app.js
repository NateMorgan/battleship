// ---------------- Constants ----------------------------//
const gridSize = 10
const boardSize = 50
class Coordinates {
  constructor(row,col){
    this.pos = [row,col]
    this.playerOneShip = false
    this.playerOneTargeted = false
    this.playerTwoShip = false
    this.playerTwoTargeted = false
  }

  fire(){
    player > 0 ? playerOneTargeted = true : playerTwoTargeted = true
  }

  placeShip(){
    player > 0 ? playerOneShip = true : playerTwoShip = true
  }
}

//----------------- Variables (State) --------------------//
// Phases: 0-Start Screen  1-Setup  2-Battle  3-End of Game

let game = {
  phase:0,
  player:1,
  // I might really regret this but I'm using one board to rule them all 
  board: [],

}



// ---------------- Cached Element References ------------//
const btnNext = document.querySelector('#btn-next')
const btnRestart = document.querySelector(`#btn-restart`)
const message = document.querySelector('#message')
const gridContainer = document.querySelector('#grid-container')

// --------------- Event Listeners -----------------------//
btnNext.addEventListener('click', nextPhase)
btnRestart.addEventListener('click', init)
gridContainer.addEventListener('mouseover',highlightSquare)
gridContainer.addEventListener('mouseout',highlightSquare)
gridContainer.addEventListener('click',squareSelect)



//---------------- Functions -----------------------------//
init()

function render(){
  if (game.phase === 0){
    btnNext.hidden = false
    btnRestart.hidden = true
    gridContainer.style.display = "none"
    message.textContent = "Start a two player game"
  } else if (game.phase === 1){
    btnNext.hidden = true
    btnRestart.hidden = false
    message.textContent = `Player ${game.player} place your ships`
    createBoard(gridSize,gridSize)
  }
}

function init(){
  game.phase = 0
  game.player = 1
  gridContainer.innerHTML = ''
  render()
}

function nextPhase(){
  game.phase += 1
  render()
}

function createBoard(rows,cols){
  gridContainer.style.display = "grid"
  gridContainer.style.gridTemplateRows = `repeat(${rows}, ${boardSize/rows}vh)`
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${boardSize/cols}vh)`

  for (let row = 0; row < rows; row++){
    game.board.push([])
    for (let col = 0; col < cols; col++){
      game.board[row].push(new Coordinates(row,col))
      let newGridSquare = document.createElement('div')
      newGridSquare.setAttribute("class","grid-square")
      newGridSquare.setAttribute("id",`${row}-${col}`)
      gridContainer.appendChild(newGridSquare)
    }
  }
  
}

function squareSelect(evt){
  if (evt.target.className === "grid-square"){
    if (game.phase === 1){ 
      evt.target.style.backgroundColor = "grey"
      let row = evt.target.id[0]
      let col = evt.target.id.at(-1)
      game.board[row][col].playerOneShip = true
      // console.log(game.board[row][col])
    }
  }
}

function highlightSquare(evt){
  if (evt.target.className === "grid-square"){
    if (evt.type === 'mouseover'){
      evt.target.style.border = "10px solid red"
  
    } else {
      evt.target.style.border = "1px solid white"
    }
  }
}




