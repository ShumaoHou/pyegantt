#!/usr/bin/env python
# -*- coding: utf-8 -*-


class Gan:
    """
    甘特图单条事务对象
    """
    def __init__(self, start_time, end_time, state_code, hover_info):
        """
        :param start_time:  开始时间，13位时间戳，int
        :param end_time:    结束时间，13位时间戳，int
        :param state_code:  状态码，自定义，int
        :param hover_info:  事务对象更多信息，自定义，dict
        """
        self.start_time = start_time
        self.end_time = end_time
        self.state = state_code
        self.hover_info = hover_info