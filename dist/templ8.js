"use strict";

// How we tokenise the html

const TAG_REGEX = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;

function templ8(template, ...values) {
  // The AST we're generating.
  const AST = {};

  // Compile the template.
  const rendered_template = template.reduce((out, current, index) => {
    out += current;
    if (values.hasOwnProperty(index)) out += values[index];

    return out;
  }, "");

  const matches = rendered_template.match(TAG_REGEX);

  if (!matches) {
    console.error("You must supply one root element I.E <div>" + rendered_template + "</div>");
    return {};
  }

  matches.forEach((token, index) => {
    // If it's starting tags, do stuff.
    if (!AST.tag && index % 2 === 0) {
      console.log(token);
      // Get the parts.
      const [tag, ...attrs] = token.substring(1, token.length - (token.endsWith("/>") ? 2 : 1)).split(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g);

      AST.tag = tag.trim();

      console.log("ATTRS", attrs);

      if (attrs.length > 0) {
        AST.attrs = Object.create(null);

        attrs.map(part => part.trim()).filter(part => part && part.trim().length > 0).forEach((attr, index) => {
          if (index % 2 === 0) AST.attrs[attr] = attrs[index + 1];
        });
      }
    }
  });

  return templ8.transformer(AST);
}

// Default transformer.
templ8.transformer = AST => AST;

module.exports = templ8;
