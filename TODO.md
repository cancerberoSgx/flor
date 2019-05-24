
## ISSUES

 * setting border: {fg: 'red'} sets the text fg

## TODO
 * TODO: something is wrong with JSX typings - it doesnt allow to declare mandatory children
 * BaseScrollableProps-> Perhaps change name to something more generic like advanceKeys retrocedeKeys since it's used 
   * to more than just scroll (select list items)
 * Css cascading - currently is resolved by the renderer, but i need that information before render. lets another manager resolve that and store it somehow in the el (store it in another props, could be props._data_inherited) - the issue is in yoga, if I dont set the border / padding explicitly then is not considered and erased because is not in the prop, is drawn by the renderer.
 * renderer: erase text nodes outside parent viewport not possible unless the whole body is erased.
 * we are not using Node.attributes - we should make attributes===props
 * prevent children cascade per property - I dont want all my childs to have a border like me that i'm container
 * when look up for mouse event target - we can associate the element in the renderer buffer and so each visible pixel has its element and the lookup is fastest

<!-- 
 notes
 Sequence: CSI = Ps ; Pn m
Mnemonic: SSM
Description: Set specific margin

 This sequence can be used to set any one of the 4 margins. Parameter
 Ps indicates which margin to set (Ps=0 for the top margin, Ps=1 for
 the bottom, Ps=2 for the left and Ps=3 for the right). Pn is the row
 or column to set the margin to. If after this control sequence has
 been processed, the top or bottom margins are not at the top of the
 screen, and the left and right margins are at the screen boundary,
 then the scrolling region is set to the size specified.  If either of
 the left or right margins are not at the screen boundary then the


 Sequence: CSI Pt ; Pb r
Mnemonic: DECSTBM
Description: Set top and bottom margins

                Pt is the number of the top line of the scrolling region;
                Pb is the number of the bottom line of the scrolling region 
                and must be greater than  Pt.
                (The default for Pt is line 1, the default for Pb is the end 
                 of the screen)

Source: <URL:http://www.cs.utk.edu/~shuford/terminal/vt100_reference_card.txt>
Status: DEC private; VT100
-------------------------------------------------------------------------------
Sequence: CSI Pn1 ; Pn2 ; Pn3 ; Pn4 r
Mnemonic: CSR
Description: Change Scrolling Region

Where 3 or more parameters are specified, the parameters are the top,
bottom, left and right margins respectively. If you omit the last
parameter, the extreme edge of the screen is assumed to be the right
margin.

If any of the parameters are out of bounds, they are clipped. If any
of the parameters would cause an overlap (i.e. the bottom margin is
higher than the top margin, or the right margin is less that the left
margin), then this command is ignored and no scrolling region or
window will be active. If all of the parameters are correct, then the
cursor is moved to the top left hand corner of the newly-created
region. The new region will now define the bounds of all scroll and
cursor motion operations. 

[ If only two parameters are specified, this behaves as DECSTBM ] -->
