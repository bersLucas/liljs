/* global liljs */
describe('liljs', () => {
  beforeEach(() => {
    let element = `
      <div id="app">
        <span lil-text="textValue"></span>
      </div>
    `;
    document.body.innerHTML += element;
  });

  it('should be defined', () => {
    expect(liljs).toBeDefined();
  });
});
