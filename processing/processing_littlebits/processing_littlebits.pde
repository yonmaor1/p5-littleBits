import processing.serial.*;
Serial mySerialPort;
String rcvBuffer = "";

/* Connections: 
 *
 * Input Sensors: 
 * littleBits button module (i3) connected to d0 on littleBits Arduino. 
 * littleBits slide dimmer (i5)  connected to a0 on littleBits Arduino.  
 * littleBits slide dimmer (i5)  connected to a1 on littleBits Arduino. 
 * 
 * Output Actuators:
 * littleBits number display (o21) connected to d1 on littleBits Arduino. 
 * littleBits number display (o21) connected to d5 on littleBits Arduino. 
 * littleBits number display (o21) connected to d9 on littleBits Arduino. 
 * Output switches on littleBits Arduino are set to "analog" (not "pwm"). 
 * 
 * littleBits Arduino connected via USB cable to computer USB port. 
 * littleBits power (p3) connected via split cables (w19) to button and sliders. 
*/

// Inputs: variables for sensor readings
int d0 = 0; // 0 or 1
int a0 = 0; // 0....1023
int a1 = 0; // 0....1023

// Outputs: variables for signals to actuators
int d1 = 0; // 0...255
int d5 = 0; // 0...255
int d9 = 0; // 0...255


//=============================================================
void setup(){
  size(512, 512);

  println ((Object[])Serial.list()); 
  // Use this to determine the index of your littleBits Arduino's serial port:
  // count, starting with 0, the listed serial ports until you reach your littleBits Arduino;
  // place that number in the command below
  // EXAMPLE: mySerialPort = new Serial(this, Serial.list()[ your serial port number ], 9600);
  mySerialPort = new Serial(this, Serial.list()[1], 9600);
  mySerialPort.bufferUntil('\n');
}

//=============================================================
void draw() {
  background(50);

  // Transmit data to the Arduino
  d1 = ((mousePressed) ? 255 : 0); 
  d5 = (int)constrain(map(mouseX, 0, width, 0, 255),0,255);
  d9 = (int)constrain(map(mouseY, 0, height, 0, 255),0,255);
  String str = "<" + d1 + "," + d5 + "," + d9 + ">\n";
  mySerialPort.write(str);

  // Read data from the Arduino
  // If there is serial data waiting, execute serialEvent()
  while (mySerialPort.available() > 0) {
    serialEvent(mySerialPort.read());
  }
  
  
  // Draw a representation of the actuator control signals
  float mx = map(d5, 0,255, 0,width); 
  float my = map(d9, 0,255, 0,height); 
  stroke(128); 
  strokeWeight(5); 
  line(mx,0, mx,height); 
  line(0,my, width,my); 
  fill ((d1 > 0) ? 180:0);
  circle(mx,my,64); 
  
  // Use the two slider sensors to control a crosshair
  float px = map(a0, 0,1024, 0,width); 
  float py = map(a1, 0,1024, 0,height);
  stroke(255); 
  strokeWeight(5);
  line(px,0, px,height); 
  line(0,py, width,py); 
  
  // Use the button sensor to control a fill color
  fill ((d0 > 0) ? 200:0);
  circle(px,py,96); 
}


//=============================================================
// Handle incoming serial data from the littleBits Arduino module.
void serialEvent(int serial){
  final int NEWLINE = 10;
  if (serial != NEWLINE) {
    // Store all the characters on the line.
    rcvBuffer += char(serial);
 
  } else {
    try {
      if (rcvBuffer.length() > 0){
        // Remove NEWLINE
        rcvBuffer = rcvBuffer.substring(0, rcvBuffer.length()-1); 
        // Remove < and > delimiters
        if (rcvBuffer.startsWith("<") && rcvBuffer.endsWith(">")){
          rcvBuffer = rcvBuffer.substring(1, rcvBuffer.length()-1);
          String pieces[] = split(rcvBuffer, ','); 
          if (pieces.length == 3){
            d0 = Integer.parseInt(pieces[0]);
            a0 = Integer.parseInt(pieces[1]);
            a1 = Integer.parseInt(pieces[2]);
          }
        }
      }
    } catch (Exception e){
      ;
    }
    rcvBuffer = "";
  }
}