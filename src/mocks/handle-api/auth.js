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

/**
 * @type { <T>({onExist, onNotExist}: {onExist: (user: User) => T, onNotExist: (user: User) => T}) => (user: User) => T }
 */
const checkUserInTable = ({ onExist, onNotExist }) => (user) => {
  if (user.userId in userTable) return onExist(user);
  return onNotExist(user);
}

export default [
  rest.post('users/join', async (req, res, ctx) => {
    /** @type {User} */
    const user = await req.json();

    const result = checkUserInTable({
      onExist: () => {
        return res(ctx.status(409));
      },
      onNotExist: (user) => {
        userTable[user.userId] = { ...user, role: 'member' };
        return res(ctx.status(200));
      }
    })(user);

    return result;
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