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

const TROW = document.createElement('template');
TROW.innerHTML = '<tr><td class="col-md-1">?</td><td class="col-md-4"><a>?</a></td><td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>';

const APP = `<div class="container">
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-6">
        <h1>Portable HTML Web Components (keyed)</h1>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="run">Create 1,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="runlots">Create 10,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="add">Append 1,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="update">Update every 10th row</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="clear">Clear</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="swaprows">Swap Rows</button>
          </div>
        </div>
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
    this._buttons = this.querySelectorAll('button');

    this._buttons.forEach(b => b.addEventListener("click", this[b.id].bind(this)));
    this._tbody.addEventListener("click", this.rowSelect.bind(this));
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
      labelOf(r).nodeValue += ' !!!';
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
    if (this._size !== count) {
      this._tmpl = clone(TROW.content);
      [...Array((this._size = count) / 50 - 1)].forEach(() => {
        this._tmpl.append(clone(this._tmpl.firstChild));
      });
    }
    if (!add) {
      this.clear();
      this._tbody.remove();
    }
    while (count) {
      for (const r of this._tmpl.children) {
        (r.$id ??= r.firstChild.firstChild).nodeValue = this._id++;
        (r.$label ??= labelOf(r)).nodeValue = label();
        count--;
      }
      insert(this._tbody, clone(this._tmpl), null);
    }
    if (!add) {
      this._table.append(this._tbody);
    }
  }
  rowSelect(e) {
    const t = e.target;
    const n = t.tagName;
    const r = t.closest('TR');
    e.stopPropagation();
    if (n == 'SPAN' || n == 'A' && t.firstElementChild) {
      r.remove();
    } else if (n == 'A' && (this._selected && (this._selected.className = ''), (this._selected = r))) {
      this._selected.className = 'danger';
    }
  }
}

customElements.define('bench-app', BenchApp);
