# p5-littleBits
get data in and out of LittleBits components via p5js / prossesing

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