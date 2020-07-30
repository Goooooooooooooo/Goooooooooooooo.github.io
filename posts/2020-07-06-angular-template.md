angular 模板语法使用的一些方法



`ngModel`:

angular ngModel 双向绑定(自动添加属性绑定和事件绑定)添加条件

```typescript
[(ngModel)]="value[ condition ? 'key1': 'key2']"

OR

// 属性绑定
[ngModel]=" condition ? obj.item1 : obj.item2"
// 事件绑定
(ngModelChange)="condition ? (obj.item1 = $event) : (obj.item2 = $event)""
```



`ngStyle`:

根据条件应用不同的样式

```typescript
[ngStyle]="{'width': '100px', 'height': '100px'}"
// 根据条件应用不同的样式
[ngStyle]="{'display': condition ? 'block' : 'none'}"

// syle中需要应用变量的时候 i 为数字
<ion-item [attr.style]="transform('--animation-order:' + i)"></ion-item>

// 带有--的值因为安全性原因会作为字符串输出，
// 绕过安全性并将给定值信任为安全样式值（CSS）
.ts
import{ DomSanitizer } from '@angular/platform-browser';

private sanitizer: DomSanitizer;

transform(style){
    return this.sanitizer.bypassSecurityTrustStyle(style);
}

// css 动画样式
.scss
ion-item{
    --transition: unset;
    animation: popIn .2s calc(var(--animation-order) * 70ms) both ease-in;
}
```



`ngClass`:

根据条件应用 css class

```typescript
[ngClass]="{'className': condition }"
```


