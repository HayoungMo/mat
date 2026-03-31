


export const searchKeyword = (keyword, callback) => {
    //체크를 먼저
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
        alert("지도가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
        window.kakao.maps.load(() => {
            const ps = new window.kakao.maps.services.Places();
            ps.keywordSearch(keyword, (data, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    callback(data, status);
                } else {
                    callback(data, status);
                }
            });
        });
        return;
    }
    //places() 생성을 체크보다 먼저하고 있어서 오류가 난다. 순서를 바꿔야한다.
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
            callback(data, status); // ✅ 결과를 밖으로 전달
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
            callback(data, status);
            // alert("검색 결과가 존재하지 않습니다.");
        } else if (status === window.kakao.maps.services.Status.ERROR) {
            callback(data, status);
            // alert("검색 결과 중 오류가 발생했습니다.");
        }
    });
};


