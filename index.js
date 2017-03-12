// @flow

"use strict"

// How we tokenise the html
const TAG_REGEX: RegExp = /<("[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g

/**
 * Parse a template string (interpolate it's values)
 * and generate an object representing that string
 * for virtual dom,
 *
 * @param  {Array<string>} template parts.
 * @param  {Array<*>} values to interpolate into the template parts.
 * @return {Entity} valid virtual dom element.
 */
function templ8(template: Array<string>, ...values: Array<*>): Entity {
  // The AST we're generating.
  const AST = {}

  // Compile the template.
  const rendered_template = template.reduce((out, current, index) => {
    out += current
    if (values.hasOwnProperty(index))
      out += values[index]

    return out
  }, "")

  const matches = rendered_template.match(TAG_REGEX)

  if (!matches) {
    console.error("You must supply one root element I.E <div>"+rendered_template+"</div>")
    return {}
  }

  matches
    .forEach((token: string, index: number): void => {
      // Get the parts.
      const [tag, ...attrs] = token
        // Strip off any GT/LT tokens.
        .substring(1, token.length - (token.endsWith("/>") ? 2 : 1))

        // Split up the attributes.
        .split(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g)

        // Filter artifacts from the above RegExp.
        .filter(item => item && item.trim().length > 0)

      // If it's starting tags, do stuff.
      if (!AST.tag && index % 2 === 0) {
        // Set the tag name.
        AST.tag = tag.trim()

        if (attrs.length > 0) {
          AST.attrs = Object.create(null)

          attrs
            .map(part => part.trim())
            .filter(part => part && part.trim().length > 0)
            .forEach((attr, index) => {
              if (index % 2 === 0)
                AST.attrs[attr] = attrs[index + 1]
            })
        }
      }

      console.log("TAG", tag, "ATTRS", attrs)


    })

  return templ8.transformer(AST)
}

// Default transformer.
templ8.transformer = (AST): Entity => AST

module.exports = templ8
