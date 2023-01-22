import { rest } from "msw";

/**
 * @typedef {Object} User
 * @property {string} userId
 * @property {string} userPassword
 */

export default [
  rest.post('/users/login', async (req, res, ctx) => {
    /** @type {User} */
    const body = await req.json();

    if (body.userId === 'ssafy' && body.userPassword === 'ssafy') {
      return res(
        ctx.status(200),
        ctx.set({
          'access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIxMjM0NTY3ODkwIiwiaWQiOiJzc2FmeSIsInJvbGUiOiJhZG1pbiIsInN1YiI6InNzYWZ5IiwidXNlcm5hbWUiOiLquYDsi7jtlLwifQ.qp68eVWlmpcKquF0hzPcMI1E1Jhe57BKmsC3s_qYAtY',
          'refresh-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIxMjM0NTY3ODkwIiwiaWQiOiJzc2FmeSIsInJvbGUiOiJhZG1pbiIsInN1YiI6InNzYWZ5IiwidXNlcm5hbWUiOiLquYDsi7jtlLwifQ.qp68eVWlmpcKquF0hzPcMI1E1Jhe57BKmsC3s_qYAtY',
        }),
        ctx.json(),
      )
    }

    return res(
      ctx.status(200),
    );
  }),
];