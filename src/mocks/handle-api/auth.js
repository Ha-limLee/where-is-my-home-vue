// @ts-check
import { rest, RestRequest } from "msw";
import * as jose from 'jose';
import jwtDecode from "jwt-decode";
import router from "@/router";
import { userStore } from "../stores/userStore";

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

/** @type {(user: User) => (...params: ResolverParams) => ReturnType<ResponseComposition>} */
const onUserExist = (user) => (req, res, ctx) => res(ctx.status(409));

/** @type {typeof onUserExist} */
const onUserNotExist = (user) => (req, res, ctx) => {
  /** @type {'member'} */
  const defaultRole = 'member';
  userStore.dispatch({
    type: "SET",
    payload: {...user, role: defaultRole},
  });
  return res(ctx.status(200));
};

/** @type {typeof onUserExist} */
const checkUserInTable = (user) => (user.userId in userStore.getState()) ? onUserExist(user) : onUserNotExist(user);

const nowSecond = () => Math.floor(Date.now() / 1000);

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

/** @type { (user: User) => ReturnType<onUserValid> } */
const verifyUser = (user) => {
  const {userId, userPassword} = user;
  const userTable = userStore.getState();
  if (userId in userTable && userTable[userId].userPassword === userPassword)
    return onUserValid(userTable[userId]);
  return onUserInvalid(user);
};

/**
 * @param {UserPayload} token 
 */

const whitelist = ['/users/logout', '/users/login'];

/** @type {import("msw").ResponseResolver} */
const joinResolver = async (req, res, ctx) => {
  /** @type {User} */
  const user = await req.json();

  const result = checkUserInTable(user)(req, res, ctx);

  return result;
};

/** @type {import("msw").ResponseResolver} */
const loginResolver = async (req, res, ctx) => {
  /** @type {User} */
  const user = await req.json();

  const result = await verifyUser(user)(req, res, ctx);

  return result;
};

/** @type {import("msw").ResponseResolver} */
const filterResolver = async (req, res, ctx) => {
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

/** @type {import("msw").ResponseResolver<RestRequest<never, import("msw").PathParams<string>>, import("msw").RestContext, import("msw").DefaultBodyType>} */
const logoutResolver = async (req, res, ctx) => {
  const accessToken = req.headers.get('access-token');
  /** @type {UserPayload} */
  const user = jwtDecode(accessToken);
  return res(
    ctx.status(200),
    ctx.json({ message: 'success' })
  );
};

export default [
  rest.all('/*', filterResolver),
  rest.post('/users/join', joinResolver),
  rest.post('/users/login', loginResolver),
  rest.put('/users/logout', logoutResolver),
];