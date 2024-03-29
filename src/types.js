/**
 * @typedef {Object} Interest
 * @property {string} dongCode
 * @property {string} dongName
 * @property {string} gugunName
 * @property {string} sidoName
 */

/**
 * @typedef {Object} SimpleApt
 * @property {string} apartmentName
 * @property {number} aptCode
 * @property {number} buildyear
 * @property {string} dongCode
 * @property {string} lat
 * @property {string} lng
 */

/**
 * @typedef {Object} Building
 * @property {number} pk
 * @property {string} si
 * @property {string} gugun
 * @property {string} dong
 * @property {string} name
 * @property {string} dongCode
 * @property {string} tableName
 */

/**
 * @typedef {Object} News
 * @property {string} title
 * @property {string} description
 * @property {string} pubDate
 * @property {string} link
 * @property {string} originallink
 */

/**
 * @typedef {'부동산' | '금리' | '경제' | '주식' | '아파트'} NewsSubject
 */

export const Types = {};