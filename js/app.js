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
    game.turn > 0 ? el.playerOneFired = true : el.playerTwoFired = true
    this.targeted = false
    game.fireArray.push(this.pos) 
  }

  placeShip(i){
    game.turn > 0 ? this.playerOneShip = `${lastShip[0]+i}` : this.playerTwoShip = `${lastShip[0]+i}`
  }
}

// ---------------- Constants ----------------------------//
const gridSize = 10
const boardSize = 40
const borderColor = `#A4E3AE`
const hoverColor = `#7BB886`

const shipInfo = [[`Carrier`, 5, 1],[`Battleship`, 4, 2],[`Cruiser`, 3, 3],[`Submarine`, 3, 4],[`Destroyer`,2, 5],["Confirm Placement",0,0]]

//----------------- Variables (State) --------------------//

// Phases: 0-Start Screen  1-Setup  2-Battle  3-End of Game
let game = {
  phase: 0,
  turn: 1,
  // I might really regret this but I'm using one board to rule them all 
  board: [],
  winner: null,
  fireArray: []
}

let lastShip = shipInfo[0]
let rotate = false
let shipViewToggle = false

// ---------------- Cached Element References ------------//
const message = document.querySelector('#message')
const gridContainer = document.querySelector('#grid-container')
const shipContainer = document.querySelector('#ship-container')
const shipImg = document.querySelector(`#ship`)

const btnNext = document.querySelector('#btn-next')
const btnRestart = document.querySelector(`#btn-restart`)
const btnRotate = document.querySelector('#ship-rotate')
const btnViewShips = document.querySelector('#ship-view')
const btnClearShips = document.querySelector(`#ship-clear`)
const btnUndo = document.querySelector(`#ship-undo`)

const fullscreenModal = new bootstrap.Modal(document.querySelector('.modal'))
const modalTitle = document.querySelector('.modal-title')
const modalText = document.querySelector('#modal-text')
const modalBtn = document.querySelector('#modal-btn')
const modalHeader = document.querySelector('.modal-header')

// --------------- Event Listeners -----------------------//
gridContainer.addEventListener('mouseover',boardClick)
gridContainer.addEventListener('mouseout',boardClick)
gridContainer.addEventListener('click',boardClick)
// shipContainer.addEventListener('click', changeShip)

btnNext.addEventListener('click', nextPhase)
btnRestart.addEventListener('click', init)
btnRotate.addEventListener('click',rotateShips)
btnViewShips.addEventListener('click',displayShips)
btnClearShips.addEventListener('click',clearShips)
btnUndo.addEventListener('click',undoLastShip)

//---------------- Functions -----------------------------//
init()

