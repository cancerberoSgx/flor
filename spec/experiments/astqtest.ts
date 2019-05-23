import { Node } from '../../src';

// // import * as ASTQ from 'astq'
// var ASTQ = require("astq")
// var astq = new ASTQ()
// astq.adapter({
//     taste:            function (/* node */) { return true           },
//     getParentNode:    function (node: Node)       { return node.parentNode  },
//     getChildNodes:    function (node: Node)       { return node.childNodes  },
//     getNodeType:      function (node: Node)       { return node.nodeTypeName    },
//     getNodeAttrNames: function (node: Node)       { return node.getNodeAttrNames()   },
//     getNodeAttrValue: function (node: Node, attr: string) { return node.getNodeAttrValue(attr) }
// })
// var nodes = astq.query(node, "Foo", {}, true)

// let astq = new ASTQ()
// astq.adapter("flor.programDom")
// astq.query(ast, `
//     // VariableDeclarator [
//            /:id   Identifier [ @name  ]
//         && /:init Literal    [ @value ]
//     ]
// `).forEach(function (node) {
//     console.log(`${node.id.name}: ${node.init.value}`)
// })