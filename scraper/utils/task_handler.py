#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Author :  @fangwangme
Time   :  2024-03-11
Desc   :  
"""

import hashlib
import json
import math
import sys
import pathlib
from typing import List, Tuple
from datetime import datetime


sys.path.append(f"{pathlib.Path(__file__).parent}/../")
from common import settings, class_common
from common.logger import logger


PRICE_RANGES = [
    (0, 1000),
    (1000, 10000),
    (10000, 100000),
    (100000, 1000000),
    (1000000, 10000000),
    (10000000, 0),
]


def generate_year_list() -> List[Tuple[int, int]]:
    """
    starts with (0, first element of year list)
    (first element of year list, second element of year list)
    ...
    (last element of year list, 0)
    results should be list of tuple
    """

    years = [i for i in range(1995, datetime.now().year + 1)]

    year_list = [(0, years[0])]  # add (0, 1995)

    for i in range(1, len(years), 2):
        year_list.append((years[i], years[i + 1] if i + 1 < len(years) else 0))

    return year_list


# split the price range
def split_price_range(min_price, max_price):

    price_range_list = list()

    if max_price > min_price:
        price_range_value = max_price - min_price

        # Determine the order of magnitude of the price range
        original_magnitude = math.log10(price_range_value)
        magnitude = int(original_magnitude)

        # Determine the step size based on the magnitude
        if magnitude <= 1 or original_magnitude == 2:
            sub_price_range_value = 10
        elif magnitude == 2 or original_magnitude == 3:
            sub_price_range_value = 100
        elif magnitude == 3 or original_magnitude == 4:
            sub_price_range_value = 1000
        elif magnitude == 4 or original_magnitude == 5:
            sub_price_range_value = 10000
        elif magnitude == 5 or original_magnitude == 6:
            sub_price_range_value = 100000

        # Generate the price ranges
        for i in range(0, price_range_value, sub_price_range_value):
            price_range_list.append(
                (
                    int(min_price + i),
                    int(min_price + i + sub_price_range_value),
                )
            )
    else:
        # for case like 1000000, 0
        # make it (1000000, 2000000), (2000000, 3000000) ... (10000000, 0)
        price_range_value = max_price
        sub_price_range_value = max_price
        for i in range(1, 10):
            price_range_list.append(
                (
                    int(max_price * i),
                    int(max_price * (i + 1)),
                )
            )
        price_range_list.append((max_price * 10, 0))

    return price_range_list


def create_sub_task(
    task_source,
    task_maker,
    task_maker_id,
    task_model,
    task_model_id,
    task_count,
    price_range,
    min_year,
    max_year,
):
    sub_task = class_common.Task()
    sub_task.source = task_source
    context_task = class_common.ContextTask()
    context_task.source = task_source
    context_task.maker = task_maker
    context_task.maker_id = task_maker_id
    context_task.model = task_model
    context_task.model_id = task_model_id
    context_task.min_price = price_range[0]
    context_task.max_price = price_range[1]
    context_task.min_year = min_year
    context_task.max_year = max_year
    context_task.count = task_count
    sub_task.context = context_task.to_dict()
    sub_task.unique_value = hashlib.md5(
        json.dumps(sub_task.context).encode("utf-8")
    ).hexdigest()
    sub_task.status = settings.STATUS_INIT
    return sub_task.to_tuple()


# generate sub-tasks
def generate_sub_tasks(task_dict) -> List:
    """
    generate sub-tasks
    """

    # get all fields with default values
    min_price = task_dict.get("min_price", 0)
    max_price = task_dict.get("max_price", 0)
    min_year = task_dict.get("min_year", 0)
    max_year = task_dict.get("max_year", 0)
    task_source = task_dict.get("source", "")
    task_maker = task_dict.get("maker", "")
    task_maker_id = task_dict.get("maker_id", 0)
    task_model = task_dict.get("model", "")
    task_model_id = task_dict.get("model_id", 0)
    task_count = task_dict.get("count", -1)

    sub_tasks = list()
    if min_price == 0 and max_price == 0:
        # if min_price and max_price are both 0, then just use PRICE_RANGES
        price_range_list = PRICE_RANGES
    else:
        # if min_price and max_price are not 0, then split 10 sub-tasks
        price_range_list = split_price_range(min_price=min_price, max_price=max_price)

    if min_year == 0 and max_year == 0:
        # if min_year and max_year are both 0, then just use year_list
        year_list = generate_year_list()
    else:
        year_list = []

    # generate sub tasks
    sub_tasks = []
    for price_range in price_range_list:
        if year_list:
            for year_range in year_list:
                sub_tasks.append(
                    create_sub_task(
                        task_source,
                        task_maker,
                        task_maker_id,
                        task_model,
                        task_model_id,
                        task_count,
                        price_range,
                        year_range[0],
                        year_range[1],
                    )
                )
        else:
            sub_tasks.append(
                create_sub_task(
                    task_source,
                    task_maker,
                    task_maker_id,
                    task_model,
                    task_model_id,
                    task_count,
                    price_range,
                    min_year,
                    max_year,
                )
            )

    return sub_tasks


# generate sub-tasks for following pages
def generate_tasks_for_pages(task_dict, total_count) -> List:
    """
    generate sub-tasks for following pages
    """

    # get all fields with default values
    task_source = task_dict.get("source", "")
    task_maker = task_dict.get("maker", "")
    task_maker_id = task_dict.get("maker_id", 0)
    task_model = task_dict.get("model", "")
    task_model_id = task_dict.get("model_id", 0)
    min_price = task_dict.get("min_price", 0)
    max_price = task_dict.get("max_price", 0)
    min_year = task_dict.get("min_year", 0)
    max_year = task_dict.get("max_year", 0)

    sub_tasks = list()
    if total_count == -1:
        return sub_tasks

    if total_count <= 20:
        return sub_tasks

    if total_count % 20 == 0:
        page_count = total_count / 20
    else:
        page_count = total_count / 20 + 1

    for i in range(2, int(page_count) + 1):
        sub_task = class_common.Task()
        sub_task.source = task_source

        context_task = class_common.ContextTask()
        context_task.source = task_source
        context_task.maker = task_maker
        context_task.maker_id = task_maker_id
        context_task.model = task_model
        context_task.model_id = task_model_id
        context_task.min_price = min_price
        context_task.max_price = max_price
        context_task.min_year = min_year
        context_task.max_year = max_year
        context_task.page = i
        context_task.count = total_count

        sub_task.context = context_task.to_dict()
        sub_task.unique_value = hashlib.md5(
            json.dumps(sub_task.context).encode("utf-8")
        ).hexdigest()
        sub_task.status = settings.STATUS_INIT
        sub_tasks.append(sub_task.to_tuple())

    return sub_tasks


if __name__ == "__main__":
    # year_list = generate_year_list()
    # print(year_list)
    # print("Done")

    # # test split prices
    # min_price = 7000
    # max_price = 8000
    # print(split_price_range(min_price, max_price))

    # task_dict = {
    #     "page": 1,
    #     "count": 484,
    #     "maker": "Volkswagen",
    #     "model": "Golf (all)",
    #     "source": "autoscout24",
    #     "maker_id": 74,
    #     "max_year": 2011,
    #     "min_year": 2010,
    #     "model_id": 101,
    #     "max_price": 8000,
    #     "min_price": 7000,
    # }

    # print(generate_sub_tasks(task_dict))

    pass
