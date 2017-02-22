# snowf
<p>
	<a href="https://www.npmjs.com/package/snowf"><img src="https://img.shields.io/npm/v/snowf.svg" alt="Version"></a>
	<a href="https://www.npmjs.com/package/snowf"><img src="https://img.shields.io/npm/dt/snowf.svg" alt="Downloads"></a>
	<a href="https://www.npmjs.com/package/snowf"><img src="https://img.shields.io/npm/l/snowf.svg" alt="License"></a>
</p>

> Javascript snowflakes generator -- Let it snow on your page! ❄

![](demo/preview.gif)

* All modern browsers are supported (Tested in Chrome, Firefox, Opera, Safari, IE9+ and Edge).

### Install

#### [npm](https://www.npmjs.com/package/snowf):

```bash
npm install snowf --save
```

### Usage

Include snowf with script tag:

```html
<script src="snowf.min.js"></script>
```

Or use modules:

```javascript
// ES6
import snowf from 'snowf';

// Commonjs
var snowf = require('snowf');

```

Simply init snowf like this:

```javascript
snowf.init({
	size: 5,
	amount: 50
});
```

### Default Options

Argument | Type | Default Value | Description
:---: | :---: | :---: | ---
**dom** | *HTMLDomElement, String* | *document.body* | The element that snowfall canvas append to.
**amount** | *Number* | *50* | Number of snowflakes displayed at a time.
**size** | *Number* | *5* | Size of snowflakes.
**speed** | *Number* | *1.5* | Vertical speed of snowflakes. The larger, the snowflakes drop faster.
**wind** | *Number* | *0* | Horizontal wind power. Wind will blow right if this is a positive number, and a negative number makes wind blow left.
**color** | *String* | *'#fff'* | Color of snowflakes. This option accepts HEX or RGB color code, such as "#fff", "#ffffff", "rgb(255,255,255)".
**opacity** | *Number* | *0.8* | The max opacity of snowflakes. The plugin will generate snowflakes with different opacity from 0 to this number.
**swing** | *Number* | *1* | Swing offset of snowflakes. If you don't want them to swing, set this option as 0.
**image** | *String* | *null* | Set this option to replace the snowflake with your image.
**zIndex** | *Number* | *null* | Position of the canvas layer. Set the layer front or back by changing this value.

### More Examples

```javascript
var snow = snowf.init();

// Adjust width and height of window:
window.onresize = function() {
  snow.resize();
};

// Reset the Snowf object and regenerate snowflakes:
snow.reset();

// reset the Snowf object with new options:
snow.setOptions({
	amount: 80
});

// Change the wind power ( This will not reset the Snowf object ):
// Arguments: (wind, time)
snow.wind(1);
snow.wind(2, 2000);

// Change the vertical speed ( This will not reset the Snowf object )
snow.speed(2);
```

### Others

#### [react-snowf](https://github.com/Fuxy526/react-snowf.git) (use snowf with React)

#### [vue-snowf](https://github.com/Fuxy526/vue-snowf.git) (use snowf with Vue)

### Licence

snowf is open source and released under the MIT Licence.

Copyright (c) 2017 Fuxy526
