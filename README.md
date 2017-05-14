# Templ8, m8s 🕶

```js
const templ8 = require("templ8")
const technology = "ES6"
const and = ["love", "understanding", "empathy"]

const vdom = templ8`<p>
  m8s, use ${technology} & ${and.map(word => word)} to improve people's lives.
</p>`

/*
vdom = {
  tag: "p",
  type: "VirtualNode",
  children: [
    {
      type: "VirtualText",
      text: "m8s, use ES6 to improve people's lives."
    }
  ]
}
*/
```
