import Header from '@/components/dashboard/Header';

export default function SettingsPage() {
    return (
        <>
            <Header 
                title="Settings"
                subtitle="Manage your workspace preferences"
                showNewButton={false}
            />

            <div className="flex-1 overflow-y-auto p-8">
                <div className="w-full max-w-4xl space-y-8">
                    
                    {/* Workspace Settings */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h2 className="text-lg font-[600] text-slate-900">Workspace</h2>
                            <p className="text-sm text-slate-500 mt-1">Your business identity and preferences</p>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Logo */}
                            <div className="flex items-start gap-6">
                                <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
                                    <i className="ph ph-image text-2xl text-slate-400"></i>
                                </div>
                                <div>
                                    <h3 className="text-sm font-[600] text-slate-900 mb-1">Logo</h3>
                                    <p className="text-xs text-slate-500 mb-3">This will appear on your quotes and invoices</p>
                                    <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-[600] rounded-lg hover:border-slate-300 transition-all">
                                        Upload Logo
                                    </button>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100"></div>

                            {/* Workspace Name */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 mb-1.5">Workspace Name</label>
                                    <input 
                                        type="text" 
                                        defaultValue="My Workspace"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 mb-1.5">Currency</label>
                                    <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                                        <option value="USD">USD - US Dollar</option>
                                        <option value="IDR">IDR - Indonesian Rupiah</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="GBP">GBP - British Pound</option>
                                    </select>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-[600] text-slate-700 mb-1.5">Business Address</label>
                                <textarea 
                                    rows={3}
                                    placeholder="Your business address (appears on invoices)"
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Payment Settings */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h2 className="text-lg font-[600] text-slate-900">Payment Methods</h2>
                            <p className="text-sm text-slate-500 mt-1">Configure how clients can pay you (BYO Payment)</p>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Payment Link */}
                            <div>
                                <label className="block text-sm font-[600] text-slate-700 mb-1.5">Default Payment Link</label>
                                <p className="text-xs text-slate-500 mb-2">Stripe, PayPal, or Midtrans payment link</p>
                                <input 
                                    type="url" 
                                    placeholder="https://pay.stripe.com/..."
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>

                            <div className="h-px bg-slate-100"></div>

                            {/* Bank Details */}
                            <div>
                                <label className="block text-sm font-[600] text-slate-700 mb-1.5">Bank Transfer Details</label>
                                <p className="text-xs text-slate-500 mb-2">Alternative payment via bank transfer</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input 
                                        type="text" 
                                        placeholder="Bank Name"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Account Number"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Account Holder Name"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Swift/BIC Code (optional)"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notification Preferences */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h2 className="text-lg font-[600] text-slate-900">Notifications</h2>
                            <p className="text-sm text-slate-500 mt-1">How you want to be notified</p>
                        </div>
                        <div className="p-6 space-y-4">
                            {[
                                { label: 'Invoice paid', description: 'When a client marks an invoice as paid' },
                                { label: 'Quote viewed', description: 'When a client views your quote' },
                                { label: 'Quote accepted', description: 'When a client accepts your quote' },
                                { label: 'Reminder sent', description: 'When an automated reminder is sent' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between py-2">
                                    <div>
                                        <h3 className="text-sm font-[600] text-slate-900">{item.label}</h3>
                                        <p className="text-xs text-slate-500">{item.description}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h2 className="text-lg font-[600] text-slate-900">Account</h2>
                            <p className="text-sm text-slate-500 mt-1">Your personal account settings</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 mb-1.5">Full Name</label>
                                    <input 
                                        type="text" 
                                        defaultValue="Admin User"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-[600] text-slate-700 mb-1.5">Email</label>
                                    <input 
                                        type="email" 
                                        defaultValue="admin@flova.app"
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="h-px bg-slate-100"></div>

                            <div>
                                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-[600] rounded-lg hover:border-slate-300 transition-all">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Billing */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h2 className="text-lg font-[600] text-slate-900">Billing & Plan</h2>
                            <p className="text-sm text-slate-500 mt-1">Your subscription details</p>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-[600] text-indigo-900">Pro Plan</span>
                                        <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-[600] rounded-full uppercase">Active</span>
                                    </div>
                                    <p className="text-xs text-indigo-700 mt-1">Unlimited everything • AI proposals • Auto reminders</p>
                                </div>
                                <button className="px-4 py-2 bg-white border border-indigo-200 text-indigo-700 text-sm font-[600] rounded-lg hover:border-indigo-300 transition-all">
                                    Manage Billing
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end gap-3">
                        <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-[600] rounded-lg hover:border-slate-300 transition-all">
                            Cancel
                        </button>
                        <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-[600] rounded-lg shadow-lg transition-all">
                            Save Changes
                        </button>
                    </div>

                </div>
                
                {/* Footer */}
                <div className="mt-12 mb-6 text-center">
                    <p className="text-xs text-slate-400">© 2026 Flova. Crafted for growth.</p>
                </div>
            </div>
        </>
    );
}
