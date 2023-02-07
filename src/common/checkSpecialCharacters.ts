export default function checkSpecialCharacters(s: string) {
	const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

	if (s.match(format)) {
		return true;
	} else {
		return false;
	}
}