function init(){
  game.phase = 0
  game.turn = 1
  game.board = []
  game.winner = false
  game.fireArray = []
  rotate = false
  gridContainer.style.cursor = "auto"
  btnNext.textContent = "Start Game"
  btnClearShips.style.display = "none"
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

function render(){
  if (game.phase === 0){
    btnNext.hidden = false
    btnRestart.hidden = true
    btnRotate.style.display = "none"
    btnViewShips.style.display = "none"
    btnUndo.style.display = "none"
    gridContainer.style.display = "none"
    shipContainer.style.display = "none"
    message.textContent = "Start a two player game"
  } else if (game.phase === 1){
    btnNext.hidden = true
    btnRestart.hidden = false
    btnRotate.style.display = "inline"
    btnUndo.style.display = "inline"
    btnClearShips.style.display = "inline"
    message.textContent = `Player ${game.turn >0 ? 1 : 2} place your ${lastShip[0]}`
    if (lastShip[1] > 0){
      shipImg.setAttribute("src", `./assets/img/${lastShip[0].toLowerCase()}.png`)
    } else {
      shipContainer.style.display = "none"
    }
    if (lastShip[2] === 0){
      message.textContent= lastShip[0]
      btnNext.textContent = 'Submit'
      btnNext.style.height = '170px'
      // btnNext.style.width = '38vh'
      btnNext.hidden = false
    }
    renderBoard(gridSize,gridSize)
  } else if (game.phase === 2){
    btnNext.style.height = "auto"
    btnViewShips.style.display = "block"
    btnUndo.style.display = "none"
    btnClearShips.style.display = "none"
    btnNext.hidden = true
    shipViewToggle = false
    gridContainer.style.cursor = "url('../assets/img/target.png') 25 25 , crosshair"
    btnViewShips.textContent = "Show Your Ships"
    btnRotate.style.display = "none"
    shipContainer.style.display = "none"
    message.textContent = `Player ${game.turn >0 ? 1 : 2} pick a square to fire upon`
    renderBoard(gridSize,gridSize)
  } else if (game.phase === 3){
    btnNext.hidden = true
    btnViewShips.style.display = "none"
    gridContainer.style.display = "none"
    message.innerHTML = `Congrats Player ${game.winner >0 ? 1 : 2} on wining the game! <br> Play Again?`
    btnRestart.textContent = `New Game`
  }
}

function nextPhase(){
  if (game.phase === 0 ){
    game.phase += 1
  } else if (game.phase === 1){
    if (game.turn === -1){
      game.phase += 1
    }
    if (rotate){
      rotateShips()
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
  renderModal()
}

function renderBoard(rows,cols){
  if (lastShip[1] !== 0){
    shipContainer.style.display = "flex"
  }
  gridContainer.innerHTML = ''
  gridContainer.hidden = false
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
        shipContainer.style.display = "none"
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
      if (!checkIfOccupied(evt.target.id)){
        placeShipLogic(evt.target.id,evt.type)
      }
    } else if (game.phase == 2){
      targetSquareLogic(evt)
    }
  }
}

function changeShip(){
  if (lastShip[2] === 0){
    clearShips()
    lastShip = shipInfo[5]
    shipContainer.style.display = "flex"
  }
  lastShip = shipInfo[lastShip[2]]
  render()
}
  
function placeShipLogic(start, action) {
  for (let i = 0; i < lastShip[1]; i++){
    let r = parseInt(start[0])
    let c = parseInt(start[2])
    if (c + lastShip[1] >= gridSize && !rotate){
      c = gridSize - lastShip[1]
    } else if (r + lastShip[1] >= gridSize && rotate){
      r = gridSize - lastShip[1]
    }
    rotate ? r += i : c += i
    if (action === 'click'){
      game.board[r][c].placeShip(i)
    } else {
      let newBorder = (action === 'mouseover') ? `${boardSize/gridSize/2}vh solid ${hoverColor}` : `1px solid ${borderColor}`
      document.getElementById(`${r}-${c}`).style.border = newBorder
    }
  }
  if (action === 'click'){
    changeShip()
    render()
  }
}

function targetSquareLogic(evt){
  if (evt.type !== 'click') {
    let newBorder = (evt.type === 'mouseover') ? `${boardSize/gridSize/2}vh solid ${hoverColor}` : `1px solid ${borderColor}`
    evt.target.style.border = newBorder
  } else {
    let r = parseInt(evt.target.id[0])
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
        el.fire()
        return
      }
    }
  }
}

function checkIfOccupied(start){
  output = false
  for (let i = 0; i < lastShip[1]; i++){
    let r = parseInt(start[0])
    let c = parseInt(start[2])
    if (c + lastShip[1] >= gridSize && !rotate){
      c = gridSize - lastShip[1]
    } else if (r + lastShip[1] >= gridSize && rotate){
      r = gridSize - lastShip[1]
    }
    
    rotate ? r += i : c += i
    if (game.board[r][c].playerOneShip !== '' && game.turn > 0){
      output = true
    } else if (game.board[r][c].playerTwoShip !== '' && game.turn < 0){
      output = true 
    }
  }
  return output
}

function rotateShips(evt){
  rotate === false ? rotate = true : rotate = false 
  let imgs = document.querySelectorAll("img")
  for (img of imgs){
    if (img.className === "rotate90"){
      img.setAttribute("class","")
      shipContainer.style.flexDirection = "column"
    } else {
      img.setAttribute("class","rotate90")
      shipContainer.style.flexDirection = "row"
    }
  }
}

