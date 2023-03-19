import { rest } from 'msw';

export default [
    rest.get('/board/article/type', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json(['', '공지사항', '질문', '일반']),
        );
    }),
    // intercepts `board?type=${type}&page=${page}`
    rest.get('/board', (req, res, ctx) => {
        const type = req.url.searchParams.get('type');
        const page = req.url.searchParams.get('page');

        /** @type {import('@/api/board').ArticleData} */
        const ret = {
            articleList: [{
            articleNo: 0,
            articlePropId: 0,
            articlePropName: '공지사항',
            hit: 0,
            registerTime: new Date().toLocaleString(),
            subject: '제목',
            userId: 'ssafy',
            userRole: 'admin',
            }],
            maxPage: 1,
            maxSize: 1,
            page: '0',
            size: '1',
        };

        return res(
            ctx.status(200),
            ctx.json(ret),
        );
    }),
    // intercepts `board/not-notice?type=${type}&page=${page}`
    rest.get('/board/not-notice', (req, res, ctx) => {
        const type = req.url.searchParams.get('type');
        const page = req.url.searchParams.get('page');
        /** @type {import('@/api/board').ArticleData} */
        const ret = {
          articleList: [{
            articleNo: 0,
            articlePropId: 0,
            articlePropName: '일반',
            hit: 0,
            registerTime: new Date().toLocaleString(),
            subject: '제목',
            userId: 'ssafy',
            userRole: 'admin',
          }],
          maxPage: 1,
          maxSize: 1,
          page: '0',
          size: '1',
        };
        return res(
          ctx.status(200),
          ctx.json(ret),
        );
    }),
];