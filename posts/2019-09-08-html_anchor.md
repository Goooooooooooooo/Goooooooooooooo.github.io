##### html 页面内锚点定位及跳转方法

###### **第一种方法**

第一种方法，也是最简单的方法是锚点用标签，在href属性中写入div的id。如下： 

```html
<h2>
  <a href="#div1">to div1</a>
  <a href="#div2">to div2</a>
</h2>
<div id="div1">div1</div>
<div id="div2">div2</div>
```

**缺点 : 点击锚点之后，浏览器的URL会发生变化，如果刷新可能会出现问题**。

点击前：http://127.0.0.1:8000/article/article-detail/4/
点击后：http://127.0.0.1:8000/article/article-detail/4/#div1



###### **第二种方法**

在js事件中通过window.location.hash="divId"跳转，但地址也会发生变化，感觉跟第一种方法没区别，不如第一种来的简单



###### **第三种方法**

是用animate属性，当点击锚点后，页面滚动到相应的DIV。接着上面的代码，具体添加如下代码：

```javascript
<script type="text/javascript">
  $(document).ready(function() {
    $("#div1Link").click(function() {
      $("html, body").animate({
         scrollTop: $("#div1").offset().top
      }, 
      {  
        duration: 500,
        easing: "swing"
      });
      return false;
  });
</script>
```

注意：运行上面的脚本的之前，先将为锚点增加相应的id，同时去掉href属性
$("html, body")可以替换为响应的div，如果不起作用，试着给该div增加overflow：scroll属性。
这样做的好处是：URL地址不会变，同时点击锚点时会自动响应scroll事件，不需要重新绑定 

缺点 : 如果页面复杂的话，偏移值可能会发生变化需要算法辅助。



###### **第四种方法**

用js的srollIntoView方法   

```javascript
document.getElementById("divId").scrollIntoView();
```

```javascript
<script>
    var move = document.getElementById("move");
    move.addEventListener('click', function(){
        var target = document.getElementById('comment');
        target.scrollIntoView(false);
    })
</script>
```

这种方法的好处，是URL不会变，同时能够响应相应的scroll事件，不需要算法什么的。


