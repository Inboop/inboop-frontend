import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Inboop',
  description: 'Privacy Policy for Inboop - AI-Powered CRM for Social Commerce',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>

          {/* Update Notice */}
          <div className="flex items-center gap-2 mb-8 p-3 bg-green-50 border border-green-200 rounded-lg">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-green-800">
              We update this policy regularly to keep you informed. <strong>Last updated: December 15, 2025</strong>
            </p>
          </div>

          {/* Quick Summary Box */}
          <div className="mb-10 p-6 bg-gray-50 border border-gray-200 rounded-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Privacy at a Glance</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span className="text-gray-600">We never sell your personal data</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span className="text-gray-600">You can delete your data anytime</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span className="text-gray-600">Data encrypted in transit and at rest</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span className="text-gray-600">GDPR and CCPA compliant</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span className="text-gray-600">30-day response to privacy requests</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span className="text-gray-600">Clear data retention timelines</span>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="mb-10 p-6 bg-white border border-gray-200 rounded-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
            <nav className="grid md:grid-cols-2 gap-2 text-sm">
              <Link href="#introduction" className="text-gray-600 hover:text-green-700 transition-colors">1. Introduction</Link>
              <Link href="#information-collected" className="text-gray-600 hover:text-green-700 transition-colors">2. Information We Collect</Link>
              <Link href="#legal-basis" className="text-gray-600 hover:text-green-700 transition-colors">3. Legal Basis for Processing</Link>
              <Link href="#how-we-use" className="text-gray-600 hover:text-green-700 transition-colors">4. How We Use Your Information</Link>
              <Link href="#cookies" className="text-gray-600 hover:text-green-700 transition-colors">5. Cookies & Tracking</Link>
              <Link href="#data-sharing" className="text-gray-600 hover:text-green-700 transition-colors">6. Data Sharing & Disclosure</Link>
              <Link href="#international-transfers" className="text-gray-600 hover:text-green-700 transition-colors">7. International Data Transfers</Link>
              <Link href="#data-security" className="text-gray-600 hover:text-green-700 transition-colors">8. Data Security</Link>
              <Link href="#data-retention" className="text-gray-600 hover:text-green-700 transition-colors">9. Data Retention</Link>
              <Link href="#your-rights" className="text-gray-600 hover:text-green-700 transition-colors">10. Your Rights</Link>
              <Link href="#third-party" className="text-gray-600 hover:text-green-700 transition-colors">11. Third-Party Services</Link>
              <Link href="#children" className="text-gray-600 hover:text-green-700 transition-colors">12. Children&apos;s Privacy</Link>
              <Link href="#changes" className="text-gray-600 hover:text-green-700 transition-colors">13. Changes to This Policy</Link>
              <Link href="#contact" className="text-gray-600 hover:text-green-700 transition-colors">14. Contact Us</Link>
            </nav>
          </div>

          <div className="prose prose-gray max-w-none">
            {/* Section 1 */}
            <section id="introduction" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg mb-4">
                <p className="text-sm text-blue-800 font-medium">Key Points:</p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• This policy explains how we handle your data</li>
                  <li>• By using Inboop, you agree to this policy</li>
                </ul>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Welcome to Inboop (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring
                the security of your personal information. This Privacy Policy explains how we collect, use, disclose,
                and safeguard your information when you use our AI-powered CRM platform for social commerce.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By accessing or using Inboop, you agree to this Privacy Policy. If you do not agree with the terms
                of this policy, please do not access the application.
              </p>
            </section>

            {/* Section 2 */}
            <section id="information-collected" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg mb-4">
                <p className="text-sm text-blue-800 font-medium">Key Points:</p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Personal info you provide (name, email, business details)</li>
                  <li>• Social media data when you connect accounts</li>
                  <li>• Automatic data (device info, usage patterns)</li>
                </ul>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may collect personally identifiable information that you voluntarily provide, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Name and email address</li>
                <li>Business name and contact information</li>
                <li>Account credentials</li>
                <li>Payment information (processed securely through third-party providers)</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">2.2 Social Media Data</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                When you connect your social media accounts (Instagram, WhatsApp, Facebook Messenger), we collect:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li>Messages and conversations from connected platforms</li>
                <li>Profile information of your customers (as permitted by each platform)</li>
                <li>Business account information and page data</li>
                <li>Engagement metrics and analytics</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">2.3 Automatically Collected Information</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We automatically collect certain information when you use our service:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Device information and browser type</li>
                <li>IP address and location data</li>
                <li>Usage patterns and preferences</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="legal-basis" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Legal Basis for Processing</h2>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg mb-4">
                <p className="text-sm text-blue-800 font-medium">Key Points:</p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• We process data to provide our service (contract)</li>
                  <li>• We ask consent where required by law</li>
                  <li>• You can withdraw consent anytime</li>
                </ul>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                We process your personal data under the following legal bases as required by GDPR and other applicable laws:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Contractual Necessity:</strong> Processing is necessary to provide our services and fulfill our contract with you (e.g., managing your CRM account, processing conversations)</li>
                <li><strong>Consent:</strong> Where required by law, we obtain your explicit consent before processing (e.g., marketing communications, optional analytics)</li>
                <li><strong>Legitimate Interests:</strong> Processing for our legitimate business interests, such as improving our services, fraud prevention, and security, where these interests do not override your rights</li>
                <li><strong>Legal Obligations:</strong> Processing necessary to comply with applicable laws and regulations</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                You may withdraw your consent at any time by contacting us at privacy@inboop.com or through your account settings.
              </p>
            </section>

            {/* Section 4 */}
            <section id="how-we-use" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. How We Use Your Information</h2>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg mb-4">
                <p className="text-sm text-blue-800 font-medium">Key Points:</p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Provide and improve our CRM service</li>
                  <li>• AI-powered message classification</li>
                  <li>• Security and fraud prevention</li>
                </ul>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use the collected information for various purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>To provide and maintain our CRM service</li>
                <li>To process and manage your customer conversations</li>
                <li>To use AI/ML technologies for message classification and insights</li>
                <li>To improve and personalize your experience</li>
                <li>To communicate with you about updates and support</li>
                <li>To detect and prevent fraud or security issues</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="cookies" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg mb-4">
                <p className="text-sm text-blue-800 font-medium">Key Points:</p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Essential cookies required for functionality</li>
                  <li>• Google Analytics for usage insights</li>
                  <li>• You can opt-out via browser settings</li>
                </ul>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your experience. Here&apos;s what we use:
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">5.1 Essential Cookies</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Required for the website to function properly. These include session cookies for authentication and security tokens. You cannot opt out of these cookies.
              </p>

              <h3 className="text-xl font-medium text-gray-800 mb-3">5.2 Analytics Cookies</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use analytics tools to understand how visitors interact with our website:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>Google Analytics:</strong> Collects anonymized usage data including pages visited, time on site, and traffic sources</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">5.3 How to Manage Cookies</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                You can control cookies through:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies through their settings</li>
                <li><strong>Google Analytics Opt-out:</strong> Install the <a href="https://tools.google.com/dlpage/gaoptout" className="text-green-700 hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
                <li><strong>Do Not Track:</strong> We honor Do Not Track (DNT) browser signals</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                Note: Disabling certain cookies may affect the functionality of our service.
              </p>
            </section>

            {/* Section 6 */}
            <section id="data-sharing" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Sharing and Disclosure</h2>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg mb-4">
                <p className="text-sm text-blue-800 font-medium">Key Points:</p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• We never sell your personal data</li>
                  <li>• Shared only with essential service providers</li>
                  <li>• Legal disclosure only when required</li>
                </ul>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                We do not sell your personal information. We may share your data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Service Providers:</strong> With trusted third parties who assist in operating our platform</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="international-transfers" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. International Data Transfers</h2>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg mb-4">
                <p className="text-sm text-blue-800 font-medium">Key Points:</p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Data hosted on AWS (United States)</li>
                  <li>• Protected by Standard Contractual Clauses</li>
                  <li>• Encrypted in transit and at rest</li>
                </ul>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Your data may be transferred to and processed in countries other than your own. Specifically:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>Cloud Infrastructure:</strong> We use Amazon Web Services (AWS) with servers located in the United States</li>
                <li><strong>Third-Party Services:</strong> Meta platforms (Instagram, Facebook, WhatsApp) may process data in various locations according to their policies</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mb-4">
                When transferring data internationally, we implement appropriate safeguards including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                <li>Data processing agreements with all service providers</li>
                <li>Technical security measures including encryption in transit and at rest</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section id="data-security" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Security</h2>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg mb-4">
                <p className="text-sm text-blue-800 font-medium">Key Points:</p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Industry-standard encryption</li>
                  <li>• Regular security assessments</li>
                  <li>• Secure server infrastructure</li>
                </ul>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction. This includes
                encryption, secure servers, and regular security assessments. However, no method of transmission
                over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Section 9 */}
            <section id="data-retention" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Data Retention</h2>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg mb-4">
                <p className="text-sm text-blue-800 font-medium">Key Points:</p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Clear retention periods for each data type</li>
                  <li>• Data deleted or anonymized after expiry</li>
                  <li>• Request early deletion anytime</li>
                </ul>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                We retain your data for specific periods based on the type of information and purpose:
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg mb-4">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Data Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Retention Period</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">Account information</td>
                      <td className="px-4 py-3 text-sm text-gray-600">Duration of account + 30 days after deletion</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">Conversation data</td>
                      <td className="px-4 py-3 text-sm text-gray-600">24 months from last activity, or until account deletion</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">Lead information</td>
                      <td className="px-4 py-3 text-sm text-gray-600">24 months from creation, or until account deletion</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">Analytics and logs</td>
                      <td className="px-4 py-3 text-sm text-gray-600">12 months</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">Payment records</td>
                      <td className="px-4 py-3 text-sm text-gray-600">7 years (legal requirement)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-600">Support communications</td>
                      <td className="px-4 py-3 text-sm text-gray-600">36 months from resolution</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-600 leading-relaxed">
                After the retention period expires, data is securely deleted or anonymized. You may request early deletion of your data at any time, subject to legal retention requirements.
              </p>
            </section>

            {/* Section 10 */}
            <section id="your-rights" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Your Rights</h2>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg mb-4">
                <p className="text-sm text-blue-800 font-medium">Key Points:</p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Access, correct, or delete your data</li>
                  <li>• Export your data in portable format</li>
                  <li>• We respond within 30 days</li>
                </ul>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Depending on your location (including under GDPR, CCPA, and other privacy laws), you have the following rights:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete information</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data (&quot;right to be forgotten&quot;)</li>
                <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
                <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or for marketing</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw previously given consent at any time</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">How to Exercise Your Rights</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                To exercise any of these rights, you can:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
                <li><strong>Email us:</strong> Send a request to privacy@inboop.com</li>
                <li><strong>Account Settings:</strong> Use the data management options in your account dashboard</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                We will respond to your request within <strong>30 days</strong>. In complex cases, we may extend this by an additional 60 days, and we will notify you if this is necessary. We may need to verify your identity before processing your request.
              </p>
            </section>

            {/* Section 11 */}
            <section id="third-party" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Third-Party Services</h2>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg mb-4">
                <p className="text-sm text-blue-800 font-medium">Key Points:</p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• We integrate with Meta (Instagram, Facebook, WhatsApp)</li>
                  <li>• Third-party policies apply to their services</li>
                </ul>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Our service integrates with third-party platforms including Meta (Instagram, Facebook, WhatsApp).
                Your use of these platforms is governed by their respective privacy policies. We encourage you to
                review the privacy policies of any third-party services you connect to Inboop.
              </p>
            </section>

            {/* Section 12 */}
            <section id="children" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Children&apos;s Privacy</h2>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg mb-4">
                <p className="text-sm text-blue-800 font-medium">Key Points:</p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Service not intended for users under 18</li>
                  <li>• We delete data if collected from minors</li>
                </ul>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Inboop is not intended for use by individuals under the age of 18. We do not knowingly collect
                personal information from children. If we become aware that we have collected personal data from
                a child without parental consent, we will take steps to delete that information.
              </p>
            </section>

            {/* Section 13 */}
            <section id="changes" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to This Policy</h2>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg mb-4">
                <p className="text-sm text-blue-800 font-medium">Key Points:</p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• We&apos;ll notify you of material changes via email</li>
                  <li>• Check the &quot;Last updated&quot; date for recent changes</li>
                </ul>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. For material changes,
                we will notify you via email or through a prominent notice on our service. You are advised to review
                this Privacy Policy periodically for any changes.
              </p>
            </section>

            {/* Section 14 */}
            <section id="contact" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this Privacy Policy, want to exercise your rights, or have concerns about our data practices, please contact us at:
              </p>
              <div className="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-700">
                  <strong className="text-gray-900">Inboop - Data Protection</strong><br /><br />
                  <span className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    privacy@inboop.com
                  </span>
                  <span className="flex items-center gap-2 mb-4">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    https://inboop.com
                  </span>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    Response Time: Within 30 days
                  </span>
                </p>
              </div>
            </section>
          </div>

          {/* Back to Top */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <Link href="#" className="text-sm text-gray-500 hover:text-green-700 transition-colors">
              ↑ Back to top
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}