export function objectToUrlParams(
	obj: Record<string, string | number | string[] | number[]>,
): string {
	const params = new URLSearchParams();

	Object.keys(obj).map((key) => {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			if (Array.isArray(obj[key])) {
				const arr = obj[key] as string[] | number[];

				arr.map((value, index) => {
					params.append(`${key}[${index}]`, String(value));
				});
			} else {
				params.append(key, String(obj[key]));
			}
		}
	});

	console.log(decodeURI(params.toString()));

	return decodeURI(params.toString());
}
