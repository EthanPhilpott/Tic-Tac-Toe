"use strict";

// Sound effects

let click = new Audio('audio/click.mp3');
click.volume = .75;

let wrong = new Audio("audio/wrong.mp3");
wrong.volume = .50;

let win  = new Audio("audio/win.mp3");
win.volume = .80;

let lose = new Audio("audio/lose.mp3");
lose.playbackRate = 2;

// Custom Cursor Code

class Cursor {
    constructor (cursorHTML, friction, speed) {
        this.cursor = cursorHTML;
        this.friction = friction;
        this.speed = speed;

        this.precision = 2;

        this.mouse = {x: 0, y: 0};
        this.translation = {x: 1, y: 1};
        
        this.Events();
        this.Animate();
    }

    Events () {
        window.addEventListener ("mousemove", (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        })
    }

    Animate () {
        setInterval(() => {
            this.Render();
        }, this.speed) 
    }

    Update () {
        this.translation.x += (this.mouse.x - this.translation.x) * this.friction;
        this.translation.y += (this.mouse.y - this.translation.y) * this.friction;

        if (this.translation.x > window.innerWidth - 7.5)  this.translation.x = window.innerWidth  - 7.5;
        if (this.translation.y > window.innerHeight - 7.5) this.translation.y = window.innerHeight - 7.5;
    }

    Render () {
        this.Update();
        this.cursor.style.transform = "translate(" + this.translation.x.toFixed(this.precision) + 'px, ' + this.translation.y.toFixed(this.precision) + 'px)';
    }

    Hover () {
        this.cursor.style.background = `var(--cursor)`
    }
    Unhover () {
        this.cursor.style.background = 'var(--light)'
    }
}

let cursor = new Cursor(document.getElementById('cursor'), 0.2, 1);

// had a hover effect to anything with the class "hover"

let els = document.getElementsByClassName('hover');
for (let i = 0; i < els.length; i++) {
    els[i].addEventListener('mouseenter', () => {
        cursor.Hover();
    })
    els[i].addEventListener('mouseleave', () => {
        cursor.Unhover();
    })
    els[i].addEventListener('click', () => {
        click.play();
    })
}

// Deals with the difficutly settings

let diff = document.getElementsByClassName("slide-value");
let difficulty = 'Player';
for (let value of diff) {
    value.addEventListener('click', (e) => {
        if (!board.includes(1) && !board.includes(-1)) {
            let button = e.path[0];
            for (let element of diff) {
                element.style.background = "var(--light)";
            }
            button.style.background = "var(--midtone)";
            difficulty = button.textContent;
        }
    })
}

// The following deals with changing color themes

let themes = document.getElementsByClassName('theme');
let colors = [
    ['#ffc100', '#dbb335', '#fad973', '#fffcf1', '#e0ba87', '#ffebab'],
    ['#811112', '#881D1D', '#AC3834', '#CAB7A1', '#705b43', '#B29576'],
    ['#285A37', '#387F4C' ,'#55BB72', '#DFEBE5', '#E8C46A', '#A4D5BA'],
    ['#204051', '#3b6978', '#84a9ac', '#e4e3e3', '#eb7465', '#525454'],
    ['#2d2d2d', '#373737', '#464646', '#bdbdbd', '#2e404a', '#32393d'],
]
for (let i = 0; i < themes.length; i++) {
    themes[i].addEventListener("click", (e) => {
        ChangeTheme(colors[i])
    })
} 

let root = document.documentElement

function ChangeTheme (colors) {
    root.style.setProperty('--dark'      , colors[0])
    root.style.setProperty('--midtone'   , colors[1])
    root.style.setProperty('--light'     , colors[2])
    root.style.setProperty('--background', colors[3])
    root.style.setProperty('--cursor'    , colors[4])
    root.style.setProperty('--cross'     , colors[5])
}

// The actual game

let turn = 0;
let board = [,,,,,,,,,];

let boxes = document.getElementsByClassName('b');
let p1Score = document.getElementById("p1-score");
let p2Score = document.getElementById("p2-score");

for (let b of boxes) {
    b.addEventListener('click', Select)
}

let canClick = true;
function Select (e) {
    if (canClick) {    
        let button = e.path[0];
        if (!board[button.value]) {
            let opacity = 0;
            if (turn % 2 == 0) {
                board[button.value] = -1;
                let x = button.childNodes[1];
                x.style.display = "block";
                let id = setInterval(() => {
                    if (opacity >= 1) {
                        clearInterval(id);
                    } else {
                        x.style.opacity = opacity;
                        opacity += 0.01;
                    }
                }, 5)
            } else {
                board[button.value] = 1;
                let o = button.childNodes[3];
                o.style.display = "block";
                let id = setInterval(() => {
                    if (opacity >= 1) {
                        clearInterval(id);
                    } else {
                        o.style.opacity = opacity;
                        opacity += 0.01;
                    }
                }, 5)
            }
            let cw = CanWin(board);
            if (cw[0] === 1) {
                if (cw[1] < 0) {
                    Win('x', cw[2]);
                } else {
                    Win('o', cw[2]);
                }
            } else if (cw[0] === -1) {
                Win('tie');
            } else {
                Turn();
            }
        } else {
            wrong.play();
        }
    }
}

