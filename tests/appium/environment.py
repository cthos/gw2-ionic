import unittest, os, time
from appium import webdriver
from selenium.webdriver.common.by import By

def before_all(context):
    desired_caps = {
        'platformName': 'Android',
        'platformVersion': '4.2',
        'deviceName': 'Android Emulator',
        'app' : os.path.realpath('../platforms/android/build/outputs/apk/android-debug.apk')
    }
    context.driver = webdriver.Remote('http://localhost:4723/wd/hub', desired_caps)

def after_all(context):
    context.driver.quit()