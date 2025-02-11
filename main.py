#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Author :  @fangwangme
Time   :  2024-03-13
Desc   :  
"""


import sys
import pathlib
import argparse

# sys path append parent folder
sys.path.append("{}/../".format(pathlib.Path(__file__).parent))
from scraper import autoscout24_scraper
from utils import image_downloader, image_task_handler
from common import settings
from common.logger import logger


# set argument
def get_args():
    parser = argparse.ArgumentParser(description="the options of executing the scraper")

    parser.add_argument(
        "-m",
        "--mode",
        type=str,
        default="task",
        required=True,
        help="The mode of the scraper, scrape/auto/export",
    )

    parser.add_argument(
        "-s",
        "--source",
        type=str,
        default="autoscout24",
        required=True,
        help="The source of the scraper, autoscout24",
    )

    return parser.parse_args()


def main():
    args = get_args()

    if args.mode == "task":
        if args.source == settings.SOURCE_AUTOSCOUT24:
            autoscout24_scraper.build_auto_scout24_tasks()

    elif args.mode == "listing":
        if args.source == settings.SOURCE_AUTOSCOUT24:
            autoscout24_scraper.scrape_all_auto_scout24_tasks()

    elif args.mode == "image":
        image_task_handler.generate_image_tasks(args.source)
        image_downloader.scrape_all_images()

    else:
        logger.error("The mode is not supported, please check again.")


if __name__ == "__main__":
    main()
