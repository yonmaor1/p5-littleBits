const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const axios = require('axios');
const app = express();
const port = 3000;

const serialPortPath = '/dev/cu.usbmodem11301'; // Replace with your serial port path
const baudRate = 9600;

const serialPort = new SerialPort({
  path: serialPortPath,
  baudRate: baudRate,
  // autoOpen: false,
});

const parser = new ReadlineParser();
serialPort.pipe(parser);

let latestData = '';

parser.on('data', data => {
  // console.log(data);
  latestData = data;
});

serialPort.on('error', err => {
  console.error('Error:', err);
});

app.use(bodyParser.json());
app.use(cors());

process.on('uncaughtException', (err) => {
  if (err.message.includes(`cannot open ${serialPortPath}`)) {
    console.error(`SerialPortNotFoundError: Serial port ${serialPortPath} not found`);
    process.exit(1);
  }
});

app.post('/send-signal', (req, res) => {
  // console.log(req);
  const msg = req.body.msg;

  if (typeof msg === 'undefined') {
    console.error('Error: message is undefined');
    res.status(400).send('Error: message is undefined');
    return;
  }

  if (msg == 'TX_OFF') {
    console.log('You are not transmitting data to the flipdot display. If this is not intended, please check that ENABLE_TX is set to true in flipdot.js');
    res.send('Signal sent to serial port');
    return;
  }

  // const byteArray = msg.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
  // const buffer = Buffer.from(byteArray);

  serialPort.write(msg, (err) => {
    if (err) {
      console.error('Error writing to serial port:', err.message);
      res.status(500).send('Error writing to serial port');
    } else {
      // console.log('Signal sent to serial port');
      res.send('Signal sent to serial port');
    }
  });
});

app.get('/read-signal', (req, res) => {
  res.send({ message: latestData });
});

app.listen(port, () => {
  console.log(`Node.js server listening at http://localhost:${port}`);
});