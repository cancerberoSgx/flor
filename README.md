# Flor

In Summary, it takes tput.js and program.js from [blessed](https://github.com/chjj/blessed) and implement form scratch the part on top of it, this is, screen/node/element. 

<!-- toc -->

<!-- tocstop -->


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

These are the reasons I want to build another Screen/Node/Element/ on top of Tput and Program instead of forking / contributing to bhlessed.

***Reasons:*** 

### Un maintained complex project

 * it has some very hard / smart code fragments like element/screen render/draw methods that are too monolitic and large. 
 * has large end-user features not related to the core
 * community of users seem to have abandoned it... and there is no clear fork / place to follow up... :(

### Performance

I don't think building on top of blessed like the design propose will escalate on performance: Take for example list: 

 * each list item is a box
 * each box is a element, so is a node, and so is an eventemitter. 
 * I want to render 5000 items (example: a tree that displays package-lock.json)
 * it instantiate all items - not just the view port. 
 * I implemented a tree view, inerithing from Element without composing or using sub-elements: https://github.com/cancerberoSgx/accursed/blob/master/src/blessed/treeView.ts . Works OK, only renders the items in the viewport. I realized that I needed very little of Element/screen API for doing this - that's the first motivation to build my own API on top of tput/program. Tests: https://github.com/cancerberoSgx/accursed/blob/master/spec/treeViewSpec.tsx  interactive tests: https://github.com/cancerberoSgx/accursed/blob/master/spec/treeViewKeysSpec.tsx
 
 ### APIs / framework for extensions / composition / layouts, gestures. 

 IMO: instead of building concreate widgets and solutions like list, label, scrollbar, hovertext, border, etc, blessed should focus on building generic concepts like layouts, visual composition, property cascade, event policies, gesture managers (for focus, hover, etc) so is easy to build lightweight complex components and compose them instead of using a 4x4 list kind of widget for everything. 

##

and also I don't want to maintain yet another fork because: 

 * API seems to be oriented to low-level developers - not to extensibility, composition, etc
 * design of options / members is not clear oriented to concreate things, not generic
 * Blessed screen and its widget implementations are 
   * not documented
   * screen, element, list and others are too coupled
   * screen and element have too many responsibilities
   * no tests so if you modify the core can't be sure of the consequences . 
   instead of focusing on the core, I see its has some complex features that have great impact on the core / code size, performance... 
   * there are important parts of screen and element implementation that cannot be customized or disabled, like border, label, hover, focus - they are hardcoded there... 
   * custom layouts are hard to implement and buggy
   * methods for getting dimentions/ position / shrink etc are not clear implementation magical and sometimes throws stack overflow... the code is very hard to grasp for me
     + stablish advanced rules for focus or scrolling is hard / impossible... Everything is too centralized in the screen/element
   * the code base is too large and too complex to refactor - migrate to TypeScript
   * not lightweight: see above example on list
   * The source code is for smart people and some parts eludes me. render/draw parts are too complex, too monolitic and hard to refactor/separate
   * I want to build a toolkit based on tested/documented API using TypeScript 
   * extensibility API is not clear. 
   * I want to provide a very flexible extension API
   * I don't think I'm missing a great deal not being able to use blessed widgets or blessed-contrib widgets. 
   * improtant things missing like style propagation,  (https://github.com/chjj/blessed/issues/376)... 





