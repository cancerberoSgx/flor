/*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 * 
 * CSS like attribute parsing. Differences: 
 * 
 * 1) go up in the tree: 
 * 

```
.class1>#ChildId2 [descendantPropEquals=1]+[nextSiblingsContains~substring]-[previousSiblingPropEquals1&.andHasClass2]<[parentProp="foo"]^.descendantClassContaining~xdf

#sdf>ddf #ff+rf~12 [a=2&b=3]-[r=8]^.jj


|prop|selector|property match|description|
|classes|.c1|el.props.classes = ['c1']|

```


{
    function mergeProps(array) {
      var merged = {};
      for (var i = 0; i < array.length; i++) {
        var pair = array[i]
        for (var key in pair) {
          merged[key] = pair[key]
        }
      }

      return merged;
    }

    function resolveOperator(comparator) {
      return comparator === '=' ? 'equals' : comparator === '~' ? 'contains' : 'equals'
    }

    function resolveNameAndType(name, props, comparator) {
      if ('['.includes(name[0])) {
        name = name.substring(1)
      }
      if ('&|'.includes(name[0])) {
        comparator = name[0]
        name = name.substring(1)
      }
      if (name.startsWith('.')) {
        props.value = props.name
        props.type = 'class';
        props.operator = 'contains'
        props.name = 'classes'
      }
      else if (name.startsWith('#')) {
        props.type = 'id';
        props.value = props.name
        props.operator = 'equals'
        props.name = 'id'
      }
      else if (name.startsWith('@')) {
        props.type = 'name';
        props.value = props.name
        props.operator = 'equals'
        props.name = 'name'
      }
      else {
        props.operator = resolveOperator(props.comparator && props.comparator.length ? props.comparator[props.comparator.length - 1] : undefined)
        props.name = name + props.name
      }
      if (props.comparator) {
        delete props.comparator
      }
    }
}

Start
  = Selectors
  
Properties
  =  props:Property+ [\]]? { return mergeProps(props) }
  
Property
  = ValuePair
  / ValueSingle
  
ValueSingle
  = name:[a-zA-Z.#@0-9_]+ _? { return{name: name.join(''), value: true, operator: 'equals'} }
  
ValuePair
  = name:[a-zA-Z.#@0-9_]+ comparator:[=~] value:Value _? {
   var props = {name: name.join(''), comparator, type: 'prop', value}
  //resolveNameAndType(name.join(''), props, comparator)
  return {...props }
 }

Selector
  = type:[a-zA-Z.#@0-9_[|&] props:Properties c:ChildrenSelectors? _? { 
   const name = Array.isArray(props.name) ? props.name.join('') : props.name
   resolveNameAndType(type, props, type)
  if(type.endsWith('&')) {
  props.parentAggregation='and'
  }
  else  if(type.endsWith('|')) {
 props. parentAggregation='or'
  }
 
  return {...props, ...c||{} } 
  }
  
Selectors
  = Selector+
  
Value
  = BooleanLiteral
  / NumberLiteral
  / StringLiteral
  / UndefinedLiteral
   
BooleanLiteral
  = TrueToken  { return true }
  / FalseToken { return false }

StringLiteral
  = chars:[a-zA-Z0-9]+ { return chars.join('') }
NumberLiteral
  = chars:[0-9.]+ { return parseFloat(chars.join('')) }
UndefinedLiteral
  = u:"undefined" { return u }
  
ChildrenSelectors
  = _ ">" _ children:Selectors { return {children } }  
  / _ "<" _ parent:Selectors { return {parent } }  
  / _ "^" _ ancestors:Selectors { return {ancestors } }  
  / _ " " _ descendants:Selectors { return {descendants} }  
  / _ "+" _ nextSiblings:Selectors { return {nextSiblings }}
  / _ "-" _ prevSiblings:Selectors { return {prevSiblings }}

  
TrueToken       = "true"           _?
FalseToken      = "false"          _?

_ "whitespace"
  = [\t\n\r]
  

```

*/



