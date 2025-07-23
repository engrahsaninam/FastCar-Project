#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Author :  @fangwangme
Time   :  2024-03-11
Desc   :  
"""


import hashlib
import json
import re
import sys
import pathlib
import concurrent.futures
import time
import uuid
import urllib.parse
from datetime import datetime

sys.path.append(f"{pathlib.Path(__file__).parent}/../")
from common import db_mysql, settings, proxy_utils, class_common, tools
from common.logger import logger
from utils.task_handler import generate_sub_tasks, generate_tasks_for_pages

# import cloudscraper
import requests
from bs4 import BeautifulSoup


HOME_PAGE = "https://www.autoscout24.com/"
MAKER_SCRAPE_URL = "https://www.autoscout24.com/lst/volkswagen/"
COUNT_LIMIT = 400
PAGE_SIZE = 20


# generate tasks with given models
def generate_auto_scout24_tasks():
    # get all models without model_line_id
    sql = f"""
        SELECT 
            maker, maker_id, model, model_id 
        FROM `models` 
        WHERE source = '{settings.SOURCE_AUTOSCOUT24}' AND model_line_id = 0;
    """
    results = db_mysql.query_by_sql(sql)
    if not results:
        logger.info(
            f"No models without model_line_id for {settings.SOURCE_AUTOSCOUT24}."
        )
        return

    tasks = list()

    for each in results:
        maker, maker_id, model, model_id = each
        context_task = class_common.ContextTask()
        context_task.source = settings.SOURCE_AUTOSCOUT24
        context_task.maker = maker
        context_task.maker_id = maker_id
        context_task.model = model
        context_task.model_id = model_id

        task = class_common.Task()
        task.source = settings.SOURCE_AUTOSCOUT24
        task.context = context_task.to_dict()
        # compute the md5 of dumped json
        task.unique_value = hashlib.md5(json.dumps(task.context).encode()).hexdigest()

        task.status = settings.STATUS_INIT

        tasks.append(task.to_tuple())

    # insert tasks
    ret = db_mysql.insert_tasks(tasks)
    logger.info(f"Inserted {ret}/{len(tasks)} tasks into db.")


# generate tasks without model
def generate_tasks_with_model():
    # get all models without model_line_id
    sql = f"""
        SELECT 
            distinct maker, maker_id
        FROM `models` 
        WHERE source = '{settings.SOURCE_AUTOSCOUT24}';
    """
    results = db_mysql.query_by_sql(sql)
    if not results:
        logger.info(
            f"No models without model_line_id for {settings.SOURCE_AUTOSCOUT24}."
        )
        return

    tasks = list()

    for each in results:
        maker, maker_id = each
        context_task = class_common.ContextTask()
        context_task.source = settings.SOURCE_AUTOSCOUT24
        context_task.maker = maker
        context_task.maker_id = maker_id

        task = class_common.Task()
        task.source = settings.SOURCE_AUTOSCOUT24
        task.context = context_task.to_dict()
        # compute the md5 of dumped json
        task.unique_value = hashlib.md5(json.dumps(task.context).encode()).hexdigest()

        task.status = settings.STATUS_INIT

        tasks.append(task.to_tuple())

    # insert tasks
    ret = db_mysql.insert_tasks(tasks)
    logger.info(f"Inserted {ret}/{len(tasks)} tasks into db.")


# scrape makers
def scrape_makers():
    tasks = list()

    # create scrpaer
    # scraper = cloudscraper.create_scraper()
    s = requests.Session()

    # get home page
    r = s.get(MAKER_SCRAPE_URL, timeout=settings.REQUEST_TIMEOUT)
    logger.info(f"Get home page with status code: {r.status_code}")

    if r.status_code == 200:
        # parse json inside of the html after window.__INITIAL_STATE__ =
        # need to get script tag with 'window.__INITIAL_STATE__' in it
        soup = BeautifulSoup(r.text, "html.parser")
        script = soup.find("script", {"id": "__NEXT_DATA__"})

        if script:
            raw_data = json.loads(script.text)
            # get makes
            makers = (
                raw_data.get("props", {})
                .get("pageProps", {})
                .get("taxonomy", {})
                .get("makes", [])
            )

            for maker_id, maker_info in makers.items():
                # "6": { "label": "Alfa Romeo", "value": 6 }
                maker_id = int(maker_id)
                maker_name = maker_info.get("label", "")

                # build model tasks
                task_context = {
                    "maker_id": maker_id,
                    "maker_name": maker_name,
                }
                task_context = json.dumps(task_context)

                tasks.append(
                    (
                        settings.SOURCE_AUTOSCOUT24,
                        maker_name,
                        task_context,
                        settings.STATUS_INIT,
                    )
                )

    logger.info(f"Got {len(tasks)} makers of {settings.SOURCE_AUTOSCOUT24}.")
    print("Tasks: \n", tasks)

    # insert model tasks
    ret = db_mysql.insert_model_tasks(tasks)
    logger.info(f"Inserted {ret}/{len(tasks)} tasks into db.")


# get model tasks
def get_auto_scout24_model_tasks():
    # only get tasks with status = 0 and source = autoscout24
    sql = f"""
        SELECT id, context, status FROM `model_tasks` WHERE source = '{settings.SOURCE_AUTOSCOUT24}' AND status = {settings.STATUS_INIT};
    """
    tasks = db_mysql.query_by_sql(sql)

    logger.info(f"Loaded {len(tasks)} tasks from autoscout24.")
    return tasks


# scrape models
def scrape_models(task):
    # parse task
    task_id, task_context, _ = task
    logger.info(f"Starting to scrape models of autoscout24 with task: {task_id}.")

    task_dict = json.loads(task_context)
    maker_id = task_dict.get("maker_id", 0)
    maker_name = task_dict.get("maker_name", "")

    query_url = f"https://www.autoscout24.com/as24-home/api/taxonomy/cars/makes/{maker_id}/models"

    # init scraper
    # s = cloudscraper.create_scraper()
    s = requests.Session()
    # proxies = proxy_utils.get_proxy()

    r = s.get(query_url, timeout=settings.REQUEST_TIMEOUT)
    if r.status_code == 200:
        raw_data = r.json()

        # first step: build model_line dict as {model_line_id: model_line_name}
        model_lines = raw_data.get("models", {}).get("modelLines", [])
        model_line_dict = dict()
        for model_line in model_lines:
            model_line_id = model_line.get("id", 0)
            model_line_name = model_line.get("name", "")
            model_line_dict[model_line_id] = model_line_name

        # second step: build model tasks
        model_list = list()
        model_data_list = raw_data.get("models", {}).get("model", {}).get("values", [])
        for model_data in model_data_list:
            model = class_common.CarModel()
            model.maker = maker_name
            model.maker_id = maker_id

            # parse model line
            model_line_id_of_model = model_data.get("modelLineId", 0)
            if model_line_id_of_model:
                model.model_line_id = model_line_id_of_model
                model.model_line = model_line_dict.get(model_line_id_of_model, "")

            # parse model name and id
            model_id = model_data.get("id", 0)
            model_name = model_data.get("name", "")
            if model_id and model_name:
                model.model_id = model_id
                model.model = model_name
            else:
                continue

            model.source = settings.SOURCE_AUTOSCOUT24
            model_list.append(model.to_tuple())

        # add data from model line
        for k, v in model_line_dict.items():
            model = class_common.CarModel()
            model.maker = maker_name
            model.maker_id = maker_id
            model.model_id = k
            model.model = v
            model.source = settings.SOURCE_AUTOSCOUT24

            model_list.append(model.to_tuple())

    logger.info(f"Got {len(model_list)} models of {maker_name}.")

    # insert models
    ret = db_mysql.insert_models(model_list)
    logger.info(f"Inserted {ret}/{len(model_list)} models into db.")

    if ret > 0:
        # update task status
        update_ret = db_mysql.update_model_task(task_id, settings.STATUS_SUCCESS)
        logger.info(
            f"Updated status {settings.STATUS_SUCCESS} for task {task_id} with ret {update_ret}."
        )


# scrape models of all makers
def scrape_all_auto_scout24_models():
    stat_dict = dict()
    while True:
        model_tasks = get_auto_scout24_model_tasks()
        if not model_tasks:
            logger.info(f"No model tasks to scrape for {settings.SOURCE_AUTOSCOUT24}.")
            break

        task_length = len(model_tasks)
        if task_length not in stat_dict:
            stat_dict[task_length] = 0
        stat_dict[task_length] += 1

        retry_times = tools.get_retry_times()
        if stat_dict.get(task_length, 0) > retry_times:
            logger.info(
                f"Task length {task_length} reached retry times {retry_times}. Break the loop."
            )
            break
        else:
            workers = tools.get_workers()
            with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
                executor.map(scrape_models, model_tasks)


# get tasks of autoscout24
def get_auto_scout24_tasks(task_limit=0):
    # only get tasks with status = 0 and source = autoscout24
    if not task_limit:
        sql = f"""
            SELECT * FROM `tasks` WHERE source = '{settings.SOURCE_AUTOSCOUT24}' AND status = {settings.STATUS_INIT};
        """
    else:
        sql = f"""
            SELECT * FROM `tasks` WHERE source = '{settings.SOURCE_AUTOSCOUT24}' AND status = {settings.STATUS_INIT} LIMIT {task_limit};
        """

    tasks = db_mysql.query_by_sql(sql)

    logger.info(f"Loaded {len(tasks)} tasks from autoscout24.")
    return tasks


# build request params
def build_request_params(task_context):
    # parse task
    task_dict = json.loads(task_context)

    # parse price and year
    min_price = task_dict.get("min_price", 0)
    max_price = task_dict.get("max_price", 0)
    min_year = task_dict.get("min_year", 0)
    max_year = task_dict.get("max_year", 0)

    # parse page
    page_num = task_dict.get("page", 1)

    # 3 different types of urls
    # https://www.autoscout24.com/lst/volkswagen/golf-(all)?atype=C&desc=0&sort=standard
    #  &source=homepage_search-mask&ustate=N%2CU
    # https://www.autoscout24.com/lst/volkswagen/golf-(all)?atype=C&cy=D%2CA%2CB%2CE%2CF%2CI%2CL%2CNL
    #   &damaged_listing=exclude&desc=0&fregfrom=2010&fregto=2015&powertype=kw&pricefrom=1000&priceto=2000
    #   &search_id=1ezk42uj5fh&sort=standard&source=homepage_search-mask&ustate=N%2CU
    # https://www.autoscout24.com/lst/volkswagen/golf-(all)?atype=C&cy=D%2CA%2CB%2CE%2CF%2CI%2CL%2CNL
    #   &damaged_listing=exclude&desc=0&fregfrom=1990&fregto=2015&page=2&powertype=kw&pricefrom=1000
    #   &priceto=2000&search_id=18gxub213rj&sort=standard&source=listpage_pagination&ustate=N%2CU
    # https://www.autoscout24.com/lst/volkswagen/golf-(all)?atype=C&cy=D%2CA%2CB%2CE%2CF%2CI%2CL%2CNL
    #   &damaged_listing=exclude&desc=0&fregfrom=2024&powertype=kw&search_id=1usq7uncole&sort=price
    #   &source=homepage_search-mask&ustate=N%2CU
    # build request params

    params = {
        "atype": "C",
        "cy": "D,A,B,E,F,I,L,NL",
        "damaged_listing": "exclude",
        "desc": 0,
        "powertype": "kw",
        "sort": "price",
        "ustate": "N,U",
    }

    if min_price:
        params["pricefrom"] = min_price
    if max_price:
        params["priceto"] = max_price
    if min_year:
        params["fregfrom"] = min_year
    if max_year:
        params["fregto"] = max_year

    if page_num > 1:
        params["page"] = page_num
        params["source"] = "listpage_pagination"
    else:
        params["source"] = "homepage_search-mask"

    return params


# scrape listing/generate sub-tasks for given task
def scrape_auto_scout24_listings(task):
    # generate uuid for logging
    uid = uuid.uuid4()
    start_time = time.time()

    # parse task
    task_id, _, task_context, _, task_status, _ = task
    logger.info(f"Starting to scrape autoscout24 with task: {task_id}. uid: {uid}.")

    # build request url
    task_dict = json.loads(task_context)
    maker = task_dict.get("maker", "")
    model = task_dict.get("model", "")

    page_num = task_dict.get("page", 1)

    if not maker:
        logger.error(f"Invalid task: {task_id}. uid: {uid}.")
        return

    # build request url
    req_params = build_request_params(task_context)

    req_maker = maker.replace(" ", "-").lower()
    req_maker = urllib.parse.quote(req_maker, safe="")

    req_model = model.replace(" ", "-").lower()
    req_model = urllib.parse.quote(req_model, safe="")
    if req_model:
        req_url = f"{HOME_PAGE}lst/{req_maker}/{req_model}?{urllib.parse.urlencode(req_params)}"
    else:
        req_url = f"{HOME_PAGE}lst/{req_maker}?{urllib.parse.urlencode(req_params)}"

    # init scraper and get proxies
    # s = cloudscraper.create_scraper()
    s = requests.Session()

    try:
        if tools.get_proxy_type() == 'NONE':
            r = s.get(req_url, timeout=settings.REQUEST_TIMEOUT)
        else:
            r = s.get(req_url, proxies=proxy_utils.get_proxy(), timeout=settings.REQUEST_TIMEOUT)
        logger.info(f"Get request url: {req_url} with status code: {r.status_code}")
        
        r.raise_for_status()
    except Exception as e:
        logger.error(f"Failed to get request url: {req_url}. uid: {uid}. error: {str(e)}")
        return

    # parse items and total count
    car_list, total_count = parse_cars_and_total_count(r.text, uid)
    print("car list: \n", car_list)
    # update count in task_dict
    task_dict["count"] = total_count

    # firt insert cars
    if car_list:
        insert_ret = db_mysql.insert_cars(car_list)
        logger.info(f"Inserted {insert_ret}/{len(car_list)} cars into db. uid: {uid}.")
    else:
        logger.error(f"No cars parsed. uid: {uid}.")

    sub_tasks = list()

    # udpate task status when page > 1
    if page_num > 1 and insert_ret >= 0:
        task_status = settings.STATUS_SUCCESS
    elif page_num == 1:
        # determine the status of the task
        if total_count >= 0:
            if total_count == 0:
                # no data
                task_status = settings.STATUS_NO_DATA
            elif total_count > 0 and total_count <= 20:
                # just one page
                if insert_ret >= 0:
                    task_status = settings.STATUS_SUCCESS
            elif total_count > 20 and total_count <= 400:
                # need to tasks of following pages if page == 1
                sub_tasks = generate_tasks_for_pages(task_dict, total_count)
                if insert_ret >= 0:
                    task_status = settings.STATUS_SUCCESS
            else:
                # need to generate sub tasks at page 1
                price_diff = task_dict.get("max_price", 0) - task_dict.get(
                    "min_price", 0
                )
                if price_diff <= 10:
                    # generate for pages
                    if total_count > COUNT_LIMIT:
                        logger.warning(
                            f"COUNTLIMIT Total count {total_count} > {COUNT_LIMIT}. uid: {uid}."
                        )
                        cur_total_count = COUNT_LIMIT
                    else:
                        cur_total_count = total_count
                    sub_tasks = generate_tasks_for_pages(task_dict, cur_total_count)
                else:
                    sub_tasks = generate_sub_tasks(task_dict)

                if sub_tasks:
                    task_status = settings.STATUS_NO_NEED_TO_SCRAPE
        else:
            # task failed due to total count is default value
            logger.error(
                f"Task failed due to total count is default value. uid: {uid}."
            )
            task_status = settings.STATUS_REQ_FAILED

    # insert sub tasks if any
    if sub_tasks:
        sub_ret = db_mysql.insert_tasks(sub_tasks)
        logger.info(f"Inserted {sub_ret}/{len(sub_tasks)} sub tasks. uid: {uid}.")

    # update task status
    update_ret = db_mysql.update_task(task_id, task_status)
    logger.info(
        f"Updated status {task_status} for task {task_id} with ret {update_ret}. uid: {uid}."
    )

    # time cost
    time_cost = time.time() - start_time
    logger.info(
        f"Scraped autoscout24 task {task_id} finished in {time_cost} seconds and status {task_status}. uid: {uid}"
    )


# parse cars and total count
def parse_cars_and_total_count(context, uid):
    cars = list()
    total_count = -1

    soup = BeautifulSoup(context, "html.parser")

    # get script with id = __NEXT_DATA__
    script = soup.find("script", {"id": "__NEXT_DATA__"})
    if not script:
        logger.error(f"Failed to find script with id = __NEXT_DATA__. uid={uid}")
        return cars, total_count

    raw_data = json.loads(script.text)
    total_count = (
        raw_data.get("props", {}).get("pageProps", {}).get("numberOfResults", -1)
    )

    listings = raw_data.get("props", {}).get("pageProps", {}).get("listings", [])
    for listing in listings:
        car_item = class_common.CarItem()

        tmp_id = listing.get("id", "")
        if tmp_id:
            car_item.id = tmp_id

        # vehicle info
        vehicle_info = listing.get("vehicle", {})

        tmp_maker = vehicle_info.get("make", "")
        if tmp_maker:
            car_item.brand = tmp_maker

        tmp_model = vehicle_info.get("model", "")
        if tmp_model:
            car_item.model = tmp_model

        tmp_version = vehicle_info.get("modelVersionInput", "")
        if tmp_version:
            car_item.version = tmp_version

        # parse geo
        location_data = listing.get("location", {})
        tmp_country = location_data.get("countryCode", "")
        if tmp_country:
            car_item.country = tmp_country

        tmp_zipcode = location_data.get("zip", "")
        if tmp_zipcode:
            car_item.zipcode = tmp_zipcode

        # parse vehicleDetails
        vehicle_details = listing.get("vehicleDetails", {})
        for vehicle_detail in vehicle_details:
            field_label = vehicle_detail.get("iconName", "")
            field_value = vehicle_detail.get("data", "")

            if field_label == "transmission":
                car_item.gear = field_value.replace("- Gear", "").strip()

            elif field_label == "nozzle":
                car_item.fuel = field_value.replace("- Fuel type", "").strip()

            elif field_label == "speedometer":
                # convert "110 kW (150 hp)" to "110"
                power_match = re.search(r"(\d+)\s*kW", field_value)
                if power_match:
                    car_item.power = int(power_match.group(1))

            tmp_image_urls = listing.get("images", [])
            car_item.images = [
                image.replace("/250x188.webp", "") for image in tmp_image_urls
            ]

        # parse price/mileage/age from tracking
        tracking_data = listing.get("tracking", {})
        tmp_price = tracking_data.get("price", "0")
        if tmp_price:
            car_item.price = float(tmp_price)
            # only keep decimal(10,2)
            car_item.price = round(car_item.price, 2)

        tmp_mileage = tracking_data.get("mileage", "0")
        if tmp_mileage:
            try:
                car_item.mileage = float(tmp_mileage)
                # only keep decimal(10,2)
                car_item.mileage = round(car_item.mileage, 2)
            except Exception as e:
                logger.warning(f"Failed to parse mileage: {tmp_mileage}. uid={uid}")

        tmp_age_str = tracking_data.get("firstRegistration", "")
        if tmp_age_str:
            age_match = re.search(r"(\d+)-(\d+)", tmp_age_str)
            if age_match:
                car_item.age = int(age_match.group(2)) + int(age_match.group(1)) / 12
                car_item.age = round(car_item.age, 4)

        tmp_url = listing.get("url", "")
        if tmp_url:
            car_item.url = f"{HOME_PAGE}{tmp_url[1:]}"

        # set source and last_updated
        car_item.source = settings.SOURCE_AUTOSCOUT24
        car_item.status = settings.STATUS_NEED_IMAGES
        car_item.last_updated = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        cars.append(car_item.to_tuple())

    logger.info(f"Parse {len(cars)} cars and total count: {total_count}. uid={uid}")
    return cars, total_count


# test one task
def test_one_task():
    tasks = get_auto_scout24_tasks()
    scrape_auto_scout24_listings(tasks[0])


# test one model task
def test_one_model_task():
    tasks = get_auto_scout24_model_tasks()
    scrape_models(tasks[0])


# scrape all tasks
def scrape_all_auto_scout24_tasks():
    stat_dict = dict()

    while True:
        # get config first
        workers = tools.get_workers()
        task_limit = workers * 100
        retry_times = tools.get_retry_times()

        tasks = get_auto_scout24_tasks(task_limit)
        if not tasks:
            logger.info(f"No tasks to scrape for {settings.SOURCE_AUTOSCOUT24}.")
            break

        task_length = len(tasks)
        if task_length not in stat_dict:
            stat_dict[task_length] = 0
        stat_dict[task_length] += 1

        # check with retry times
        retry_times = tools.get_retry_times()
        if task_length < task_limit and stat_dict.get(task_length, 0) > retry_times:
            logger.info(
                f"Task length {task_length} reached retry times {retry_times}. Break the loop."
            )
            break
        else:
            logger.info(
                f"Got {task_length} tasks of {settings.SOURCE_AUTOSCOUT24} for {stat_dict[task_length]} times."
            )

            with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
                executor.map(scrape_auto_scout24_listings, tasks)


# whole process for building tasks
def build_auto_scout24_tasks():
    # truncate tasks table
    db_mysql.truncate_tasks()
    logger.info(f"Truncated tasks table.")

    # scrape makers
    scrape_makers()

    # scrape models
    scrape_all_auto_scout24_models()

    # generate tasks
    # generate_auto_scout24_tasks()
    generate_tasks_with_model()


# add args
def parse_args():
    import argparse

    parser = argparse.ArgumentParser(description="AutoScout24 scraper.")
    parser.add_argument(
        "-m",
        "--mode",
        type=str,
        default="task",
        help="Mode: task, listing",
    )

    return parser.parse_args()


def main():
    args = parse_args()

    if args.mode == "task":
        build_auto_scout24_tasks()
    elif args.mode == "listing":
        scrape_all_auto_scout24_tasks()
    else:
        logger.error(f"Invalid mode: {args.mode}.")


if __name__ == "__main__":
    # scrape_makers()
    
    # test_one_model_task()

    # scrape_all_auto_scout24_models()

    # generate_tasks_for_testing()

    # test_one_task()

    # scrape_all_auto_scout24_tasks()

    # with open("test.html") as f:
    #     parse_cars_and_total_count(f.read(), "100")

    # main()

    pass
