// Constants
const gridSize = 10
const boardSize = 40

// Cached Element References
const gridContainer = document.querySelector('#grid-container')

// Functions
renderDemo(gridSize,gridSize)

function renderDemo(rows,cols){
  gridContainer.style.display = "grid"
  gridContainer.style.gridTemplateRows = `repeat(${rows}, ${boardSize/rows}vh)`
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${boardSize/cols}vh)`
  for (let row = 0; row < rows; row++){
    for (let col = 0; col < cols; col++){
      let newGridSquare = document.createElement('div')
      newGridSquare.setAttribute("class","grid-square")
      newGridSquare.setAttribute("id",`${row}-${col}`)
      gridContainer.appendChild(newGridSquare)
    }
  }
}
