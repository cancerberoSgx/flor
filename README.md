# Flor

In Summary, it takes tput.js and program.js from [blessed](https://github.com/chjj/blessed) and implement form scratch the part on top of it, this is, screen/node/element.

<!-- toc -->

- [PROGRESS](#progress)
  * [Program DOM](#program-dom)
    + [ProgramElement](#programelement)
    + [ProgramDocument](#programdocument)
    + [TextNode](#textnode)
    + [Element Properties](#element-properties)
      - [AttrsProps](#attrsprops)
      - [StyleProps](#styleprops)
        * [Border](#border)
        * [Layout](#layout)
        * [Overflow](#overflow)
      - [ElementProps](#elementprops)
      - [Element bounds](#element-bounds)
        * [getBounds()](#getbounds)
        * [getContentBounds()](#getcontentbounds)
        * [getInnerBounds()](#getinnerbounds)
  * [Renderer](#renderer)
  * [Managers](#managers)
  * [JSX](#jsx)
  * [Core component library](#core-component-library)
    + [input](#input)
    + [scroll](#scroll)
- [WIP](#wip)
- [Why ?](#why-)
  * [Un maintained complex project](#un-maintained-complex-project)
  * [Performance](#performance)
  * [APIs / framework for extensions / composition / layouts, gestures.](#apis--framework-for-extensions--composition--layouts-gestures)
  * [also](#also)

<!-- tocstop -->

# PROGRESS

## Program DOM 
 * `src/programDom` implements a HTML DOM-like model based on Program and renderer (see below).
 * extends a generic DOM base (Document, Node, Element, TextNode) agnostic of Program `src/dom`

### ProgramElement
  * Analog to HTML Node and Element
  * supports lots of properties (see below) both for end user and for extensions.
  
### ProgramDocument
    * Analog to HTML document
    * Contains a root Element `body` where elements live

### TextNode
    * Element's children can be strings in which case they are wrapped in a TextNode
    * The renderer treats TextNodes specially in a separate implementation than ordinary Element children. 
    * text nodes don't have props like width, top, border or padding 
    * they are impacted by subset of parent's props like fg, bold, textWrap.

### Element Properties
  * hierarchical model for Element properties (attributes). Hierarchy:
#### AttrsProps
 *  base class supporting only terminal character attrs 
 * bg, fg, ch, bold, etc
 * only native things
#### StyleProps 
  * extends AttrsProps
  * core non native properties:
    * top, left, width, height, border, padding, layout, overflow, textWrap, etc
##### Border
 * Supports 8 border style for elements out of the box
 * Extensible. 
 * border property extends StyleProps so it has its own styles.
##### Layout
 * extensible design
 * out of the box, these layouts are supported: 'top-down', 'left-right', 'diagonal',  'alt-diagonal', 'binary-tree',  'justified-layout'
 * All are very flexible with lots of configurations, in particular justifiedLayout
 * We want to add more, probably similar to html's
 * Now integrating yoga-layout (flex-box implementation) which will solves a lot of needs both internal and user's 
 

##### Overflow
  * By default overflow==='visible' children outside parent viewport are shown
  * if overflow==='hidden', children parts outside the parent viewport won't be drawn (the parts inside the parent viewport will)
#### ElementProps
  * ElementProps: extends StyleProps
    * event handlers, extensibility, rendering hooks, property propagation hooks, etc

#### Element bounds
* left, top, width, height: 
  * relative to the parent
  * Support integer values (cols/rows)
  * Support percent/ratio values `-1 < x < 1`
  * top and left support negative values
  * derived bounds properties are optimally auto calculated only when neccesary:
  
##### getBounds() 
   * absolute outer bounds including border 
   * (and margin in the future if added. 
   * Properties: absoluteLeft, absoluteTop, props.height, props.width
##### getContentBounds()
   * calculated from getBounds()
   * absolute coords inside padding
   * includes excludes border and padding
   * absolute bounds where children coordinates are relative to
   * Properties: absoluteContentTop, absoluteContentLeft, contentWidth, contentHeight
##### getInnerBounds()
  * similar to getContentBounds but including the padding and excluding the border. 
  * Where the background is painted.

## Renderer
  * the most important class
  * limiting the rendering to just a partial region
  * very flexible API, for hooking in on rendering moments. 
    * renderElementBody, renderChildren, renderTextNode, renderChild, renderBorder, etc. Elements can override using props. 
  * text nodes render supports word wrap. very basic.
  * renders Elements and their children and text nodes in the program
  * supports element props cascading / propagation. currently 2 modes
  * central method for writing
  * screen buffer: in memory representation of what's currently printed on the screen
    * Optional
    * Tests to verify it doesn't affect performance. 
    * Necessary to tests so we can query / assert against printed output.
  * border drawing
  * writeArea attribute to ensure writing only on a certain area at a given time.

## Managers
 * EventManager
   * handle centralized all core events (keys, mouse)
 * FocusManager - 
   * centralized flexible focus manager  
   * designed for a generic/flexible API
   * focused, focusable, focusNext - focusPrevious
 * CursorManager - responsible of the cursor. 
   * Currently it doesn't do much
   * artificial cursors not supported (only if really important)
 * FlorDocument - a Home object with an easy to use API
   * initialize all the managers
   * easy api for:
     * start a new program with default configuration
     * create elements, manipulate document
     * listen events
     * trigger events
     * render life cycle
     * manage cursor
     * manage focus.
  
## JSX
 * standard JSX rules and behavior supported
 * one intrinsic element since, like html, all elements end up being the same thing: ``<box>``
 * Features beyond JSX, component life cycle, context, state, etc are not supported
 * ClassElement (Components) and FunctionElement supported 
 * Component class with props associated with a ProgramElement that implements it.
   * State is declared but not implemented.
 * refs for intrinsic elements and component instances.

## Core component library 
 * Everything else, like input, scroll, text area, lists, popups, etc should be implemented as components on top of ProgramElement.
 * `src/component`
 * provide both JSX component and plain old JS function to create it.
### input
  * `<Input>` and `input()`
  * like html input - single line. 
  * Base abstract class designed to build up input els from there
  * `value` / `onChange` refers to when the user explicitly changed the value by pressing enter or blur. 
  * `ìnput` / `onInput` refers to when the user is writing /deleting characters.
  * Configurable keys keys to delete chars. Default: `backspace`  
  * Configurable keys for 'enter' action. Default: `enter`
### scroll
  * `<Scrollable>` / `scrollable()`
  * well tested vertical and horizontal scroll for its children.
  * fast and lightweight
  * no flickering 
  * animations for fast scroll actions!
  * configurable keys for up, down, fastUp, fastDown, gotoEnd, etc
  * Event handlers
  * and more

# WIP

 * Based on the core of [blessed](https://github.com/chjj/blessed): `tput.js` and `program`. 
 * High level components
 * Highly configurable Elements
 * Document, Element, text-nodes very similar to HTML DOM. 
 * JSX 
 * TypeScript, fully documented
 * Separation of concerns: instead of just Screen, we have Renderer, Program, EventManager, FocusManager, Document, Element, Node, TextNode, Border, Layout, Anim, Logger, Input, etc. 
 * More controlled EventTarget, not using eventemitter, but named methods to better document / type the events. 
 * Extensibility is given by properties and composition, instead of sub classing. 
 * Terminal compatibility well tested in three systems: linux, mac, windows. 
 * efficient screen rendering. performance tests and performance degradation when adding features... 
 * 100% Typed (TypeScript)
 * Documentation!
 * tests for each feature, component and API. 
 * framework to functional tests to simulate mouse / key events
 * flexible event API for keys and mouse decouple from rendering, focus, hover, etc. centralized. 
 * High level JSX handler attribute support for events 
 * flexible focus API decouple from events and rendering
 * configurable style cascade propagation - spec/rendererCascadeSpec.ts

# Why ?

[Blessed library](https://github.com/chjj/blessed) is great and tput.js implementation seems to be fast and portable. So why write another library?

First of all I learn a lot with playing with blessed in my pet project [accursed](https://github.com/cancerberoSgx/accursed) that basically build high level apis, jsx, typings, etc on top of blessed. Also I documented A LOT while understanding its API. I have learned a lot with it and I'm very grateful to the author. 

These are the reasons I want to build another Screen/Node/Element/ on top of Tput and Program instead of forking / contributing to blessed.

***Reasons:*** 

## Un maintained complex project

 * it has some very hard / smart code fragments like element/screen render/draw methods that are too monolithic and large. 
 * has large end-user features not related to the core
 * community of users seem to have abandoned it... and there is no clear fork / place to follow up... :(

## Performance

I don't think building on top of blessed like the design propose will escalate on performance: Take for example list: 

 * each list item is a box
 * each box is a element, so is a node, and so is an eventemitter. 
 * I want to render 5000 items (example: a tree that displays package-lock.json)
 * it instantiate all items - not just the view port. 
 * I implemented a tree view, inheriting from Element without composing or using sub-elements: https://github.com/cancerberoSgx/accursed/blob/master/src/blessed/treeView.ts . Works OK, only renders the items in the viewport. I realized that I needed very little of Element/screen API for doing this - that's the first motivation to build my own API on top of tput/program. Tests: https://github.com/cancerberoSgx/accursed/blob/master/spec/treeViewSpec.tsx  interactive tests: https://github.com/cancerberoSgx/accursed/blob/master/spec/treeViewKeysSpec.tsx
 
 ## APIs / framework for extensions / composition / layouts, gestures. 

 IMO: instead of building concrete widgets and solutions like list, label, scroll bar, hover text, border, etc, blessed should focus on building generic concepts like layouts, visual composition, property cascade, event policies, gesture managers (for focus, hover, etc) so is easy to build lightweight complex components and compose them instead of using a 4x4 list kind of widget for everything. 

## also

and also I don't want to maintain yet another fork because: 

 * API seems to be oriented to low-level developers - not to extensibility, composition, etc
 * design of options / members is not clear oriented to concrete things, not generic
 * Blessed screen and its widget implementations are 
   * not documented
   * screen, element, list and others are too coupled
   * screen and element have too many responsibilities
   * no tests so if you modify the core can't be sure of the consequences . 
   * instead of focusing on the core, I see its has some complex features that have great impact on the core / code size, performance... 
   * there are important parts of screen and element implementation that cannot be customized or disabled, like border, label, hover, focus - they are hard coded there... 
   * custom layouts are hard to implement and buggy
   * methods for getting dimensions/ position / shrink etc are not clear implementation magical and sometimes throws stack overflow... the code is very hard to grasp for me
   * establish advanced rules for focus or scrolling is hard / impossible... Everything is too centralized in the screen/element
   * the code base is too large and too complex to refactor - migrate to TypeScript
   * not lightweight: see above example on list
   * The source code is for smart people and some parts eludes me. render/draw parts are too complex, too monolithic and hard to refactor/separate
   * I want to build a toolkit based on tested/documented API using TypeScript 
   * extensibility API is not clear. 
   * I want to provide a very flexible extension API
   * I don't think I'm missing a great deal not being able to use blessed widgets or blessed-contrib widgets. 
   * important things missing like style propagation,  (https://github.com/chjj/blessed/issues/376)...





