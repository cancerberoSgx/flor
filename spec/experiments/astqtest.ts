// import { Node, isDomNode, Document, createElement } from '../../src';
// import { createDomElement, isDomElement, isDomText } from '../../src/dom/nodeUtil';

// // import * as ASTQ from 'astq'
// var ASTQ = require("astq")
// var astq = new ASTQ()
// astq.adapter({
//     taste:            function (node : any) {
//       // typeguards agains input nodes.
//     return isDomNode(node)
//    },
//     getParentNode:    function (node: Node)       {
//       return node && node.parentNode
//     },
//     getChildNodes:    function (node: Node)       {
//       return node && node.childNodes
//     },
//     getNodeType:      function (node: Node)       {
//       // console.log('getNodeType', node && node.nodeTypeName || node.nodeType);
//       return node && node.nodeTypeName || node.nodeType
//     }
//       ,//(isDomElement(node) ? node.tagName : node && node.nodeTypeName||node.nodeType)+''    },
//     getNodeAttrNames: function (node: Node)       {
//       return node && node.getAttributeNames()
//     },
//     getNodeAttrValue: function (node: Node, attr: string) {
//       return node && node.getAttributeValue(attr)
//      }
// })

// const doc = new Document()
//     const el =createDomElement(doc, {
//       children: ['hello', {
//         textContent: 'world',
//       dummy:'asda',
//       children: ['bite'],
//       tagName: 'me'

//     } as any,
//     {
//       tagName: 'sdf',
//       id:"id222" ,
//       textContent: 'sdfsd',
//       name: 'ajsjsjsjs',
//     children: [
//       'asdasd', {
//       textContent: 'asd',
//       tagName: 'ddd',
//       classes: ['c1', 'c2']
//     },
//       'asdasdas'
//     ]}
//   ],
//     parent: doc.body,
//     name: 'name666'
//   } as any )
//     // doc.body.appendChild(el)

//     console.log((doc.outerHTML));

//     // elements at any depth with has a direct children of type text
//     const result = astq.query(doc, '// element [ ./* [ type() == "text" ] ]')

//     result .forEach(function (n:any) {
//         console.log(' * '+n.outerHTML)
//     })

//     // const result = astq.query(doc, '// element [ ./* [ type() == "text" ] ]')

//     // [ type() === "element"]')//, {}, true)///element  type() == 'text' ]`)
// // console.log(result);
// // debuggerC
// // console.log(result);

// // const JsonAsty = require("json-asty")

// // /*  the JSON input  */
// // let json = `{
// //     "foo": {
// //         "bar": true,
// //         "baz": 42.0,
// //         "quux": [ "test1\\"test2", "test3", 7, true ]
// //     }
// // }`
// // // console.log(`JSON (old):\n${json}`)

// // /*  parse JSON into AST  */
// // let ast = JsonAsty.parse(json)

// // let source = `
// //     class Foo {
// //         foo () {
// //             const bar = "quux"
// //             let baz = 42
// //         }
// //     }
// // `

// // // let ast = acorn.parse(source, { ecmaVersion: 6 })

// // let astq = new ASTQ()
// // astq.adapter("mozast")

// // doc.body.appendChild(createElement(doc, {
// //   // bg: 'blue', children: [{foo: 'hello'}]
// // }))
// // var nodes = astq.query(node, "Foo", {}, true)

// // let astq = new ASTQ()
// // astq.adapter("flor.programDom")
// // astq.query(ast, `
// //     // VariableDeclarator [
// //            /:id   Identifier [ @name  ]
// //         && /:init Literal    [ @value ]
// //     ]
// // `).forEach(function (node) {
// //     console.log(`${node.id.name}: ${node.init.value}`)
// // })
