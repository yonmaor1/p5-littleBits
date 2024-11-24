// set to true to enable sending signals to arduino
const ENABLE_TX = true;

// input data
let d0, a0, a1;

// output data
let d1, d5, d9;

let canvas;

function setup() {
    canvas = createCanvas(800, 600);
    textAlign(CENTER, CENTER);
    rectMode(CENTER);
}

function draw() {
    background(0);

    getInputSignals()
    drawInputSignals()

    drawOutputSignals()

    d1 = int(mouseIsPressed ? 255 : 0);
    d5 = int(map(mouseX, 0, width, 0, 255, true));
    d9 = int(map(mouseY, 0, height, 0, 255, true));
    
    writeSignal();

}

function getInputSignals() {
    read_signal().then(signal => {
        if (signal) {
            // data = signal.data;
            [d0, a0, a1] = signal.split(',').map(Number);
            // print([d0, a0, a1])
        } else {
            console.error('Signal is undefined');
        }
    });
}

function drawInputSignals() {
    fill('white');
    text('d0: ' + d0, width/4, height/4);
    text('a0: ' + a0, width/4, height/2);
    text('a1: ' + a1, width/4, 3 * height/4);

    noFill();
    stroke('white');
    ellipse(width/4, height/4, 50 + 1024 * (d0 / 10));
    ellipse(width/4, height/2, 50 + a0 / 10);
    ellipse(width/4, 3 * height/4, 50 + a1 / 10);
}

function drawOutputSignals() {
    text('d1: ' + d1, width - width/4, height/4);
    text('d5: ' + d5, width - width/4, height/2);
    text('d9: ' + d9, width - width/4, 3 * height/4);

    noFill();
    stroke('white');
    ellipse(width - width/4, height/4, 50 + 4 * (d1 / 10));
    ellipse(width - width/4, height/2, 50 + 4 * (d5 / 10));
    ellipse(width - width/4, 3 * height/4, 50 + 4 * (d9 / 10));
}

/**
 * @brief draw an arrow
 */
function arrow(x, y, length, angle) {
    push();
    translate(x, y);
    rotate(angle);
    line(0, 0, length, 0);
    line(length, 0, length - 10, -5);
    line(length, 0, length - 10, 5);
    pop();
}

/**
 * @brief write a signal to the node server, to be sent to the arduino over serial
 */
function writeSignal() {
    if (ENABLE_TX) {
        msg = `<${int(d1)},${int(d5)},${int(d9)}>`;
        send_signal(msg);
    }
}