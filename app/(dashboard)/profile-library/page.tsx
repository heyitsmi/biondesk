'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileAsset, ProfileAssetType } from '@/lib/types'; // You might need to export this if not available
// If types are not exported to client easily, define locally matching the shape
interface Asset extends ProfileAsset {
  // mapped properties for easier UI usage?
}

export default function ProfileLibraryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'testimonials' | 'snippets'>('portfolio');
  const [isLoading, setIsLoading] = useState(true);
  
  // Data
  const [profile, setProfile] = useState<Partial<ProfileAsset>>({
    title: 'Your Name',
    image_url: 'Product Designer', // Job Title
    content: 'Brief bio...',
    tags: []
  });
  const [portfolios, setPortfolios] = useState<ProfileAsset[]>([]);
  const [testimonials, setTestimonials] = useState<ProfileAsset[]>([]);
  const [snippets, setSnippets] = useState<ProfileAsset[]>([]);

  // UI State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ProfileAsset> | null>(null);
  const [modalType, setModalType] = useState<ProfileAssetType | 'profile'>('portfolio');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Menu State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Add Skill Input
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  // Fetch Data
  useEffect(() => {
    fetchData();
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [profileRes, assetsRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/profile-assets')
      ]);

      if (profileRes.ok) {
        const pData = await profileRes.json();
        if (pData && pData.id) setProfile(pData);
      }

      if (assetsRes.ok) {
        const data = await assetsRes.json();
        // data object check
        const assets = data.data || data || []; // Handle API response structure wrapper
        if (Array.isArray(assets)) {
             setPortfolios(assets.filter((a: any) => a.type === 'portfolio'));
             setTestimonials(assets.filter((a: any) => a.type === 'testimonial'));
             setSnippets(assets.filter((a: any) => a.type === 'snippet'));
        }
      }
    } catch (error) {
      console.error('Failed to load data', error);
      showToast('Failed to load library data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    
    try {
      const res = await fetch(`/api/profile-assets/${deleteConfirmId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      
      showToast('Item deleted successfully');
      setDeleteConfirmId(null);
      fetchData(); // Refresh
    } catch (error) {
       showToast('Failed to delete item', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    
    setIsSubmitting(true);
    try {
      let url = '/api/profile-assets';
      let method = 'POST';

      if (modalType === 'profile') {
        url = '/api/profile';
        method = 'PUT';
      } else if (editingItem.id) {
        url = `/api/profile-assets/${editingItem.id}`;
        method = 'PUT';
      }

      const body = { 
        ...editingItem,
        type: modalType === 'profile' ? 'profile_info' : modalType 
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to save');

      showToast('Saved successfully');
      setEditingItem(null); // Close modal
      fetchData(); // Refresh
    } catch (error) {
      showToast('Failed to save changes', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = async () => {
    if (!skillInput.trim()) return;
    const newTags = [...(profile.tags || []), skillInput.trim()];
    
    // Optimistic update
    setProfile(prev => ({ ...prev, tags: newTags }));
    setSkillInput('');
    setShowSkillInput(false);

    // Save to DB
    try {
        await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...profile, tags: newTags })
        });
    } catch (e) {
        // Revert on error?
    }
  };

  const removeSkill = async (skillToRemove: string) => {
    const newTags = (profile.tags || []).filter(t => t !== skillToRemove);
    setProfile(prev => ({ ...prev, tags: newTags }));

     // Save to DB
     try {
        await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...profile, tags: newTags })
        });
    } catch (e) {}
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard');
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-white">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium z-[60] animate-in slide-in-from-bottom-4 duration-300 ${
          toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'
        }`}>
          <i className={`ph-fill ${toast.type === 'error' ? 'ph-warning-circle' : 'ph-check-circle text-emerald-400'} text-lg`} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="h-16 px-4 md:px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Profile Library</h1>
          <div className="hidden md:block h-6 w-px bg-slate-200"></div>
          <p className="hidden md:block text-sm text-slate-500">Manage assets for AI-generated proposals.</p>
        </div>

        <button 
           onClick={() => setShowAddModal(true)}
           className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 transition-all"
        >
          <i className="ph-bold ph-plus"></i>
          <span className="hidden md:inline">Add Asset</span>
          <span className="inline md:hidden">Add</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
        <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Identity Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6 flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden relative group cursor-pointer self-center md:self-start">
                    {/* Placeholder Avatar */}
                     <img 
                        src={`https://ui-avatars.com/api/?name=${profile.title || 'User'}&background=0f172a&color=fff&size=128`} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <i className="ph-bold ph-camera text-white"></i>
                    </div>
                </div>
                
                <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-start mb-4 gap-4 md:gap-0 text-center md:text-left">
                        <div className="w-full md:w-auto">
                            <h2 className="text-lg font-semibold text-slate-900">{profile.title || 'Your Name'}</h2>
                            <p className="text-sm text-slate-500">{profile.image_url || 'Job Title'}</p>
                        </div>
                        <button 
                            onClick={() => {
                                setEditingItem(profile);
                                setModalType('profile');
                            }}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors w-full md:w-auto"
                        >
                            Edit Profile
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 block">Short Bio (Used for Intro)</label>
                            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                {profile.content || 'No bio added yet.'}
                            </p>
                        </div>
                        
                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 block">Core Skills</label>
                            <div className="flex flex-wrap gap-2">
                                {(profile.tags || []).map((skill, idx) => (
                                    <span key={idx} className="group relative px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200 flex items-center gap-1">
                                        {skill}
                                        <button onClick={() => removeSkill(skill)} className="hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                                            <i className="ph-bold ph-x"></i>
                                        </button>
                                    </span>
                                ))}
                                
                                {showSkillInput ? (
                                    <div className="relative">
                                         <input 
                                            type="text" 
                                            autoFocus
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if(e.key === 'Enter') addSkill();
                                                if(e.key === 'Escape') {
                                                    setShowSkillInput(false);
                                                    setSkillInput('');
                                                }
                                            }}
                                            onBlur={() => {
                                                if (skillInput) addSkill();
                                                else setShowSkillInput(false);
                                            }}
                                            className="w-24 px-2.5 py-1 rounded-full border border-indigo-300 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                                            placeholder="Type..."
                                        />
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setShowSkillInput(true)}
                                        className="px-2.5 py-1 rounded-full border border-dashed border-slate-300 text-slate-400 text-xs font-medium hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                                    >
                                        + Add Skill
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div>
                <div className="border-b border-slate-200 mb-6 overflow-x-auto">
                    <nav className="-mb-px flex gap-6 min-w-max" aria-label="Tabs">
                        <button 
                            onClick={() => setActiveTab('portfolio')}
                            className={`border-b-2 py-4 px-1 text-sm font-semibold transition-colors whitespace-nowrap ${
                                activeTab === 'portfolio' 
                                    ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50' 
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            Portfolio Items <span className={`py-0.5 px-2 rounded-full text-xs ml-1 ${activeTab === 'portfolio' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>{portfolios.length}</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('testimonials')}
                            className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors whitespace-nowrap ${
                                activeTab === 'testimonials' 
                                    ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50' 
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            Testimonials <span className={`py-0.5 px-2 rounded-full text-xs ml-1 ${activeTab === 'testimonials' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>{testimonials.length}</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('snippets')}
                            className={`border-b-2 py-4 px-1 text-sm font-medium transition-colors whitespace-nowrap ${
                                activeTab === 'snippets' 
                                    ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50' 
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            Text Snippets
                        </button>
                    </nav>
                </div>

                {/* --- PORTFOLIO --- */}
                {activeTab === 'portfolio' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {portfolios.map(item => (
                            <div key={item.id} className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2 relative">
                                        <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                                        <button 
                                            className="text-slate-400 hover:text-slate-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenuId(activeMenuId === item.id ? null : item.id);
                                            }}
                                        >
                                            <i className="ph-bold ph-dots-three"></i>
                                        </button>
                                        
                                        {/* Dropdown Menu */}
                                        {activeMenuId === item.id && (
                                            <div ref={menuRef} className="absolute top-6 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-30 w-40 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                                                <button 
                                                    onClick={() => { setEditingItem(item); setModalType('portfolio'); setActiveMenuId(null); }}
                                                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                                                >
                                                    <i className="ph ph-pencil-simple"></i> Edit Item
                                                </button>
                                                <button 
                                                    onClick={() => { setDeleteConfirmId(item.id); setActiveMenuId(null); }}
                                                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                                                >
                                                    <i className="ph ph-trash"></i> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-3 mb-4">
                                        {item.content}
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                        {(item.tags || []).map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-medium text-slate-600">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button 
                            onClick={() => { setEditingItem({}); setModalType('portfolio'); }}
                            className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center h-full min-h-[280px] text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-slate-50/50 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                <i className="ph-bold ph-plus text-lg"></i>
                            </div>
                            <span className="text-sm font-semibold">Add Portfolio Item</span>
                        </button>
                    </div>
                )}

                {/* --- TESTIMONIALS --- */}
                {activeTab === 'testimonials' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {testimonials.map(item => (
                            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 font-bold text-sm text-indigo-600">
                                    {(item.title || 'A').substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                                            <p className="text-xs text-slate-500">{item.image_url || 'Client'}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingItem(item); setModalType('testimonial'); }} className="text-slate-400 hover:text-indigo-600"><i className="ph-bold ph-pencil-simple"></i></button>
                                            <button onClick={() => setDeleteConfirmId(item.id)} className="text-slate-400 hover:text-rose-600"><i className="ph-bold ph-trash"></i></button>
                                        </div>
                                    </div>
                                    <blockquote className="text-sm text-slate-600 italic border-l-2 border-indigo-200 pl-3 py-1">
                                        "{item.content}"
                                    </blockquote>
                                </div>
                            </div>
                        ))}

                        <button onClick={() => { setEditingItem({}); setModalType('testimonial'); }} className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-sm font-semibold text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                            <i className="ph-bold ph-plus"></i> Add Testimonial
                        </button>
                    </div>
                )}

                {/* --- SNIPPETS --- */}
                {activeTab === 'snippets' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {snippets.map(item => (
                            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-indigo-300 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600">{item.title}</h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => copyToClipboard(item.content || '')} className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Copy</button>
                                        <button onClick={() => { setEditingItem(item); setModalType('snippet'); }} className="text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"><i className="ph-bold ph-pencil-simple"></i></button>
                                        <button onClick={() => setDeleteConfirmId(item.id)} className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"><i className="ph-bold ph-trash"></i></button>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 font-mono bg-slate-50 p-3 rounded border border-slate-100">
                                    {item.content}
                                </p>
                            </div>
                        ))}

                        <button onClick={() => { setEditingItem({}); setModalType('snippet'); }} className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-sm font-semibold text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                            <i className="ph-bold ph-plus"></i> Add Snippet
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* 1. Add Selection Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
             <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-base font-semibold text-slate-900">Add New Asset</h3>
                    <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><i className="ph-bold ph-x"></i></button>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button onClick={() => { setShowAddModal(false); setEditingItem({}); setModalType('portfolio'); }} className="p-4 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center gap-2 group">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-indigo-600">
                            <i className="ph-bold ph-image text-lg"></i>
                        </div>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">Portfolio</span>
                    </button>
                    <button onClick={() => { setShowAddModal(false); setEditingItem({}); setModalType('testimonial'); }} className="p-4 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center gap-2 group">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-indigo-600">
                            <i className="ph-bold ph-quotes text-lg"></i>
                        </div>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">Testimonial</span>
                    </button>
                    <button onClick={() => { setShowAddModal(false); setEditingItem({}); setModalType('snippet'); }} className="p-4 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center gap-2 group">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-indigo-600">
                            <i className="ph-bold ph-text-t text-lg"></i>
                        </div>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">Snippet</span>
                    </button>
                </div>
             </div>
        </div>
      )}

      {/* 2. Generic Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => !isSubmitting && setEditingItem(null)}></div>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-base font-semibold text-slate-900">
                        {editingItem.id ? 'Edit' : 'Add'} {modalType === 'profile' ? 'Profile' : modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                    </h3>
                    <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600"><i className="ph-bold ph-x"></i></button>
                </div>
                
                <form onSubmit={handleSave} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-4">
                        {modalType === 'profile' && (
                             <>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Display Name</label>
                                    <input type="text" required value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Job Title</label>
                                    <input type="text" value={editingItem.image_url || ''} onChange={e => setEditingItem({...editingItem, image_url: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Short Bio</label>
                                    <textarea rows={3} value={editingItem.content || ''} onChange={e => setEditingItem({...editingItem, content: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1"></textarea>
                                </div>
                             </>
                        )}

                        {modalType === 'portfolio' && (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Title</label>
                                    <input type="text" required value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} placeholder="e.g. Fintech Dashboard" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Category / Tags</label>
                                    <input type="text" value={(editingItem.tags || []).join(', ')} onChange={e => setEditingItem({...editingItem, tags: e.target.value.split(',').map(s => s.trim())})} placeholder="e.g. SaaS, Mobile" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1" />
                                    <p className="text-xs text-slate-400 mt-1">Separate with commas</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Description</label>
                                    <textarea rows={3} value={editingItem.content || ''} onChange={e => setEditingItem({...editingItem, content: e.target.value})} placeholder="Project description..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1"></textarea>
                                </div>
                            </>
                        )}

                        {modalType === 'testimonial' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Client Name</label>
                                        <input type="text" required value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} placeholder="John Doe" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Role/Company</label>
                                        <input type="text" value={editingItem.image_url || ''} onChange={e => setEditingItem({...editingItem, image_url: e.target.value})} placeholder="CEO at Acme" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Quote</label>
                                    <textarea rows={3} required value={editingItem.content || ''} onChange={e => setEditingItem({...editingItem, content: e.target.value})} placeholder="Great experience..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1" />
                                </div>
                            </>
                        )}

                        {modalType === 'snippet' && (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Title</label>
                                    <input type="text" required value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} placeholder="e.g. Intro" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Content</label>
                                    <textarea rows={4} required value={editingItem.content || ''} onChange={e => setEditingItem({...editingItem, content: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1 font-mono text-xs" />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                        <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50">
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* 3. Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)}></div>
             <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-4 text-rose-600">
                        <i className="ph-bold ph-warning text-xl"></i>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">Delete Item?</h3>
                    <p className="text-sm text-slate-600 mb-6">This action cannot be undone.</p>
                    <div className="flex gap-2 w-full">
                        <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                        <button onClick={handleDelete} className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors">Delete</button>
                    </div>
                </div>
             </div>
        </div>
      )}

    </div>
  );
}
