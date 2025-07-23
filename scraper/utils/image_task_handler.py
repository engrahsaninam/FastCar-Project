#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Author :  @fangwangme
Time   :  2024-03-12
Desc   :  
"""

import json
import math
import sys
import pathlib

sys.path.append(f"{pathlib.Path(__file__).parent}/../")
from common import settings, class_common, db_mysql
from common.logger import logger


TASK_LIMIT = 50000
IMAGE_TASK_LIMIT = 1000


# generate order of source
def generate_source_list():
    source_list = [
        settings.SOURCE_AUTOSCOUT24,
    ]

    return source_list


# generate image tasks for given source
def generate_image_tasks(source):
    logger.info(f"Starting to generate image tasks for source {source}")

    tasks = list()
    sql = f"select id, images from cars where status = {settings.STATUS_NEED_IMAGES} and source = '{source}';"
    results = db_mysql.query_by_sql(sql)
    logger.info(f"Got {len(results)} cars without images")

    for each in results:
        car_id, image_url_context = each
        # load as json
        raw_data = json.loads(image_url_context)
        for url in raw_data:
            image_task = class_common.Image()
            image_task.car_id = car_id
            image_task.url = url
            image_task.source = source
            image_task.status = settings.STATUS_INIT

            tasks.append(image_task.to_tuple())

    logger.info(f"Generated {len(tasks)} image tasks for source {source}")

    # insert image tasks with task_limit
    for i in range(math.ceil(len(tasks) / TASK_LIMIT)):
        start = i * TASK_LIMIT
        end = (i + 1) * TASK_LIMIT
        ret = db_mysql.insert_image_tasks(tasks[start:end])
        logger.info(
            f"Inserted {ret} image tasks for source {source} with start {start} and end {end}"
        )


# generate image tasks with limit without source
def generate_image_tasks_with_limit(limit=IMAGE_TASK_LIMIT):
    has_data = False

    tasks = list()
    sql = f"select id, source, image_urls from cars where status = {settings.STATUS_NEED_IMAGES} limit {limit};"
    results = db_mysql.query_by_sql(sql)
    if results:
        has_data = True

    logger.info(f"Got {len(results)} cars without images")

    for each in results:
        car_id, task_source, image_url_context = each
        # load as json
        raw_data = json.loads(image_url_context)
        for url in raw_data:
            image_task = class_common.Image()
            image_task.car_id = car_id
            image_task.url = url
            image_task.source = task_source
            image_task.status = settings.STATUS_INIT

            tasks.append(image_task.to_tuple())

    logger.info(f"Generated {len(tasks)} image tasks for {task_source} source")

    # insert image tasks with task_limit
    for i in range(math.ceil(len(tasks) / TASK_LIMIT)):
        start = i * TASK_LIMIT
        end = (i + 1) * TASK_LIMIT
        ret = db_mysql.insert_image_tasks(tasks[start:end])
        logger.info(
            f"Inserted {ret} image tasks for {task_source} source with start {start} and end {end}"
        )

    return has_data


# generate image tasks for all cars without images downloaded
def generate_image_tasks_all():
    while True:
        has_data = generate_image_tasks_with_limit()
        if not has_data:
            break


if __name__ == "__main__":
    # generate_image_tasks_all()
    # logger.info("generate_image_tasks_all done")

    generate_image_tasks_with_limit(5000)

    pass
