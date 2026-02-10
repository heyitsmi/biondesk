'use client';

import { useState, useEffect, useRef } from 'react';
import { contactsApi } from '@/lib/api';
import { Contact, ContactType } from '@/lib/types';
import Link from 'next/link';

// === MODAL COMPONENT ===
interface ContactModalProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    contact?: Contact | null;
    onClose: () => void;
    onSave: () => void;
}

function ContactModal({ isOpen, mode, contact, onClose, onSave }: ContactModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        first_name: '',
        last_name: '',
        email: '',
        company: '',
        type: 'lead' as ContactType,
        phone: '',
        notes: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && contact) {
                const nameParts = contact.name.split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';
                
                setFormData({
                    name: contact.name,
                    first_name: firstName,
                    last_name: lastName,
                    email: contact.email || '',
                    company: contact.company || '',
                    type: contact.type,
                    phone: contact.phone || '',
                    notes: contact.notes || ''
                });
            } else {
                setFormData({
                    name: '',
                    first_name: '',
                    last_name: '',
                    email: '',
                    company: '',
                    type: 'lead',
                    phone: '',
                    notes: ''
                });
            }
        }
    }, [isOpen, mode, contact]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const fullName = `${formData.first_name} ${formData.last_name}`.trim() || formData.name;
            const data = {
                name: fullName,
                email: formData.email || null,
                company: formData.company || null,
                type: formData.type,
                phone: formData.phone || null,
                notes: formData.notes || null,
            };

            if (mode === 'create') {
                await contactsApi.create(data);
            } else if (mode === 'edit' && contact) {
                await contactsApi.update(contact.id, data);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Failed to save contact:', error);
            alert('Failed to save contact.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-modal transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-lg font-[600] text-slate-900" id="modal-title">
                            {mode === 'create' ? 'Add New Contact' : 'Edit Contact'}
                        </h3>
                        <button onClick={onClose} type="button" className="text-slate-400 hover:text-slate-600 transition-colors">
                            <i className="ph-bold ph-x text-lg"></i>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-[500] text-slate-700">First Name</label>
                                    <input type="text" required className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400" placeholder="e.g. Jane" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-[500] text-slate-700">Last Name</label>
                                    <input type="text" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400" placeholder="e.g. Doe" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-[500] text-slate-700">Email Address</label>
                                <div className="relative">
                                    <i className="ph ph-envelope-simple absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                    <input type="email" className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400" placeholder="jane@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-[500] text-slate-700">Company Name</label>
                                <div className="relative">
                                    <i className="ph ph-buildings absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                    <input type="text" className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400" placeholder="Acme Inc." value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-[500] text-slate-700">Status</label>
                                <select className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-600 cursor-pointer" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as ContactType})}>
                                    <option value="lead">Lead</option>
                                    <option value="client">Client</option>
                                </select>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-[550] text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all">Cancel</button>
                            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-[550] text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
                                {isLoading && <i className="ph-bold ph-spinner animate-spin"></i>}
                                {mode === 'create' ? 'Save Contact' : 'Update Contact'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// === PAGE COMPONENT ===
export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit] = useState(10);
    const [filterType, setFilterType] = useState<'all' | 'client' | 'lead'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Stats for tabs (mocked or could be fetched separately if API supported it)
    // For now we will just show the total count in the tabs if possible, or just the current total.
    // The template shows specific counts for each tab. We'll simplify or fetch if we can.
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchContacts();
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setActiveActionMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [page, filterType, searchQuery]);

    const fetchContacts = async () => {
        setIsLoading(true);
        try {
            const data = await contactsApi.list({
                page,
                limit,
                search: searchQuery,
                type: filterType === 'all' ? undefined : filterType
            });
            setContacts(data.data);
            setTotal(data.total);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setModalMode('create');
        setSelectedContact(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (contact: Contact) => {
        setModalMode('edit');
        setSelectedContact(contact);
        setIsModalOpen(true);
        setActiveActionMenuId(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this contact?')) return;
        try {
            await contactsApi.delete(id);
            fetchContacts();
            setActiveActionMenuId(null);
        } catch (error) {
            console.error('Failed to delete contact:', error);
            alert('Failed to delete contact.');
        }
    };

    // Helper for pagination range
    const totalPages = Math.ceil(total / limit);
    const getPageNumbers = () => {
        // Simple range for now: 1, 2, ..., totalPages. 
        // In a real app we'd truncate like 1 2 3 ... 8
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
             // Show first 3, last 1, and current neighbors? 
             // Simplest: just show all if < 7, else truncate
             pages.push(i);
        }
        return pages.slice(0, 5); // Just show first 5 for improved simplicity in this step
    };

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-white transition-all duration-300 ease-in-out">
            
            {/* Header with Search & Add (Sticky) */}
            <header className="h-auto md:h-16 px-4 md:px-8 py-4 md:py-0 flex flex-col md:flex-row items-start md:items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-20 shrink-0 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                    <h1 className="text-xl font-[600] text-slate-900 tracking-tight">Contacts</h1>
                    <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                    
                    {/* Mobile Add Button */}
                    <button 
                        onClick={handleOpenCreate}
                        className="md:hidden bg-indigo-600 active:bg-indigo-700 text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-subtle transition-colors"
                    >
                        <i className="ph-bold ph-plus"></i>
                    </button>
                </div>

                {/* Filters - Scrollable on mobile */}
                <div className="w-full md:w-auto overflow-x-auto pb-1 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex items-center gap-1 text-sm font-[500] text-slate-500 whitespace-nowrap">
                        <button 
                            onClick={() => { setFilterType('all'); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${filterType === 'all' ? 'bg-slate-100 text-slate-900 active' : 'hover:bg-slate-50'}`}
                        >
                            All ({total})
                        </button>
                        <button 
                            onClick={() => { setFilterType('client'); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${filterType === 'client' ? 'bg-slate-100 text-slate-900 active' : 'hover:bg-slate-50'}`}
                        >
                            Clients
                        </button>
                        <button 
                            onClick={() => { setFilterType('lead'); setPage(1); }}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${filterType === 'lead' ? 'bg-slate-100 text-slate-900 active' : 'hover:bg-slate-50'}`}
                        >
                            Leads
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input 
                            type="text" 
                            placeholder="Search contacts..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 w-full md:w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm font-[450] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <button 
                        onClick={handleOpenCreate}
                        className="hidden md:flex bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-[550] shadow-subtle items-center gap-2 transition-smooth"
                    >
                        <i className="ph-bold ph-plus"></i>
                        <span>Add Contact</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white h-full flex flex-col">
                    <div className="flex-1 overflow-auto">
                        {/* Desktop Table */}
                        <table className="w-full text-left border-collapse hidden md:table">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-[600] text-slate-500 uppercase tracking-wide">
                                    <th className="px-6 py-4">Name / Company</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Last Activity</th>
                                    <th className="px-6 py-4 text-right">Total Value</th>
                                    <th className="px-6 py-4 w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {contacts.map((contact) => (
                                    <tr key={contact.id} className="group hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold ring-2 ring-white">
                                                    {contact.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-[600] text-slate-900">{contact.name}</p>
                                                    <p className="text-slate-500 text-xs">{contact.company || 'No Company'} • {contact.email || 'No Email'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                contact.type === 'client' 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                    : 'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>
                                                {contact.type === 'client' ? 'Active Client' : 'Lead'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            <span className="text-xs text-slate-400">
                                                {new Date(contact.updated_at).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-[500] text-slate-900">
                                            ${(contact.total_value || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveActionMenuId(activeActionMenuId === contact.id ? null : contact.id);
                                                }}
                                                className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                <i className="ph-bold ph-dots-three text-lg"></i>
                                            </button>
                                            
                                            {activeActionMenuId === contact.id && (
                                                <div ref={actionMenuRef} className="absolute right-10 top-8 bg-white border border-slate-200 rounded-xl shadow-dropdown z-50 w-48 overflow-hidden py-1 animate-fade-in-up origin-top-right">
                                                    <button onClick={() => handleOpenEdit(contact)} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                                                        <i className="ph ph-pencil-simple"></i> Edit
                                                    </button>
                                                    <a href={`mailto:${contact.email}`} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                                                        <i className="ph ph-envelope-simple"></i> Email
                                                    </a>
                                                    <div className="h-px bg-slate-100 my-1"></div>
                                                    <button onClick={() => handleDelete(contact.id)} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors">
                                                        <i className="ph ph-trash"></i> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {contacts.map((contact) => (
                                <div key={contact.id} className="p-4 space-y-3 bg-white hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-bold ring-2 ring-white">
                                                {contact.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-[600] text-slate-900">{contact.name}</h3>
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide font-bold ${
                                                    contact.type === 'client' 
                                                        ? 'bg-emerald-50 text-emerald-700' 
                                                        : 'bg-amber-50 text-amber-700'
                                                }`}>
                                                    {contact.type === 'client' ? 'Client' : 'Lead'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="relative">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveActionMenuId(activeActionMenuId === contact.id ? null : contact.id);
                                                }}
                                                className="p-1 text-slate-400 hover:text-slate-600"
                                            >
                                                <i className="ph-bold ph-dots-three-vertical text-lg"></i>
                                            </button>
                                            
                                            {activeActionMenuId === contact.id && (
                                                <div ref={actionMenuRef} className="absolute right-0 top-8 bg-white border border-slate-200 rounded-lg shadow-dropdown z-50 w-40 overflow-hidden py-1 animate-fade-in-up origin-top-right">
                                                    <button onClick={() => handleOpenEdit(contact)} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600">
                                                        <i className="ph ph-pencil-simple"></i> Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(contact.id)} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">
                                                        <i className="ph ph-trash"></i> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium mb-0.5">Company</p>
                                            <p className="text-slate-700 font-medium truncate">{contact.company || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium mb-0.5">Value</p>
                                            <p className="text-slate-900 font-bold">${(contact.total_value || 0).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {(contact.email || contact.phone) && (
                                        <div className="pt-2 border-t border-slate-50 flex gap-3 text-xs text-slate-500">
                                            {contact.email && (
                                                <div className="flex items-center gap-1.5 truncate">
                                                    <i className="ph-bold ph-envelope-simple text-slate-400"></i>
                                                    <span className="truncate">{contact.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Modern Pagination (Stick to bottom) */}
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between mt-auto">
                        <div className="text-xs text-slate-500 font-medium">
                            Showing <span className="text-slate-900">{(page - 1) * limit + 1}</span> to <span className="text-slate-900">{Math.min(page * limit, total)}</span> of <span className="text-slate-900">{total}</span> results
                        </div>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                                <i className="ph-bold ph-caret-left"></i>
                            </button>
                            
                            <div className="flex items-center gap-1 px-2">
                                {getPageNumbers().map(p => (
                                    <button 
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-8 h-8 text-xs font-[600] rounded-lg transition-colors shadow-sm ${
                                            p === page 
                                                ? 'bg-slate-900 text-white' 
                                                : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                {totalPages > 5 && <span className="text-xs text-slate-400 px-1">...</span>}
                            </div>
    
                            <button 
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || totalPages === 0}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                                <i className="ph-bold ph-caret-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <ContactModal 
                isOpen={isModalOpen} 
                mode={modalMode} 
                contact={selectedContact} 
                onClose={() => setIsModalOpen(false)} 
                onSave={fetchContacts} 
            />
        </div>
    );
}
