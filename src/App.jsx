import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import busanPaths from './busanPaths.json'
import './App.css'

const STATUS_COLORS = {
  red: '#ef4444',
  yellow: '#f59e0b',
  green: '#22c55e',
}

const LABEL_ADJUST = {
  'busanjin-gu': { dx: 0, dy: 6, size: 9.5 },
  'dong-gu': { dx: -3, dy: 6, size: 8 },
  'seo-gu': { dx: -4, dy: -8, size: 8.2 },
  'jung-gu': { dx: 0, dy: -1, size: 9 },
  'nam-gu': { dx: 6, dy: 9, size: 9.5 },
  'yeonje-gu': { dx: 0, dy: -6, size: 8.5 },
  'suyeong-gu': { dx: 9, dy: 3, size: 9.5 },
  'dongnae-gu': { dx: -2, dy: -2, size: 9.5 },
  'haeundae-gu': { dx: -16, dy: -6, size: 10 },
  'saha-gu': { dx: 0, dy: 6, size: 9.5 },
  'sasang-gu': { dx: -2, dy: 5, size: 8.5 },
  'yeongdo-gu': { dx: 2, dy: 4, size: 8.5 },
  'gijang-gun': { dx: 6, dy: 0, size: 11 },
}

const DISTRICT_INFO = {
  'jung-gu': { summary: '???????', population: '76K', focus: '??? ?????', status: 'red' },
  'seo-gu': { summary: '?????', population: '104K', focus: '?? ?????', status: 'yellow' },
  'dong-gu': { summary: '??????', population: '87K', focus: '?????? ??', status: 'green' },
  'yeongdo-gu': { summary: '?? ???', population: '115K', focus: '?? ????? ??', status: 'green' },
  'busanjin-gu': { summary: '?? ??', population: '347K', focus: '????? ??', status: 'yellow' },
  'dongnae-gu': { summary: '??????', population: '276K', focus: '????? ?? ??', status: 'green' },
  'nam-gu': { summary: '?????', population: '261K', focus: '?? ??????', status: 'yellow' },
  'buk-gu': { summary: '?????', population: '296K', focus: '????? ??', status: 'green' },
  'haeundae-gu': { summary: '??????', population: '422K', focus: '????? ??', status: 'red' },
  'saha-gu': { summary: '?????', population: '310K', focus: '????? ??', status: 'green' },
  'geumjeong-gu': { summary: '???????', population: '235K', focus: '????? ??', status: 'yellow' },
  'gangseo-gu': { summary: '?????', population: '199K', focus: '?????? ??', status: 'green' },
  'yeonje-gu': { summary: '?????', population: '210K', focus: '????? ??', status: 'yellow' },
  'suyeong-gu': { summary: '?????', population: '180K', focus: '?? ?????', status: 'green' },
  'sasang-gu': { summary: '?????', population: '222K', focus: '????? ??', status: 'yellow' },
  'gijang-gun': { summary: '?????', population: '170K', focus: '??? ?????', status: 'green' },
}

const INITIAL_DISTRICTS = busanPaths.map((g) => ({
  id: g.id,
  name: g.name,
  ...DISTRICT_INFO[g.id],
}))

const PETITIONS = [
  { id: 1, title: '?? ?? ?? ?? ??', status: 'open', signatures: 1872, due: 'D-5', tag: '??' },
  { id: 2, title: '??????? ??? ?? ??', status: 'review', signatures: 942, due: 'D-13', tag: '??' },
  { id: 3, title: '?? ???? ??', status: 'done', signatures: 3020, due: '??', tag: '???' },
  { id: 4, title: '???? ??', status: 'open', signatures: 621, due: 'D-9', tag: '??' },
]

const CHECKLIST_QUESTIONS = [
  {
    id: 'priority',
    question: '?? ???? ?? ???? ??? ???? ??? ??????',
    options: ['???? ??', '??? ??', '?? ??', '??/??'],
  },
  {
    id: 'mobility',
    question: '?? ? ?? ???? ?? ??? ???.',
    options: ['??? ?? ??', '?? ?? ??', '??/??? ??', '?? ?? ??'],
  },
  {
    id: 'digital',
    question: '??? ?? ????? ??? ????? ?? ????',
    options: ['?? ?? ??', '??? UX', '??/?? ??', 'AI ?? ???'],
  },
]

const INITIAL_CHAT = [
  { role: 'assistant', text: '?????! ?? ????? ??, ?????, ??? ? ?? ? ? ???.' },
]

