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
    .filter(part => part && part.length > 0)
    .forEach((attr, index) => {
      // Add the attributes.
      if (index % 2 === 0)
        out[attr] = tokens[index + 1]
    })

  return out
}

/**
 * Generate an object from a tokenised piece of HTML.
 *
 * @param {string} token to parse into the tree.
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
  if (attrs.length > 0)
    target.attrs = get_attrs_from_tokens(attrs)

  return target
}

function parse_template(template: string): AST {
  // The AST we're generating.
  let AST: AST = {}

  // Target children is null so we can track for
  // malformed templates later.
  let target_children = null
  let previous_target_children = null

  // Used in the loop.
  let open = false
  let token: string
  let match: mixed

  let index = 0
  let at_index: number = 0
  let prev_at_index: number = 0

  // Split the template into tags and closing tokens.
  while(match = TAG_REGEX.exec(template)) {
    prev_at_index = at_index
    at_index = match.index
    token = match[0]

    // If it's a starting tag, create the initial tree.
    if (index === 0) {
      // If it's not a self closing tag, it's an opening tag.
      if (!token.endsWith("/>")) open = true

      // Create the element.
      AST = AST_from_token(token)

      // Update the target children array.
      previous_target_children = target_children
      target_children = AST.children
      console.log("PARENT", AST.tag, open)
    }
    else if (!token.startsWith("</")) {
      if (target_children) {
        console.log(target_children, AST_from_token(token, at_index, prev_at_index))
        target_children.push(AST_from_token(token))
      }
    }
    else {
      open = false
      target_children = previous_target_children
    }

    index++
  }

  if (!AST.children || AST.children.length === 0)
    delete AST.children

  return AST
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

  if (rendered_template === "") {
    throw new Error("Cannot create a virtual DOM from an empty template/values pair. This is usually caused by having a template like ${myVar} where myVar is empty.")
  }

  // Create the VDom.
  const AST: AST = parse_template(rendered_template)

  // Run it through the transformer.
  return templ8.transformer(AST)
}

// Default transformer.
templ8.transformer = (AST: AST): AST => AST

module.exports = templ8
