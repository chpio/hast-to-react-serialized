# rehype-react-serialized

Converts *rehype* into a simple and small format. Which can be rendered to a react-dom by
[render-react-serialized](https://www.npmjs.com/package/render-react-serialized).

## Example

Process the data on the server or as a build step and store the result.

```javascript
import unified from 'unified';
import rehypeReactSerialized from 'rehype-react-serialized';

// ...

const inputContent = /* read input file */;

const reactSerialized = unified()
	.use(/* process the data to the rehype format */)
	.use(rehypeReactSerialized)
	.processSync(inputContent)
	.contents;

// store reactSerialized, for example as an JSON file
```

Then use [render-react-serialized](https://www.npmjs.com/package/render-react-serialized)
to render it on the client.

```javascript
import React from 'react';
import renderReactSerialized from 'render-react-serialized';

// ...

class ExampleComp extends React.Component {
	render() {
		const reactSerialized = /* load the react-serialized data or pass it in as prop */;
		return (
			<div class="foo bar">
				{renderReactSerialized(reactSerialized, {createElement: React.createElement})}
			</div>
		);
	}
}
```
