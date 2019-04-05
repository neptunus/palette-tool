import m from 'mithril';
import stream from 'mithril-stream';
import {P, S, PS, D} from 'patchinko/explicit.mjs';

const app = {
	initialState: {
		hue: 0,
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
		const color = `hsl(${ state.hue }, ${40 + Math.round(offset*0.8) }%, ${50 + offset }%)`;
		return m( 'div.flex.items-center',
			m('div.px-4.py-6.text-white.w-64.text-center', {
				style: `background-color: ${color}`,
				},
				color
			),
			m('div.border.rounded.px-4.py-2.ml-6', {
				style: `border-color: ${color}; color: ${color}`,
				},
				`offset: ${offset}`
			)
		)
	}
}

const App = {
	view: function({ attrs: { state, actions } }) {
		return m('.m-8',
			m('input.mb-4[type=range][max=360]',
				{
					value: state.hue,
					oninput: (e)=> actions.modifyHue(Number(e.target.value))
				}
			),
			m('label.ml-6', state.hue ),
			m(Color, { state: state, offset: -24 }),
			m(Color, { state: state, offset: -16 }),
			m(Color, { state: state, offset: -8 }),
			m(Color, { state: state }),
			m(Color, { state: state, offset: 12 }),
			m(Color, { state: state, offset: 24 }),
			m(Color, { state: state, offset: 36 }),
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
