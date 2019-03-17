/* global liljs */
describe('liljs', () => {
  beforeEach(() => {
    const element = `
      <div id="app">
        <span lil-text="textValue"></span>
      </div>
    `;
    document.body.innerHTML += element;
  });

  describe('initialization', () => {
    describe('properties', () => {
      it('should be defined', () => {
        const properties = { textValue: 'hello world' };
        const elem = document.querySelector('#app');
        liljs(elem, properties).then((app) => {
          expect(app).toBeDefined();
        });
      });

      it('should return a Proxy with the properties inside', () => {
        const properties = { textValue: 'hello world' };
        const elem = document.querySelector('#app');
        liljs(elem, properties).then((app) => {
          expect(app.textValue.name).toEqual('textValue');
          expect(app.textValue.elem.length).toEqual(1);
          expect(app.textValue.elem[0].nodeType).toEqual(1);
          expect(app.textValue.bindType).toEqual('text');
          expect(typeof app.textValue.render).toEqual('function');
        });
      });

      it('should allow the value of the property to be updated.', () => {
        const properties = { textValue: 'hello world' };
        const elem = document.querySelector('#app');
        liljs(elem, properties).then((app) => {
          expect(app.textValue.value).toEqual('hello world');
          app.textValue = 'goodbye world';
          expect(app.textValue.value).toEqual('goodbye world');
        });
      });

      afterEach(() => {
        document.body.innerHTML = '';
      });
    });
  });
});
