import m from 'mithril';
import stream from 'mithril-stream';
import {P, S, PS, D} from 'patchinko/explicit.mjs';

const app = {
  initialState: {
    hue: 180,
    steps: 0,
    luminosityRange: 0.0, // 0.0 - 1.0
    saturationRange: 0.0, // 0.0 - 1.0
  },
  actions: update => {
    return {
      modifyHue: function(hue) {
        update({ hue: hue });
      },
      modifySaturation: function(saturation) {
        update({ saturationRange: saturation });
      },
      modifyLuminosity: function(luminosity) {
        update({ luminosityRange: luminosity });
      },
      modifySteps: function(steps) {
        update({ steps: steps });
      },
    };
  },
};

const Color = {
  view: function({ attrs: { color } }) {
    const hsl = `hsl(${ color.hue % 360 }, ${ color.saturation }%, ${ color.luminosity }%)`;
    // const color = `hsl(${ state.hue % 360 }, ${40 - Math.round(offset*0.4) }%, ${50 + offset }%)`;
    return m( '.flex.items-center',
      m('.px-4.py-6.w-48.text-center.flex-none.tabular-nums', {
        style: `background-color: ${hsl};`,
        },
        hsl
      ),
      m('.border.rounded.px-4.py-2.ml-6.ml-3.md:flex-grow-0.flex-grow.text-center', {
        style: `border-color: ${hsl}; color: ${hsl}`,
        },
        `${color.hue} ${color.saturation} ${color.luminosity}`
        // `offset: ${offset}`
      )
    )
  }
}

const ColorList = {
  view: function({ attrs: { state } }) {
    const baseColor = {
      hue: state.hue,
      saturation: 50,
      luminosity: 50,
    };
    let colors = [baseColor];
    for (var i = 1; i <= state.steps; i++) {
      colors.unshift({
        hue: state.hue,
        saturation: Math.round(baseColor.saturation - (i/state.steps) * (50*state.saturationRange)),
        luminosity: Math.round(baseColor.luminosity + (i/state.steps) * (50*state.luminosityRange)),
      });
      colors.push({
        hue: state.hue,
        saturation: Math.round(baseColor.saturation + (i/state.steps) * (50*state.saturationRange)),
        luminosity: Math.round(baseColor.luminosity - (i/state.steps) * (50*state.luminosityRange)),
      });
    }
    return m('',
      colors.map(color=>m(Color, { color: color }))
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
      m('',
        m('input.mb-4.ml-6.w-40[type=range][min=0][max=100]',
          {
            value: state.saturationRange * 100,
            oninput: (e)=> actions.modifySaturation(Number(e.target.value/100))
          }
        ),
        m('input.ml-6.w-32.border.px-3[type=number][pattern="[0-9]*"][step=0.01]', {
          value: state.saturationRange,
          oninput: (e) => actions.modifySaturation(Number(e.target.value))
        }),
      ),
      m('',
        m('input.mb-4.ml-6.w-40[type=range][min=0][max=100]',
          {
            value: state.luminosityRange * 100,
            oninput: (e)=> actions.modifyLuminosity(Number(e.target.value/100))
          }
        ),
        m('input.ml-6.w-32.border.px-3[type=number][pattern="[0-9]*"][step=0.01]', {
          value: state.luminosityRange,
          oninput: (e) => actions.modifyLuminosity(Number(e.target.value))
        }),
      ),
      m('',
        m('input.mb-4.ml-6.w-40[type=range][min=0][max=9]',
          {
            value: state.steps,
            oninput: (e)=> actions.modifySteps(Number(e.target.value))
          }
        ),
        m('input.ml-6.w-32.border.px-3[type=number][pattern="[0-9]*"][step=0.01]', {
          value: state.steps,
          oninput: (e) => actions.modifySteps(Number(e.target.value))
        }),
      ),
      m(ColorList, { state: state }),
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
