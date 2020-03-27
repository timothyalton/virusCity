// setup and configuration
// size of the grid
let size = 0

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
let people = []

let modifyEnabled = false
let addPersonEnabled = false


function loadGrid() {
    fetch('http://localhost:3000/grids/1')
        .then(res => res.json())
        .then(function(grid) {
            size = grid.size
            tiles = Array.from(Array(grid.size).keys()).map(row => Array.from(Array(grid.size).keys()).map(col => { return { x: row, y: col, property: 0 } }))
            grid.tiles.forEach((tile) => tiles[tile.x][tile.y] = tile)

            fetch(`http://localhost:3000/people`)
                .then(res => res.json())
                .then(function(persons) {
                    people = persons
                    drawGrid()


                })


        })
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
}


// callback  for click: set the selected tile at the click position
function mouseClick(e) {
    const pos = convertScreenToGrid(e.offsetX, e.offsetY)
    if (pos.x >= 0 && pos.x < size && pos.y >= 0 && pos.y < size) {

        if (modifyEnabled) {
            tiles[pos.x][pos.y].property = (e.which === 3) ? 0 : tool
                // redraw the entire grid
            setTile(tiles[pos.x][pos.y])
        } else if (addPersonEnabled) {
            addPerson(pos.x, pos.y)
        }

        drawGrid()
        clearSelection()
            // highlightPath(tiles[0][0], findPath(tiles[0][0], tiles[pos.x][pos.y]))
            // console.log(findPath(tiles[0][0], tiles[pos.x][pos.y]))
            // console.log(tiles[pos.x][pos.y].property)

        console.log(tool)

    }
}



//callback for mouse move: highlights the tile at the mouse position 
function mouseMove(e) {
    const pos = convertScreenToGrid(e.offsetX, e.offsetY)
    clearSelection()
    if (pos.x >= 0 && pos.x < size && pos.y >= 0 && pos.y < size) {
        highlightSelection(pos.x, pos.y)
            // console.log(getValidNeighbors(tiles[pos.x][pos.y]))

    }

}

function clearSelection() {
    fg.clearRect(-width, -height, width * 2, height * 2)
}

function highlightSelection(x, y) {
    // console.log([x, y])
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
    drawPeople()
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
    let i = Math.floor(tile.property / texWidth)
    let j = tile.property - (texWidth * i)
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












function drawPerson(person) {
    if (!person.tile) return 0
    let pos = convertGridToScreen(person.tile.x + 1 / 2, person.tile.y + 1 / 2)
    let radius = 10 * zoom
    bg.save()
    bg.beginPath();
    bg.arc(pos.x, pos.y, radius, 0, Math.PI * 2, true);
    bg.closePath();
    if (person.health == "healthy") { bg.fillStyle = 'blue' } else if (person.health == "infected") { bg.fillStyle = 'red' }
    bg.fill()
    bg.restore()
}





// goToTile(people[0], [20, 37])

function drawPeople() {
    people.forEach(drawPerson)
}







function possibleExits(tile) {
    let exits = [
        [],
        [],
        [
            [0, 1],
            [0, -1]
        ],
        [
            [1, 0],
            [-1, 0]
        ],
        [
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1]
        ],
        [
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1]
        ],

        [
            [0, 1],
            [0, -1]
        ],
        [
            [0, 1],
            [0, -1]
        ],
        [
            [1, 0],
            [-1, 0]
        ],
        [
            [1, 0],
            [-1, 0]
        ],
        [
            [-1, 0]
        ],
        [
            [0, 1]
        ],
        [
            [0, -1]
        ],
        [
            [1, 0]
        ],
        [
            [1, 0],
            [-1, 0],
            [0, 1]
        ],
        [
            [1, 0],
            [-1, 0],
            [0, -1]
        ],
        [
            [0, 1],
            [0, -1],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0]
        ],
        [
            [1, 0],
            [-1, 0]
        ],
        [
            [0, -1],
            [0, 1]
        ],
        [
            [-1, 0],
            [0, 1]
        ],
        [
            [1, 0],
            [0, -1]
        ],
        [
            [1, 0],
            [0, 1]
        ],
        [
            [-1, 0],
            [0, -1]
        ],
        [
            [0, 1]
        ],
        [
            [0, -1]
        ],
        [
            [-1, 0]
        ],
        [
            [1, 0]
        ],
        [
            [1, 0]
        ],
        [
            [-1, 0]
        ],
        [
            [0, 1]
        ],
        [
            [0, -1]
        ],
        [
            [-1, 0],
            [0, 1]
        ],
        [
            [1, 0],
            [0, -1]
        ],
        [
            [-1, 0],
            [0, -1]
        ],
        [
            [0, 1],
            [1, 0]
        ],
        [],
        [],
        [],
        [],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [],
        [],
        [],
        [],
        [],
        [],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ],
        [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0]
        ]
    ]

    return exits[tile.property]
}


