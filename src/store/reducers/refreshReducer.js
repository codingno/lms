/* eslint-disable import/no-anonymous-default-export */
export default (state = false, action) => {
	switch (action.type) {
		case "refresh_start":
			return true
		case "refresh_done":
			return false
		default:
			return state
	}
}