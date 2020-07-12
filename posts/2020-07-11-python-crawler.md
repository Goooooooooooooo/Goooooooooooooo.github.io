Python爬虫爬取小说

完整代码地址: https://github.com/Goooooooooooooo/python-crawler

爬虫利器 BeautifulSoup ,一个灵活又方便的网页解析库，处理高效，支持多种解析器

官方文档如下介绍：

> **Beautiful Soup** 是一个可以从 **HTML** 或 **XML** 文件中提取数据的 **Python** 库.它能够通过你喜欢的转换器实现惯用的文档导航,查找,修改文档的方式.**Beautiful Soup** 会帮你节省数小时甚至数天的工作时间.

直接使用 **pip** 安装：

```ruby
$ pip install beautifulsoup4
```

1. 导入包

```python
import requests as req
from bs4 import BeautifulSoup
import time
import codecs
```



2. 设置请求头

```python
# User-Agent 在Chrome中就能取到 模拟浏览器发起请求
headers = {
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.84 Safari/537.36',
    'Connection':'close'}

req.adapters.DEFAULT_RETRIES = 10
req.packages.urllib3.disable_warnings()
a = req.Session()
a.keep_alive = False
```



3. 获取小说所有章节的URL

```python
def get_contents(url):
    r = a.get(url, headers = headers, verify = False)

    print(r.status_code)
    print(r.url)

    soup = BeautifulSoup(r.content, 'html.parser')

    url_list = []

    list = soup.select('dd > a')

    for i in list:
        i = i.get('href')
        i = 'https://www.biqugecom.com/' + i
        url_list.append(i)
    # 切片 笔趣阁 前面部分是最新章节
    url_list = url_list[9:-1]
    return url_list
```



4. 获取章节标题和本文

```python
def get_content(url):
    
    r = a.get(url, headers = headers, verify = False)
    time.sleep(0.5)
    
    soup = BeautifulSoup(r.content, 'html.parser')

    data = {}

    # 获取文章标题
    catalog = soup.select('h1')
    data['catalog'] = ''
    if len(catalog) > 0:
        data['catalog'] = catalog[0].text

    print(data['catalog'])

    # 获取文章内容
    content_list = soup.select('#content')
    data['content'] = ''
    for x in content_list:
        data['content'] = data['content'] + '\r\n' + x.text.replace('readx();','')
    return data
```



5. 调用方法，获取小说

```python
if __name__ == '__main__':

    # 小说网址，这里是笔趣阁
    url = 'https://www.biqugecom.com/22/22587/'
    # 保存文件名
    fileName = 'J:\\Story\\story.txt'
    url_list = get_contents(url)
    print(len(url_list))
    print(url_list)

    f = codecs.open(fileName, 'a+', 'utf-8')
    for i in url_list:
        data = get_content(i)
        f.write('\r\n' + data['catalog'] + '\r\n')
        f.write('\r\n' + data['content'] + '\r\n')
    f.close()
```


