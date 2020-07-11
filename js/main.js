
// 全局变量
var list;
var obj;
var render;
var paginator = 4; // 每页显示个数
var list_render; // list.html template
var detail_render; // detail.html template
var contact_render; // contact.html template
var about_render; // about.html template
var keyword = ['#home','#myBlog','#about','#contact'];
var reg = new RegExp("detail_[0-9]{1,}");
var detail_ajax;

ajax_getJSON = $.getJSON("data/json_data.json","", function(data){
    list = data;
    //console.log(list);
    //console.log(chunk(list, paginator));
    obj = chunk(list, paginator);
    detail_ajax = $.when(ajax_get_template("template/detail.html")).done(function(data){
        detail_render = data;
    });
    $.when(ajax_get_template("template/list.html")).done(function(data){
        list_render = data;
        $("#myBlog").html(list_render({list: obj[0], paginator: obj, page_number: 0}));
    });
    $.when(ajax_get_template("template/about.html")).done(function(data){
        about_render = data;
        $("#about").html(about_render());
    });
    $.when(ajax_get_template("template/contact.html")).done(function(data){
        contact_render = data;
        $("#contact").html(contact_render());
    });
    Prism.highlightAll();
});

$.when(ajax_getJSON).done(function (){
    $(document).ready(function(){
        (function(e){
            var location_url = window.location.href;
            //console.log(location_url);
            if(location_url.includes("#")){
                let str = location_url.substring(location_url.indexOf("#"));
                //console.log(str);
                if(reg.test(str)){
                    gotoDetailPage(e, location_url.substring(location_url.indexOf("_")+1));
                }else if(keyword.includes(str)){
                    e("#main-wrapper > section.active, #menu > li a").removeClass("active");
                    $(str).addClass("active");
                }
            }
        })(jQuery);
        (function(){
            var i =0;
            var str = "\n#include<stdio.h>\nint main(void)\n{\n\tprintf(\"Hello World!!\/n\");\n\t\/\/ Programmer live\n\tbool alive = true;\n\twhile(alive)\n\t{\n\t\teat();\n\t\tsleep();\n\t\tcode();\n\t}\n\treturn 0;\n}";
            var code = document.getElementById("home-code");
            //console.log(code);
            function typing(){
                var myDiv = document.getElementById("code-display");
                myDiv.innerHTML += str.charAt(i)
                i++;
                code.codeText = myDiv.innerText;
                highlightCode();
                var id = setTimeout(typing,69);
                if(i==str.length)
                {
                    clearTimeout(id);
                }
            }
            function highlightCode() {
                var newCode = document.createElement("code");
                newCode.textContent = code.codeText;
                newCode.className = "language-csharp";
                Prism.highlightElement(newCode);
                code.parentElement.replaceChild(newCode, code);
                code = newCode;
            };
            typing();
        })(jQuery);
        (function(a) {
            a("#menu > li a").on("click", function () {
                a("#main-wrapper > section.active, #menu > li a").removeClass("active");
                a(".back-toggler").removeClass("back-show");
                a(this).addClass("active");
                var d = a(this).attr("href");
                a("#main-wrapper").children(d).addClass("active");
            });
            var c = a(".menu-toggler");
            var d = a(window);
            var b = a("header");
            c.click(function () {
                a(this).toggleClass("open").find("i").toggleClass("fa-bars fa-times");
                b.toggleClass("open");
            });
            if (d.width() < 992) {
                a(".menu-list li a").click(function () {
                b.removeClass("open");
                c.removeClass("open").find("i").removeClass("fa-times").addClass("fa-bars");
                })
            }
            var e = a(".back-toggler");
            e.click(function (){
                $("#main-wrapper > section.active, #menu > li a").removeClass("active");
                a(".back-toggler").removeClass("back-show");
                $("#myBlog").addClass("active");
                $("#detail").empty();
            });
        })(jQuery);
    });
});


    
// 获取指定页面数据
function getPaginator(e,page){
    //$("#myBlog").empty().append(list_render({list: obj[page], paginator: obj, page_number: page}));
    $("#myBlog").html(list_render({list: obj[page], paginator: obj, page_number: page}));
}

// 获取指定id 文章详细
function gotoDetailPage(e, id){
    var item = list.find(ele => {return ele.id == id;});
    if(item == null || typeof item == 'undefined' || !item) return false;
    $.when(detail_ajax).done(function(data){
        $.ajax({
            type: "GET",
            url: item.file,
            success: function(data){
                item.body = marked(data);
                //console.log(item);
                $("#detail").html(detail_render(item));
                $("#main-wrapper > section.active, #menu > li a").removeClass("active");
                $("#detail").addClass("active");
                $(".back-toggler").addClass("back-show");
                if ($("#detail").find('img').length > 0){
                    $("#detail").find('img').addClass("img-fluid");
                }
                Prism.highlightAll();
            }
        });
    });
}

// 分割数组，分页
function chunk(arr, size) {
    return arr.reduce((newarr, _, i) => (i % size ? newarr : [...newarr, arr.slice(i, i + size)]), []);
}

// 获取指定template
function ajax_get_template(url){
    var d = $.Deferred();
    $.ajax({
        type: "GET",
        url: url,
        success: function(data){
            d.resolve(template.compile(data));
        }
    });
    return d.promise();
}

template.defaults.imports.dateFormat = function (date, format) {
    if (typeof date === "string") {
        var mts = date.match(/(\/Date\((\d+)\)\/)/);
        if (mts && mts.length >= 3) {
            date = parseInt(mts[2]);
        }
    }
    date = new Date(date);
    if (!date || date.toUTCString() == "Invalid Date") {
        return "";
    }
    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        } else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
};
