#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Author :  @fangwangme
Time   :  2024-03-12
Desc   :  
"""

import sys
import pathlib


sys.path.append(f"{pathlib.Path(__file__).parent}/../")
from common import settings, db_mysql
from common.logger import logger


# get single image from database, and check with PIL
def get_single_image():
    sql = f"select * from images where status = {settings.STATUS_SUCCESS} limit 1;"
    results = db_mysql.query_by_sql(sql)
    if len(results) == 0:
        logger.info("No image found")
        return

    image_data = results[0]
    image_id, _, image_url, car_id, image_context, image_status = image_data
    logger.info(f"Got image {image_id} for car {car_id}")

    # check with PIL
    from PIL import Image
    from io import BytesIO

    # open image
    image = Image.open(BytesIO(image_context))
    image.show()


if __name__ == "__main__":
    get_single_image()
