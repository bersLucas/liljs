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
    const setText = (elem, property, value) => elem.textContent = value || state[property].value;

    /** Set style helper function
     * @function setStyle
     * @param {Element} Element to set the styles on
     * @property {String} Name of the property to render
     */
    const setStyle = (elem, property) => {
      elem.setAttribute("style", null);
      Object.keys(state[property].value).forEach(key => {
        elem.style[key] = state[property].value[key];
      });
    };

    /** Set list helper function
     * calls setText() and setStyle() to apply those properties to the template node\
     * @function setList
     * @param {Element} Element to set the styles on
     * @property {String} Name of the property to render
     */
    const setList = (elem, property) => {
      //TODO: Find a way to update without clearing lists
      elem.textContent = "";
      state[property].value.forEach(value => {
        let clone = document.importNode(state[property].template.content, true);
        clone.querySelectorAll("[lil-list-text]").forEach(node => {
          setText(node, null, value[node.getAttribute("lil-list-text")]);
        });
        clone.querySelectorAll("[lil-style]").forEach(node => {
          setStyle(node, node.getAttribute("lil-style"));
        });
        elem.appendChild(clone);
      });
    };

    state[property].elem.forEach(elem => {
      switch (state[property].bindType) {
        case "text":
          setText(elem, property);
          break;
        case "style":
          setStyle(elem, property);
          break;
        case "list":
          setList(elem, property);
          break;
      }
    });

    return state[property];
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
    if (this.bindType == "list") {
      this.template = document.querySelector(`#${this.name}`);
    }
  }

  // Initialization
  ["text", "style", "list"].forEach(bindType => {
    elem.querySelectorAll(`[lil-${bindType}]`).forEach(elem => {
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

  return new Proxy(state, {
    set(target, property, value) {
      target[property].value = value;
      render(property);
      return true;
    }
  });
};
