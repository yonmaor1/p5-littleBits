/**
 * 
 * Little Bits arduino program to write and receive data over serial
 *
 * specs: 
 *     arduino model : Arduino Leonardo
 *     baud rate : 9600
 *     data in from arduino : 0 - 1024
 *     data out from arduino : 0 - 255
 *     data sent from arduino must be received over serial in the following format:
 *         three comma-seperated integers, values 0 - 255, with optional space after seperator,
 *         with start / end delimiters < and >.
 *         ie: <0, 12, 24>
 * 
 */

// values received from serial, to be outputted from arduino
int d1 = 0, d5 = 0, d9 = 0;
const int maxOutput = 255;

// values inputted to arduino, to be transmitted over serial
int d0 = 0, a0 = 0, a1 = 0;

// temp arrays to hold message while parsing
const byte numChars = 32;
char receivedChars[numChars];
char tempChars[numChars];

boolean newData = false;

const char startMarker = '<';
const char endMarker = '>';
const char *separator = ",";

void setup() {
  Serial.begin(9600);
  Serial.println("Expecting data in this style : <0, 12, 24>  "); // integers must be 0 - 255, spaces no required
}

void loop() {

  // read serial data and parse it
  receiveData();

  // read digital / analog input data and echo to serial port
  transmitData();
}

void receiveData() {
  recvWithStartEndMarkers();
  if (newData == true) {
    strcpy(tempChars, receivedChars); // temporary copy to protect the original data
    parseData();
    // echoReceived(); // write parsed data to serial monitor (debug)
    outputParsedData(); // output parsed data to output pins
    newData = false;
  }
}

void transmitData() {
  d0 = digitalRead(0);
  a0 = analogRead(A0);
  a1 = analogRead(A1);
  echoTransmitted();
}

void echoTransmitted() {
  Serial.print(startMarker);
  Serial.print(d0);
  Serial.print(",");
  Serial.print(a0);
  Serial.print(",");
  Serial.print(a1);
  Serial.println(endMarker);
}

void recvWithStartEndMarkers() {
  static boolean recvInProgress = false;
  static byte recvIndex = 0;
  char rc;

  while (Serial.available() > 0 && newData == false) {
    rc = Serial.read();

    if (recvInProgress == true) {
      if (rc != endMarker) {
        receivedChars[recvIndex] = rc;
        recvIndex++;
        if (recvIndex >= numChars) {
            recvIndex = numChars - 1;
        }
      }
      else {
        receivedChars[recvIndex] = '\0'; // terminate the string
        recvInProgress = false;
        recvIndex = 0;
        newData = true;
      }
    }

    else if (rc == startMarker) {
      recvInProgress = true;
    }
  }
}

void parseData() {
  char *strtokIndex;

  strtokIndex = strtok(tempChars, separator);
  d1 = constrain(atoi(strtokIndex), 0, maxOutput);

  strtokIndex = strtok(NULL, separator);
  d5 = constrain(atoi(strtokIndex), 0, maxOutput);

  strtokIndex = strtok(NULL, separator);
  d9 = constrain(atoi(strtokIndex), 0, maxOutput);
}

void echoReceived() {
  Serial.print(d1);
  Serial.print(',');
  Serial.print(d5);
  Serial.print(',');
  Serial.print(d9);
  Serial.println();
}

void outputParsedData() {
  analogWrite(1, d1);
  analogWrite(5, d5);
  analogWrite(9, d9);
}

