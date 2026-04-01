import React, { useEffect, useRef, useState } from 'react';

const AboutUs = () => {

    const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
 
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Noto+Sans+KR:wght@300;400;500&display=swap');
 
        /* ── 색상 변수 ── */
        :root {
          --color-main: #ffffff;
          --color-sub: #1a1a1a;
          --color-point: #8a2130;
        }
 
        .about-section {
          display: grid;
          grid-template-columns: 180px 1fr;
          min-height: 500px;
          background-color: var(--color-main);
          font-family: 'Noto Sans KR', sans-serif;
          overflow: hidden;
        }
 
        /* 왼쪽 사이드바 */
        .about-sidebar {
          background-color: var(--color-sub);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 60px;
        }
 
        .about-label {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 13px;
          letter-spacing: 0.25em;
          color: var(--color-main);
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
          text-transform: uppercase;
        }
 
        /* 오른쪽 메인 콘텐츠 */
        .about-main {
          display: flex;
          flex-direction: column;
          padding: 60px 64px;
          gap: 48px;
        }
 
        /* 상단 히어로 텍스트 */
        .about-hero {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
 
        .about-hero.visible {
          opacity: 1;
          transform: translateY(0);
        }
 
        .about-hero-text {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 3vw, 35px);
          font-weight: 400;
          line-height: 1.55;
          color: var(--color-sub);
          max-width: 680px;
          margin: 0 0 24px 0;
        }
 
        .about-hero-text em {
          font-style: italic;
          color: var(--color-point);
        }
 
        .about-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: var(--color-sub);
          color: var(--color-main);
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 12px 24px;
          border: none;
          cursor: pointer;
          transition: background-color 0.25s ease, gap 0.25s ease;
          text-decoration: none;
        }
 
        .about-cta-btn:hover {
          background-color: var(--color-point);
          gap: 14px;
        }
 
        .about-cta-btn::after {
          content: '→';
          font-size: 14px;
        }
 
        /* 구분선 */
        .about-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, #8a2130, transparent);
          opacity: 0;
          transition: opacity 0.8s ease 0.3s;
        }
 
        .about-divider.visible {
          opacity: 1;
        }
 
        /* 하단 두 컬럼 */
        .about-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
 
        .about-col {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
 
        .about-col:nth-child(1) { transition-delay: 0.4s; }
        .about-col:nth-child(2) { transition-delay: 0.6s; }
 
        .about-col.visible {
          opacity: 1;
          transform: translateY(0);
        }
 
        .about-col-tag {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-point);
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
 
        .about-col-tag::before {
          content: '';
          display: inline-block;
          width: 20px;
          height: 1px;
          background-color: var(--color-point);
        }
 
        .about-col h3 {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          color: var(--color-sub);
          margin: 0 0 12px 0;
          line-height: 1.4;
        }
 
        .about-col p {
          font-size: 13px;
          line-height: 1.85;
          color: #666;
          margin: 0;
          word-break: keep-all;
        }
 
        /* 체험단 배너 */
        .about-blog-banner {
          background-color: var(--color-point);
          padding: 28px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease 0.7s, transform 0.7s ease 0.7s;
        }
 
        .about-blog-banner.visible {
          opacity: 1;
          transform: translateY(0);
        }
 
        .about-blog-banner-text h4 {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 400;
          color: var(--color-main);
          margin: 0 0 6px 0;
        }
 
        .about-blog-banner-text p {
          font-size: 12px;
          color: #999;
          margin: 0;
          letter-spacing: 0.05em;
        }
 
        .about-blog-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid var(--color-main);
          color: var(--color-main);
          font-family: 'Noto Sans KR', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 10px 20px;
          cursor: pointer;
          white-space: nowrap;
          transition: background-color 0.25s, color 0.25s;
          text-decoration: none;
        }
 
        .about-blog-btn:hover {
          background-color: var(--color-main);
          color: var(--color-point);
        }
 
        @media (max-width: 768px) {
          .about-section {
            grid-template-columns: 1fr;
          }
          .about-sidebar {
            padding: 24px 32px;
            writing-mode: horizontal-tb;
            flex-direction: row;
            justify-content: flex-start;
          }
          .about-label {
            writing-mode: horizontal-tb;
            transform: none;
          }
          .about-main {
            padding: 40px 24px;
          }
          .about-columns {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .about-blog-banner {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
 
      <section className="about-section" ref={sectionRef}>
        {/* 왼쪽 사이드바 */}
        <aside className="about-sidebar">
          <span className="about-label">About Us</span>
        </aside>
 
        {/* 오른쪽 메인 */}
        <div className="about-main">
 
          {/* 히어로 텍스트 */}
          <div className={`about-hero ${visible ? 'visible' : ''}`}>
            <p className="about-hero-text">
              맛집과 사람을 잇는 공간.<br />
              우리는 <em>진짜 경험</em>을 기록하고,<br />
              당신의 다음 한 끼를 더 특별하게 만듭니다.
            </p>
            <a href="./search" className="about-cta-btn">더 알아보기</a>
          </div>
 
          <div className={`about-divider ${visible ? 'visible' : ''}`} />
 
          {/* 두 컬럼 설명 */}
          <div className="about-columns">
            <div className={`about-col ${visible ? 'visible' : ''}`}>
              <div className="about-col-tag">Our Story</div>
              <h3>직접 발굴한<br />로컬 맛집 큐레이션</h3>
              <p>
                광고 없이, 경험으로만 골랐습니다.<br />
                지역 곳곳의 숨겨진 맛집부터
                검증된 단골집까지, 진심이 담긴
                리뷰를 모았습니다.
              </p>
            </div>
            <div className={`about-col ${visible ? 'visible' : ''}`}>
              <div className="about-col-tag">Our Mission</div>
              <h3>더 쉽고 즐거운<br />식사 경험을 위해</h3>
              <p>
                검색이 아닌 발견의 즐거움.<br />
                북마크, 리뷰, 지도 탐색을 통해
                식사 전 설렘부터 후기까지
                함께합니다.
              </p>
            </div>
          </div>
 
          {/* 블로그 체험단 배너 */}
          <div className={`about-blog-banner ${visible ? 'visible' : ''}`}>
            <div className="about-blog-banner-text">
              <h4>블로그 체험단을 모집합니다</h4>
              <p>맛집을 직접 방문하고, 경험을 나눠주세요. 선정된 분께 혜택을 드립니다.</p>
            </div>
            <a href="./city" className="about-blog-btn">블로그 글쓰기</a>

          </div>
 
        </div>
      </section>
      </>
    );
};

export default AboutUs;