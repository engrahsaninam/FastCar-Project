#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Author :  @fangwangme
Time   :  2024-03-11
Desc   :  
"""

# folder name
OUTPUT_FOLDER = "{}/../data/output"
IMAGE_FOLDER = "{}/../data/images"

# source names
# www.autoscout24.com
SOURCE_AUTOSCOUT24 = "autoscout24"

# total try times
TOTAL_TRY_TIMES = 3


REQUEST_TIMEOUT = 30


# task limit
TASK_LIMIT = 50000


# task status
STATUS_INIT = 0
STATUS_NEED_SUB_TASKS = 1
STATUS_REQ_ERROR = 4
STATUS_REQ_SUCCESS = 5
STATUS_REQ_FAILED = 6
STATUS_NO_DATA = 7
STATUS_NO_NEED_TO_SCRAPE = 8
STATUS_NEED_IMAGES = 9
STATUS_PART_SUCCESS = 10
STATUS_SUCCESS = 100


IP_CHECKER_HOST = "https://httpbin.org/ip"
