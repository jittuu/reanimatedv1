// code from https://github.com/wcandillon/react-native-redash/issues/172

import React, { Reducer, useReducer } from 'react';
import Animated, { call, cond, useCode } from 'react-native-reanimated';

type AddListenerAction<T> = {
	type: 'add-listener';
	resolveFn: (num: T) => void;
};

type RemoveListenerAction<T> = {
	type: 'resolve';
	value: T;
};

type State<T> = {
	inProgress: number;
	resolveFns: ((num: T) => void)[];
};

export default <T,>(
	value: Animated.Node<T>
): (() => Promise<T>) => {
	const [s, dispatch] = useReducer<
		Reducer<State<T>, AddListenerAction<T> | RemoveListenerAction<T>>
	>(
		(state, action) => {
			switch (action.type) {
				case 'add-listener':
					return {
						inProgress: 1,
						resolveFns: [...state.resolveFns, action.resolveFn]
					};
				case 'resolve':
					return {
						inProgress: 0,
						resolveFns: []
					};
				default:
					return state;
			}
		},
		{
			inProgress: 0,
			resolveFns: []
		}
	);
	const callback = React.useCallback(
		v => {
			dispatch({
				type: 'resolve',
				value: v[0]
			});
			for (const fn of s.resolveFns) {
				fn(v[0]);
			}
		},
		[s.resolveFns]
	);
	useCode(() => cond(s.inProgress, call([value], callback)), [
		s.inProgress,
		value
	]);

	return () =>
		new Promise<T>(resolve => {
			dispatch({
				type: 'add-listener',
				resolveFn: resolve
			});
		});
};
