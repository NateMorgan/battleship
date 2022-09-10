// ---------- Classes --------//
class Coordinates {
  constructor(row,col){
    this.pos = [row,col]
    this.playerOneShip = ``
    this.playerOneTargeted = false
    this.playerTwoShip = ``
    this.playerTwoTargeted = false
  }

  fire(){
      game.turn > 0 ? this.playerOneTargeted = true : this.playerTwoTargeted = true
  }
    
  placeShip(i){
    game.turn > 0 ? this.playerOneShip = `${lastShip[0]+i}` : this.playerTwoShip = `${lastShip[0]+i}`
  }
}


// ---------------- Constants ----------------------------//
const gridSize = 10
const boardSize = 30
const shipInfo = [[`Carrier`, 5, 1],[`Battleship`, 4, 2],[`Cruiser`, 3, 3],[`Submarine`, 3, 4],[`Destroyer`,2, 0]]


//----------------- Variables (State) --------------------//

// Phases: 0-Start Screen  1-Setup  2-Battle  3-End of Game
let game = {
  phase: 0,
  turn: 1,
  // I might really regret this but I'm using one board to rule them all 
  board: [],
}

let lastShip = shipInfo[0]


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
    message.textContent = `Player ${game.turn} place your ${lastShip[0]}`
    renderBoard(gridSize,gridSize)
  }
}

function init(){
  game.phase = 0
  game.turn = 1
  game.board = []
  lastShip = shipInfo[0]
  gridContainer.innerHTML = ''
  for (let row = 0; row < gridSize; row++){
    game.board.push([])
    for (let col = 0; col < gridSize; col++){
      game.board[row].push(new Coordinates(row,col))
    }
  }
  render()
}

function nextPhase(){
  game.phase += 1
  render()
}

function renderBoard(rows,cols){
  gridContainer.innerHTML = ''
  shipContainer.style.display = "flex"
  gridContainer.style.display = "grid"
  gridContainer.style.gridTemplateRows = `repeat(${rows}, ${boardSize/rows}vh)`
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${boardSize/cols}vh)`

  for (let row = 0; row < rows; row++){
    for (let col = 0; col < cols; col++){
      let newGridSquare = document.createElement('div')
      newGridSquare.setAttribute("class","grid-square")
      newGridSquare.setAttribute("id",`${row}-${col}`)
      if ((game.turn > 0 && game.board[row][col].playerOneShip) ||(game.turn < 0 && game.board[row][col].playerTwoShip)){
        newGridSquare.setAttribute("class","ship-here")
      }
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
    lastShip = shipInfo[parseInt(evt.target.id.at(-1))]
    for (row of game.board){
      for (coor of row){
        if (coor.playerOneShip.slice(0,-1) === lastShip[0]){
          coor.playerOneShip = ''
        }
      }
    }
    render()
  }
}

function placeShipLogic(start, action) {
  for (let i = 0; i < lastShip[1]; i++){
    let r = start[0]
    let c = parseInt(start[2])
    if (c + lastShip[1] >= gridSize){
      c = gridSize - lastShip[1]
    }
    c += i
    if (action === 'click'){
      game.board[r][c].placeShip(i)
    } else {
      let newOutline = (action === 'mouseover') ? `${boardSize/gridSize/2}vh solid orange` : "1px solid white"
      document.getElementById(`${r}-${c}`).style.border = newOutline
    }
  }
  if (action === 'click'){
    lastShip = shipInfo[lastShip[2]]
    render()
  }
}
