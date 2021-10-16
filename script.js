const playField = document.getElementsByClassName("play-field")[0];
const form = document.forms.form;
const formPF = document.forms.form2;
const timer = document.getElementById('timer');

formPF.elements.button.addEventListener('click', startGame);

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let countPop = 0;

function createCircles(num, maxD, minD, maxVX, maxVY, maxRight, maxTop) {
    let circles = [];
    for (let i = 0; i < num; i++) {
        //calculate
        const d = Math.floor(Math.random() * (maxD - minD)) + minD;
        const r = Math.floor(Math.random() * (256));
        const g = Math.floor(Math.random() * (256));
        const b = Math.floor(Math.random() * (256));
        const color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
        const vx = Math.random() * maxVX * Math.pow(-1, getRandomInt(2));
        const vy = Math.random() * maxVY * Math.pow(-1, getRandomInt(2));
        const right = Math.random() * (maxRight - d);
        const top = Math.random() * (maxTop - d);
        //create circle
        let circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.height = String(d) + 'px';
        circle.style.width = String(d) + 'px';
        circle.style.backgroundColor = color;
        circle.style.right = String(right) + 'px';
        circle.style.top = String(top) + 'px';
        circle.addEventListener('click', dn);
        function dn() {
            this.style.display = 'none';
            countPop += 1;
        }
        circles.push([circle, vx, vy, d, right, top]);
    }
    return circles;
}

let circles = [];
let gameTime = 15;
let gameStarted = false;
const pfSet = document.getElementsByClassName('pf-set')[0];
const startSet = document.getElementsByClassName('start-game')[0];
const endSet = document.getElementsByClassName('end-game')[0];

function startGame() {
    for (let i = 0; i < circles.length; i++) {
        circles[i][0].remove()
    }
    circles = [];
    gameStarted = false;
    if (gameStarted) return;
    gameStarted = true;
    pfSet.classList.add('hiding');
    setTimeout(() => {pfSet.classList.remove('hiding'); pfSet.classList.add('hide')}, 300);
    setTimeout(() => {startSet.classList.add('hide')}, 300);
    var start = null;
    let h = playField.scrollHeight;
    let w = playField.scrollWidth;
    if (form.elements.range.value === '1') {
        circles = createCircles(50, 80, 40, 1, 1, w, h);
    } else if (form.elements.range.value === '2') {
        circles = createCircles(50, 60, 20, 3, 3, w, h);
    } else {
        circles = createCircles(50, 60, 20, 5, 5, w, h);
    }
    for (let i = 0; i < circles.length; i++) {
        playField.append(circles[i][0]);
    }
    console.log(circles);
    function step(timestamp) {
        if (!start) start = timestamp;
        var progress = timestamp - start;
        for (let i = 0; i < circles.length; i++) {
            if (circles[i][4] + circles[i][1] + circles[i][3] <= w && circles[i][4] >= 0) {
                circles[i][4] += circles[i][1];
            } else {
                circles[i][1] = -circles[i][1];
                circles[i][4] += circles[i][1];
            }
            if (circles[i][5] + circles[i][2] + circles[i][3] <= h && circles[i][5] >= 0) {
                circles[i][5] += circles[i][2];
            } else {
                circles[i][2] = -circles[i][2];
                circles[i][5] += circles[i][2];
            }
            circles[i][0].style.right = String(circles[i][4]) + 'px';
            circles[i][0].style.top = String(circles[i][5]) + 'px';
        }
        let time = gameTime - Math.floor(progress / 1000);
        timer.textContent = 'Осталось секунд: ' + String(time);
        if (time > 0) {
            window.requestAnimationFrame(step);
        } else {
            endGame();
        }
    }
    window.requestAnimationFrame(step);
}

function endGame() {
    pfSet.classList.add('hiding');
    pfSet.classList.remove('hide');
    setTimeout(() => {pfSet.classList.remove('hiding')}, 300);
    endSet.classList.remove('hide');
    endSet.children[0].textContent = 'Игра окночена. Количество лопнутых шариков за все игры: ' + String(countPop);
    setTimeout(() => {document.getElementById('closeEndGame').addEventListener('click', clo)}, 1000);
    function clo() {
        endSet.classList.add('hide');
        startSet.classList.remove('hide');
    }
}