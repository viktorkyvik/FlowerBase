#include <Arduino.h>
const int moisturePin = 34;

void setup() {
  Serial.begin(115200);
}

void loop() {
  int value = analogRead(moisturePin);

  Serial.print("Fuktighetsverdi: ");
  Serial.println(value);

  delay(1000);
             
}