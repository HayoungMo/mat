const mongoose = require('mongoose');
const User = require('./models/UserSchema');
const Article = require('./models/ArticleSchema');
const Bookmark = require('./models/BookmarkSchema');
const Review = require('./models/ReviewSchema');
const UpgradeRequest = require('./models/UpgradeRequestSchema');
const FreeBoard = require('./models/FreeBoardSchema');

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
    await FreeBoard.deleteMany({});
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
    // 6. 자유게시판(FreeBoard) 더미데이터
    // =============================================
    await FreeBoard.create([
      {
        userId: 'user01', title: '오늘 점심 메뉴 추천받아요!', type: '글', 
        subject: '수원역 근처에서 혼밥하기 좋은 곳 있을까요? 너무 배고프네요.',
        readCount: 15, like: 3, isBookmarked: ['user02'], sysdate: new Date()
      },
      {
        userId: 'user02', title: '이번 주말 마포구 맛집 투어 가실 분?', type: '글', 
        subject: '연남동 쪽 새로 생긴 카페 가보고 싶은데 같이 가실 분 구합니다!',
        readCount: 20, like: 5, isBookmarked: ['user01', 'user03'], sysdate: new Date()
      },
      {
        userId: 'admin01', title: '[공지] 게시판 이용 수칙 안내', type: '글', 
        subject: '깨끗한 커뮤니티를 위해 비방이나 광고성 글은 삼가 부탁드립니다.',
        readCount: 100, like: 10, isBookmarked: [], sysdate: new Date()
      },
      {
        userId: 'user03', title: '최고의 면 요리는?', type: '설문', 
        subject: '칼국수 vs 냉면 vs 파스타 여러분의 선택은?',
        votedCount: 45, readCount: 50, like: 2, isBookmarked: [], sysdate: new Date()
      },
      {
        userId: 'city_mapo', title: '마포구 축제 현장 사진입니다', type: '이미지', 
        subject: '오늘 날씨가 너무 좋아서 축제 현장 찍어봤어요. 다들 놀러오세요!',
        saveFileName: ['fest1.jpg', 'fest2.jpg'], originalFileName: ['축제1.jpg', '축제2.jpg'],
        readCount: 35, like: 12, isBookmarked: ['user02'], sysdate: new Date()
      },
      {
        userId: 'user01', title: '코딩 공부하기 좋은 카페 찾음', type: '글', 
        subject: '조용하고 콘센트 많아서 작업하기 딱 좋네요. 공유합니다.',
        readCount: 42, like: 8, isBookmarked: ['user02', 'user03'], sysdate: new Date()
      },
      {
        userId: 'user02', title: '민초단 다들 모여보세요 (설문)', type: '설문', 
        subject: '민트초코 호불호 조사합니다.',
        votedCount: 88, readCount: 90, like: 15, isBookmarked: ['user01'], sysdate: new Date()
      },
      {
        userId: 'city_gangnam', title: '강남역 퇴근길 현황', type: '이미지', 
        subject: '사람이 정말 많네요. 다들 안전 귀가하세요!',
        saveFileName: ['subway.jpg'], originalFileName: ['지하철.jpg'],
        readCount: 28, like: 4, isBookmarked: [], sysdate: new Date()
      },
      {
        userId: 'user03', title: '도서관에서 공부 중인데 너무 졸려요', type: '글', 
        subject: '졸음 깨는 법 좀 알려주세요. 커피 세 잔째입니다...',
        readCount: 12, like: 1, isBookmarked: [], sysdate: new Date()
      },
      {
        userId: 'admin01', title: '서비스 점검 안내 (2026-04-01)', type: '글', 
        subject: '안정적인 서비스 제공을 위해 새벽 2시부터 4시까지 점검이 진행됩니다.',
        readCount: 200, like: 0, isBookmarked: [], sysdate: new Date()
      }
    ]);
    console.log('자유게시판 데이터 입력 완료');

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