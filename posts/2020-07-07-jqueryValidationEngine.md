angular中使用jQuery Validation Engine 表单验证

angular.json中引入js，css文件

  jquery.validationEngine-en.js:语言配置文件，可以根据需求修改

```json
"styles":[
    "css/validationEngine.jquery.css"
],
"scripts":[
    "js/jquery-3.5.1.min.js",
    "js/jquery.validationEngine.min.js",
    "js/jquery.validationEngine-en.js"
]
```

ts文件中调用：

```typescript
// import 位置
declare var $:any;

constructor(){
  (<any>$(document)).ready(function(){
      // 直接调用
      (<any>$("#form_id")).validationEngine();
      // 参数传递调用
      //(<any>$("#form_id")).validationEngine('attach',{
      //    promptPosition:"centerRight"
      //});
  });
}
```

获取验证结果：

```typescript
// true/false
var ret = (<any>$("#form_id")).validationEngine('validate');
```

表单添加id,控件添加验证类型

```html
<!-- form 里面使用ngModel时，添加[ngModelOptions]="{standalone:true}":
不把值绑定到form里面，但是不影响验证 -->
<form id="form_id">
    <ion-input type="text" class="validate[required]" 
    [ngModelOptions]="{standalone:true}" [(ngModel)]="name"></ion-input>
    <!-- 验证规则写在 validate[] 中，如有多条规则，用英文逗号(,)分割
        例：validate[required,minSize[3],custom[onlyLetterNumber]]
     data-prompt-position="bottomLeft":HTML5属性，设置Tip显示位置(可以单独指定)
     -->
    <ion-input type="email" class="validate[required,custom[email],maxSize[255]]"
    [ngModelOptions]="{standalone:true}" [(ngModel)]="email" 
    data-prompt-position="bottomLeft" 
    (ngModelChange)="validationEngineRealTimeCheck()">
    </ion-input>
</form>
```

<img src="https://goooooooooooooo.github.io/img/posts/jqueryValidationEngine.jpg" title="" alt="avatar" data-align="center">

给验证成功，失败的控件添加样式

```typescript
((document)).ready(function(){
  (("#form_id")).validationEngine('attach',{
    addSuccessCssClassToField: "is-valid", // css class name
    addFailureCssClassToField: "is-invalid"  // css class name
  });
});

// 实时检测，显示信息 样式
static validationEngineRealTimeCheck(){
  setTime(() => {
    (<any>$("#form_id")).validationEngine('validate');
  },10);
}

```

css：

```scss
/* ionic 修改提示信息样式 */
.formError .formErrorContent, .formError .formErrorArrow div{
  background: #f34444 !important;
  border: none !important;
}
.is-invalid{
  border: 1px solid var(--ion-color-danger-tint) !important;
  input:focus{
    border: solid 2px rgba(243, 90, 90, 0.4) !important;  
  }
}
.is-valid{
  border: 1px solid var(--ion-color-success-tint) !important;
  input:focus{
    border: solid 2px rgba(16, 220, 96, 0.4) !important;  
  }
}
```



HTML5 中可用属性

| 属性名称                       | 说明                                                                                                                                                                                       |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data-validation-engine     | 设置验证规则除了使用 class 设置验证规则外，也可以使用该属性来设置验证规则。                                                                                                                                                |
| data-alidation-placeholder | 占位符当位置为必填的控件验证时，值不能为空，也不能为占位符。                                                                                                                                                           |
| data-prompt-position       | 自定义提示信息的位置，可设置为："topRight", "topLeft", "bottomRight" "bottomLeft", "centerRight", "centerLeft", "inline"可设置更具体的位置，格式为："方向:X偏移值,Y偏移值"。如：data-prompt-position="bottomLeft:20,5"PS：偏移值可以为负数 |
| data-prompt-target         | 载入提示信息的容器，值为元素的 id仅在 promptPosition 或 data-prompt-position 设为 "inline" 是有效。                                                                                                              |

※ ion-item 默认css属性 overflow:auto 会遮挡验证错误信息显示，在 ion-item 中使用时，可以使用下面的css来覆盖#shadow-root内部式样

```sass
ion-item{
  /* !important 表示优先级 */
  overflow: visible !important;
}
```

验证规则：项目地址 https://github.com/posabsolute/jQuery-Validation-Engine

下面列出一部分规则(可以自定义规则)，具体的可以查看文档

| 名称                     | 示例                               | 说明                                                 |
| ---------------------- | -------------------------------- | -------------------------------------------------- |
| required               | validate[required]               | 表示必填项                                              |
| groupRequired[string]  | validate[groupRequired[grp]]     | 在验证组为 grp 的群组，中至少输入或选择一项                           |
| condRequired[string]   | validate[condRequired[ids]]      | 当ids的某个控件不为空时，那么该控件也为必填项。可以多项依赖，如：[id1,id2]        |
| minSize[int]           | validate[minSize[6]]             | 最少输入字符数                                            |
| maxSize[int]           | validate[maxSize[255]]           | 最多输入字符数                                            |
| min[int]               | validate[min[1]]                 | 最小值(该项为数字的最小值，注意与 minSize 的区分)                     |
| max[int]               | validate[max[9999]]              | 最大值(该项为数字的最大值，注意与 maxSize 的区分)                     |
| minCheckbox[int]       | validate[minCheckbox[2]]         | 最少选取的项目数(用于 Checkbox)                              |
| maxCheckbox[int]       | validate[maxCheckbox[2]]         | 最多选取的项目数(用于 Checkbox)                              |
| date[string]           | validate[custom[date]]           | 验证日期，格式为 YYYY/MM/DD、YYYY/M/D、YYYY-MM-DD、YYYY-M-D   |
| dateFormat[string]     | validate[custom[dateFormat]]     | 验证日期格式，格式为 YYYY/MM/DD、YYYY/M/D、YYYY-MM-DD、YYYY-M-D |
| dateTimeFormat[string] | validate[custom[dateTimeFormat]] | 验证日期及时间格式，格式为：YYYY/MM/DD hh:mm:ss AM\|PM           |
| dateTimeRange[string]  | validate[dateTimeRange[grp1]]    | 验证日期及时间范围，增加了时间的对比，其他的和 dateRange 一样。              |
| equals[string]         | validate[equals[id]]             | 当前控件的值需与控件 id 的值相同                                 |
| number                 | validate[custom[number]]         | 验证数字                                               |
| integer                | validate[custom[integer]]        | 验证整数                                               |
| phone                  | validate[custom[phone]]          | 验证电话号码                                             |
| email                  | validate[custom[email]]          | 验证E-mail地址                                         |
| url                    | validate[custom[url]]            | 验证 url 地址，需以 http://、https:// 或 ftp:// 开头          |
| ipv4                   | validate[custom[ipv4]]           | 验证 ipv4 地址                                         |
| onlyNumberSp           | validate[custom[onlyNumberSp]]   | 只接受填数字和空格                                          |
| onlyLetterSp           | validate[custom[onlyLetterSp]]   | 只接受填英文字母、单引号（'）和空格                                 |
