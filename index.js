let canvas = document.getElementById('game');
let context = canvas.getContext('2d');
let rect = canvas.getBoundingClientRect();

let mouseX = 0, mouseY = 0;
let scale = 40;
let rows = canvas.height / scale, cols = canvas.width / scale;

let cells = [];
let mines = [];

document.addEventListener('mousedown', function (e) {
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    for (let cell of cells) {
        if (cell.contain(mouseX, mouseY)) {
            if (e.which == 1) {
                cell.reveal();
                cell.show(context);
                if (cell.mine) {
                    gameOver();
                }
            } else if (e.which == 2) {
                cell.flagged = true;
            }
        }
    }

}, false);

for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
        let cell = new Cell(i * scale, j * scale, scale);
        cells.push(cell);
        if (cell.mine) {
            mines.push(cell);
        }
    }
}

cells.forEach(cell => {
    cell.countMines();
});

function loop() {
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    cells.forEach(cell => {
        cell.show(context);
    });

    requestAnimationFrame(loop);
}

function gameOver() {
    cells.forEach(cell => {
        cell.reveal();
        cell.countMines();
        cell.show(context);
    });
}

loop();