import { rest } from 'msw';
import * as Types from '@/types';

/**
 * @type {{[T in Types.NewsSubject]: Types.News[]}}
 */
const data = {
  경제: [{
    title: '윤 대통령, 해외 순방 마치고 귀국…세일즈로 \'경제 외교\'',
    description: '윤 대통령은 첫 방문국인 아랍에미리트에서 300억 달러, 우리돈 약 37조2600억 원 규모의 투자를 유치하고 양해각서 48건을 체결했습니다.',
    link: 'https://news.jtbc.co.kr/article/article.aspx?news_id=NB12111900',
    originallink: 'https://news.jtbc.co.kr/article/article.aspx?news_id=NB12111900',
    pubDate: '2023-01-21',
  }, {
    title: '최태원, 다보스서 각국 정상과 경제협력 방안 논의',
    description: '최태원 SK그룹 회장이 다보스 포럼 기간 동안 각국 정상들과 잇따라 만나 경제협력 방안에 대해 폭넓게...',
    link: 'https://newsis.com/view/?id=NISX20230120_0002166057&cID=13001&pID=13000',
    originallink: 'https://newsis.com/view/?id=NISX20230120_0002166057&cID=13001&pID=13000',
    pubDate: '2023.01.20',
  }, {
    title: '尹, UAE·스위스 순방 마치고 귀국…“경제인들과 함께 뛰었다”',
    description: '윤석열 대통령이 6박 8일 일정의 아랍에미리트(UAE)·스위스 순방을 마치고 귀국했습니다.',
    link: 'https://news.kbs.co.kr/news/view.do?ncd=7584620&ref=A',
    originallink: 'https://news.kbs.co.kr/news/view.do?ncd=7584620&ref=A',
    pubDate: '2023.01.21'
    }],
  금리: [{
    title: '"예금 미리 들어둘걸" 5대 은행 정기예금 금리 3%대로 하락',
    description: '5대 은행의 정기예금 금리가 3%대로 내려갔다.',
    link: 'https://magazine.hankyung.com/business/article/202301207155b',
    originallink: 'https://magazine.hankyung.com/business/article/202301207155b',
    pubDate: '2023.01.21'
  }, {
    title: '\'매파\' 연준이사도 올해 첫 금리결정 앞두고 "0.25%P 인상 지지"',
    description: '매파(통화긴축 선호) 성향으로 알려진 크리스토퍼 월러 미국 연방준비제도(Fed·연준) 이사도 금리인상 속도 조절을 공개 지지했다.',
    link: 'https://www.yna.co.kr/view/AKR20230121007200072?input=1195m',
    originallink: 'https://www.yna.co.kr/view/AKR20230121007200072?input=1195m',
    pubDate: '2023-01-21'
    }, {
    title: '5대 시중은행, 정기예금 금리 모두 3%대로 내려',
    description: '기준금리가 올라간 이후에도 더 떨어지면서 5대 시중은행 모두 3%대로 내려갔다.',
    link: 'https://newsis.com/view/?id=NISX20230120_0002166040&cID=15001&pID=15000',
    originallink: 'https://newsis.com/view/?id=NISX20230120_0002166040&cID=15001&pID=15000',
    pubDate: '2023.01.20'
    }],
  부동산: [{
    title: 'NH證 “부동산 단기회복 어려워…’정책’과 ‘금리’ 변수”',
    description: '올해 부동산시장은 금리인상과 정책효과의 시차로 인해 단기 회복되기는 어렵다는 분석이 나왔다.',
    link: 'http://www.joseilbo.com/news/news_read.php?uid=476498&class=53&grp=',
    originallink: 'http://www.joseilbo.com/news/htmls/2023/01/20230120476498.html',
    pubDate: '2023.01.20'
  }, {
    title: '한때 아시아 2위 부호, 재산 92% 증발…부동산 침체와 함께 몰락',
    description: '중국 부동산 개발업체 헝다(恒大·에버그란데) 회장의 재산이 93% 증발한 것으로 나타났다.',
    link: 'http://www.munhwa.com/news/view.html?no=2023012001039910126004',
    originallink: 'http://www.munhwa.com/news/view.html?no=2023012001039910126004',
    pubDate: '2023-01-20'
    }, {
    title: '‘전세사기 사각지대’…부동산 거래 35% 무등록 중개',
    description: '부동산 거래 10건 중 4건이 불법·무등록 중개거래인 것으로 나타났다.',
    link: 'https://view.asiae.co.kr/article/2023012101435269463',
    originallink: 'https://view.asiae.co.kr/article/2023012101435269463',
    pubDate: '2023.01.21'
  }],
  아파트: [{
    title: '다음달 말부터 다주택자도 \'줍줍\'…9억원 넘는 아파트 \'특공\'',
    description: '투기과열지구의 분양가 9억원 초과 아파트를 특별공급 대상에서 제외한다는 정책은 2018년 도입됐다.',
    link: 'https://www.yna.co.kr/view/AKR20230120116700003?input=1195m',
    originallink: 'https://www.yna.co.kr/view/AKR20230120116700003?input=1195m',
    pubDate: '2023-01-21'
  }, {
    title: '부산 아파트 주차타워서 40대 숨진 채 발견…경찰 수사',
    description: '부산의 한 아파트 주차타워에서 40대 주민이 숨진 채 발견돼 경찰이 수사에 나섰다.',
    link: 'https://www.busan.com/view/busan/view.php?code=2023012115191867022',
    originallink: 'https://www.busan.com/view/busan/view.php?code=2023012115191867022',
    pubDate: '2023-01-21'
    }, {
    title: '설 연휴 첫날, 전주 아파트 17층서 화재…인명피해 없어',
    description: '설날 연휴 첫날인 21일 낮 12시5분쯤 전북 전주시 덕진구 중동의 한 아파트 17층에서 불이 났다.',
    link: 'https://www.nocutnews.co.kr/news/5883585',
    originallink: 'https://www.nocutnews.co.kr/news/5883585',
    pubDate: '2023-01-21'
  }],
  주식: [{
    title: '증권가 "설날에도 해외 주식 투자 하세요"',
    description: '국내 증권사들이 설 연휴를 맞아 해외주식에 투자하는 서학개미들을 지원한다.',
    link: 'http://www.fnnews.com/news/202301210910217725',
    originallink: 'https://www.fnnews.com/news/202301210910217725',
    pubDate: '2023.01.21'
  }, {
    title: '주가 급락했는데…세뱃돈으로 테슬라 주식 사도될까요',
    description: '지난 20일까지 서학개미의 테슬라 매수결제규모는 9억756(약 1조1208억원)달러로, 해외 투자 1위 주식을 차지하고 있다.',
    link: 'http://www.edaily.co.kr/news/newspath.asp?newsid=01328406635480016',
    originallink: 'https://www.edaily.co.kr/news/read?newsId=01328406635480016&mediaCodeNo=257&OutLnkChk=Y',
    pubDate: '2023-01-21'
    }, {
    title: '주식형 펀드 운용사 43곳 모두 손실...‘HERO 펀드’는 따로 있다',
    description: '액티브 주식형 펀드 534개에서는 500억원 가까운 자금이 순유출됐다.',
    link: 'https://www.mk.co.kr/article/10605416',
    originallink: 'https://www.mk.co.kr/news/economy/10605416',
    pubDate: '2023-01-21'
  }]
};

export default [
  rest.get('/naver/news/:subject', (req, res, ctx) => {
    /** @type {{subject: Types.NewsSubject}} */
    const { subject } = req.params;

    return res(
      ctx.status(200),
      ctx.json(data[subject]),
    );
  }),
];