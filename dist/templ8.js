(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.index = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  // How we tokenise the html

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toArray(arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  }

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var TAG_REGEX = /<([^ ]+[.*]|[^>])+>|([^<]+)/g;

  /**
   * Get well formed object of attributes from
   * and array of attribute strings pulled from the string.
   *
   * @param  {Array<string>} tokens to parse attributes from.
   * @return {Object} parsed attributes key => values
   */
  function get_attrs_from_tokens(tokens) {
    var out = Object.create(null);

    tokens.map(function (part) {
      return part.trim();
    }).filter(function (part) {
      return part && part.length > 0;
    }).forEach(function (attr, index) {
      // Add the attributes.
      if (index % 2 === 0) out[attr] = tokens[index + 1];
    });

    return out;
  }

  function style_object_from_string(styles) {
    var parts = styles.split(";");
    var out = {};

    parts.forEach(function (style) {
      var _style$split = style.split(":"),
          _style$split2 = _slicedToArray(_style$split, 2),
          key = _style$split2[0],
          value = _style$split2[1];

      var styleKey = key.trim().replace(/-([a-z])/ig, function (matches, letter) {
        return letter.toUpperCase();
      });
      out[styleKey] = value.trim();
    });

    return out;
  }

  /**
   * Generate an object from a tokenised piece of HTML.
   *
   * @param {string} token to parse into the tree.
   */
  function AST_from_token(token) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "VirtualText";

    var target = {
      type: type
    };

    // Get the parts.

    var _token$substring$spli = token
    // Strip off any GT/LT tokens.
    .substring(1, token.length - (token.endsWith("/>") ? 2 : 1))

    // Split up the attributes.
    .split(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g)

    // Filter artifacts from the above RegExp.
    .filter(function (item) {
      return item && item.trim().length > 0;
    }),
        _token$substring$spli2 = _toArray(_token$substring$spli),
        tag = _token$substring$spli2[0],
        attrs = _token$substring$spli2.slice(1);

    if (!tag) return target;

    // Set the tag name.
    if (type === "VirtualNode") {
      target.tagName = tag.trim();
      target.children = [];
    }

    target.version = "2";

    // Add any attributes.
    if (attrs.length > 0) {
      var tokenised_attrs = get_attrs_from_tokens(attrs);

      if (tokenised_attrs.style) {
        target.style = style_object_from_string(tokenised_attrs.style);
        delete tokenised_attrs.style;
      }

      if (Object.keys(tokenised_attrs).length > 0) target.attrs = tokenised_attrs;
    }

    return target;
  }

  function parse_template(template) {
    // The AST we're generating.
    var AST = {};
    var index = 0;

    // Used in the loop.
    var matches = void 0;

    // We'll use this array to track parents.
    var ASTs = [];

    // Split the template into tags and closing tokens.
    while (matches = TAG_REGEX.exec(template)) {
      var token = matches[0];
      var target_children = ASTs.length > 0 ? ASTs[ASTs.length - 1].children : null;

      // Start with a tree.
      if (index === 0) {
        AST = AST_from_token(token, "VirtualNode");
        ASTs.push(AST);
      }
      // Check for text.
      else if (!token.startsWith("<") && !token.endsWith(">")) {
          if (target_children && token.replace(/\s+/g, "") !== "") target_children.push({
            type: "VirtualText",
            text: token,
            version: "2"
          });
        }
        // If it's a tag and it's not a closing tag create a new
        // virtual node and push the new tree into the potential
        // parents array ASTs.
        else if (!token.startsWith("</") && !token.endsWith("/>")) {
            var new_AST = AST_from_token(token, "VirtualNode");
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

    return templ8.transformer(AST);
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
  function templ8(template) {
    for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      values[_key - 1] = arguments[_key];
    }

    // Compile the template.
    var rendered_template = template.reduce(function (out, current, index) {
      out += current;
      if (values.hasOwnProperty(index)) out += values[index];

      return out;
    }, "");

    if (rendered_template === "") {
      throw new Error("Cannot create a virtual DOM from an empty template/values pair. This is usually caused by having a template like ${myVar} where myVar is empty.");
    }

    // Create the VDom.
    return parse_template(rendered_template);
  }

  // Default transformer.
  templ8.transformer = function (AST) {
    return AST;
  };

  exports.default = templ8;
  exports.templ8 = templ8;
  exports.parse_template = parse_template;
});
