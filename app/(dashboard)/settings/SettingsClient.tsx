'use client';

import { useState } from 'react';
import { Workspace } from '@/lib/types';

interface SettingsClientProps {
    initialWorkspace: Workspace | null;
    user: any;
}

export default function SettingsClient({ initialWorkspace, user }: SettingsClientProps) {
    const [activeTab, setActiveTab] = useState<'general' | 'profile' | 'billing' | 'notifications'>('general');
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [workspace, setWorkspace] = useState<Workspace | null>(initialWorkspace);
    
    // Form States
    const [formData, setFormData] = useState<Partial<Workspace>>(initialWorkspace || {});
    const [userData, setUserData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const handleInputChange = (field: keyof Workspace, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        const file = e.target.files[0];
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        try {
            setIsSaving(true);
            
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
            });

            if (!res.ok) throw new Error('Upload failed');
            
            const { url } = await res.json();
            
            // Update State
            handleInputChange('logo_url', url);

        } catch (error) {
            console.error('Error uploading logo:', error);
            alert('Failed to upload logo.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async () => {
        if (!workspace) return;

        try {
            setIsSaving(true);

            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    address: formData.address,
                    currency: formData.currency,
                    logo_url: formData.logo_url,
                    default_payment_link: formData.default_payment_link,
                    bank_details: formData.bank_details,
                    username: formData.username,
                }),
            });

            if (!res.ok) throw new Error('Save failed');

            // Save User Profile
            const userRes = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!userRes.ok) throw new Error('Failed to update profile');

            const { workspace: updatedWorkspace } = await res.json();
            
            // Refresh data
            setWorkspace(updatedWorkspace);
            setFormData(updatedWorkspace);
            
            // Show Toast
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);

        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!workspace) {
        return (
            <div className="p-8 text-center">
                <p>No workspace found. Please create one.</p>
            </div>
        );
    }

    return (
        <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-white transition-all duration-300 ease-in-out">
            
            {/* Header */}
            <header className="h-16 px-8 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-20 shrink-0">
                <h1 className="text-xl font-[600] text-slate-900 tracking-tight">Settings</h1>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-[550] shadow-subtle flex items-center gap-2 transition-smooth"
                >
                    {isSaving ? (
                        <>
                            <i className="ph-bold ph-spinner animate-spin"></i>
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <i className="ph-bold ph-floppy-disk"></i>
                            <span>Save Changes</span>
                        </>
                    )}
                </button>
            </header>

            {/* Content Area with Internal Sidebar */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                
                {/* Settings Navigation */}
                <aside className="w-full md:w-64 bg-slate-50/50 border-b md:border-b-0 md:border-r border-slate-200 p-4 md:p-6 flex flex-row md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-y-auto shrink-0 no-scrollbar">
                    <button 
                        onClick={() => setActiveTab('general')}
                        className={`flex items-center gap-2 md:gap-3 px-3 py-2 text-sm font-[500] rounded-lg transition-all text-left border whitespace-nowrap ${activeTab === 'general' ? 'bg-indigo-50 text-indigo-700 border-indigo-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'}`}
                    >
                        <i className="ph ph-sliders text-lg md:text-base"></i> <span className="hidden md:inline">General</span><span className="md:hidden">General</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-2 md:gap-3 px-3 py-2 text-sm font-[500] rounded-lg transition-all text-left border whitespace-nowrap ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700 border-indigo-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'}`}
                    >
                        <i className="ph ph-user text-lg md:text-base"></i> <span className="hidden md:inline">My Profile</span><span className="md:hidden">Profile</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('billing')}
                        className={`flex items-center gap-2 md:gap-3 px-3 py-2 text-sm font-[500] rounded-lg transition-all text-left border whitespace-nowrap ${activeTab === 'billing' ? 'bg-indigo-50 text-indigo-700 border-indigo-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'}`}
                    >
                        <i className="ph ph-credit-card text-lg md:text-base"></i> <span className="hidden md:inline">Billing & Plan</span><span className="md:hidden">Billing</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('notifications')}
                        className={`flex items-center gap-2 md:gap-3 px-3 py-2 text-sm font-[500] rounded-lg transition-all text-left border whitespace-nowrap ${activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-700 border-indigo-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'}`}
                    >
                        <i className="ph ph-bell text-lg md:text-base"></i> <span className="hidden md:inline">Notifications</span><span className="md:hidden">Notify</span>
                    </button>
                </aside>

                {/* Settings Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroller-thin bg-white relative">
                    
                    {/* Section: GENERAL */}
                    {activeTab === 'general' && (
                        <div className="space-y-8 max-w-2xl animate-fade-in-up">
                            <div>
                                <h2 className="text-lg font-[600] text-slate-900 mb-1">General Settings</h2>
                                <p className="text-sm text-slate-500">Manage your workspace preferences.</p>
                            </div>

                            <div className="space-y-6">
                                {/* Company Info */}
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <h3 className="text-sm font-[600] text-slate-900">Workspace Identity</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-[500] text-slate-700">Company Name</label>
                                            <input 
                                                type="text" 
                                                value={formData.name || ''} 
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-[500] text-slate-700">Public Username</label>
                                            <div className="flex rounded-lg shadow-sm">
                                                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 text-slate-500 sm:text-sm">
                                                    biondesk.com/p/
                                                </span>
                                                <input
                                                    type="text"
                                                    value={formData.username || ''}
                                                    onChange={(e) => handleInputChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                                                    placeholder={user.name ? user.name.split(' ')[0].toLowerCase() : 'username'}
                                                    className="flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none rounded-r-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500">Leave blank to auto-generate from your name.</p>
                                        </div>
                                        {/* <div className="space-y-1.5">
                                            <label className="text-sm font-[500] text-slate-700">Default Payment Link</label>
                                            <input 
                                                type="url" 
                                                value={formData.default_payment_link || ''} 
                                                onChange={(e) => handleInputChange('default_payment_link', e.target.value)}
                                                placeholder="https://..."
                                                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                                            />
                                        </div> */}
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-[500] text-slate-700">Business Address</label>
                                        <textarea 
                                            rows={3}
                                            value={formData.address || ''}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                                        ></textarea>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <h3 className="text-sm font-[600] text-slate-900 mb-4">Payment Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-[500] text-slate-700">Bank Name</label>
                                                <input 
                                                    type="text" 
                                                    value={(formData.bank_details as any)?.bank_name || ''} 
                                                    onChange={(e) => handleInputChange('bank_details', { ...formData.bank_details, bank_name: e.target.value })}
                                                    placeholder="e.g. BCA, Chase, Stripe"
                                                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-[500] text-slate-700">Account Number</label>
                                                <input 
                                                    type="text" 
                                                    value={(formData.bank_details as any)?.account_number || ''} 
                                                    onChange={(e) => handleInputChange('bank_details', { ...formData.bank_details, account_number: e.target.value })}
                                                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                                                />
                                            </div>
                                            <div className="space-y-1.5 md:col-span-2">
                                                <label className="text-sm font-[500] text-slate-700">Account Holder Name</label>
                                                <input 
                                                    type="text" 
                                                    value={(formData.bank_details as any)?.account_name || ''} 
                                                    onChange={(e) => handleInputChange('bank_details', { ...formData.bank_details, account_name: e.target.value })}
                                                    placeholder="Name on the account"
                                                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-[500] text-slate-700">Logo</label>
                                        <div className="flex items-center gap-4">
                                            {formData.logo_url ? (
                                                <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                                                    <img src={formData.logo_url} alt="Logo" className="w-full h-full object-contain" />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                                                    <i className="ph-fill ph-lightning text-2xl"></i>
                                                </div>
                                            )}
                                            <div className="relative">
                                                <input 
                                                    type="file" 
                                                    id="logo-upload"
                                                    accept="image/*"
                                                    onChange={handleLogoUpload}
                                                    className="hidden"
                                                />
                                                <label 
                                                    htmlFor="logo-upload"
                                                    className="cursor-pointer px-3 py-1.5 text-xs font-[500] text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg transition-colors inline-block"
                                                >
                                                    {isSaving ? 'Uploading...' : 'Change Logo'}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Localization */}
                                <div className="space-y-4 pt-6 border-t border-slate-100">
                                    <h3 className="text-sm font-[600] text-slate-900">Localization</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-[500] text-slate-700">Language</label>
                                            <select 
                                                disabled 
                                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500"
                                            >
                                                <option>English (US) - Default</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-[500] text-slate-700">Currency Default</label>
                                            <select 
                                                value={formData.currency || 'USD'}
                                                onChange={(e) => handleInputChange('currency', e.target.value)}
                                                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            >
                                                <option value="USD">USD ($)</option>
                                                <option value="IDR">IDR (Rp)</option>
                                                <option value="EUR">EUR (€)</option>
                                                <option value="GBP">GBP (£)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section: PROFILE */}
                    {activeTab === 'profile' && (
                        <div className="space-y-8 max-w-2xl animate-fade-in-up">
                            <div>
                                <h2 className="text-lg font-[600] text-slate-900 mb-1">My Profile</h2>
                                <p className="text-sm text-slate-500">Update your personal details and password.</p>
                            </div>

                            <div className="space-y-6 pt-4 border-t border-slate-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-[500] text-slate-700">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={userData.name}
                                            onChange={(e) => setUserData({...userData, name: e.target.value})}
                                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-[500] text-slate-700">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={userData.email}
                                            onChange={(e) => setUserData({...userData, email: e.target.value})}
                                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <h3 className="text-sm font-[600] text-slate-900 mb-4">Change Password</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-[500] text-slate-700">Current Password</label>
                                            <input type="password" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-[500] text-slate-700">New Password</label>
                                                <input type="password" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-[500] text-slate-700">Confirm Password</label>
                                                <input type="password" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section: BILLING */}
                    {activeTab === 'billing' && (
                        <div className="space-y-8 max-w-3xl animate-fade-in-up">
                            <div>
                                <h2 className="text-lg font-[600] text-slate-900 mb-1">Billing & Plan</h2>
                                <p className="text-sm text-slate-500">Manage your subscription and payment methods.</p>
                            </div>

                            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-base font-[700] text-indigo-900">Dealis Pro Plan</h3>
                                        <span className="px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-700 text-[10px] font-bold uppercase">Active</span>
                                    </div>
                                    <p className="text-sm text-indigo-700/80">You are on the annual plan. Renews on Jan 14, 2027.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 bg-white text-indigo-600 text-sm font-[600] rounded-lg shadow-sm hover:bg-indigo-50 transition-colors border border-indigo-200">Change Plan</button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <h3 className="text-sm font-[600] text-slate-900 mb-4">Payment Method</h3>
                                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-6 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">VISA</div>
                                        <div>
                                            <p className="text-sm font-[500] text-slate-900">Visa ending in 4242</p>
                                            <p className="text-xs text-slate-500">Expires 12/2028</p>
                                        </div>
                                    </div>
                                    <button className="text-xs font-[600] text-slate-500 hover:text-slate-900">Edit</button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <h3 className="text-sm font-[600] text-slate-900 mb-4">Invoice History</h3>
                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-[600] text-slate-500 uppercase">
                                            <tr>
                                                <th className="px-4 py-3">Date</th>
                                                <th className="px-4 py-3">Amount</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3 text-right">Receipt</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr>
                                                <td className="px-4 py-3 text-slate-600">Jan 14, 2026</td>
                                                <td className="px-4 py-3 text-slate-900 font-medium">$120.00</td>
                                                <td className="px-4 py-3"><span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 font-medium">Paid</span></td>
                                                <td className="px-4 py-3 text-right"><button className="text-indigo-600 hover:underline">Download</button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section: NOTIFICATIONS */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-8 max-w-2xl animate-fade-in-up">
                            <div>
                                <h2 className="text-lg font-[600] text-slate-900 mb-1">Notifications</h2>
                                <p className="text-sm text-slate-500">Choose what you want to be notified about.</p>
                            </div>

                            <div className="space-y-6 pt-4 border-t border-slate-100">
                                {/* Email Notifications */}
                                <div>
                                    <h3 className="text-sm font-[600] text-slate-900 mb-4">Email Alerts</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-[500] text-slate-700">Invoice Payment Received</p>
                                                <p className="text-xs text-slate-500">Get notified when a client pays an invoice.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-[500] text-slate-700">Quote Viewed</p>
                                                <p className="text-xs text-slate-500">Get notified when a client opens your quote link.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-[500] text-slate-700">New Opportunities</p>
                                                <p className="text-xs text-slate-500">Weekly digest of new leads found.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* TOAST */}
            <div className={`fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium transition-all duration-300 pointer-events-none z-50 transform ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <i className="ph-fill ph-check-circle text-emerald-400 text-lg"></i>
                <span>Settings updated successfully</span>
            </div>
        </main>
    );
}
