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
    textFont('monospace');
    rectMode(CENTER);
}

function draw() {
    background(0);

    noStroke();
    fill('white');
    text('pLittleBits', width/2, 50);

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

            // The data looks like: `<d0,a0,a1>`
            // We need to split the string into an array of integers
            // First, remove the `<` and `>` characters from the string
            signal = signal.replace('<', '').replace('>', '');

            // Split the string into an array of integers
            [d0, a0, a1] = signal.split(',').map(Number);
            // print([d0, a0, a1])
        } else {
            console.error('Signal is undefined');
        }
    });
}

function drawInputSignals() {
    fill('white');
    noStroke();
    text('d0: ' + d0, width/4, height/4);
    text('a0: ' + a0, width/4, height/2);
    text('a1: ' + a1, width/4, 3 * height/4);

    display_d0 = d0 ? 0.9 * height/4 : 50;
    display_a0 = map(a0, 0, 1024, 50, 0.9 * height/4);
    display_a1 = map(a1, 0, 1024, 50, 0.9 * height/4);

    noFill();
    stroke('white');
    circle(width/4, height/4, display_d0);
    circle(width/4, height/2, display_a0);
    circle(width/4, 3 * height/4, display_a1);

    arrow(width/12, height/4, 50, 0);
    arrow(width/12, height/2, 50, 0);
    arrow(width/12, 3 * height/4, 50, 0);
}

function drawOutputSignals() {
    fill('white');
    noStroke();
    text('d1: ' + d1, width - width/4, height/4);
    text('d5: ' + d5, width - width/4, height/2);
    text('d9: ' + d9, width - width/4, 3 * height/4);

    display_d1 = map(d1, 0, 255, 50, 0.9 * height/4);
    display_d5 = map(d5, 0, 255, 50, 0.9 * height/4);
    display_d9 = map(d9, 0, 255, 50, 0.9 * height/4);

    noFill();
    stroke('white');
    circle(width - width/4, height/4, display_d1);
    circle(width - width/4, height/2, display_d5);
    circle(width - width/4, 3 * height/4, display_d9);

    arrow(width - width/12 - 50, height/4, 50, 0);
    arrow(width - width/12 - 50, height/2, 50, 0);
    arrow(width - width/12 - 50, 3 * height/4, 50, 0);
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