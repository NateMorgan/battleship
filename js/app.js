// ---------------- Constants ----------------------------//
const gridSize = 10
const boardSize = 30

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

class Ship {
  constructor(name, length, place){
    this.name = name
    this.len = length
    this.place = place
  }
}



//----------------- Variables (State) --------------------//
// Phases: 0-Start Screen  1-Setup  2-Battle  3-End of Game

let game = {
  phase: 0,
  player: 1,
  // I might really regret this but I'm using one board to rule them all 
  board: [],
  ships: []


}
let lastShip = 5


// ---------------- Cached Element References ------------//
const btnNext = document.querySelector('#btn-next')
const btnRestart = document.querySelector(`#btn-restart`)
const message = document.querySelector('#message')
const gridContainer = document.querySelector('#grid-container')
const shipContainer = document.querySelector('#ship-container')

// --------------- Event Listeners -----------------------//
btnNext.addEventListener('click', nextPhase)
btnRestart.addEventListener('click', init)
gridContainer.addEventListener('mouseover',boardClick)
gridContainer.addEventListener('mouseout',boardClick)
gridContainer.addEventListener('click',boardClick)
shipContainer.addEventListener('click', changeShip)


//---------------- Functions -----------------------------//
init()

function render(){
  if (game.phase === 0){
    btnNext.hidden = false
    btnRestart.hidden = true
    gridContainer.style.display = "none"
    shipContainer.style.display = "none"
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
  game.board = []
  game.ships = []
  lastShip = 5
  gridContainer.innerHTML = ''
  render()
}

function nextPhase(){
  game.phase += 1
  render()
}

function createBoard(rows,cols){
  shipContainer.style.display = "flex"
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

function boardClick(evt){
  if (evt.target.className === "grid-square"){
    if (game.phase === 1){
      placeShipLogic(evt.target.id,evt.type)
    }
  }
}

function changeShip(evt){
  if (evt.target.tagName === 'IMG'){
    lastShip = parseInt(evt.target.id.at(-1))
  }
}

function placeShipLogic(start, action) {
  
  
  for (let i = 0; i < lastShip; i++){
    let r = start[0]
    let c = parseInt(start[2])
    console.log(c, lastShip, gridSize)
    if (c + lastShip >= gridSize){
      c = gridSize - lastShip
    }
    c += i
    
    if (action === 'click'){
      document.getElementById(`${r}-${c}`).style.backgroundColor = "grey"
      game.board[r][c].playerOneShip = true
      
    } else {
      let newOutline = (action === 'mouseover') ? `${boardSize/gridSize/2}vh solid red` : "1px solid white"
      document.getElementById(`${r}-${c}`).style.border = newOutline
    }
  }
}


