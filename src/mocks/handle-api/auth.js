// @ts-check
import { rest } from "msw";
import * as jose from 'jose';
import jwtDecode from "jwt-decode";

/**
 * @typedef {Parameters<import("msw").ResponseResolver>} ResolverParams
 * @typedef {import("msw").ResponseComposition} ResponseComposition
 */

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
 * @typedef {Object} UserPayload
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

/** @type {(user: User) => (...params: ResolverParams) => ReturnType<ResponseComposition>} */
const onUserExist = (user) => (req, res, ctx) => res(ctx.status(409));

/** @type {typeof onUserExist} */
const onUserNotExist = (user) => (req, res, ctx) => {
  userTable[user.userId] = { ...user, role: 'member' };
  return res(ctx.status(200));
};

/** @type {typeof onUserExist} */
const checkUserInTable = (user) => (user.userId in userTable) ? onUserExist(user) : onUserNotExist(user);

/** @type { (user: User) => (...params: ResolverParams) => Promise<ReturnType<ResponseComposition>> } */
const onUserValid = (user) => async (req, res, ctx) => {
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

/** @type {typeof onUserValid} */
const onUserInvalid = (user) => async (req, res, ctx) => res(ctx.status(200));

/** @type { typeof onUserValid } */
const verifyUser = (user) => {
  const {userId, userPassword} = user;
  if (userId in userTable && userTable[userId].userPassword === userPassword)
    return onUserValid(user);
  return onUserInvalid(user);
};

const nowSecond = () => Math.floor(Date.now() / 1000);

/**
 * 
 * @param {UserPayload} token 
 */
const isTokenExpired = ({exp}) => (exp < nowSecond());

/** @type {(...params: ResolverParams) => ReturnType<res>} */
const onTokenExpired = (req, res, ctx) => res(ctx.status(409));

/** @type {typeof onTokenExpired} */
const onTokenNotExpired = (req, res, ctx) => res(ctx.status(200));

/**
 * @param {UserPayload} token 
 */
const checkTokenExpired = (token) => {
  if (isTokenExpired(token)) return onTokenExpired;
  return onTokenNotExpired;
};

const whitelist = ['/users/logout'];

export default [
  rest.all('/*', async (req, res, ctx) => {
    const accessToken = req.headers.get('access-token');
    const refreshToken = req.headers.get('refresh-token');
    const { pathname } = req.url;

    if (!accessToken || whitelist.find(x => x === pathname)) return;

    const verifyResult = await jose.jwtVerify(accessToken, secretKey);
    const payload = /** @type {UserPayload} */ (verifyResult.payload);

    const result = checkTokenExpired(payload)(req, res, ctx);
  }),
  rest.post('users/join', async (req, res, ctx) => {
    /** @type {User} */
    const user = await req.json();

    const result = checkUserInTable(user)(req, res, ctx);

    return result;
  }),
  rest.post('/users/login', async (req, res, ctx) => {
    /** @type {User} */
    const user = await req.json();

    const result = await verifyUser(user)(req, res, ctx);

    return result;
  }),
  rest.put('/users/logout', async (req, res, ctx) => {
    const accessToken = req.headers.get('access-token');
    /** @type {UserPayload} */
    const user = jwtDecode(accessToken);
    return res(
      ctx.status(200),
      ctx.json({ message: 'success' })
    );
  }),
];