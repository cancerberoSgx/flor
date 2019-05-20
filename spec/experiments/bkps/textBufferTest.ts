// import * as TextBuffer from 'text-buffer'
// import { equal, ok } from 'assert';

// const buffer = new TextBuffer({text: "abcdefghijklmnopqrstuvwxyz"})
// const markerCreations : TextBuffer.Marker[]= []
//  buffer.onDidCreateMarker (marker=> markerCreations.push(marker))
//    let  markersUpdatedCount = 0
//     buffer.onDidUpdateMarkers (()=> markersUpdatedCount++)

//     const marker = buffer.markRange([[0, 3], [0, 6]])
//     ok(marker.getRange().isEqual([[0, 3], [0, 6]]))

//     buffer.setTextInRange([[0,0], [0,2]],'')
//     console.log(marker.getRange());

//     // ok(marker.getRange().isEqual([[0, 3], [0, 6]]))

//     console.log(buffer.getText());

//     // marker.

//     // expect(marker.getHeadPosition()).toEqual [0, 6]
//     // expect(marker.getTailPosition()).toEqual [0, 3]
//     // expect(marker.isReversed()).toBe false
//     // expect(marker.hasTail()).toBe true
//     // expect(markerCreations).toEqual [marker]
//     // expect(markersUpdatedCount).toBe 1
