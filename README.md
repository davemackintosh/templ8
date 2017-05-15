# Templ8, m8s 🕶

```js
const templ8 = require("templ8")
const humanity = ["love", "understanding", "empathy"]

const vdom = templ8`<div>
    <p>m8s, use:</p>
    <ul>
      ${humanity.map(value => `<li>${value}</li>`).join("")}
    </ul>
  </div>`

/*
vdom = {
tagName: "div",
type: "VirtualNode",
children: [
  {
    type: "VirtualNode",
    tagName: "p",
    children: [
      {
        type: "VirtualText",
        text: "m8s, use:"
      }
    ]
  },
  {
    type: "VirtualNode",
    tagName: "ul",
    children: [
      {
        type: "VirtualNode",
        tagName: "li",
        children: [
          {
            type: "VirtualText",
            text: "love"
          }
        ]
      },
      {
        type: "VirtualNode",
        tagName: "li",
        children: [
          {
            type: "VirtualText",
            text: "understanding"
          }
        ]
      },
      {
        type: "VirtualNode",
        tagName: "li",
        children: [
          {
            type: "VirtualText",
            text: "empathy"
          }
        ]
      }
    ]
  }
]
}
*/
```
