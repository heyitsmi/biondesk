import type { Metadata } from "next";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Flova",
};

export default async function PrivacyPage() {
    const user = await getCurrentUser();
    
    return (
        <div className="bg-light-50 min-h-screen flex flex-col">
            <PublicNavbar isLoggedIn={!!user} />

            {/* Content Section */}
            <section className="pt-32 pb-20 px-6 flex-grow">
                <div className="max-w-3xl mx-auto">
                    
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-[800] tracking-tight text-dark-900 mb-4">Privacy Policy</h1>
                        <p className="text-slate-500">Last updated: January 14, 2026</p>
                    </div>

                    {/* Policy Text */}
                    <div className="prose prose-slate prose-lg mx-auto text-slate-600 leading-relaxed space-y-12">
                        
                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">1. Introduction</h2>
                            <p>
                                Welcome to Flova ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our products and services (collectively, "Services"). This policy explains how we handle your personal information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">2. Information We Collect</h2>
                            <p className="mb-4">We collect information to provide better services to all our users. The types of information we collect include:</p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-accent-500">
                                <li><strong>Account Information:</strong> When you register, we collect your name, email address, and company details.</li>
                                <li><strong>Content:</strong> Data you input into Flova, such as client details, proposals, quotes, and invoices.</li>
                                <li><strong>Usage Data:</strong> Information on how you interact with our Services, including access times and pages viewed.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">3. How We Use Information</h2>
                            <p>We use the information we collect to operate, maintain, and improve our Services, such as:</p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-accent-500">
                                <li>To provide and deliver the products and services you request.</li>
                                <li>To send you technical notices, updates, security alerts, and support messages.</li>
                                <li>To respond to your comments, questions, and customer service requests.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">4. Data Security</h2>
                            <p>
                                We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no system is completely secure. We use industry-standard encryption to protect your data in transit and at rest.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">5. Your Rights</h2>
                            <p>
                                You have the right to access, correct, or delete your personal information. You can manage your information directly within your account settings or by contacting us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark-900 mb-4">6. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at:
                                <br />
                                <a href="mailto:privacy@flova.io" className="text-accent-600 font-medium hover:underline">privacy@flova.io</a>
                            </p>
                        </section>

                    </div>

                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
