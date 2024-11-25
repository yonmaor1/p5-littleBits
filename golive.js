const { exec } = require('child_process');

const port = 8081;

let args = process.argv.slice(2);
const verbose = args.includes('-v');
if (verbose) {
    args = args.filter(arg => arg != '-v');
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

console.log(`hosting local server at http://localhost:${port}`);

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
    }
    console.error(`Node.js Server Error: ${data}`);
});