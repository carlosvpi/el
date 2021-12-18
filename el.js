const noop = () => {}
const id = x => x
const apply = f => f()
const getRandomId = () => Math.random().toString(16).slice(2)

class _El {
  constructor(node) {
    this.node = node
    this.DomEventHandlers = {
      mount: apply,
      unmount: apply,
      beforeMount: noop,
      beforeUnmount: noop,
      afterMount: noop,
      afterUnmount: noop
    }
    this._children = [...(node.children ?? [])].map(childNode => new _El(childNode, this))
  }
  tap(f) {
    f(this)
    return this
  }
  on(eventName, eventHandler, useCapture) {
    if (['mount', 'unmount', 'beforeMount', 'beforeUnmount', 'afterMount', 'afterUnmount'].includes(eventName)) {
      this.DomEventHandlers[eventName] = eventHandler
    } else {
      this.node.addEventListener(eventName, eventHandler, useCapture)
    }
    return this
  }
  attr(k, v) {
    if (typeof v === 'function') {
      v(w => this.attr(k, w), this)
      return this
    }
    if (typeof k === 'function') {
      k(([q, v]) => this.attr(q, v), this)
      return this
    }
    if (v === null || v === false) {
      this.node.removeAttribute(k)
      return this
    }
    if (v === undefined) {
      return this.node.getAttribute(k)
    }
    this.node.setAttribute(k, v)
    return this
  }
  attrs(hash) {
  	if (hash === undefined) {
  		return Object.fromEntries(this.node.getAttributeNames().map(name => [name, this.node.getAttribute(name)]))
  	}
    Object.keys(hash).forEach(key => {
      this.attr(key, hash[key])
    })
    return this
  }
  prop(k, v) {
    if (typeof v === 'function') {
      v(w => this.prop(k, w), this)
      return this
    }
    if (typeof k === 'function') {
      k(([q, v]) => this.prop(q, v), this)
      return this
    }
    if (v === null) {
      delete this.node[k]
      return this
    }
    if (v === undefined) {
      return this.node[k]
    }
    this.node[k] = v
    return this
  }
  props(hash) {
  	if (hash === undefined) {
  		return this.node
  	}
    Object.keys(hash).forEach(key => {
      this.prop(key, hash[key])
    })
    return this
  }
  classed(k, v) {
    if (typeof v === 'function') {
      v(w => this.classed(k, w), this)
      return this
    }
    if (typeof k === 'function') {
      k(([q, v]) => this.classed(q, v), this)
      return this
    }
    if (v === false) {
      this.node.classList.remove(k)
      return this
    }
    if (v === undefined) {
      return this.node.classList.has(k)
    }
    this.node.classList.add(k)
    return this
  }
  classes(hash) {
    if (hash === undefined) {
      return [...this.node.classList]
    }

    Object.keys(hash).forEach(key => {
      this.classed(key, hash[key])
    })
    return this
  }
  child(child, index) {
    if (typeof index === 'function') {
      index(i => this.child(child, i), this)
      return this
    }
    if (typeof child === 'function') {
      child(([child, i]) => this.child(child, i), this)
      return this
    }
    if (index === false || index < 0) {
    	const currentIndex = this._children.indexOf(child)
    	if (currentIndex >= 0) {
	    	const el = this._children[currentIndex]
	    	this._children[currentIndex] = undefined
	    	el?.unmount(this)
	    }
      return this
    }
    if (index === undefined) {
      return this._children.indexOf(child)
    }
    if (!child && index !== undefined) {
    	if (this._children[index] !== undefined) {
	    	const el = this._children[index]
	    	this._children[index] = undefined
	    	el?.unmount(this)
    	}
    	return this
    }
    if (this._children.indexOf(child) !== index) {
    	const oldIndex = this._children.indexOf(child)
      if (oldIndex >= 0) {
        this._children[oldIndex] = undefined
      }
	    const el = this._children[index]
	    this._children[index] = child
	    el?.unmount(this)
	    if (oldIndex === -1) {
		    child.mount(this)
		  }
	  }
    return this
  }
  children(...children) {
    if (typeof children[0] === 'function') {
      children[0](children => this.children(...children))
      return this
    }
    children.reverse().forEach((child, i) => {
    	if (!child) return
    	this.child(child, children.length - i - 1)
    })
    this._children
    	.filter(child => !children.includes(child))
			.forEach(child => {
				this.child(child, -1)
			})
    return this
  }
  unmount(parent) {
    if (this.node.parentNode !== parent.node) return this
    this.DomEventHandlers.unmount(() => new Promise((resolve, reject) => {
      try {
        if (parent._children.includes(this)) {
          resolve(false)
          return
        }
        this.DomEventHandlers.beforeUnmount(this)
        parent.node.removeChild(this.node)
        setTimeout(() => {
          this.DomEventHandlers.afterUnmount(this)
          resolve(true)
        }, 0)
      } catch (e) {
        reject(e)
      }
    }), this)
    return this
  }
  mount(parent) {
    this.DomEventHandlers.mount(() => new Promise((resolve, reject) => {
      try {
        if (!parent._children.includes(this)) {
          resolve(false)
          return
        }
        this.DomEventHandlers.beforeMount(this)
        const index = parent._children.indexOf(this)
        const nextChild = parent._children.slice(index + 1).find(child => child !== undefined)
        if (nextChild) {
          parent.node.insertBefore(this.node, nextChild.node)
        } else {
          parent.node.appendChild(this.node)
        }
        setTimeout(() => {
          this.DomEventHandlers.afterMount(this)
          resolve(true)
        }, 0)
      } catch (e) {
        reject(e)
      }
    }), this)
    return this
  }
}

Text = content => new _El(document.createTextNode(content))
El = (...args) => {
	return new _El(typeof args[0] === 'string' ? document.createElement(...args) : args[0])
}

if (typeof module !== 'undefined') {
  module.exports = El
  module.exports.Text = Text
  module.exports.getRandomId = getRandomId
}
