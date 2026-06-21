"use client";

import { useEffect, useMemo, useState } from "react";

const bootMessages = [
  "AMEIRA OS v1.0 — Initializing...",
  "Loading kernel modules...",
  "Detecting CPU: x86_64 · 16 GB RAM · 512 GB SSD",
  "Mounting filesystem: /home/ameira/portfolio",
  "Starting network services... OK",
  "Importing About.exe... OK",
  "Importing Skills.dll... OK",
  "Importing Projects.exe... OK",
  "Importing Education.db... OK",
  "Importing Experience.log... OK",
  "Importing Contact.eml... OK",
  "Running self-check... PASS",
  "All systems operational. Welcome, Recruiter ! "
];

const emptyProject = {
  title: "NEW-PROJECT.exe",
  icon: "📦",
  date: "",
  description: "",
  tech: [],
  skillsGained: "",
  link: ""
};

export default function Home() {
  const [content, setContent] = useState(null);
  const [draft, setDraft] = useState(null);
  const [session, setSession] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [clock, setClock] = useState("00:00");
  const [date, setDate] = useState("");
  const [startOpen, setStartOpen] = useState(false);
  const [bootIndex, setBootIndex] = useState(0);
  const [bootDone, setBootDone] = useState(false);
  const [typedRole, setTypedRole] = useState("");

  const isAdmin = Boolean(session?.user?.isAdmin);

  useEffect(() => {
    async function load() {
      const [contentResponse, sessionResponse] = await Promise.all([
        fetch("/api/content", { cache: "no-store" }),
        fetch("/api/auth/session", { cache: "no-store" }).catch(() => null)
      ]);

      const loadedContent = await contentResponse.json();
      const loadedSession = sessionResponse?.ok ? await sessionResponse.json() : null;
      setContent(loadedContent);
      setDraft(structuredClone(loadedContent));
      setSession(loadedSession?.user ? loadedSession : null);
    }

    load();
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setDate(now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }));
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!content || bootDone) return;

    if (bootIndex < bootMessages.length) {
      const delay = bootIndex === 0 ? 300 : 130 + Math.random() * 70;
      const timer = setTimeout(() => setBootIndex((index) => index + 1), delay);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => setBootDone(true), 850);
    return () => clearTimeout(timer);
  }, [bootDone, bootIndex, content]);

  useEffect(() => {
    if (!content?.profile?.typewriter?.length) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer;

    const type = () => {
      const word = content.profile.typewriter[phraseIndex];

      if (!deleting) {
        charIndex += 1;
        setTypedRole(`> ${word.slice(0, charIndex)}`);
        if (charIndex === word.length) {
          deleting = true;
          timer = setTimeout(type, 1400);
          return;
        }
      } else {
        charIndex -= 1;
        setTypedRole(`> ${word.slice(0, charIndex)}`);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % content.profile.typewriter.length;
        }
      }

      timer = setTimeout(type, deleting ? 55 : 85);
    };

    timer = setTimeout(type, 2500);
    return () => clearTimeout(timer);
  }, [content]);

  useEffect(() => {
    const close = (event) => {
      if (!event.target.closest("#start-menu") && !event.target.closest("#start-btn")) {
        setStartOpen(false);
      }
    };

    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const skillCount = useMemo(() => {
    return content?.skills?.reduce((sum, group) => sum + group.items.length, 0) || 0;
  }, [content]);

  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function navigate(id) {
    scrollToSection(id);
    setStartOpen(false);
  }

  async function saveContent() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft)
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setMessage(result?.error || "Save failed. Check your login and Redis environment variables.");
        setSaving(false);
        return;
      }

      setContent(result);
      setDraft(structuredClone(result));
      setEditing(false);
      setMessage("Saved. Your visitors now see the new version.");
    } catch (error) {
      setMessage(error?.message || "Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!content || !draft) {
    return <div className="boot-loading">AMEIRA OS v1.0 — Initializing...</div>;
  }

  const progress = Math.round((bootIndex / bootMessages.length) * 100);

  return (
    <>
      {!bootDone && (
        <div id="boot-screen" className={bootIndex >= bootMessages.length ? "fade-out" : ""}>
          <div className="boot-logo">
            AMEIRA OS v1.0
            <br />
            <span>© 2025 Mohamed Ameira · FH Münster</span>
          </div>
          <div id="boot-log">
            {bootMessages.slice(0, bootIndex).map((msg) => <div key={msg}>{msg}</div>)}
          </div>
          <div className="progress-bar-wrap">
            <div id="progress-fill" style={{ width: `${progress}%` }} />
            <div id="progress-label">{progress < 100 ? `${progress}%` : "100%"}</div>
          </div>
        </div>
      )}

      <DesktopIcons onNavigate={navigate} />

      <StartMenu
        open={startOpen}
        onNavigate={navigate}
        profile={content.profile}
        isAdmin={isAdmin}
        onEdit={() => {
          setEditing(true);
          setStartOpen(false);
        }}
      />

      <div id="content">
        <Window
          id="hero-window"
          icon="💻"
          title="Mohamed_Ameira — Portfolio.exe"
          menu={["File", "View", "Help"]}
          status={[`🟢 ${content.profile.status}`, `📅 ${date}`]}
        >
          <div className="crt-lines" />
          <div className="hero-eyebrow">&gt; BOOT SEQUENCE COMPLETE _ WELCOME, RECRUITER</div>
          <div className="hero-name">{content.profile.name.split(" ").map((part) => <span key={part}>{part}<br /></span>)}</div>
          <div className="hero-title">{content.profile.title}</div>
          <div className="hero-location">📍 {content.profile.location} &nbsp;|&nbsp; 🌍 {content.profile.origin}</div>
          <div id="typewriter">{typedRole}</div>
          <div className="hero-links">
            <a href={content.profile.github} target="_blank" className="retro-btn primary">🐙 GitHub</a>
            <a href={content.profile.linkedin} target="_blank" className="retro-btn">🔗 LinkedIn</a>
            <a href={`mailto:${content.profile.email}`} className="retro-btn">📧 Email Me</a>
            <button onClick={() => scrollToSection("contact")} className="retro-btn">📬 Contact</button>
          </div>
          <div className="deploy-badges">
            <span className="deploy-badge">▲ Vercel Ready</span>
            <span className="deploy-badge">🚂 Railway Ready</span>
            <span className="deploy-badge">📱 Expo (React Native)</span>
          </div>
        </Window>

        <Window id="about" icon="👤" title="About_Me.txt — Notepad" menu={["File", "Edit", "Format"]} status={["📄 About.txt — Ready"]}>
          <div className="about-grid">
            <div className="about-text">
              {content.profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="info-box">
              <Info label="Name" value={content.profile.name} />
              <Info label="Location" value={content.profile.location.replace("NRW · ", "")} />
              <Info label="University" value="FH Münster" />
              <Info label="Degree" value="B.Sc. Informatik (ongoing)" />
              <Info label="Email" value={content.profile.email} />
              <Info label="GitHub" value={content.profile.github.replace("https://", "")} />
              <Info label="Human langs" value="🇲🇷 AR · 🇬🇧 EN · 🇩🇪 DE · 🇫🇷 FR" />
              <Info label="Status" value="✅ Open to opportunities" green />
            </div>
          </div>
        </Window>

        <Window id="skills" icon="⚙️" title="Skills — Device Manager" menu={["View", "Action"]} status={[`${skillCount} skills installed`, "✅ All drivers operational"]}>
          <SectionLabel text="Installed Packages — Click to explore" />
          <div className="skills-grid" id="skills-grid">
            {content.skills.map((group) => (
              <div className="skill-category" key={group.category}>
                <div className="skill-cat-title">► {group.category}</div>
                {group.items.map((skill) => <span className="skill-tag" key={`${group.category}-${skill}`}>{skill}</span>)}
              </div>
            ))}
          </div>
        </Window>

        <Window id="projects" icon="📁" title="Projects — Windows Explorer" menu={["File", "View", "Sort"]} status={[`${content.projects.length} objects · github.com/Moameira`]}>
          <SectionLabel text={`C:\\Users\\Ameira\\Projects\\ (${content.projects.length} items)`} />
          <div className="projects-grid">
            {content.projects.map((project) => (
              <div className="project-card" key={project.title}>
                <div className="project-header"><span>{project.icon}</span> {project.title}</div>
                <div className="project-body">
                  <div className="project-date">📅 {project.date}</div>
                  <div className="project-desc">{project.description}</div>
                  <div className="project-tech">
                    {project.tech.map((tech) => <span className="tech-badge" key={`${project.title}-${tech}`}>{tech}</span>)}
                  </div>
                  <div className="skill-gained">
                    <strong>🧠 Skills gained from this project:</strong>
                    {project.skillsGained}
                  </div>
                  {project.link && <a href={project.link} target="_blank" className="retro-btn project-link">🐙 GitHub</a>}
                </div>
              </div>
            ))}
          </div>
        </Window>

        <Window id="education" icon="🎓" title="Education — System Properties" status={[`${content.education.length} institutions`]}>
          <SectionLabel text="Academic Record" />
          <div className="edu-list">
            {content.education.map((item, index) => (
              <div className="edu-item" key={item.school}>
                <div className="edu-icon">{index === 0 ? "🏛️" : index === 1 ? "📐" : "🏫"}</div>
                <div style={{ flex: 1 }}>
                  <div className="edu-school">{item.school}</div>
                  <div className="edu-degree">{item.degree}</div>
                  <div className="edu-meta">📅 {item.meta}</div>
                  {item.courses.length > 0 && (
                    <div className="edu-courses">
                      {item.courses.map((course) => <span className="course-tag" key={course}>{course}</span>)}
                    </div>
                  )}
                </div>
                <div className="edu-status">{item.status === "Active" ? "🟢 Active" : "✅ Done"}</div>
              </div>
            ))}
          </div>
        </Window>

        <Window id="experience" icon="💼" title="Experience — Task Manager" status={["1 process · Jenkins CI/CD · Python · PowerShell"]}>
          <SectionLabel text="Work History" />
          {content.experience.map((item) => (
            <div className="exp-item" key={`${item.role}-${item.date}`}>
              <div className="exp-header">
                <div>
                  <div className="exp-title">{item.role}</div>
                  <div className="exp-company">{item.company}</div>
                </div>
                <div className="exp-date">{item.date}</div>
              </div>
              <ul className="exp-bullets">
                {item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            </div>
          ))}
        </Window>

        <Window id="contact" icon="📧" title="Contact — Outlook Express" menu={["File", "New Mail"]} status={["📬 Open to internships, Werkstudent & freelance"]}>
          <SectionLabel text="Get In Touch" />
          <div className="contact-grid">
            <Contact href={`mailto:${content.profile.email}`} icon="📧" label="EMAIL" value={content.profile.email} />
            <Contact href={content.profile.linkedin} icon="🔗" label="LINKEDIN" value="Mohamed Ameira" />
            <Contact href={content.profile.github} icon="🐙" label="GITHUB" value={content.profile.github.replace("https://", "")} />
            <Contact href={`tel:${content.profile.phone}`} icon="📞" label="PHONE" value={content.profile.phone} />
          </div>
        </Window>

        <div className="retro-footer">
          © 2025 Mohamed Ameira &nbsp;·&nbsp; Built with 💾 nostalgia &nbsp;·&nbsp; Deployed on Vercel / Railway
        </div>
      </div>

      <Taskbar clock={clock} onNavigate={navigate} onStart={() => setStartOpen((open) => !open)} />

      {(isAdmin || message) && (
        <AdminBar
          isAdmin={isAdmin}
          session={session}
          onEdit={() => setEditing(true)}
          message={message}
        />
      )}

      {editing && (
        <EditorModal
          draft={draft}
          setDraft={setDraft}
          onClose={() => {
            setDraft(structuredClone(content));
            setEditing(false);
          }}
          onSave={saveContent}
          saving={saving}
        />
      )}
    </>
  );
}

function Window({ id, title, icon, menu = [], status = [], children }) {
  return (
    <section className="win-window" id={id}>
      <div className="win-titlebar">
        <div className="win-titlebar-left"><span className="win-titlebar-icon">{icon}</span><span>{title}</span></div>
        <div className="win-titlebar-btns"><div className="win-btn">_</div><div className="win-btn">□</div><div className="win-btn">✕</div></div>
      </div>
      {menu.length > 0 && <div className="win-menubar">{menu.map((item) => <div className="win-menu-item" key={item}>{item}</div>)}</div>}
      <div className="win-content">{children}</div>
      {status.length > 0 && <div className="win-statusbar">{status.map((item) => <span key={item}>{item}</span>)}</div>}
    </section>
  );
}

function SectionLabel({ text }) {
  return <div className="section-label"><span className="pixel-corner" />{text}</div>;
}

function Info({ label, value, green = false }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-val" style={green ? { color: "green" } : undefined}>{value}</span>
    </div>
  );
}

function Contact({ href, icon, label, value }) {
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} className="contact-item">
      <div className="contact-icon">{icon}</div>
      <div><div className="contact-label">{label}</div><div className="contact-val">{value}</div></div>
    </a>
  );
}

