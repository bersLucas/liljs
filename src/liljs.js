/** Initialization function
 * @function liljs
 * @param {Element} elem Parent application element. All '[lil-*]' elements
 *                  must be a child of this parent element.
 * @param {Object} data (optional) An object containing values to initialize the application with.
 * @param {Object} methods (optional) An object containing all methods to be used by the app.
 * @return {Proxy} A proxy object with all properties. Values can be updated by modifying these
*                  values
 */
const liljs = (elem, data = {}, methods = {}) => {
  // Initial State Obj
  const state = {};
  state.methods = methods;

  // TODO: Write JS Docs for this function
  const getPropsFromElem = (propElem) => {
    const returnObj = {};

    // TODO: Normalize this so it always returns a Prop value and an index if needed
    Array.from(propElem.attributes).filter(attr => ['text', 'style', 'list', 'click']
      .some(bindTypes => `lil-${bindTypes}` === attr.name)).forEach((attr) => {
      returnObj[state[attr.value].name] = state[attr.value];
    });

    if (propElem.getAttribute('lil-index')) {
      returnObj[propElem.getAttribute('lil-list-parent')] = {
        array: state[propElem.getAttribute('lil-list-parent')],
        index: propElem.getAttribute('lil-index'),
        value: state[propElem.getAttribute('lil-list-parent')].value[propElem.getAttribute('lil-index')],
      };
    }

    return returnObj;
  };

  /** Renders a single property and updates all element(s) that contain that property
   * @name render
   * @function
   * @param {PropertyKey} property Name of the property to render
   * @return {Object} The full property object
   */
  const render = (property) => {
    /** Set Text helper function
     * @function setText
     * @param {Element} propElem Element to set the text on
     * @param {PropertyKey} propertyName Name of the property to render
     * @param {String} value (Optional) A value to use instead of a property (used in lil-list-text)
     */
    const setText = (propElem, propertyName, value) => {
      // Remove all child nodes that are TEXT
      Array.from(propElem.childNodes).forEach((node) => {
        if (node.nodeType === 3) {
          node.parentElement.removeChild(node);
        }
      });

      propElem.appendChild(document.createTextNode(
        value || state[propertyName].value,
      ));
    };

    /** Set style helper function
     * @function setStyle
     * @param {Element} propElem to set the styles on
     * @param {PropertyKey} propertyName of the property to render
     */
    const setStyle = (propElem, propertyName) => {
      propElem.setAttribute('style', null);
      Object.keys(state[propertyName].value).forEach((key) => {
        if (typeof state[propertyName].value[key] === 'function') {
          try {
            propElem.style[key] = state[propertyName].value[key](getPropsFromElem(propElem));
          } catch (e) {}
        } else {
          propElem.style[key] = state[propertyName].value[key];
        }
      });
    };

    /**
     * Set click helper function
     * @param {Element} propElem to add a click event to
     * @param {String} propertyName of the property to render
     */
    const setClick = (propElem, propertyName) => {
      propElem.onclick = (e) => {
        e.preventDefault();
        state.methods[propertyName](
          getPropsFromElem(e.target),
          elem,
        );
      };
    };

    /** Set list helper function
     * calls setText() and setStyle() to apply those properties to the template node
     * @function setList
     * @param {Element} propElem to set the styles on
     * @param {PropertyKey} propertyName
     * @property {String} name Name of the property to render
     */
    const setList = (propElem, propertyName, name) => {
      // TODO: Find a way to update without clearing lists
      propElem.textContent = '';
      state[propertyName].value.forEach((value, index) => {
        const clone = document.importNode(state[propertyName].template.content, true);
        clone.querySelectorAll('[lil-list-text]').forEach((node) => {
          node.setAttribute('lil-index', index);
          node.setAttribute('lil-list-parent', name);
          setText(node, null, value[node.getAttribute('lil-list-text')]);
        });
        clone.querySelectorAll('[lil-style]').forEach((node) => {
          setStyle(node, node.getAttribute('lil-style'));
        });
        clone.querySelectorAll('[lil-click]').forEach((node) => {
          setClick(node, node.getAttribute('lil-click'));
        });
        propElem.appendChild(clone);
      });
    };

    state[property].elem.forEach((propElem) => {
      switch (state[property].bindType) {
        case 'text':
          setText(propElem, property, null);
          break;
        case 'style':
          setStyle(propElem, property);
          break;
        case 'list':
          setList(propElem, property, state[property].name);
          break;
        case 'click':
          setClick(propElem, property);
          break;
        // no default
      }
    });

    return state[property];
  };

  /** A single property to be added inside a '[lil-*]' attribute
   * These are generated from liljs()
   * @class Property
   * @param {String} name of the property
   * @param {String} bindType of binding (text, style, ect...)
   * @param {Array} propElem to bind the property to.
   * @param {Any} value (Optional) Initial value
   */
  function Property(name, bindType, propElem, value = null) {
    this.name = name;
    this.bindType = bindType;
    this.value = value;
    this.elem = [propElem];
    this.render = () => {
      render(this.name);
    };
    this.boundedElem = [];
    if (this.bindType === 'list') {
      this.template = document.querySelector(`#${this.name}`);
      setProps(this.template);
    }
  }

  const setProps = (propElem) => {
    ['text', 'style', 'list', 'click'].forEach((bindType) => {
      const children = propElem.nodeName === 'TEMPLATE' ? propElem.content : propElem;
      children.querySelectorAll(`[lil-${bindType}]`).forEach((boundElem) => {
        const attributeName = boundElem.getAttribute(`lil-${bindType}`);

        // If an propElement shares a property with another propElement...
        if (state[attributeName]) {
          // Add the propElement to the property's propElem Array...
          state[attributeName].elem.push(boundElem);
          render(attributeName);

          // And do not create a new propery
          return;
        }

        state[attributeName] = new Property(
          attributeName,
          bindType,
          boundElem,
          data[attributeName],
        );

        // Render the property for the first time
        render(attributeName);
      });
    });
  };

  /** Adds a new property to the liljs instance
   * @function addProp
   * @param {String} name Name of a property to add
   * @param {String} type bindType (style, text, list, ect...)
   * @param {Array} elemList Array of element(s) to apply this property to
   * @param {*} value Name of the property to render
   */
  const addProp = (name, type, elemList, value) => {
    state[name] = new Property(
      name,
      type,
      elemList,
      value,
    );
  };

  /** @function apply
   * @param {PropertyKey} property  Name of the property to apply
   * @description Called after a value updates to update bound elements as well
   */
  const apply = (property) => {
    state[property].boundedElem.forEach((boundElem) => {
      const boundAttr = boundElem.getAttribute('lil-bind-from');
      boundElem[boundAttr] = state[property].value;
    });
  };

  // Initialize bindings
  const initBinding = Promise.all(
    Array.from(elem.querySelectorAll('[lil-bind]')).map((boundElem) => {
      const promise = new Promise((res) => {
        const attributeName = boundElem.getAttribute('lil-bind');
        const boundAttr = boundElem.getAttribute('lil-bind-from');
        if (!state[attributeName]) {
          state[attributeName] = new Property(
            attributeName,
            'text',
            boundElem,
            '',
          );
        }
        boundElem.oninput = (event) => {
          if (event.target[boundAttr] !== state[attributeName].value) {
            state[attributeName].value = event.target[boundAttr];
            state[attributeName].render();
          }
        };
        state[attributeName].boundedElem.push(boundElem);
        state[attributeName].elem.push(boundElem);
        res(state[attributeName]);
      });
      return promise;
    }),
  );

  state.addProp = addProp;
  state.elem = elem;
  state.getProp = getPropsFromElem;

  // Initialization
  return initBinding.then(() => setProps(elem)).then(() => new Proxy(state, {
    set(target, property, value) {
      target[property].value = value;
      render(property);
      apply(property);
      return true;
    },
  }));
};

export { liljs };