module.exports = /*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */
(function() {
  "use strict";

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  peg$SyntaxError.buildMessage = function(expected, found) {
    var DESCRIBE_EXPECTATION_FNS = {
          literal: function(expectation) {
            return "\"" + literalEscape(expectation.text) + "\"";
          },

          "class": function(expectation) {
            var escapedParts = "",
                i;

            for (i = 0; i < expectation.parts.length; i++) {
              escapedParts += expectation.parts[i] instanceof Array
                ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
                : classEscape(expectation.parts[i]);
            }

            return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
          },

          any: function(expectation) {
            return "any character";
          },

          end: function(expectation) {
            return "end of input";
          },

          other: function(expectation) {
            return expectation.description;
          }
        };

    function hex(ch) {
      return ch.charCodeAt(0).toString(16).toUpperCase();
    }

    function literalEscape(s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/"/g,  '\\"')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function classEscape(s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/\]/g, '\\]')
        .replace(/\^/g, '\\^')
        .replace(/-/g,  '\\-')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function describeExpectation(expectation) {
      return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }

    function describeExpected(expected) {
      var descriptions = new Array(expected.length),
          i, j;

      for (i = 0; i < expected.length; i++) {
        descriptions[i] = describeExpectation(expected[i]);
      }

      descriptions.sort();

      if (descriptions.length > 0) {
        for (i = 1, j = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i];
            j++;
          }
        }
        descriptions.length = j;
      }

      switch (descriptions.length) {
        case 1:
          return descriptions[0];

        case 2:
          return descriptions[0] + " or " + descriptions[1];

        default:
          return descriptions.slice(0, -1).join(", ")
            + ", or "
            + descriptions[descriptions.length - 1];
      }
    }

    function describeFound(found) {
      return found ? "\"" + literalEscape(found) + "\"" : "end of input";
    }

    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
  };

  function peg$parse(input, options) {
    options = options !== void 0 ? options : {};

    var peg$FAILED = {},

        peg$startRuleFunctions = { Start: peg$parseStart },
        peg$startRuleFunction  = peg$parseStart,

        peg$c0 = /^[\]]/,
        peg$c1 = peg$classExpectation(["]"], false, false),
        peg$c2 = function(props) { return mergeProps(props) },
        peg$c3 = /^[a-zA-Z.#@0-9_]/,
        peg$c4 = peg$classExpectation([["a", "z"], ["A", "Z"], ".", "#", "@", ["0", "9"], "_"], false, false),
        peg$c5 = function(name) { return{name: name.join(''), value: true, operator: 'equals'} },
        peg$c6 = /^[=~]/,
        peg$c7 = peg$classExpectation(["=", "~"], false, false),
        peg$c8 = function(name, comparator, value) {
           var props = {name: name.join(''), comparator, type: 'prop', value}
          //resolveNameAndType(name.join(''), props, comparator)
          return {...props }
         },
        peg$c9 = /^[a-zA-Z.#@0-9_[|&]/,
        peg$c10 = peg$classExpectation([["a", "z"], ["A", "Z"], ".", "#", "@", ["0", "9"], "_", "[", "|", "&"], false, false),
        peg$c11 = function(type, props, c) { 
           const name = Array.isArray(props.name) ? props.name.join('') : props.name
           resolveNameAndType(type, props, type)
          if(type.endsWith('&')) {
          props.parentAggregation='and'
          }
          else  if(type.endsWith('|')) {
         props. parentAggregation='or'
          }
         
          return {...props, ...c||{} } 
          },
        peg$c12 = function() { return true },
        peg$c13 = function() { return false },
        peg$c14 = /^[a-zA-Z0-9]/,
        peg$c15 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"]], false, false),
        peg$c16 = function(chars) { return chars.join('') },
        peg$c17 = /^[0-9.]/,
        peg$c18 = peg$classExpectation([["0", "9"], "."], false, false),
        peg$c19 = function(chars) { return parseFloat(chars.join('')) },
        peg$c20 = "undefined",
        peg$c21 = peg$literalExpectation("undefined", false),
        peg$c22 = function(u) { return u },
        peg$c23 = ">",
        peg$c24 = peg$literalExpectation(">", false),
        peg$c25 = function(children) { return {children } },
        peg$c26 = "<",
        peg$c27 = peg$literalExpectation("<", false),
        peg$c28 = function(parent) { return {parent } },
        peg$c29 = "^",
        peg$c30 = peg$literalExpectation("^", false),
        peg$c31 = function(ancestors) { return {ancestors } },
        peg$c32 = " ",
        peg$c33 = peg$literalExpectation(" ", false),
        peg$c34 = function(descendants) { return {descendants} },
        peg$c35 = "+",
        peg$c36 = peg$literalExpectation("+", false),
        peg$c37 = function(nextSiblings) { return {nextSiblings }},
        peg$c38 = "-",
        peg$c39 = peg$literalExpectation("-", false),
        peg$c40 = function(prevSiblings) { return {prevSiblings }},
        peg$c41 = "true",
        peg$c42 = peg$literalExpectation("true", false),
        peg$c43 = "false",
        peg$c44 = peg$literalExpectation("false", false),
        peg$c45 = peg$otherExpectation("whitespace"),
        peg$c46 = /^[\t\n\r]/,
        peg$c47 = peg$classExpectation(["\t", "\n", "\r"], false, false),

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1 }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description, location) {
      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

      throw peg$buildStructuredError(
        [peg$otherExpectation(description)],
        input.substring(peg$savedPos, peg$currPos),
        location
      );
    }

    function error(message, location) {
      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

      throw peg$buildSimpleError(message, location);
    }

    function peg$literalExpectation(text, ignoreCase) {
      return { type: "literal", text: text, ignoreCase: ignoreCase };
    }

    function peg$classExpectation(parts, inverted, ignoreCase) {
      return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
    }

    function peg$anyExpectation() {
      return { type: "any" };
    }

    function peg$endExpectation() {
      return { type: "end" };
    }

    function peg$otherExpectation(description) {
      return { type: "other", description: description };
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos], p;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column
        };

        while (p < pos) {
          if (input.charCodeAt(p) === 10) {
            details.line++;
            details.column = 1;
          } else {
            details.column++;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildSimpleError(message, location) {
      return new peg$SyntaxError(message, null, null, location);
    }

    function peg$buildStructuredError(expected, found, location) {
      return new peg$SyntaxError(
        peg$SyntaxError.buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parseStart() {
      var s0;

      s0 = peg$parseSelectors();

      return s0;
    }

    function peg$parseProperties() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseProperty();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseProperty();
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        if (peg$c0.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c1); }
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c2(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseProperty() {
      var s0;

      s0 = peg$parseValuePair();
      if (s0 === peg$FAILED) {
        s0 = peg$parseValueSingle();
      }

      return s0;
    }

    function peg$parseValueSingle() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c3.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c4); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c3.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c4); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c5(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseValuePair() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c3.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c4); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c3.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c4); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        if (peg$c6.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c7); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseValue();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c8(s1, s2, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSelector() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (peg$c9.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c10); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseProperties();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseChildrenSelectors();
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c11(s1, s2, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSelectors() {
      var s0, s1;

      s0 = [];
      s1 = peg$parseSelector();
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          s1 = peg$parseSelector();
        }
      } else {
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseValue() {
      var s0;

      s0 = peg$parseBooleanLiteral();
      if (s0 === peg$FAILED) {
        s0 = peg$parseNumberLiteral();
        if (s0 === peg$FAILED) {
          s0 = peg$parseStringLiteral();
          if (s0 === peg$FAILED) {
            s0 = peg$parseUndefinedLiteral();
          }
        }
      }

      return s0;
    }

    function peg$parseBooleanLiteral() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseTrueToken();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c12();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseFalseToken();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c13();
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseStringLiteral() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c14.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c15); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c14.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c15); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c16(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseNumberLiteral() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c17.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c18); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c17.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c18); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c19(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseUndefinedLiteral() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 9) === peg$c20) {
        s1 = peg$c20;
        peg$currPos += 9;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c21); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c22(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseChildrenSelectors() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 62) {
          s2 = peg$c23;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c24); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSelectors();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c25(s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 60) {
            s2 = peg$c26;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c27); }
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parse_();
            if (s3 !== peg$FAILED) {
              s4 = peg$parseSelectors();
              if (s4 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c28(s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse_();
          if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 94) {
              s2 = peg$c29;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c30); }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parse_();
              if (s3 !== peg$FAILED) {
                s4 = peg$parseSelectors();
                if (s4 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c31(s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parse_();
            if (s1 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 32) {
                s2 = peg$c32;
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c33); }
              }
              if (s2 !== peg$FAILED) {
                s3 = peg$parse_();
                if (s3 !== peg$FAILED) {
                  s4 = peg$parseSelectors();
                  if (s4 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c34(s4);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parse_();
              if (s1 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 43) {
                  s2 = peg$c35;
                  peg$currPos++;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c36); }
                }
                if (s2 !== peg$FAILED) {
                  s3 = peg$parse_();
                  if (s3 !== peg$FAILED) {
                    s4 = peg$parseSelectors();
                    if (s4 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c37(s4);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parse_();
                if (s1 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 45) {
                    s2 = peg$c38;
                    peg$currPos++;
                  } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c39); }
                  }
                  if (s2 !== peg$FAILED) {
                    s3 = peg$parse_();
                    if (s3 !== peg$FAILED) {
                      s4 = peg$parseSelectors();
                      if (s4 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c40(s4);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseTrueToken() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c41) {
        s1 = peg$c41;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c42); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseFalseToken() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c43) {
        s1 = peg$c43;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c44); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1;

      peg$silentFails++;
      s0 = [];
      if (peg$c46.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c47); }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c46.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c47); }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c45); }
      }

      return s0;
    }


        function mergeProps(array) {
          var merged = {};
          for (var i = 0; i < array.length; i++) {
            var pair = array[i]
            for (var key in pair) {
              merged[key] = pair[key]
            }
          }

          return merged;
        }

        function resolveOperator(comparator) {
          return comparator === '=' ? 'equals' : comparator === '~' ? 'contains' : 'equals'
        }

        function resolveNameAndType(name, props, comparator) {
          if ('['.includes(name[0])) {
            name = name.substring(1)
          }
          if ('&|'.includes(name[0])) {
            comparator = name[0]
            name = name.substring(1)
          }
          if (name.startsWith('.')) {
            props.value = props.name
            props.type = 'class';
            props.operator = 'contains'
            props.name = 'classes'
          }
          else if (name.startsWith('#')) {
            props.type = 'id';
            props.value = props.name
            props.operator = 'equals'
            props.name = 'id'
          }
          else if (name.startsWith('@')) {
            props.type = 'name';
            props.value = props.name
            props.operator = 'equals'
            props.name = 'name'
          }
          else {
            props.operator = resolveOperator(props.comparator && props.comparator.length ? props.comparator[props.comparator.length - 1] : undefined)
            props.name = name + props.name
          }
          if (props.comparator) {
            delete props.comparator
          }
        }


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail(peg$endExpectation());
      }

      throw peg$buildStructuredError(
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})();