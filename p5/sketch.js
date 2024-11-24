const ENABLE_TX = true; // set to true to enable sending signals to flipdot display

// input data
let d0, a0, a1;

// output data
let d1, d5, d9;

//------------------------------------------------------------
function setup() {
    canvas = createCanvas(800, 600);
}

//------------------------------------------------------------
function draw() {
    background(0);
    read_signal().then(signal => {
        if (signal) {
            // data = signal.data;
            [d0, a0, a1] = signal.split(',').map(Number);
            // print([d0, a0, a1])
        } else {
            console.error('Signal is undefined');
        }
    });

    fill('white')
    textAlign(CENTER, CENTER);

    text('d0: ' + d0, width/4, height/2);
    text('a0: ' + a0, width/2, height/2);
    text('a1: ' + a1, 3 * width/4, height/2);

    noFill();
    stroke('white');
    ellipse(width/4, height/2, 50 + d0 / 10);
    ellipse(width/2, height/2, 50 + a0 / 10);
    ellipse(3 * width/4, height/2, 50 + a1 / 10);

    d1 = mouseIsPressed ? 1024 : 0;
    d5 = map(mouseY, 0, height, 0, 1024 / 4);
    d9 = map(mouseX, 0, width, 0, 1024 / 4);
    write_signal();

}

//------------------------------------------------------------
function write_signal() {
    if (ENABLE_TX) {
        msg = `<${int(d1)},${int(d5)},${int(d9)}>`;
        send_signal(msg);
    }
}