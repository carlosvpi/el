# el
MVC

## Documentation

### El(_string_)

_El_ takes a tagname and generates a DOM node with that tag name, wrapped into an El object `el`.

### El(_DOM node_)

_El_ takes a DOM node and wraps it into an El object `el`.

### el.attr

#### el.attr(attrName: string)

Returns the value of the attribute `attrName` of the node within `el`.

#### el.attr(attrName: string, falsey)

Unsets the attribute `attrName` of the node within `el`. Returns `el`.

#### el.attr(attrName: string, value)

Sets the attribute `attrName` of the node within `el` as `value`. Returns `el`.

#### el.attr(attrName: string, f: function)

Equivalent to

```javascript
f(value => el.attr(attrName, value))
```

Returns `el`.

#### el.attr(f: function)

Equivalent to

```javascript
f([attrName, value] => el.attr(attrName, value)). Returns `el`.
```

Returns `el`.

### el.attrs

#### el.attrs()

Returns the set of attributes of the node wrapped within `el`.

#### el.attrs(hash)

for each `key: value` pair in `hash`, calls `el.attr(key, value)`. Returns `el`.

### el.prop

#### el.prop(propName: string)

Returns `node[propName]`, where node is within `el`.

#### el.prop(propName: string, falsey)

Unsets `node[propName]`, where node is within `el`. Returns `el`.

#### el.prop(propName: string, value)

Sets `node[propName] = value`, where node is within `el`. Returns `el`.

#### el.prop(propName: string, f: function)

Equivalent to

```javascript
f(value => el.prop(propName, value))
```

Returns `el`.

#### el.prop(f: function)

Equivalent to

```javascript
f([propName, value] => el.prop(propName, value))
```

Returns `el`.

### el.props

#### el.props()

Returns `node`, where node is within `el`.

#### el.props(hash)

for each `key: value` pair in `hash`, calls `el.prop(key, value)`. Returns `el`.

### el.classed

#### el.classed(className: string)

Equivalent to

```javascript
node.classList.contains(className)
```

where node is within `el`. Returns `el`.

#### el.classed(className: string, falsey)

Equivalent to

```javascript
node.classList.remove(className)
```

where node is within `el`. Returns `el`.

#### el.classed(className: string, truthy)

Equivalent to

```javascript
node.classList.add(className)
```

where node is within `el`. Returns `el`.

#### el.classed(className: string, f: function)

Equivalent to

```javascript
f(value => el.classed(className, value))
```

Returns `el`.

#### el.classed(f: function)

Equivalent to

```javascript
f([className, value] => el.classed(className, value))
```

Returns `el`.

### el.classes

#### el.classes()

Returns `[...node.classList]`, where node is within `el`.

#### el.classes(hash)

for each `key: value` pair in `hash`, calls `el.classed(key, value)`. Returns `el`.

### el.child

#### el.child(child: El)

Returns the index of child as a child of `el`.

#### el.child(child: El, false | -1)

Unmounts the child. Returns `el`.

#### el.child(falsey, index: number)

Unmounts the child of `el` whose index is given by `index`. Returns `el`.

#### el.child(child: El, index: number)

Moves the child as a child of `el` with the index given by `index`. If the child wasn't already a child of `el`, it is mounted. Returns `el`.

#### el.child(child: El, f: function)

Equivalent to

```javascript
f(index => el.child(child, index))
```

Returns `el`.

#### el.child(f: function)

Equivalent to

```javascript
f([child, index] => el.child(child, index))
```

Returns `el`.

### el.children

#### el.children(...children)

Sets `children` as children of `el`, unmounting those of its children who are not in `children`, and mounting those in `children` that need to be mounted. Returns `el`.

#### el.children(f: function)

Equivalent to

```javascript
f(children => el.children(...children))
```

Returns `el`.

### Text

#### Text(content: string)

Returns an `el` element whose wrapped node is a Text DOM node with `content` as its contentText.

### getRandomId

#### getRandomId()

Returns a random id computed through:

```javascript
Math.random().toString(16).slice(2)
```