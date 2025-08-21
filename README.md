# Goooooooooooooo.github.io

# Google Maps API 使用文档（2025 最新）

## 1. API 分类

- **Geocoding API**
  
  - 地址 → 经纬度（正向地理编码）
  - 经纬度 → 地址（反向地理编码）
  - 官方文档：https://developers.google.com/maps/documentation/geocoding/overview
- **Places API**
  
  - 搜索地点（商户、地标、机构等）
  - 获取地点详情（电话、营业时间、网站等）
  - 官方文档：https://developers.google.com/maps/documentation/places/web-service/overview
- **Distance Matrix API**
  
  - 计算多个地点之间的距离和时间
  - 官方文档：https://developers.google.com/maps/documentation/distance-matrix/overview

---

## 2. Geocoding API

### 地址 → 经纬度（正向地理编码）

GET https://maps.googleapis.com/maps/api/geocode/json
?address=东京塔
&key=YOUR_API_KEY

### 经纬度 → 地址（反向地理编码）

GET https://maps.googleapis.com/maps/api/geocode/json
?latlng=35.6586,139.7454
&key=YOUR_API_KEY

### 返回示例（简化）

{
"results": [
{
"formatted_address": "日本、〒105-0011 東京都港区芝公園４丁目２−８",
"geometry": {
"location": { "lat": 35.6585805, "lng": 139.7454329 }
}
}
],
"status": "OK"
}

### 参数说明

参数 | 必填 | 说明
---- | ---- | ----
address | 否 | 要查询的地址字符串
latlng | 否 | 经纬度坐标，格式：纬度,经度
language | 否 | 返回结果语言，如 zh-CN, ja, en
region | 否 | 区域代码，如 jp, cn

---

## 3. Places API

### 附近地点搜索

GET https://maps.googleapis.com/maps/api/place/nearbysearch/json
?location=35.6586,139.7454
&radius=1000
&keyword=便利店
&key=YOUR_API_KEY

### 关键词地点搜索（全局）

GET https://maps.googleapis.com/maps/api/place/textsearch/json
?query=东京塔
&key=YOUR_API_KEY

### 获取地点详情

GET https://maps.googleapis.com/maps/api/place/details/json
?place_id=ChIJ4zGFAZpYwokRGUGph3Mf37k
&fields=name,formatted_address,geometry,international_phone_number,website
&key=YOUR_API_KEY

### 返回示例

{
"result": {
"name": "Tokyo Tower",
"formatted_address": "4 Chome-2-8 Shibakoen, Minato City, Tokyo 105-0011, Japan",
"international_phone_number": "+81 3-3433-5111",
"website": "https://www.tokyotower.co.jp/",
"geometry": {
"location": { "lat": 35.6585805, "lng": 139.7454329 }
}
},
"status": "OK"
}

---

## 4. Distance Matrix API

### 路径与距离计算

GET https://maps.googleapis.com/maps/api/distancematrix/json
?origins=35.6586,139.7454
&destinations=35.6895,139.6917
&mode=driving
&language=ja
&key=YOUR_API_KEY

### 返回示例

{
"rows": [
{
"elements": [
{
"distance": { "text": "5.4 km", "value": 5432 },
"duration": { "text": "15 mins", "value": 900 }
}
]
}
]
}

### 参数说明

参数 | 必填 | 说明
---- | ---- | ----
origins | 是 | 起点坐标，可多个，用 | 分隔
destinations | 是 | 终点坐标，可多个，用 | 分隔
mode | 否 | 出行方式：driving / walking / bicycling / transit
language | 否 | 返回结果语言

---

## 5. 计费与限额

- 统一免费额度：每月 200 美元（约 40,000 次请求）
- 超额计费：
  - Geocoding API: $5 / 1000 次请求
  - Places API: 按查询与详情调用分别计费
  - Distance Matrix API: 按起点 × 终点组合数计费
- 官方文档：https://developers.google.com/maps/documentation/usage-and-billing

---

## 6. 常见场景总结

场景 | 使用 API | 请求方式
---- | -------- | ----------
地址 → 经纬度 | Geocoding API | address 参数
经纬度 → 地址 | Geocoding API | latlng 参数
搜索 POI / 商户 | Places API | textsearch / nearbysearch
获取地点详情 | Places API | details
计算两地距离时间 | Distance Matrix API | origins + destinations
