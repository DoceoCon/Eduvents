import Layout from '@/components/Layout';

export const metadata = {
  title: 'Terms & Conditions | EDUVENTS',
  description: 'Terms & Conditions for event organisers listing events on EDUVENTS platform.',
};

export default function TermsAndConditionsPage() {
  return (
    <Layout>
      <div className="container-tight py-12">
        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>

          <p className="text-muted-foreground text-sm mb-8">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. About us and these terms</h2>
            <p>
              Eduvents is a trading name of Doceo Consulting Ltd ("we", "us", "our"), a company registered in England and Wales (Company No. 12962009), registered office at 36 Rathmore Road, London SE7 7QW, United Kingdom.
            </p>
            <p>
              These Terms & Conditions apply when you, as an event organiser ("you", "organiser"), submit events for listing on the Eduvents website and purchase any related services (such as featured placements or advertising).
            </p>
            <p>
              By submitting an event or making payment, you agree to these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Our service</h2>
            <p>We provide:</p>
            <ul>
              <li>an online platform where you can submit details of education-related events (including conferences, CPD, webinars, podcasts, awards, exhibitions and festivals) for publication</li>
              <li>optional enhanced visibility services such as featured listings, homepage carousel placement or advertising, if and when available</li>
            </ul>
            <p>
              We manually review submissions and may accept, request changes to, or reject listings at our discretion. Acceptance of a submission does not mean we endorse or guarantee your event.
            </p>

            <p className="mt-4">We do not:</p>
            <ul>
              <li>sell tickets or manage registration for your events</li>
              <li>enter into any contract with attendees for event attendance</li>
              <li>guarantee a particular number of views, clicks, registrations or any particular outcome from a listing or advertisement</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Content you provide</h2>
            <p>When submitting an event, you are responsible for providing accurate, complete and up-to-date information, including:</p>
            <ul>
              <li>event title</li>
              <li>description</li>
              <li>date and time</li>
              <li>venue address or online meeting link</li>
              <li>event category, format, phase and subject tags</li>
              <li>pricing information (including whether free or paid)</li>
              <li>organiser name and contact email</li>
              <li>a single event image</li>
              <li>external booking link</li>
            </ul>

            <p className="mt-4">You warrant that:</p>
            <ul>
              <li>all information you provide is accurate, not misleading and relates to a genuine event</li>
              <li>you have all necessary rights, licences and permissions to use and submit any text, images, logos and other content, including where images contain people or third-party branding</li>
              <li>your event and your content comply with all applicable laws and regulations, and do not infringe any third-party rights</li>
            </ul>

            <p className="mt-4">
              You must promptly update or notify us of any significant changes to your event (for example, change of date, venue or cancellation) so that the listing can be updated or removed.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Our rights over your listings</h2>
            <p>
              By submitting content, you grant us a non-exclusive, worldwide, royalty-free licence to use, reproduce, modify for formatting or clarity, and display your content on the Eduvents website and in our marketing materials for the duration of the listing and a reasonable period afterwards.
            </p>

            <p className="mt-4">We may:</p>
            <ul>
              <li>edit titles or descriptions for clarity, formatting or consistency</li>
              <li>re-categorise events to improve discoverability</li>
              <li>refuse to publish or remove a listing at any time if we believe it is misleading, inappropriate, not aligned with our education focus, or otherwise unsuitable for the platform</li>
            </ul>

            <p className="mt-4">
              If we remove a listing for breach of these Terms or applicable law, no refund will be due.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Fees, payment and refunds</h2>
            <p>
              Fees for listings and any optional featured placements or advertising will be shown on the website, in our order process, or as otherwise agreed with you (for example, for bulk/custom deals).
            </p>
            <ul>
              <li>Payment is due in advance via Stripe.</li>
              <li>We do not store card details; Stripe processes payments under its own terms and privacy notices.</li>
            </ul>
            <p>
              We aim to review and, if accepted, publish standard listings within 24–48 hours of receiving payment and complete information. This is an aim, not a guaranteed service level.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Refunds:</h3>
            <ul>
              <li>Once a listing is accepted and published, fees are generally non-refundable.</li>
              <li>We may, at our sole discretion, offer a partial or full refund or a re-listing credit where an event is cancelled or in other exceptional circumstances.</li>
              <li>If we are unable to publish your listing at all due to our own fault, our liability will be limited to a refund of the fee you paid for that listing.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your relationship with attendees</h2>
            <p>You acknowledge that:</p>
            <ul>
              <li>any contract for event attendance, tickets, or related services is between you and the attendee</li>
              <li>you are solely responsible for managing registrations, payments (if any), event delivery, cancellations and refunds to attendees</li>
              <li>you must provide clear terms and a privacy policy on your own website or booking pages, and comply with all applicable consumer and data protection laws</li>
            </ul>

            <p className="mt-4">Eduvents is not responsible for:</p>
            <ul>
              <li>attendee satisfaction, learning outcomes or any issues arising before, during or after your event</li>
              <li>handling attendee complaints, cancellations or refunds</li>
            </ul>

            <p className="mt-4">
              If attendees contact us about your event, we may refer them to you and/or share your organiser contact details with them as displayed on the listing.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Data protection</h2>
            <p>
              Each party is an independent controller in respect of the personal data it processes for its own purposes.
            </p>
            <ul>
              <li>We act as controller for organiser contact data and website user data processed in connection with Eduvents, as described in our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.</li>
              <li>You act as controller for attendee data you collect directly (for example, via your own booking systems or mailing lists).</li>
            </ul>
            <p>
              You must comply with all applicable data protection laws (including UK GDPR and, where applicable, EU GDPR) in relation to any personal data you process.
            </p>
            <p>
              Where we share limited personal data (for example, organiser contact details displayed on listings), this is done for the purposes of providing the Eduvents service and connecting organisers with potential attendees.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Complaints and takedown</h2>
            <p>
              If we receive a complaint or become aware of concerns about your event or content (for example, allegations of misleading information, infringement or inappropriate material), we may:
            </p>
            <ul>
              <li>contact you for an explanation or evidence</li>
              <li>temporarily suspend or permanently remove your listing</li>
              <li>decline to accept further listings from you</li>
            </ul>
            <p>
              We aim to acknowledge complaints about listings within 7 days and to take appropriate steps as soon as reasonably practicable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Indemnity</h2>
            <p>
              You agree to indemnify us and hold us harmless from and against any claims, demands, losses, damages, costs and expenses (including reasonable legal fees) arising out of or in connection with:
            </p>
            <ul>
              <li>your event, including its organisation, promotion, content and delivery</li>
              <li>any breach by you of these Terms</li>
              <li>any allegation that your content infringes any intellectual property or other rights of a third party</li>
              <li>your failure to comply with applicable laws, including consumer and data protection laws</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Our liability to you</h2>
            <p>
              Nothing in these Terms limits or excludes our liability for death or personal injury caused by our negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be excluded under law.
            </p>

            <p className="mt-4">Subject to this:</p>
            <ul>
              <li>we are not liable for any indirect, consequential or special loss or damage</li>
              <li>we are not liable for loss of profits, revenue, business, goodwill, anticipated savings or data</li>
              <li>our total aggregate liability to you in connection with any listing or related service is limited to the total fees you paid to us for that listing in the 12 months preceding the event giving rise to the claim</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
            <p>We may terminate or suspend your access to organiser services and remove your listings immediately if:</p>
            <ul>
              <li>you breach these Terms or we reasonably suspect you have done so</li>
              <li>we receive serious or repeated complaints about your events or content</li>
              <li>we decide to discontinue the Eduvents service or materially change its nature</li>
            </ul>
            <p>
              Termination does not affect any rights or obligations that have already accrued.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Changes to these Terms</h2>
            <p>
              We may update these Terms & Conditions from time to time. The latest version will be available on the Eduvents website and will apply to new listings submitted after the effective date. We will use reasonable efforts to notify existing organisers of significant changes, for example by email.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Governing law and jurisdiction</h2>
            <p>
              These Terms are governed by the laws of England and Wales and any disputes arising out of or in connection with them shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Questions or concerns?</h3>
            <p>
              If you have any questions about these Terms & Conditions, please contact us at:
            </p>
            <p className="mt-2">
              Email: <a href="mailto:info@doceoconsulting.co.uk" className="text-primary hover:underline">info@doceoconsulting.co.uk</a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
