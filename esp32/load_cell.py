from machine import Pin
from hx711_gpio import HX711
import time

dt = Pin(16, Pin.IN)
sck = Pin(4, Pin.OUT)

hx711 = HX711(sck, dt)

hx711.tare()

while True:
    value = hx711.get_value()
    print("rawdata: ",  value)
    ''' for calibration
    known_weight = 500 #in gram, and also remember to actually claibrate withn this weight
    factor = value / known_weight
    print("factor: ", factor)'''
    time.sleep(2)
    print("gram: ", value/111)





def read_gram():
    return hx.read() / factor

    
