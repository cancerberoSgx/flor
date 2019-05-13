//@ts-nocheck

const diff_match_patch = require('diff-match-patch')  
var dmp = new diff_match_patch();

// function diff_lineMode(text1, text2) {
//   var a = dmp.diff_linesToChars_(text1, text2);
//   var lineText1 = a.chars1;
//   var lineText2 = a.chars2;
//   var lineArray = a.lineArray;
//   var diffs = dmp.diff_main(lineText1, lineText2, false);
//   dmp.diff_charsToLines_(diffs, lineArray);

//   return diffs;
// }

// const v = diff_lineMode('sebastiàn', 'sebastunnn')


// console.log(v)//, dmp.patch_apply(v, 'sebastunnn'))//  ('', 'abgsbsbssbsb'));


var patches = dmp.patch_make('x1234567890123456789012345678901234567890123456789012345678901234567890y', 'xabcy');
var results = dmp.patch_apply(patches, 'x123456789012345678901234567890-----++++++++++-----123456789012345678901234567890y')
console.log(results)

