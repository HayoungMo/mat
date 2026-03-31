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
      { userId: 'city1', password: '0000', tel: '010-1111-2222', email: 'city1@gangnam.go.kr', addr: '서울특별시 강남구 테헤란로 123', role: 'city', createdAt: new Date() },
      { userId: 'city2', password: '0000', tel: '010-2222-3333', email: 'city2@yongsan.go.kr', addr: '서울특별시 용산구 이태원로 45', role: 'city', createdAt: new Date() },
      { userId: 'city3', password: '0000', tel: '010-3333-4444', email: 'city3@dongjak.go.kr', addr: '서울특별시 동작구 노량진로 78', role: 'city', createdAt: new Date() },
      { userId: 'city4', password: '0000', tel: '010-4444-5555', email: 'city4@mapo.go.kr', addr: '서울특별시 마포구 홍익로 22', role: 'city', createdAt: new Date() },
      { userId: 'city5', password: '0000', tel: '010-5555-6666', email: 'city5@jung.go.kr', addr: '서울특별시 중구 명동길 99', role: 'city', createdAt: new Date() },

      // 일반 유저
      { userId: 'user01', password: '1234', tel: '010-4444-4444', role: 'user', createdAt: new Date() },
      { userId: 'user02', password: '1234', tel: '010-5555-5555', email: 'user02@gmail.com', role: 'user', createdAt: new Date() },
      { userId: 'user03', password: '1234', tel: '010-6666-6666', role: 'user', createdAt: new Date() }
    ]);
    console.log('유저 데이터 입력 완료');

    // =============================================
    // 2. 기사(Article) 실제 데이터
    // =============================================
    await Article.create([
      {
        no: 1, userId: 'city1', cityName: 'Gangnam',
        title: "쫀득한 식감의 정수, 리북집 논현직영점",
        subject: "논현동에 자리한 리북집 논현직영점은 족발과 보쌈을 중심으로 오랜 시간 꾸준한 사랑을 받아온 식당이다. 이곳의 족발은 겉은 윤기 있게 빛나면서도 속은 촉촉한 식감을 유지하는 것이 특징이다. 적당한 간이 배어 있어 별도의 양념 없이도 충분한 풍미를 느낄 수 있으며, 씹을수록 고기의 깊은 맛이 자연스럽게 퍼진다. 함께 제공되는 보쌈 역시 부드러운 식감이 인상적이며, 깔끔하게 정리된 반찬들과 함께 조화를 이룬다. 과하게 자극적이지 않은 맛 덕분에 누구나 부담 없이 즐길 수 있는 한 끼가 완성된다. 내부는 활기찬 분위기로 저녁 시간에는 다양한 모임으로 붐비는 모습을 볼 수 있다. 특히 술과 함께 즐기기 좋은 메뉴 구성 덕분에 자연스럽게 긴 시간 머무르게 되는 공간이다. 리북집 논현직영점은 화려한 연출 없이도 기본에 충실한 맛으로 만족을 주는 곳으로, 족발과 보쌈을 제대로 즐기고 싶은 이들에게 안정적인 선택지가 된다.",
        region: 'Gangnam', matName: '리북집 논현직영점', matTel: '02-540-8589',
        matAddr: '서울 강남구 논현동 163-4',
        images: [], sysdate: new Date()
      },
      {
        no: 2, userId: 'city1', cityName: 'Gangnam',
        title: "전통 한식의 품격을 느끼다, 한일관 압구정점",
        subject: "압구정에 위치한 한일관 압구정점은 오랜 역사와 전통을 기반으로 한식을 선보이는 대표적인 식당이다. 이곳은 화려함보다는 정갈함과 균형에 집중한 요리로 꾸준한 신뢰를 쌓아왔다. 음식은 전체적으로 자극적이지 않고 재료 본연의 맛을 살리는 데 중점을 두고 있어 부담 없이 즐길 수 있다. 특히 한 상 차림으로 제공되는 구성은 다양한 반찬과 함께 식사의 완성도를 높여주며, 각 요소가 조화롭게 어우러진다. 내부는 단정하고 깔끔한 분위기를 유지하고 있어 가족 모임이나 중요한 식사 자리에도 잘 어울린다. 직원들의 응대 역시 안정적이며, 전반적으로 차분한 식사 경험을 제공한다. 한일관 압구정점은 단순히 한 끼를 해결하는 공간을 넘어, 전통 한식이 지닌 깊이와 가치를 느낄 수 있는 장소로 자리하고 있다.",
        region: 'Gangnam', matName: '한일관 압구정점', matTel: '02-732-3735',
        matAddr: '서울 강남구 신사동 619-4',
        images: [], sysdate: new Date()
      },
      {
        no: 3, userId: 'city1', cityName: 'Gangnam',
        title: "깔끔한 육수의 깊이, 강남면옥 신사점",
        subject: "신사동에 위치한 강남면옥 신사점은 냉면을 중심으로 꾸준한 인기를 얻고 있는 한식당이다. 이곳의 냉면은 시원하면서도 깊이 있는 육수로 첫 맛부터 인상적인 경험을 제공한다. 육수는 과하게 자극적이지 않으면서도 감칠맛이 살아 있어 끝까지 부담 없이 즐길 수 있다. 면발은 적당한 탄력을 유지해 씹는 즐거움을 더하며, 육수와의 조화도 자연스럽게 이어진다. 전체적으로 균형 잡힌 맛이 특징이며, 계절에 상관없이 찾는 손님들이 많다. 내부는 깔끔하게 정리되어 있어 편안한 식사를 할 수 있으며, 점심시간에는 인근 직장인들로 활기를 띤다. 강남면옥 신사점은 화려함보다는 기본에 충실한 방식으로 냉면의 매력을 전달하는 곳으로, 안정적인 한 끼를 원하는 이들에게 잘 어울린다.",
        region: 'Gangnam', matName: '강남면옥 신사점', matTel: '02-3446-5539',
        matAddr: '서울 강남구 신사동 588-9',
        images: [], sysdate: new Date()
      },
      {
        no: 4, userId: 'city1', cityName: 'Gangnam',
        title: "여유로운 브런치의 정석, 빌즈 강남",
        subject: "역삼동에 위치한 빌즈 강남은 여유로운 분위기 속에서 양식 브런치를 즐길 수 있는 공간으로 많은 이들에게 사랑받고 있다. 이곳은 밝고 개방감 있는 인테리어가 특징으로, 자연스럽게 편안한 시간을 보낼 수 있는 환경을 제공한다. 메뉴는 다양한 브런치 요리를 중심으로 구성되어 있으며, 신선한 재료를 활용해 부담 없이 즐길 수 있는 맛을 지향한다. 음식은 과하지 않게 정제된 스타일로 제공되며, 한 끼 식사로도 충분한 만족감을 준다. 특히 친구와의 만남이나 가벼운 모임, 여유로운 주말 시간을 보내기에 잘 어울리는 장소다. 내부는 비교적 넓고 쾌적하게 유지되어 있어 긴 시간 머물러도 부담이 없다. 빌즈 강남은 빠르게 소비되는 식사가 아니라, 시간을 들여 즐기는 식사의 가치를 느낄 수 있는 공간으로 자리하고 있다.",
        region: 'Gangnam', matName: '빌즈 강남', matTel: '02-568-1353',
        matAddr: '서울 강남구 역삼동 736-1',
        images: [], sysdate: new Date()
      },
      {
        no: 5, userId: 'city1', cityName: 'Gangnam',
        title: "정통 수제버거의 매력, 브루클린더버거조인트 삼성점",
        subject: "삼성동에 위치한 브루클린더버거조인트 삼성점은 수제버거의 매력을 제대로 느낄 수 있는 공간이다. 이곳의 버거는 두툼한 패티와 신선한 재료의 조합이 돋보이며, 한 입 베어 물었을 때 느껴지는 풍부한 육즙이 인상적이다. 빵과 패티, 채소, 소스가 균형 있게 어우러져 안정적인 맛을 만들어낸다. 과하게 복잡하지 않은 구성은 오히려 재료의 개성을 더욱 또렷하게 드러낸다. 내부는 캐주얼하면서도 활기찬 분위기로 구성되어 있어 친구들과 함께 방문하기에 적합하다. 식사 자체를 가볍게 즐기기에도 좋고, 편안한 분위기 속에서 시간을 보내기에도 잘 어울린다. 브루클린더버거조인트 삼성점은 기본에 충실한 방식으로 수제버거의 매력을 전달하는 곳으로, 부담 없이 만족할 수 있는 한 끼를 제공한다.",
        region: 'Gangnam', matName: '브루클린더버거조인트 삼성점', matTel: '02-555-7180',
        matAddr: '서울 강남구 삼성동 146-23',
        images: [], sysdate: new Date()
      },
      {
        no: 6, userId: 'city1', cityName: 'Gangnam',
        title: "자연스러운 맛의 균형, 마켓오 압구정점",
        subject: "논현동에 위치한 마켓오 압구정점은 자연스러운 재료의 맛을 살린 양식 요리를 선보이는 공간이다. 이곳은 과하게 꾸미기보다는 재료 본연의 특성을 살리는 데 집중해 깔끔하고 안정적인 맛을 제공한다. 메뉴는 다양한 양식 요리로 구성되어 있으며, 전체적으로 부담 없이 즐길 수 있는 균형 잡힌 스타일을 지향한다. 내부는 차분하면서도 세련된 분위기로 꾸며져 있어 편안한 식사를 이어갈 수 있는 환경을 갖추고 있다. 친구와의 만남이나 가벼운 모임, 데이트 장소로도 잘 어울리며, 전체적으로 여유로운 식사 흐름을 만들어준다. 마켓오 압구정점은 화려한 요소보다는 기본적인 완성도를 중요하게 생각하는 이들에게 적합한 선택지다.",
        region: 'Gangnam', matName: '마켓오 압구정점', matTel: '02-515-0105',
        matAddr: '서울 강남구 논현동 91-6',
        images: [], sysdate: new Date()
      },
      {
        no: 7, userId: 'city1', cityName: 'Gangnam',
        title: "소박하지만 깊은 맛, 논현손칼국수",
        subject: "논현동에 자리한 논현손칼국수는 오랜 시간 한결같은 맛으로 지역 주민들의 사랑을 받아온 칼국수 전문점이다. 이곳의 칼국수는 직접 반죽한 면에서 오는 쫄깃한 식감이 특징이며, 국물은 진하면서도 깔끔하게 마무리된다. 자극적인 요소 없이도 충분한 감칠맛을 느낄 수 있어 부담 없이 한 끼를 즐기기에 적합하다. 특히 꾸준히 찾는 단골 손님들이 많다는 점에서 이곳의 안정적인 맛을 확인할 수 있다. 내부는 소박하고 정겨운 분위기를 유지하고 있으며, 편안하게 식사를 이어갈 수 있는 환경을 제공한다. 논현손칼국수는 화려함보다는 기본에 충실한 맛으로 꾸준히 선택받는 식당으로, 담백한 한 그릇을 찾는 이들에게 잘 어울린다.",
        region: 'Gangnam', matName: '논현손칼국수', matTel: '02-517-6030',
        matAddr: '서울 강남구 논현동 193-38',
        images: [], sysdate: new Date()
      },
      {
        no: 8, userId: 'city1', cityName: 'Gangnam',
        title: "간편하지만 깊은 맛, 을밀대컵냉면 역삼점",
        subject: "역삼동에 위치한 을밀대컵냉면 역삼점은 전통 냉면의 맛을 보다 간편하게 즐길 수 있도록 구성된 공간이다. 이곳의 냉면은 시원한 육수와 탄력 있는 면발의 조화가 특징이며, 간단한 형태로 제공되지만 맛의 깊이는 결코 가볍지 않다. 육수는 담백하면서도 감칠맛이 살아 있어 부담 없이 즐길 수 있고, 면은 적당한 탄력을 유지해 식감을 살려준다. 빠르게 식사를 해결해야 하는 상황에서도 만족도를 유지할 수 있는 구성이 돋보인다. 내부는 간결하고 효율적으로 구성되어 있어 혼자 방문하기에도 부담이 없으며, 바쁜 직장인들에게 특히 적합한 환경을 제공한다. 을밀대컵냉면 역삼점은 전통적인 맛을 현대적인 방식으로 풀어낸 공간으로, 일상 속에서 간편하게 즐길 수 있는 냉면 한 끼를 찾는 이들에게 좋은 선택지가 된다.",
        region: 'Gangnam', matName: '을밀대컵냉면 역삼점', matTel: '02-508-0280',
        matAddr: '서울 강남구 역삼동 735-17',
        images: [], sysdate: new Date()
      },
      {
        no: 9, userId: 'city1', cityName: 'Gangnam',
        title: "가볍고 깊은 국물의 매력, 포브라더스 도곡점",
        subject: "도곡동에 위치한 포브라더스 도곡점은 베트남 쌀국수를 중심으로 한 동남아 요리를 선보이는 식당이다. 이곳의 쌀국수는 맑고 깔끔한 국물이 특징으로, 부담 없이 즐길 수 있는 가벼운 식사를 제공한다. 육수는 깊은 감칠맛을 유지하면서도 과하게 무겁지 않아 누구나 편안하게 접근할 수 있다. 면과 고기, 채소가 균형 있게 어우러져 한 그릇 안에서 완성도 높은 조화를 만들어낸다. 내부는 깔끔하고 편안한 분위기로 구성되어 있어 혼자 방문하거나 가벼운 모임을 가지기에도 적합하다. 빠르게 식사를 마칠 수 있는 점 또한 장점으로 작용한다. 포브라더스 도곡점은 자극적이지 않은 맛을 선호하는 이들에게 잘 어울리는 공간으로, 일상 속에서 부담 없이 즐길 수 있는 식사를 제공한다.",
        region: 'Gangnam', matName: '포브라더스 도곡점', matTel: '02-574-4147',
        matAddr: '서울 강남구 도곡동 423-5',
        images: [], sysdate: new Date()
      },
      {
        no: 10, userId: 'city1', cityName: 'Gangnam',
        title: "신선함이 살아있는 초밥 한 접시, 갓덴스시 신사점",
        subject: "신사동에 위치한 갓덴스시 신사점은 신선한 재료를 기반으로 한 초밥을 합리적으로 즐길 수 있는 곳이다. 이곳의 초밥은 재료의 신선도가 가장 큰 강점으로, 한 점 한 점에서 깔끔한 풍미를 느낄 수 있다. 밥과 생선의 균형이 잘 맞아 과하지 않으면서도 안정적인 맛을 제공한다. 다양한 종류의 초밥을 부담 없이 선택할 수 있어 여러 가지 맛을 경험하기에도 좋다. 내부는 캐주얼하면서도 깔끔하게 구성되어 있어 편안한 식사를 이어갈 수 있는 환경을 제공한다. 혼자 방문하기에도 부담이 없고, 친구들과 함께 가볍게 즐기기에도 적합하다. 갓덴스시 신사점은 기본에 충실한 초밥의 매력을 전달하는 공간으로, 꾸준히 찾게 되는 안정적인 선택지다.",
        region: 'Gangnam', matName: '갓덴스시 신사점', matTel: '02-3446-1477',
        matAddr: '서울 강남구 신사동 537',
        images: [], sysdate: new Date()
      },
      {
        no: 11, userId: 'city1', cityName: 'Gangnam',
        title: "깊고 진한 한 그릇, 외고집설렁탕",
        subject: "삼성동에 위치한 외고집설렁탕은 오랜 시간 설렁탕 하나로 꾸준한 사랑을 받아온 식당이다. 이곳의 설렁탕은 뽀얗게 우러난 국물에서부터 깊은 내공이 느껴진다. 장시간 끓여낸 육수는 진하면서도 깔끔하게 마무리되며, 부담 없이 즐길 수 있는 균형을 갖추고 있다. 고기는 부드럽게 익어 국물과 함께 자연스럽게 어우러지고, 밥과 함께 먹으면 든든한 한 끼가 완성된다. 과한 양념 없이도 충분한 풍미를 느낄 수 있다는 점이 이곳의 큰 장점이다. 내부는 소박하고 정겨운 분위기로, 편안하게 식사를 이어갈 수 있는 환경을 제공한다. 외고집설렁탕은 화려한 요소 없이도 기본에 충실한 맛으로 꾸준히 선택받는 식당이다.",
        region: 'Gangnam', matName: '외고집설렁탕', matTel: '02-567-5225',
        matAddr: '서울 강남구 삼성동 120-8',
        images: [], sysdate: new Date()
      },
      {
        no: 12, userId: 'city1', cityName: 'Gangnam',
        title: "정갈한 냉면의 완성, 평가옥 삼성점",
        subject: "삼성동에 위치한 평가옥 삼성점은 냉면을 중심으로 한 깔끔한 한식을 제공하는 식당이다. 이곳의 냉면은 담백하면서도 깊이 있는 육수가 특징이며, 과하지 않은 양념으로 전체적인 균형을 유지한다. 면발은 적당한 탄력을 지니고 있어 씹는 즐거움을 더하며, 육수와 자연스럽게 어우러진다. 자극적이지 않은 맛 덕분에 누구나 부담 없이 즐길 수 있는 한 끼를 완성한다. 내부는 깔끔하고 정돈된 분위기로 구성되어 있어 편안한 식사를 이어갈 수 있다. 평가옥 삼성점은 화려함보다는 안정적인 맛과 정갈한 구성으로 꾸준히 사랑받는 식당이다.",
        region: 'Gangnam', matName: '평가옥 삼성점', matTel: '02-568-1577',
        matAddr: '서울 강남구 삼성동 143-1',
        images: [], sysdate: new Date()
      },
      {
        no: 13, userId: 'city1', cityName: 'Gangnam',
        title: "와인과 함께하는 여유, 와인코르크",
        subject: "역삼동에 위치한 와인코르크는 다양한 와인을 중심으로 여유로운 시간을 보낼 수 있는 공간이다. 이곳은 단순히 술을 마시는 곳을 넘어 분위기와 경험을 함께 제공하는 것이 특징이다. 내부는 차분하고 아늑하게 꾸며져 있어 대화를 나누며 시간을 보내기에 적합하다. 다양한 와인 리스트를 통해 취향에 맞는 선택이 가능하며, 간단한 안주와 함께 즐기면 더욱 만족도가 높아진다. 과하게 시끄럽지 않은 분위기 덕분에 데이트나 소규모 모임에도 잘 어울린다. 와인코르크는 일상 속에서 잠시 여유를 찾고 싶은 이들에게 적합한 공간으로, 강남에서 편안하게 머물 수 있는 장소 중 하나다.",
        region: 'Gangnam', matName: '와인코르크', matTel: '02-501-6335',
        matAddr: '서울 강남구 역삼동 619-26',
        images: [], sysdate: new Date()
      },
      {
        no: 14, userId: 'city1', cityName: 'Gangnam',
        title: "고기의 깊이를 느끼다, 우미학 압구정 본점",
        subject: "신사동에 위치한 우미학 압구정 본점은 고기의 본질적인 맛을 중요하게 생각하는 한식 고깃집이다. 이곳은 신선한 재료와 기본에 충실한 조리를 통해 안정적인 맛을 제공한다. 고기는 적절한 온도에서 익혀지며 육즙을 그대로 살려 깊은 풍미를 만들어낸다. 별도의 강한 양념 없이도 고기 자체의 맛을 충분히 즐길 수 있으며, 간단한 곁들임과 함께 식사의 완성도를 높인다. 내부는 깔끔하고 세련된 분위기로 구성되어 있어 다양한 모임에 적합하다. 우미학 압구정 본점은 화려함보다는 기본에 집중해 고기의 매력을 전달하는 공간이다.",
        region: 'Gangnam', matName: '우미학 압구정 본점', matTel: '0507-1404-2213',
        matAddr: '서울 강남구 신사동 600-1',
        images: [], sysdate: new Date()
      },
      {
        no: 15, userId: 'city1', cityName: 'Gangnam',
        title: "클래식한 매력의 수제버거, 원스타올드패션드 햄버거",
        subject: "도곡동에 위치한 원스타올드패션드 햄버거는 이름 그대로 클래식한 스타일의 수제버거를 선보이는 공간이다. 이곳의 버거는 기본적인 구성에 충실하면서도 재료의 조화를 통해 안정적인 맛을 만들어낸다. 두툼한 패티는 육즙을 잘 머금고 있으며, 신선한 채소와 함께 어우러져 균형 잡힌 식감을 제공한다. 과하게 화려하지 않은 구성은 오히려 버거 본연의 매력을 더욱 강조한다. 내부는 캐주얼하고 편안한 분위기로, 부담 없이 방문해 식사를 즐기기에 적합하다. 원스타올드패션드 햄버거는 기본에 충실한 방식으로 수제버거의 매력을 전달하는 곳으로, 일상 속에서 편하게 찾을 수 있는 식당이다.",
        region: 'Gangnam', matName: '원스타올드패션드 햄버거', matTel: '0507-1448-4377',
        matAddr: '서울 강남구 도곡동 424-11',
        images: [], sysdate: new Date()
      },
      {
        no: 31, userId: 'city4', cityName: 'Mapo',
        title: "속을 든든하게 채우는 한 그릇, 망원동 일등식당",
        subject: "망원동에 자리한 일등식당은 해장국 하나로 오랜 시간 지역 주민들의 사랑을 받아온 곳이다. 이곳의 해장국은 첫 숟갈부터 깊은 국물의 진함이 느껴지며, 속을 편안하게 풀어주는 것이 특징이다. 오랜 시간 끓여낸 육수는 잡내 없이 깔끔하면서도 진한 풍미를 유지하고 있어 부담 없이 즐길 수 있다. 건더기 또한 넉넉하게 들어가 있어 한 그릇만으로도 충분한 포만감을 제공한다. 과하지 않은 양념은 국물 본연의 맛을 해치지 않으면서 전체적인 균형을 유지해준다. 내부는 소박하고 정겨운 분위기로 구성되어 있어 편안하게 식사를 이어갈 수 있으며, 아침부터 늦은 시간까지 꾸준히 손님들의 발길이 이어진다. 특히 해장이 필요한 순간뿐만 아니라 든든한 한 끼를 원하는 날에도 자연스럽게 찾게 되는 곳이다. 일등식당은 화려한 요소 없이도 기본에 충실한 맛으로 꾸준히 선택받는 식당이다.",
        region: 'Mapo', matName: '일등식당', matTel: '02-333-0361',
        matAddr: '서울 마포구 망원동 476-1',
        images: [], sysdate: new Date()
      },
      {
        no: 32, userId: 'city4', cityName: 'Mapo',
        title: "강렬한 한 그릇의 매력, 짬뽕지존 홍대점",
        subject: "서교동에 위치한 짬뽕지존 홍대점은 이름 그대로 짬뽕의 강렬한 맛을 제대로 느낄 수 있는 중식당이다. 이곳의 짬뽕은 깊고 진한 국물에서부터 차별화된 인상을 준다. 해산물과 채소, 면이 어우러져 풍성한 구성을 이루며, 매콤하면서도 감칠맛이 살아 있는 국물이 특징이다. 자극적인 듯하면서도 균형을 잃지 않는 맛 덕분에 한 그릇을 끝까지 즐길 수 있다. 면발은 국물과 잘 어우러지도록 적당한 탄력을 유지하고 있으며, 전체적으로 조화로운 식감을 완성한다. 내부는 활기찬 분위기로 구성되어 있어 친구들과 함께 방문하기에도 적합하다. 짬뽕지존 홍대점은 강한 맛을 선호하는 이들에게 특히 매력적인 공간으로, 확실한 인상을 남기는 한 끼를 제공한다.",
        region: 'Mapo', matName: '짬뽕지존 홍대점', matTel: '02-332-6158',
        matAddr: '서울 마포구 서교동 408-27',
        images: [], sysdate: new Date()
      },
      {
        no: 33, userId: 'city4', cityName: 'Mapo',
        title: "깔끔한 한 점의 완성, 여우골초밥 서교점",
        subject: "서교동에 자리한 여우골초밥 서교점은 신선한 재료를 바탕으로 한 초밥을 합리적인 가격에 즐길 수 있는 곳이다. 이곳의 초밥은 재료의 신선도가 가장 큰 강점으로, 한 점마다 깔끔한 맛이 인상적으로 남는다. 밥과 생선의 균형이 잘 맞아 과하지 않으면서도 안정적인 풍미를 전달하며, 다양한 종류를 부담 없이 선택할 수 있다는 점도 매력이다. 내부는 캐주얼하고 편안한 분위기로 구성되어 있어 혼자 방문하기에도 부담이 없고, 친구들과 가볍게 식사를 즐기기에도 적합하다. 빠르게 식사를 해결하면서도 만족도를 유지할 수 있는 점 또한 장점이다. 여우골초밥 서교점은 기본에 충실한 초밥의 매력을 전달하는 공간으로, 일상 속에서 자주 찾게 되는 식당이다.",
        region: 'Mapo', matName: '여우골초밥 서교점', matTel: '02-338-8717',
        matAddr: '서울 마포구 서교동 352-16',
        images: [], sysdate: new Date()
      },
      {
        no: 34, userId: 'city4', cityName: 'Mapo',
        title: "매콤한 중독의 맛, 홍스쭈꾸미 홍대본점",
        subject: "서교동에 위치한 홍스쭈꾸미 홍대본점은 매콤한 쭈꾸미 요리로 많은 사람들의 입맛을 사로잡은 식당이다. 이곳의 쭈꾸미는 쫄깃한 식감을 유지하면서도 양념과 잘 어우러지는 것이 특징이다. 매콤한 양념은 강렬한 인상을 주지만 과하지 않게 조절되어 있어 계속해서 손이 가는 맛을 만들어낸다. 함께 제공되는 채소와 곁들임 메뉴들은 매운맛을 적절히 중화시켜주며, 전체적인 식사의 균형을 맞춰준다. 내부는 활기찬 분위기로 친구나 동료들과 함께 방문하기에 적합하며, 자연스럽게 대화와 식사가 이어진다. 홍스쭈꾸미 홍대본점은 자극적이면서도 중독성 있는 맛을 찾는 이들에게 매력적인 선택지가 된다.",
        region: 'Mapo', matName: '홍스쭈꾸미 홍대본점', matTel: '',
        matAddr: '서울 마포구 서교동 331-21',
        images: [], sysdate: new Date()
      },
      {
        no: 35, userId: 'city4', cityName: 'Mapo',
        title: "감각적인 휴식 공간, 합정 그레이랩",
        subject: "합정동에 위치한 그레이랩은 커피와 함께 여유로운 시간을 보낼 수 있는 감각적인 카페다. 이곳은 세련된 인테리어와 차분한 분위기로 많은 이들의 발길을 끌고 있다. 공간은 단순하면서도 디테일이 살아 있어 자연스럽게 오래 머물고 싶어지는 환경을 제공한다. 커피는 기본에 충실한 맛을 지향하며, 부담 없이 즐길 수 있는 균형 잡힌 풍미를 갖추고 있다. 조용한 분위기 덕분에 혼자 시간을 보내기에도 좋고, 가벼운 대화를 나누기에도 적합하다. 특히 복잡한 홍대·합정 일대에서 잠시 벗어나 여유를 찾고 싶을 때 찾기 좋은 공간이다. 그레이랩은 단순한 카페를 넘어, 일상 속에서 잠시 숨을 고를 수 있는 장소로 자리하고 있다.",
        region: 'Mapo', matName: '그레이랩', matTel: '02-333-5694',
        matAddr: '서울 마포구 합정동 367-9',
        images: [], sysdate: new Date()
      },
      {
        no: 36, userId: 'city4', cityName: 'Mapo',
        title: "숯불 향이 살아있는 고기 한 점, 참나무본가 공덕점",
        subject: "공덕동에 위치한 참나무본가 공덕점은 숯불을 이용해 고기를 구워내는 방식으로 깊은 풍미를 끌어올리는 한식 고깃집이다. 이곳의 고기는 신선한 상태로 제공되며, 숯불 위에서 익어가면서 자연스럽게 불향이 더해진다. 과한 양념 없이도 고기 본연의 맛을 충분히 느낄 수 있으며, 씹을수록 육즙이 살아 있는 식감을 경험할 수 있다. 함께 제공되는 반찬들은 깔끔하게 구성되어 있어 식사의 균형을 맞춰주며, 전체적인 만족도를 높인다. 내부는 편안하고 활기찬 분위기로 구성되어 있어 친구나 동료들과 함께 방문하기에 적합하다. 참나무본가 공덕점은 기본에 충실한 방식으로 고기의 매력을 전달하는 공간으로, 꾸준히 찾게 되는 안정적인 식당이다.",
        region: 'Mapo', matName: '참나무본가 공덕점', matTel: '02-712-9997',
        matAddr: '서울 마포구 공덕동 256-42',
        images: [], sysdate: new Date()
      },
      {
        no: 37, userId: 'city4', cityName: 'Mapo',
        title: "기본에 충실한 중식 한 끼, 망원동 강동원",
        subject: "망원동에 자리한 강동원은 오랜 시간 한결같은 중식 메뉴로 지역 주민들의 사랑을 받아온 식당이다. 이곳은 화려한 연출보다는 기본적인 맛의 완성도에 집중해 안정적인 식사를 제공한다. 대표적인 중식 메뉴들은 익숙한 구성이지만, 조리 과정에서의 디테일을 통해 깊은 풍미를 만들어낸다. 과하게 기름지지 않으면서도 감칠맛을 살린 조리 방식은 부담 없이 즐길 수 있는 식사를 완성한다. 내부는 소박하고 정겨운 분위기를 유지하고 있어 편안하게 식사를 이어갈 수 있으며, 단골 손님들의 방문이 꾸준히 이어진다. 강동원은 특별한 날보다는 일상 속에서 자연스럽게 찾게 되는 식당으로, 안정적인 중식 한 끼를 원하는 이들에게 잘 어울린다.",
        region: 'Mapo', matName: '강동원', matTel: '02-335-0202',
        matAddr: '서울 마포구 망원동 453-43',
        images: [], sysdate: new Date()
      },
      {
        no: 38, userId: 'city4', cityName: 'Mapo',
        title: "품격 있는 갈비의 깊이, 봉피양 마포점",
        subject: "용강동에 위치한 봉피양 마포점은 고급스러운 분위기 속에서 갈비를 중심으로 한 한식을 즐길 수 있는 공간이다. 이곳의 갈비는 재료의 질과 조리 방식에서 차별화된 완성도를 보여준다. 적절하게 숙성된 고기는 부드러운 식감을 유지하면서도 깊은 풍미를 전달하며, 굽는 과정에서 자연스럽게 육즙이 살아난다. 과한 양념보다는 고기 자체의 맛을 강조하는 방식이 인상적이다. 함께 제공되는 반찬 역시 정갈하게 구성되어 식사의 균형을 맞춰준다. 내부는 깔끔하고 세련된 분위기로 구성되어 있어 중요한 식사 자리나 모임에도 적합하다. 봉피양 마포점은 고기의 본질적인 맛을 제대로 느끼고 싶은 이들에게 만족스러운 경험을 제공하는 식당이다.",
        region: 'Mapo', matName: '봉피양 마포점', matTel: '02-715-2292',
        matAddr: '서울 마포구 용강동 50-3',
        images: [], sysdate: new Date()
      },
      {
        no: 39, userId: 'city4', cityName: 'Mapo',
        title: "직접 구워 즐기는 고기의 매력, 신선화로 홍대점",
        subject: "",
        region: 'Mapo', matName: '신선화로 홍대점', matTel: '02-324-9858',
        matAddr: '서울 마포구 서교동 347-29',
        images: [], sysdate: new Date()
      },
      {
        no: 40, userId: 'city4', cityName: 'Mapo',
        title: "정겨운 한 상의 매력, 마포청학동부침개",
        subject: "",
        region: 'Mapo', matName: '마포청학동부침개', matTel: '02-706-0603',
        matAddr: '서울 마포구 공덕동 256-30',
        images: [], sysdate: new Date()
      },
      {
        no: 41, userId: 'city4', cityName: 'Mapo',
        title: "소박하지만 중독적인 한 접시, 마포원조떡볶이",
        subject: "",
        region: 'Mapo', matName: '마포원조떡볶이', matTel: '02-719-2005',
        matAddr: '서울 마포구 도화동 345-4',
        images: [], sysdate: new Date()
      },
      {
        no: 42, userId: 'city4', cityName: 'Mapo',
        title: "이국적인 풍미의 매력, 연남동 발리문",
        subject: "",
        region: 'Mapo', matName: '발리문', matTel: '070-7774-8282',
        matAddr: '서울 마포구 연남동 228-48',
        images: [], sysdate: new Date()
      },
      {
        no: 43, userId: 'city4', cityName: 'Mapo',
        title: "정갈한 해산물 한 상, 교동집",
        subject: "",
        region: 'Mapo', matName: '교동집', matTel: '02-337-3663',
        matAddr: '서울 마포구 동교동 153-8',
        images: [], sysdate: new Date()
      },
      {
        no: 44, userId: 'city4', cityName: 'Mapo',
        title: "고기의 본질을 살린 선택, 일편등심",
        subject: "",
        region: 'Mapo', matName: '일편등심', matTel: '02-6212-1092',
        matAddr: '서울 마포구 동교동 164-23',
        images: [], sysdate: new Date()
      },
      {
        no: 45, userId: 'city4', cityName: 'Mapo',
        title: "감각적인 양식의 균형, 서교동 어리",
        subject: "",
        region: 'Mapo', matName: '어리', matTel: '070-7543-3307',
        matAddr: '서울 마포구 서교동 332-1',
        images: [], sysdate: new Date()
      },
      {
        no: 61, userId: 'city5', cityName: 'Jung',
        title: "깊고 담백한 전통의 맛, 우래옥 본점",
        subject: "",
        region: 'Jung', matName: '우래옥 본점', matTel: '02-2265-0151',
        matAddr: '서울 중구 주교동 118-1',
        images: [], sysdate: new Date()
      },
      {
        no: 62, userId: 'city5', cityName: 'Jung',
        title: "담백함의 극치, 평양면옥 본점",
        subject: "",
        region: 'Jung', matName: '평양면옥 본점', matTel: '02-2267-7784',
        matAddr: '서울 중구 장충동1가 13',
        images: [], sysdate: new Date()
      },
      {
        no: 63, userId: 'city5', cityName: 'Jung',
        title: "세월이 만든 깊은 맛, 남포면옥",
        subject: "",
        region: 'Jung', matName: '남포면옥', matTel: '02-777-3131',
        matAddr: '서울 중구 다동 121-4',
        images: [], sysdate: new Date()
      },
      {
        no: 64, userId: 'city5', cityName: 'Jung',
        title: "담백한 닭요리의 정석, 닭진미",
        subject: "",
        region: 'Jung', matName: '닭진미', matTel: '02-753-9063',
        matAddr: '서울 중구 남창동 34-139',
        images: [], sysdate: new Date()
      },
      {
        no: 65, userId: 'city5', cityName: 'Jung',
        title: "깊은 국물의 힘, 진주회관",
        subject: "",
        region: 'Jung', matName: '진주회관', matTel: '02-753-5388',
        matAddr: '서울 중구 서소문동 120-35',
        images: [], sysdate: new Date()
      },
      {
        no: 66, userId: 'city5', cityName: 'Jung',
        title: "진한 국물의 위로, 약수순대국",
        subject: "",
        region: 'Jung', matName: '약수순대국', matTel: '02-2236-5926',
        matAddr: '서울 중구 신당동 857',
        images: [], sysdate: new Date()
      },
      {
        no: 67, userId: 'city5', cityName: 'Jung',
        title: "해장의 정석, 무교동북어국집",
        subject: "",
        region: 'Jung', matName: '무교동북어국집', matTel: '02-777-3891',
        matAddr: '서울 중구 다동 173',
        images: [], sysdate: new Date()
      },
      {
        no: 68, userId: 'city5', cityName: 'Jung',
        title: "정직한 갈비의 맛, 교대갈비집 시청점",
        subject: "",
        region: 'Jung', matName: '교대갈비집 시청점', matTel: '02-778-5582',
        matAddr: '서울 중구 북창동 20-1',
        images: [], sysdate: new Date()
      },
      {
        no: 69, userId: 'city5', cityName: 'Jung',
        title: "쫄깃한 면발의 매력, 오장동함흥냉면",
        subject: "",
        region: 'Jung', matName: '오장동함흥냉면', matTel: '02-2267-9500',
        matAddr: '서울 중구 오장동 90-10',
        images: [], sysdate: new Date()
      },
      {
        no: 70, userId: 'city5', cityName: 'Jung',
        title: "꾸준함이 만든 인기, 명동교자 본점",
        subject: "",
        region: 'Jung', matName: '명동교자 본점', matTel: '02-776-5348',
        matAddr: '서울 중구 명동2가 25-36',
        images: [], sysdate: new Date()
      },
      {
        no: 71, userId: 'city5', cityName: 'Jung',
        title: "자연 속 한식의 여유, 목멱산방",
        subject: "",
        region: 'Jung', matName: '목멱산방', matTel: '02-318-4790',
        matAddr: '서울 중구 남산동2가 25-4',
        images: [], sysdate: new Date()
      },
      {
        no: 72, userId: 'city5', cityName: 'Jung',
        title: "가볍게 즐기는 한잔, 브아브아",
        subject: "",
        region: 'Jung', matName: '브아브아', matTel: '070-7788-7773',
        matAddr: '서울 중구 필동2가 10',
        images: [], sysdate: new Date()
      },
      {
        no: 73, userId: 'city5', cityName: 'Jung',
        title: "정갈한 중식의 품격, 몽중헌 페럼타워점",
        subject: "",
        region: 'Jung', matName: '몽중헌 페럼타워점', matTel: '02-6353-8585',
        matAddr: '서울 중구 수하동 66',
        images: [], sysdate: new Date()
      },
      {
        no: 74, userId: 'city5', cityName: 'Jung',
        title: "담백한 국수 한 그릇, 명동칼국수",
        subject: "",
        region: 'Jung', matName: '명동칼국수', matTel: '02-737-3034',
        matAddr: '서울 중구 태평로1가 62-7',
        images: [], sysdate: new Date()
      },
      {
        no: 75, userId: 'city5', cityName: 'Jung',
        title: "전통 함흥냉면의 깊이, 오장동흥남집 본점",
        subject: "",
        region: 'Jung', matName: '오장동흥남집 본점', matTel: '02-2266-0735',
        matAddr: '서울 중구 오장동 101-7',
        images: [], sysdate: new Date()
      }
    ]);
    console.log('기사 데이터 입력 완료 (강남구 15개 / 마포구 15개 / 중구 15개)');

    // =============================================
    // 3. 북마크 더미데이터
    // =============================================
    await Bookmark.create([
      { userId: 'user01', articleNo: 1 },
      { userId: 'user01', articleNo: 5 },
      { userId: 'user02', articleNo: 3 },
      { userId: 'user02', articleNo: 61 },
      { userId: 'user03', articleNo: 31 }
    ]);
    console.log('북마크 데이터 입력 완료');

    // =============================================
    // 4. 리뷰 더미데이터
    // =============================================
    await Review.create([
      { userId: 'user01', aNo: 1, content: '족발 진짜 맛있었어요! 쫀득쫀득', rating: 5 },
      { userId: 'user02', aNo: 1, content: '보쌈도 같이 시켰는데 둘 다 만족', rating: 4 },
      { userId: 'user01', aNo: 31, content: '해장국 국물이 진하고 좋았습니다', rating: 4 },
      { userId: 'user03', aNo: 61, content: '냉면 육수가 정말 깊어요', rating: 5 },
      { userId: 'user02', aNo: 70, content: '명동교자 칼국수는 역시!', rating: 5 }
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
        userId: 'city4', title: '마포구 축제 현장 사진입니다', type: '이미지',
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
        userId: 'city1', title: '강남역 퇴근길 현황', type: '이미지',
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
    console.log('전체 데이터 입력 완료!');
    console.log('유저 9명 / 기사 45개 / 북마크 5개 / 리뷰 5개 / 등업신청 2개 / 자유게시판 10개');
    console.log('=============================');

    process.exit();
  })
  .catch((err) => {
    console.error('DB 연결 실패:', err);
    process.exit(1);
  });