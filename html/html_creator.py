#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import dominate
from dominate.tags import *


def create_html(html_file_path='pyegantt.html'):
    doc = dominate.document(title='pyegantt')

    with doc.head:
        script(src='http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js')
        script(src='https://cdn.jsdelivr.net/npm/echarts@5.1.0/dist/echarts.min.js')

    with open('../js/echart_gantt.js', 'r', encoding='UTF-8') as f:
        js = f.read()

    with doc:
        with div():
            attr(id='main', style='width: 1600px; height:800px;')
        with script(js):
            attr(type='text/javascript')

    # 去掉转义字符串
    doc_str = str(doc)
    doc_str = doc_str.replace('&amp;', '&')
    doc_str = doc_str.replace('&lt;', '<')
    doc_str = doc_str.replace('&gt;', '>')

    with open(html_file_path, 'w') as f:
        f.write(doc_str)

    os.startfile(html_file_path)


if __name__ == '__main__':
    create_html()
