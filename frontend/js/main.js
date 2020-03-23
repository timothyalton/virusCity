// setup and configuration

// size of the grid
const size = 50

// size of the screen
const width = window.innerWidth
const height = window.innerHeight

// size of the texture
const texWidth = 12
const texHeight = 6

// size of the tiles
const tileWidth = 128
const tileHeight = 64

const gridX = width / 2
const gridY = tileHeight

// position of the camera
let offsetX = 0
let offsetY = 0

let zoom = 1.0

// the grid structure
let tiles = Array.from(Array(size).keys()).map(row => Array.from(Array(size).keys()).map(col => [0, 0]))



// some helper variables for keeping keys pressed 
let tools, tool, activeTool, isPlacing




// load the texture file with the tile textures
const texture = new Image()
texture.src = "textures/01_130x66_130x230.png"

texture.onload = _ => {
    // get the background context to draw the grid on
    let bgCanvas = document.querySelector("#bg")
    bgCanvas.width = width
    bgCanvas.height = height
    bg = bgCanvas.getContext("2d")

    // get the foreground context to draw the highlighted selection on
    fgCanvas = document.querySelector("#fg")
    fgCanvas.width = width
    fgCanvas.height = height
    fg = fg.getContext('2d')

    // display the grid
    drawGrid()

    // install event listeners
    fgCanvas.addEventListener('mousemove', viz)
    fgCanvas.addEventListener('contextmenu', e => e.preventDefault())
    fgCanvas.addEventListener('mouseup', unclick)
    fgCanvas.addEventListener('mousedown', click)
    fgCanvas.addEventListener('touchend', click)
    fgCanvas.addEventListener('pointerup', click)
    document.addEventListener('keydown', scroll)

    ///////////// display tool section

    tools = document.querySelector('#tools')

    let toolCount = 0
    for (let i = 0; i < texHeight; i++) {
        for (let j = 0; j < texWidth; j++) {
            const div = document.createElement('div');
            div.id = `tool_${toolCount++}`
            div.style.display = "block"
                /* width of 132 instead of 130  = 130 image + 2 border = 132 */
            div.style.backgroundPosition = `-${j*130+2}px -${i*230}px`
            div.addEventListener('click', e => {
                tool = [i, j]
                if (activeTool)
                    document.querySelector(`#${activeTool}`).classList.remove('selected')
                activeTool = e.target.id
                document.querySelector(`#${activeTool}`).classList.add('selected')
            })
            tools.appendChild(div)
        }
    }
    /////////////

}



/////////////////
const click = e => {
    const pos = convertScreenToGrid(e.offsetX, e.offsetY)
    if (pos.x >= 0 && pos.x < size && pos.y >= 0 && pos.y < size) {

        tiles[pos.x][pos.y][0] = (e.which === 3) ? 0 : tool[0]
        tiles[pos.x][pos.y][1] = (e.which === 3) ? 0 : tool[1]
        isPlacing = true

        drawGrid()
        fg.clearRect(-width, -height, width * 2, height * 2)
    }

}

const unclick = () => {
    if (isPlacing)
        isPlacing = false
}

const viz = (e) => {
    if (isPlacing)
        click(e)
    const pos = convertScreenToGrid(e.offsetX, e.offsetY)
    console.log(pos)
    fg.clearRect(-width, -height, width * 2, height * 2)
    if (pos.x >= 0 && pos.x < size && pos.y >= 0 && pos.y < size)
        drawTile(fg, pos.x, pos.y, 'rgba(0,0,0,0.2)')
}



const scroll = (e) => {
    switch (e.keyCode) {
        case 38:
            offsetX += 20;
            break;
        case 40:
            offsetX -= 20;
            break;
        case 37:
            offsetY += 20;
            break;
        case 39:
            offsetY -= 20;
            break;

        case 81:
            zoom /= 2;
            break;
        case 87:
            zoom *= 2;
            break;

            /*
                            case 87 : offsetX -= 1 ; break;
                            case 83 : offsetX += 1 ; break;
                            case 65 : offsetY += 1 ; break;
                            case 68 : offsetY -= 1 ; break;
            */
    }
    drawGrid()
        // drawBall(bg)
}

/////////////////////////////////////////















// display the grid
function drawGrid() {
    bg.clearRect(-width, -height, width * 2, height * 2)
    tiles.forEach((row, x) => row.forEach((col, y) => drawImageTile(bg, x, y, col[0], col[1])))
}

// display shaded selection for tile
function drawTile(c, x, y, color) {
    const pos = convertGridToScreen(x, y)
    c.save()
    c.translate(pos.x, pos.y)
    c.beginPath()
    c.moveTo(0, 0)
    c.lineTo(zoom * tileWidth / 2, zoom * tileHeight / 2)
    c.lineTo(0, zoom * tileHeight)
    c.lineTo(zoom * (-tileWidth / 2), zoom * tileHeight / 2)
    c.closePath()
    c.fillStyle = color
    c.fill()
    c.restore()
}

// display a time on a position
function drawImageTile(c, x, y, i, j) {
    const pos = convertGridToScreen(x, y)
    c.save()
    c.translate(pos.x, pos.y)
    j *= 130
    i *= 230
    c.drawImage(texture, j, i, 130, 230, -65 * zoom, -130 * zoom, 130 * zoom, 230 * zoom)
    c.restore()
}

// perform math for isometric projection
function convertScreenToGrid(x, y) {
    const a = (((x - gridX - offsetY) / zoom) / (tileWidth / 2)) / 2
    const b = (((y - gridY - offsetX) / zoom) / (tileHeight / 2)) / 2
    return { x: Math.floor(b - a), y: Math.floor(a + b) }
}

function convertGridToScreen(x, y) {
    return { x: zoom * (y - x) * tileWidth / 2 + gridX + offsetY, y: zoom * (x + y) * tileHeight / 2 + gridY + offsetX }
}









/*


const drawBall = (c) => {

  let pos = convertGridToScreen({x : u + 1/2 , y : v + 1/2})
  let x = pos.x
  let y = pos.y
  let radius = 5

    c.save()
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI*2, true);
    c.closePath();
    c.fillStyle = 'blue'
    c.fill()
    c.restore()
}

*/