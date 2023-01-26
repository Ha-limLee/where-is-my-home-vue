import { rest } from "msw";

/**
 * @typedef {Object} User
 * @property {string} userId
 * @property {string} userPassword
 * @property {string} [userName]
 * @property {string} [address]
 * @property {string} [phoneNumber]
 */

/**
 * @typedef {Object<string, User>} UserTable
 */

/** @type {UserTable} */
const userTable = {
  'ssafy': {
    userId: 'ssafy',
    userPassword: 'ssafy',
    address: '서울특별시 서초구',
    phoneNumber: '010-1234-5678',
    userName: '김싸피',
  },
};

export default [
  rest.post('users/join', async (req, res, ctx) => {
    /** @type {User} */
    const body = await req.json();
    console.log('여기 join');
    console.log(body);

    if (body.userId in userTable) {
      return res(
        ctx.status(409),
      );
    }

    userTable[body.userId] = body;
    return res(
      ctx.status(200),
    );
  }),
  rest.post('/users/login', async (req, res, ctx) => {
    /** @type {User} */
    const {userId, userPassword} = await req.json();

    if (userId in userTable && userTable[userId].userPassword === userPassword) {
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