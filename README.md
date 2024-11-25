# p5-littleBits
get data in and out of LittleBits components via p5js / prossesing


---

## Setup Instructions

Fire up your favorite terminal, cd somewhere comfortable and clone this repo

```
$ git clone https://github.com/yonmaor1/p5-littleBits.git
$ cd p5-littleBits
```

### Arduino Instructions

We will flash a special program onto the LittleBits Arduino Bit. 

* Install the [Arduino IDE](https://www.arduino.cc/en/software). 
* Connect the LittleBits Arduino Bit to your computer's USB port. 
* Launch the Arduino IDE software. It may manage some additional installs the first time. 
* From Arduino IDE, open the file `p5-littleBits.ino`. 
* Make sure to select the "Arduino Leonardo" model of board in the pulldown menu. 
* In Arduino IDE menu: *Sketch > Verify/Compile* (Command-R)
* In Arduino IDE menu: *Sketch > Upload* (Command-U)


### Instructions for p5-to-LittleBits

Ensure you have [npm installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). You will need npm version 16.0.0 or higher.

Run: `$ npm install`

Ensure this worked by running: `$ npm list`

You should see something like this:

```
p5-flipdots@1.0.0 /path/to/p5-flipdots
├── axios@1.7.7
├── body-parser@1.20.3
├── child_process@1.0.2
├── cors@2.8.5
└── express@4.21.1
```

To launch the program, run

```
$ node golive.js [-v : optional, enables verbose mode]
``` 

and navigate to http://localhost:8081/p5 in your favorite web browser

TODO:

serial port disconnects on power surge (?)
```
Node.js Server Error: Error writing to serial port: ENXIO: no such device or address, write

Node.js Server Error: Error writing to serial port: ENXIO: no such device or address, write
Error writing to serial port: ENXIO: no such device or address, write
Error writing to serial port: ENXIO: no such device or address, write
Error writing to serial port: ENXIO: no such device or address, write

Node.js Server Error: Error: [Error: ENXIO: no such device or address, write] {
  errno: -6,
  code: 'ENXIO',
  syscall: 'write',
  disconnect: true
}
```
