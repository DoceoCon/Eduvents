import Layout from '@/components/Layout';

export const metadata = {
  title: 'Privacy Policy | EDUVENTS',
  description: 'Privacy Policy for EDUVENTS - Learn how we collect, use, and protect your personal data.',
};

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <div className="container-tight py-12">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

          <p className="text-muted-foreground text-sm mb-8">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Who we are</h2>
            <p>
              Eduvents is a trading name of Doceo Consulting Ltd ("we", "us", "our"). We operate an online platform that lists education-focused events for educators and other professionals.
            </p>
            <p>
              Doceo Consulting Ltd is registered in England and Wales (Company No. 12962009), registered office at 36 Rathmore Road, London SE7 7QW, United Kingdom.
            </p>
            <p>
              We are the data controller for personal data processed in connection with the Eduvents website.
            </p>
            <p>
              If you have any questions about this policy or how we handle your data, contact:<br />
              Email: <a href="mailto:info@doceoconsulting.co.uk" className="text-primary hover:underline">info@doceoconsulting.co.uk</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Scope of this policy</h2>
            <p>This policy explains how we collect, use and share personal data when you:</p>
            <ul>
              <li>visit or use the Eduvents website</li>
              <li>submit an event listing as an organiser</li>
              <li>contact us by email or via any forms on the website</li>
            </ul>
            <p>
              It does not cover the websites or services of event organisers or any third-party sites we link to. Those organisations are separate controllers of your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. The data we collect</h2>
            <p>Even without user logins, we collect and process the following categories of personal data:</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Website usage and technical data:</h3>
            <p>
              IP address, browser type and version, device identifiers, approximate location (country/region), pages visited, time and date of visits, referral sources.
            </p>
            <p>
              This may be collected via server logs and cookies/Google Analytics.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Organiser data (when submitting an event):</h3>
            <ul>
              <li>Organiser name, organisation name (if provided), email address, and any other contact details you choose to include in the listing.</li>
              <li>Event content you provide, which may incidentally include personal data (e.g. speaker names).</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Payment-related data:</h3>
            <p>
              We do not collect or store card numbers or bank details.
            </p>
            <p>
              When you pay to submit an event, payment is processed directly by Stripe, who act as a separate controller and/or processor of your payment data under their own terms and privacy notices.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Communication data:</h3>
            <p>
              Information you provide when you contact us, such as your name, email address and the content of your message.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. How we use your data and lawful bases</h2>
            <p>We process personal data only where we have a lawful basis under UK GDPR. The main purposes and bases are:</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">To operate and provide the Eduvents service</h3>
            <ul>
              <li>To publish and manage event listings you submit.</li>
              <li>To display event information to website users.</li>
            </ul>
            <p>
              <strong>Lawful basis:</strong> performance of a contract (for organisers) and our legitimate interests in operating our website and services.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">To communicate with you</h3>
            <ul>
              <li>To send transactional emails (e.g. confirming receipt of a listing, notifying you when a listing is live or if we need more information).</li>
              <li>To respond to enquiries, complaints or support requests.</li>
            </ul>
            <p>
              <strong>Lawful basis:</strong> performance of a contract and our legitimate interests in providing customer service.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">To run analytics and improve our website</h3>
            <p>
              Using Google Analytics or similar tools to understand how visitors use Eduvents, diagnose problems and improve usability and content.
            </p>
            <p>
              <strong>Lawful basis:</strong> our legitimate interests in monitoring and improving our services. Where cookies are not strictly necessary, we will rely on consent where required by law.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">To comply with legal and regulatory obligations</h3>
            <p>
              For record-keeping, responding to lawful requests from authorities, and meeting our tax and accounting obligations.
            </p>
            <p>
              <strong>Lawful basis:</strong> compliance with legal obligations.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Marketing</h3>
            <p>
              We may send marketing emails (such as newsletters or promotional updates) only where you have explicitly opted in, or where permitted by law.
            </p>
            <p>
              You can opt out at any time using the unsubscribe link in our emails or by contacting us.
            </p>
            <p>
              <strong>Lawful basis:</strong> consent or, where appropriate, our legitimate interests in promoting our services, balanced against your rights.
            </p>

            <p className="mt-4 font-semibold">We do not sell personal data to third parties.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Cookies and similar technologies</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>enable core site functionality</li>
              <li>understand how visitors use our website via analytics tools such as Google Analytics</li>
            </ul>
            <p>
              Under UK rules, consent is generally required for non-essential cookies such as analytics. Our aim is to use low-risk analytics and respect your browser preferences, and we may introduce a cookie banner or consent mechanism as the service develops. Details of the types of cookies we use and how you can manage them will be set out in our Cookie Notice (to be linked from the site footer).
            </p>
            <p>
              You can control cookies through your browser settings, for example by blocking or deleting them. Doing so may affect how some parts of the website function.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Sharing your data</h2>
            <p>We may share personal data with:</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Service providers who support our operations, including:</h3>
            <ul>
              <li>website hosting and infrastructure providers</li>
              <li>analytics providers (e.g. Google Analytics)</li>
              <li>email service providers</li>
              <li>payment processor (Stripe) for organiser payments</li>
            </ul>
            <p>
              These providers are only permitted to process personal data on our instructions and for the purposes described in this policy, subject to appropriate data protection safeguards.
            </p>

            <p className="mt-4">We may also share data where required to:</p>
            <ul>
              <li>comply with law, regulation or legal process</li>
              <li>protect our rights, property or safety, or that of our users or others</li>
              <li>in connection with a business sale, merger or restructuring, in which case data may be transferred to the new owner under appropriate safeguards.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. International transfers</h2>
            <p>
              Some of our service providers (including Stripe and Google) may process personal data outside the UK, including in the EEA and the United States. Where this occurs, we will ensure that appropriate safeguards are in place, such as adequacy regulations, standard contractual clauses, or equivalent mechanisms recognised under UK data protection law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. How long we keep your data</h2>
            <p>We keep personal data only for as long as necessary for the purposes for which it was collected, including:</p>
            <ul>
              <li><strong>Event listings and organiser contact data:</strong> kept while the listing is live and for a reasonable period afterwards for record-keeping, audit and to handle enquiries or disputes.</li>
              <li><strong>Communication records:</strong> kept while necessary to manage our relationship with you and demonstrate how we have responded to requests or complaints.</li>
              <li><strong>Technical and analytics data:</strong> retained for limited periods as set by our analytics tools and hosting providers.</li>
            </ul>
            <p>
              We may retain certain information for longer where required for legal, tax or regulatory reasons.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Your rights</h2>
            <p>Under UK GDPR and, where applicable, EU GDPR, you have various rights in relation to your personal data, including:</p>
            <ul>
              <li><strong>Right of access</strong> – to request copies of the personal data we hold about you.</li>
              <li><strong>Right to rectification</strong> – to request correction of inaccurate or incomplete data.</li>
              <li><strong>Right to erasure</strong> – to request deletion of your data in certain circumstances.</li>
              <li><strong>Right to restrict processing</strong> – to ask us to limit how we use your data in certain circumstances.</li>
              <li><strong>Right to object</strong> – to object to processing based on our legitimate interests or for direct marketing.</li>
              <li><strong>Right to data portability</strong> – to receive certain data in a structured, commonly used format and/or request that we transfer it to another controller where technically feasible.</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at <a href="mailto:info@doceoconsulting.co.uk" className="text-primary hover:underline">info@doceoconsulting.co.uk</a>. We aim to respond within 14 days and in any case within one month, subject to any extensions permitted by law.
            </p>
            <p>
              You also have the right to lodge a complaint with the UK Information Commissioner's Office (ICO) or, if you are in the EU, your local data protection authority.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Data relating to events and attendees</h2>
            <p>
              Event organisers are responsible for any personal data they collect directly from attendees (for example, via their own registration pages or mailing lists). They are separate data controllers for that data and must provide their own privacy notices.
            </p>
            <p>
              Eduvents does not manage event registrations or attendee lists; users are directed to external booking links provided by organisers. You should check the privacy policies of organisers before registering for an event.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Security</h2>
            <p>
              We take appropriate technical and organisational measures to protect personal data against unauthorised access, loss, misuse or disclosure, having regard to the nature of the data and the risks involved. No system is completely secure, and we cannot guarantee absolute security of information transmitted to or from our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Children</h2>
            <p>
              Eduvents is aimed at adult professionals and organisations in the education sector. We do not knowingly collect personal data from children under 16 as users of the platform. If you believe a child has provided us with personal data, contact us and we will delete it where appropriate.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time, for example to reflect changes in law, guidance or our services. The latest version will always be available on the Eduvents website and will indicate the effective date.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
