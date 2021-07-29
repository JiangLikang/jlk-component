# meta

## 组成

meta 标签共有两个属性，分别是 http-equiv 属性和 name 属性。

### name 属性

name 属性主要用于描述网页，比如网页的关键词，叙述等。与之对应的属性值为 content，content 中的内容是对 name 填入类型的具体描述，`便于搜索引擎抓取`。

语法：

```html
<meta name="参数" content="具体的描述" />
```

- 搜索优化

```html
<meta name="keywords" content="Lxxyx,博客，文科生，前端" />
```

- 移动端分辨率缩放设置

```html
<!-- 很多框架会用到 -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

### http-equiv 属性

语法：

```html
<meta http-equiv="参数" content="具体的描述" />
```

参数说明：

1. Expires（期限）

说明：指定网页在缓存中的过期时间，一旦网页过期，必须到服务器上重新传输。

2. `Pragma`（cache 模式）

说明：`禁止浏览器从本地计算机的缓存中访问页面内容`。

3. Refresh（刷新）

说明：自动刷新并指向新页面。

4. Set-Cookie（cookie 设定）

说明：浏览器访问某个页面时会将它存在缓存中，下次再次访问时就可从缓存中读取，以提高速度。当你希望访问者每次都刷新你广告的图标，或每次都刷新你的计数器，就要禁用缓存了。

5. `Window-target`（显示窗口的设定）

说明：强制页面在当前窗口以独立页面显示

语法：

<meta http-equiv="Window-target" content="_top"/>

`可以用来防止别人在框架里调用你的页面。`

6. content-Type（显示字符集的设定）

说明：设定页面使用的字符集

- 设定缓存

<meta http-equiv="cache-control" content="no-cache">

共有以下几种用法：

no-cache: 先发送请求，与服务器确认该资源是否被更改，如果未被更改，则使用缓存。

no-store: 不允许缓存，每次都要去服务器上，下载完整的响应。（`安全措施`）

public : 缓存所有响应，但并非必须。因为 max-age 也可以做到相同效果

private : 只为单个用户缓存，因此不允许任何中继进行缓存。（比如说 CDN 就不允许缓存 private 的响应）

maxage : 表示当前请求开始，该响应在多久内能被缓存和重用，而不去服务器重新请求。例如：max-age=60 表示响应可以再缓存和重用 60 秒。
