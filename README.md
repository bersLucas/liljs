![liljs logo](https://user-images.githubusercontent.com/3892772/52523602-d0054680-2c60-11e9-9cba-582003254e54.png)

[![File Size](https://img.shields.io/badge/Size%20(min%2Bgzip)-1.32%20KB-ff9dcc.svg?style=flat-square)](https://www.npmjs.com/package/@berslucas/liljs)
[![version](https://img.shields.io/npm/v/@berslucas/liljs.svg?style=popout-square)](https://www.npmjs.com/package/@berslucas/liljs)
[![David Dependency Status](https://img.shields.io/david/bersLucas/liljs.svg?style=popout-square)](https://david-dm.org/bersLucas/liljs)
[![David devDependencyStatus](https://img.shields.io/david/dev/bersLucas/liljs.svg?style=popout-square)](https://david-dm.org/bersLucas/liljs?type=dev)
[![PRs Welcome](https://img.shields.io/badge/prs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![travis CI](https://img.shields.io/travis/bersLucas/liljs.svg?style=popout-square)](https://travis-ci.org/bersLucas/liljs)

# Installation

```bash
# Fetch the package with npm
npm install @berslucas/liljs

# ...or with yarn
yarn add @berslucas/liljs
```

## .html file
```html
<!--Include liljs as a <script> tag-->
<script src="../ node_modules/@berslucas/liljs/dist/liljs.min.js"></script>
```

# Getting Started
For demos and examples, please visit **[lucasbersier.com/liljs](https://lucasbersier.com/liljs/)**

To start a liljs instance, you must call the function `liljs` with an html element to bootstrap to and an optional object with data for the first render cycle.

```html
<div id="app">
  <!-- Elements using lil-* attributes -->
</div>

<script>
  liljs(document.querySelector('#app'), {
    propertyName: propertyValue,
    propertyName: propertyValue,
    ...
  }).then((app) => {
    
  });
</script>
```

The `liljs` promise will initialize and render your app, and the returned value, `app` will be a proxy containing all properties you have defined. To change a value, use `app.propertyName` and that value will be update both in your proxy and in the DOM.

# Properties

A Property is a value attached to the liljs proxy that will update the proxy once the value is updated. Properties are created by adding attributes to the child elements of the element defined in the first parameter of `liljs()` when you initialize your instance.

Properties can be updated by changing their value. This will also re-render the element that the property is attached to.

## addProp

Sometimes you'd like to add a property after the app has been rendered. This is possible by calling `app.addProp` on your proxy object.

```javascript
liljs(document.querySelector('#app'), {
    propertyName: propertyValue,
    ...
}).then((app) => {
  app.addProp(
    name, type, elemList, value
  )
});
```

This function takes the following parameters:

| Name | Type |	Description |
| - | - | - |
| name | String | Name of a property to add |
| type |	String 	| Bind type (style, text, list, ect...) |
|elemList |	Array |	Array of element(s) to apply this property to|
| value 	| Any 	| Name of the property to render |
