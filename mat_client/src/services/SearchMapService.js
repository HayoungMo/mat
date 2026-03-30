


export const searchKeyword = async (keyword, callback) => {
    const ps = new window.kakao.maps.services.Places();

    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
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