function displayShips(){
  if (shipViewToggle){
    render()
  } else {
    shipViewToggle = true
    btnViewShips.textContent = "Show Target Board"
    let rows = gridSize
    let cols = gridSize
    gridContainer.innerHTML = ''
    gridContainer.hidden = false
    gridContainer.style.display = "grid"
    gridContainer.style.gridTemplateRows = `repeat(${rows}, ${boardSize/rows}vh)`
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${boardSize/cols}vh)`
  
    for (let row = 0; row < rows; row++){
      for (let col = 0; col < cols; col++){
        let newGridSquare = document.createElement('div')
        newGridSquare.setAttribute("class","grid-square")
        newGridSquare.setAttribute("id",`${row}-${col}`)
        if (game.phase === 2){
          // shipContainer.style.display = "none"
          if (game.board[row][col].playerOneShip !== '' && game.turn > 0){
            if (game.board[row][col].playerTwoFired){
              newGridSquare.setAttribute("class","hit-on-ship")
            } else {
              newGridSquare.setAttribute("class","ship-here")
            }
          } else if (game.board[row][col].playerTwoShip !== '' && game.turn < 0){
            if (game.board[row][col].playerOneFired){
              newGridSquare.setAttribute("class","hit-on-ship")
            } else {
              newGridSquare.setAttribute("class","ship-here")
            }
          } else if (game.board[row][col].playerTwoFired && game.turn > 0){
            newGridSquare.setAttribute("class","miss-on-board")
          } else if (game.board[row][col].playerOneFired && game.turn < 0){
            newGridSquare.setAttribute("class","miss-on-board")
          }
        }
        gridContainer.appendChild(newGridSquare)
      }
    }
  }
}

function renderModal(){
  let player = game.turn > 0 ? 1 : 2
  modalHeader.style.display = "none"
  if (game.fireArray.length !== 0){
    modalHeader.style.display = "flex"
    let row = game.fireArray.at(-1)[0]
    let col = game.fireArray.at(-1)[1]
    let shipHit = game.turn < 0 ? game.board[row][col].playerTwoShip : game.board[row][col].playerOneShip
    shipHit = shipHit.slice(0,shipHit.length-1)
    if (shipHit !== ''){
      modalHeader.firstElementChild.textContent = "HIT!"
      if (checkIfSunk(shipHit)){
        modalHeader.lastElementChild.innerHTML = `You <span id="sunk-text">SUNK</span> my ${shipHit}`
      } else {
        modalHeader.lastElementChild.innerHTML = `You hit my ${shipHit}`
      }
      

    } else {
      modalHeader.firstElementChild.textContent = "MISS"
      modalHeader.lastElementChild.textContent = `Better Luck Next Time`
    }
  }
  if (game.phase === 3){
    modalTitle.textContent = `Game Over`
    modalText.textContent = `With that hit you won the game!`
    modalBtn.textContent = `Close`
  }else{
    modalTitle.textContent = `Switch Players`
    modalText.textContent = `Confirm you are Player ${player} below:`
    modalBtn.textContent = `I am Player ${player}`
  }
  fullscreenModal.show()
}

function checkIfSunk(shipName){
  for (let row of game.board){
    for (let el of row){
      shipCheck = game.turn > 0 ? el.playerOneShip: el.playerTwoShip
      shipFiredCheck = game.turn > 0 ? el.playerTwoFired: el.playerOneFired
      shipCheck = shipCheck.slice(0,shipCheck.length-1)
      if (shipCheck === shipName && !shipFiredCheck){
        return false
      }
    }
  }
  return true
}

function clearShips(){
  for (row of game.board){
    for (el of row){
      game.turn > 0 ? el.playerOneShip = `` : el.playerTwoShip = ``
    }
  }
  lastShip = shipInfo[0]
  render()
}

function undoLastShip(){
  curIdx = shipInfo.findIndex( el => el === lastShip)
  lastShip = curIdx > 0 ? shipInfo[curIdx-1] : shipInfo[curIdx] 
  for (let row of game.board){
    for (let el of row){
      if (game.turn > 0 && el.playerOneShip.slice(0,-1) === lastShip[0]){
        el.playerOneShip = ``
      } else if (game.turn < 0 && el.playerTwoShip.slice(0,-1) === lastShip[0]){
        el.playerTwoShip = ``
      }
    }
  }
  render()
}