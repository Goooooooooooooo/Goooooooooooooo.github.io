###### 灯箱效果插件(Magnific Popup)

官网地址: https://dimsemenov.com/plugins/magnific-popup/

GitHub地址: https://github.com/dimsemenov/Magnific-Popup

1. 添加js，css文件

```html
<!-- magnific popup css file -->
<link rel="stylesheet" href="css/magnific-popup.css">
<!-- magnific popup js file -->
<script type="text/javascript" src="js/jquery.magnific-popup.min.js"></script>
```

2. 添加html标签

```html
<div class="pop-items">
   <a href="img/01.jpg" class="js-zoom-gallery">
     <img src="img/01.jpg" class="img-fluid" alt="">
   </a>
   <a href="img/02.jpg" class="js-zoom-gallery">
     <img src="img/02.jpg" class="img-fluid" alt="">
   </a>
   <a href="img/03.jpg" class="js-zoom-gallery">
     <img src="img/03.jpg" class="img-fluid" alt="">
   </a>
</div>
```

3. 初始化弹出来的层和a标签的点击事件。

```javascript
// 添加magnificPopup初始化方法。
$(document).ready(function() {
  if ((".pop-items").length > 0) {
    $(".pop-items").each(function () {
      $(this).magnificPopup({
        delegate: ".js-zoom-gallery",
        type: "image",
        gallery: {
          enabled: true
        }
      })
    });
  }
});
```

效果图：

<img src="https://goooooooooooooo.github.io/img/posts/magnificPopupDemo.jpg" title="" data-align="center">
