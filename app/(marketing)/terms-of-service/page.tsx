import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';

export const metadata = {
  title: 'Terms of Service - Inboop',
  description: 'Terms of Service for Inboop - AI-Powered CRM for Social Commerce',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-12">Last updated: December 15, 2025</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing or using Inboop (&quot;Service&quot;), you agree to be bound by these Terms of Service
                (&quot;Terms&quot;). If you disagree with any part of the terms, you may not access the Service. These
                Terms apply to all visitors, users, and others who access or use the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 leading-relaxed">
                Inboop is an AI-powered Customer Relationship Management (CRM) platform designed for social commerce.
                Our Service allows you to manage customer conversations from Instagram, WhatsApp, and Facebook Messenger
                in a unified inbox, track leads, and leverage AI-powered insights to improve your business operations.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>

              <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 Account Creation</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                To use certain features of our Service, you must create an account. You agree to provide accurate,
                current, and complete information during registration and to update such information to keep it
                accurate, current, and complete.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">3.2 Account Security</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                You are responsible for safeguarding your account credentials and for any activities or actions
                under your account. You must notify us immediately upon becoming aware of any breach of security
                or unauthorized use of your account.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">3.3 Account Requirements</h3>
              <p className="text-gray-600 leading-relaxed">
                You must be at least 18 years old to use this Service. By using the Service, you represent and
                warrant that you meet this requirement and have the legal capacity to enter into these Terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others, including intellectual property rights</li>
                <li>Send spam, unsolicited messages, or engage in harassment</li>
                <li>Distribute malware, viruses, or other harmful code</li>
                <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
                <li>Use the Service for any fraudulent or deceptive purposes</li>
                <li>Interfere with or disrupt the integrity or performance of the Service</li>
                <li>Collect or harvest user data without consent</li>
                <li>Violate the terms of service of connected platforms (Meta, WhatsApp, etc.)</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Integrations</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our Service integrates with third-party platforms including Meta (Instagram, Facebook, WhatsApp).
                By using these integrations, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Comply with the terms of service and policies of each third-party platform</li>
                <li>Authorize Inboop to access your data on these platforms as necessary to provide the Service</li>
                <li>Accept that third-party services may change or discontinue, affecting our Service</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                We are not responsible for the actions, content, or policies of any third-party platforms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>

              <h3 className="text-xl font-medium text-gray-800 mb-3">6.1 Our Intellectual Property</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                The Service and its original content (excluding content provided by users), features, and
                functionality are and will remain the exclusive property of Inboop and its licensors. The
                Service is protected by copyright, trademark, and other laws.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">6.2 Your Content</h3>
              <p className="text-gray-600 leading-relaxed">
                You retain all rights to any content you submit, post, or display through the Service. By
                submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use,
                reproduce, and process your content solely for the purpose of providing the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Payment Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Certain features of the Service may require payment. By subscribing to a paid plan:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>You agree to pay all fees associated with your chosen plan</li>
                <li>Fees are billed in advance on a monthly or annual basis</li>
                <li>All payments are non-refundable unless otherwise stated</li>
                <li>We reserve the right to modify pricing with reasonable notice</li>
                <li>Failure to pay may result in suspension or termination of your account</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Termination</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may terminate or suspend your account immediately, without prior notice or liability, for
                any reason, including without limitation if you breach these Terms. Upon termination:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Your right to use the Service will immediately cease</li>
                <li>You may request export of your data within 30 days</li>
                <li>We may delete your account and all associated data</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                You may terminate your account at any time by contacting us or using the account settings.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimer of Warranties</h2>
              <p className="text-gray-600 leading-relaxed">
                THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT ANY WARRANTIES OF ANY
                KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS
                FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE. We do not warrant that
                the Service will be uninterrupted, secure, or error-free.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL INBOOP, ITS DIRECTORS, EMPLOYEES,
                PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE,
                GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO
                ACCESS OR USE THE SERVICE.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Indemnification</h2>
              <p className="text-gray-600 leading-relaxed">
                You agree to defend, indemnify, and hold harmless Inboop and its licensees and licensors, and
                their employees, contractors, agents, officers, and directors, from and against any claims,
                damages, obligations, losses, liabilities, costs or debt, and expenses arising from your use
                of the Service or violation of these Terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of the jurisdiction in
                which Inboop operates, without regard to its conflict of law provisions. Our failure to enforce
                any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material,
                we will try to provide at least 30 days&apos; notice prior to any new terms taking effect. What
                constitutes a material change will be determined at our sole discretion. By continuing to access
                or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  <strong>Inboop</strong><br />
                  Email: legal@inboop.com<br />
                  Website: https://inboop.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}