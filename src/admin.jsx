import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { supabase } from "./supabaseClient.js";

// ═══════════════════════════════════════════
// THEME — Same palette as main site
// ═══════════════════════════════════════════
const T = {
  bg: "#111010",
  bgCard: "#1E1B18",
  bgInput: "#161412",
  text: "#F5F0EB",
  textMuted: "#A09888",
  gold: "#C9A96E",
  cognac: "#A0613A",
  oak: "#C4A57B",
  border: "#2A2520",
  danger: "#D9534F",
  dangerBg: "#2A1515",
  success: "#5CB85C",
  successBg: "#152A15",
};

const font = {
  display: "'Cormorant Garamond', serif",
  body: "'DM Sans', sans-serif",
};

// ═══════════════════════════════════════════
// GLOBAL STYLES
// ═══════════════════════════════════════════
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background: ${T.bg};
        color: ${T.text};
        font-family: ${font.body};
        -webkit-font-smoothing: antialiased;
        min-height: 100vh;
      }
      ::selection { background: ${T.oak}35; color: ${T.text}; }
      input, textarea, select {
        font-family: ${font.body};
        outline: none;
      }
      input::placeholder, textarea::placeholder {
        color: ${T.textMuted};
      }
      button { cursor: pointer; font-family: ${font.body}; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    `}</style>
  );
}

// ═══════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════
function Btn({ children, onClick, variant = "primary", style: s, disabled, type = "button" }) {
  const base = {
    padding: "10px 22px",
    borderRadius: 12,
    border: "none",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.03em",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? "none" : "auto",
  };
  const variants = {
    primary: { background: `linear-gradient(135deg, ${T.cognac}, ${T.gold})`, color: "#fff", boxShadow: `0 4px 20px ${T.gold}30` },
    secondary: { background: T.bgCard, color: T.text, border: `1px solid ${T.border}` },
    danger: { background: T.dangerBg, color: T.danger, border: `1px solid ${T.danger}30` },
    ghost: { background: "transparent", color: T.textMuted, padding: "8px 14px" },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...s }}>
      {children}
    </button>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", textarea, style: s }) {
  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    border: `1px solid ${T.border}`,
    background: T.bgInput,
    color: T.text,
    fontSize: 14,
    transition: "border-color 0.2s",
  };
  return (
    <div style={{ marginBottom: 16, ...s }}>
      {label && (
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {label}
        </label>
      )}
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
          onFocus={(e) => (e.target.style.borderColor = T.gold)}
          onBlur={(e) => (e.target.style.borderColor = T.border)}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = T.gold)}
          onBlur={(e) => (e.target.style.borderColor = T.border)}
        />
      )}
    </div>
  );
}

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      padding: "14px 24px", borderRadius: 14,
      background: type === "success" ? T.successBg : T.dangerBg,
      color: type === "success" ? T.success : T.danger,
      border: `1px solid ${type === "success" ? T.success : T.danger}30`,
      fontSize: 14, fontWeight: 500,
      animation: "fadeIn 0.3s ease",
      boxShadow: `0 10px 40px ${T.bg}80`,
    }}>
      {type === "success" ? "✓" : "✕"} {message}
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 20, height: 20, border: `2px solid ${T.border}`,
      borderTopColor: T.gold, borderRadius: "50%",
      animation: "spin 0.6s linear infinite", display: "inline-block",
    }} />
  );
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: T.textMuted }}>
      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>{icon}</div>
      <div style={{ fontSize: 18, fontWeight: 500, color: T.text, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14 }}>{subtitle}</div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9998,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: T.bgCard, borderRadius: 20, padding: "32px",
        border: `1px solid ${T.border}`, maxWidth: 400, width: "90%",
        animation: "fadeIn 0.2s ease",
      }}>
        <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 24, color: T.text }}>{message}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Btn variant="secondary" onClick={onCancel}>Annuler</Btn>
          <Btn variant="danger" onClick={onConfirm}>Supprimer</Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: T.bg,
      padding: 24,
    }}>
      <div style={{
        width: "100%", maxWidth: 400,
        animation: "fadeIn 0.5s ease",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            fontFamily: font.display, fontSize: 32, fontWeight: 300,
            color: T.text, letterSpacing: "0.04em",
          }}>
            L'Hair du Temps
          </div>
          <div style={{
            fontSize: 11, fontWeight: 600, color: T.textMuted,
            letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 8,
          }}>
            Espace Administration
          </div>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} style={{
          background: T.bgCard,
          borderRadius: 24,
          padding: "40px 32px",
          border: `1px solid ${T.border}`,
          boxShadow: `0 20px 60px ${T.bg}80`,
        }}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="admin@lhairdutemps.fr"
          />
          <Input
            label="Mot de passe"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
          />

          {error && (
            <div style={{
              padding: "10px 14px", borderRadius: 10, marginBottom: 16,
              background: T.dangerBg, color: T.danger, fontSize: 13,
              border: `1px solid ${T.danger}20`,
            }}>
              {error}
            </div>
          )}

          <Btn
            type="submit"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 14 }}
          >
            {loading ? <Spinner /> : "Se connecter"}
          </Btn>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SERVICES MANAGER
// ═══════════════════════════════════════════
const ICON_OPTIONS = [
  { value: "scissors", label: "Ciseaux ✂️" },
  { value: "brush", label: "Pinceau 🖌️" },
  { value: "sparkle", label: "Étoile ✨" },
  { value: "leaf", label: "Feuille 🌿" },
];

function ServiceForm({ item, onSave, onCancel, saving }) {
  const [form, setForm] = useState(
    item || { num: "", title: "", description: "", price: "", tags: [], icon_name: "scissors", featured: false }
  );
  const [tagInput, setTagInput] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      set("tags", [...form.tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (tag) => set("tags", form.tags.filter((t) => t !== tag));

  return (
    <div style={{
      background: T.bgCard, borderRadius: 20, padding: "32px",
      border: `1px solid ${T.gold}15`, marginBottom: 20,
      animation: "fadeIn 0.3s ease",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 16 }}>
        <Input label="N°" value={form.num} onChange={(v) => set("num", v)} placeholder="01" />
        <Input label="Titre" value={form.title} onChange={(v) => set("title", v)} placeholder="Coupe & Coiffage" />
      </div>
      <Input label="Description" value={form.description} onChange={(v) => set("description", v)} textarea placeholder="Description de la prestation..." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Input label="Prix" value={form.price} onChange={(v) => set("price", v)} placeholder="À partir de 35€" />
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Icône
          </label>
          <select
            value={form.icon_name}
            onChange={(e) => set("icon_name", e.target.value)}
            style={{
              width: "100%", padding: "12px 16px", borderRadius: 12,
              border: `1px solid ${T.border}`, background: T.bgInput,
              color: T.text, fontSize: 14,
            }}
          >
            {ICON_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Tags
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
          {form.tags.map((tag) => (
            <span key={tag} style={{
              padding: "4px 12px", borderRadius: 20, fontSize: 12,
              background: `${T.gold}15`, color: T.gold, border: `1px solid ${T.gold}25`,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {tag}
              <span onClick={() => removeTag(tag)} style={{ cursor: "pointer", opacity: 0.6 }}>×</span>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="Ajouter un tag..."
            style={{
              flex: 1, padding: "8px 14px", borderRadius: 10,
              border: `1px solid ${T.border}`, background: T.bgInput,
              color: T.text, fontSize: 13,
            }}
          />
          <Btn variant="secondary" onClick={addTag} style={{ padding: "8px 14px", fontSize: 12 }}>+</Btn>
        </div>
      </div>

      {/* Featured toggle */}
      <label style={{
        display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
        marginBottom: 24, fontSize: 14, color: T.text,
      }}>
        <div
          onClick={() => set("featured", !form.featured)}
          style={{
            width: 44, height: 24, borderRadius: 12, padding: 2,
            background: form.featured ? T.gold : T.border,
            transition: "background 0.2s",
          }}
        >
          <div style={{
            width: 20, height: 20, borderRadius: 10,
            background: "#fff",
            transform: form.featured ? "translateX(20px)" : "translateX(0)",
            transition: "transform 0.2s",
          }} />
        </div>
        Mise en avant
      </label>

      <div style={{ display: "flex", gap: 12 }}>
        <Btn onClick={() => onSave(form)} disabled={saving || !form.title || !form.price}>
          {saving ? <Spinner /> : item ? "Enregistrer" : "Ajouter"}
        </Btn>
        <Btn variant="secondary" onClick={onCancel}>Annuler</Btn>
      </div>
    </div>
  );
}

function ServicesTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | id
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = async () => {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (form) => {
    setSaving(true);
    if (editing === "new") {
      const { error } = await supabase.from("services").insert({ ...form, sort_order: items.length + 1 });
      if (!error) setToast({ message: "Prestation ajoutée", type: "success" });
      else setToast({ message: "Erreur: " + error.message, type: "error" });
    } else {
      const { error } = await supabase.from("services").update(form).eq("id", editing);
      if (!error) setToast({ message: "Prestation modifiée", type: "success" });
      else setToast({ message: "Erreur: " + error.message, type: "error" });
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    await supabase.from("services").delete().eq("id", id);
    setToast({ message: "Prestation supprimée", type: "success" });
    setConfirm(null);
    load();
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60 }}><Spinner /></div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: font.display, fontSize: 28, fontWeight: 400, color: T.text }}>Prestations</h2>
          <p style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>{items.length} prestation{items.length > 1 ? "s" : ""}</p>
        </div>
        {editing === null && (
          <Btn onClick={() => setEditing("new")}>+ Ajouter</Btn>
        )}
      </div>

      {editing === "new" && (
        <ServiceForm onSave={save} onCancel={() => setEditing(null)} saving={saving} />
      )}

      {items.length === 0 && editing === null && (
        <EmptyState icon="✂️" title="Aucune prestation" subtitle="Ajoutez votre première prestation" />
      )}

      {items.map((item) =>
        editing === item.id ? (
          <ServiceForm key={item.id} item={item} onSave={save} onCancel={() => setEditing(null)} saving={saving} />
        ) : (
          <div key={item.id} style={{
            background: T.bgCard, borderRadius: 16, padding: "20px 24px",
            border: `1px solid ${T.border}`, marginBottom: 12,
            display: "flex", alignItems: "center", gap: 16,
            animation: "slideIn 0.3s ease",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `linear-gradient(135deg, ${T.cognac}20, ${T.gold}15)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>
              {item.icon_name === "scissors" ? "✂️" : item.icon_name === "brush" ? "🖌️" : item.icon_name === "sparkle" ? "✨" : "🌿"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{item.title}</span>
                {item.featured && (
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 6,
                    background: `${T.gold}15`, color: T.gold, fontWeight: 600,
                  }}>EN AVANT</span>
                )}
              </div>
              <div style={{ fontSize: 13, color: T.textMuted, marginTop: 2 }}>{item.price}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="ghost" onClick={() => setEditing(item.id)}>Modifier</Btn>
              <Btn variant="ghost" onClick={() => setConfirm(item.id)} style={{ color: T.danger }}>Supprimer</Btn>
            </div>
          </div>
        )
      )}

      {confirm && <ConfirmModal message="Supprimer cette prestation ?" onConfirm={() => remove(confirm)} onCancel={() => setConfirm(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════
// TESTIMONIALS MANAGER
// ═══════════════════════════════════════════
function TestimonialForm({ item, onSave, onCancel, saving }) {
  const [form, setForm] = useState(item || { name: "", text: "", rating: 5 });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div style={{
      background: T.bgCard, borderRadius: 20, padding: "32px",
      border: `1px solid ${T.gold}15`, marginBottom: 20,
      animation: "fadeIn 0.3s ease",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 16 }}>
        <Input label="Nom" value={form.name} onChange={(v) => set("name", v)} placeholder="Marie D." />
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Note
          </label>
          <div style={{ display: "flex", gap: 4, paddingTop: 8 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                onClick={() => set("rating", n)}
                style={{
                  fontSize: 22, cursor: "pointer",
                  color: n <= form.rating ? T.gold : T.border,
                  transition: "color 0.15s",
                  filter: n <= form.rating ? `drop-shadow(0 0 4px ${T.gold}40)` : "none",
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
      <Input label="Avis" value={form.text} onChange={(v) => set("text", v)} textarea placeholder="Leur avis sur le salon..." />
      <div style={{ display: "flex", gap: 12 }}>
        <Btn onClick={() => onSave(form)} disabled={saving || !form.name || !form.text}>
          {saving ? <Spinner /> : item ? "Enregistrer" : "Ajouter"}
        </Btn>
        <Btn variant="secondary" onClick={onCancel}>Annuler</Btn>
      </div>
    </div>
  );
}

function TestimonialsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (form) => {
    setSaving(true);
    if (editing === "new") {
      const { error } = await supabase.from("testimonials").insert({ ...form, sort_order: items.length + 1 });
      if (!error) setToast({ message: "Avis ajouté", type: "success" });
      else setToast({ message: "Erreur: " + error.message, type: "error" });
    } else {
      const { error } = await supabase.from("testimonials").update(form).eq("id", editing);
      if (!error) setToast({ message: "Avis modifié", type: "success" });
      else setToast({ message: "Erreur: " + error.message, type: "error" });
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    await supabase.from("testimonials").delete().eq("id", id);
    setToast({ message: "Avis supprimé", type: "success" });
    setConfirm(null);
    load();
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60 }}><Spinner /></div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: font.display, fontSize: 28, fontWeight: 400 }}>Avis clients</h2>
          <p style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>{items.length} avis</p>
        </div>
        {editing === null && <Btn onClick={() => setEditing("new")}>+ Ajouter</Btn>}
      </div>

      {editing === "new" && (
        <TestimonialForm onSave={save} onCancel={() => setEditing(null)} saving={saving} />
      )}

      {items.length === 0 && editing === null && (
        <EmptyState icon="💬" title="Aucun avis" subtitle="Ajoutez votre premier avis client" />
      )}

      {items.map((item) =>
        editing === item.id ? (
          <TestimonialForm key={item.id} item={item} onSave={save} onCancel={() => setEditing(null)} saving={saving} />
        ) : (
          <div key={item.id} style={{
            background: T.bgCard, borderRadius: 16, padding: "20px 24px",
            border: `1px solid ${T.border}`, marginBottom: 12,
            animation: "slideIn 0.3s ease",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: `linear-gradient(135deg, ${T.cognac}, ${T.gold})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: font.display, fontSize: 18, fontWeight: 600, color: "#fff",
                flexShrink: 0,
              }}>
                {item.name[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{item.name}</span>
                  <div style={{ display: "flex", gap: 2 }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} style={{ color: i < item.rating ? T.gold : T.border, fontSize: 12 }}>★</span>
                    ))}
                  </div>
                </div>
                <p style={{
                  fontSize: 13, color: T.textMuted, lineHeight: 1.5,
                  overflow: "hidden", textOverflow: "ellipsis",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                }}>
                  {item.text}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <Btn variant="ghost" onClick={() => setEditing(item.id)}>Modifier</Btn>
                <Btn variant="ghost" onClick={() => setConfirm(item.id)} style={{ color: T.danger }}>Supprimer</Btn>
              </div>
            </div>
          </div>
        )
      )}

      {confirm && <ConfirmModal message="Supprimer cet avis ?" onConfirm={() => remove(confirm)} onCancel={() => setConfirm(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════
// PHOTOS MANAGER
// ═══════════════════════════════════════════
function PhotosTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [editingLabel, setEditingLabel] = useState(null);
  const [labelValue, setLabelValue] = useState("");
  const fileRef = useRef(null);

  const load = async () => {
    const { data } = await supabase.from("photos").select("*").order("sort_order");
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const name = `${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("photos").upload(name, file);

    if (uploadErr) {
      setToast({ message: "Erreur upload: " + uploadErr.message, type: "error" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("photos").getPublicUrl(name);
    const { error } = await supabase.from("photos").insert({
      url: urlData.publicUrl,
      label: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      sort_order: items.length + 1,
    });

    if (!error) setToast({ message: "Photo ajoutée", type: "success" });
    else setToast({ message: "Erreur: " + error.message, type: "error" });

    setUploading(false);
    fileRef.current.value = "";
    load();
  };

  const remove = async (item) => {
    // Delete from storage
    const fileName = item.url.split("/").pop();
    await supabase.storage.from("photos").remove([fileName]);
    // Delete from DB
    await supabase.from("photos").delete().eq("id", item.id);
    setToast({ message: "Photo supprimée", type: "success" });
    setConfirm(null);
    load();
  };

  const saveLabel = async (id) => {
    await supabase.from("photos").update({ label: labelValue }).eq("id", id);
    setEditingLabel(null);
    setToast({ message: "Légende modifiée", type: "success" });
    load();
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60 }}><Spinner /></div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: font.display, fontSize: 28, fontWeight: 400 }}>Photos</h2>
          <p style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>{items.length} photo{items.length > 1 ? "s" : ""}</p>
        </div>
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={upload} style={{ display: "none" }} />
          <Btn onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <><Spinner /> Upload...</> : "+ Ajouter une photo"}
          </Btn>
        </div>
      </div>

      {items.length === 0 && (
        <EmptyState icon="📷" title="Aucune photo" subtitle="Ajoutez votre première photo" />
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {items.map((item) => (
          <div key={item.id} style={{
            background: T.bgCard, borderRadius: 16, overflow: "hidden",
            border: `1px solid ${T.border}`,
            animation: "fadeIn 0.3s ease",
          }}>
            <div style={{
              height: 180, backgroundImage: `url(${item.url})`,
              backgroundSize: "cover", backgroundPosition: "center",
              position: "relative",
            }}>
              <Btn
                variant="ghost"
                onClick={() => setConfirm(item)}
                style={{
                  position: "absolute", top: 8, right: 8,
                  background: "rgba(0,0,0,0.6)", color: T.danger,
                  borderRadius: 10, padding: "6px 10px", fontSize: 12,
                  backdropFilter: "blur(8px)",
                }}
              >
                Supprimer
              </Btn>
            </div>
            <div style={{ padding: "14px 16px" }}>
              {editingLabel === item.id ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={labelValue}
                    onChange={(e) => setLabelValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveLabel(item.id)}
                    autoFocus
                    style={{
                      flex: 1, padding: "6px 10px", borderRadius: 8,
                      border: `1px solid ${T.gold}`, background: T.bgInput,
                      color: T.text, fontSize: 13,
                    }}
                  />
                  <Btn variant="secondary" onClick={() => saveLabel(item.id)} style={{ padding: "6px 12px", fontSize: 12 }}>OK</Btn>
                </div>
              ) : (
                <div
                  onClick={() => { setEditingLabel(item.id); setLabelValue(item.label); }}
                  style={{ fontSize: 14, color: T.text, cursor: "pointer" }}
                  title="Cliquez pour modifier"
                >
                  {item.label}
                  <span style={{ fontSize: 11, color: T.textMuted, marginLeft: 8 }}>✎</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {confirm && <ConfirmModal message="Supprimer cette photo ?" onConfirm={() => remove(confirm)} onCancel={() => setConfirm(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════
// ADMIN DASHBOARD LAYOUT
// ═══════════════════════════════════════════
const TABS = [
  { id: "services", label: "Prestations", icon: "✂️" },
  { id: "testimonials", label: "Avis clients", icon: "💬" },
  { id: "photos", label: "Photos", icon: "📷" },
];

function Dashboard({ onLogout }) {
  const [tab, setTab] = useState("services");

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <aside style={{
        width: 260, background: T.bgCard, borderRight: `1px solid ${T.border}`,
        padding: "32px 0", display: "flex", flexDirection: "column",
        position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ padding: "0 24px", marginBottom: 40 }}>
          <div style={{ fontFamily: font.display, fontSize: 22, fontWeight: 300, color: T.text }}>
            L'Hair du Temps
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: T.textMuted, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>
            Administration
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                width: "100%", padding: "14px 24px",
                display: "flex", alignItems: "center", gap: 12,
                background: tab === t.id ? `${T.gold}10` : "transparent",
                border: "none", borderLeft: tab === t.id ? `3px solid ${T.gold}` : "3px solid transparent",
                color: tab === t.id ? T.text : T.textMuted,
                fontSize: 14, fontWeight: tab === t.id ? 600 : 400,
                transition: "all 0.2s",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "0 24px" }}>
          <a
            href="/"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 0", color: T.textMuted, textDecoration: "none",
              fontSize: 13, marginBottom: 8,
            }}
          >
            ← Voir le site
          </a>
          <Btn variant="ghost" onClick={onLogout} style={{ color: T.textMuted, padding: "8px 0", fontSize: 13 }}>
            Se déconnecter
          </Btn>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 260, padding: "40px 48px", maxWidth: 960 }}>
        {tab === "services" && <ServicesTab />}
        {tab === "testimonials" && <TestimonialsTab />}
        {tab === "photos" && <PhotosTab />}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════
// NO SUPABASE CONFIGURED
// ═══════════════════════════════════════════
function SetupGuide() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: T.bg, padding: 24,
    }}>
      <div style={{
        maxWidth: 560, width: "100%",
        animation: "fadeIn 0.5s ease",
      }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: font.display, fontSize: 32, fontWeight: 300, color: T.text }}>
            L'Hair du Temps
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 8 }}>
            Configuration requise
          </div>
        </div>
        <div style={{
          background: T.bgCard, borderRadius: 24, padding: "40px 32px",
          border: `1px solid ${T.border}`,
        }}>
          <h2 style={{ fontFamily: font.display, fontSize: 24, fontWeight: 400, marginBottom: 20 }}>Configurer Supabase</h2>
          <ol style={{ fontSize: 14, lineHeight: 2, color: T.textMuted, paddingLeft: 20 }}>
            <li>Créez un projet sur <span style={{ color: T.gold }}>supabase.com</span></li>
            <li>Exécutez le fichier <span style={{ color: T.gold }}>supabase-setup.sql</span> dans l'éditeur SQL</li>
            <li>Créez un utilisateur dans Authentication &gt; Users</li>
            <li>Ajoutez un fichier <span style={{ color: T.gold }}>.env</span> à la racine du projet :</li>
          </ol>
          <pre style={{
            background: T.bgInput, padding: "16px 20px", borderRadius: 12,
            fontSize: 13, color: T.gold, marginTop: 12, overflowX: "auto",
            border: `1px solid ${T.border}`,
          }}>
{`VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon`}
          </pre>
          <p style={{ fontSize: 13, color: T.textMuted, marginTop: 16 }}>
            Puis relancez le serveur de développement.
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════
function AdminApp() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.bg }}>
        <GlobalStyle />
        <Spinner />
      </div>
    );
  }

  if (!supabase) {
    return <><GlobalStyle /><SetupGuide /></>;
  }

  return (
    <>
      <GlobalStyle />
      {session ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={setSession} />
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
