#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Author :  @fangwangme
Time   :  2022-10-19
Desc   :  
"""

import configparser
import pathlib


# read config
def get_config_by_key(section_name, key_name):
    config = configparser.RawConfigParser()
    config_path = "{}/../config.ini".format(pathlib.Path(__file__).parent)
    config.read(config_path)
    return config.get(section_name, key_name)


# get retry times
def get_retry_times():
    retry_times = 1
    try:
        retry_times = int(get_config_by_key("RUNNING", "RETRY_TIMES"))
    except Exception as e:
        print(f"get_retry_times error: {str(e)}")

    return retry_times


# get workers
def get_workers():
    workers = 1
    try:
        workers = int(get_config_by_key("RUNNING", "WORKERS"))
    except Exception as e:
        print(f"get_workers error: {str(e)}")

    return workers


# get image workers
def get_image_workers():
    workers = 1
    try:
        workers = int(get_config_by_key("RUNNING", "IMAGE_WORKERS"))
    except Exception as e:
        print(f"get_image_workers error: {str(e)}")

    return workers


if __name__ == "__main__":
    pass
