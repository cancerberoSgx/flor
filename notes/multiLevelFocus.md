
 TODO: design - multi focus categories support:beides focus, we also need to suport 'active' that is pretty similar: a focus inside a focus. So we wonder, if instead adding separate support for this, is not better to just add muti-level focus support, instead of one focus manager, we have several, each associated to a string key that needs to be used both for elements to declare focusable and also for managers when change focus focusNext() etc. example:
```
<form focusable={LEVEL_1}>

<RichEditor></RichEditor>
<FontSizePiker>
<FontOption focusable={LEVEL_3>arial</FontOption>
</FontSizePiker>
<TextArea focusable={LEVEL_2>
<button> Submit</buttom focusable={LEVEL_1}>
</form>

// then managers registering actions for each level: 

events.addKeyListener('tab'=>focus.focusNext(LEVEL_1))
events.addKeyListener('left'=>focus.focusNext(LEVEL_2))
events.addKeyListener('up'=>focus.focusNext(LEVEL_3)
```

For the user the experience should be: 
  * with alt it navigates thgouh the top-level components, like panels, frames, primary buttons, etc
  * when a panel of this level gains focus, he can use the second level keys (left - right) to navigate thgouht its descendants LEVEL_2 focusables. It's important to ensure only LEVEL_1 decesndants are focused at this momebnt. 
  * ^when a view/box of LEVEL_2 is active (like a sub-panel / rich-widget, etc the user can move INSIDE it thgoug its LEVEL_3 descendants using updown keys)
  * etc  (I think with three levels is more than enough for the terminal). I only saq two levels
