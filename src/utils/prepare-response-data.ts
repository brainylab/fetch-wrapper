export async function prepareResponseData<T = unknown>(response: Response) {
	if (response.headers.get('content-type')?.includes('application/json')) {
		const data = await response.json();
		return data as T;
	}

	const data = await response.text();
	return data as T;
}
