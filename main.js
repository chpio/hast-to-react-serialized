import propInfo from 'property-information';
import unistIs from 'unist-util-is';

export default function hastToReactSerialized(node) {
	if (unistIs('root', node)) {
		if (node.children.length === 1 && unistIs('element', node.children[0])) {
			node = node.children[0];
		} else {
			node = {
				type: 'element',
				tagName: 'div',
				properties: {},
				children: node.children
			};
		}
	} else if (!unistIs('element', node)) {
		throw new Error(`Expected root or element, not '${(node && node.type) || node}'`);
	}

	return processNode(node);
}

function processNode(node) {
	const attrs = {};
	Object.keys(node.properties).forEach(name => {
		const info = propInfo(name) || {};
		let value = node.properties[name];
		if (info.boolean) {
			value = !!value;
		}
		if (
			value === null ||
			value === undefined ||
			value === false ||
			Number.isNaN(value) ||
			(info.boolean && !value)
		) {
			return;
		}
		if (Array.isArray(value)) {
			value = value.join(info.commaSeparated ? ',' : ' ');
		}
		if (name === 'style' && typeof value === 'string') {
			value = parseStyle(value);
		}
		attrs[info.propertyName || name] = value;
	});

	let children = [];
	if (node.children) {
		node.children.forEach(child => {
			if (unistIs('element', child)) {
				children.push(processNode(child));
			} else if (unistIs('text', child)) {
				children.push(value.value);
			}
		});
	}

	return [node.tagName, Object.keys(attrs).length === 0 ? null : attrs, ...children];
}

function parseStyle(value) {
	const result = {};
	value.split(';').forEach(declaration => {
		const pos = declaration.indexOf(':');
		if (pos !== -1) {
			const key = camelCase(declaration.slice(0, pos).trim());
			result[key] = declaration.slice(pos + 1).trim();
		}
	});
	return result;
}

function camelCase(val) {
	if (val.slice(0, 4) === '-ms-') {
		val = `ms-${val.slice(4)}`;
	}
	return val.replace(/-([a-z])/g, (_, v) => v.toUpperCase());
}
