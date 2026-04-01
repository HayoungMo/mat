import React, { useEffect, useState } from 'react';
import LevelupItem from './LevelupItem';
import upgradeServices from '../../services/upgradeServices';
import { AiOutlineCar } from "react-icons/ai";

const LevelupList = () => {
    const [list, setList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await upgradeServices.getUpgrade();
            const pending = res.filter(item => item.status === 'pending');
            setList(pending);
        };
        fetchData();
    }, []);

    return (
        <div className="admin-list-container">
            {list.length === 0 ? (
                <div className="admin-empty-state">
                    <AiOutlineCar size={40} />
                    <p>현재 대기 중인 등업 신청 데이터가 없습니다.</p>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    {/* 🌟 표 형식의 헤더 (글머리 역할) */}
                    <div className="admin-table-header">
                        <span className="col-id">아이디</span>
                        <span className="col-city">지역</span>
                        <span className="col-date">신청일</span>
                        <span className="col-reason">신청 사유</span>
                        <span className="col-action">관리</span>
                    </div>
                    {/* 리스트 본문 */}
                    <ul className="admin-list-body">
                        {list.map((item, index) => (
                            <li key={index} className="admin-list-item">
                                <LevelupItem item={item} setList={setList} list={list} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LevelupList;