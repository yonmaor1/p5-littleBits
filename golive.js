/**
 * starts the python server which hosts p5.js, and the node server which talks to the serial port
 * 
 * usage: $ node golive.js [serialPort] [-v] [-h]
 * 
 * @param {string} serialPort the serial port number to use. If your arduino is on serial port is /dev/cu.usbmodem2101, use 2101
 * @param {string} -v verbose mode 
 * @param {string} -h print this help message and exit
 */

const { exec } = require('child_process');

const port = 8081;

let args = process.argv.slice(2);
const verbose = args.includes('-v');
if (verbose) {
    args = args.filter(arg => arg != '-v');
}

const help = args.includes('-h');
if (help) {
    console.log('golive.js');
    console.log('starts the python server which hosts p5.js, and the node server which talks to the serial port');
    console.log('usage: $ node golive.js [serialPort] [-v] [-h]');
    console.log('');
    console.log('  serialPort : (required) the serial port number to use.');
    console.log('               If your arduino is on serial port is /dev/cu.usbmodem2101, use 2101');
    console.log('  -v : verbose mode');
    console.log('  -h : print this help message and exit');

    process.exit(0);
}

if (args.length < 1) {
    console.error('Error: serialPort argument is required');
    process.exit(1);
}

let python_server = exec(`python3 ./libs/server.py ${port}`, { cwd: __dirname });

python_server.stdout.on('data', (data) => {
    if (verbose) {
        console.log(`Python Server: ${data}`);
    }
});


python_server.stderr.on('data', (data) => {
    if (data.includes('Address already in use')) {
        console.log(`Port ${port} is already in use`);
        process.exit(1);
    }
    if (verbose){
        console.error(`Python Server Error: ${data}`);
    }
});

console.log(`hosting local server at http://localhost:${port}\n`);

// Start the Node.js server
let serialPortArg = args[0];
let serialPortNum = serialPortArg ? serialPortArg : "";
const nodeServer = exec(`node ./libs/server.js ${serialPortNum}`, { cwd: __dirname });

nodeServer.stdout.on('data', (data) => {
    if (verbose) {
        console.log(`Node.js Server: ${data}`);
    }
});

nodeServer.stderr.on('data', (data) => {
    if (data.includes('SerialPortNotFoundError')) {
        console.error(data);
        process.exit(1);
    } else if (data.includes(`cannot open /dev/cu.usbmodem${serialPortNum}`)) {
        console.error(`SerialPortNotFoundError: Serial port /dev/cu.usbmodem${serialPortNum} not found`);
        console.error('Did you enter the correct serial port number?');
        process.exit(1);
    }
    console.error(`Node.js Server Error: ${data}`);
});