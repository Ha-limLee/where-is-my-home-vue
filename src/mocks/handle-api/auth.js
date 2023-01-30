// @ts-check
import { rest } from "msw";
import * as jose from 'jose';
import jwtDecode from "jwt-decode";

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

/**
 * @typedef {Object} UserToken
 * @property {number} exp
 * @property {string} id
 * @property {'admin' | 'member'} role
 * @property {string} sub
 * @property {string} username
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

/** @type { <T> ({onExist, onNotExist}: {onExist: () => T, onNotExist: (user: User) => T}) => (user: User) => T } */
const checkUserInTable = ({ onExist, onNotExist }) => (user) => {
  if (user.userId in userTable) return onExist();
  return onNotExist(user);
};

/** @type { <T> ({onValid, onInvalid}: {onValid: (user: User) => Promise<T> | T, onInvalid: () => Promise<T> | T}) => ({userId, userPassword}: {userId: string, userPassword: string}) => Promise<T> } */
const verifyUser = ({ onValid, onInvalid }) => async ({ userId, userPassword }) => {
  if (userId in userTable && userTable[userId].userPassword === userPassword)
    return await onValid(userTable[userId]);
  return await onInvalid();
};

const nowSecond = () => Math.floor(Date.now() / 1000);

/**
 * @typedef {Parameters<import("msw").ResponseResolver>} ResolverParams
 */

/** @type { (...params: ResolverParams) => (user: User) => Promise<ReturnType<res>> } */
const handleValid = (req, res, ctx) => async (/** @type {User} */ user) => {
  const payload = {
    exp: nowSecond(),
    id: user.userId,
    role: user.role,
    sub: user.userId,
    username: user.userName ?? '',
  };

  const accessToken = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg, typ: "JWT" })
    .setExpirationTime('10s')
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
  );
};

/** @type {(...params: ResolverParams) => () => ReturnType<res>} */
const handleInvalid = (req, res, ctx) => () => res(ctx.status(200));

export default [
  rest.all('/*', async (req, res, ctx) => {
    const accessToken = req.headers.get('access-token');
    const refreshToken = req.headers.get('refresh-token');
    if (accessToken) {
      const ret = await jose.jwtVerify(accessToken, secretKey);
      console.log(ret);
      const decoded = jose.decodeJwt(accessToken);
      const exp = decoded.exp;
      console.log("여기 인터셉터");
      console.log(exp);
    }
  }),
  rest.post('users/join', async (req, res, ctx) => {
    /** @type {User} */
    const user = await req.json();

    const onExist = () => res(ctx.status(409));

    const onNotExist = (/** @type {User} */user) => {
      userTable[user.userId] = { ...user, role: 'member' };
      return res(ctx.status(200));
    };

    const result = checkUserInTable({ onExist, onNotExist })(user);

    return result;
  }),
  rest.post('/users/login', async (req, res, ctx) => {
    /** @type {User} */
    const { userId, userPassword } = await req.json();

    const result = await verifyUser({
      onValid: handleValid(req, res, ctx),
      onInvalid: handleInvalid(req, res, ctx)
    })({ userId, userPassword });

    return result;
  }),
  rest.put('/users/logout', async (req, res, ctx) => {
    const accessToken = req.headers.get('access-token');
    /** @type {UserToken} */
    const user = jwtDecode(accessToken);
    return res(
      ctx.status(200),
      ctx.json({ message: 'success' })
    );
  }),
];