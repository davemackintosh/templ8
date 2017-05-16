"use strict"

const tape = require("tape")
const tpl = require("../")

const tag = "wcdom"

tape("Basic compilations", assert => {
  assert.throws(() => tpl``, Error, "Throws error with empty template.")

  assert.deepEqual(tpl`<${tag} class="whatever"></${tag}>`, {
    tagName: tag,
    type: "VirtualNode",
    attrs: {class: "whatever"},
    version: "2"
  }, "empty dynamic tag with static class")
  assert.deepEqual(tpl`<${tag}></${tag}>`, {tagName: tag, type: "VirtualNode", version: "2"}, "empty dynamic tag")

  assert.deepEqual(tpl`<${tag} class="whatever" id="test"></${tag}>`, {tagName: tag, type: "VirtualNode", attrs: {class: "whatever", id: "test"}, version: "2"}, "empty dynamic tag with multiple static attributes")
  assert.deepEqual(tpl`<${tag} class="whatever ${tag}"></${tag}>`, {tagName: tag, type: "VirtualNode", attrs: {class: "whatever " + tag}, version: "2"}, "empty dynamic tag with dynamic attribute")
  assert.deepEqual(tpl`<${tag}
    class="whatever"
  >
  </${tag}>`, {tagName: tag, type: "VirtualNode", attrs: {class: "whatever"}, version: "2"}, "Dynamic, empty tag with closing tag on new line.")

  assert.deepEqual(tpl`<${tag}>
  <h1>whatever</h1>
</${tag}>`, {
  tagName: tag,
  type: "VirtualNode",
  version: "2",
  children: [
    {
      tagName: "h1",
      type: "VirtualNode",
      version: "2",
      children: [
        {
          type: "VirtualText",
          text: "whatever",
          version: "2"
        }
      ]
    }
  ]
}, "Dynamic tag with a child and usual tabbed spacing.")

assert.deepEqual(tpl`<${tag}>
<h1>whatever</h1>
<div class="body">
  <p>Some text with some <b>standard</b> <em>formatting</em> elements mixed in.</p>
</div>
</${tag}>`, {
  tagName: tag,
  type: "VirtualNode",
  version: "2",
  children: [
  {
    type: "VirtualNode",
    tagName: "h1",
    version: "2",
    children: [
      {
        type: "VirtualText",
        text: "whatever",
        version: "2"
      }
    ]
  },
  {
    tagName: "div",
    type: "VirtualNode",
    attrs: {class:"body"},
    version: "2",
    children: [
    {
      tagName:"p",
      type: "VirtualNode",
      version: "2",
      children: [
      {
        type: "VirtualText",
        text: "Some text with some ",
        version: "2"
      },
      {
        tagName: "b",
        type: "VirtualNode",
        version: "2",
        children: [
          {
            type: "VirtualText",
            text: "standard",
            version: "2"
          }
        ]
      },
      {
        tagName: "em",
        type: "VirtualNode",
        version: "2",
        children: [
          {
            type: "VirtualText",
            text: "formatting",
            version: "2"
          }
        ]
      },
      {
        type: "VirtualText",
        text: " elements mixed in.",
        version: "2"
      }
    ]}
  ]}
]}, "Common looking block, multiple children, usual tabbing.")

  const humanity = ["love", "understanding", "empathy"]

  assert.deepEqual(tpl`<div>
      <p>m8s, use:</p>
      <ul>${humanity.map(attribute => `<li>${attribute}</li>`).join("")}</ul>
    </div>`, {
    tagName: "div",
    type: "VirtualNode",
    version: "2",
    children: [
      {
        type: "VirtualNode",
        tagName: "p",
        version: "2",
        children: [
          {
            type: "VirtualText",
            text: "m8s, use:",
            version: "2"
          }
        ]
      },
      {
        type: "VirtualNode",
        tagName: "ul",
        version: "2",
        children: [
          {
            type: "VirtualNode",
            tagName: "li",
            version: "2",
            children: [
              {
                type: "VirtualText",
                text: "love",
                version: "2"
              }
            ]
          },
          {
            type: "VirtualNode",
            tagName: "li",
            version: "2",
            children: [
              {
                type: "VirtualText",
                text: "understanding",
                version: "2"
              }
            ]
          },
          {
            type: "VirtualNode",
            tagName: "li",
            version: "2",
            children: [
              {
                type: "VirtualText",
                text: "empathy",
                version: "2"
              }
            ]
          }
        ]
      }
    ]
  }, "Example block")

  assert.deepEqual(tpl`<${tag} />`, {tagName: tag, type: "VirtualNode", version: "2"}, "dynamic, self closing tag with space before self closing token")
  assert.deepEqual(tpl`<${tag}/>`, {tagName: tag, type: "VirtualNode", version: "2"}, "dynamic, self closing tag withOUT space before self closing token")
  assert.deepEqual(tpl`<${tag} class="whatever" />`, {tagName: tag, type: "VirtualNode", attrs: {class: "whatever"}, version: "2"}, "dynamic, self closing tag with space before self closing token with static attribute")
  assert.deepEqual(tpl`<${tag} class="whatever ${tag}" />`, {tagName: tag, type: "VirtualNode", attrs: {class: "whatever " + tag}, version: "2"}, "dynamic, self closing tag with space before self closing token with dynamic token")
  assert.deepEqual(tpl`<${tag} class="whatever"/>`, {tagName: tag, type: "VirtualNode", attrs: {class: "whatever"}, version: "2"}, "dynamic, self closing tag withOUT space before self closing token with static attribute")
  assert.deepEqual(tpl`<${tag} class="whatever ${tag}"/>`, {tagName: tag, type: "VirtualNode", attrs: {class: "whatever " + tag}, version: "2"}, "dynamic, self closing tag withOUT space before self closing token with dynamic token")
  assert.deepEqual(tpl`<${tag}
  />`, {tagName: tag, type: "VirtualNode", version: "2"}, "Dynamic, self closing tag with no attributes and closing token on new line.")

  assert.deepEqual(tpl`<div class="whatever"></div>`, {tagName: "div", type: "VirtualNode", attrs: {class: "whatever"}, version: "2"}, "Standard, empty element with static attribute")
  assert.deepEqual(tpl`<div class="${tag}"></div>`, {tagName: "div", type: "VirtualNode", attrs: {class: tag}, version: "2"}, "Standard empty element with dynamic only attribute.")
  assert.deepEqual(tpl`<div class="whatever ${tag}"></div>`, {tagName: "div", type: "VirtualNode", attrs: {class: "whatever " + tag}, version: "2"}, "Standard, empty element with dynamic, concatenated attribute.")

  assert.deepEqual(tpl`<div style="margin-top: 1em"></div>`, {
    tagName: "div",
    type: "VirtualNode",
    version: "2",
    style: {
      marginTop: "1em"
    }
  }, "Standard, empty element with static style attributes.")

  const top = Math.random()
  assert.deepEqual(tpl`<div style="margin-top: ${top}em"></div>`, {
    tagName: "div",
    type: "VirtualNode",
    version: "2",
    style: {
      marginTop: `${top}em`
    }
  }, "Standard, empty element with dynamic style attributes.")

  assert.end()
})
