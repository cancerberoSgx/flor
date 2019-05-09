# Flor


<!-- toc -->

<!-- tocstop -->


WIP

 * Based on the core of [blessed](https://github.com/chjj/blessed): `tput.js` and `program`. 
 * High level components
 * JSX 
 * Terminal compatibility well tested 
 * Mouse support
 * efficient screen rendering. 
 * 100% Typed (TypeScript)
 * Documentation!
 * tests for each feature, component and API.
 * framework to write tests

## Why ?

[Blessed library](https://github.com/chjj/blessed) is great and tput.js implementation seems to be fast and portable. So why write another library?

 * Blessed screen and its widget implementations are 

   * not well documented
   * screen, element, list and others are too coupled
   * screen and element have too many responsibilities
   * there are important parts of screen and element implementation that cannot be customized or disabled, like border, label, hover, focus
   * not supported. 
   * not lightweight: for example, for each item of list, a box is created, and not just for the viewport but for all items in the list
   * I really want to understand how to solve the problem
   * The source code is for smart people and some parts eludes me
   * I want to build a toolkit based on tested/documented API using TypeScript 
   * extensibility API is not clear. 
   * I want to provide a very flexible extension API
   * I don't think I'm missing a great deal not being able to use blessed widgets or blessed-contrib widgets. 





