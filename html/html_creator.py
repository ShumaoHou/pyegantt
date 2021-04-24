#!/usr/bin/env python
# -*- coding: utf-8 -*-

import dominate
from dominate.tags import *

doc = dominate.document(title='Dominate your HTML')

with doc.head:
    script(src='http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js')
    script(src='https://cdn.jsdelivr.net/npm/echarts@5.1.0/dist/echarts.min.js')

js = open('../js/echart_gantt.js', 'r', encoding='UTF-8').read()

with doc:
    with div():
        attr(id='main', style='width: 1600px; height:800px;')
    with script(js):
        attr(type='text/javascript')

print(doc)
