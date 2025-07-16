import { FadeInSection } from "@/components/fade-in-section"

export default function TermsOfServicePage() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-8">
              Terms of Service
            </h1>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600">
                Last updated: July 15, 2025
              </p>

              <p>
                These Terms of Service ("Terms") govern your use of the export intermediary services and website (https://azultrade.com) provided by Azul Global Trade ("we", "us", "our"). By using our Service, you agree to these Terms.
              </p>

              <h2>1. Our Role as an Intermediary</h2>
              <p>
                Azul Global Trade acts as a facilitator and intermediary connecting international buyers ("Buyers") with manufacturers and suppliers in Turkey ("Manufacturers"). We do not manufacture, own, or stock the products listed. Our service is to facilitate communication, negotiation, quality assurance, and logistics between Buyers and Manufacturers.
              </p>

              <h2>2. The Process</h2>
              <ul>
                <li>
                  <strong>Inquiry and Quotation:</strong> Buyers may submit inquiries for products. We will facilitate obtaining quotations from suitable Manufacturers. All quotes are provided by Manufacturers and are subject to change.
                </li>
                <li>
                  <strong>Orders:</strong> All purchase orders are agreements made directly between the Buyer and the Manufacturer, facilitated by us. We will assist in formalizing these agreements.
                </li>
                <li>
                  <strong>Disclaimer of Warranty:</strong> Products are sold "as is" and are subject to the Manufacturer's warranty, if any. We do not provide any warranties for the products. We will, however, assist Buyers in communicating with Manufacturers regarding product quality or warranty claims.
                </li>
              </ul>

              <h2>3. Responsibilities of Parties</h2>
              <ul>
                <li>
                  <strong>Buyers' Responsibilities:</strong> Buyers are responsible for providing accurate product specifications, conducting their own due diligence on products and manufacturers, and fulfilling payment obligations as agreed. Buyers are also responsible for complying with all import regulations in their country.
                </li>
                <li>
                  <strong>Manufacturers' Responsibilities:</strong> Manufacturers are responsible for providing accurate product information, ensuring product quality meets agreed-upon standards, and fulfilling orders in a timely manner.
                </li>
                <li>
                  <strong>Our Responsibilities:</strong> We are responsible for facilitating communication, providing support for logistics and documentation, and acting in good faith to ensure a smooth transaction for all parties.
                </li>
              </ul>

              <h2>4. Limitation of Liability</h2>
              <p>
                As an intermediary, our liability is limited to the scope of our services. We are not liable for any product defects, shipping delays, or breaches of contract between the Buyer and the Manufacturer. Our total liability in any matter shall not exceed any service fee we have charged for the specific transaction in question.
              </p>

              <h2>5. Governing Law and Dispute Resolution</h2>
              <p>
                These Terms are governed by the laws of Turkey. Any disputes arising from our intermediary services will be resolved through negotiation. If a resolution cannot be reached, disputes shall be settled in the courts of Istanbul, Turkey. Disputes between the Buyer and Manufacturer are subject to the terms of their direct agreement.
              </p>

              <h2>6. Changes to These Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of any changes by posting the new Terms on this page.
              </p>

              <h2>7. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us through the contact information provided on our website.
              </p>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  )
}