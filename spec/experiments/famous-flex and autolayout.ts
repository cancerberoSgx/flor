import { objectMapValues } from 'misc-utils-of-mine-generic';

// import * as kiwi from 'kiwi.js';
// import { equal } from 'assert';

// // Create a solver
// var solver = new kiwi.Solver();

// // Create edit variables
// var left = new kiwi.Variable();
// var width = new kiwi.Variable();
// solver.addEditVariable(left, kiwi.Strength.strong);
// solver.addEditVariable(width, kiwi.Strength.strong);
// solver.suggestValue(left, 100);
// solver.suggestValue(width, 400);

// // Create and add a constraint
// var right = new kiwi.Variable();
// solver.addConstraint(new kiwi.Constraint(new kiwi.Expression([-1, right], left, width), kiwi.Operator.Eq));

// // Solve the constraints
// solver.updateVariables();
// equal(right.value(), 500);

// console.log(right);

var AutoLayout = require('autolayout');
var constraints = AutoLayout.VisualFormat.parse([
  'H:|[view1(==view2)]-10-[view2]|',
  'V:|[view1,view2]|'
], {extended: true});
var view = new AutoLayout.View({constraints: constraints});
view.setSize(400, 500);

// console.log(objectMapValues(view.subViews.view1, (v: any)=>v.value)); // {left: 0, top: 0, width: 195, height: 500}
console.log();

console.log(view.subViews.view2._attr); // {left: 205, top: 0, width: 195, height: 500}
