import { createInstance } from './lib/create-instance';
import { fwprErrorHandling } from './lib/error-handling';

import type { FetchWrapperProps } from './lib/create-instance';
import type { ErrorHandlingResponse } from './lib/error-handling';
import type { FetchWrapper } from './lib/fetch-wrapper';

const fwpr = createInstance() as FetchWrapper & {
	create: (defaultConfig?: FetchWrapperProps) => FetchWrapper;
	errorHandling: (error: unknown) => ErrorHandlingResponse;
};

fwpr.create = createInstance;
fwpr.errorHandling = fwprErrorHandling;

export default fwpr;
