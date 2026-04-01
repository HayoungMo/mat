import React, { useEffect, useState, useRef } from 'react';
import { toggleBookmark, getBookmarks } from '../services/bookmarkService'; // ← 추가
import { useNavigate } from 'react-router-dom';
import {searchKeyword} from '../services/SearchMapService.js';
import Search from './Search.js';
import './Map.css';


const MapPage = ({setAddress, setList, externalKeyword, loginUser, selectedPlace,
    showSearch = true}) => {

    

    const [keyword, setKeyword] = useState('');
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [markedIds, setMarkedIds] = useState({});

    const mapRef = useRef(null);          // 지도를 담을 div 참조
    const mapInstance = useRef(null);     // 생성된 카카오맵 객체 참조
    const markersRef = useRef([]);        // 마커들을 담을 배열
    const infowindowRef = useRef(null);   // 인포윈도우 객체 참조
    const [mapReady, setMapReady] = useState(false);
    const loginPath = "/login";

    
    const navigate = useNavigate();
    // 1. 지도 초기화 (최초 1회 실행)
    useEffect(() => {

        removeMarker();
        

       console.log(selectedPlace);
        
        if(!window.kakao || !window.kakao.maps) {
            console.error("카카오 sdk 로드 안됨");
            return;
        }

        window.kakao.maps.load(async () => {
            if(!mapRef.current) return;
            const container = mapRef.current;

             removeMarker();
           
            const options = {
                center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 기본 위치 (서울시청)
                level: 8,
            };

            const bounds = new window.kakao.maps.LatLngBounds(
                new window.kakao.maps.LatLng(37.413294, 126.734086), // 서울 남서쪽 끝
                new window.kakao.maps.LatLng(37.715133, 127.269311)  // 서울 북동쪽 끝
            );

            mapInstance.current = new window.kakao.maps.Map(container, options);
            setMapReady(true);

            mapInstance.current.setMinLevel(6);  // 너무 확대 못하게
            mapInstance.current.setMaxLevel(9);

            window.kakao.maps.event.addListener(mapInstance.current, 'dragend', () => {
        const center = mapInstance.current.getCenter();
                if (!bounds.contain(center)) {
                    mapInstance.current.panTo(new window.kakao.maps.LatLng(37.566826, 126.9786567));
                }
            });

            
            infowindowRef.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });

            
                
            

            try {
            //북마크 불러오기
            const bookmarks = await getBookmarks(loginUser);
            

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

    

    useEffect(() => {
        if (!selectedPlace || !mapInstance.current) return;
        console.log("key", keyword);
        console.log("selectedPlace:", selectedPlace); // 👈
        console.log("mapInstance:", mapInstance.current); // 👈
        console.log("mapReady:", mapReady); // 👈

     

        // 1. 기존 마커 제거
        removeMarker();

        const position = new window.kakao.maps.LatLng(selectedPlace.lat, selectedPlace.lng);

        mapInstance.current.relayout();
        mapInstance.current.setLevel(9); // 작은 맵에서도 보이게 적당히 확대
        mapInstance.current.panTo(position);

        // 2. 선택된 위치로 이동
        const offsetPosition = new window.kakao.maps.LatLng(
            selectedPlace.lat - 0.15, // 살짝 아래로 중심 이동
            selectedPlace.lng
        );
        
        mapInstance.current.panTo(offsetPosition);

        // 3. 마커 추가
        const marker = addMarker(position, 0);

        // 4. 인포윈도우 표시
        displayInfowindow(marker, selectedPlace.matName, selectedPlace.matTel, selectedPlace.matAddr);

    }, [selectedPlace, mapReady]); // 👈 mapReady도 의존성에 추가

    const SEOUL_GU = [
        "강남구","강동구","강북구","강서구","관악구","광진구","구로구",
        "금천구","노원구","도봉구","동대문구","동작구","마포구","서대문구",
        "서초구","성동구","성북구","송파구","양천구","영등포구","용산구",
        "은평구","종로구","중구","중랑구"
    ];
    const isSeoul = keyword.includes("서울") || 
        SEOUL_GU.some(gu => keyword.includes(gu));

   
    const searchPlaces = (e) => {
        e.preventDefault();
        if (!keyword.trim() || !mapReady) return;

        if (!isSeoul) {
            alert("검색을 정확히 해야합니다(ex 종로구 맛집)");
            return;
        }
        
        searchKeyword(keyword, (data, status) => {
            placesSearchCB(data, status);
        });
    };
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

        
        console.log("userId:", loginUser);
        console.log("place 객체:", place);  // ← 이게 뭐가 찍히나요?
        console.log("place.id:", place?.id);
        console.log("place.y:", place?.y);
        console.log("place.x:", place?.x);
        try {
        const data = await toggleBookmark(loginUser, place); // ← fetch 대신
        console.log("결과:", data);
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
        //status검색 확인용
        console.log("status:", status);
        console.log("data:", data);
        if (status === window.kakao.maps.services.Status.OK) {
            displayPlaces(data);
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
            alert("검색 결과가 존재하지 않습니다.");
        } else if (status === window.kakao.maps.services.Status.ERROR) {
            alert("검색 결과 중 오류가 발생했습니다.");
        }
    };



    // 7. 지도에 장소들 뿌려주는 핵심 함수
    const displayPlaces = (places) => {
        removeMarker();
        const bounds = new window.kakao.maps.LatLngBounds();

         const SEOUL_BOUNDS = {
            minLat: 37.413294,
            maxLat: 37.715133,
            minLng: 126.734086,
            maxLng: 127.269311,
        };

        for (let i = 0; i < places.length; i++) {
            const lat = parseFloat(places[i].y);
            const lng = parseFloat(places[i].x);

             if (
                lat < SEOUL_BOUNDS.minLat || lat > SEOUL_BOUNDS.maxLat ||
                lng < SEOUL_BOUNDS.minLng || lng > SEOUL_BOUNDS.maxLng
            ) continue;
            
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

        if(setList) {
            setList(places);
        }
        
        // 검색된 모든 마커가 보이도록 지도 범위 조정
        mapInstance.current.setBounds(bounds);
        setFilteredPlaces(places); // 리스트 UI 업데이트용
    };


    useEffect(() => {
    if (!mapRef.current || !mapInstance.current) return;

        const observer = new ResizeObserver(() => {
            mapInstance.current.relayout();
        });

        observer.observe(mapRef.current);
        return () => observer.disconnect();
    }, [mapReady]);
    const prevKeywordRef = useRef('');
    // 외부에서 키워드 받았을 때 자동 검색
    useEffect(() => {
    if (!externalKeyword || !mapReady) return;
    if (prevKeywordRef.current === externalKeyword) return;
        setKeyword(externalKeyword);       // input에도 반영

        const seoulCenter = new window.kakao.maps.LatLng(37.566826, 126.9786567);
        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(externalKeyword, placesSearchCB,{
            location: seoulCenter,
            radius: 20000,
            sort: window.kakao.maps.services.SortBy.DISTANCE
        });

    }, [externalKeyword, mapReady]);


    
   return (
        <div className="map_wrap">

            
            {showSearch && (
            <div id="menu_wrap">
                
                <div className="option">
                    
                    <Search keyword={keyword} setKeyword={setKeyword} onSearch={searchPlaces} />
                    
                </div>
                
                <hr />
                <ul id="placesList">
                    {filteredPlaces.map((place, index) => {
                    // 해당 장소의 ID가 객체 안에 true로 있는지 확인
                    const isThisOn = !!markedIds[place.id];

                    return (
                        <li key={place.id || index} >
                            {/* 정보 영역 */}
                            <div className="info"  onClick={() => {const moveLatLon = new window.kakao.maps.LatLng(place.y, place.x);
                                mapInstance.current.panTo(moveLatLon);
                                displayInfowindow(markersRef.current[index], place.place_name, place.phone, place.address_name);}}>
                                <strong>{place.place_name}</strong>
                                <div>{place.address_name}</div>
                                <div>{place.phone}</div>
                            </div>

                            {/* 북마크 버튼 */}
                            <div 
                                className={isThisOn ? "on" : "off"} 
                                onClick={(e) => {

                                    

                                    if(loginUser === null){
                                        alert("로그인이 필요한 서비스 입니다.");
                                        
                                        navigate(loginPath, { replace: true});
                                        return;
                                    } 
                                    e.stopPropagation(); // 지도 이동 방지
                                    // 토글 로직: 기존 객체를 복사하고 현재 ID 값만 반전
                                    handleBookmarkToggle(place);
                                    
                                }}
                                // 임시 css
                                
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
            )}
            {/* 1. 지도 영역 (배경처럼 깔림) */}
                <div ref={mapRef}   style={{width:"100%", height:"1000px", display:"flex"}}>

                </div>
        </div>
    );
};

export default MapPage;