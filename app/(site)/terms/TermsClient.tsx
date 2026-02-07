"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import "../../public.css";

export default function TermsClient() {
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
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">Terms of Service</h1>
                    <p className="text-lg text-slate-600">
                        Please read these terms carefully before using Biondesk.
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
                        By accessing or using Biondesk ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. Accounts</h2>
                    <p>
                        When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </p>
                    <p>
                        You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. Subscription and Billing</h2>
                    <p>
                        Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set either on a monthly or annual basis, depending on the type of subscription plan you select when purchasing a Subscription.
                    </p>
                    <p>
                        At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel it or Biondesk cancels it.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. Content and Ownership</h2>
                    <p>
                        Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
                    </p>
                    <p>
                        You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">4. Intellectual Property</h2>
                    <p>
                        The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of Biondesk and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">5. Termination</h2>
                    <p>
                        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">6. Limitation of Liability</h2>
                    <p>
                        In no event shall Biondesk, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">7. Changes</h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">8. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at:
                        <br />
                        <a href="mailto:hello@biondesk.com" className="text-indigo-600 font-semibold hover:underline">hello@biondesk.com</a>
                    </p>
                </div>

            </div>
    </div>
  );
}