function App() {
  const shapes = useMemo(
    () =>
      busanPaths.map((s) => ({
        ...s,
        bbox: getBBoxFromPath(s.path),
      })),
    []
  )

  const [districts, setDistricts] = useState(INITIAL_DISTRICTS)
  const [selectedDistrictId, setSelectedDistrictId] = useState(INITIAL_DISTRICTS[0].id)
  const [hoveredDistrictId, setHoveredDistrictId] = useState(null)
  const [isDistrictLocked, setIsDistrictLocked] = useState(false)
  const [checklist, setChecklist] = useState({})
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT)
  const [chatInput, setChatInput] = useState('')
  const [savedAccount, setSavedAccount] = useState(() => readStoredAccount())
  const [authUser, setAuthUser] = useState(() => readStoredSession())
  const [authMessage, setAuthMessage] = useState('')
  const [theme, setTheme] = useState(() => readStoredTheme())

  const activeDistrictId = isDistrictLocked ? selectedDistrictId : hoveredDistrictId ?? selectedDistrictId

  const activeDistrict = useMemo(
    () => districts.find((d) => d.id === activeDistrictId) ?? districts[0],
    [activeDistrictId, districts]
  )

  const answeredCount = useMemo(
    () => Object.values(checklist).filter((answers) => answers?.length).length,
    [checklist]
  )

  const petitionStats = useMemo(() => {
    const total = PETITIONS.length
    const open = PETITIONS.filter((p) => p.status === 'open').length
    const completed = PETITIONS.filter((p) => p.status === 'done').length
    return { total, open, completed }
  }, [])

  const setDistrictStatus = (id, status) => {
    setDistricts((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)))
  }

  const handleDistrictSelect = (id) => {
    setSelectedDistrictId(id)
    setHoveredDistrictId(null)
    setIsDistrictLocked(true)
  }

  const handleDistrictHover = (id) => {
    if (isDistrictLocked) return
    setHoveredDistrictId(id)
  }

  const handleDistrictLeave = () => {
    if (isDistrictLocked) return
    setHoveredDistrictId(null)
  }

  const unlockDistrict = () => {
    setIsDistrictLocked(false)
    setHoveredDistrictId(null)
  }

  const toggleChecklist = (questionId, option) => {
    setChecklist((prev) => {
      const current = prev[questionId] || []
      const exists = current.includes(option)
      const next = exists ? current.filter((o) => o !== option) : [...current, option]
      return { ...prev, [questionId]: next }
    })
  }

  const sendChat = () => {
    if (!chatInput.trim()) return
    const userText = chatInput.trim()
    const nextMessages = [...chatMessages, { role: 'user', text: userText }]
    const hint = activeDistrict ? `${activeDistrict.name} (${activeDistrict.summary})` : '부산시'
    const reply = `${hint} 기준으로 최신 현황과 체크리스트/게시판/챗봇 정보를 모아드릴게요.`
    setChatMessages([...nextMessages, { role: 'assistant', text: reply }])
    setChatInput('')
  }

  const handleSignup = ({ name, email, password }) => {
    if (!name || !email || !password) {
      setAuthMessage('모든 값을 입력해 주세요.')
      return
    }
    const account = { name, email, password }
    setSavedAccount(account)
    setAuthUser({ name, email })
    setAuthMessage('회원가입 완료! 자동으로 로그인되었습니다.')
  }

  const handleLogin = ({ email, password }) => {
    if (!savedAccount) {
      setAuthMessage('먼저 회원가입을 진행해 주세요.')
      return
    }
    if (savedAccount.email !== email || savedAccount.password !== password) {
      setAuthMessage('이메일 또는 비밀번호가 일치하지 않습니다.')
      return
    }
    setAuthUser({ name: savedAccount.name, email })
    setAuthMessage('로그인되었습니다.')
  }

  const handleLogout = () => {
    setAuthUser(null)
    setAuthMessage('로그아웃되었습니다.')
  }

  useEffect(() => {
    persistAccount(savedAccount)
  }, [savedAccount])

  useEffect(() => {
    persistSession(authUser)
  }, [authUser])

  useEffect(() => {
    persistTheme(theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <div className={`app-shell theme-${theme}`}>
      <TopNav user={authUser} onLogout={handleLogout} theme={theme} onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />
      <Routes>
        <Route
          path="/"
          element={
            <DashboardPage
              shapes={shapes}
              districts={districts}
              activeDistrict={activeDistrict}
              activeDistrictId={activeDistrictId}
              setDistrictStatus={setDistrictStatus}
              onSelectDistrict={handleDistrictSelect}
              onHoverDistrict={handleDistrictHover}
              onLeaveDistrict={handleDistrictLeave}
              isDistrictLocked={isDistrictLocked}
              unlockDistrict={unlockDistrict}
              petitionStats={petitionStats}
            />
          }
        />
        <Route path="/board" element={<BoardPage petitionStats={petitionStats} />} />
        <Route
          path="/checklist"
          element={
            <ChecklistPage
              checklist={checklist}
              toggleChecklist={toggleChecklist}
              answeredCount={answeredCount}
            />
          }
        />
        <Route
          path="/chat"
          element={
            <ChatPage chatMessages={chatMessages} chatInput={chatInput} setChatInput={setChatInput} sendChat={sendChat} />
          }
        />
        <Route
          path="/auth"
          element={
            <AuthPage
              user={authUser}
              onLogin={handleLogin}
              onSignup={handleSignup}
              onLogout={handleLogout}
              message={authMessage}
            />
          }
        />
        <Route path="/mypage" element={<MyPage user={authUser} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

function TopNav({ user, onLogout, theme, onToggleTheme }) {
  return (
    <nav className="top-nav">
      <Link to="/" className="brand">
        Busan Civic
      </Link>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
          대시보드
        </NavLink>
        <NavLink to="/board" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          게시판
        </NavLink>
        <NavLink to="/checklist" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          체크리스트
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          챗봇
        </NavLink>
        <NavLink to="/mypage" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          마이페이지
        </NavLink>
      </div>
      <div className="nav-actions">
        <button className="ghost sm" onClick={onToggleTheme} aria-label="theme-toggle">
          {theme === 'dark' ? '라이트' : '다크'} 모드
        </button>
        {user ? (
          <>
            <span className="pill subtle">어서오세요, {user.name}</span>
            <button className="ghost sm" onClick={onLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <Link className="primary sm" to="/auth">
            로그인 / 회원가입
          </Link>
        )}
      </div>
    </nav>
  )
}

function DashboardPage({
  shapes,
  districts,
  activeDistrict,
  activeDistrictId,
  setDistrictStatus,
  onSelectDistrict,
  onHoverDistrict,
  onLeaveDistrict,
  isDistrictLocked,
  unlockDistrict,
}) {
  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">부산 통합 거버넌스 보드</p>
          <h1>구별 현황, 시민 제안, 체크리스트, 챗봇까지 한 번에</h1>
          <p className="lede">
            부산시 공간·교통·안전 데이터를 맵으로 보고, 제안 게시판과 체크리스트, 상담 챗봇을 빠르게 오가며 한곳에서
            처리해 보세요.
          </p>
          <div className="hero-actions">
            <Link className="primary" to="/board">
              참여 제안 보기
            </Link>
            <Link className="ghost" to="/auth">
              로그인하러 가기
            </Link>
          </div>
        </div>
        <div className="stat-pill">
          <div>부산 16개 구·군</div>
          <div className="pill-figure">One stop civic cockpit</div>
        </div>
      </header>

      <MapPanel
        shapes={shapes}
        districts={districts}
        activeDistrict={activeDistrict}
        activeDistrictId={activeDistrictId}
        setDistrictStatus={setDistrictStatus}
        onSelectDistrict={onSelectDistrict}
        onHoverDistrict={onHoverDistrict}
        onLeaveDistrict={onLeaveDistrict}
        isDistrictLocked={isDistrictLocked}
        unlockDistrict={unlockDistrict}
      />
    </div>
  )
}

function MapPanel({
  shapes,
  districts,
  activeDistrict,
  activeDistrictId,
  setDistrictStatus,
  onSelectDistrict,
  onHoverDistrict,
  onLeaveDistrict,
  isDistrictLocked,
  unlockDistrict,
}) {
  let outsideTrack = { bottom: 300, gap: 10 }

  return (
    <section className="panel map-layout">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Busan Map</p>
          <h2>??? ?? ?? ?? ??</h2>
        </div>
        <div className="legend">
          {Object.entries(STATUS_COLORS).map(([key, value]) => (
            <span key={key} className="legend-chip" style={{ backgroundColor: value }}>
              {key.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
      <div className="map-flex">
        <div className="map-card">
          <svg
            viewBox="0 0 300 320"
            className="busan-map"
            role="img"
            aria-label="??? ???? ??"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="mapBg" x1="0" x2="1" y1="0" y2="1">
                <stop stopColor="#0c1525" offset="0%" />
                <stop stopColor="#0c1c30" offset="100%" />
              </linearGradient>
            </defs>
            <rect x="6" y="6" width="288" height="308" rx="28" fill="url(#mapBg)" opacity="0.85" />
            {shapes.map((shape) => {
              const district = districts.find((d) => d.id === shape.id)
              if (!district) return null
              const isActive = activeDistrictId === district.id
              const adjust = LABEL_ADJUST[district.id] || {}
              const placement = getLabelPlacement({
                centroid: shape.centroid,
                name: district.name,
                adjust,
                bbox: shape.bbox,
                outsideTrack,
              })
              return (
                <g
                  key={district.id}
                  onClick={() => onSelectDistrict(district.id)}
                  onMouseEnter={() => onHoverDistrict(district.id)}
                  onMouseLeave={onLeaveDistrict}
                  className={isActive ? 'district-group active' : 'district-group'}
                >
                  <path
                    d={shape.path}
                    className="district-shape"
                    style={{
                      fill: STATUS_COLORS[district.status],
                    }}
                  />
                  {placement.leader && (
                    <line
                      className="label-leader"
                      x1={placement.leader.x1}
                      y1={placement.leader.y1}
                      x2={placement.leader.x2}
                      y2={placement.leader.y2}
                    />
                  )}
                  <text
                    className={placement.isOutside ? 'district-label external-label' : 'district-label'}
                    x={placement.x}
                    y={placement.y}
                    style={{ fontSize: placement.fontSize }}
                    dominantBaseline="middle"
                    textAnchor={placement.textAnchor}
                  >
                    {district.name}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
        <aside className="sidebar">
          <div className="sidebar-header">
            <p className="eyebrow">{activeDistrict.summary}</p>
            <h3>{activeDistrict.name}</h3>
            <p className="sidebar-sub">{activeDistrict.focus}</p>
          </div>
          <div className="meta-row">
            <span className="pill">?? {activeDistrict.population}</span>
            <span className="pill subtle">{isDistrictLocked ? '???? ???' : 'Hover/Click ?? ????'}</span>
          </div>
          <div className="status-controls">
            <p>?? ?? ??</p>
            <div className="status-buttons">
              {['red', 'yellow', 'green'].map((status) => (
                <button
                  key={status}
                  className={activeDistrict.status === status ? 'status-btn active' : 'status-btn'}
                  style={{ backgroundColor: STATUS_COLORS[status] }}
                  onClick={() => setDistrictStatus(activeDistrict.id, status)}
                >
                  {status.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="lock-row">
            <span className={isDistrictLocked ? 'pill locked' : 'pill subtle'}>
              {isDistrictLocked ? '??? ???? ????.' : '??? ???? ?????.'}
            </span>
            {isDistrictLocked && (
              <button className="ghost sm" onClick={unlockDistrict}>
                ?? ??
              </button>
            )}
          </div>
          <div className="sidebar-foot">
            <p className="eyebrow">?? ??</p>
            <ul>
              <li>??? ???? ???? ?? ? ??? ?????.</li>
              <li>?? ??? ?? R/Y/G? ?? ??? ? ????.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}
function BoardPage({ petitionStats }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">시민 제안 게시판</p>
          <h2>공개 제안 목록</h2>
        </div>
        <div className="board-stats">
          <span className="pill">전체 {petitionStats.total}</span>
          <span className="pill">진행 {petitionStats.open}</span>
          <span className="pill">완료 {petitionStats.completed}</span>
          <button className="ghost sm">새 제안 등록</button>
        </div>
      </div>
      <div className="board-grid">
        {PETITIONS.map((petition) => (
          <article key={petition.id} className="card">
            <div className="card-head">
              <span className={`status-dot status-${petition.status}`}>{petition.status}</span>
              <span className="pill subtle">{petition.tag}</span>
            </div>
            <h3>{petition.title}</h3>
            <div className="card-meta">
              <span>서명 {petition.signatures.toLocaleString()}명</span>
              <span>{petition.due}</span>
            </div>
            <button className="primary ghosted">참여하기</button>
          </article>
        ))}
      </div>
    </section>
  )
}

function ChecklistPage({ checklist, toggleChecklist, answeredCount }) {
  return (
    <section className="panel two-col single">
      <div>
        <div className="panel-head">
          <div>
            <p className="eyebrow">구민 의견 수집</p>
            <h2>우선순위 체크리스트</h2>
          </div>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${(answeredCount / CHECKLIST_QUESTIONS.length) * 100}%` }} />
            <span>
              {answeredCount}/{CHECKLIST_QUESTIONS.length}
            </span>
          </div>
        </div>
        <div className="checklist">
          {CHECKLIST_QUESTIONS.map((item) => (
            <div key={item.id} className="question">
              <p>{item.question}</p>
              <div className="options">
                {item.options.map((option) => (
                  <label key={option} className="option">
                    <input
                      type="checkbox"
                      checked={checklist[item.id]?.includes(option) || false}
                      onChange={() => toggleChecklist(item.id, option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="primary">제출하기</button>
        </div>
      </div>
    </section>
  )
}

function ChatPage({ chatMessages, chatInput, setChatInput, sendChat }) {
  return (
    <section className="panel two-col chat-page">
      <div className="chat">
        <div className="panel-head">
          <div>
            <p className="eyebrow">AI 상담</p>
            <h2>시정 챗봇</h2>
          </div>
          <span className="pill subtle">실험적 프로토타입</span>
        </div>
        <div className="chat-window">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={msg.role === 'user' ? 'bubble user' : 'bubble'}>
              <strong>{msg.role === 'user' ? '사용자' : '상담'}</strong>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="구나 제안을 입력해 주세요"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendChat()}
          />
          <button className="primary sm" onClick={sendChat}>
            보내기
          </button>
        </div>
      </div>
    </section>
  )
}

function AuthPage({ user, onLogin, onSignup, onLogout, message }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (mode === 'login') {
      onLogin({ email: form.email, password: form.password })
    } else {
      onSignup(form)
    }
  }

  return (
    <section className="panel auth-panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">액세스</p>
          <h2>{mode === 'login' ? '로그인' : '회원가입'}</h2>
        </div>
        <div className="auth-toggle">
          <button className={mode === 'login' ? 'ghost sm active' : 'ghost sm'} onClick={() => setMode('login')}>
            로그인
          </button>
          <button className={mode === 'signup' ? 'ghost sm active' : 'ghost sm'} onClick={() => setMode('signup')}>
            회원가입
          </button>
        </div>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <label className="field">
            <span>이름</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="홍길동"
            />
          </label>
        )}
        <label className="field">
          <span>이메일</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="you@example.com"
          />
        </label>
        <label className="field">
          <span>비밀번호</span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="••••••••"
          />
        </label>
        <button className="primary" type="submit">
          {mode === 'login' ? '로그인' : '계정 만들기'}
        </button>
        {message && <p className="auth-message">{message}</p>}
      </form>
      {user && (
        <div className="auth-session">
          <p>
            현재 로그인: <strong>{user.name}</strong> ({user.email})
          </p>
          <button className="ghost sm" onClick={onLogout}>
            로그아웃
          </button>
        </div>
      )}
    </section>
  )
}

function MyPage({ user }) {
  return (
    <section className="panel my-page">
      <div className="panel-head">
        <div>
          <p className="eyebrow">My Page</p>
          <h2>프로필 & 알림</h2>
        </div>
        <Link className="ghost sm" to="/auth">
          계정 설정
        </Link>
      </div>
      {user ? (
        <div className="profile-card">
          <div className="profile-row">
            <span className="label">이름</span>
            <span className="value">{user.name}</span>
          </div>
          <div className="profile-row">
            <span className="label">이메일</span>
            <span className="value">{user.email}</span>
          </div>
          <div className="profile-row">
            <span className="label">최근 접속</span>
            <span className="value">방금 전</span>
          </div>
          <div className="profile-row">
            <span className="label">참여 현황</span>
            <span className="value">게시판 제안 0건 · 체크리스트 {CHECKLIST_QUESTIONS.length}문항</span>
          </div>
          <div className="pref-box">
            <h4>알림 설정</h4>
            <ul>
              <li>새로운 제안 등록 알림</li>
              <li>내가 참여한 제안 업데이트</li>
              <li>구별 상태 변경 피드</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="profile-card">
          <p>로그인한 사용자만 마이페이지를 볼 수 있습니다.</p>
          <Link className="primary sm" to="/auth">
            로그인하러 가기
          </Link>
        </div>
      )}
    </section>
  )
}

function readStoredAccount() {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem('civic-account')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch (error) {
    console.error('Failed to parse saved account', error)
    return null
  }
}

function readStoredSession() {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem('civic-session')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch (error) {
    console.error('Failed to parse saved session', error)
    return null
  }
}

function persistAccount(account) {
  if (typeof localStorage === 'undefined') return
  if (!account) {
    localStorage.removeItem('civic-account')
    return
  }
  localStorage.setItem('civic-account', JSON.stringify(account))
}

function persistSession(session) {
  if (typeof localStorage === 'undefined') return
  if (!session) {
    localStorage.removeItem('civic-session')
    return
  }
  localStorage.setItem('civic-session', JSON.stringify(session))
}

function readStoredTheme() {
  if (typeof localStorage === 'undefined') return 'dark'
  return localStorage.getItem('civic-theme') === 'light' ? 'light' : 'dark'
}

function persistTheme(theme) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem('civic-theme', theme)
}

function getLabelSize(name = '') {
  if (name.length <= 2) return 9.5
  if (name.length === 3) return 9
  if (name.length === 4) return 8.5
  return 8
}

function getLabelPlacement({ centroid, name, adjust, bbox, outsideTrack }) {
  const mapWidth = 300
  const mapHeight = 320
  const mapPadding = 10
  const baseFont = adjust.size ?? getLabelSize(name)
  const fontSteps = [0.95, 0.9, 0.82, 0.75]
  const padding = 6
  const baseX = centroid[0] + (adjust.dx ?? 0)
  const baseY = centroid[1] + (adjust.dy ?? 0)

  const tryPlacement = (fontSize) => {
    const textWidth = name.length * fontSize * 0.6
    const textHeight = fontSize * 0.95
    const minX = (bbox?.minX ?? 0) + padding + textWidth / 2
    const maxX = (bbox?.maxX ?? mapWidth) - padding - textWidth / 2
    const minY = (bbox?.minY ?? 0) + padding + textHeight / 2
    const maxY = (bbox?.maxY ?? mapHeight) - padding - textHeight / 2

    const fitsInside =
      textWidth + padding * 2 <= (bbox?.maxX ?? mapWidth) - (bbox?.minX ?? 0) &&
      textHeight + padding * 2 <= (bbox?.maxY ?? mapHeight) - (bbox?.minY ?? 0)

    if (fitsInside) {
      return {
        ok: true,
        x: clamp(baseX, minX, maxX),
        y: clamp(baseY, minY, maxY),
        fontSize,
      }
    }
    return { ok: false, fontSize, textWidth, textHeight }
  }

  for (const scale of fontSteps) {
    const attempt = tryPlacement(baseFont * scale)
    if (attempt.ok) {
      return {
        x: attempt.x,
        y: attempt.y,
        fontSize: attempt.fontSize,
        textAnchor: 'middle',
        isOutside: false,
        leader: null,
      }
    }
  }

  const fallbackFont = baseFont * fontSteps[fontSteps.length - 1]
  const textWidth = name.length * fallbackFont * 0.6
  const textHeight = fallbackFont * 0.95

  // place outside along the bottom to avoid covering the map body
  const x = clamp(baseX, mapPadding + textWidth / 2, mapWidth - mapPadding - textWidth / 2)
  const startY = outsideTrack?.bottom ?? mapHeight - mapPadding - textHeight / 2
  const y = clamp(startY, mapPadding + textHeight / 2, mapHeight - mapPadding - textHeight / 2)
  if (outsideTrack) {
    outsideTrack.bottom = y - textHeight - (outsideTrack.gap ?? 10)
  }

  return {
    x,
    y,
    fontSize: fallbackFont,
    isOutside: true,
    textAnchor: 'middle',
    leader: {
      x1: clamp(baseX, mapPadding, mapWidth - mapPadding),
      y1: clamp(baseY, mapPadding, mapHeight - mapPadding),
      x2: x,
      y2: y - textHeight * 0.3,
    },
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getBBoxFromPath(path) {
  const nums = path
    .match(/-?\d+\.?\d*/g)
    ?.map(Number)
    .filter((n) => !Number.isNaN(n)) || []
  const points = []
  for (let i = 0; i < nums.length; i += 2) {
    points.push([nums[i], nums[i + 1]])
  }
  const xs = points.map(([x]) => x)
  const ys = points.map(([, y]) => y)
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  }
}

export default App
