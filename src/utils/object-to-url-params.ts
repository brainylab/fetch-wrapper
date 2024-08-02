function cleanObject(
	obj: Record<string, string | number | string[] | number[] | undefined | null>,
): Record<string, string | number | string[] | number[]> {
	const cleanedObj: Record<string, string | number | string[] | number[]> = {};
	Object.keys(obj).forEach((key) => {
		const value = obj[key];
		if (value !== undefined && value !== null) {
			cleanedObj[key] = value;
		}
	});

	return cleanedObj;
}

export function objectToUrlParams(
	obj: Record<string, string | number | string[] | number[]>,
): string {
	const cleanedObj = cleanObject(obj);
	const params = new URLSearchParams();

	Object.keys(cleanedObj).map((key) => {
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
