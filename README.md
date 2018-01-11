简单的 vue 组件，欢迎大家 fork。
======================

> 英文水平比较差，尽量写的，英文语法错误见谅。
## DatePicker ([Demo][1])
### Props
```js
{
    format: 'yyyy-MM-dd',
    min: '2010-01-01',
    max: '2030-01-01',
    range: false,
    weekStart: 0,
    useTools: false
}
```

#### Instructions
| Prop Name | Description |
|---|---|
| format | `yyyy-MM-dd` or `yyyy/MM/dd` etc. |
| min | Minimum selectable date; Any format that can be converted to Date |
| max | Maximum selectable date; Any format that can be converted to Date |
| range | `common` or `week`; Optional mode of the component |
| weekStart | `week` mode, Which week number you want to set the lead of week |
| useTools | Whether the toolbar is displayed |
## DropSelector (待更新)


  [1]: http://sandbox.runjs.cn/show/yamvreus