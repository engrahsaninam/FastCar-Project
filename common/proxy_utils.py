#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Author :  @fangwangme
Time   :  2023-04-27
Desc   :  
"""

import random
import pathlib
import configparser


def parse_proxy_config(proxy_type=""):
    config = configparser.RawConfigParser()
    config.read("{}/../config.ini".format(pathlib.Path(__file__).parent))

    if not proxy_type:
        proxy_type = config.get("RUNNING", "PROXY_TYPE")

        proxy_user = config.get(proxy_type, "USER")
        proxy_password = config.get(proxy_type, "PASSWORD")

        if proxy_type == "PROXY_IP":
            proxy_list = config.get(proxy_type, "IPS").split(";")
            proxy_addr = random.choice(proxy_list)
        else:
            proxy_addr = config.get(proxy_type, "ADDRESS")
    elif proxy_type == "PROXY_IP":
        proxy_user = config.get(proxy_type, "USER")
        proxy_password = config.get(proxy_type, "PASSWORD")
        proxy_list = config.get(proxy_type, "IPS").split(";")
        proxy_addr = random.choice(proxy_list)

    return proxy_addr, proxy_user, proxy_password


# get one-time proxy
def get_proxy():
    proxy_str, proxy_user, proxy_password = parse_proxy_config()

    if proxy_user and proxy_password:
        proxies = {
            "http": "http://{}:{}@{}".format(proxy_user, proxy_password, proxy_str),
            "https": "http://{}:{}@{}".format(proxy_user, proxy_password, proxy_str),
        }
    else:
        proxies = {
            "http": "http://{}".format(proxy_str),
            "https": "http://{}".format(proxy_str),
        }

    return proxies


def get_proxy_of_selenium():
    proxy_str, proxy_user, proxy_password = parse_proxy_config()
    proxy_data = None
    if proxy_user and proxy_password:
        proxy_data = (proxy_str, proxy_user, proxy_password)
    else:
        proxy_data = (proxy_str,)

    return proxy_data


def test_proxy():
    import requests

    url = "https://httpbin.org/ip"
    s = requests.Session()

    r = s.get(url, proxies=get_proxy(), timeout=10)
    print(r.status_code, r.text)


if __name__ == "__main__":
    test_proxy()
