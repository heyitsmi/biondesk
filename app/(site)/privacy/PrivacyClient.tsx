"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import "../../public.css";

export default function PrivacyClient() {
  useEffect(() => {
    // Icons
    if ((window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  }, []);

  return (
    <div className="flex-grow pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
                
                {/* Header */}
                <div className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">Privacy Policy</h1>
                    <p className="text-lg text-slate-600">
                        We value your trust. Here is a clear explanation of how we collect, use, and protect your data.
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <i data-lucide="clock" className="w-4 h-4"></i>
                        <span>Last updated: 7 February 2026</span>
                    </div>
                </div>

                <hr className="border-slate-200 mb-12" />

                {/* Content Area */}
                <div className="prose prose-slate prose-lg max-w-none">
                    <p>
                        At Biondesk ("we", "us", or "our"), respecting your privacy is a core part of how we build our product. We do not sell your data to third parties. We only use your data to provide and improve the Biondesk service.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. Information We Collect</h2>
                    <p>When you use Biondesk, we collect the following types of information:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-8">
                        <li><strong>Account Information:</strong> Your name, email address, and password when you create an account.</li>
                        <li><strong>Billing Information:</strong> If you subscribe to a paid plan, our payment processor (e.g., Stripe) collects your payment details. We do not store your full credit card information.</li>
                        <li><strong>Client Data:</strong> Data regarding your clients (names, emails, project details) that you input into the system. You retain ownership of this data; we process it solely to provide the service.</li>
                        <li><strong>Usage Data:</strong> Information on how you interact with the service, such as pages visited and features used, to help us improve the user experience.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. How We Use Your Information</h2>
                    <p>We use your information for the following purposes:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-8">
                        <li>To provide, operate, and maintain the Biondesk service.</li>
                        <li>To process transactions and send related information, including invoices and receipts.</li>
                        <li>To send administrative information, such as updates, security alerts, and support messages.</li>
                        <li>To detect and prevent fraud, abuse, and security incidents.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. Sharing of Information</h2>
                    <p>
                        We do not sell your personal data. We may share your information only in the following circumstances:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-8">
                        <li><strong>Service Providers:</strong> We work with third-party service providers (such as hosting and email delivery services) who need access to your information to help us operate Biondesk.</li>
                        <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">4. Data Security</h2>
                    <p className="mb-8">
                        We take reasonable measures to protect your personal information from loss, theft, misuse, and unauthorized access. We use industry-standard encryption (SSL/TLS) for data in transit and at rest. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">5. Your Rights</h2>
                    <p className="mb-8">
                        You have the right to access, correct, or delete your personal information. You can manage your account settings directly within the Biondesk application. If you wish to delete your account entirely, please contact our support team.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">6. Changes to This Policy</h2>
                    <p className="mb-8">
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">7. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at:
                        <br />
                        <a href="mailto:hello@biondesk.com" className="text-indigo-600 font-semibold hover:underline">hello@biondesk.com</a>
                    </p>
                </div>

            </div>
    </div>
  );
}
