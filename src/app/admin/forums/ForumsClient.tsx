'use client';

import { useState } from 'react';

interface Forum {
  id: string; name: string; description: string | null; imageUrl: string | null;
  slug: string; postCount: number; order: number; groupId: string;
}
interface Group { id: string; name: string; order: number; forums: Forum[]; }

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 13px', borderRadius: 8,
  border: '1.5px solid #e0e0e0', fontSize: 14, color: '#111',
  background: '#fff', outline: 'none', boxSizing: 'border-box',
};
const btnPrimary: React.CSSProperties = {
  padding: '10px 20px', borderRadius: 8, border: 'none',
  background: '#00aff0', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
};
const btnDanger: React.CSSProperties = {
  padding: '6px 14px', borderRadius: 7, border: 'none',
  background: '#fff0f3', color: '#e50935', fontSize: 12, fontWeight: 700, cursor: 'pointer',
};
const btnGhost: React.CSSProperties = {
  padding: '6px 14px', borderRadius: 7, border: '1.5px solid #e0e0e0',
  background: '#fff', color: '#555', fontSize: 12, fontWeight: 600, cursor: 'pointer',
};

export default function ForumsClient({ initialGroups }: { initialGroups: Group[] }) {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Group modal
  const [groupModal, setGroupModal] = useState<{ open: boolean; editing: Group | null }>({ open: false, editing: null });
  const [groupName, setGroupName] = useState('');
  const [groupOrder, setGroupOrder] = useState('0');

  // Forum modal
  const [forumModal, setForumModal] = useState<{ open: boolean; editing: Forum | null; groupId: string }>({ open: false, editing: null, groupId: '' });
  const [forumName, setForumName] = useState('');
  const [forumDesc, setForumDesc] = useState('');
  const [forumImage, setForumImage] = useState('');
  const [forumOrder, setForumOrder] = useState('0');
  const [forumPostCount, setForumPostCount] = useState('0');

  async function reload() {
    const res = await fetch('/api/admin/forums/groups');
    const data = await res.json();
    setGroups(data);
  }

  // ── Group actions ──
  function openNewGroup() {
    setGroupName(''); setGroupOrder('0');
    setGroupModal({ open: true, editing: null });
  }
  function openEditGroup(g: Group) {
    setGroupName(g.name); setGroupOrder(String(g.order));
    setGroupModal({ open: true, editing: g });
  }
  async function saveGroup() {
    setLoading(true); setError('');
    const { editing } = groupModal;
    const url = editing ? `/api/admin/forums/groups/${editing.id}` : '/api/admin/forums/groups';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: groupName, order: Number(groupOrder) }) });
    if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed'); }
    else { setGroupModal({ open: false, editing: null }); await reload(); }
    setLoading(false);
  }
  async function deleteGroup(id: string) {
    if (!confirm('Delete this group and ALL its forums?')) return;
    setLoading(true);
    await fetch(`/api/admin/forums/groups/${id}`, { method: 'DELETE' });
    await reload();
    setLoading(false);
  }

  // ── Forum actions ──
  function openNewForum(groupId: string) {
    setForumName(''); setForumDesc(''); setForumImage(''); setForumOrder('0'); setForumPostCount('0');
    setForumModal({ open: true, editing: null, groupId });
  }
  function openEditForum(f: Forum) {
    setForumName(f.name); setForumDesc(f.description || ''); setForumImage(f.imageUrl || '');
    setForumOrder(String(f.order)); setForumPostCount(String(f.postCount));
    setForumModal({ open: true, editing: f, groupId: f.groupId });
  }
  async function saveForum() {
    setLoading(true); setError('');
    const { editing, groupId } = forumModal;
    const url = editing ? `/api/admin/forums/${editing.id}` : '/api/admin/forums';
    const method = editing ? 'PUT' : 'POST';
    const body = { groupId, name: forumName, description: forumDesc, imageUrl: forumImage, order: Number(forumOrder), postCount: Number(forumPostCount) };
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed'); }
    else { setForumModal({ open: false, editing: null, groupId: '' }); await reload(); }
    setLoading(false);
  }
  async function deleteForum(id: string) {
    if (!confirm('Delete this forum?')) return;
    setLoading(true);
    await fetch(`/api/admin/forums/${id}`, { method: 'DELETE' });
    await reload();
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 820 }}>
      {error && <div style={{ background: '#fff0f3', border: '1px solid #fecdd3', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#e50935' }}>{error}</div>}

      <div style={{ marginBottom: 20 }}>
        <button onClick={openNewGroup} style={btnPrimary}>+ Add Forum Group</button>
      </div>

      {groups.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa', fontSize: 15 }}>No forum groups yet. Create one above.</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {groups.map(group => (
          <div key={group.id} style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 12, overflow: 'hidden' }}>

            {/* Group header */}
            <div style={{ background: 'linear-gradient(135deg,#1a73e8,#0d5fc4)', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>{group.name}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => openEditGroup(group)} style={{ ...btnGhost, fontSize: 11 }}>Edit</button>
                <button onClick={() => deleteGroup(group.id)} style={{ ...btnDanger, fontSize: 11 }}>Delete</button>
              </div>
            </div>

            {/* Forums list */}
            {group.forums.map((forum, i) => (
              <div key={forum.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', borderTop: i === 0 ? '1px solid #f0f0f0' : '1px solid #f0f0f0' }}>
                {/* Image */}
                <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 6, overflow: 'hidden', background: '#f0f0f0', border: '1px solid #e0e0e0' }}>
                  {forum.imageUrl
                    ? <img src={forum.imageUrl} alt={forum.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: 18 }}>📋</div>
                  }
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{forum.name}</div>
                  {forum.description && <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{forum.description}</div>}
                  <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{forum.postCount.toLocaleString()} posts</div>
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => openEditForum(forum)} style={btnGhost}>Edit</button>
                  <button onClick={() => deleteForum(forum.id)} style={btnDanger}>Delete</button>
                </div>
              </div>
            ))}

            {/* Add forum button */}
            <div style={{ padding: '10px 18px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
              <button onClick={() => openNewForum(group.id)}
                style={{ background: 'none', border: 'none', color: '#00aff0', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                + Add Forum
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Group Modal ── */}
      {groupModal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: '#111' }}>
              {groupModal.editing ? 'Edit Group' : 'New Forum Group'}
            </h2>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Group Name *</label>
              <input value={groupName} onChange={e => setGroupName(e.target.value)} style={inputStyle} placeholder="e.g. DESI VIDEOS AND PICS (DVP)" />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>Display Order</label>
              <input type="number" value={groupOrder} onChange={e => setGroupOrder(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setGroupModal({ open: false, editing: null })} style={btnGhost}>Cancel</button>
              <button onClick={saveGroup} disabled={loading || !groupName.trim()} style={{ ...btnPrimary, opacity: loading || !groupName.trim() ? 0.6 : 1 }}>
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Forum Modal ── */}
      {forumModal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: '#111' }}>
              {forumModal.editing ? 'Edit Forum' : 'New Forum'}
            </h2>
            {[
              { label: 'Forum Name *', value: forumName, set: setForumName, placeholder: 'e.g. Desi new videoz hd / sd' },
              { label: 'Description', value: forumDesc, set: setForumDesc, placeholder: 'Short description shown below the name' },
              { label: 'Image URL', value: forumImage, set: setForumImage, placeholder: 'https://example.com/image.jpg' },
              { label: 'Post Count', value: forumPostCount, set: setForumPostCount, placeholder: '0', type: 'number' },
              { label: 'Display Order', value: forumOrder, set: setForumOrder, placeholder: '0', type: 'number' },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{f.label}</label>
                <input type={f.type || 'text'} value={f.value} onChange={e => f.set(e.target.value)} style={inputStyle} placeholder={f.placeholder} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
              <button onClick={() => setForumModal({ open: false, editing: null, groupId: '' })} style={btnGhost}>Cancel</button>
              <button onClick={saveForum} disabled={loading || !forumName.trim()} style={{ ...btnPrimary, opacity: loading || !forumName.trim() ? 0.6 : 1 }}>
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
