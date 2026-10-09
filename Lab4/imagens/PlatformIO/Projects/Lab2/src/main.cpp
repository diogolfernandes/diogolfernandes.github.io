#include <Arduino.h>
#include "esp_timer.h"

#define PIR_PIN       5
#define LIGHT_PIN     4
#define TRIG_PIN      20
#define ECHO_PIN      19
#define LED_PIN       21

#define LIGHT_THRESHOLD 350
#define DISTANCE_LIMIT  20.0

// TIMERS
hw_timer_t *lightTimer = NULL;
hw_timer_t *distanceTimer = NULL;
hw_timer_t *presenceTimer = NULL;
volatile bool lightTimerFlag = false;
volatile bool distanceTimerFlag = false;
volatile bool presenceTimerFlag = false;

// PIR
volatile bool motionEvent = false;
bool presence = false;

// SENSOR VALUES
int lightLevel = 0;
float distance = -1;

// PIR INTERRUPT
void IRAM_ATTR pir_isr() {
  motionEvent = true;
}

// LIGHT TIMER INTERRUPT
void IRAM_ATTR light_timer_isr() {
  lightTimerFlag = true;
}

// DISTANCE TIMER INTERRUPT
void IRAM_ATTR distance_timer_isr() {
  distanceTimerFlag = true;
}

// PRESENCE TIMER INTERRUPT
void IRAM_ATTR presence_timer_isr() {
  presenceTimerFlag = true;
}

float measureDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  unsigned long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) {
    return -1;
  }
  return duration * 0.0343 / 2.0;
}

void setup() {
  Serial.begin(115200);
  // GPIO
  pinMode(PIR_PIN, INPUT);
  pinMode(LIGHT_PIN, INPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(TRIG_PIN, LOW);
  digitalWrite(LED_PIN, LOW);
  attachInterrupt(digitalPinToInterrupt(PIR_PIN), pir_isr, RISING);

  // TIMER 1 - FOTODIODO
  lightTimer = timerBegin(1000000);
  timerAttachInterrupt(lightTimer, &light_timer_isr);
  timerAlarm(lightTimer, 1000000, false, 0);

  // TIMER 2 - HC-SR04
  distanceTimer = timerBegin(1000000);
  timerAttachInterrupt(distanceTimer, &distance_timer_isr);
  timerAlarm(distanceTimer, 500000, false, 0);
  
  // TIMER 3 - PRESENÇA
  presenceTimer = timerBegin(1000000);
  timerAttachInterrupt(presenceTimer, &presence_timer_isr);
}

void loop()
{
  // PIR
  if (motionEvent) {
    motionEvent = false;
    presence = true;
    // Iniciar/reiniciar período de 10 segundos
    timerAlarm(presenceTimer, 10000000, false, 0);
  }
  
  // FOTODIODO
  if (lightTimerFlag) {
    lightTimerFlag = false;
    lightLevel = analogRead(LIGHT_PIN);
    timerRestart(lightTimer);
    timerAlarm(lightTimer, 1000000, false, 0);
  }

  // HC-SR04
  if (distanceTimerFlag) {
    distanceTimerFlag = false;
    distance = measureDistance();
    timerRestart(distanceTimer);
    timerAlarm(distanceTimer, 500000, false, 0);
  }
  
  // TIMER PRESENÇA
  if (presenceTimerFlag) {
    presenceTimerFlag = false;
    presence = false;
    timerRestart(presenceTimer);
    timerAlarm(presenceTimer, 1000000, false, 0);
  }
  
  // CONDIÇÕES DE SEGURANÇA
  bool dark = lightLevel < LIGHT_THRESHOLD;
  bool objectTooClose = distance > 0 && distance < DISTANCE_LIMIT;  
  bool alarm = false;
  
  // Movimento + escuridão
  if (presence && dark) {
    alarm = true;
  }
  
  // Objeto demasiado próximo
  if (objectTooClose) {
    alarm = true;
  }

  // LED
  if (alarm) {
    digitalWrite(LED_PIN, HIGH);
  }else{
    digitalWrite(LED_PIN, LOW);
  }
  
  // MOSTRAR ESTADO
  Serial.println();
  Serial.println("================================");
  Serial.println("       SISTEMA DE SEGURANCA.    ");
  Serial.println("================================");
  Serial.print("Presenca:       ");
  if (presence) {
    Serial.println("SIM");
  }else{
    Serial.println("NAO");
  }
  Serial.print("Ambiente:       ");
  if (dark) {
    Serial.println("ESCURO");
  }else{
    Serial.println("CLARO");
  }
  Serial.print("Distancia:      ");
  if (distance > 0){
    Serial.print(distance);
    Serial.println(" cm");
  }else{
    Serial.println("Sem leitura");
  }
  Serial.print("Proximidade:    ");
  if (objectTooClose){
    Serial.println("PERIGO");
  }else{
    Serial.println("NORMAL");
  }
  Serial.println("--------------------------------");
  Serial.print("Estado:         ");
  if (alarm){
    Serial.println("!!! ALARME !!!");
  }else{
    Serial.println("NORMAL");
  }  
  Serial.println("================================");
  delay(200);
}