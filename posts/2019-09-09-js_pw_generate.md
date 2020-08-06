javascript 随机生成指定长度的密码



```html
<script>
var pw_model =[
  {name:'numeric', isChecked: true, val: '1234567890'},
  {name:'uppercase', isChecked: true, val: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'},
  {name:'lowercase', isChecked: true, val: 'abcdefghijklmnopqrstuvwxyz'},
  {name:'symbol', isChecked: true, val: '!#$%&()=~|@[];:+-*?_.,'}
];

function genPassword(len = 20)
{
	let pw = '';
	let pw_base = '';
    pw_model.forEach(item => {
      if(item.isChecked){
        pw_base += item.val;  
      }
    });
	for (let i = 0; i < len; i++) {
		pw += pw_base.charAt(Math.floor(Math.random() * pw_base.length));
	}
	return pw;
}
console.log(genPassword(10));
</script>

```
