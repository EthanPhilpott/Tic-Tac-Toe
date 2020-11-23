"use strict";

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

let cursor = new Cursor(document.getElementById('cursor'), 0.025, 1);

// had a hover effect to anything with the class "hover"

let els = document.getElementsByClassName('hover');
for (let i = 0; i < els.length; i++) {
    els[i].addEventListener('mouseenter', () => {
        cursor.Hover();
    })
    els[i].addEventListener('mouseleave', () => {
        cursor.Unhover();
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

// Switches the turns as the buttons are clicked by the player also does a cool fade in animation!

let boxes = document.getElementsByClassName('b')

for (let b of boxes) {
    b.addEventListener('click', (e) => {
        let button = e.path[0];
        if (!board[button.value]) {
            let opacity = 0;
            if (turn % 2 == 0) {
                board[button.value] = -1;
                let x = button.childNodes[1];
                x.style.display = "block";
                let id = setInterval(() => {
                    if (opacity == 1) {
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
                    if (opacity == 1) {
                        clearInterval(id);
                    } else {
                        o.style.opacity = opacity;
                        opacity += 0.01;
                    }
                }, 5)
            }
            let cw = CanWin();
            if (cw[0] === 1) {
                if (cw[1] > 0) {
                    Win('x');
                } else {
                    Win('o');
                }
            } else if (cw[0] === -1) {
                Win('tie');
            } else {
                Turn();
            }
        }
    })
}

function Turn () {
    if (difficulty === 'Player') {
        turn++;
    } else if (difficulty === "Easy") {
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

        let button = document.getElementsByClassName('b')[buttonNum]

        board[button.value] = 1;
        let opacity = 0;
        let o = button.childNodes[3];

        o.style.display = "block";
        let id = setInterval(() => {
            if (opacity == 1) {
                clearInterval(id);
            } else {
                o.style.opacity = opacity;
                opacity += 0.01;
            }
        }, 5)
    } else if (difficulty === "Hard") {
        // Does random 25% of time, does optimal 75% of the time
    } else if (difficulty === 'Impossible') {
        // Chooses optimally 100% if the time
    }
    let cw = CanWin();
    if (cw[0] === 1) {
        if (cw[1] > 0) {
            Win('x');
        } else {
            Win('o');
        }
        setTimeout (Reset, 1000);
    } else if (cw[0] === -1) {
        Win('tie');
        setTimeout (Reset, 1000);
    }
}

function CanWin () {
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
        if (board[win[0]] !== undefined && (board[win[0]] === board[win[1]] && board[win[1]] === board[win[2]])) {
            return [1, board[win[0]]]
        }
    }

    let hasUndef = false;
    for (let box of board) {
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

function Win (who) {
    Reset();
}

function Reset () {
    
    

    turn = 0;
    board = [,,,,,,,,,];
}



