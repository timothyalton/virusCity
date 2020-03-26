// some helper variables for keeping keys pressed, keep track of which texture
let tools, tool, activeTool
fgCanvas = document.querySelector('#fg')
    // install event listeners
fgCanvas.addEventListener('mousemove', mouseMove)
fgCanvas.addEventListener('contextmenu', e => e.preventDefault())
fgCanvas.addEventListener('click', mouseClick)
document.addEventListener('keydown', scroll)

///////////// display tool section
tools = document.querySelector('#tools')
    // left bar

let toolCount = 0
for (let i = 0; i < texHeight; i++) {
    for (let j = 0; j < texWidth; j++) {
        const div = document.createElement('div');
        div.id = `tool_${toolCount++}`
        div.style.display = "block"
            /* width of 132 instead of 130  = 130 image + 2 border = 132 */
        div.style.backgroundPosition = `-${j*130+2}px -${i*230}px`
        div.addEventListener('click', e => {
            tool = i * texWidth + j

            console.log(toolCount)

            if (activeTool)
                document.querySelector(`#${activeTool}`).classList.remove('selected')
            activeTool = e.target.id
            document.querySelector(`#${activeTool}`).classList.add('selected')
        })
        tools.appendChild(div)
    }
}

let startbutton = document.querySelector("#start-simulation")
startbutton.addEventListener("click", () => {
    startSimulation();
    startbutton.value = running ? "Stop Simulation" : "Start Simulation"
})




// callback  for click: set the selected tile at the click position
function click2(e) {
    const pos = convertScreenToGrid(e.offsetX, e.offsetY)
    if (pos.x >= 0 && pos.x < size && pos.y >= 0 && pos.y < size) {
        tiles[pos.x][pos.y].property = (e.which === 3) ? 0 : tool[0] + tool[1] * 12
            // redraw the entire grid
        setTile(tiles[pos.x][pos.y])
        drawGrid()
        clearSelection()
    }
}

function scroll(e) {
    switch (e.keyCode) {
        case 38:
            moveCamera(20, 0, 1);
            break;
        case 40:
            moveCamera(-20, 0, 1);
            break;
        case 37:
            console.log("up")
            moveCamera(0, 20, 1);
            break;
        case 39:
            moveCamera(0, -20, 1);
            break;

        case 81:
            moveCamera(0, 0, (1 / 1.1))
            break;
        case 87:
            moveCamera(0, 0, (1.1))
            break;
    }
}