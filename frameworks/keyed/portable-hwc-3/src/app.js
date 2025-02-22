const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

let seed = 0;
// random function is replaced to remove any randomness from the benchmark.
const random = (max) => seed++ % max;
const pick = dict => dict[random(dict.length)];
const label = () => `${pick(adjectives)} ${pick(colours)} ${pick(nouns)}`;
const getButtonContainer = r => r.firstElementChild.firstElementChild.firstElementChild.lastElementChild.firstElementChild;

const insert = (parent, node, ref) => parent.insertBefore(node, ref);

const APP = `<div class="container">
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-6">
        <h1>Portable HTML Web Components (keyed) – V3</h1>
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

    const container = getButtonContainer(this);
    const runButton = document.createElement('bench-button');
    const runlotsButton = document.createElement('bench-button');
    const addButton = document.createElement('bench-button');
    const updateButton = document.createElement('bench-button');
    const clearButton = document.createElement('bench-button');
    const swaprowsButton = document.createElement('bench-button');
    runButton.render('run', 'Create 1,000 rows', this.run.bind(this));
    runlotsButton.render('runlots', 'Create 10,000 rows', this.runlots.bind(this));
    addButton.render('add', 'Append 1,000 rows', this.add.bind(this));
    updateButton.render('update', 'Update every 10th row', this.update.bind(this));
    clearButton.render('clear', 'Clear', this.clear.bind(this));
    swaprowsButton.render('swaprows', 'Swap Rows', this.swaprows.bind(this));
    container.append(runButton, runlotsButton, addButton, updateButton, clearButton, swaprowsButton);

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
      r.appendToLabel(' !!!');
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
      const row = document.createElement('tr', {is: 'bench-row'});
      row.render(id++, label());
      fragment.append(row);
    }
    insert(this._tbody, fragment, null);
    this._id = id;
  }
}

class BenchButton extends HTMLElement {
  constructor() {
    super();
    this.div = document.createElement('div');
    this.div.className = 'col-sm-6 smallpad';
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.className = 'btn btn-primary btn-block';
    this.div.append(this.button);
  }
  render(action, text, fn) {
    this.button.textContent = text;
    this.button.id = action;
    this.button.addEventListener('click', fn);
    insert(this, this.div, null);
  }
}

class BenchRow extends HTMLTableRowElement {
  constructor() {
    super();
    this.idCell = document.createElement('td', {is: 'bench-cell'});
    this.idCell.className = 'col-md-1';

    this.labelCell = document.createElement('td', {is: 'bench-cell'});
    this.labelCell.className = 'col-md-4';
    this.labelLink = document.createElement('a');
    this.labelLink.addEventListener("click", (e) => {
      e.stopPropagation();
      this.select();
      this.dispatchEvent(new CustomEvent('row-select', 
        { bubbles: true, detail: { element: this } 
      }));
    });
    this.labelCell.append(this.labelLink);

    this.closeCell = document.createElement('td', {is: 'bench-cell'});
    this.closeCell.className = 'col-md-1';
    const closeLink = document.createElement('a');
    const icon = document.createElement('span', {is: 'bench-icon'});
    icon.className = 'glyphicon glyphicon-remove';
    icon.setAttribute('aria-hidden', 'true');
    closeLink.append(icon);
    closeLink.addEventListener("click", (e) => {
      e.stopPropagation();
      this.remove();
    });
    this.closeCell.append(closeLink);
    
    this.emptyCell = document.createElement('td', {is: 'bench-cell'});
    this.emptyCell.className = 'col-md-6';
  }
  render(rowId, label) {
    this.idCell.textContent = rowId;
    this.labelLink.textContent = label;
    insert(this, this.idCell, null);
    insert(this, this.labelCell, null);
    insert(this, this.closeCell, null);
    insert(this, this.emptyCell, null);
  }
  select() {
    this.className = 'danger';
  }
  deselect() {
    this.className = '';
  }
  appendToLabel(text) {
    this.labelLink.textContent += text;
  }
}

class BenchCell extends HTMLTableCellElement {}

class BenchIcon extends HTMLSpanElement {}

customElements.define('bench-button', BenchButton);
customElements.define('bench-row', BenchRow, {extends: 'tr'});
customElements.define('bench-cell', BenchCell, {extends: 'td'});
customElements.define('bench-icon', BenchIcon, {extends: 'span'});
customElements.define('bench-app', BenchApp);