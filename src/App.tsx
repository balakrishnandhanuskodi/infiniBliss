import { useMemo, useState } from "react";

type IconName =
  | "search"
  | "edit"
  | "inbox"
  | "phone"
  | "users"
  | "bell"
  | "settings"
  | "video"
  | "info"
  | "plus"
  | "smile"
  | "mic"
  | "send"
  | "paperclip"
  | "check"
  | "chevron"
  | "x"
  | "volume"
  | "grid"
  | "camera"
  | "share";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    edit: <><path d="M13.5 6.5 17.5 10.5" /><path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4Z" /></>,
    inbox: <><path d="M4 5h16v14H4z" /><path d="M4 14h4l2 2h4l2-2h4" /></>,
    phone: <path d="M6.5 3.5 9 8 7 10c1.4 3 3.7 5.3 6.8 6.8l2-2 4.7 2.6c-.6 2.4-2.6 3.8-5 3.6C9 20.3 3.7 15 3 8.5c-.2-2.4 1.1-4.4 3.5-5Z" />,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M17 11a4 4 0 0 1 0-8M22 21v-2a4 4 0 0 0-3-3.7" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
    video: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    smile: <><circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></>,
    mic: <><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="m22 2-11 11" /></>,
    paperclip: <path d="m20.5 11.5-8.8 8.8a6 6 0 0 1-8.5-8.5l9.5-9.5a4 4 0 0 1 5.7 5.7l-9.6 9.5A2 2 0 0 1 6 14.7l8.8-8.8" />,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    x: <path d="M6 6l12 12M18 6 6 18" />,
    volume: <><path d="M11 5 6 9H2v6h4l5 4Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
    camera: <><path d="M14.5 6 13 4h-2L9.5 6H5a2 2 0 0 0-2 2v10h18V8a2 2 0 0 0-2-2Z" /><circle cx="12" cy="12" r="3" /></>,
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const avatars = {
  maya: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop",
  leo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop",
  sofia: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop",
  jamal: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop",
  mina: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=160&h=160&fit=crop",
};

const conversations = [
  { id: 1, name: "Chennai Seeker Circle", group: true, circle: true, text: "Ananya: See you at Sunday satsang", time: "2m", unread: 3, active: true },
  { id: 2, name: "Bliss Notifications", group: true, announcement: true, text: "New guided practice is now available", time: "12m", unread: 1 },
  { id: 3, name: "Meera · RM", avatar: avatars.maya, rm: true, text: "I’m here if you need any guidance", time: "28m", active: true },
  { id: 4, name: "RM Circle · South", group: true, rm: true, circle: true, text: "Meera: Seeker follow-ups for this week", time: "42m", unread: 4 },
  { id: 5, name: "Infinipath November", group: true, circle: true, text: "Arjun: Shared a voice reflection", time: "1h", unread: 8 },
  { id: 6, name: "Hyderabad Seeker Circle", group: true, circle: true, text: "This week’s circle is at 6:30 PM", time: "3h", read: true },
  { id: 7, name: "TAT Alumni", group: true, circle: true, text: "Kiran shared 4 photos", time: "Tue" },
  { id: 8, name: "HDB / MSD Community", group: true, circle: true, text: "You: Added a document", time: "Tue" },
  { id: 9, name: "Volunteer Community", group: true, circle: true, text: "Priya: Registrations are open", time: "Mon" },
];

