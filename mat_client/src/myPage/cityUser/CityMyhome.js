import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import articleService from '../../services/articleServices';
import CityAdd from '../../cityHome/CityAdd';
import axios from 'axios';
import './CityMyhome.css'
import CityMessage from '../../cityHome/CityMessage';

const CityMyhome = ({ loginUser, loginInfo, isEditingProfile, setIsEditingProfile }) => {

    const [articles, setArticles] = useState([])
    const [cityName, setCityName] = useState('')
    const [confirmModal, setConfirmModal] = useState({show: false, item:null})

    const navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5;

    const [isShow, setIsShow] = useState(false)

    // 자물쇠 상태 (비밀번호를 풀었는가?)
    const [isVerified, setIsVerified] = useState(false);

    // 글 추가,수정,삭제 상태를 알려주는 message창을 소환하기 위한 내용
    const [msg,setMsg] = useState('')
    const [isMsg,setIsMsg] = useState(false)

    const [profileForm, setProfileForm] = useState({
        currentPassword: '',
        newPassword: '',
        email: '',
        tel: '' 
    })

    // 정보수정 창이 닫히면 자물쇠도 다시 잠그기
    useEffect(() => {
        if (!isEditingProfile) {
            setIsVerified(false);
            setProfileForm(prev => ({ ...prev, currentPassword: '' }));
        }
    }, [isEditingProfile])

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`/api/profile/${loginUser}`)
                setProfileForm({
                    currentPassword: '', 
                    newPassword: '', 
                    email: res.data.email || '',
                    tel: res.data.tel || ''
                });
            } catch (error) {
                console.error('프로필 조회 실패:', error)
            }
        }

        const fetchData = async () => {
            const res = await fetch(`/api/upgrade`)
            const data = await res.json()
            const myRequest = data.find(item => item.userId === loginUser && item.status === 'approved')
            if (myRequest) setCityName(myRequest.cityName)

            const fetchedArticles = await articleService.getArticle()
            const myArticles = fetchedArticles.filter(item => item.userId === loginUser)
            setArticles(myArticles)
        }
        
        if (loginUser) {
            fetchProfile()
            fetchData()
        }
    }, [loginUser])

    const handleProfileChange = (evt)=>{
        const {name, value} = evt.target
        setProfileForm({
            ...profileForm,
            [name] : value
        })
    }

    // 자물쇠 푸는 함수
    const handleVerifyPassword = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/login', {
                userId: loginUser,
                password: profileForm.currentPassword
            });

            if (res.data.success) {
                setIsVerified(true); 
            } else {
                alert('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
            }
        } catch (error) {
            console.error('비밀번호 확인 실패:', error);
            alert('확인 중 오류가 발생했습니다.');
        }
    }

    // 최종 정보 업데이트 함수
    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        if (!window.confirm('회원정보를 수정하시겠습니까?')) return

        try {
            await axios.put('/api/profile', {
                id: loginInfo._id, 
                currentPassword: profileForm.currentPassword, 
                newPassword: profileForm.newPassword,         
                tel: profileForm.tel,
                email: profileForm.email
            })
            
            alert('회원정보가 성공적으로 업데이트 되었습니다!')
            setProfileForm(prev => ({ ...prev, currentPassword: '', newPassword: '' })) 
            
            setIsVerified(false); 
            setIsEditingProfile(false); 

        } catch (error) {
            console.error('정보 수정 실패:', error)
            alert('정보 수정 중 오류가 발생했습니다.')
        }
    }

    const onAdd = async (article, images) => {
        await articleService.addArticle(article, images)
        const res = await articleService.getArticle()
        setArticles(res.filter(item => item.userId === loginUser))
        setIsShow(false)

        //여기에 메세지 추가
        setMsg('글이 등록됐습니다.')
        setIsMsg(true)
    }

    const onDel = (item) => {
        setConfirmModal({show: true, item})
    }

    const handleConfirmDel = async()=>{
        await articleService.deleteArticle(confirmModal.item._id)
        setArticles(articles.filter(a=>a._id!==confirmModal.item._id))
        setConfirmModal({ show: false, item: null })
        setMsg('글이 삭제됐습니다.')
        setIsMsg(true)
    }
    const onEdit = (item) => {
        navigate(`/city/${item.cityName}/article/edit/${item._id}`)
    }

    const onView = (item) => {
        navigate(`/city/${item.cityName}/article/${item._id}`)
    }

    const indexOfLastItem = currentPage * itemsPerPage; 
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; 
    const currentArticles = articles.slice(indexOfFirstItem, indexOfLastItem); 
    const totalPages = Math.ceil(articles.length / itemsPerPage); 

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="myhome-container">
            
            {/* 회원정보 관리 영역 */}
            {isEditingProfile && (
                <div className="article-list-section" style={{ marginBottom: '40px', padding: '30px', backgroundColor: '#fcfcfc', border: '1px solid #eee', borderRadius: '8px' }}>
                    <h3 className="section-title" style={{ textAlign: 'center', marginBottom: '20px' }}>회원정보 관리</h3>
                    
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        
                        {!isVerified ? (
                            <form className="profile-edit-form" onSubmit={handleVerifyPassword} style={{ textAlign: 'center' }}>
                                {/* 🌟 주석을 태그 안쪽으로 이동! (조건 1: 아직 비밀번호를 안 풀었을 때) */}
                                <p style={{ color: '#666', marginBottom: '20px' }}>안전한 정보 수정을 위해 현재 비밀번호를 입력해 주세요.</p>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'center' }}>
                                    <input 
                                        type="password" 
                                        name="currentPassword" 
                                        value={profileForm.currentPassword} 
                                        onChange={handleProfileChange} 
                                        placeholder="현재 비밀번호 입력" 
                                        style={{ width: '250px', padding: '10px 15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', marginRight: '10px' }}
                                        required
                                    />
                                    <button type="submit" className="btn-submit" style={{ padding: '10px 20px', borderRadius: '4px', margin: 0 }}>확인</button>
                                </div>
                            </form>
                        ) : (
                            <form className="profile-edit-form" onSubmit={handleProfileSubmit}>
                                {/* 🌟 주석을 태그 안쪽으로 이동! (조건 2: 비밀번호를 풀었을 때 진짜 폼) */}
                                
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                    <label style={{ width: '100px', fontWeight: '600', color: '#333', textAlign: 'right', marginRight: '15px' }}>새 비밀번호</label>
                                    <input 
                                        type="password" 
                                        name="newPassword" 
                                        value={profileForm.newPassword} 
                                        onChange={handleProfileChange} 
                                        placeholder="변경을 원할 경우만 입력" 
                                        style={{ width: '300px', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                    <label style={{ width: '100px', fontWeight: '600', color: '#333', textAlign: 'right', marginRight: '15px' }}>연락처</label>
                                    <input 
                                        type="text" 
                                        name="tel" 
                                        value={profileForm.tel} 
                                        onChange={handleProfileChange} 
                                        placeholder="예: 010-1234-5678" 
                                        style={{ width: '300px', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                                    <label style={{ width: '100px', fontWeight: '600', color: '#333', textAlign: 'right', marginRight: '15px' }}>이메일</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={profileForm.email} 
                                        onChange={handleProfileChange} 
                                        placeholder="예: editor@matzine.com" 
                                        style={{ width: '300px', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <button type="submit" className="btn-submit" style={{ padding: '8px 40px', borderRadius: '4px' }}>정보 업데이트</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* 기사 작성 영역 */}
            {isShow &&(
            <CityAdd onAdd={onAdd} loginUser={loginUser} cityNameProp={cityName}/>
            )}

            {confirmModal.show && (
                <div style={{
                    position: 'fixed', inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        background: '#fff', borderRadius: '12px',
                        padding: '30px', textAlign: 'center',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)', minWidth: '280px'
                    }}>
                        <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
                            정말 삭제하시겠습니까?
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button className="btn-mini btn-del" onClick={handleConfirmDel}>삭제</button>
                            <button className="btn-mini btn-edit" onClick={() => setConfirmModal({ show: false, item: null })}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 내 글 목록 영역 */}
            <div className="article-list-section" style={{ marginTop: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 className="section-title" style={{ margin: 0 }}>내 글 목록</h3>
                    <button 
                        className="btn-submit" 
                        style={{ padding: '8px 16px', borderRadius: '4px', margin: 0 }}
                        onClick={() => setIsShow(!isShow)}
                    >
                        {isShow ? '글 숨기기' : '새 글 쓰기'}
                    </button>
                </div>
                <div className="table-container">
                    <div className="table-header">
                        <div className="col-title">기사 제목</div>
                        <div className="col-date">작성일</div>
                        <div className="col-action">관리</div>
                    </div>

                    {articles.length === 0 ? (
                        <div className="empty-state">작성한 기사가 없습니다.</div>
                    ) : (
                        <div className="table-body">
                            {currentArticles.map((item) => (
                                <div className="table-row" key={item._id}>
                                    <div className="col-title title-link" onClick={() => onView(item)}>
                                        {item.title}
                                    </div>
                                    <div className="col-date">
                                        {new Date(item.sysdate).toLocaleDateString()}
                                    </div>
                                    <div className="col-action">
                                        <button className="btn-mini btn-edit" onClick={() => onEdit(item)}>수정</button>
                                        <button className="btn-mini btn-del" onClick={() => onDel(item)}>삭제</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {isMsg && <CityMessage msg={msg} isShow={isMsg} setIsShow={setIsMsg}/>}
                
                {totalPages > 1 && (
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                            <button 
                                key={number} 
                                onClick={() => paginate(number)} 
                                className={`page-btn ${currentPage === number ? 'active' : ''}`}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CityMyhome;