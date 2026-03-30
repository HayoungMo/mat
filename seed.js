const mongoose = require('mongoose');
const User = require('./models/UserSchema');
const Article = require('./models/ArticleSchema');
const Bookmark = require('./models/BookmarkSchema');
const Review = require('./models/ReviewSchema');
const UpgradeRequest = require('./models/UpgradeRequestSchema');
const Notice = require('./models/NoticeSchema');
//터미널에 node seed.js 입력하면 더미데이터가 들어갑니다.


mongoose.connect('mongodb://localhost:27017/matDB')
  .then(async () => {
    console.log('DB 연결됨');

    // 기존 데이터 전부 초기화
    await User.deleteMany({});
    await Article.deleteMany({});
    await Bookmark.deleteMany({});
    await Review.deleteMany({});
    await UpgradeRequest.deleteMany({});
    await Notice.deleteMany({});
    console.log('기존 데이터 삭제 완료');

    // =============================================
    // 1. 유저 더미데이터
    // =============================================
    await User.create([
      // 관리자
      { userId: 'admin01', password: '1234', tel: '010-0000-0000', email: 'admin@mat.com', role: 'admin', createdAt: new Date() },

      // 지역 담당자 (role: city)
      { userId: 'city_mapo', password: '1234', tel: '010-1111-1111', email: 'mapo@mat.com', addr: '서울시 마포구', role: 'city', createdAt: new Date() },
      { userId: 'city_gangnam', password: '1234', tel: '010-2222-2222', email: 'gangnam@mat.com', addr: '서울시 강남구', role: 'city', createdAt: new Date() },
      { userId: 'city_jongno', password: '1234', tel: '010-3333-3333', email: 'jongno@mat.com', addr: '서울시 종로구', role: 'city', createdAt: new Date() },

      // 일반 유저
      { userId: 'user01', password: '1234', tel: '010-4444-4444', role: 'user', createdAt: new Date() },
      { userId: 'user02', password: '1234', tel: '010-5555-5555', email: 'user02@gmail.com', role: 'user', createdAt: new Date() },
      { userId: 'user03', password: '1234', tel: '010-6666-6666', role: 'user', createdAt: new Date() }
    ]);
    
      //공지(Notice) 게시판
      await Notice.create([
      { title: '맛.ZIP 서비스 오픈 안내', writer: 'admin01', content: '전국 맛집 지도를 완성하는 맛.ZIP이 오픈했습니다!', category: '공지' },
      { title: '지역 담당자(City) 모집 공고', writer: 'admin01', content: '각 지역의 맛집을 소개해줄 담당자를 모집합니다.', category: '채용' }
      ]);

    console.log('유저 데이터 입력 완료');

    // =============================================
    // 2. 기사(Article) 더미데이터
    // =============================================
    await Article.create([
      // 마포구 기사
      {
        no: 1, userId: 'city_mapo', cityName: '마포구',
        title: '연남동 숨은 맛집 탐방기',
        subject: '연남동 골목 안쪽에 위치한 소문난 칼국수집. 직접 반죽한 면발이 쫄깃하고 시원한 국물이 일품입니다.',
        region: '서울', matName: '연남칼국수', matTel: '02-111-1111',
        saveFileName: 'dummy1.jpg', originalFileName: '연남칼국수.jpg'
      },
      {
        no: 2, userId: 'city_mapo', cityName: '마포구',
        title: '합정역 브런치 카페 BEST 3',
        subject: '주말 브런치로 유명한 합정 카페 세 곳을 소개합니다. 에그베네딕트가 특히 맛있는 곳!',
        region: '서울', matName: '카페모닝', matTel: '02-111-2222',
        saveFileName: 'dummy2.jpg', originalFileName: '카페모닝.jpg'
      },

      // 강남구 기사
      {
        no: 3, userId: 'city_gangnam', cityName: '강남구',
        title: '강남역 직장인 점심 맛집',
        subject: '강남역 근처 가성비 좋은 점심 맛집을 모았습니다. 만원 이하로 든든하게!',
        region: '서울', matName: '김밥천국 강남점', matTel: '02-222-1111',
        saveFileName: 'dummy3.jpg', originalFileName: '강남점심.jpg'
      },
      {
        no: 4, userId: 'city_gangnam', cityName: '강남구',
        title: '압구정 로데오 디저트 투어',
        subject: '압구정에서 꼭 가봐야 할 디저트 맛집. 수플레 팬케이크와 크로플이 인기!',
        region: '서울', matName: '스위트랩', matTel: '02-222-2222',
        saveFileName: 'dummy4.jpg', originalFileName: '압구정디저트.jpg'
      },

      // 종로구 기사
      {
        no: 5, userId: 'city_jongno', cityName: '종로구',
        title: '익선동 한옥 감성 카페 모음',
        subject: '한옥을 개조한 감성 카페가 모여있는 익선동. 전통과 현대가 어우러진 공간입니다.',
        region: '서울', matName: '한옥다방', matTel: '02-333-1111',
        saveFileName: 'dummy5.jpg', originalFileName: '익선동카페.jpg'
      },
      {
        no: 6, userId: 'city_jongno', cityName: '종로구',
        title: '광장시장 먹거리 완전정복',
        subject: '빈대떡, 마약김밥, 육회까지! 광장시장에서 꼭 먹어봐야 할 음식을 정리했습니다.',
        region: '서울', matName: '광장시장', matTel: '',
        saveFileName: 'dummy6.jpg', originalFileName: '광장시장.jpg'
      }
    ]);
    console.log('기사 데이터 입력 완료');

    // =============================================
    // 3. 북마크 더미데이터
    // =============================================
    await Bookmark.create([
      { userId: 'user01', articleNo: 1 },  // user01이 연남칼국수 북마크
      { userId: 'user01', articleNo: 5 },  // user01이 익선동카페 북마크
      { userId: 'user02', articleNo: 3 },  // user02가 강남점심 북마크
      { userId: 'user02', articleNo: 6 },  // user02가 광장시장 북마크
      { userId: 'user03', articleNo: 2 }   // user03이 합정카페 북마크
    ]);
    console.log('북마크 데이터 입력 완료');

    // =============================================
    // 4. 리뷰 더미데이터
    // =============================================
    await Review.create([
      { userId: 'user01', aNo: 1, content: '칼국수 진짜 맛있었어요! 면이 쫄깃쫄깃', rating: 5 },
      { userId: 'user02', aNo: 1, content: '국물이 시원하고 좋았습니다', rating: 4 },
      { userId: 'user01', aNo: 3, content: '가성비 최고 점심 맛집이에요', rating: 4 },
      { userId: 'user03', aNo: 5, content: '한옥 분위기가 너무 좋아요', rating: 5 },
      { userId: 'user02', aNo: 6, content: '빈대떡은 역시 광장시장!', rating: 5 }
    ]);
    console.log('리뷰 데이터 입력 완료');

    // =============================================
    // 5. 등업신청 더미데이터
    // =============================================
    await UpgradeRequest.create([
      { userId: 'user01', cityName: '마포구', reason: '마포구 맛집 정보를 올리고 싶습니다', status: 'pending' },
      { userId: 'user02', cityName: '강남구', reason: '강남 지역 맛집을 소개하고 싶어요', status: 'approved' }
    ]);
    console.log('등업신청 데이터 입력 완료');

    // =============================================
    console.log('=============================');
    console.log('전체 더미데이터 입력 완료!');
    console.log('유저 7명 / 기사 6개 / 북마크 5개 / 리뷰 5개 / 등업신청 2개');
    console.log('=============================');

    process.exit();
  })
  .catch((err) => {
    console.error('DB 연결 실패:', err);
    process.exit(1);
  });