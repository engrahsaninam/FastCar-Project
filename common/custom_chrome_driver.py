#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Author :  @fangwangme
Time   :  2023-04-27
Desc   :  
"""

import sys
import pathlib

import seleniumwire.undetected_chromedriver.v2 as uc


sys.path.append("{}/../".format(pathlib.Path(__file__).parent))
from common.logger import logger
from common import settings, tools


class CustomChromeDriver:
    def __init__(self, page_load_strategy="normal"):
        self.page_load_strategy = page_load_strategy
        self.driver = None

    def __enter__(self):
        self.start()
        return self.driver

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.quit()

    def start(self):
        self.driver = create_custom_driver(self.page_load_strategy)

    def quit(self):
        self.driver.quit()


# another create driver with selenium
def create_custom_driver(page_load_strategy="normal"):
    # other chrome options
    chrome_options = uc.ChromeOptions()

    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-infobars")
    chrome_options.add_argument("--disable-dev-shm-usage")

    # set headless mode
    headless_flag = tools.get_headless_flag()
    if headless_flag:
        chrome_options.add_argument("--headless")
        # set user agent with value in the settings
        chrome_options.add_argument("--user-agent={}".format(settings.USER_AGENT))
    chrome_options.headless = headless_flag

    # disable gpu
    chrome_options.add_argument("--disable-gpu")
    # incognito mode
    # chrome_options.add_argument("--incognito")

    chrome_options.add_argument("--window-size=maximize")
    chrome_options.add_argument("--disable-extensions")
    chrome_options.add_argument("--disable-application-cache")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-setuid-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")

    # use sytem proxy
    chrome_options.add_argument("--proxy-server=127.0.0.1:8889")

    # set proxy
    seleniumwire_options = {
        "proxy": {
            "http": "http://127.0.0.1:8889",
            "https": "https://127.0.0.1:8889",
            "no_proxy": "localhost,127.0.0.1",
        }
    }

    # # disable images
    prefs = {"profile.managed_default_content_settings.images": 1}
    chrome_options.add_experimental_option("prefs", prefs)

    # page loading strategy   none / eager / normal
    chrome_options.page_load_strategy = page_load_strategy

    # create undetected chromedriver with selenium-wire
    driver = uc.Chrome(
        options=chrome_options, seleniumwire_options=seleniumwire_options
    )
    logger.info("create undetected chromedriver with selenium-wire")

    return driver
