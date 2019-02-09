# lil.js

![File Size](https://img.shields.io/github/size/bersLucas/lil.js/dist/liljs.min.js.svg?label=size&style=popout-square) 
![version](https://img.shields.io/npm/v/@berslucas/liljs.svg?style=popout-square)
![David Dependency Status](https://img.shields.io/david/bersLucas/liljs.svg?style=popout-square)
[![PRs Welcome](https://img.shields.io/badge/prs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

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