function Avatar({ src, name, active = false, size = "md" }: { src?: string; name: string; active?: boolean; size?: "sm" | "md" | "lg" }) {
  return (
    <div className={`avatar avatar-${size} ${active ? "is-active" : ""}`}>
      {src ? <img src={src} alt="" /> : <span>{name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</span>}
    </div>
  );
}

function Waveform({ coral = false }: { coral?: boolean }) {
  return <div className={`waveform ${coral ? "coral" : ""}`} aria-label="Audio waveform">
    {[8, 16, 24, 13, 28, 19, 10, 22, 30, 16, 8, 20, 26, 12, 18, 9, 24, 15, 7].map((h, i) => <i key={i} style={{ height: h, opacity: i < 8 ? 1 : 0.32 }} />)}
  </div>;
}

function GroupAvatar() {
  return <div className="group-avatar"><img src={avatars.leo} alt="" /><img src={avatars.sofia} alt="" /><img src={avatars.mina} alt="" /></div>;
}

export default function App() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const [call, setCall] = useState<"voice" | "video" | null>(null);
  const [details, setDetails] = useState(true);
  const [activeNav, setActiveNav] = useState("inbox");
  const [rmCircleOpen, setRmCircleOpen] = useState(false);
  const [circleName, setCircleName] = useState("");
  const [groupMessage, setGroupMessage] = useState("");
  const [createdCircle, setCreatedCircle] = useState<{ name: string; text: string } | null>(null);

  const filtered = useMemo(() => [...(createdCircle ? [{
    id: 10,
    name: createdCircle.name,
    group: true,
    rm: true,
    circle: true,
    text: `You: ${createdCircle.text}`,
    time: "now",
  }] : []), ...conversations].filter((c) => {
    const matches = c.name.toLowerCase().includes(query.toLowerCase());
    if (filter === "Unread") return matches && c.unread;
    if (filter === "Direct") return matches && !c.group;
    if (filter === "Circles") return matches && c.circle;
    if (filter === "RM Connect") return matches && c.rm;
    return matches;
  }), [filter, query, createdCircle]);

  const createRmCircle = () => {
    if (!circleName.trim() || !groupMessage.trim()) return;
    setCreatedCircle({ name: circleName.trim(), text: groupMessage.trim() });
    setRmCircleOpen(false);
    setCircleName("");
    setGroupMessage("");
    setFilter("RM Connect");
  };

  return (
    <main className="app-shell">
      <aside className="nav-rail">
        <button className="brand-mark" aria-label="infiniBliss home"><span></span><span></span><span></span></button>
        <nav>
          {[
            ["inbox", "inbox", "Messages"],
            ["phone", "phone", "Calls"],
            ["users", "users", "People"],
            ["bell", "bell", "Updates"],
          ].map(([id, icon, label]) => (
            <button key={id} className={activeNav === id ? "active" : ""} onClick={() => setActiveNav(id)} aria-label={label}>
              <Icon name={icon as IconName} />
              {id === "bell" && <b></b>}
            </button>
          ))}
        </nav>
        <div className="nav-bottom">
          <button aria-label="Settings" onClick={() => setDetails(!details)}><Icon name="settings" /></button>
          <button className="profile-button"><Avatar src={avatars.mina} name="Alina" size="sm" /></button>
        </div>
      </aside>

      <section className="inbox-panel">
        <header className="inbox-header">
          <div><p className="eyebrow">infiniBliss</p><h1>Your space</h1></div>
          <button className="soft-button" aria-label="Create RM circle" onClick={() => setRmCircleOpen(true)}><Icon name="edit" size={19} /></button>
        </header>
        <label className="search-field">
          <Icon name="search" size={18} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search seekers & circles" />
          <kbd>⌘ K</kbd>
        </label>
        <div className="presence-strip">
          <button><div className="add-story"><Icon name="plus" size={18} /></div><span>New group</span></button>
          {[["Meera RM", avatars.maya], ["Ananya", avatars.sofia], ["Arjun", avatars.leo], ["Kiran", avatars.jamal]].map(([name, src]) => (
            <button key={name}><Avatar src={src} name={name} active /><span>{name}</span></button>
          ))}
        </div>
        <div className="filters">
          {["All", "Unread", "Circles", "RM Connect"].map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}{item === "Unread" && <sup>12</sup>}</button>)}
        </div>
        <div className="conversation-list">
          <div className="section-label"><span>Pinned</span><button>•••</button></div>
          {filtered.map((c, i) => (
            <button className={`conversation ${i === 0 ? "selected" : ""}`} key={c.id}>
              {c.announcement ? <div className="announcement-avatar"><Icon name="bell" /></div> : c.group ? <GroupAvatar /> : <Avatar src={c.avatar} name={c.name} active={c.active} />}
              <div className="conversation-copy">
                <div><strong>{c.name}{c.rm && <em className="rm-badge">RM</em>}</strong><time>{c.time}</time></div>
                <div><p>{c.read && <span className="read-check">✓✓</span>}{c.text}</p>{c.unread && <b className="unread">{c.unread}</b>}</div>
              </div>
            </button>
          ))}
        </div>
        <button className="floating-compose" aria-label="Create RM circle" onClick={() => setRmCircleOpen(true)}><Icon name="edit" /></button>
      </section>

      <section className="chat-panel">
        <header className="chat-header">
          <div className="chat-person">
            <GroupAvatar />
            <div><strong>Chennai Seeker Circle</strong><span><i></i> 248 seekers · 18 active</span></div>
          </div>
          <div className="chat-actions">
            <button onClick={() => setCall("voice")} aria-label="Voice call"><Icon name="phone" /></button>
            <button onClick={() => setCall("video")} aria-label="Video call"><Icon name="video" /></button>
            <button onClick={() => setDetails(!details)} aria-label="Thread info" className={details ? "active" : ""}><Icon name="info" /></button>
          </div>
        </header>

        <div className="messages">
          <div className="circle-welcome">
            <span className="circle-orbit"><i></i></span>
            <div><strong>A space to seek, share, and grow</strong><p>Be kind, stay present, and keep shared reflections within the circle.</p></div>
          </div>
          <div className="announcement-card">
            <div className="announcement-kicker"><Icon name="bell" size={14} /> Bliss notification <time>9:00 AM</time></div>
            <strong>Sunday satsang · Chennai Centre</strong>
            <p>Join us this Sunday at 7:00 AM for meditation and a shared reflection.</p>
            <button>View details <Icon name="chevron" size={14} /></button>
          </div>
          <div className="day-divider"><span>Today</span></div>
          <div className="message-row theirs">
            <Avatar src={avatars.sofia} name="Ananya" size="sm" />
            <div><span className="sender-name">Ananya Rao</span><div className="bubble">The morning practice felt deeply still today. Did anyone else notice it?</div><time>10:28</time></div>
          </div>
          <div className="message-row mine">
            <div><div className="bubble">Yes. There was a quietness that stayed long after ✦</div><time>10:29 <span>✓✓</span></time></div>
          </div>
          <div className="message-row theirs media-row">
            <Avatar src={avatars.leo} name="Arjun" size="sm" />
            <div>
              <span className="sender-name">Arjun Menon</span>
              <div className="media-card">
                <img src="/pulsewave-rooftop.jpg" alt="Members sharing a warm community moment" />
                <div className="media-meta"><span>After last week’s gathering</span><button><Icon name="chevron" size={16} /></button></div>
              </div>
              <time>10:31</time>
            </div>
          </div>
          <div className="message-row mine">
            <div className="voice-card">
              <button><Icon name="chevron" size={17} /></button>
              <Waveform />
              <span>0:18</span>
            </div>
            <time>10:34 <span>✓✓</span></time>
          </div>
          <div className="message-row theirs">
            <Avatar src={avatars.jamal} name="Kiran" size="sm" />
            <div className="document-card">
              <div className="file-icon">PDF</div>
              <div><strong>Daily reflection guide</strong><span>4 pages · 2.4 MB</span></div>
              <button aria-label="Download"><Icon name="chevron" size={16} /></button>
            </div>
          </div>
          <div className="typing">
            <Avatar src={avatars.maya} name="Meera" size="sm" />
            <div className="typing-wave"><i></i><i></i><i></i><i></i><i></i></div><span>Meera and 2 others are typing</span>
          </div>
        </div>

        <div className="composer-wrap">
          {attachmentOpen && <div className="attachment-drawer">
            {[["camera", "Photo"], ["paperclip", "File"], ["mic", "Audio"], ["users", "Contact"]].map(([icon, label]) => <button key={label}><span><Icon name={icon as IconName} /></span>{label}</button>)}
          </div>}
          <div className="composer">
            <button onClick={() => setAttachmentOpen(!attachmentOpen)} className={attachmentOpen ? "active" : ""} aria-label="Attach"><Icon name={attachmentOpen ? "x" : "plus"} /></button>
            <input placeholder="Share with the circle…" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button aria-label="Emoji"><Icon name="smile" /></button>
            <button aria-label={message ? "Send" : "Hold to record"} className={message ? "send-button" : ""}><Icon name={message ? "send" : "mic"} /></button>
          </div>
          <p>Enter to send · Shift + Enter for new line</p>
        </div>
      </section>

      {details && <aside className="details-panel">
        <div className="details-top">
          <button className="mobile-close" onClick={() => setDetails(false)}><Icon name="x" /></button>
          <div className="circle-mark"><span></span><span></span><span></span><span></span></div>
          <h2>Chennai Seeker Circle</h2><p>248 seekers · Community</p>
          <span className="status-note">Open to everyone</span>
          <div className="quick-actions">
            <button onClick={() => setCall("voice")}><span><Icon name="phone" /></span>Audio</button>
            <button onClick={() => setCall("video")}><span><Icon name="video" /></span>Video</button>
            <button><span><Icon name="bell" /></span>Mute</button>
          </div>
        </div>
        <div className="callout-card">
          <div className="callout-icon"><span></span><span></span><span></span></div>
          <div><strong>Daily Wisdom</strong><p>“Stillness is not empty. It is full of answers.”</p></div>
        </div>
        <div className="details-section">
          <div><strong>Circle moments</strong><button>View all</button></div>
          <div className="media-grid"><img src="/pulsewave-rooftop.jpg" alt="" /><img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=180&h=180&fit=crop" alt="" /><div><span>+24</span></div></div>
        </div>
        <div className="details-links">
          <button><span><Icon name="bell" /></span><div>Circle notifications<small>Announcements only</small></div><Icon name="chevron" size={16} /></button>
          <button><span><Icon name="users" /></span><div>Members<small>248 seekers · 4 RMs</small></div><Icon name="chevron" size={16} /></button>
          <button><span><Icon name="search" /></span><div>Search in circle</div><Icon name="chevron" size={16} /></button>
          <button><span><Icon name="info" /></span><div>Circle guidelines</div><Icon name="chevron" size={16} /></button>
        </div>
      </aside>}

      <nav className="mobile-nav">
        {[["inbox", "Chats"], ["phone", "Calls"], ["users", "People"], ["settings", "Settings"]].map(([icon, label]) => <button key={label} className={label === "Chats" ? "active" : ""}><Icon name={icon as IconName} /><span>{label}</span></button>)}
      </nav>

      {call && <div className={`call-overlay ${call}`}>
        <div className="call-backdrop"></div>
        <button className="call-close" onClick={() => setCall(null)}><Icon name="x" /></button>
        {call === "video" && <div className="video-label"><span></span> Encrypted video</div>}
        <div className="call-content">
          {call === "voice" ? <>
            <div className="circle-mark call-circle"><span></span><span></span><span></span><span></span></div>
            <h2>Chennai Seeker Circle</h2><p className="call-status">18 seekers connected · <time>04:18</time></p>
            <div className="audio-visualizer">{[24, 46, 32, 70, 54, 88, 43, 68, 34, 52, 26, 40].map((h, i) => <i key={i} style={{ height: h }} />)}</div>
          </> : <>
            <div className="video-heading"><span>LIVE · 04:18</span><h2>Chennai Seeker Circle</h2><p>Sunday community reflection</p></div>
            <div className="self-view"><img src={avatars.mina} alt="Your video preview" /><span>You</span></div>
          </>}
        </div>
        <div className="call-controls">
          <button><Icon name="mic" /><span>Mute</span></button>
          <button>{call === "video" ? <Icon name="camera" /> : <Icon name="volume" />}<span>{call === "video" ? "Camera" : "Speaker"}</span></button>
          <button><Icon name={call === "video" ? "share" : "users"} /><span>{call === "video" ? "Share" : "Add"}</span></button>
          <button><Icon name="inbox" /><span>Chat</span></button>
          <button className="end-call" onClick={() => setCall(null)}><Icon name="phone" /><span>End</span></button>
        </div>
      </div>}

      {rmCircleOpen && <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="rm-circle-title">
        <button className="modal-scrim" onClick={() => setRmCircleOpen(false)} aria-label="Close dialog"></button>
        <section className="rm-circle-modal">
          <header>
            <div className="rm-modal-icon"><Icon name="users" /></div>
            <div><p className="eyebrow">RM workspace</p><h2 id="rm-circle-title">Create an RM Circle</h2></div>
            <button onClick={() => setRmCircleOpen(false)} aria-label="Close"><Icon name="x" /></button>
          </header>
          <p className="modal-intro">Bring the right seekers together and begin with a clear group message.</p>
          <label className="form-field"><span>Circle name</span><input value={circleName} onChange={(e) => setCircleName(e.target.value)} placeholder="e.g. Chennai New Seekers" /></label>
          <div className="member-picker">
            <div className="field-heading"><span>Add members</span><button>Select all</button></div>
            <label className="member-search"><Icon name="search" size={16} /><input placeholder="Search seekers" /></label>
            <div className="selected-members">
              {[[avatars.sofia, "Ananya"], [avatars.leo, "Arjun"], [avatars.jamal, "Kiran"]].map(([src, name]) => <button key={name}><Avatar src={src} name={name} size="sm" /><span>{name}</span><Icon name="x" size={12} /></button>)}
              <span>+ 12 selected</span>
            </div>
          </div>
          <label className="form-field"><span>First group message</span><textarea value={groupMessage} onChange={(e) => setGroupMessage(e.target.value)} placeholder="Welcome everyone and share the purpose of this circle…" /></label>
          <div className="delivery-note"><Icon name="bell" size={16} /><span>This message will notify all selected members.</span></div>
          <footer>
            <button className="cancel-button" onClick={() => setRmCircleOpen(false)}>Cancel</button>
            <button className="create-button" disabled={!circleName.trim() || !groupMessage.trim()} onClick={createRmCircle}><Icon name="send" size={17} /> Create & send</button>
          </footer>
        </section>
      </div>}
    </main>
  );
}
