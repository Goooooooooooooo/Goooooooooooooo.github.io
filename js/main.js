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
        a(".typed").typed({
          strings: ["I AM OK.", "I AM A Programmer.", "#include<stdio.h>\n   int main(void)\n   {\n	printf(\"Hello World!!\/n\");\n	return 0;\n   }"],
          stringsElement: null,
          typeSpeed: 60,
          startDelay: 1000,
          backSpeed: 20,
          backDelay: 1000,
          loop: true,
          loopCount: 5,
          showCursor: true,
          cursorChar: "|",
          attr: null,
          contentType: "html",
          callback: function () {},
          preStringTyped: function () {},
          onStringTyped: function () {},
          resetCallback: function () {}
        });
        var i =0;
        var str = "\n#include<stdio.h>\nint main(void)\n{\n\tprintf(\"Hello World!!\/n\");\n\t\/\/ Programmer live\n\tbool alive = true;\n\twhile(alive)\n\t{\n\t\teat();\n\t\tsleep();\n\t\tcode();\n\t}\n\treturn 0;\n}";
        var code = document.getElementsByTagName('code')[0];
        console.log(code);
        function typing(){
            var myDiv = document.getElementById("code-display");
            myDiv.innerHTML += str.charAt(i)
            i++;
            code.codeText = myDiv.innerText;
            highlightCode();
            var id = setTimeout(typing,99);
            if(i==str.length)
            {
                clearTimeout(id);
            }
        }
        function highlightCode() {
            var newCode = document.createElement('code');
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

   function gotoDetailPage(e){
    $("#main-wrapper > section.active, #menu > li a").removeClass("active");
    var d = $(e).attr("href");
    $("#main-wrapper").children(d).addClass("active");
    $(".back-toggler").addClass("back-show");
   }
