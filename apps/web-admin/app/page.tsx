"use client";

import { useMemo, useState } from "react";

type Menu = "대시보드" | "신도관리" | "기도/불공" | "시주/납부" | "일정관리" | "설정";

const menus: Menu[] = ["대시보드", "신도관리", "기도/불공", "시주/납부", "일정관리", "설정"];
const today = new Date().toISOString().slice(0, 10);

export default function Page() {
  const [activeMenu, setActiveMenu] = useState<Menu>("대시보드");
  const [templeName, setTempleName] = useState("우리사찰");
  const [devotees, setDevotees] = useState([
    { id: "1", name: "김보살", dharmaName: "선화", phone: "010-1234-5678", address: "서울시 종로구", date: today },
    { id: "2", name: "이거사", dharmaName: "법진", phone: "010-2345-6789", address: "서울시 강남구", date: today }
  ]);
  const [prayers, setPrayers] = useState([
    { id: "1", name: "김보살", type: "가족축원", amount: "50000", memo: "가족 건강 발원", date: today }
  ]);
  const [payments, setPayments] = useState([
    { id: "1", name: "이거사", type: "초하루 법회", amount: "30000", memo: "동참금", date: today }
  ]);
  const [events, setEvents] = useState([
    { id: "1", title: "초하루 법회", date: "2026-07-01", location: "대웅전", memo: "오전 10시" }
  ]);

  const [search, setSearch] = useState("");
  const [devoteeForm, setDevoteeForm] = useState({ name: "", dharmaName: "", phone: "", address: "" });
  const [prayerForm, setPrayerForm] = useState({ name: "", type: "가족축원", amount: "", memo: "" });
  const [paymentForm, setPaymentForm] = useState({ name: "", type: "정기 시주", amount: "", memo: "" });
  const [eventForm, setEventForm] = useState({ title: "", date: "", location: "", memo: "" });
  const [settingsForm, setSettingsForm] = useState({
    templeName: "우리사찰",
    representative: "주지스님",
    phone: "02-0000-0000",
    address: "서울시 종로구",
    registrationNumber: "000-00-00000"
  });

  const filteredDevotees = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return devotees;
    return devotees.filter((item) =>
      [item.name, item.dharmaName, item.phone, item.address].join(" ").toLowerCase().includes(keyword)
    );
  }, [devotees, search]);

  const totalAmount =
    prayers.reduce((sum, item) => sum + Number(item.amount || 0), 0) +
    payments.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  function addDevotee() {
    if (!devoteeForm.name.trim()) return alert("신도 이름을 입력해 주세요.");
    setDevotees([{ id: String(Date.now()), ...devoteeForm, date: today }, ...devotees]);
    setDevoteeForm({ name: "", dharmaName: "", phone: "", address: "" });
  }

  function addPrayer() {
    if (!prayerForm.name.trim() || !prayerForm.amount.trim()) return alert("이름과 금액을 입력해 주세요.");
    setPrayers([{ id: String(Date.now()), ...prayerForm, date: today }, ...prayers]);
    setPrayerForm({ name: "", type: "가족축원", amount: "", memo: "" });
  }

  function addPayment() {
    if (!paymentForm.name.trim() || !paymentForm.amount.trim()) return alert("이름과 금액을 입력해 주세요.");
    setPayments([{ id: String(Date.now()), ...paymentForm, date: today }, ...payments]);
    setPaymentForm({ name: "", type: "정기 시주", amount: "", memo: "" });
  }

  function addEvent() {
    if (!eventForm.title.trim() || !eventForm.date.trim()) return alert("행사명과 날짜를 입력해 주세요.");
    setEvents([{ id: String(Date.now()), ...eventForm }, ...events]);
    setEventForm({ title: "", date: "", location: "", memo: "" });
  }

  function saveSettings() {
    if (!settingsForm.templeName.trim()) return alert("사찰명을 입력해 주세요.");
    setTempleName(settingsForm.templeName);
    alert("설정이 저장되었습니다.");
  }

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <strong>Temple Cloud</strong>
          <p>{templeName} 신도관리 통합 관리자</p>
        </div>
      </header>

      <nav className="menu">
        {menus.map((menu) => (
          <button
            key={menu}
            onClick={() => setActiveMenu(menu)}
            className={menu === activeMenu ? "active" : ""}
          >
            {menu}
          </button>
        ))}
      </nav>

      <section className="content">
        <h1>{activeMenu}</h1>

        {activeMenu === "대시보드" && (
          <div className="grid">
            <Card title="전체 신도" value={`${devotees.length}명`} />
            <Card title="기도/불공" value={`${prayers.length}건`} />
            <Card title="시주/납부" value={`${formatCurrency(totalAmount)}원`} />
            <Card title="다가오는 행사" value={`${events.length}건`} />
          </div>
        )}

        {activeMenu === "신도관리" && (
          <Panel title="신도관리">
            <input className="input" placeholder="이름, 법명, 연락처 검색" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="form">
              <input className="input" placeholder="이름" value={devoteeForm.name} onChange={(e) => setDevoteeForm({ ...devoteeForm, name: e.target.value })} />
              <input className="input" placeholder="법명" value={devoteeForm.dharmaName} onChange={(e) => setDevoteeForm({ ...devoteeForm, dharmaName: e.target.value })} />
              <input className="input" placeholder="연락처" value={devoteeForm.phone} onChange={(e) => setDevoteeForm({ ...devoteeForm, phone: e.target.value })} />
              <input className="input" placeholder="주소" value={devoteeForm.address} onChange={(e) => setDevoteeForm({ ...devoteeForm, address: e.target.value })} />
              <button className="primary" onClick={addDevotee}>신도 등록</button>
            </div>
            <CardList items={filteredDevotees.map((item) => [`${item.name} (${item.dharmaName})`, item.phone, item.address, item.date])} />
          </Panel>
        )}

        {activeMenu === "기도/불공" && (
          <Panel title="기도/불공 접수">
            <div className="form">
              <input className="input" placeholder="신도 이름" value={prayerForm.name} onChange={(e) => setPrayerForm({ ...prayerForm, name: e.target.value })} />
              <select className="input" value={prayerForm.type} onChange={(e) => setPrayerForm({ ...prayerForm, type: e.target.value })}>
                <option>가족축원</option><option>생일불공</option><option>천도재</option><option>백일기도</option><option>인등</option>
              </select>
              <input className="input" placeholder="금액" value={prayerForm.amount} onChange={(e) => setPrayerForm({ ...prayerForm, amount: e.target.value })} />
              <input className="input" placeholder="메모" value={prayerForm.memo} onChange={(e) => setPrayerForm({ ...prayerForm, memo: e.target.value })} />
              <button className="primary" onClick={addPrayer}>접수 등록</button>
            </div>
            <CardList items={prayers.map((item) => [item.name, item.type, `${formatCurrency(Number(item.amount))}원`, item.memo, item.date])} />
          </Panel>
        )}

        {activeMenu === "시주/납부" && (
          <Panel title="시주/납부 관리">
            <div className="form">
              <input className="input" placeholder="납부자 이름" value={paymentForm.name} onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })} />
              <select className="input" value={paymentForm.type} onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })}>
                <option>정기 시주</option><option>초하루 법회</option><option>보름 법회</option><option>등 공양</option><option>기타 납부</option>
              </select>
              <input className="input" placeholder="금액" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} />
              <input className="input" placeholder="메모" value={paymentForm.memo} onChange={(e) => setPaymentForm({ ...paymentForm, memo: e.target.value })} />
              <button className="primary" onClick={addPayment}>납부 등록</button>
            </div>
            <CardList items={payments.map((item) => [item.name, item.type, `${formatCurrency(Number(item.amount))}원`, item.memo, item.date])} />
          </Panel>
        )}

        {activeMenu === "일정관리" && (
          <Panel title="일정관리">
            <div className="form">
              <input className="input" placeholder="행사명" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} />
              <input className="input" type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} />
              <input className="input" placeholder="장소" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} />
              <input className="input" placeholder="메모" value={eventForm.memo} onChange={(e) => setEventForm({ ...eventForm, memo: e.target.value })} />
              <button className="primary" onClick={addEvent}>일정 등록</button>
            </div>
            <CardList items={events.map((item) => [item.title, item.date, item.location, item.memo])} />
          </Panel>
        )}

        {activeMenu === "설정" && (
          <Panel title="사찰 기본 설정">
            <div className="form">
              <input className="input" placeholder="사찰명" value={settingsForm.templeName} onChange={(e) => setSettingsForm({ ...settingsForm, templeName: e.target.value })} />
              <input className="input" placeholder="대표자/주지스님" value={settingsForm.representative} onChange={(e) => setSettingsForm({ ...settingsForm, representative: e.target.value })} />
              <input className="input" placeholder="전화번호" value={settingsForm.phone} onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} />
              <input className="input" placeholder="주소" value={settingsForm.address} onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })} />
              <input className="input" placeholder="사업자/고유번호" value={settingsForm.registrationNumber} onChange={(e) => setSettingsForm({ ...settingsForm, registrationNumber: e.target.value })} />
              <button className="primary" onClick={saveSettings}>설정 저장</button>
            </div>
          </Panel>
        )}
      </section>

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #f6f7f9; color: #172033; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .page { min-height: 100vh; }
        .topbar { background: white; border-bottom: 1px solid #e5e7eb; padding: 18px 24px; }
        .topbar strong { font-size: 20px; }
        .topbar p { margin: 6px 0 0; color: #667085; }
        .menu { position: sticky; top: 0; z-index: 10; display: flex; gap: 8px; overflow-x: auto; padding: 12px 16px; background: white; border-bottom: 1px solid #e5e7eb; }
        .menu button { flex: 0 0 auto; border: 0; border-radius: 999px; padding: 12px 16px; background: #f2f4f7; color: #344054; font-size: 15px; }
        .menu button.active { background: #172033; color: white; }
        .content { max-width: 1180px; margin: 0 auto; padding: 24px; }
        .content h1 { margin: 0 0 20px; font-size: 30px; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .stat, .panel, .list-card { background: white; border: 1px solid #e5e7eb; border-radius: 10px; }
        .stat { padding: 20px; }
        .stat p { margin: 0 0 10px; color: #667085; }
        .stat strong { font-size: 28px; }
        .panel { padding: 20px; }
        .panel h2 { margin: 0 0 16px; font-size: 22px; }
        .form { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 18px; }
        .input { width: 100%; min-height: 46px; border: 1px solid #d0d5dd; border-radius: 8px; padding: 11px 12px; font-size: 16px; background: white; }
        .primary { min-height: 46px; border: 0; border-radius: 8px; background: #2563eb; color: white; font-size: 16px; font-weight: 600; }
        .cards { display: grid; gap: 10px; }
        .list-card { padding: 14px; }
        .list-card p { margin: 4px 0; color: #344054; word-break: break-word; }
        @media (max-width: 760px) {
          .topbar { padding: 16px; }
          .content { padding: 16px; }
          .content h1 { font-size: 26px; }
          .grid { grid-template-columns: 1fr; }
          .form { grid-template-columns: 1fr; }
          .panel { padding: 16px; }
          .menu { padding: 10px 12px; }
          .menu button { padding: 11px 14px; font-size: 14px; }
        }
      `}</style>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <article className="stat">
      <p>{title}</p>
      <strong>{value}</strong>
    </article>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function CardList({ items }: { items: string[][] }) {
  return (
    <div className="cards">
      {items.map((row, index) => (
        <article className="list-card" key={`${row.join("-")}-${index}`}>
          {row.map((cell, cellIndex) => (
            <p key={`${cell}-${cellIndex}`}>{cell}</p>
          ))}
        </article>
      ))}
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("ko-KR").format(amount);
}