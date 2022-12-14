# <a href= "https://play-battleship.netlify.app/">BATTLESHIP</a>

Welcome aboard, Captain!  Your naval armada is primed for battle.  Are you ready to lead us to victory?

Click here to play: <a href= "https://play-battleship.netlify.app/">BATTLESHIP</a>

<br>

## About the Game
This is a two player game where players place 5 battleships on their respective 10 x 10 grids and then take turns guessing where the other player has placed their ships, one square at a time.  Once you sink all your opponents ships, you win!

<br>

![Screenshot of Ship Placement screen](./assets/img/screenshot1.png)

![Screenshot of Target screen](./assets/img/screenshot2.png)

<br>


## How to Play
### Step 1: Grab a Friend!
Click this link to play: <a href="https://play-battleship.netlify.app/">PLAY</a>
### Step 2: Setup Phase
Take turns placing all of your ships onto your board.
### Step 3: Battle Phase
Take turns selecting a target square in enemy territory to fire upon.  If you fire upon one of their ships, you will be alerted via a bright red indicator.  If you miss, the square will be neutral.
### Step 4: Endgame
Repeat step 3 until all of a player's ships are sunk.  The last player with ships remaining wins!    

### <a href="https://www.hasbro.com/common/instruct/battleship.pdf">Official Rules from Hasbro</a>

<br>

## Technologies Used
[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)
[![Generic badge](https://img.shields.io/badge/Made%20with-CSS-red.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/Made%20-HTML-yellow.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/Made%20with-Bootstrap-blue.svg)](https://shields.io/)
<br>

## How It's Made
### Code Snippet
```javascript
// Constants
const gridSize = 25
const boardSize = 20

// Cached Element References
const gridContainer = document.querySelector('#grid-container')

// Functions
renderGrid(gridSize,gridSize)

function renderGrid(rows,cols){
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
```
I am extremely proud of code above because it allows a programmer to easily and quickly adjust the size of the grid and how many rows and columns for the grid to have by just changing two saved constants. 

### Wireframe
![wireframe of the Battleship play screen](./assets/img/wire-frame.png)
### Pseudo-code
1. Create a start screen with the title of game and a button to start a new game
2. Setup Phase
   1. Display Title of the Game
   2. Display a message saying "Player [X] Place your Ships"
   3. Display a 10 x 10 grid in the center of the window.
   4. Display a side panel section with ships
   5. Display a button to rotate ships that have yet to be placed
   6. Display a button to confirm ship placement
      1. When pressed it must check if all ships are placed
         1. If not must change the message to the player
      2. If all ships are place, ships position are saved to the state
      3. Goes to next phase 
         1. Either setup for player 2
         2. Continue to the battle phase
   7. Display a button to exit the game
3. Battle Phase
   1. Keep title of the game, 10 x 10 grid, and button to exit the game
   2. Display message saying "Player [X] turn, select coordinates to fire torpedo"
   3. Allow player to click on a square that has not been targeted before
      1. Squares that have been targeted should appear as different colors
   4. Display a button to toggle ship view 
      1. This is where players can see where their opponent has targeted, where the player's ships are, if they have been hit
   5. Display a fire button to confirm targeted square
      1. Should not work if a square is not targeted
      2. Would move the game to next state/screen accordingly
4. Endgame
   1. Should display title of the game
   2. Should display winner of the game
   3. Should have a button to restart


<br>

## Resources Used
<u>Bootstrap</u> <br> <a href="https://getbootstrap.com/">Bootstrap</a>
<br>
<u>Favicon</u> <br> <a target="_blank" href="https://icons8.com/icon/24072/battleship">Battleship</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
<br>
<u>Target Cursor</u> <br> <a target="_blank" href="https://icons8.com/icon/24921/accuracy">Accuracy</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
<br>
<u>Dramatic Music</u> <br> <a href="https://freesound.org/people/DaveJf/sounds/564825/">Dramatic by DaveJF freesound</a>
<br>
<u>Sunk Sound Effect</u> <br> <a href="https://freesound.org/people/tommccann/sounds/235968/">Explosion_01 freesound</a>
<br>
<u>Fire Sound Effect</u> <br> <a href="https://freesound.org/people/CGEffex/sounds/86989/"> Shoot off_Ringy5 freesound</a>
<br>
<u> Hit Sound Effect </u> <br> <a href="https://freesound.org/people/thanvannispen/sounds/9565/">industrial_blast06 freesound</a>
<br>
<u> Battleship Font </u> <br> <a href="https://www.ffonts.net/NFL-Dolphins.font.download"> NFL Dolphins ffont</a>
<br>
<u> Github Badges </u> <br> <a href="https://naereen.github.io/badges/">naereen.github.io</a>

<br>

## Next Steps
- SALVO
- Single Player
- Add sea shanties to the background
- Add voice over sounds
- Add volume control
- Quick lock code to prevent players from playing for the other player 
- Radar option
- Bombs for fake hits
- Airstrikes
- Big bombs
