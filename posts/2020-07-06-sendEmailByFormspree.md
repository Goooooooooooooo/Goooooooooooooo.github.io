静态网站通过formspree表单发送邮件，不需要后台

使用第三方工具formspree可以表单提交和ajax提交，将表单连接到formspree，formspree会通过电子邮件向提交你的内容

https://formspree.io/

1. 在官网注册邮箱并验证

![avatar](https://goooooooooooooo.github.io/img/posts/registerforformspree.jpg)

![avatar](https://goooooooooooooo.github.io/img/posts/verifyemail.jpg)

2. 配置表单

生成一个随机后缀的URL

```html
// action="https://formspree.io/XXXXXX" XXXXX官网随机生成
// method 必须是 POST
<form action="" method="POST">
    <label>Your Name <span class="text-danger">*</span></label>
    <input name="name" id="name" type="text">

    <label>Your Email <span class="text-danger">*</span></label>
    <input name="_replyto" id="email" type="email">

    <label>Subject</label>
    <input name="subject" id="subject" type="text">

    <label>Comments</label>
    <textarea name="message" id="comments" rows="4"></textarea>

    <input type="submit" name="send" class="btn btn-hover send-btn btn-block" value="Send Message">
</form>
```

官网示例

![avatar](https://goooooooooooooo.github.io/img/posts/formspreesample.jpg)

发送邮件成功后：

![avatar](https://goooooooooooooo.github.io/img/posts/result.jpg)

![avatar](https://goooooooooooooo.github.io/img/posts/result2.jpg)
