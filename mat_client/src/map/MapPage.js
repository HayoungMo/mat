import React, { useEffect, useState, useRef } from 'react';
import { toggleBookmark, getBookmarks } from '../services/bookmarkService'; // ← 추가

const MapPage = ({setAddress}) => {

    const [keyword, setKeyword] = useState('');
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [markedIds, setMarkedIds] = useState({});

    const mapRef = useRef(null);          // 지도를 담을 div 참조
    const mapInstance = useRef(null);     // 생성된 카카오맵 객체 참조
    const markersRef = useRef([]);        // 마커들을 담을 배열
    const infowindowRef = useRef(null);   // 인포윈도우 객체 참조

    const userId = "user1";


    // 1. 지도 초기화 (최초 1회 실행)
    useEffect(() => {
        window.kakao.maps.load(async () => {
            const container = mapRef.current;
            const options = {
                center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 기본 위치 (서울시청)
                level: 3,
            };
            mapInstance.current = new window.kakao.maps.Map(container, options);
            infowindowRef.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });

            try {
            //북마크 불러오기
            const bookmarks = await getBookmarks(userId);
            

            //kakaoid들을 markedIds state에 반ㅇ영
            const savedMarks = {};
            bookmarks.forEach(b=> {savedMarks[b.kakaoId]=true;});
            setMarkedIds(savedMarks);

            displayBookmarkMarkers(bookmarks);
        } catch (err) {
            console.error('북마크 로드 실패:' , err);
        }
        });
        
    }, []);

    //추가 북마크 마커 지도에 표시
    const displayBookmarkMarkers = (bookmarks) => {
        bookmarks.forEach((b,i)=>{
            const position = new window.kakao.maps.LatLng(b.lat, b.lng);
            const marker = addMarker(position, i);
            window.kakao.maps.event.addListener(marker, "click", () => {
                displayInfowindow(marker, b.matName, b.matTel, b.matAddr);
            })
        })
    }

    const handleBookmarkToggle = async(place) => {
        try {
        const data = await toggleBookmark(userId, place); // ← fetch 대신
        setMarkedIds(prev => ({
            ...prev,
            [place.id]: data.bookmarked
            }));
        } catch (err) {
            console.error('북마크 저장 실패', err);
        }
    }

    // 2. 마커 제거 함수
    const removeMarker = () => {
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];
    };

    // 3. 마커 하나 추가하는 함수
    const addMarker = (position, idx) => {
        const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";
        const imageSize = new window.kakao.maps.Size(36, 37);
        const imgOptions = {
            spriteSize: new window.kakao.maps.Size(36, 691),
            spriteOrigin: new window.kakao.maps.Point(0, idx * 46 + 10),
            offset: new window.kakao.maps.Point(13, 37),
        };

        const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
        const marker = new window.kakao.maps.Marker({
            position: position,
            image: markerImage,
        });

        marker.setMap(mapInstance.current);
        markersRef.current.push(marker);
        return marker;
    };

    // 4. 인포윈도우 표시 함수
    const displayInfowindow = (marker, title, tel, addr) => {
        const content = `<div style="padding:5px;z-index:1; width:300px">${title}
            <div style="font-size:12px; color:#666; margin-top:4px;">${addr}</div>
            <div style="font-size:12px; color:#007bff;">${tel ? tel : '전화번호 없음'}</div>
        </div>`;
        infowindowRef.current.setContent(content);
        infowindowRef.current.open(mapInstance.current, marker);
    };

    // 5. 검색 결과 콜백 함수
    const placesSearchCB = (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
            displayPlaces(data);
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
            alert("검색 결과가 존재하지 않습니다.");
        } else if (status === window.kakao.maps.services.Status.ERROR) {
            alert("검색 결과 중 오류가 발생했습니다.");
        }
    };

    // 6. 검색 실행 함수
    const searchPlaces = (e) => {
        if (e) e.preventDefault();
        if (!keyword.trim()) {
            alert('키워드를 입력해주세요!');
            return;
        }
        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(keyword, placesSearchCB);
    };

    // 7. 지도에 장소들 뿌려주는 핵심 함수
    const displayPlaces = (places) => {
        removeMarker();
        const bounds = new window.kakao.maps.LatLngBounds();

        for (let i = 0; i < places.length; i++) {
            const placePosition = new window.kakao.maps.LatLng(places[i].y, places[i].x);
            const marker = addMarker(placePosition, i);

            // 마커 클릭 시 부모 데이터 업데이트 및 지도 이동
            window.kakao.maps.event.addListener(marker, "click", () => {
                if (setAddress) setAddress(places[i]); // props로 받은 함수 호출
                displayInfowindow(marker, 
                    places[i].place_name,
                    places[i].phone,
                    places[i].address_name
                );
                mapInstance.current.panTo(placePosition);
            });

            // 마우스 오버/아웃 이벤트
            window.kakao.maps.event.addListener(marker, "mouseover", () => displayInfowindow(marker, places[i].place_name,
            places[i].phone,
            places[i].address_name));
            window.kakao.maps.event.addListener(marker, "mouseout", () => infowindowRef.current.close());

            bounds.extend(placePosition);
        }
        
        // 검색된 모든 마커가 보이도록 지도 범위 조정
        mapInstance.current.setBounds(bounds);
        setFilteredPlaces(places); // 리스트 UI 업데이트용
    };


    
   return (
            <div className="map_wrap" style={{ 
            position: 'relative', // 기준점 설정
            width: '100%', 
            height: '1000px' 
        }}>
            {/* 1. 지도 영역 (배경처럼 깔림) */}
            <div ref={mapRef} style={{ 
                width: '100%', 
                height: '100%', 
                position: 'absolute', // 지도를 부모 크기에 꽉 채움
                top: 0, 
                left: 0 
            }}></div>

            {/* 2. 검색창 UI (지도 위에 둥둥 떠 있음) */}
            <div id="menu_wrap" style={{
                position: 'absolute', // 부모 내부에서 위치 고정
                top: '10px',          // 위에서 10px
                left: '10px',         // 왼쪽에서 10px (여기서 결정됨!)
                width: '300px',       // 너비 조절
                maxHeight: '480px',   // 지도 높이를 넘지 않게 조절
                overflowY: 'auto', 
                background: 'rgba(255, 255, 255, 0.9)', // 살짝 투명한 흰색
                padding: '15px',
                borderRadius: '10px',
                border: '1px solid #ddd',
                zIndex: 10,           // 지도보다 무조건 위로!
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)' // 그림자를 주면 더 입체적임
            }}>
                <div className="option">
                    <form onSubmit={searchPlaces}>
                        키워드 : 
                        <input 
                            type="text" 
                            value={keyword} 
                            onChange={(e) => setKeyword(e.target.value)} 
                            size="15" 
                        /> 
                        <button type="submit">검색하기</button> 
                    </form>
                </div>
                <hr />
                <ul id="placesList">
                    {filteredPlaces.map((place, index) => {
                    // 해당 장소의 ID가 객체 안에 true로 있는지 확인
                    const isThisOn = !!markedIds[place.id];

                    return (
                        <li key={place.id || index} style={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
                            {/* 정보 영역 */}
                            <div className="info" style={{ flex: 1 }} onClick={() => {const moveLatLon = new window.kakao.maps.LatLng(place.y, place.x);
                                mapInstance.current.panTo(moveLatLon);
                                displayInfowindow(markersRef.current[index], place.place_name);}}>
                                <strong>{place.place_name}</strong>
                                <div>{place.address_name}</div>
                            </div>

                            {/* 북마크 버튼 */}
                            <div 
                                className={isThisOn ? "on" : "off"} 
                                onClick={(e) => {
                                    e.stopPropagation(); // 지도 이동 방지
                                    // 토글 로직: 기존 객체를 복사하고 현재 ID 값만 반전
                                    handleBookmarkToggle(place);
                                }}
                                style={{
                                    height: '35px',
                                    width: '35px',      // 너비 고정으로 원형/정사각형 유지
                                    marginLeft: '10px',
                                    display: 'flex',    // 별 중앙 정렬을 위해 flex 사용
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '5px',
                                    border:'none',
                                    cursor: 'pointer',
                                    fontSize: '20px',   // 별 크기 크게 고정
                                    transition: 'all 0.2s'
                                }}
                            >
                                {/* 별 크기 차이를 없애기 위해 같은 폰트 사이즈 적용 */}
                                <span style={{ color: isThisOn ? '#ffc107' : '#ccc' }}>
                                    {isThisOn ? "★" : "☆"}
                                </span>
                            </div>
                        </li>
                    );
                })}
                </ul>
            </div>
        </div>
    );
};

export default MapPage;