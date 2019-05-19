import {   debug, FlorDocument,  YogaDocument, Text, BorderStyle } from '../../src'
import { Flor } from '../../src/jsx/createElement'
import { Box } from '../../src/component/FlexBox';
import {FLEX_DIRECTION_ROW, DISPLAY_FLEX, FLEX_DIRECTION_COLUMN_REVERSE} from '../../src/yogaDom/types'
  const flor = new FlorDocument({
    documentImplementation: ()=>new YogaDocument()
  })

  const app =   <Box top={0} left={0} height={.999} width={.999}
        flexDirection={ FLEX_DIRECTION_ROW}
      >
        <Box width={.4} height={.999} flexShrink={1}
          flexDirection={ FLEX_DIRECTION_COLUMN_REVERSE}>
          <Box width={.999} flexShrink={1} border={{ type: BorderStyle.round }} height={.3} fg="red"></Box>
          <Box width={.999} height={.7} flexShrink={1} border={{ type: BorderStyle.roundTripleDash }}
            padding={{ top: 1, bottom: 2, left: 2, right: 2 }} ch="/" fg="yellow"
          >
          </Box>
        </Box>
        <Box width={.6} flexShrink={1} height={.999}
          flexDirection={FLEX_DIRECTION_COLUMN_REVERSE}>
          <Box width={.999} height={.3} flexShrink={1} ch="." border={{ type: BorderStyle.roundQuadrupleDash }} >
          </Box>
          <Box width={.999} height={.3} ch="-"
            flexShrink={1} flexGrow={1} border={{ type: BorderStyle.round }} >
          </Box>
          <Box width={.999} flexShrink={1} border={{ type: BorderStyle.double }} ch="|" height={.4}></Box>
        </Box>
      </Box>

//   const app =   <box top={0} left={0} height={.999} width={.999}
//   flexDirection={ FLEX_DIRECTION_ROW}
// >
//   <box width={.4} height={.999} flexShrink={1}
//     flexDirection={ FLEX_DIRECTION_COLUMN_REVERSE}>
//     <box width={.999} flexShrink={1} border={{ type: BorderStyle.round }} height={.3} fg="red"></box>
//     <box width={.999} height={.7} flexShrink={1} border={{ type: BorderStyle.roundTripleDash }}
//       padding={{ top: 1, bottom: 2, left: 2, right: 2 }} ch="/" fg="yellow"
//     >
//     </box>
//   </box>
//   <box width={.6} flexShrink={1} height={.999}
//     flexDirection={FLEX_DIRECTION_COLUMN_REVERSE}>
//     <box width={.999} height={.3} flexShrink={1} ch="." border={{ type: BorderStyle.roundQuadrupleDash }} >
//     </box>
//     <box width={.999} height={.3} ch="-"
//       flexShrink={1} flexGrow={1} border={{ type: BorderStyle.round }} >
//     </box>
//     <box width={.999} flexShrink={1} border={{ type: BorderStyle.double }} ch="|" height={.4}></box>
//   </box>
// </box>


//   <Box 
//   // width={.999} height={.999}
// flexDirection={FLEX_DIRECTION_ROW} preventChildrenCascade={true}
//         display={DISPLAY_FLEX} top={2} left={2} 
//         height={13} width={32}
//       >
//         <Box
//         heightAuto
//         widthAuto
//         flexGrow={1}
//         >
//         <Text>hhello world</Text><Text>hhello world</Text>{}
//         </Box>

//         <Box
//         widthAuto
//         heightAuto
//         ><Box height={4} width={4}>4x4</Box>
//         </Box>
//   </Box>
  flor.focus.installDefaultChangeFocusKeys()
  const le = flor.create(app)
  flor.render()
  debug(flor.body.outerHTML)
