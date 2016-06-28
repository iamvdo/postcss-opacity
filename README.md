# PostCSS Opacity [![Build Status](https://travis-ci.org/iamvdo/postcss-opacity.svg)](https://travis-ci.org/iamvdo/postcss-opacity)

[PostCSS](https://github.com/postcss/postcss) plugin that adds support for legacy browser opacity alternatives.

## Example
```js
postcss([
	require('postcss-opacity')
])
```

```css
/* Input example */
.foo {
  opacity: .5;
}
```

```css
/* Output example */
.foo {
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)";
  opacity: .5;
}
```

## Legacy
Support for IE 5-7, Safari 1.X, Netscape

```js
postcss([
	require('postcss-opacity')({
		legacy: true	
	})
])
```

```css
/* Input example */
.foo {
  opacity: .5;
}
```

```css
/* Output example */
.foo {
  /* IE 8 */
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)";

  /* IE 5-7 */
  filter: alpha(opacity=50);

  /* Netscape */
  -moz-opacity: .5;

  /* Safari 1.x */
  -khtml-opacity: .5;

  /* Modern browsers */
  opacity: .5;
}
```

See [PostCSS](https://github.com/postcss/postcss) docs for examples for your environment.
