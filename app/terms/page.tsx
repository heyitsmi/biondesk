import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";

export default function TermsPage() {
    return (
        <div className="bg-light-50 min-h-screen flex flex-col">
            <PublicNavbar />

            {/* Content Section */}
            <section className="pt-32 pb-20 px-6 flex-grow">
                <div className="max-w-3xl mx-auto">
                    
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-[800] tracking-tight text-dark-900 mb-4">Terms of Service</h1>
                        <p className="text-slate-500">Last updated: January 14, 2026</p>
                    </div>

                    {/* Terms Text */}
                    <div className="prose prose-slate prose-lg mx-auto text-slate-600 leading-relaxed space-y-12">
                        
                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using Flova ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">2. Use of Services</h2>
                            <p>
                                Flova provides a workflow management platform for freelancers and creative studios. You agree to use the Service only for lawful purposes and in accordance with these Terms. You are responsible for all activity that occurs under your account.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">3. User Accounts</h2>
                            <p>
                                To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">4. Subscription and Payments</h2>
                            <p className="mb-4">
                                Flova offers both free and paid subscription plans. By selecting a paid plan, you agree to pay the fees indicated for that service.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-accent-500">
                                <li>Subscription fees are billed in advance on a monthly or annual basis.</li>
                                <li>Payments are non-refundable unless otherwise required by law.</li>
                                <li>You may cancel your subscription at any time, but you will remain liable for all charges accrued up to that time.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">5. Content and Data</h2>
                            <p>
                                You retain all rights to the data, files, and content you upload to Flova ("User Content"). We claim no intellectual property rights over the material you provide to the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">6. Termination</h2>
                            <p>
                                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">7. Limitation of Liability</h2>
                            <p>
                                In no event shall Flova, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">8. Contact Us</h2>
                            <p>
                                If you have any questions about these Terms, please contact us at:
                                <br />
                                <a href="mailto:support@flova.io" className="text-accent-600 font-medium hover:underline">support@flova.io</a>
                            </p>
                        </section>

                    </div>

                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