function getValidNeighbors(tile) {
    return possibleExits(tile).filter(function(exit) {
        let x = tile.x + exit[0]
        let y = tile.y + exit[1]
        if (x < 0 || x >= size || y < 0 || y >= size) return false
        let entries = possibleExits(tiles[x][y])
        return entries.some((entry) => entry[0] == exit[0] * -1 && entry[1] == exit[1] * -1)
    })

}

// function findPath(start, target) {
//     if (start.x == target.x && start.y == target.y) {
//         return []
//     }
//     let tile = start
//     let validPath
//         // let i = 0 
//         // while (i < ){}
//     steps = getValidNeighbors(tile)
//     steps.some(function(step) {
//         let path
//         let neighbor = tiles[tile.x + step[0]][tile.y + step[1]]
//         if (neighbor.visited) return false
//         neighbor.visited = true
//         path = findPath(neighbor, target)


//         // console.log(path)
//         if (path) {
//             path.unshift(step)
//             validPath = path
//         }
//         return path
//     })
//     return validPath
// }

function highlightPath(start, path) {
    //clearSelection()
    // highlightSelection(tile)
    // console.log(path)
    let tile = start
    path.forEach(function(step) {
        //console.log(step)
        drawPerson({ tile: tile })
        tile = tiles[tile.x + step[0]][tile.y + step[1]]
    })
}

function findPath(start, target) {
    console.log("Running")
    let open = [Object.assign({}, start, {})]
    let closed = []

    while (open.length > 0) {
        let tile = open[0]
        getValidNeighbors(tile).forEach(function(step) {
            let neighbor = tiles[tile.x + step[0]][tile.y + step[1]]
            if (!closed.find(elemnt => elemnt.x == neighbor.x && elemnt.y == neighbor.y) && (!open.find(elemnt => elemnt.x == neighbor.x && elemnt.y == neighbor.y)))
                open.push(Object.assign({}, neighbor, { previous: tile }))
        })
        closed.push(open.shift())

        if (tile.x == target.x && tile.y == target.y) {
            path = []
            while (tile.previous) {
                path.unshift(tile)
                tile = tile.previous
            }
            return path
        }
    }
    return []
}


function movePeople() {
    people.forEach(person => {
        if (person.path && person.path.length > 0) {
            person.tile = person.path.shift()
        }
    })
}

function goToTile(person, destination) {

    if (!person.path) person.path = []
    person.path = [...person.path, ...findPath(person.tile, destination)]
    return 0
        // let x = destination.x - person.tile.x
        // let y = destination.y - person.tile.y
        // person.path = []
        // for (let i = 0; i < Math.abs(x); i++) {
        //     person.path.push(tiles[person.tile.x + i * Math.sign(x)][person.tile.y])
        // }

    // for (let i = 0; i < Math.abs(y); i++) {
    //     person.path.push(tiles[person.tile.x][person.tile.y + i * Math.sign(y)])
    // }

}


function addPerson(x, y) {
    fetch(`http://localhost:3000/people/`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
                name: "person",
                health: "healthy",
                tile_id: tiles[x][y].id
            })
        })
        .then(res => res.json())
        .then(person => {
            people.push(person)
            drawGrid()
        })

}






let time = 0
let running = false

let divTime = document.getElementById('time')
let divPeople = document.getElementById("people-Infected")

function displayCounter() {
    divTime.innerText = `Time : ${time}`
    divPeople.innerText = `People infected : ${numberofinfected()}`

}

function numberofinfected() {
    return people.reduce((acc, person) => acc += (person.health == "infected" ? 1 : 0), 0)
}




function eventLoop() {
    console.log(prohibitedActions)
    executeSchedule(time)
    movePeople()
    infectPeople()
    drawGrid()
    displayCounter()
    time = (time + 1) % (24 * 60)
    if (running) {
        window.setTimeout(eventLoop, 350)
    }
}


function startSimulation() {
    if (!running) {
        running = true
        eventLoop()
    } else stopSimulation()
}

function stopSimulation() {
    running = false
}

function executeSchedule(time) {
    people.forEach(function(person) {
        action = person.actions.find(action => action.time == time)
        if (action && actionAllowed(action))
            goToTile(person, action.tile)
    })
}




function infectPeople() {
    people.forEach(personA => people.forEach(personB => {
        if (personA.tile.x == personB.tile.x && personA.tile.y == personB.tile.y && personA.health == "infected")
            personB.health = "infected"
    }))

}


let prohibitedActions = []

function actionAllowed(action) {
    return !prohibitedActions.find(prohibitedAction => prohibitedAction == action.category)
}