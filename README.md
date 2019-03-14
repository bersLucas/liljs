![liljs logo](https://user-images.githubusercontent.com/3892772/52523602-d0054680-2c60-11e9-9cba-582003254e54.png)

[![File Size](https://img.shields.io/badge/Size%20(min%2Bgzip)-1.24%20KB-ff9dcc.svg?style=flat-square)](https://www.npmjs.com/package/@berslucas/liljs)
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
<script src="../node_modules/@berslucas/liljs/dist/liljs.min.js"></script>
```

# Getting Started
To start a liljs instance, you must call the function `liljs` with an html element to bootstrap to and an optional object with data for the first render cycle.

```html
<div id="app">
  <!-- Elements using lil-* attributes -->
</div>

<script>
  let app = liljs(
    document.querySelector('#app'),
    /*
    {
      propertyName: propertyValue
    }
    */
  );
</script>
```

This will create a new liljs instance with a proxy for the value of `textValue` and render "hello world" into the span above. To edit the text in the span, you can modify the value of `app.textValue`, which will update the text value and also re-render that span.


# Properties

A Property is a value attached to the liljs proxy that will update the proxy once the value is updated. Properties are created by adding attributes to the child elements of the element defined in the first parameter of `liljs()` when you initialize your instance.

Properties can be updated by changing their value. This will also re-render the element that the property is attached to.

## Property bindTypes.
| .html attribute | bindType | expects |
| - | - | - |
| `lil-text` | text | String |
| `lil-style` | style | Object |
| `lil-list` | list | Array |

### lil-text
```html
<div id="app">
  <span lil-text="textValue"></span>
</div>

<script>
  let app = liljs(
    document.querySelector('#app'),
    {
      textValue: 'hello world',
    }
  );
</script>
```

This property type appends the value of the property `textValue` into this span. To dynamically update this value, modify the value of `app.textValue`.

### lil-style
```html
<div id="app">
  <span lil-style="styleObj"></span>
</div>

<script>
  let app = liljs(
    document.querySelector('#app'),
    {
      styleObj: {
        color: "white",
        backgroundColor: "#f9a02b"
      },
    }
  );
</script>
```

This property type changes the style of the span element. The key values of `styleObj` in this example are CSS style names and the values are the corresponding values for those CSS keys. As per the docs for [HTMLElement.style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style), CSS style names should be in camelCase and not kebab-case.

### lil-list
```html
<div id="app">
  <ul>
    <div lil-list="listItem"></div>
  </ul>
</div>

<template id="listItem">
  <li>
    List item: <span lil-list-text="listText"></span></b>
  </li>
</template>

<script>
  let app = liljs(
    document.querySelector('#app'),
    {
      listItem: [
        {
          listText: 'one'
        },
        {
          listText: 'two'
        },
        {
          listText: 'three'
        }
      ]
    }
  );
</script>
```

This property type is used to repeat values and present them using a template. A [`<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) element will hold the repeated content. The ID of the `<template>` <i>must<i> have the same name as the property's name. The template can contain `lil-list-text` attribute, which will contain sub-properties.
