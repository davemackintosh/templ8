(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.templ8 = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
 * @param  {Array<string>} values to interpolate into the template parts.
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
module.exports.parse_template = parse_template;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0VBOztBQUVBOztBQUNBLE1BQU0sWUFBb0IsOEJBQTFCOztBQUVBOzs7Ozs7O0FBT0EsU0FBUyxxQkFBVCxDQUErQixNQUEvQixFQUE4RDtBQUM1RCxRQUFNLE1BQU0sT0FBTyxNQUFQLENBQWMsSUFBZCxDQUFaOztBQUVBLFNBQ0csR0FESCxDQUNPLFFBQVEsS0FBSyxJQUFMLEVBRGYsRUFFRyxNQUZILENBRVUsUUFBUSxRQUFRLEtBQUssTUFBTCxHQUFjLENBRnhDLEVBR0csT0FISCxDQUdXLENBQUMsSUFBRCxFQUFPLEtBQVAsS0FBaUI7QUFDeEI7QUFDQSxRQUFJLFFBQVEsQ0FBUixLQUFjLENBQWxCLEVBQ0UsSUFBSSxJQUFKLElBQVksT0FBTyxRQUFRLENBQWYsQ0FBWjtBQUNILEdBUEg7O0FBU0EsU0FBTyxHQUFQO0FBQ0Q7O0FBRUQ7Ozs7O0FBS0EsU0FBUyxjQUFULENBQXdCLEtBQXhCLEVBQXVDLE9BQWUsYUFBdEQsRUFBMEU7QUFDeEUsUUFBTSxTQUFjO0FBQ2xCO0FBRGtCLEdBQXBCOztBQUlBO0FBQ0EsUUFBTSxDQUFDLEdBQUQsRUFBTSxHQUFHLEtBQVQsSUFBa0I7QUFDdEI7QUFEc0IsR0FFckIsU0FGcUIsQ0FFWCxDQUZXLEVBRVIsTUFBTSxNQUFOLElBQWdCLE1BQU0sUUFBTixDQUFlLElBQWYsSUFBdUIsQ0FBdkIsR0FBMkIsQ0FBM0MsQ0FGUTs7QUFJdEI7QUFKc0IsR0FLckIsS0FMcUIsQ0FLZixzREFMZTs7QUFPdEI7QUFQc0IsR0FRckIsTUFScUIsQ0FRZCxRQUFRLFFBQVEsS0FBSyxJQUFMLEdBQVksTUFBWixHQUFxQixDQVJ2QixDQUF4Qjs7QUFVQSxNQUFJLENBQUMsR0FBTCxFQUNFLE9BQU8sTUFBUDs7QUFFRjtBQUNBLE1BQUksU0FBUyxhQUFiLEVBQTRCO0FBQzFCLFdBQU8sT0FBUCxHQUFpQixJQUFJLElBQUosRUFBakI7QUFDQSxXQUFPLFFBQVAsR0FBa0IsRUFBbEI7QUFDRDs7QUFFRDtBQUNBLE1BQUksTUFBTSxNQUFOLEdBQWUsQ0FBbkIsRUFDRSxPQUFPLEtBQVAsR0FBZSxzQkFBc0IsS0FBdEIsQ0FBZjs7QUFFRixTQUFPLE1BQVA7QUFDRDs7QUFFRCxTQUFTLGNBQVQsQ0FBd0IsUUFBeEIsRUFBK0M7QUFDN0M7QUFDQSxNQUFJLE1BQVcsRUFBZjtBQUNBLE1BQUksUUFBUSxDQUFaOztBQUVBO0FBQ0EsTUFBSSxPQUFKOztBQUVBO0FBQ0EsUUFBTSxPQUFPLEVBQWI7O0FBRUE7QUFDQSxTQUFNLFVBQVUsVUFBVSxJQUFWLENBQWUsUUFBZixDQUFoQixFQUEwQztBQUN4QyxVQUFNLFFBQVEsUUFBUSxDQUFSLENBQWQ7QUFDQSxVQUFNLGtCQUFrQixLQUFLLE1BQUwsR0FBYyxDQUFkLEdBQWtCLEtBQUssS0FBSyxNQUFMLEdBQWMsQ0FBbkIsRUFBc0IsUUFBeEMsR0FBbUQsSUFBM0U7O0FBRUE7QUFDQSxRQUFJLFVBQVUsQ0FBZCxFQUFpQjtBQUNmLFlBQU0sZUFBZSxLQUFmLEVBQXNCLGFBQXRCLENBQU47QUFDQSxXQUFLLElBQUwsQ0FBVSxHQUFWO0FBQ0Q7QUFDRDtBQUpBLFNBS0ssSUFBSSxDQUFDLE1BQU0sVUFBTixDQUFpQixHQUFqQixDQUFELElBQTBCLENBQUMsTUFBTSxRQUFOLENBQWUsR0FBZixDQUEvQixFQUFvRDtBQUN2RCxZQUFJLG1CQUFtQixNQUFNLE9BQU4sQ0FBYyxNQUFkLEVBQXNCLEVBQXRCLE1BQThCLEVBQXJELEVBQ0UsZ0JBQWdCLElBQWhCLENBQXFCO0FBQ25CLGdCQUFNLGFBRGE7QUFFbkIsZ0JBQU07QUFGYSxTQUFyQjtBQUlIO0FBQ0Q7QUFDQTtBQUNBO0FBVEssV0FVQSxJQUFJLENBQUMsTUFBTSxVQUFOLENBQWlCLElBQWpCLENBQUQsSUFBMkIsQ0FBQyxNQUFNLFFBQU4sQ0FBZSxJQUFmLENBQWhDLEVBQXNEO0FBQ3pELGdCQUFNLFVBQVUsZUFBZSxLQUFmLEVBQXNCLGFBQXRCLENBQWhCO0FBQ0EsY0FBSSxlQUFKLEVBQ0UsZ0JBQWdCLElBQWhCLENBQXFCLE9BQXJCOztBQUVGLGVBQUssSUFBTCxDQUFVLE9BQVY7QUFDRDtBQUNEO0FBQ0E7QUFSSyxhQVNBO0FBQ0gsaUJBQUssR0FBTDtBQUNEOztBQUVEO0FBQ0E7QUFDRDs7QUFFRCxNQUFJLENBQUMsSUFBSSxRQUFMLElBQWlCLElBQUksUUFBSixDQUFhLE1BQWIsS0FBd0IsQ0FBN0MsRUFDRSxPQUFPLElBQUksUUFBWDs7QUFFRixTQUFPLEdBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7O0FBU0EsU0FBUyxNQUFULENBQWdCLFFBQWhCLEVBQXlDLEdBQUcsTUFBNUMsRUFBd0U7QUFDdEU7QUFDQSxRQUFNLG9CQUFvQixTQUFTLE1BQVQsQ0FBZ0IsQ0FBQyxHQUFELEVBQU0sT0FBTixFQUFlLEtBQWYsS0FBeUI7QUFDakUsV0FBTyxPQUFQO0FBQ0EsUUFBSSxPQUFPLGNBQVAsQ0FBc0IsS0FBdEIsQ0FBSixFQUNFLE9BQU8sT0FBTyxLQUFQLENBQVA7O0FBRUYsV0FBTyxHQUFQO0FBQ0QsR0FOeUIsRUFNdkIsRUFOdUIsQ0FBMUI7O0FBUUEsTUFBSSxzQkFBc0IsRUFBMUIsRUFBOEI7QUFDNUIsVUFBTSxJQUFJLEtBQUosQ0FBVSxpSkFBVixDQUFOO0FBQ0Q7O0FBRUQ7QUFDQSxRQUFNLE1BQVcsZUFBZSxpQkFBZixDQUFqQjs7QUFFQTtBQUNBLFNBQU8sT0FBTyxXQUFQLENBQW1CLEdBQW5CLENBQVA7QUFDRDs7QUFFRDtBQUNBLE9BQU8sV0FBUCxHQUFzQixHQUFELElBQW1CLEdBQXhDOztBQUVBLE9BQU8sT0FBUCxHQUFpQixNQUFqQjtBQUNBLE9BQU8sT0FBUCxDQUFlLGNBQWYsR0FBZ0MsY0FBaEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQGZsb3dcblxuXCJ1c2Ugc3RyaWN0XCJcblxuLy8gSG93IHdlIHRva2VuaXNlIHRoZSBodG1sXG5jb25zdCBUQUdfUkVHRVg6IFJlZ0V4cCA9IC88KFteIF0rWy4qXXxbXj5dKSs+fChbXjxdKykvZ1xuXG4vKipcbiAqIEdldCB3ZWxsIGZvcm1lZCBvYmplY3Qgb2YgYXR0cmlidXRlcyBmcm9tXG4gKiBhbmQgYXJyYXkgb2YgYXR0cmlidXRlIHN0cmluZ3MgcHVsbGVkIGZyb20gdGhlIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheTxzdHJpbmc+fSB0b2tlbnMgdG8gcGFyc2UgYXR0cmlidXRlcyBmcm9tLlxuICogQHJldHVybiB7T2JqZWN0fSBwYXJzZWQgYXR0cmlidXRlcyBrZXkgPT4gdmFsdWVzXG4gKi9cbmZ1bmN0aW9uIGdldF9hdHRyc19mcm9tX3Rva2Vucyh0b2tlbnM6IEFycmF5PHN0cmluZz4pOiBPYmplY3Qge1xuICBjb25zdCBvdXQgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgdG9rZW5zXG4gICAgLm1hcChwYXJ0ID0+IHBhcnQudHJpbSgpKVxuICAgIC5maWx0ZXIocGFydCA9PiBwYXJ0ICYmIHBhcnQubGVuZ3RoID4gMClcbiAgICAuZm9yRWFjaCgoYXR0ciwgaW5kZXgpID0+IHtcbiAgICAgIC8vIEFkZCB0aGUgYXR0cmlidXRlcy5cbiAgICAgIGlmIChpbmRleCAlIDIgPT09IDApXG4gICAgICAgIG91dFthdHRyXSA9IHRva2Vuc1tpbmRleCArIDFdXG4gICAgfSlcblxuICByZXR1cm4gb3V0XG59XG5cbi8qKlxuICogR2VuZXJhdGUgYW4gb2JqZWN0IGZyb20gYSB0b2tlbmlzZWQgcGllY2Ugb2YgSFRNTC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdG9rZW4gdG8gcGFyc2UgaW50byB0aGUgdHJlZS5cbiAqL1xuZnVuY3Rpb24gQVNUX2Zyb21fdG9rZW4odG9rZW46IHN0cmluZywgdHlwZTogc3RyaW5nID0gXCJWaXJ0dWFsVGV4dFwiKTogQVNUIHtcbiAgY29uc3QgdGFyZ2V0OiBBU1QgPSB7XG4gICAgdHlwZVxuICB9XG5cbiAgLy8gR2V0IHRoZSBwYXJ0cy5cbiAgY29uc3QgW3RhZywgLi4uYXR0cnNdID0gdG9rZW5cbiAgICAvLyBTdHJpcCBvZmYgYW55IEdUL0xUIHRva2Vucy5cbiAgICAuc3Vic3RyaW5nKDEsIHRva2VuLmxlbmd0aCAtICh0b2tlbi5lbmRzV2l0aChcIi8+XCIpID8gMiA6IDEpKVxuXG4gICAgLy8gU3BsaXQgdXAgdGhlIGF0dHJpYnV0ZXMuXG4gICAgLnNwbGl0KC8oXFxTKyk9W1wiJ10/KCg/Oi4oPyFbXCInXT9cXHMrKD86XFxTKyk9fFs+XCInXSkpKy4pW1wiJ10/L2cpXG5cbiAgICAvLyBGaWx0ZXIgYXJ0aWZhY3RzIGZyb20gdGhlIGFib3ZlIFJlZ0V4cC5cbiAgICAuZmlsdGVyKGl0ZW0gPT4gaXRlbSAmJiBpdGVtLnRyaW0oKS5sZW5ndGggPiAwKVxuXG4gIGlmICghdGFnKVxuICAgIHJldHVybiB0YXJnZXRcblxuICAvLyBTZXQgdGhlIHRhZyBuYW1lLlxuICBpZiAodHlwZSA9PT0gXCJWaXJ0dWFsTm9kZVwiKSB7XG4gICAgdGFyZ2V0LnRhZ05hbWUgPSB0YWcudHJpbSgpXG4gICAgdGFyZ2V0LmNoaWxkcmVuID0gW11cbiAgfVxuXG4gIC8vIEFkZCBhbnkgYXR0cmlidXRlcy5cbiAgaWYgKGF0dHJzLmxlbmd0aCA+IDApXG4gICAgdGFyZ2V0LmF0dHJzID0gZ2V0X2F0dHJzX2Zyb21fdG9rZW5zKGF0dHJzKVxuXG4gIHJldHVybiB0YXJnZXRcbn1cblxuZnVuY3Rpb24gcGFyc2VfdGVtcGxhdGUodGVtcGxhdGU6IHN0cmluZyk6IEFTVCB7XG4gIC8vIFRoZSBBU1Qgd2UncmUgZ2VuZXJhdGluZy5cbiAgbGV0IEFTVDogQVNUID0ge31cbiAgbGV0IGluZGV4ID0gMFxuXG4gIC8vIFVzZWQgaW4gdGhlIGxvb3AuXG4gIGxldCBtYXRjaGVzOiBBcnJheTxzdHJpbmc+XG5cbiAgLy8gV2UnbGwgdXNlIHRoaXMgYXJyYXkgdG8gdHJhY2sgcGFyZW50cy5cbiAgY29uc3QgQVNUcyA9IFtdXG5cbiAgLy8gU3BsaXQgdGhlIHRlbXBsYXRlIGludG8gdGFncyBhbmQgY2xvc2luZyB0b2tlbnMuXG4gIHdoaWxlKG1hdGNoZXMgPSBUQUdfUkVHRVguZXhlYyh0ZW1wbGF0ZSkpIHtcbiAgICBjb25zdCB0b2tlbiA9IG1hdGNoZXNbMF1cbiAgICBjb25zdCB0YXJnZXRfY2hpbGRyZW4gPSBBU1RzLmxlbmd0aCA+IDAgPyBBU1RzW0FTVHMubGVuZ3RoIC0gMV0uY2hpbGRyZW4gOiBudWxsXG5cbiAgICAvLyBTdGFydCB3aXRoIGEgdHJlZS5cbiAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgIEFTVCA9IEFTVF9mcm9tX3Rva2VuKHRva2VuLCBcIlZpcnR1YWxOb2RlXCIpXG4gICAgICBBU1RzLnB1c2goQVNUKVxuICAgIH1cbiAgICAvLyBDaGVjayBmb3IgdGV4dC5cbiAgICBlbHNlIGlmICghdG9rZW4uc3RhcnRzV2l0aChcIjxcIikgJiYgIXRva2VuLmVuZHNXaXRoKFwiPlwiKSkge1xuICAgICAgaWYgKHRhcmdldF9jaGlsZHJlbiAmJiB0b2tlbi5yZXBsYWNlKC9cXHMrL2csIFwiXCIpICE9PSBcIlwiKVxuICAgICAgICB0YXJnZXRfY2hpbGRyZW4ucHVzaCh7XG4gICAgICAgICAgdHlwZTogXCJWaXJ0dWFsVGV4dFwiLFxuICAgICAgICAgIHRleHQ6IHRva2VuXG4gICAgICAgIH0pXG4gICAgfVxuICAgIC8vIElmIGl0J3MgYSB0YWcgYW5kIGl0J3Mgbm90IGEgY2xvc2luZyB0YWcgY3JlYXRlIGEgbmV3XG4gICAgLy8gdmlydHVhbCBub2RlIGFuZCBwdXNoIHRoZSBuZXcgdHJlZSBpbnRvIHRoZSBwb3RlbnRpYWxcbiAgICAvLyBwYXJlbnRzIGFycmF5IEFTVHMuXG4gICAgZWxzZSBpZiAoIXRva2VuLnN0YXJ0c1dpdGgoXCI8L1wiKSAmJiAhdG9rZW4uZW5kc1dpdGgoXCIvPlwiKSkge1xuICAgICAgY29uc3QgbmV3X0FTVCA9IEFTVF9mcm9tX3Rva2VuKHRva2VuLCBcIlZpcnR1YWxOb2RlXCIpXG4gICAgICBpZiAodGFyZ2V0X2NoaWxkcmVuKVxuICAgICAgICB0YXJnZXRfY2hpbGRyZW4ucHVzaChuZXdfQVNUKVxuXG4gICAgICBBU1RzLnB1c2gobmV3X0FTVClcbiAgICB9XG4gICAgLy8gSXQncyBwcm9iYWJseSBhIGNsb3NpbmcgdGFnLCBjbGVhciB0aGUgbGFzdCBvbmUgb3V0XG4gICAgLy8gb2YgdGhlIGFycmF5IG9mIGdlbmVyYXRlZCBBU1RzLlxuICAgIGVsc2Uge1xuICAgICAgQVNUcy5wb3AoKVxuICAgIH1cblxuICAgIC8vIEJ1bXAgdGhlIGluZGV4LlxuICAgIGluZGV4KytcbiAgfVxuXG4gIGlmICghQVNULmNoaWxkcmVuIHx8IEFTVC5jaGlsZHJlbi5sZW5ndGggPT09IDApXG4gICAgZGVsZXRlIEFTVC5jaGlsZHJlblxuXG4gIHJldHVybiBBU1Rcbn1cblxuLyoqXG4gKiBQYXJzZSBhIHRlbXBsYXRlIHN0cmluZyAoaW50ZXJwb2xhdGUgaXQncyB2YWx1ZXMpXG4gKiBhbmQgZ2VuZXJhdGUgYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGF0IHN0cmluZ1xuICogZm9yIHZpcnR1YWwgZG9tLFxuICpcbiAqIEBwYXJhbSAge0FycmF5PHN0cmluZz59IHRlbXBsYXRlIHBhcnRzLlxuICogQHBhcmFtICB7QXJyYXk8c3RyaW5nPn0gdmFsdWVzIHRvIGludGVycG9sYXRlIGludG8gdGhlIHRlbXBsYXRlIHBhcnRzLlxuICogQHJldHVybiB7RW50aXR5fSB2YWxpZCB2aXJ0dWFsIGRvbSBlbGVtZW50LlxuICovXG5mdW5jdGlvbiB0ZW1wbDgodGVtcGxhdGU6IEFycmF5PHN0cmluZz4sIC4uLnZhbHVlczogQXJyYXk8c3RyaW5nPik6IEFTVCB7XG4gIC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlLlxuICBjb25zdCByZW5kZXJlZF90ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlZHVjZSgob3V0LCBjdXJyZW50LCBpbmRleCkgPT4ge1xuICAgIG91dCArPSBjdXJyZW50XG4gICAgaWYgKHZhbHVlcy5oYXNPd25Qcm9wZXJ0eShpbmRleCkpXG4gICAgICBvdXQgKz0gdmFsdWVzW2luZGV4XVxuXG4gICAgcmV0dXJuIG91dFxuICB9LCBcIlwiKVxuXG4gIGlmIChyZW5kZXJlZF90ZW1wbGF0ZSA9PT0gXCJcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBjcmVhdGUgYSB2aXJ0dWFsIERPTSBmcm9tIGFuIGVtcHR5IHRlbXBsYXRlL3ZhbHVlcyBwYWlyLiBUaGlzIGlzIHVzdWFsbHkgY2F1c2VkIGJ5IGhhdmluZyBhIHRlbXBsYXRlIGxpa2UgJHtteVZhcn0gd2hlcmUgbXlWYXIgaXMgZW1wdHkuXCIpXG4gIH1cblxuICAvLyBDcmVhdGUgdGhlIFZEb20uXG4gIGNvbnN0IEFTVDogQVNUID0gcGFyc2VfdGVtcGxhdGUocmVuZGVyZWRfdGVtcGxhdGUpXG5cbiAgLy8gUnVuIGl0IHRocm91Z2ggdGhlIHRyYW5zZm9ybWVyLlxuICByZXR1cm4gdGVtcGw4LnRyYW5zZm9ybWVyKEFTVClcbn1cblxuLy8gRGVmYXVsdCB0cmFuc2Zvcm1lci5cbnRlbXBsOC50cmFuc2Zvcm1lciA9IChBU1Q6IEFTVCk6IEFTVCA9PiBBU1RcblxubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbDhcbm1vZHVsZS5leHBvcnRzLnBhcnNlX3RlbXBsYXRlID0gcGFyc2VfdGVtcGxhdGVcbiJdfQ==
