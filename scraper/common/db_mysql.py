#! /usr/bin/env python3
# coding=utf-8

"""
@author:Fang Wang
@date:2019-12-20
@desc:
"""

import sys
import pathlib

import mysql.connector
from typing import List, Tuple

sys.path.append("{}/../".format(pathlib.Path(__file__).parent))
from common.logger import logger
from common.tools import get_config_by_key


DB_CONFIG = "MYSQL"

SQL_HOST = get_config_by_key(DB_CONFIG, "SQL_HOST")
SQL_USER = get_config_by_key(DB_CONFIG, "SQL_USER")
SQL_PWD = get_config_by_key(DB_CONFIG, "SQL_PWD")
DB_NAME = get_config_by_key(DB_CONFIG, "DB_NAME")


def get_connection(db_name=DB_NAME):
    conn = mysql.connector.connect(
        host=SQL_HOST, 
        user=SQL_USER, 
        password=SQL_PWD, 
        database=db_name, 
        charset="utf8mb4",
        collation="utf8mb4_unicode_ci"
    )
    print("Connection: ", conn)
    return conn


def execute_sql(sql, args=None):
    conn = None
    cur = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        if args is not None:
            cur.execute(sql, args)
        else:
            cur.execute(sql)
        conn.commit()
        ret = cur.rowcount
    except Exception as e:
        logger.error("ExecuteSQL error: %s" % str(e))
        return False
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

    return ret


def execute_sqls(sql, args=None):
    conn = None
    cur = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        if args is not None:
            cur.executemany(sql, args)
        else:
            cur.execute(sql)
        conn.commit()
        ret = cur.rowcount
    except Exception as e:
        logger.error(
            "ExecuteSQL error: run sql {} failed with error {}".format(sql, str(e)),
            exc_info=True,
        )
        return -1
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

    return ret


def query_by_sql(sql, args=None):
    results = []
    conn = None
    cur = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        if args is not None:
            cur.execute(sql, args)
        else:
            cur.execute(sql)
        rs = cur.fetchall()
        for row in rs:
            results.append(row)
    except Exception as e:
        logger.error("QueryBySQL error: %s" % str(e))
        return None
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

    return results


# insert tasks on duplicate key update status and last_updated
"""
| tasks | CREATE TABLE `tasks` (
  `id` bigint NOT NULL,
  `source` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `context` json NOT NULL,
  `unique_value` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL,
  `last_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_value_UNIQUE` (`unique_value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci |
"""


def insert_tasks(args: List[Tuple[str, str, str, str]]) -> int:
    sql = f"""
        INSERT IGNORE INTO `tasks` (source, context, unique_value, status) 
        VALUES ( %s, %s, %s, %s);
    """
    return execute_sqls(sql, args)


# update task
def update_task(id: int, status: int) -> int:
    sql = f"""
        UPDATE `tasks` SET status = {status} WHERE id = {id};
    """
    return execute_sql(sql)


# truncate tasks
def truncate_tasks():
    sql = """
        TRUNCATE TABLE `tasks`;
    """
    return execute_sql(sql)


# table models

"""
| models | CREATE TABLE `models` (
  `id` bigint NOT NULL,
  `maker` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `maker_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model_line` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model_line_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attrs` text COLLATE utf8mb4_unicode_ci,
  `updated_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`maker`,`model_line`,`model`,`source`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci |
"""


# insert models on duplicate keys ignore
def insert_models(args: List) -> int:
    sql = f"""
        INSERT IGNORE INTO `models` 
            (maker, maker_id, model_line, model_line_id, model, model_id, source, attrs) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
    """
    return execute_sqls(sql, args)


# table `cars`
"""
| cars  | CREATE TABLE `cars` (
  `id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `version` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(2,0) NOT NULL,
  `mileage` decimal(2,0) NOT NULL,
  `age` decimal(4,0) NOT NULL,
  `power` int NOT NULL,
  `gear` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fuel` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `zipcode` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `images` json DEFAULT NULL,
  `url` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attrs` json DEFAULT NULL,
  `source` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL,
  `last_updated` datetime DEFAULT NULL,
  UNIQUE KEY `unique_id` (`id`,`source`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci |
"""


# insert cars
# update values when duplicated key found
def insert_cars(args: List[Tuple]) -> int:
    sql = """
        INSERT INTO `cars` 
            (id, brand, model, version, price, mileage, age, power, gear, fuel, country, 
                zipcode, images, url, attrs, source, status) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE 
            brand = VALUES(brand),
            model = VALUES(model),
            version = VALUES(version),
            price = VALUES(price),
            mileage = VALUES(mileage),
            age = VALUES(age),
            power = VALUES(power),
            gear = VALUES(gear),
            fuel = VALUES(fuel),
            country = VALUES(country),
            zipcode = VALUES(zipcode),
            images = VALUES(images),
            url = VALUES(url),
            attrs = VALUES(attrs),
            source = VALUES(source),
            status = VALUES(status),
            last_updated = CURRENT_TIMESTAMP();
    """
    return execute_sqls(sql, args)


# update images for car
def update_car_images(car_id: str, source: str, images: str) -> int:
    sql = f"""
        UPDATE `cars` SET images = '{images}' WHERE id = '{car_id}' and source = '{source}';
    """
    return execute_sql(sql)


# image tasks table
"""
| images | CREATE TABLE `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `source` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `car_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `context` longblob,
  `status` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url_UNIQUE` (`url`),
  KEY `car_id` (`car_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12629 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci |
"""


# insert image tasks
def insert_image_tasks(args: List) -> int:
    sql = """
        INSERT IGNORE INTO `images` (source, url, car_id, context, status) 
        VALUES (%s, %s, %s, %s, %s);
    """
    return execute_sqls(sql, args)


# update image task
def update_image_task(id: int, status: int, image_context: bytes) -> int:
    sql = f"""
        UPDATE `images` 
        SET 
            status = %s,
            context = %s
        WHERE id = %s;
    """
    return execute_sql(sql, (status, image_context, id))


# truncate table image_tasks
def truncate_image_tasks():
    sql = """
        TRUNCATE TABLE `images`;
    """
    return execute_sql(sql)


# model tasks
"""
-----+
| model_tasks | CREATE TABLE `model_tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `source` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `maker` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `context` json DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_index` (`maker`,`source`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci |
"""


# insert model tasks
def insert_model_tasks(args: List[Tuple[str, str, str]]) -> int:
    sql = """
        INSERT IGNORE INTO `model_tasks` (source, maker, context, status) 
        VALUES (%s, %s, %s, %s);
    """
    return execute_sqls(sql, args)


# update model task
def update_model_task(id: int, status: int) -> int:
    sql = f"""
        UPDATE `model_tasks` SET status = {status} WHERE id = {id};
    """
    return execute_sql(sql)


if __name__ == "__main__":
    # print(query_by_sql("select count(*) from cars;"))
    pass
