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
  ID = 1;
  SEL = null;
  TMPL = null;
  SIZE = 0;

  constructor() {
    super();
    this.innerHTML = APP;
    this.TABLE = this.querySelector('table');
    this.TBODY = this.querySelector('tbody');
    this.ROWS = this.TBODY.children;
    const container = this.firstElementChild.firstElementChild.firstElementChild.lastElementChild.firstElementChild;

    container.append(new BenchButton('run', 'Create 1,000 rows', this.run.bind(this)));
    container.append(new BenchButton('runlots', 'Create 10,000 rows', this.runlots.bind(this)));
    container.append(new BenchButton('add', 'Append 1,000 rows', this.add.bind(this)));
    container.append(new BenchButton('update', 'Update every 10th row', this.update.bind(this)));
    container.append(new BenchButton('clear', 'Clear', this.clear.bind(this)));
    container.append(new BenchButton('swaprows', 'Swap Rows', this.swaprows.bind(this)));

    this.TBODY.addEventListener("row-select", (e) => {
      const msg = e.detail;
      if (this.SEL) {
        this.SEL.deselect();
      }
      this.SEL = msg.element;
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
    this.TBODY.textContent = '';
    this.SEL = null;
  }
  update() {
    for (let i = 0, r; r = this.ROWS[i]; i += 10) {
      labelOf(r).nodeValue += ' !!!';
    }
  }
  swaprows() {
    const [, r1, r2] = this.ROWS;
    const r998 = this.ROWS[998];
    if (r998) {
      insert(this.TBODY, r1, r998);
      insert(this.TBODY, r998, r2);
    }
  }
  create(count, add = false) {
    if (this.SIZE !== count) {
      const template = document.createElement('template');
      this.TMPL = clone(template.content);
      [...Array((this.SIZE = count) / 50)].forEach(() => {
        const benchRow = new BenchRow();
        this.TMPL.append(benchRow);
      });
    }
    if (!add) {
      this.clear();
      this.TBODY.remove();
    } 
    while (count > 0) {
      for (const r of this.TMPL.children) {
        r.rowId = this.ID++;
        r.rowLabel = label();
        count--;
      }
      insert(this.TBODY, clone(this.TMPL), null);
    }
    if (!add) {
      insert(this.TABLE, this.TBODY, null);
    }
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
TROW.innerHTML = '<td is="bench-cell" class="col-md-1">?</td><td is="bench-cell" class="col-md-4"><a>?</a></td><td is="bench-cell" class="col-md-1"><a><bench-icon class="glyphicon glyphicon-remove" aria-hidden="true"></bench-icon></a></td><td is="bench-cell" class="col-md-6"></td>';
const TROW_CONTENT = clone(TROW.content);

class BenchRow extends HTMLTableRowElement {
  constructor() {
    super();
    if (this.innerHTML === '') {
      this.append(clone(TROW_CONTENT));
    }
    this.idColumn = this.firstChild.firstChild;
    this.label = this.firstChild.nextSibling.firstChild;
    this.close = this.firstChild.nextSibling.nextSibling.firstChild;
    this.label.addEventListener("click", (e) => {
      e.stopPropagation();
      this.select();
      this.dispatchEvent(new CustomEvent('row-select', 
        { bubbles: true, detail: { element: this } 
      }));
    });
    this.close.addEventListener("click", (e) => {
      e.stopPropagation();
      this.remove();
    });
  }
  set rowId(value) {
    this.idColumn.textContent = value;
  }
  set rowLabel(value) {
    this.label.textContent = value;
  }
  select() {
    this.className = 'danger';
  }
  deselect() {
    this.className = '';
  }
}

class BenchCell extends HTMLTableCellElement {}

customElements.define('bench-button', BenchButton);
customElements.define('bench-row', BenchRow, {extends: 'tr'});
customElements.define('bench-cell', BenchCell, {extends: 'td'});
customElements.define('bench-app', BenchApp);
