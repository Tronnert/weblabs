const board = document.getElementById("board")
const scoreEl = document.getElementById("score")

let grid = []
let score = 0
let history = []

function init() {

    grid = Array(4).fill().map(() => Array(4).fill(0))
    score = 0

    spawn()
    spawn()

    saveState()
    render()

}

function spawn() {

    let empty = []

    for (let r = 0; r < 4; r++)
        for (let c = 0; c < 4; c++)
            if (grid[r][c] === 0) empty.push({ r, c })

    if (empty.length === 0) return

    let { r, c } = empty[Math.floor(Math.random() * empty.length)]
    grid[r][c] = Math.random() < 0.9 ? 2 : 4

}

function render() {

    board.innerHTML = ""

    for (let r = 0; r < 4; r++) {

        for (let c = 0; c < 4; c++) {

            let tile = document.createElement("div")
            tile.className = "tile"

            let val = grid[r][c]

            if (val) {
                tile.textContent = val
                tile.dataset.value = val
            }

            board.appendChild(tile)

        }

    }

    scoreEl.textContent = score
    saveGame()

}

function slide(line) {

    line = line.filter(v => v !== 0)

    for (let i = 0; i < line.length - 1; i++) {

        if (line[i] === line[i + 1]) {
            line[i] *= 2
            score += line[i]
            line.splice(i + 1, 1)
        }

    }

    while (line.length < 4) line.push(0)

    return line

}

function move(dir) {

    saveState()

    for (let i = 0; i < 4; i++) {

        let line = []

        for (let j = 0; j < 4; j++) {

            if (dir === "left" || dir === "right")
                line.push(grid[i][j])
            else
                line.push(grid[j][i])

        }

        if (dir === "right" || dir === "down")
            line.reverse()

        line = slide(line)

        if (dir === "right" || dir === "down")
            line.reverse()

        for (let j = 0; j < 4; j++) {

            if (dir === "left" || dir === "right")
                grid[i][j] = line[j]
            else
                grid[j][i] = line[j]

        }

    }

    spawn()
    render()

}

document.addEventListener("keydown", e => {

    if (e.key === "ArrowLeft") move("left")
    if (e.key === "ArrowRight") move("right")
    if (e.key === "ArrowUp") move("up")
    if (e.key === "ArrowDown") move("down")

})

document.querySelectorAll("#mobile-controls button").forEach(btn => {
    btn.onclick = () => move(btn.dataset.dir)
})

document.getElementById("restart").onclick = init
document.getElementById("restart2").onclick = init

function saveState() {
    history.push(JSON.stringify({ grid, score }))
    if (history.length > 20) history.shift()
}

document.getElementById("undo").onclick = () => {

    if (history.length < 2) return


    let prev = JSON.parse(history.pop())

    grid = prev.grid
    score = prev.score

    render()

}

function saveGame() {

    localStorage.setItem("gameState", JSON.stringify({ grid, score }))

}

function loadGame() {

    let saved = localStorage.getItem("gameState")

    if (saved) {

        let data = JSON.parse(saved)

        grid = data.grid
        score = data.score

        render()

    } else init()

}

loadGame()