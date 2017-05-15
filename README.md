# Templ8, m8s 🕶

Use strings to generate virtual DOM objects, strings m8s.

Use template literals with real JavaScript (no made up mumbo jumbo or helpers)

```js
const templ8 = require("templ8")
const humanity = ["love", "understanding", "empathy"]

const vdom = templ8`<div>
    <p>m8s, use:</p>
    <ul>
      ${humanity.map(value => `<li>${value}</li>`).join("")}
    </ul>
  </div>`
```

Or use plain strings to get the same.

```js
const {parse_template} = require("templ8")

const vdom = parse_template(`<div>
    <p>m8s, use:</p>
    <ul>
      <li>love</li>
      <li>understanding</li>
      <li>empathy</li>
    </ul>
  </div>`)
```

Both output the following vdom object.

```js
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
