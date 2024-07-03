export function objectToUrlParams(
	obj: Record<string, string | number | string[] | number[]>,
): string {
	const params = new URLSearchParams();

	Object.keys(obj).map((key) => {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			if (Array.isArray(obj[key])) {
				const arr = obj[key] as string[] | number[];

				arr.map((value) => {
					params.append(`${key}`, String(value));
				});
			} else {
				params.append(key, String(obj[key]));
			}
		}
	});

	return decodeURI(params.toString());
}
