import { rest } from "msw";
import * as jose from 'jose';

/**
 * @typedef {Object} User
 * @property {string} userId
 * @property {string} userPassword
 * @property {string} [userName]
 * @property {string} [address]
 * @property {string} [phoneNumber]
 * @property {'admin' | 'member'} role
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
    role: 'admin',
  },
};

const secretKey = new TextEncoder().encode(')!+q90ije;;3vaeb1nu0e!5#z41');
const alg = 'HS256';

export default [
  rest.post('users/join', async (req, res, ctx) => {
    /** @type {User} */
    const body = await req.json();

    if (body.userId in userTable) return res( ctx.status(409) );

    userTable[body.userId] = { ...body, role: 'member' };

    return res(
      ctx.status(200),
    );
  }),
  rest.post('/users/login', async (req, res, ctx) => {
    /** @type {User} */
    const {userId, userPassword} = await req.json();

    if (!(userId in userTable) || userTable[userId].userPassword !== userPassword)
      return res(ctx.status(200));

    const user = userTable[userId];

    const payload = {
      exp: Date.now(),
      id: user.userId,
      role: user.role,
      sub: user.userId,
      username: user.userName ?? '',
    };

    const accessToken = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg, typ: "JWT" })
      .setExpirationTime('30m')
      .sign(secretKey);

    const refreshToken = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg, typ: "JWT" })
      .setExpirationTime('7d')
      .sign(secretKey);

    const tokens = {
      'access-token': accessToken,
      'refresh-token': refreshToken,
    };

    return res(
      ctx.status(200),
      ctx.set(tokens),
      ctx.json(),
    );
  }),
];