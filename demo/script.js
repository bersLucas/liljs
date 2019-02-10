document.querySelectorAll('template').forEach(elem => {
  let rawHTML = elem.innerHTML;
  let clone = document.importNode(elem.content, true);
  let demo = document.createElement('DEMO');
  demo.appendChild(clone);
  let preBlock = document.createElement('PRE');
  let codeBlock = document.createElement('CODE');
  codeBlock.textContent = rawHTML;
  preBlock.appendChild(codeBlock);
  demo.appendChild(preBlock);
  demo.setAttribute('for', elem.getAttribute('for'));
  document.body.appendChild(demo);
});
hljs.initHighlightingOnLoad();
