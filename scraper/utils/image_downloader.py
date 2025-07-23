#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Author :  @fangwangme
Time   :  2024-03-12
Desc   :  
"""

import sys
import pathlib
import concurrent.futures


sys.path.append(f"{pathlib.Path(__file__).parent}/../")
from common import settings, db_mysql, tools
from common.logger import logger

import requests

TASK_LIMIT = 50000


# get tasks with limit
def get_image_tasks(limit=TASK_LIMIT):
    sql = f"SELECT id, url, status FROM images WHERE status = {settings.STATUS_INIT} limit {limit};"
    tasks = db_mysql.query_by_sql(sql)
    return tasks


# download images
def download_image(task):
    # parse task
    task_id, task_url, task_status = task
    logger.info(f"Starting to download image of task {task_id}")

    # download image
    response = requests.get(task_url, proxies=None)

    # check if the request is successful
    if response.status_code == 200:
        # open in binary mode
        # save binary data to database
        task_status = settings.STATUS_SUCCESS
        ret = db_mysql.update_image_task(
            id=task_id, status=task_status, image_context=response.content
        )
        logger.info(
            f"Updated image context and status for task {task_id} with ret {ret}"
        )
    else:
        logger.error(
            f"Failed to download image for task {task_id}, status code: {response.status_code}"
        )


# scrape all images
def scrape_all_images():
    stat_dict = dict()
    task_limit = TASK_LIMIT

    while True:
        tasks = get_image_tasks(task_limit)
        if not tasks:
            logger.info("No more image tasks to download")
            break

        task_length = len(tasks)
        logger.info(f"Got {task_length} image tasks to download")

        if task_length not in stat_dict:
            stat_dict[task_length] = 0
        stat_dict[task_length] += 1

        retry_times = tools.get_retry_times()
        if task_length != task_limit and stat_dict.get(task_length, 0) > retry_times:
            logger.error(
                f"Got {task_length} image tasks for {retry_times} times, will stop now"
            )
            break

        else:
            workers = tools.get_image_workers()
            with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
                executor.map(download_image, tasks)


# test one task
def test_one_task():
    sql = f"SELECT id, url, status FROM images WHERE status = {settings.STATUS_INIT} LIMIT 1;"
    task = db_mysql.query_by_sql(sql)
    download_image(task[0])


if __name__ == "__main__":
    # test_one_task()

    scrape_all_images()

    pass
