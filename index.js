import m from 'mithril';
import stream from 'mithril-stream';
import {P, S, PS, D} from 'patchinko/explicit.mjs';

const app = {
  initialState: {
    hue: 180,
  },
  actions: update => {
    return {
      modifyHue: function(hue) {
        update({ hue: hue });
      }
    };
  },
};

const Color = {
  view: function({ attrs: { state, offset = 0 } }) {
    const color = `hsl(${ state.hue % 360 }, ${40 - Math.round(offset*0.4) }%, ${50 + offset }%)`;
    return m( '.flex.items-center',
      m('.px-4.py-6.w-48.text-center.flex-none.tabular-nums', {
        style: `background-color: ${color}; color: ${offset > 0 ? 'black' : 'white'}`,
        },
        color
      ),
      m('.border.rounded.px-4.py-2.ml-6.ml-3.md:flex-grow-0.flex-grow.text-center', {
        style: `border-color: ${color}; color: ${color}`,
        },
        `offset: ${offset}`
      )
    )
  }
}

const App = {
  view: function({ attrs: { state, actions } }) {
    return m('.m-3',
      m('',
        m('input.mb-4.ml-6.w-40[type=range][max=359]',
          {
            value: state.hue % 360,
            oninput: (e)=> actions.modifyHue(Number(e.target.value))
          }
        ),
        m('input.ml-6.w-32.border.px-3[type=number][pattern="[0-9]*"]', {
          value: state.hue,
          oninput: (e) => actions.modifyHue(Number(e.target.value))
        }),
      ),
      m(Color, { state: state, offset: -36 }),
      m(Color, { state: state, offset: -30 }),
      m(Color, { state: state, offset: -20 }),
      m(Color, { state: state, offset: -10 }),
      m(Color, { state: state }),
      m(Color, { state: state, offset: 10 }),
      m(Color, { state: state, offset: 20 }),
      m(Color, { state: state, offset: 30 }),
      m(Color, { state: state, offset: 40 }),
      // m('pre', JSON.stringify(state, null, 2) )
    )
  }
}

const update = stream();
const states = stream.scan(P, app.initialState, update);

const actions = app.actions(update);

m.mount(document.body, {
  view: function() {
    return m(App, { state: states(), actions })
  }
});
