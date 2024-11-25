import processing.serial.*;

String portName = "/dev/tty.usbmodem2101";

Serial myPort;
String latestData = "";
int d0, a0, a1;
int d1, d5, d9;

/**
 * @brief setup the canvas and serial port
 */
void setup() {
  size(800, 600);
  myPort = new Serial(this, portName, 9600);
  myPort.bufferUntil('\n');
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
}

/**
 * @brief main draw loop
 */
void draw() {
  background(0);

  // Input signals
  getInputSignals();
  drawInputSignals();

  // Output signals
  drawOutputSignals();

  d1 = mousePressed ? 255 : 0;
  d5 = int(map(mouseX, 0, width, 0, 255, true));
  d9 = int(map(mouseY, 0, height, 0, 255, true));

  writeSignal();
}

/**
 * @brief handle serial events
 */
void serialEvent(Serial myPort) {
  latestData = myPort.readStringUntil('\n');
  latestData = trim(latestData);
}

/**
 * @brief get a message from the serial port and populate the globals with it
 */
void getInputSignals() {
  if (latestData != null && !latestData.isEmpty()) {
    String[] values = split(latestData, ',');
    if (values.length == 3) {
      d0 = int(values[0]);
      a0 = int(values[1]);
      a1 = int(values[2]);
    }
  }
}

/**
 * @brief draw the input signals
 */
void drawInputSignals() {
  fill(255);
  text("d0: " + d0, width / 4, height / 4);
  text("a0: " + a0, width / 4, height / 2);
  text("a1: " + a1, width / 4, 3 * height / 4);

  noFill();
  stroke(255);
  ellipse(width / 4, height / 4, 50 + 1024 * (d0 / 10));
  ellipse(width / 4, height / 2, 50 + a0 / 10);
  ellipse(width / 4, 3 * height / 4, 50 + a1 / 10);
}

/**
 * @brief draw the output signals
 */
void drawOutputSignals() {
  fill(255);
  text("d1: " + d1, width - width / 4, height / 4);
  text("d5: " + d5, width - width / 4, height / 2);
  text("d9: " + d9, width - width / 4, 3 * height / 4);

  noFill();
  stroke(255);
  ellipse(width - width / 4, height / 4, 50 + 4 * (d1 / 10));
  ellipse(width - width / 4, height / 2, 50 + 4 * (d5 / 10));
  ellipse(width - width / 4, 3 * height / 4, 50 + 4 * (d9 / 10));
}

/**
 * @brief write a signal to the serial port
 */
void writeSignal() {
  String msg = "<" + d1 + "," + d5 + "," + d9 + ">";
  myPort.write(msg);
}