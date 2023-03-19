// @ts-check
import newsHandler from './api/news';
import authHandler from './api/auth';
import boardHandler from './api/board';

export default [
  ...newsHandler,
  ...authHandler,
  ...boardHandler,
];