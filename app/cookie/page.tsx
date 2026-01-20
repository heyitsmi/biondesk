import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";

export default function CookiePolicyPage() {
    return (
        <div className="bg-light-50 min-h-screen flex flex-col">
            <PublicNavbar />

            {/* Content Section */}
            <section className="pt-32 pb-20 px-6 flex-grow">
                <div className="max-w-3xl mx-auto">
                    
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-[800] tracking-tight text-dark-900 mb-4">Cookie Policy</h1>
                        <p className="text-slate-500">Last updated: January 14, 2026</p>
                    </div>

                    {/* Policy Text */}
                    <div className="prose prose-slate prose-lg mx-auto text-slate-600 leading-relaxed space-y-12">
                        
                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">1. What Are Cookies?</h2>
                            <p>
                                Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">2. How We Use Cookies</h2>
                            <p className="mb-4">We use cookies for a variety of reasons, including:</p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-accent-500">
                                <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly and cannot be switched off in our systems.</li>
                                <li><strong>Performance Cookies:</strong> These allow us to count visits and traffic sources so we can measure and improve the performance of our site.</li>
                                <li><strong>Functionality Cookies:</strong> These enable the website to provide enhanced functionality and personalization.</li>
                                <li><strong>Marketing Cookies:</strong> These may be set through our site by our advertising partners to build a profile of your interests.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">3. Managing Cookies</h2>
                            <p>
                                Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="http://www.aboutcookies.org" target="_blank" className="text-accent-600 font-medium hover:underline">www.aboutcookies.org</a> or <a href="http://www.allaboutcookies.org" target="_blank" className="text-accent-600 font-medium hover:underline">www.allaboutcookies.org</a>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">4. Third-Party Cookies</h2>
                            <p>
                                In some special cases, we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-accent-500 mt-4">
                                <li><strong>Google Analytics:</strong> To help us understand how you use the site and ways that we can improve your experience.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">5. Changes to This Policy</h2>
                            <p>
                                We may update our Cookie Policy from time to time. We encourage you to review this policy periodically for any changes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">6. Contact Us</h2>
                            <p>
                                If you have any questions about our use of cookies, please contact us at:
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
