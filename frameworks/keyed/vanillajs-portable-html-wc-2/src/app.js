/* eslint-disable */

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

const pick = dict => dict[Math.round(Math.random() * 1000) % dict.length];
const label = () => `${pick(adjectives)} ${pick(colours)} ${pick(nouns)}`;
const labelOf = r => r.firstChild.nextSibling.firstChild.firstChild;

const {cloneNode} = Node.prototype;
const clone = n => cloneNode.call(n, true);
const insert = (parent, node, ref) => parent.insertBefore(node, ref);

const APP = `<div class="container">
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-6">
        <h1>Portable HTML Web Components (keyed) – V2</h1>
      </div>
      <div class="col-md-6">
        <div class="row"></div>
      </div>
    </div>
  </div>
  <table class="table table-hover table-striped test-data">
    <tbody id="tbody"></tbody>
  </table>
  <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
</div>`;

class BenchApp extends HTMLElement {
  _id = 1;
  _selected = null;
  _tmpl = null;
  _size = 0;

  constructor() {
    super();
    this.innerHTML = APP;
    this._table = this.querySelector('table');
    this._tbody = this.querySelector('tbody');
    this._rows = this._tbody.children;
    const container = this.firstElementChild.firstElementChild.firstElementChild.lastElementChild.firstElementChild;

    container.append(new BenchButton('run', 'Create 1,000 rows', this.run.bind(this)));
    container.append(new BenchButton('runlots', 'Create 10,000 rows', this.runlots.bind(this)));
    container.append(new BenchButton('add', 'Append 1,000 rows', this.add.bind(this)));
    container.append(new BenchButton('update', 'Update every 10th row', this.update.bind(this)));
    container.append(new BenchButton('clear', 'Clear', this.clear.bind(this)));
    container.append(new BenchButton('swaprows', 'Swap Rows', this.swaprows.bind(this)));

    this._tbody.addEventListener("row-select", (e) => {
      const msg = e.detail;
      if (this._selected) {
        this._selected.deselect();
      }
      this._selected = msg.element;
    });
  }
  run() {
    this.create(1000);
  }
  runlots() {
    this.create(10000);
  }
  add() {
    this.create(1000, true);
  }
  clear() {
    this._tbody.textContent = '';
    this._selected = null;
  }
  update() {
    for (let i = 0, r; r = this._rows[i]; i += 10) {
      labelOf(r).textContent += ' !!!';
    }
  }
  swaprows() {
    const [, r1, r2] = this._rows;
    const r998 = this._rows[998];
    if (r998) {
      insert(this._tbody, r1, r998);
      insert(this._tbody, r998, r2);
    }
  }
  create(count, add = false) {
    if (!add) {
      this.clear();
    }
    let id = this._id;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const row = new BenchRow(id++, label());
      fragment.appendChild(row);
    }
    insert(this._tbody, fragment, null);
    this._id = id;
  }
}

const BUTTON = document.createElement('template');
BUTTON.innerHTML = '<div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block"></button></div>';

class BenchButton extends HTMLElement {
  constructor(action, text, fn) {
    super();
    const html = clone(BUTTON.content);
    this.appendChild(html.firstChild);
    this.firstChild.firstChild.id = action;
    this.firstChild.firstChild.textContent = text;
    this.addEventListener('click', fn);
  }
}

const TROW = document.createElement('template');
TROW.innerHTML = '<td class="col-md-1">?</td><td class="col-md-4"><a>?</a></td><td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td>';

class BenchRow extends HTMLTableRowElement {
  constructor(rowId, rowLabel) {
    super();
    this.append(clone(TROW.content));

    const idColumn = this.firstChild.firstChild;
    idColumn.textContent = rowId;

    const label = this.firstChild.nextSibling.firstChild;
    label.textContent = rowLabel;

    const close = this.firstChild.nextSibling.nextSibling.firstChild;
    
    label.addEventListener("click", (e) => {
      e.stopPropagation();
      this.select();
      this.dispatchEvent(new CustomEvent('row-select', 
        { bubbles: true, detail: { element: this } 
      }));
    });
    close.addEventListener("click", (e) => {
      e.stopPropagation();
      this.remove();
    });
  }
  select() {
    this.className = 'danger';
  }
  deselect() {
    this.className = '';
  }
}

customElements.define('bench-button', BenchButton);
customElements.define('bench-row', BenchRow, {extends: 'tr'});
customElements.define('bench-app', BenchApp);
