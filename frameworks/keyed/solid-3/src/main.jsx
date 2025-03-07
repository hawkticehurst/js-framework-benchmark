import { createSignal, createSelector, batch } from 'solid-js';
import { render } from 'solid-js/web';

let idCounter = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
  colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
  nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

let seed = 0;
// random function is replaced to remove any randomness from the benchmark.
const random = (max) => seed++ % max;

function buildData(count) {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    const [label, setLabel] = createSignal(`${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]} ${nouns[random(nouns.length)]}`);
    data[i] = {
      id: idCounter++,
      label, setLabel
    }
  }
  return data;
}

const Button = ({ id, text, fn }) =>
  <div class='col-sm-6 smallpad'>
    <button id={ id } class='btn btn-primary btn-block' type='button' onClick={ fn }>{ text }</button>
  </div>

const Cell = ({ className, children }) => <td class={className}>{children}</td>;
const RemoveIcon = ({ preload }) => <span class={preload ? 'preloadicon glyphicon glyphicon-remove' : 'glyphicon glyphicon-remove'} aria-hidden="true"></span>;
const Row = ({ row, isSelected, select, remove }) => {
  const rowId = row.id;
  return <tr class={isSelected(rowId) ? "danger": ""}>
    <Cell className='col-md-1'>{rowId}</Cell>
    <Cell className='col-md-4'><a onClick={[select, rowId]} textContent={ row.label() } /></Cell>
    <Cell className='col-md-1'><a onClick={[remove, rowId]}><RemoveIcon preload={false} /></a></Cell>
    <Cell className='col-md-6'/>
  </tr>
}

const App = () => {
  const [data, setData] = createSignal([], false),
    [selected, setSelected] = createSignal(null),
    isSelected = createSelector(selected);

  return <div class='container'>
    <div class='jumbotron'><div class='row'>
      <div class='col-md-6'><h1>SolidJS 3 Keyed</h1></div>
      <div class='col-md-6'><div class='row'>
        <Button id='run' text='Create 1,000 rows' fn={ run } />
        <Button id='runlots' text='Create 10,000 rows' fn={ runLots } />
        <Button id='add' text='Append 1,000 rows' fn={ add } />
        <Button id='update' text='Update every 10th row' fn={ update } />
        <Button id='clear' text='Clear' fn={ clear } />
        <Button id='swaprows' text='Swap Rows' fn={ swapRows } />
      </div></div>
    </div></div>
    <table class='table table-hover table-striped test-data'><tbody>
      <For each={ data() }>{ row =>
        <Row row={row} isSelected={isSelected} select={setSelected} remove={remove} />
      }</For>
    </tbody></table>
    <RemoveIcon preload={true} />
  </div>;

  function remove(id) {
    const d = data().slice();
    d.splice(d.findIndex(d => d.id === id), 1);
    setData(d);
  }

  function run() {
    setData(buildData(1000));
    setSelected(null);
  }

  function runLots() {
    setData(buildData(10000));
    setSelected(null);
  }

  function add() { setData(data().concat(buildData(1000))); }

  function update() {
    batch(() => {
      const d = data();
      let index = 0;
      while (index < d.length) {
        d[index].setLabel(d[index].label() + ' !!!');
        index += 10;
      }
    });
  }

  function swapRows() {
    const d = data().slice();
    if (d.length > 998) {
      let tmp = d[1];
      d[1] = d[998];
      d[998] = tmp;
      setData(d);
    }
  }

  function clear() {
    setData([]);
    setSelected(null);
  }
}

render(App, document.getElementById("main"));