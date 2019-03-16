/* global liljs */
describe('liljs', () => {
  describe('helper functions', () => {
    describe('getPropsFromElem', () => {
      const simple = `
      <div id="app">
        <span lil-text="textValue"></span>
      </div>`;

      const complex = `
      <div id="app">
        <span lil-style="styleObj" lil-text="textValue"></span>
      </div>`;

      const todo = ` 
        <div class="app" id="app">
          <ul>
            <div lil-list="todoList"></div>
          </ul>

          <label>New Item:
            <input autocomplete="off" lil-bind="newItem" lil-bind-from="value">
          </label>
       </div>

        <template id="todoList">
          <li>
            <label lil-click="toggle" lil-list-text="item">
              <input style="display: none" type="checkbox">
            </label>
          </li>
        </template>`;

      const setUp = (literalHtml) => {
        document.body.innerHTML += literalHtml;
      };

      it('should initialize the property', () => {
        setUp(simple);
        const elem = document.querySelector('#app');
        const app = liljs(elem, {
          textValue: 'hello world',
        });
        expect(elem.querySelector('span[lil-text]').innerHTML).toEqual('hello world');
        expect(app.textValue.value).toEqual('hello world');
      });

      it('should be defined', () => {
        setUp(simple);
        const elem = document.querySelector('#app');
        const app = liljs(elem, {
          textValue: 'hello world',
        });
        expect(app.getProp).toBeDefined();
        expect(typeof app.getProp).toEqual('function');
      });

      it('should return the property values attached to an element', () => {
        setUp(simple);
        const elem = document.querySelector('#app');
        const app = liljs(elem, {
          textValue: 'hello world',
        });
        const returnedProp = app.getProp(elem.querySelector('span[lil-text]'));
        expect(returnedProp.textValue.constructor.name).toEqual('Property');
      });

      it('should be able to return multiple properties', () => {
        setUp(complex);
        const elem = document.querySelector('#app');
        const app = liljs(elem, {
          textValue: 'hello world',
          styleObj: {},
        });
        const returnedProp = app.getProp(elem.querySelector('span[lil-text]'));
        expect(returnedProp.textValue.constructor.name).toEqual('Property');
        expect(returnedProp.styleObj.constructor.name).toEqual('Property');
      });

      it('should be able to return the parent functions from a lil-list property', () => {
        setUp(todo);
        const elem = document.querySelector('#app');
        const app = liljs(elem, {
          todoList: [{
            item: 'Buy bread',
            complete: false,
          }, {
            item: 'Take a bath',
            complete: true,
          }],
        });

        const returnedProp = app.getProp(elem.querySelector('label[lil-index]'));
        expect(returnedProp.todoList.constructor.name).toEqual('Object');
        expect(returnedProp.todoList.array.constructor.name).toEqual('Property');
        expect(returnedProp.todoList.index).toEqual('0');
        expect(returnedProp.todoList.value).toEqual(app.todoList.value[0]);
      });

      afterEach(() => {
        document.body.innerHTML = '';
      });
    });
  });
});
