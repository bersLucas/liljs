/** Initialization function
 * @function liljs
 * @param {Element} elem Parent application element. All '[lil-*]' elements must be a child of this parent element.
 * @param {Object} data (optional) An object containing values to initalize the application with.
 * @return {Proxy} A proxy object with all properties. Values can be updated by modifying these values
 */
const liljs = (elem, data = {}) => {
  //Initial State Obj
  var state = {};

  /** Renders a single property and updates all element(s) that contain that property
   * @name render
   * @function
   * @param {String} Name of the property to render
   * @return {Object} The full property object
   */
  const render = property => {
    /** Set Text helper function
     * @function setText
     * @param {Element} elem Element to set the text on
     * @param {String} property Name of the property to render
     * @param {String} value (Optional) A value to use instead of a property (used in lil-list-text)
     */
    const setText = (elem, property, value) => {
      //Remove all child nodes that are TEXT
      Array.from(elem.childNodes).forEach(node => {
        if (node.nodeType === 3) {
          node.parentElement.removeChild(node);
        }
      });

      elem.appendChild(document.createTextNode(
        value || state[property].value
      ));
    }

    /** Set style helper function
     * @function setStyle
     * @param {Element} Element to set the styles on
     * @property {String} Name of the property to render
     */
    const setStyle = (elem, property) => {
      elem.setAttribute("style", null);
      Object.keys(state[property].value).forEach(key => {
        if (typeof state[property].value[key] === 'function') {
          try {
            elem.style[key] = state[property].value[key](getPropsFromElem(elem))
          } catch (e) {}
        } else {
          elem.style[key] = state[property].value[key];
        }
      });
    };

    /** Set list helper function
     * calls setText() and setStyle() to apply those properties to the template node
     * @function setList
     * @param {Element} Element to set the styles on
     * @property {String} Name of the property to render
     */
    const setList = (elem, property, name) => {
      //TODO: Find a way to update without clearing lists
      elem.textContent = "";
      state[property].value.forEach((value, index) => {
        let clone = document.importNode(state[property].template.content, true);
        clone.querySelectorAll("[lil-list-text]").forEach(node => {
          node.setAttribute('lil-index', index);
          node.setAttribute('lil-list-parent', name);
          setText(node, null, value[node.getAttribute("lil-list-text")]);
        });
        clone.querySelectorAll("[lil-style]").forEach(node => {
          setStyle(node, node.getAttribute("lil-style"));
        });
        clone.querySelectorAll("[lil-click]").forEach(node => {
          setClick(node, node.getAttribute("lil-click"));
        });
        elem.appendChild(clone);
      });
    };

    const setClick = (elem, property) => {
      elem.onclick =  (e) => {
        e.preventDefault();
        window[property](
          getPropsFromElem(e.target),
          elem
        )
      };
    }

    state[property].elem.forEach(elem => {
      switch (state[property].bindType) {
        case "text":
          setText(elem, property);
          break;
        case "style":
          setStyle(elem, property);
          break;
        case "list":
          setList(elem, property, state[property].name);
          break;
        case 'click':
          setClick(elem, property);
          break;
      }
    });

    return state[property];
  };

  const getPropsFromElem = (elem) => {
    let returnObj = {};

    //TODO: Normalize this so it always returns a Prop value and an index if needed
    Array.from(elem.attributes).filter(attr => {
      return ["text", "style", "list", "click"].some(bindTypes => {
        return 'lil-' + bindTypes == attr.name
      });
    }).map(attr => {
      returnObj[state[attr.value].name] = state[attr.value]
    })

    if (elem.getAttribute('lil-index')) {

      returnObj[elem.getAttribute('lil-list-parent')] =
        {
          array: state[elem.getAttribute('lil-list-parent')],
          index: elem.getAttribute('lil-index'),
          value: state[elem.getAttribute('lil-list-parent')].value[elem.getAttribute('lil-index')]
        }
    }

    return returnObj;
  };

  /** Adds a new property to the liljs instance
   * @function setList
   * @param {Element} Element to set the styles on
   * @property {String} Name of the property to render
   */
  const addProp = (name, type, elemList, value) => {
    return state[name] = new Property(
      name,
      type,
      elemList,
      value
    );
  };

  /** @function apply
   * @param {String} property  Name of the property to apply
   * @descrription Called after a value updates to update bound elements as well
   */
  const apply = (property) => {
    state[property].boundedElem.forEach(elem => {
      const boundAttr = elem.getAttribute(`lil-bind-from`);
      elem[boundAttr] = state[property].value;
    });
  };

  /** A single property to be added inside a '[lil-*]' attribute
   * These are generated from liljs()
   * @class Property
   * @param {String} Name of the property
   * @param {String} Type of binding (text, style, ect...)
   * @param {Element} Element to bind the property to.
   * @param {Any} (optional) Initial value
   */
  function Property(name, bindType, elem, value = null) {
    this.name = name;
    this.bindType = bindType;
    this.value = value;
    this.elem = [elem];
    this.render = () => {
      render(this.name);
    };
    this.boundedElem = [];
    if (this.bindType == "list") {
      this.template = document.querySelector(`#${this.name}`);
      setProps(this.template);
    }
  }

  const setProps = (elem) => {
    ["text", "style", "list", "click"].forEach(bindType => {
      let children = elem.nodeName === 'TEMPLATE' ? elem.content : elem
      children.querySelectorAll(`[lil-${bindType}]`).forEach(elem => {
        const attributeName = elem.getAttribute(`lil-${bindType}`);

        // If an element shares a property with another element...
        if (state[attributeName]) {
          // Add the element to the property's elem Array...
          state[attributeName].elem.push(elem);
          render(attributeName);

          // And do not create a new propery
          return;
        }

        state[attributeName] = new Property(
          attributeName,
          bindType,
          elem,
          data[attributeName]
        );

        // Render the property for the first time
        render(attributeName);
      });
    });
  }

  // Initialization
  setProps(elem)

  // Initialize bindings
  elem.querySelectorAll(`[lil-bind]`).forEach(elem => {
    const attributeName = elem.getAttribute(`lil-bind`);
    const boundAttr = elem.getAttribute(`lil-bind-from`);
    if (!state[attributeName]) {
      state[attributeName] = new Property(
        attributeName,
        'text',
        elem,
        ''
      );
    }
    elem.oninput = (event) => {
      if (event.target[boundAttr] != state[attributeName].value) {
        state[attributeName].value = event.target[boundAttr];
        state[attributeName].render();
      }
    };
    state[attributeName].boundedElem.push(elem);
  });

  state['addProp'] = addProp;
  state['elem'] = elem;

  return new Proxy(state, {
    set(target, property, value) {
      target[property].value = value;
      render(property);
      apply(property);
      return true;
    }
  });
};
