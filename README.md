# Templ8, m8s 🕶

Use strings to generate virtual DOM objects, strings m8s.

Use template literals with real JavaScript (no made up mumbo jumbo or helpers)

```js
const templ8 = require("templ8m8s")
const humanity = ["love", "understanding", "empathy"]

const vdom = templ8`<div>
    <p>m8s, use:</p>
    <ul>
      ${humanity.map(value => `<li style="color: red">${value}</li>`).join("")}
    </ul>
  </div>`
```

Or use plain strings to get the same.

```js
const {parse_template} = require("templ8m8s")

const vdom = parse_template(`<div>
    <p>m8s, use:</p>
    <ul>
      <li style="color: red">love</li>
      <li style="color: red">understanding</li>
      <li style="color: red">empathy</li>
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
        style: {
          color: "red"
        },
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
        style: {
          color: "red"
        },
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
        style: {
          color: "red"
        },
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

## I want to transform the object returned.

Set the transformer property to a function you'll get the full AST passed to you to transform on each parsing.

```js
const templ8 = require("templ8m8s")
templ8.transformer = (AST: AST): Object => {
  // ... transform the AST here...

  // Return it.
  return AST
}
```
