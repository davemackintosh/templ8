// @flow

"use strict"

// How we tokenise the html
const TAG_REGEX: RegExp = /<([^ ]+[.*]|[^>])+>/g

/**
 * Get well formed object of attributes from
 * and array of attribute strings pulled from the string.
 *
 * @param  {Array<string>} tokens to parse attributes from.
 * @return {Object} parsed attributes key => values
 */
function get_attrs_from_tokens(tokens: Array<string>): Object {
  const out = Object.create(null)

  tokens
    .map(part => part.trim())
    .filter(part => part && part.trim().length > 0)
    .forEach((attr, index) => {
      // Add the attributes.
      if (index % 2 === 0)
        out[attr] = tokens[index + 1]
    })

  return out
}

/**
 * Generate an object from a tokenised HTML string.
 *
 * @param {[type]} token [description]
 */
function AST_from_token(token: string): AST {
  const target: AST = {
    children: []
  }

  // Get the parts.
  const [tag, ...attrs] = token
    // Strip off any GT/LT tokens.
    .substring(1, token.length - (token.endsWith("/>") ? 2 : 1))

    // Split up the attributes.
    .split(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g)

    // Filter artifacts from the above RegExp.
    .filter(item => item && item.trim().length > 0)

  // Set the tag name.
  target.tag = tag.trim()

  // Add any attributes.
  if (attrs.length > 0) {
    target.attrs = get_attrs_from_tokens(attrs)
  }

  return target
}

/**
 * Parse a template string (interpolate it's values)
 * and generate an object representing that string
 * for virtual dom,
 *
 * @param  {Array<string>} template parts.
 * @param  {Array<*>} values to interpolate into the template parts.
 * @return {Entity} valid virtual dom element.
 */
function templ8(template: Array<string>, ...values: Array<*>): AST {
  // Compile the template.
  const rendered_template = template.reduce((out, current, index) => {
    out += current
    if (values.hasOwnProperty(index))
      out += values[index]

    return out
  }, "")

  // The AST we're generating.
  let AST: AST = {}

  // Target children is null so we can track for
  // malformed templates later.
  let target_children = null

  // Used in the loop.
  let index = 0
  let open = false
  let token: string
  let atIndex: number
  let prevAtIndex: number
  let match: mixed

  // Split the template into tags and closing tokens.
  while(match = TAG_REGEX.exec(rendered_template)) {
    prevAtIndex = atIndex
    atIndex = match.index
    token = match[0]
    console.log("Token=>", token, "atIndex=>", atIndex)

    // If it's a starting tag, create the initial tree.
    if (index === 0) {
      // If it's not a self closing tag, it's an opening tag.
      if (!token.endsWith("/>")) open = true
      AST = AST_from_token(token)
      target_children = AST.children
    }
    else if (!token.startsWith("</")) {
      if (!target_children)
        throw new Error("You must supply one root element I.E <div>"+rendered_template.substr(0, 100)+"...</div>")
      else
        target_children.push(AST_from_token(token, atIndex, prevAtIndex))
    }
    else {
      open = false
    }

    index++
  }

  if (!AST.children || AST.children.length === 0)
    delete AST.children

  return templ8.transformer(AST)
}

// Default transformer.
templ8.transformer = (AST: AST): AST => AST

module.exports = templ8
