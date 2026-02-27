document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left');
    const result = document.querySelector('#result');
    const resetBtn = document.querySelector('#reset-btn');

    let width = 10;
    let bombAmount = 20;
    let flags = 0;
    let squares = [];
    let isGameOver = false;

    function createBoard() {
        // Reset state [cite: 1, 11]
        grid.innerHTML = '';
        squares = [];
        isGameOver = false;
        flags = 0;
        flagsLeft.innerHTML = bombAmount;
        result.innerHTML = '';

        // Create and shuffle game array [cite: 1, 2]
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width * width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray).sort(() => Math.random() - 0.5);

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(gameArray[i]);
            grid.appendChild(square);
            squares.push(square);

            square.addEventListener('click', () => handleClick(square));
            square.oncontextmenu = (e) => {
                e.preventDefault();
                addFlag(square);
            };
        }

        // Add numerical proximity markers [cite: 3, 4]
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('valid')) {
                squares[i].setAttribute('data', countAdjacentBombs(i));
            }
        }
    }

    function countAdjacentBombs(i) {
        let total = 0;
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width - 1);

        // Vector offsets for all 8 directions [cite: 3, 4]
        const offsets = [
            { val: -1, cond: !isLeftEdge },
            { val: 1, cond: !isRightEdge },
            { val: -width, cond: true },
            { val: width, cond: true },
            { val: -width - 1, cond: !isLeftEdge },
            { val: -width + 1, cond: !isRightEdge },
            { val: width - 1, cond: !isLeftEdge },
            { val: width + 1, cond: !isRightEdge }
        ];

        offsets.forEach(offset => {
            const targetIndex = i + offset.val;
            if (offset.cond && targetIndex >= 0 && targetIndex < squares.length) {
                if (squares[targetIndex].classList.contains('bomb')) total++;
            }
        });
        return total;
    }

    function handleClick(square) {
        if (isGameOver || square.classList.contains('checked') || square.classList.contains('flag')) return;

        if (square.classList.contains('bomb')) {
            gameOver();
        } else {
            let total = square.getAttribute('data');
            if (total != 0) {
                square.classList.add('checked');
                square.innerHTML = total; 
                // Apply color classes for UX [cite: 6]
                const colors = ['one', 'two', 'three', 'four'];
                if (total <= 4) square.classList.add(colors[total - 1]);
            } else {
                checkSquare(square.id);
            }
            square.classList.add('checked');
        }
        checkForWin();
    }

    function addFlag(square) {
        if (isGameOver || square.classList.contains('checked')) return;
        if (!square.classList.contains('flag') && (flags < bombAmount)) {
            square.classList.add('flag');
            square.innerHTML = '🚩'; 
            flags++;
        } else if (square.classList.contains('flag')) {
            square.classList.remove('flag');
            square.innerHTML = '';
            flags--;
        }
        flagsLeft.innerHTML = bombAmount - flags;
        checkForWin();
    }

    function checkSquare(currentId) {
        const i = parseInt(currentId);
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width - 1);

        // Recursive flood-fill [cite: 7, 10]
        setTimeout(() => {
            const offsets = [-1, 1, -width, width, -width - 1, -width + 1, width - 1, width + 1];
            offsets.forEach(offset => {
                const targetId = i + offset;
                const isSideCheck = (offset === -1 || offset === -width - 1 || offset === width - 1) ? !isLeftEdge :
                                    (offset === 1 || offset === -width + 1 || offset === width + 1) ? !isRightEdge : true;

                if (isSideCheck && targetId >= 0 && targetId < squares.length) {
                    handleClick(squares[targetId]);
                }
            });
        }, 10);
    }

    function gameOver() {
        result.innerHTML = 'BOOM! Game Over!';
        isGameOver = true; 
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣'; 
                square.classList.add('checked');
            }
        });
    }

    function checkForWin() {
        let matches = 0;
        let safeSquaresRevealed = 0;

        squares.forEach(sq => {
            if (sq.classList.contains('flag') && sq.classList.contains('bomb')) matches++;
            if (sq.classList.contains('checked') && !sq.classList.contains('bomb')) safeSquaresRevealed++;
        });

        // Improved win condition 
        if (matches === bombAmount || safeSquaresRevealed === (width * width - bombAmount)) {
            result.innerHTML = 'YOU WIN!';
            isGameOver = true;
        }
    }

    resetBtn.addEventListener('click', createBoard);
    createBoard();
});