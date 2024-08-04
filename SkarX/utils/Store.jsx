/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-mixed-spaces-and-tabs */
import Cookies from 'js-cookie';
import { createContext, useReducer } from 'react';

export const Store = createContext();
const initialState = {
	darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
	userInfo: Cookies.get('userInfo')
		? JSON.parse(Cookies.get('userInfo'))
		: null,
};

// function getProductInfo(item) {
// 	return {
// 		_id: item._id,
// 		name: item.name,
// 		quantity: item.quantity,
// 		price: item.price,
// 	};
// }

function reducer(state, action) {
	switch (action.type) {
		case 'DARK_MODE_ON':
			return { ...state, darkMode: true };
		case 'DARK_MODE_OFF':
			return { ...state, darkMode: false };

		case 'USER_LOGIN':
			return { ...state, userInfo: action.payload };
		case 'USER_LOGOUT':
			return {
				...state,
				userInfo: null,
			};

		default:
			return state;
	}
}

export function StoreProvider(props) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const value = { state, dispatch };
	// eslint-disable-next-line react/prop-types
	return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
