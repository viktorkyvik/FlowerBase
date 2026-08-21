@ -1,60 +1 @@
import network
import time
import ubinascii
import machine
import urequests
from secrets import WIFI_SSID, WIFI_PASSWORD, SERVER_URL


HEARTBEAT_URL = SERVER_URL + "/api/esp32/heartbeat"
READINGS_URL = SERVER_URL + "/api/readings"


DEVICE_ID = ubinascii.hexlify(machine.unique_id()).decode()
#functions

def connect_to_wifi():  #connecting to wifi
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print("Connecting to wifi...")
        wlan.connect(WIFI_SSID, WIFI_PASSWORD)
        while not wlan.isconnected():
            time.sleep(1)
        print("Connection secured! IP:", wlan.ifconfig()[0])


def send_heartbeat():
    try:
        payload = {"device_id": DEVICE_ID}
        response = urequests.post(HEARTBEAT_URL, json=payload)
        print("Heartbeat sent! Status:", response.status_code, response.text)
        response.close()
    except Exception as e:
        print("Couldnt send heartbeat:", e)


def read_sensor(): #rea  ding sensors. Currently using placeholder
    soil_moisture = 20.0
    tank_level = 40.0
    return soil_moisture, tank_level

def send_data(soil_moisture, tank_level):
    try:
        payload = {"soil_moisture": soil_moisture, "tank_level": tank_level}
        respons = urequests.post(READINGS_URL, json=payload)
        print("Sent! Status:", respons.status_code)
        respons.close()
    except Exception as e:
        print("Couldnt send:", e)

connect_to_wifi()
print("Device ID:", DEVICE_ID)

while True:
    send_heartbeat()
    time.sleep(10)


