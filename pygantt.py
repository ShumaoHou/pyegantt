#!/usr/bin/env python
# -*- coding: utf-8 -*-

from pyecharts.charts import Bar
from pyecharts import options as opts

# V1 版本开始支持链式调用
bar = (
    Bar()
        .add_xaxis(["衬衫", "毛衣", "领带", "裤子", "风衣", "高跟鞋", "袜子"])
        .add_yaxis("商家A", [114, 55, 27, 101, 125, 27, 105])
        .add_yaxis("商家B", [57, 134, 137, 129, 145, 60, 49])
        .set_global_opts(title_opts=opts.TitleOpts(title="某商场销售情况"))
)
bar.render()


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


if __name__ == '__main__':
    gan = Gan(1, 2, 3, 4)
