"use strict"

const tape = require("tape")
const tpl = require("../")

const tag = "wcdom"

tape("Basic compilations", assert => {
  assert.throws(() => tpl``, Error, "Throws error with empty template.")

  assert.deepEqual(tpl`<${tag} class="whatever"></${tag}>`, {
    tagName: tag,
    type: "VirtualNode",
    attrs: {class: "whatever"}
  }, "empty dynamic tag with static class")
  assert.deepEqual(tpl`<${tag}></${tag}>`, {tagName: tag, type: "VirtualNode"}, "empty dynamic tag")

  assert.deepEqual(tpl`<${tag} class="whatever" id="test"></${tag}>`, {tagName: tag, type: "VirtualNode", attrs: {class: "whatever", id: "test"}}, "empty dynamic tag with multiple static attributes")
  assert.deepEqual(tpl`<${tag} class="whatever ${tag}"></${tag}>`, {tagName: tag, type: "VirtualNode", attrs: {class: "whatever " + tag}}, "empty dynamic tag with dynamic attribute")
  assert.deepEqual(tpl`<${tag}
    class="whatever"
  >
  </${tag}>`, {tagName: tag, type: "VirtualNode", attrs: {class: "whatever"}}, "Dynamic, empty tag with closing tag on new line.")

  assert.deepEqual(tpl`<${tag}>
  <h1>whatever</h1>
</${tag}>`, {
  tagName: tag,
  type: "VirtualNode",
  children: [
    {
      tagName: "h1",
      type: "VirtualNode",
      children: [
        {
          type: "VirtualText",
          text: "whatever"
        }
      ]
    }
  ]
}, "Dynamic tag with a child and usual tabbed spacing.")

console.log(JSON.stringify(tpl`<${tag}>
<h1>whatever</h1>
<div class="body">
  <p>Some text with some <b>standard</b> <em>formatting</em> elements mixed in.</p>
</div>
</${tag}>`, null, 2))

assert.deepEqual(tpl`<${tag}>
<h1>whatever</h1>
<div class="body">
  <p>Some text with some <b>standard</b> <em>formatting</em> elements mixed in.</p>
</div>
</${tag}>`, {
  tagName: tag,
  type: "VirtualNode",
  children: [
  {
    type: "VirtualNode",
    tagName: "h1",
    children: [
      {
        type: "VirtualText",
        text: "whatever"
      }
    ]
  },
  {
    tagName: "div",
    type: "VirtualNode",
    attrs: {class:"body"},
    children: [
    {
      tagName:"p",
      children: [
      {
        type: "VirtualText",
        text: "Some text with some "
      },
      {
        tagName: "b",
        children: [
          {
            type: "VirtualText",
            text: "standard"
          }
        ]
      },
      {
        tagName: "em",
        children: [
          {
            type: "VirtualText",
            text: "formatting"
          }
        ]
      },
      {
        type: "VirtualText",
        text: "elements mixed in"
      }
    ]}
  ]}
]}, "Common looking block, multiple children, usual tabbing.")

  assert.deepEqual(tpl`<${tag} />`, {tagName: tag, type: "VirtualNode"}, "dynamic, self closing tag with space before self closing token")
  assert.deepEqual(tpl`<${tag}/>`, {tagName: tag, type: "VirtualNode"}, "dynamic, self closing tag withOUT space before self closing token")
  assert.deepEqual(tpl`<${tag} class="whatever" />`, {tagName: tag, type: "VirtualNode", attrs: {class: "whatever"}}, "dynamic, self closing tag with space before self closing token with static attribute")
  assert.deepEqual(tpl`<${tag} class="whatever ${tag}" />`, {tagName: tag, type: "VirtualNode", attrs: {class: "whatever " + tag}}, "dynamic, self closing tag with space before self closing token with dynamic token")
  assert.deepEqual(tpl`<${tag} class="whatever"/>`, {tagName: tag, type: "VirtualNode", attrs: {class: "whatever"}}, "dynamic, self closing tag withOUT space before self closing token with static attribute")
  assert.deepEqual(tpl`<${tag} class="whatever ${tag}"/>`, {tagName: tag, type: "VirtualNode", attrs: {class: "whatever " + tag}}, "dynamic, self closing tag withOUT space before self closing token with dynamic token")
  assert.deepEqual(tpl`<${tag}
  />`, {tagName: tag, type: "VirtualNode"}, "Dynamic, self closing tag with no attributes and closing token on new line.")

  assert.deepEqual(tpl`<div class="whatever"></div>`, {tagName: "div", type: "VirtualNode", attrs: {class: "whatever"}}, "Standard, empty element with static attribute")
  assert.deepEqual(tpl`<div class="${tag}"></div>`, {tagName: "div", type: "VirtualNode", attrs: {class: tag}}, "Standard empty element with dynamic only attribute.")
  assert.deepEqual(tpl`<div class="whatever ${tag}"></div>`, {tagName: "div", type: "VirtualNode", attrs: {class: "whatever " + tag}}, "Standard, empty element with dynamic, concatenated attribute.")

  assert.end()
})
