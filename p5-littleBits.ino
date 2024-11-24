
// values received from serial, to be outputted from arduino
int d1 = 0, d5 = 0, d9 = 0;

// values inputted to arduino, to be transmitted over serial
int d0 = 0, a0 = 0, a1 = 0;

// temp arrays to hold message while parsing
const byte numChars = 32;
char receivedChars[numChars];
char tempChars[numChars];

boolean newData = false;

void setup() {
  Serial.begin(9600);
  Serial.println("Expecting data in this style : <0, 12, 24>  ");
}

void loop() {

  // read serial data
  recvWithStartEndMarkers();
  if (newData == true) {
    strcpy(tempChars, receivedChars); // temporary copy to protect the original data
    parseData();
    // showParsedData(); // write parsed data to serial monitor (debug)
    outputParsedData(); // output parsed data to output pins
    newData = false;
  }

  // read digital / analog input data
  d0 = digitalRead(0);
  a0 = analogRead(A0);
  a1 = analogRead(A1);

  transmitData();
}

void transmitData() {
  // Serial.print("Received: ");
  Serial.print(d0);
  Serial.print(",");
  Serial.print(a0);
  Serial.print(",");
  Serial.println(a1);
}

void recvWithStartEndMarkers() {
  static boolean recvInProgress = false;
  static byte recvIndex = 0;
  char startMarker = '<';
  char endMarker = '>';
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

  strtokIndex = strtok(tempChars,",");
  d1 = atoi(strtokIndex);

  strtokIndex = strtok(NULL, ",");
  d5 = atoi(strtokIndex);

  strtokIndex = strtok(NULL, ",");
  d9 = atoi(strtokIndex);

}

void showParsedData() {
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
