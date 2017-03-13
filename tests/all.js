"use strict"

const tape = require("tape")
const tpl = require("../")

const tag = "wcdom"

tape("Basic compilations", assert => {
  assert.throws(() => tpl``, Error, "Throws error with empty template.")

  assert.deepEqual(tpl`<${tag} class="whatever"></${tag}>`, {tag, attrs: {class: "whatever"}}, "empty dynamic tag with static class")
  assert.deepEqual(tpl`<${tag}></${tag}>`, {tag}, "empty dynamic tag")

  assert.deepEqual(tpl`<${tag} class="whatever" id="test"></${tag}>`, {tag, attrs: {class: "whatever", id: "test"}}, "empty dynamic tag with multiple static attributes")
  assert.deepEqual(tpl`<${tag} class="whatever ${tag}"></${tag}>`, {tag, attrs: {class: "whatever " + tag}}, "empty dynamic tag with dynamic attribute")
  assert.deepEqual(tpl`<${tag}
    class="whatever"
  >
  </${tag}>`, {tag, attrs: {class: "whatever"}}, "Dynamic, empty tag with closing tag on new line.")
  assert.deepEqual(tpl`<${tag}>
  <h1>whatever</h1>
</${tag}>`, {tag, children: [{tag: "h1", children: "whatever"}]}, "Dynamic tag with a child and usual tabbed spacing.")

  assert.deepEqual(tpl`<${tag} />`, {tag}, "dynamic, self closing tag with space before self closing token")
  assert.deepEqual(tpl`<${tag}/>`, {tag}, "dynamic, self closing tag withOUT space before self closing token")
  assert.deepEqual(tpl`<${tag} class="whatever" />`, {tag, attrs: {class: "whatever"}}, "dynamic, self closing tag with space before self closing token with static attribute")
  assert.deepEqual(tpl`<${tag} class="whatever ${tag}" />`, {tag, attrs: {class: "whatever " + tag}}, "dynamic, self closing tag with space before self closing token with dynamic token")
  assert.deepEqual(tpl`<${tag} class="whatever"/>`, {tag, attrs: {class: "whatever"}}, "dynamic, self closing tag withOUT space before self closing token with static attribute")
  assert.deepEqual(tpl`<${tag} class="whatever ${tag}"/>`, {tag, attrs: {class: "whatever " + tag}}, "dynamic, self closing tag withOUT space before self closing token with dynamic token")
  assert.deepEqual(tpl`<${tag}
  />`, {tag}, "Dynamic, self closing tag with no attributes and closing token on new line.")

  assert.deepEqual(tpl`<div class="whatever"></div>`, {tag: "div", attrs: {class: "whatever"}}, "Standard, empty element with static attribute")
  assert.deepEqual(tpl`<div class="${tag}"></div>`, {tag: "div", attrs: {class: tag}}, "Standard empty element with dynamic only attribute.")
  assert.deepEqual(tpl`<div class="whatever ${tag}"></div>`, {tag: "div", attrs: {class: "whatever " + tag}}, "Standard, empty element with dynamic, concatenated attribute.")

  assert.end()
})
