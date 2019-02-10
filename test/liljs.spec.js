describe('liljs', () => {
  beforeEach(() => {
    element = `
      <div id="app">
        <span lil-text="textValue"></span>
      </div>
    `;
    document.body.innerHTML += element;
  });

  it('should be defined', () => {
    expect(liljs).toBeDefined();
  });

  describe('liljs.properties', () => {
    it('should return a Proxy with the properties inside', () => {
      var properties = {textValue: 'hello world'}
      var elem = document.querySelector('#app');
      let app = liljs(elem, properties);
      expect(app).toBeDefined()
    });

    it('should return a Proxy with the properties inside', () => {
      var properties = {textValue: 'hello world'}
      var elem = document.querySelector('#app');
      let app = liljs(elem, properties);
      expect(app.textValue.name).toEqual('textValue');
      expect(app.textValue.elem.length).toEqual(1);
      expect(app.textValue.elem[0].nodeType).toEqual(1);
      expect(app.textValue.bindType).toEqual('text');
      expect(typeof app.textValue.render).toEqual('function');
    });

    it('should allow the value of the property to be updated.', () => {
      var properties = {textValue: 'hello world'}
      var elem = document.querySelector('#app');
      let app = liljs(elem, properties);
      expect(app.textValue.value).toEqual('hello world');
      app.textValue = 'goodbye world';
      expect(app.textValue.value).toEqual('goodbye world');
    });
  });
});