function DesktopIcons({ onNavigate }) {
  const items = [
    ["about", "👤", "About.exe"],
    ["skills", "⚙️", "Skills.dll"],
    ["projects", "📁", "Projects"],
    ["education", "🎓", "Education"],
    ["experience", "💼", "Experience"],
    ["contact", "📧", "Contact"]
  ];

  return (
    <div id="desktop-icons">
      {items.map(([id, icon, label]) => (
        <button className="desk-icon" key={id} onClick={() => onNavigate(id)}>
          <div className="icon-img">{icon}</div>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

function StartMenu({ open, onNavigate, profile, isAdmin, onEdit }) {
  return (
    <div id="start-menu" className={open ? "open" : ""}>
      <div className="start-sidebar"><span>AMEIRA OS</span></div>
      <div className="start-items">
        <button className="start-item" onClick={() => onNavigate("about")}>👤 About Me</button>
        <button className="start-item" onClick={() => onNavigate("skills")}>⚙️ Skills</button>
        <button className="start-item" onClick={() => onNavigate("projects")}>📁 Projects</button>
        <button className="start-item" onClick={() => onNavigate("education")}>🎓 Education</button>
        <button className="start-item" onClick={() => onNavigate("experience")}>💼 Experience</button>
        <button className="start-item" onClick={() => onNavigate("contact")}>📧 Contact</button>
        <div className="start-sep" />
        <button className="start-item" onClick={() => window.open(profile.github, "_blank")}>🐙 GitHub</button>
        <button className="start-item" onClick={() => window.open(profile.linkedin, "_blank")}>🔗 LinkedIn</button>
        <div className="start-sep" />
        {isAdmin ? (
          <button className="start-item" onClick={onEdit}>🔐 Edit Portfolio</button>
        ) : (
          <a className="start-item" href="/api/auth/signin">🔐 Owner Login</a>
        )}
        <button className="start-item danger" type="button">⏻ Shut Down</button>
      </div>
    </div>
  );
}

function Taskbar({ clock, onNavigate, onStart }) {
  return (
    <div id="taskbar">
      <button id="start-btn" onClick={onStart}>🪟 Start</button>
      <button className="taskbar-item" onClick={() => onNavigate("about")}>👤 About</button>
      <button className="taskbar-item" onClick={() => onNavigate("skills")}>⚙️ Skills</button>
      <button className="taskbar-item" onClick={() => onNavigate("projects")}>📁 Projects</button>
      <button className="taskbar-item" onClick={() => onNavigate("contact")}>📧 Contact</button>
      <div id="taskbar-clock">{clock}</div>
    </div>
  );
}

function AdminBar({ isAdmin, session, onEdit, message }) {
  return (
    <div className="admin-bar">
      {isAdmin && (
        <>
          <span>Signed in as {session.user.githubLogin}</span>
          <button className="retro-btn primary" onClick={onEdit}>Edit Portfolio</button>
          <a className="retro-btn" href="/api/auth/signout">Sign out</a>
        </>
      )}
      {message && <span className="admin-message">{message}</span>}
    </div>
  );
}

function EditorModal({ draft, setDraft, onClose, onSave, saving }) {
  function updateProfile(field, value) {
    setDraft({ ...draft, profile: { ...draft.profile, [field]: value } });
  }

  function updateSkill(categoryIndex, skillIndex, value) {
    const skills = structuredClone(draft.skills);
    skills[categoryIndex].items[skillIndex] = value;
    setDraft({ ...draft, skills });
  }

  function addSkill(categoryIndex) {
    const skills = structuredClone(draft.skills);
    skills[categoryIndex].items.push("New skill");
    setDraft({ ...draft, skills });
  }

  function removeSkill(categoryIndex, skillIndex) {
    const skills = structuredClone(draft.skills);
    skills[categoryIndex].items.splice(skillIndex, 1);
    setDraft({ ...draft, skills });
  }

  function addProject() {
    setDraft({ ...draft, projects: [...draft.projects, structuredClone(emptyProject)] });
  }

  function updateProject(index, field, value) {
    const projects = structuredClone(draft.projects);
    projects[index][field] = field === "tech" ? value.split(",").map((item) => item.trim()).filter(Boolean) : value;
    setDraft({ ...draft, projects });
  }

  function removeProject(index) {
    setDraft({ ...draft, projects: draft.projects.filter((_, itemIndex) => itemIndex !== index) });
  }

  return (
    <div className="modal-overlay active">
      <div className="modal-box editor-box">
        <div className="win-titlebar">
          <div className="win-titlebar-left"><span className="win-titlebar-icon">⚙️</span><span>Portfolio Editor</span></div>
          <div className="win-titlebar-btns"><button className="win-btn" onClick={onClose}>✕</button></div>
        </div>
        <div className="modal-content editor-content">
          <h2>Profile</h2>
          <label>Name<input value={draft.profile.name} onChange={(event) => updateProfile("name", event.target.value)} /></label>
          <label>Title<input value={draft.profile.title} onChange={(event) => updateProfile("title", event.target.value)} /></label>
          <label>Status<input value={draft.profile.status} onChange={(event) => updateProfile("status", event.target.value)} /></label>
          <label>About<textarea value={draft.profile.about.join("\n\n")} onChange={(event) => updateProfile("about", event.target.value.split(/\n\s*\n/).filter(Boolean))} /></label>

          <h2>Skills</h2>
          {draft.skills.map((group, categoryIndex) => (
            <div className="editor-group" key={group.category}>
              <h3>{group.category}</h3>
              {group.items.map((skill, skillIndex) => (
                <div className="editor-row" key={`${group.category}-${skillIndex}`}>
                  <input value={skill} onChange={(event) => updateSkill(categoryIndex, skillIndex, event.target.value)} />
                  <button onClick={() => removeSkill(categoryIndex, skillIndex)}>Remove</button>
                </div>
              ))}
              <button onClick={() => addSkill(categoryIndex)}>Add skill</button>
            </div>
          ))}

          <h2>Projects</h2>
          {draft.projects.map((project, index) => (
            <div className="editor-group" key={`${project.title}-${index}`}>
              <div className="editor-heading">
                <h3>{project.title || "Project"}</h3>
                <button onClick={() => removeProject(index)}>Remove project</button>
              </div>
              <label>Title<input value={project.title} onChange={(event) => updateProject(index, "title", event.target.value)} /></label>
              <label>Date<input value={project.date} onChange={(event) => updateProject(index, "date", event.target.value)} /></label>
              <label>Icon<input value={project.icon} onChange={(event) => updateProject(index, "icon", event.target.value)} /></label>
              <label>GitHub/link<input value={project.link} onChange={(event) => updateProject(index, "link", event.target.value)} /></label>
              <label>Description<textarea value={project.description} onChange={(event) => updateProject(index, "description", event.target.value)} /></label>
              <label>Tech, comma separated<input value={project.tech.join(", ")} onChange={(event) => updateProject(index, "tech", event.target.value)} /></label>
              <label>Skills gained<textarea value={project.skillsGained} onChange={(event) => updateProject(index, "skillsGained", event.target.value)} /></label>
            </div>
          ))}
          <button onClick={addProject}>Add project</button>
        </div>
        <div className="modal-actions">
          <button className="retro-btn" onClick={onClose}>Cancel</button>
          <button className="retro-btn primary" onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
        </div>
      </div>
    </div>
  );
}
