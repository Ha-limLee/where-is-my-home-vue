// @ts-check
import { rest, RestRequest } from "msw";
import * as jose from 'jose';
import jwtDecode from "jwt-decode";
import { worker } from "../browser";
import { getHandlers } from "../handlers";
import router from "@/router";

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

const ACCESS_TOKEN_DURATION = '5s';
const REFRESH_TOKEN_DURATION = '20s';

const secretKey = new TextEncoder().encode(')!+q90ije;;3vaeb1nu0e!5#z41');
const alg = 'HS256';

/** @type {(user: User) => (userTable: UserTable) => (...params: ResolverParams) => [ReturnType<ResponseComposition>, UserTable]} */
const onUserExist = (user) => (userTable) => (req, res, ctx) => [res(ctx.status(409)), userTable];

/** @type {typeof onUserExist} */
const onUserNotExist = (user) => (userTable) => (req, res, ctx) => {
  /** @type {'member'} */
  const defaultRole = 'member';
  const nextTable = {
    ...userTable,
    [user.userId]: {...user, role: defaultRole},
  };
  return [res(ctx.status(200)), nextTable];
};

/** @type {typeof onUserExist} */
const checkUserInTable = (user) => (userTable) => (user.userId in userTable) ? onUserExist(user)(userTable) : onUserNotExist(user)(userTable);

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
    .setExpirationTime(ACCESS_TOKEN_DURATION)
    .sign(secretKey);

  const refreshToken = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg, typ: "JWT" })
    .setExpirationTime(REFRESH_TOKEN_DURATION)
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

/** @type { (user: User) => (userTable: UserTable) => ReturnType<onUserValid> } */
const verifyUser = (user) => (userTable) => {
  const {userId, userPassword} = user;
  if (userId in userTable && userTable[userId].userPassword === userPassword)
    return onUserValid(userTable[userId]);
  return onUserInvalid(user);
};

const nowSecond = () => Math.floor(Date.now() / 1000);

/**
 * @param {UserPayload} token 
 */

const whitelist = ['/users/logout', '/users/login'];

/** @type {(userTable: UserTable) => import("msw").ResponseResolver} */
const joinResolver = (userTable) => async (req, res, ctx) => {
  /** @type {User} */
  const user = await req.json();

  const [result, nextTable] = checkUserInTable(user)(userTable)(req, res, ctx);

  worker.resetHandlers(...getHandlers(nextTable));

  return result;
};

/** @type {(userTable: UserTable) => import("msw").ResponseResolver} */
const loginResolver = (userTable) => async (req, res, ctx) => {
  /** @type {User} */
  const user = await req.json();

  const result = await verifyUser(user)(userTable)(req, res, ctx);

  return result;
};

/** @type {() => import("msw").ResponseResolver} */
const filterResolver = () => async (req, res, ctx) => {
  const accessToken = req.headers.get('access-token');
  const refreshToken = req.headers.get('refresh-token');
  const { pathname } = req.url;

  if (!accessToken || whitelist.find(x => x === pathname)) return;

  try {
    await jose.jwtVerify(accessToken, secretKey);
  } catch (accessErr) { // invalid access token
    try { // re-issue access token
      await jose.jwtVerify(refreshToken, secretKey);
      const payload = /** @type {UserPayload} */ jose.decodeJwt(accessToken);
      const newAccessToken = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg, typ: "JWT" })
        .setExpirationTime(ACCESS_TOKEN_DURATION)
        .sign(secretKey);
      sessionStorage.setItem("access-token", newAccessToken);
      console.log('access token 재발급 완료');
    } catch (refreshErr) { // invalid refresh token
      alert('다시 로그인 해주세요');
      router.push('/login');
    }
  }
};

/** @type {() => import("msw").ResponseResolver<RestRequest<never, import("msw").PathParams<string>>, import("msw").RestContext, import("msw").DefaultBodyType>} */
const logoutResolver = () => async (req, res, ctx) => {
  const accessToken = req.headers.get('access-token');
  /** @type {UserPayload} */
  const user = jwtDecode(accessToken);
  return res(
    ctx.status(200),
    ctx.json({ message: 'success' })
  );
};

/** @type {{method: string; path: string; resolver: typeof joinResolver}[]} */
const bindings = [
  {
    method: 'all',
    path: '/*',
    resolver: filterResolver,
  },
  {
    method: 'post',
    path: '/users/join',
    resolver: joinResolver,
  },
  {
    method: 'post',
    path: '/users/login',
    resolver: loginResolver,
  },
  {
    method: 'put',
    path: '/users/logout',
    resolver: logoutResolver,
  },
];

const getAuthHandlers = (/** @type {UserTable} */ userTable) =>
  bindings.map(({ method, path, resolver }) => rest[method](path, resolver(userTable)));

export default getAuthHandlers;