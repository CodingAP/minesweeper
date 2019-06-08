class Cell {
    constructor(x, y, s) {
        this.x = x;
        this.y = y;
        this.size = s;
        this.i = x / s;
        this.j = y / s;
        this.revealed = false;
        this.mine = false;
        this.flagged = false;
        if (Math.random() * 2 > 1.6) this.mine = true;
        this.minesCount = 0;
    }

    show() {
        context.strokeStyle = '#000';

        if (this.revealed) {
            if (this.mine) {
                context.clearRect(this.x, this.y, this.size, this.size);
                context.fillStyle = '#aaa';
                context.beginPath();
                context.ellipse(this.x + this.size / 2, this.y + this.size / 2, this.size / 4, this.size / 4, 0, 0, Math.PI * 2);
                context.fill();
                context.stroke();
                context.closePath();
            } else {
                context.fillStyle = '#aaa';
                context.fillRect(this.x, this.y, this.size, this.size);
                if (this.minesCount > 0) {
                    context.font = '20px Arial';
                    context.fillStyle = '#000';
                    context.fillText(this.minesCount, this.x + this.size / 3, this.y + this.size / 1.5);
                }
            }
        } else if (this.flagged) {
            context.clearRect(this.x, this.y, this.size, this.size);
            context.fillStyle = '#000';
            context.fillRect(this.x + this.size / 4, this.y + this.size / 4, this.size / 2, this.size / 2);
            context.fillStyle = '#aaa';
            context.fillRect(this.x + this.size / 4 + 1, this.y + this.size / 4 + 1, this.size / 2 - 2, this.size / 2 - 2);
        }

        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(this.x + this.size, this.y);
        context.lineTo(this.x + this.size, this.y + this.size);
        context.lineTo(this.x, this.y + this.size);
        context.lineTo(this.x, this.y);
        context.stroke();
        context.closePath();
    }

    getIndex(i, j) {
        if (i < 0 || j < 0 || i >= cols || j >= rows) return -1;
        return j * cols + i;
    }

    countMines() {
        let total = 0;
        for (var i = 0; i < mines.length; i++) {
            let mineIndex = this.getIndex(mines[i].i, mines[i].j);
            if (this.getIndex(this.i - 1, this.j) == mineIndex) {
                total++;
            } if (this.getIndex(this.i - 1, this.j - 1) == mineIndex) {
                total++;
            } if (this.getIndex(this.i, this.j - 1) == mineIndex) {
                total++;
            } if (this.getIndex(this.i + 1, this.j - 1) == mineIndex) {
                total++;
            } if (this.getIndex(this.i + 1, this.j) == mineIndex) {
                total++;
            } if (this.getIndex(this.i + 1, this.j + 1) == mineIndex) {
                total++;
            } if (this.getIndex(this.i, this.j + 1) == mineIndex) {
                total++;
            } if (this.getIndex(this.i - 1, this.j + 1) == mineIndex) {
                total++;
            }
        }
        this.minesCount = total;
        if (this.mine) this.minesCount = -1;
    }

    floodFill() {
        let neighbors = [];
        neighbors.push(cells[this.getIndex(this.i - 1, this.j)]);
        neighbors.push(cells[this.getIndex(this.i - 1, this.j - 1)]);
        neighbors.push(cells[this.getIndex(this.i, this.j - 1)]);
        neighbors.push(cells[this.getIndex(this.i + 1, this.j - 1)]);
        neighbors.push(cells[this.getIndex(this.i + 1, this.j)]);
        neighbors.push(cells[this.getIndex(this.i + 1, this.j + 1)]);
        neighbors.push(cells[this.getIndex(this.i, this.j + 1)]);
        neighbors.push(cells[this.getIndex(this.i - 1, this.j + 1)]);

        for (let cell of neighbors) {
            if (cell && !cell.mine && !cell.revealed) {
                cell.reveal();
            }
        }
    }

    contain(x, y) {
        return (x > this.x && x < this.x + this.size && y > this.y && y < this.y + this.size);
    }

    reveal() {
        this.revealed = true;
        if (this.minesCount == 0) {
            this.floodFill();
        }
    }
}