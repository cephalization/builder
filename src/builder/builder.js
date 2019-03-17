import { specialTags } from "./validateTags";

/**
 * Element Signature
 *
 * {
 *  tag: @type String,
 *  attrs: @type Array: [@type Object: { name: @type String, value: @type String }],
 *  parent: @type CSSSelector String || @type Element,
 *  children: @type Array: [ @type { this } ],
 *  text: @type String (Will be rendered as HTML!),
 *  classes: @type String (will overwrite class attr!),
 *  condition: @type Func (conditionally render element based on function return value)
 * }
 */

const validTag = target => typeof target === "string" && specialTags[target];

const validAnchorPoint = target => target instanceof Element;

class Builder {
  constructor() {
    this.DEFAULT_PARENT = document.body;

    this.setRoot = this.setRoot.bind(this);
    this.createElements = this.createElements.bind(this);
    this.renderElement = this.renderElement.bind(this);
    this.registerData = this.registerData.bind(this);
    this.deleteData = this.deleteData.bind(this);

    this.literalDOM = this.DEFAULT_PARENT.innerHTML;
    this.parserInterval = null;
    this.registeredData = {};

    this.setupParser();
  }

  registerData(key, value) {
    this.registeredData[key] = value;
  }

  deleteData(key) {
    if (this.registeredData[key]) delete this.registeredData[key];
  }

  setupParser() {
    this.parseTemplating();
    this.parserInterval = setInterval(this.parseTemplating.bind(this), 500);
  }

  tearDownParser() {
    if (this.parserInterval) {
      clearInterval(this.parserInterval);
    }
  }

  parseTemplating() {
    let changed = false;
    const injected = this.literalDOM.replace(/{{(.*?)}}/g, match => {
      const key = match.replace(/[{}]+/g, "");
      const val = this.registeredData[key];

      if (val) {
        changed = true;
        return val;
      }

      return match;
    });

    if (changed) this.DEFAULT_PARENT.innerHTML = injected;
  }

  setRoot(root) {
    if (root instanceof Element) {
      this.DEFAULT_PARENT = root;
    } else {
      console.warn(
        `Provided root is not a valid Element! Falling back to "document.body".`
      );
    }
  }

  renderElement(spec, alternateTarget) {
    // Create dom elements per spec
    let target = this.DEFAULT_PARENT;
    const { attrs, parent, children, tag, text, classes, condition } = spec;

    // Conditionally renders element
    if (condition !== undefined) {
      const evaluation = typeof condition;

      switch (evaluation) {
        case "function":
          if (!condition()) {
            return null;
          }
          break;
        default:
          if (!condition) {
            return null;
          }
      }
    }

    // Assigns parent to that defined in spec
    if (validAnchorPoint(parent)) {
      target = parent;
    }

    // Assigns parent to that internally assigned (used for children)
    if (validAnchorPoint(alternateTarget)) {
      target = alternateTarget;
    }

    // The defined 'tag' is not valid, bail out
    if (!validTag(tag)) {
      throw new Error(
        `"${tag}" is not a valid HTML element. https://html.spec.whatwg.org/multipage/syntax.html#special`
      );
    }

    const element = document.createElement(tag);

    // Configure element, create children if any, attach, return
    if (element) {
      if (attrs) {
        // TODO: Setup error handling for attrs
        Object.keys(attrs).forEach(attr =>
          element.setAttribute(attrs[attr].name, attrs[attr].value)
        );
      }

      if (classes) {
        element.className = classes;
      }

      if (text) {
        element.textContent = text;
      }

      if (children && Array.isArray(children)) {
        children.forEach(child => this.renderElement(child, element));
      }

      target.appendChild(element);

      return element;
    }
  }

  createElements(...args) {
    this.tearDownParser();

    // Parse arguments
    // Unpack single array of element objects _or_ use 'rest'ed argument array
    let elementSpecs = args;
    if (Array.isArray(args[0])) {
      elementSpecs = [...elementSpecs[0]];
    }

    // Parse elements
    const elements = elementSpecs.map(this.renderElement);

    this.literalDOM = this.DEFAULT_PARENT.innerHTML;
    this.setupParser();
    return elements;
  }
}

const Singleton = new Builder();

export default {
  setRoot: Singleton.setRoot,
  createElements: Singleton.createElements,
  registerData: Singleton.registerData,
  deleteData: Singleton.deleteData
};
