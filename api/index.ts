import { createApiApp } from '../src/server/apiApp';

const app = createApiApp();

export const config = {
  maxDuration: 60,
};

export default app;