function Turn () {
    if (difficulty === 'Player') {
        turn++;
    } else if (difficulty === "Easy") {
        // Picks a random, empty place on the board
        let free = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] == undefined) {
                free.push(i)
            }
        }

        let buttonNum = Math.floor(Math.random() * 9)

        while (!free.includes(buttonNum)) {
            buttonNum = Math.floor(Math.random() * 9)
        }

        let button = boxes[buttonNum]

        board[button.value] = 1;
        let opacity = 0;
        let o = button.childNodes[3];

        o.style.display = "block";
        let id = setInterval(() => {
            if (opacity >= 1) {
                clearInterval(id);
            } else {
                o.style.opacity = opacity;
                opacity += 0.01;
            }
        }, 5)
    } else if (difficulty === "Hard") {
        let buttonNum = MiniMax(board, 0, true);
        console.log(buttonNum)
        let button = boxes[buttonNum]

        board[button.value] = 1;
        let opacity = 0;
        let o = button.childNodes[3];

        o.style.display = "block";
        let id = setInterval(() => {
            if (opacity >= 1) {
                clearInterval(id);
            } else {
                o.style.opacity = opacity;
                opacity += 0.01;
            }
        }, 5)
    } else if (difficulty === 'Impossible') {
        // Chooses optimally 100% if the time
    }
    let cw = CanWin(board);
    if (cw[0] === 1) {
        if (cw[1] < 0) {
            Win('x', cw[2]);
        } else {
            Win('o', cw[2]);
        }
    } else if (cw[0] === -1) {
        Win('tie');
    }
}

function MiniMax (tempBoard, depth, pturn) {
    // console.log(tempBoard)
    let cw = CanWin(tempBoard);
    if (cw[0] === 1) {
        if (cw[1] === -1) {
            return -1
        } else {
            return 1
        }
    } else if (cw[0] === -1) {
        return 0;
    } 
}

function CanWin (tempBoard) {
    let wincon = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]

    for (let win of wincon) {
        if (tempBoard[win[0]] !== undefined && (tempBoard[win[0]] === tempBoard[win[1]] && tempBoard[win[1]] === tempBoard[win[2]])) {
            return [1, tempBoard[win[0]], win]
        }
    }

    let hasUndef = false;
    for (let box of tempBoard) {
        if (box == undefined) {
            hasUndef = true;
            break;
        }
    }
    
    if (hasUndef) {
        return [0];
    } else {
        return [-1];
    }
}

function Win (who, play=0) {
    canClick = false;

    if (who === 'tie') {
        lose.play();
    } else {
        win.play();
    } 

    setTimeout(() => {
        if (play) {
            let bor = document.getElementById('board');
            let centerX = bor.offsetLeft + bor.offsetWidth / 2;
            let centerY = bor.offsetTop + bor.offsetHeight / 2;
            let amt = 0;
            let xOffT = [];
            let xOffL = [];
            let oOffT = [];
            let oOffL = [];
            let middle = document.getElementById('middle');

            for (let value of play) {
                let butt = boxes[value];
                let x = butt.childNodes[1];
                let o = butt.childNodes[3];
                
                xOffT.push(x.offsetTop  + x.offsetHeight / 2);
                xOffL.push(x.offsetLeft + x.offsetWidth  / 2);
                oOffT.push(o.offsetTop  + o.offsetHeight / 2);
                oOffL.push(o.offsetLeft + o.offsetWidth  / 2);
            }

            let id = setInterval(() => {
                if (amt >= 1) {
                    clearInterval(id)
                } else {
                    for (let i = 0; i < play.length; i++) {
                        let butt = boxes[play[i]];
                        let x = butt.childNodes[1];
                        let o = butt.childNodes[3];
                        
                        x.style.position = "relative";
                        o.style.position = "relative";

                        x.style.top  = (centerY - xOffT[i]) * amt + 'px';
                        x.style.left = (centerX - xOffL[i]) * amt + 'px';
                        o.style.top  = (centerY - oOffT[i]) * amt + 'px';
                        o.style.left = (centerX - oOffL[i]) * amt + 'px';
                    }
                    if (!play.includes(4)) {
                        middle.style.opacity = 1 - amt;
                    }
                    amt += 0.02;
                }
            }, 10)
        }

        setTimeout (() => {
            Reset();
            if (who !== 'tie') {
                setTimeout (() => {
                    for (let value of play) {
                        let butt = boxes[value];
                        let x = butt.childNodes[1];
                        let o = butt.childNodes[3];
                        
                        x.style.position = "block";
                        o.style.position = "block";
            
                        x.style.top  = '0px';
                        x.style.left = '0px';
                        o.style.top  = '0px';
                        o.style.left = '0px';
                    }
                }, 1000);
            }
            canClick = true;
            
        }, 1000);
    }, 1000);

    if (who === 'x') {
        p1Score.textContent = Number(p1Score.textContent) + 1;
    } else if (who === 'o') {
        p2Score.textContent = Number(p2Score.textContent) + 1;
    }
}

function Reset () {
    document.getElementById('middle').style.opacity = 1;
    let opacity = 1;
    let id = setInterval (() => {
        if (opacity <= 0) {
            for (let box of boxes) {
                box.childNodes[1].style.display = "none";
                box.childNodes[3].style.display = "none";
            }
            turn = 0;
            board = [,,,,,,,,,];
            clearInterval(id)
        } else {
            for (let box of boxes) {
                box.childNodes[1].style.opacity = opacity;
                box.childNodes[3].style.opacity = opacity;
            }
            opacity -= 0.01;
        }
    }, 5) 
}



