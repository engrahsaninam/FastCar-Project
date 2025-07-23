#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Author :  @fangwangme
Time   :  2024-03-11
Desc   :  
"""

import json
from typing import Tuple
from collections import OrderedDict


class CarModel:
    def __init__(self) -> None:
        self.maker = ""
        self.maker_id = 0
        self.model_line = ""
        self.model_line_id = 0
        self.model = ""
        self.model_id = 0
        self.source = ""
        self.attrs = ""

    def __str__(self) -> str:
        return (
            f"CarModel:\n"
            f"maker={self.maker}\n"
            f"maker_id={self.maker_id}\n"
            f"model_line={self.model_line}\n"
            f"model_line_id={self.model_line_id}\n"
            f"model={self.model}\n"
            f"model_id={self.model_id}\n"
            f"source={self.source}\n"
            f"attrs={self.attrs}"
        )

    def to_tuple(self) -> Tuple[str, int, str, int, str, int, str, str]:
        return (
            self.maker,
            self.maker_id,
            self.model_line,
            self.model_line_id,
            self.model,
            self.model_id,
            self.source,
            self.attrs,
        )


class CarItem:
    def __init__(self) -> None:
        self.id = ""
        self.brand = ""
        self.model = ""
        self.version = ""
        self.price = 0.0
        self.mileage = 0.0
        self.age = 0.0
        self.power = 0
        self.gear = ""
        self.fuel = ""
        self.country = ""
        self.zipcode = ""
        self.images = []
        self.url = ""
        self.attrs = {}
        self.source = ""
        self.status = 0
        self.last_updated = ""

    def __str__(self) -> str:
        return (
            f"CarItem:\n"
            f"id={self.id}\n"
            f"brand={self.brand}\n"
            f"model={self.model}\n"
            f"version={self.version}\n"
            f"price={self.price}\n"
            f"mileage={self.mileage}\n"
            f"age={self.age}\n"
            f"power={self.power}\n"
            f"gear={self.gear}\n"
            f"fuel={self.fuel}\n"
            f"country={self.country}\n"
            f"zipcode={self.zipcode}\n"
            f"images={self.images}\n"
            f"url={self.url}\n"
            f"attrs={self.attrs}\n"
            f"source={self.source}\n"
            f"status={self.status}\n"
            f"last_updated={self.last_updated}"
        )

    def to_tuple(self) -> tuple:
        return (
            self.id,
            self.brand,
            self.model,
            self.version,
            self.price,
            self.mileage,
            self.age,
            self.power,
            self.gear,
            self.fuel,
            self.country,
            self.zipcode,
            json.dumps(self.images),
            self.url,
            json.dumps(self.attrs),
            self.source,
            self.status,
            # self.last_updated,
        )


# Task class
class Task:
    def __init__(self) -> None:
        self.source = ""
        self.context = {}
        self.unique_value = ""
        self.status = 0

    def __str__(self) -> str:
        return (
            f"Task:\n"
            f"source={self.source}\n"
            f"context={self.context}\n"
            f"unique_value={self.unique_value}\n"
            f"status={self.status}"
        )

    def to_tuple(self) -> Tuple[str, str, str, str]:
        return (self.source, json.dumps(self.context), self.unique_value, self.status)


# ContextTask
class ContextTask:
    def __init__(self) -> None:
        self.source = ""
        self.maker = ""
        self.maker_id = 0
        self.model = ""
        self.model_id = 0
        self.min_price = 0
        self.max_price = 0
        self.min_year = 0
        self.max_year = 0
        self.page = 1
        self.count = -1

    def __str__(self) -> str:
        return (
            f"ContextTask:\n"
            f"source={self.source}\n"
            f"maker={self.maker}\n"
            f"maker_id={self.maker_id}\n"
            f"model={self.model}\n"
            f"model_id={self.model_id}\n"
            f"min_price={self.min_price}\n"
            f"max_price={self.max_price}\n"
            f"min_year={self.min_year}\n"
            f"max_year={self.max_year}\n"
            f"page={self.page}\n"
            f"count={self.count}"
        )

    def to_dict(self) -> OrderedDict:
        return OrderedDict(
            [
                ("source", self.source),
                ("maker", self.maker),
                ("maker_id", self.maker_id),
                # ("model", self.model),
                # ("model_id", self.model_id),
                ("min_price", self.min_price),
                ("max_price", self.max_price),
                ("min_year", self.min_year),
                ("max_year", self.max_year),
                ("page", self.page),
                ("count", self.count),
            ]
        )


# image task
class Image:
    def __init__(self) -> None:
        self.source = ""
        self.url = ""
        self.car_id = ""
        self.context = ""
        self.status = 0

    def __str__(self) -> str:
        return (
            f"ImageTask:\n"
            f"source={self.source}\n"
            f"url={self.url}\n"
            f"car_id={self.car_id}\n"
            f"context={self.context}\n"
            f"status={self.status}"
        )

    def to_tuple(self) -> Tuple[str, str, str, int]:
        return (self.source, self.url, self.car_id, self.context, self.status)
