import os, time
from appium import webdriver
import pytest

class Ctx():
    """
    Shim around the context objet of behave
    """
    def __init__(self, driver):
        self.driver = driver

@pytest.fixture(scope="session")
def context(request):
    """ Sets up the application context."""
    desired_caps = {
        'platformName': 'Android',
        'platformVersion': '5.1.1',
        'deviceName': 'Android Emulator',
        'app' : os.path.realpath('../../platforms/android/build/outputs/apk/android-debug.apk')
    }
    context = Ctx(webdriver.Remote('http://127.0.0.1:4723/wd/hub', desired_caps))

    context.driver.implicitly_wait(45)

    def fin():
        try:
            context.driver.quit()
        except:
            pass
            
    request.addfinalizer(fin)

    return context

