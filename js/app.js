// ---------- Classes --------//
class Coordinates {
  constructor(row,col){
    this.pos = [row,col]
    this.playerOneShip = ``
    this.playerOneFired = false
    this.playerTwoShip = ``
    this.playerTwoFired = false
    this.targeted = false
  }

  fire(){
      game.turn > 0 ? this.playerOneFired = true : this.playerTwoFired = true
  }
    
  placeShip(i){
    game.turn > 0 ? this.playerOneShip = `${lastShip[0]+i}` : this.playerTwoShip = `${lastShip[0]+i}`
  }
}


// ---------------- Constants ----------------------------//
const gridSize = 10
const boardSize = 30
const shipInfo = [[`Carrier`, 5, 1],[`Battleship`, 4, 2],[`Cruiser`, 3, 3],[`Submarine`, 3, 4],[`Destroyer`,2, 5],["Confirm Placement",0,0]]


//----------------- Variables (State) --------------------//

// Phases: 0-Start Screen  1-Setup  2-Battle  3-End of Game
let game = {
  phase: 0,
  turn: 1,
  // I might really regret this but I'm using one board to rule them all 
  board: [],
  winner: null
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
    message.textContent = `Player ${game.turn >0 ? 1 : 2} place your ${lastShip[0]}`
    if (lastShip[2] === 0){
      message.textContent= lastShip[0]
      btnNext.textContent = 'Submit boat placement'
      btnNext.hidden = false
    }
    renderBoard(gridSize,gridSize)
  } else if (game.phase === 2){
    message.textContent = `Player ${game.turn >0 ? 1 : 2} pick a square to fire upon`
    btnNext.hidden = true
    renderBoard(gridSize,gridSize)
  } else if (game.phase === 3){
    message.textContent = `Congrats Player ${game.winner >0 ? 1 : 2} won!`
    btnNext.hidden = true
    gridContainer.style.display = "none"
    shipContainer.style.display = "none"
  }
}

function init(){
  game.phase = 0
  game.turn = 1
  game.board = []
  game.winner = false
  btnNext.textContent = "Start Game"
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
  if (game.phase === 0 ){
    game.phase += 1
  } else if (game.phase === 1){
    if (game.turn === -1){
      game.phase += 1
    }
    game.turn *= -1
    lastShip = shipInfo[0]
  } else if (game.phase === 2){
    fireOnTarget()
    if (checkWin()){
      game.phase += 1
    }
    game.turn *= -1
  }
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
      if (game.phase === 1){
        if ((game.turn > 0 && game.board[row][col].playerOneShip) ||(game.turn < 0 && game.board[row][col].playerTwoShip)){
          newGridSquare.setAttribute("class","ship-here")
        }
      } else if (game.phase === 2){
        if (game.board[row][col].targeted){
          newGridSquare.setAttribute("class","target-here")
          btnNext.textContent = "Fire"
          btnNext.hidden = false
        }
        hitOrMiss(newGridSquare,row,col)
      }
      gridContainer.appendChild(newGridSquare)
    }
  }
}

function boardClick(evt){
  if (evt.target.className === "grid-square"){
    if (game.phase === 1){
      placeShipLogic(evt.target.id,evt.type)
    } else if (game.phase == 2){
      targetSquareLogic(evt)
    }
  }
}

function changeShip(evt){
  if (evt === undefined) {
    lastShip = shipInfo[lastShip[2]]
    if (lastShip === "Restart Placement?"){
      return
    }
  } else if (evt.target.tagName === 'IMG'){
    lastShip = shipInfo[parseInt(evt.target.id.at(-1))]
  }

  for (row of game.board){
    for (coor of row){
      if (coor.playerOneShip.slice(0,-1) === lastShip[0]){
        coor.playerOneShip = ''
      }
    }
  }
  render()
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
    changeShip()
    render()
  }
}

function targetSquareLogic(evt){
  if (evt.type !== 'click') {
    let newOutline = (evt.type === 'mouseover') ? `${boardSize/gridSize/2}vh solid red` : "1px solid white"
    evt.target.style.border = newOutline
  } else {
    let r = evt.target.id[0]
    let c = parseInt(evt.target.id[2])
    clearTargeted()
    game.board[r][c].targeted = true
    render()
  }
}

function clearTargeted(){
  for (row of game.board){
    for (el of row){
      el.targeted = false
    }
  }
}

function hitOrMiss(grid,row,col){
  coor = game.board[row][col]
  if (game.turn > 0){
    if (coor.playerOneFired){
      if (coor.playerTwoShip){
        grid.setAttribute("class","hit")
      } else {
        grid.setAttribute("class", "miss")
      }
    }
  } else {
    if (coor.playerTwoFired){
      if (coor.playerOneShip){
        grid.setAttribute("class","hit")
      } else {
        grid.setAttribute("class", "miss")
      }
    }
  }
}

function checkWin(){
  console.log("check win")
  for (row of game.board){
    for (el of row){
      if (game.turn > 0){
        if (el.playerTwoShip && !el.playerOneFired){
          return false
        }
      } else {
        if (el.playerOneShip && !el.playerTwoFired){
          return false
        }
      }
    }
  }
  game.winner = game.turn
  return true
}

function fireOnTarget(){
  for (row of game.board){
    for (el of row){
      if (el.targeted){
        game.turn > 0 ? el.playerOneFired = true : el.playerTwoFired = true
        el.targeted = false
        return
      }
    }
  }
}


