// setup and configuration
// size of the grid
let size = 50

// size of the screen
const width = window.innerWidth
const height = window.innerHeight

// size of the texture on the html page
const texWidth = 12
const texHeight = 6

// size of the tiles on the html page (one square of the yellow ground)(gray highlight)
const tileWidth = 128
const tileHeight = 64

// to change the starting point of the canvas, to be in the middle of the screen, and one tile down
const gridX = width / 2
const gridY = tileHeight

// position of the camera, its the change to gridx and girs y on each click on the arrows
let offsetX = 0
let offsetY = 0

//everything I draw will multiply by the zoom / so everytime I click on q or w will increase or decrease the number
let zoom = 1.0



let tiles = []

function loadGrid(grid) {
    tiles = Array.from(Array(size).keys()).map(row => Array.from(Array(size).keys()).map(col => { return { x: row, y: col, property: 0 } }))
    fetch('http://localhost:3000/grids/5')
        .then(res => res.json())
        .then(grid => grid.tiles.forEach((tile) => tiles[tile.x][tile.y] = tile))
}


function setTile(tile) {
    fetch(`http://localhost:3000/tiles/${tile.id}`, {
            method: 'PATCH',
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
                tile: tile
            })
        })
        .then(res => res.json())
        .then(tile => tiles[tile.x][tile.y] = tile)
}

// load the texture file with the tile textures

const texture = new Image() // js image class
texture.src = "textures/01_130x66_130x230.png"

//after the image loaded to have access for it
texture.onload = _ => {
    // get the background context to draw the grid on
    let bgCanvas = document.querySelector("#bg")
    bgCanvas.width = width
    bgCanvas.height = height
        //when we have canavs we cant draw on it, we need to get the context(the drawing area), getContext a js func of canavas html tag
    bg = bgCanvas.getContext("2d")

    // get the foreground context to draw the highlighted selection on
    fgCanvas = document.querySelector("#fg")
    fgCanvas.width = width
    fgCanvas.height = height
    fg = fg.getContext('2d')

    // display the grid
    loadGrid()
    drawGrid()
}


// callback  for click: set the selected tile at the click position
function mouseClick(e) {
    const pos = convertScreenToGrid(e.offsetX, e.offsetY)
    if (pos.x >= 0 && pos.x < size && pos.y >= 0 && pos.y < size) {
        tiles[pos.x][pos.y].property = (e.which === 3) ? 0 : tool[0] + tool[1] * 12
            // redraw the entire grid
        setTile(tiles[pos.x][pos.y])
        drawGrid()
        clearSelection()
    }
}



//callback for mouse move: highlights the tile at the mouse position 
function mouseMove(e) {
    const pos = convertScreenToGrid(e.offsetX, e.offsetY)
    clearSelection()
    if (pos.x >= 0 && pos.x < size && pos.y >= 0 && pos.y < size)
        highlightSelection(pos.x, pos.y)
}

function clearSelection() {
    fg.clearRect(-width, -height, width * 2, height * 2)
}

function highlightSelection(x, y) {
    drawTile(x, y, 'rgba(0,0,0,0.2)')
}


function moveCamera(x, y, z) {
    offsetX += x
    offsetY += y
    zoom *= z
    drawGrid()
}




// display the grid
function drawGrid() {
    //clear everything on the canvas TC
    // remove any old  grid then draw
    bg.clearRect(-width, -height, width * 2, height * 2)
    tiles.forEach((row, x) => row.forEach((col, y) => drawImageTile(col))) // which x and y postion in the texure pic
    drawPersons()
}

// display shaded selection for tile
function drawTile(x, y, color) {
    const pos = convertGridToScreen(x, y)
    fg.save()
    fg.translate(pos.x, pos.y)
    fg.beginPath()
    fg.moveTo(0, 0)
    fg.lineTo(zoom * tileWidth / 2, zoom * tileHeight / 2)
    fg.lineTo(0, zoom * tileHeight)
    fg.lineTo(zoom * (-tileWidth / 2), zoom * tileHeight / 2)
    fg.closePath()
    fg.fillStyle = color
    fg.fill()
    fg.restore()
}

// display a time on a position
function drawImageTile(tile) {
    const pos = convertGridToScreen(tile.x, tile.y)
    bg.save()
        //translate build in func for canavs tag, it sets the starting point of drawimg (img = texsure)
    bg.translate(pos.x, pos.y)
        // dimention of the texsure in the pic file
        // we calculate the pixel postion of tile i and j in the texuse img file, we have to multiply to get the real postion of the pic npt the pixel
    let j = Math.floor(tile.property / 12)
    let i = tile.property - (12 * j)
    j *= 130
    i *= 230
        // take the img from the texsure img file and then start at postion i and j copy the rectangle of 130x230 pexil and then draw it to canvas at postion 
    bg.drawImage(texture, j, i, 130, 230, -65 * zoom, -130 * zoom, 130 * zoom, 230 * zoom)
    bg.restore()
}

// perform math for isometric projection

//this function take the postion on the screen and tells which grid tile under that screen postion
function convertScreenToGrid(x, y) {
    const a = (((x - gridX - offsetY) / zoom) / (tileWidth / 2)) / 2
    const b = (((y - gridY - offsetX) / zoom) / (tileHeight / 2)) / 2
    return { x: Math.floor(b - a), y: Math.floor(a + b) }
}
// this function takes the tile on the grid and tells which postion on the screen it is.
function convertGridToScreen(x, y) {
    return { x: zoom * (y - x) * tileWidth / 2 + gridX + offsetY, y: zoom * (x + y) * tileHeight / 2 + gridY + offsetX }
}















const drawBall = (u, v) => {

    let pos = convertGridToScreen(u + 1 / 2, v + 1 / 2)
    let x = pos.x
    let y = pos.y
    let radius = 10 * zoom

    bg.save()
    bg.beginPath();
    bg.arc(x, y, radius, 0, Math.PI * 2, true);
    bg.closePath();
    bg.fillStyle = 'blue'
    bg.fill()
    bg.restore()
}

window.setInterval(tick, 500)

function tick() {
    drawGrid()
    movePersons()
}

persons = [

]

addperson(3, 5)
addperson(5, 4)
addperson(6, 8)

goToTile(persons[0], [20, 37])

function drawPersons() {
    persons.forEach(person => drawBall(person.pos[0], person.pos[1]))
}

function addperson(x, y) {
    persons.push({ pos: [x, y], path: [] })
}

function movePersons() {
    persons.forEach(person => {
        if (person.path.length > 0) {
            let direction = person.path.shift()
            person.pos[0] += direction[0]
            person.pos[1] += direction[1]
        }
    })
}

function goToTile(person, destination) {
    let x = destination[0] - person.pos[0]
    let y = destination[1] - person.pos[1]
    for (let i = 0; i < Math.abs(x); i++) {
        person.path.push([Math.sign(x), 0])
    }

    for (let i = 0; i < Math.abs(y); i++) {
        person.path.push([0, Math.sign(y)])
    }

}