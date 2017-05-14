"use strict";

// How we tokenise the html

const TAG_REGEX = /<([^ ]+[.*]|[^>])+>|([^<]+)/g;

/**
 * Get well formed object of attributes from
 * and array of attribute strings pulled from the string.
 *
 * @param  {Array<string>} tokens to parse attributes from.
 * @return {Object} parsed attributes key => values
 */
function get_attrs_from_tokens(tokens) {
  const out = Object.create(null);

  tokens.map(part => part.trim()).filter(part => part && part.length > 0).forEach((attr, index) => {
    // Add the attributes.
    if (index % 2 === 0) out[attr] = tokens[index + 1];
  });

  return out;
}

/**
 * Generate an object from a tokenised piece of HTML.
 *
 * @param {string} token to parse into the tree.
 */
function AST_from_token(token, type = "VirtualText") {
  const target = {
    type
  };

  // Get the parts.
  const [tag, ...attrs] = token
  // Strip off any GT/LT tokens.
  .substring(1, token.length - (token.endsWith("/>") ? 2 : 1))

  // Split up the attributes.
  .split(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g)

  // Filter artifacts from the above RegExp.
  .filter(item => item && item.trim().length > 0);

  if (!tag) return target;

  // Set the tag name.
  if (type === "VirtualNode") {
    target.tagName = tag.trim();
    target.children = [];
  }

  // Add any attributes.
  if (attrs.length > 0) target.attrs = get_attrs_from_tokens(attrs);

  return target;
}

function parse_template(template) {
  // The AST we're generating.
  let AST = {};
  let index = 0;

  // Used in the loop.
  let matches;

  // We'll use this array to track parents.
  const ASTs = [];

  // Split the template into tags and closing tokens.
  while (matches = TAG_REGEX.exec(template)) {
    const token = matches[0];
    const target_children = ASTs.length > 0 ? ASTs[ASTs.length - 1].children : null;

    // Start with a tree.
    if (index === 0) {
      AST = AST_from_token(token, "VirtualNode");
      ASTs.push(AST);
    }
    // Check for text.
    else if (!token.startsWith("<") && !token.endsWith(">")) {
        if (target_children && token.replace(/\s+/g, "") !== "") target_children.push({
          type: "VirtualText",
          text: token
        });
      }
      // If it's a tag and it's not a closing tag create a new
      // virtual node and push the new tree into the potential
      // parents array ASTs.
      else if (!token.startsWith("</") && !token.endsWith("/>")) {
          const new_AST = AST_from_token(token, "VirtualNode");
          if (target_children) target_children.push(new_AST);

          ASTs.push(new_AST);
        }
        // It's probably a closing tag, clear the last one out
        // of the array of generated ASTs.
        else {
            ASTs.pop();
          }

    // Bump the index.
    index++;
  }

  if (!AST.children || AST.children.length === 0) delete AST.children;

  return AST;
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
function templ8(template, ...values) {
  // Compile the template.
  const rendered_template = template.reduce((out, current, index) => {
    out += current;
    if (values.hasOwnProperty(index)) out += values[index];

    return out;
  }, "");

  if (rendered_template === "") {
    throw new Error("Cannot create a virtual DOM from an empty template/values pair. This is usually caused by having a template like ${myVar} where myVar is empty.");
  }

  // Create the VDom.
  const AST = parse_template(rendered_template);

  // Run it through the transformer.
  return templ8.transformer(AST);
}

// Default transformer.
templ8.transformer = AST => AST;

module.exports = templ8;
