import React from 'react';
import CityMyhome from './CityMyhome';
import LevelupPending from './LevelupPending';
import LevelupRejected from './LevelupRejected';
import LevelupStart from './LevelupStart';

const state = ''

//등업 관련 화면을 모조리 보여주는 곳.
const CityUser = () => {
    return (
        <div>
            <h1>등업 페이지</h1>
            {state === 'approved' ? <CityMyhome/> 
                : 
                <div>
                {state === '' && <LevelupStart/>}
                {state === 'pending' && <LevelupPending/>}
                {state === 'rejected' && <LevelupRejected/>}
                </div>
            }
        </div>
    );
};

export default CityUser;