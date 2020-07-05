$(document).ready(
    function(a) {
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
          b.toggleClass("open")
        });
        if (d.width() < 992) {
          a(".menu-list li a").click(function () {
            b.removeClass("open");
            c.removeClass("open").find("i").removeClass("fa-times").addClass("fa-bars")
          })
        }

        var e = a(".back-toggler");
        e.click(function (){
            $("#main-wrapper > section.active, #menu > li a").removeClass("active");
            a(".back-toggler").removeClass("back-show");
            $("#myBlog").addClass("active");
        });
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
   });

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var list;
    var obj;
    var paginator = 4; // 每页显示个数
    var list_render; // list.html template
    var detail_render; // detail.html template
    var contact_render; // contact.html template
    var about_render; // about.html template

    ajax_getJSON = $.getJSON("data/json_data.json","", function(data){
        list = data;
        //console.log(list);
    });

    // json_data.json 获取之后执行
    $.when(ajax_getJSON).done(function () {
        //console.log(chunk(list, paginator));
        obj = chunk(list, paginator);
        list_render = ajax_get_template("template/list.html");
        detail_render = ajax_get_template("template/detail.html");
        about_render = ajax_get_template("template/about.html");
        contact_render = ajax_get_template("template/contact.html");

        $("#myBlog").empty().append(list_render({list: obj[0], paginator: obj, page_number: 0}));
        $("#about").empty().append(about_render());
        $("#contact").empty().append(contact_render());

        Prism.highlightAll();
    });

    // 获取指定页面数据
    function getPaginator(e,page){
        $("#myBlog").empty().append(list_render({list: obj[page], paginator: obj, page_number: page}));
        Prism.highlightAll();
    }

    // 获取指定id 文章详细
    function gotoDetailPage(e, id){
        var item = list.find(ele => {return ele.id == id;});
        $.ajax({
        type: "GET",
        url: item.file,
        success: function(data){
            item.body = marked(data);
            //console.log(item);
            $("#detail").empty().append(detail_render(item));
            $("#main-wrapper > section.active, #menu > li a").removeClass("active");
            $("#detail").addClass("active");
            $(".back-toggler").addClass("back-show");
            Prism.highlightAll();
        }
        });
    }

    // 分割数组，分页
    function chunk(arr, size) {
        return arr.reduce((newarr, _, i) => (i % size ? newarr : [...newarr, arr.slice(i, i + size)]), []);
    }

    // 获取指定template
    function ajax_get_template(url){
        let render;
        $.ajax({
        type: "GET",
        url: url,
        async: false,
        success: function(data){
            return render = template.compile(data);
        }
        });
        return render;
    }

