import { useEffect, useState } from 'react';
import axios from 'axios'; 
import MapPage from '../map/MapPage';
import { Link } from 'react-router-dom';

function MainPage() {
  // 백엔드에서 받아올 데이터를 저장할 공간입니다.
  const [serverData, setServerData] = useState('데이터를 불러오는 중입니다...');
  

  useEffect(() => {
    // 3000번 화면이 켜지자마자 4000번 서버의 /api/mat 주소로 요청을 보냅니다.
    axios.get('/api/mat')
      .then((response) => {
        // 백엔드가 보내준 {"message": "MAT 라우터가 정상 작동합니다."} 에서 message만 뽑아냅니다.
        setServerData(response.data.message); 
      })
      .catch((error) => {
        console.log('백엔드 연결 에러:', error);
        setServerData('서버와 연결할 수 없습니다. 4000번 서버가 켜져 있는지 확인하세요.');
      });
  }, []);

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>종합 맛집 정보 시스템 - 메인 페이지 (3000 포트)</h1>
      <hr />
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h3>📡 백엔드(4000 포트) 연결 테스트 결과:</h3>
        {/* 아래에 파란색 글씨로 백엔드의 메시지가 떠야 성공입니다. */}
        <p style={{ color: 'blue', fontSize: '20px', fontWeight: 'bold' }}>
          {serverData}
        </p>
        
        <Link to="/map"><button>지도</button></Link>
      </div>
    </div>
  );
}

export default MainPage;