import Layout from '@/components/Layout';

export const metadata = {
  title: 'Terms of Use | EDUVENTS',
  description: 'Terms of Use for accessing and using the EDUVENTS website.',
};

export default function TermsOfUsePage() {
  return (
    <Layout>
      <div className="container-tight py-12">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <h1 className="text-4xl font-bold mb-8">Terms of Use</h1>

          <p className="text-muted-foreground text-sm mb-8">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. About us and these terms</h2>
            <p>
              Eduvents is a trading name of Doceo Consulting Ltd ("we", "us", "our"), a company registered in England and Wales (Company No. 12962009), registered office at 36 Rathmore Road, London SE7 7QW, United Kingdom.
            </p>
            <p>
              These Terms of Use govern your access to and use of the Eduvents website and any content, features or services available through it. By using the website, you agree to these Terms. If you do not agree, you must not use the website.
            </p>
            <p>
              Our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> explains how we handle personal data and forms part of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. What Eduvents does</h2>
            <p>
              Eduvents is an online directory and marketplace for education-focused events. We provide:
            </p>
            <ul>
              <li>a platform for organisers to list events such as conferences, CPD, webinars, podcasts and festivals</li>
              <li>a searchable interface for educators and other users to find and click through to events hosted by third parties</li>
            </ul>
            <p>
              We curate and manually review listings for quality and relevance, but we do not organise, operate or host the events themselves, and we are not a party to any contract between you and an organiser.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Your responsibilities as a website user</h2>
            <p>When using the website, you agree that you will:</p>
            <ul>
              <li>use it only for lawful purposes and in a way that does not infringe the rights of, or restrict or inhibit the use of the site by, any other person</li>
              <li>not attempt to gain unauthorised access to the site, servers or any connected systems</li>
              <li>not scrape, harvest or systematically extract data from the site without our prior written consent</li>
              <li>not use the site to send unsolicited communications or promotions (spam)</li>
            </ul>
            <p>
              If you create an account in future (when such functionality is introduced), additional terms may apply.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Event information and third-party links</h2>
            <p>
              Event listings are provided by organisers, not by us. While we review submissions and may decline or remove listings, we do not independently verify all details.
            </p>

            <p className="mt-4">We do not guarantee that:</p>
            <ul>
              <li>event descriptions, dates, locations, pricing or other details are accurate, complete or up to date</li>
              <li>events will take place as described or at all</li>
              <li>places will be available or suitable for your needs</li>
            </ul>

            <p className="mt-4">
              Links to external websites (including booking pages) are provided for convenience only. We have no control over, and are not responsible for, the content, privacy policies, or practices of any third-party websites or services.
            </p>

            <p className="mt-4 font-semibold">
              Any contract for event attendance, tickets or related services is between you and the organiser.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual property</h2>
            <p>
              All content on the website, including the layout, design, branding and underlying code, is owned by us or our licensors and is protected by intellectual property laws. You may view pages on the site and print or download them for your personal, non-commercial use.
            </p>

            <p className="mt-4">You must not:</p>
            <ul>
              <li>copy, reproduce, republish, sell, rent or sub-license website content, except as expressly permitted</li>
              <li>modify or create derivative works based on our content</li>
              <li>use our name, logo or branding without our prior written consent</li>
            </ul>

            <p className="mt-4">
              Event listings, images and descriptions are provided by organisers. By publishing such content, organisers grant us a non-exclusive, worldwide, royalty-free licence to use, reproduce, modify for formatting/clarity, and display that content on the Eduvents website and in related promotional materials.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Availability of the website</h2>
            <p>
              We aim to keep the website available and functioning, but we do not guarantee uninterrupted or error-free access. We may suspend, withdraw, or restrict availability of all or any part of the site for business or operational reasons without notice.
            </p>
            <p>
              We may update or change the website and its content at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Our responsibility to you</h2>
            <p>
              Nothing in these Terms excludes or limits our liability for death or personal injury caused by our negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be excluded under applicable law.
            </p>

            <p className="mt-4">Subject to the above, we will not be liable for:</p>
            <ul>
              <li>any loss or damage arising from your reliance on event listings or third-party websites</li>
              <li>any loss or damage related to the events themselves, including cancellation, quality or failure to deliver</li>
              <li>any indirect, consequential or special loss or damage</li>
              <li>any loss of profits, business, revenue, data, goodwill or anticipated savings</li>
            </ul>

            <p className="mt-4">
              Our total liability to you in connection with your use of the website will, to the fullest extent permitted by law, be limited to £100.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to these Terms</h2>
            <p>
              We may update these Terms from time to time. The latest version will be posted on the website with the effective date. Your continued use of the website after changes are posted constitutes your acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Governing law and jurisdiction</h2>
            <p>
              These Terms are governed by the laws of England and Wales, and any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales, regardless of where you access the website from.
            </p>
          </section>

          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Questions or concerns?</h3>
            <p>
              If you have any questions about these Terms of Use, please contact us at:
            </p>
            <p className="mt-2">
              Email: <a href="mailto:info@doceoconsulting.co.uk" className="text-primary hover:underline">info@doceoconsulting.co.uk</a>
            </p>
            <p className="mt-4 text-sm">
              If you are an event organiser looking to list an event, please also review our{' '}
              <a href="/terms-and-conditions" className="text-primary hover:underline">Terms & Conditions for Organisers</a>.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
