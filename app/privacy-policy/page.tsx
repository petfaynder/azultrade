import { FadeInSection } from "@/components/fade-in-section"

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-8">
              Privacy Policy
            </h1>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600">
                Last updated: July 15, 2025
              </p>

              <p>
                Azul Global Trade ("us", "we", or "our") operates as an export intermediary, connecting manufacturers in Turkey with international buyers (collectively, "you" or "users") through our website, https://azultrade.com (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
              </p>

              <h2>1. Information We Collect</h2>
              <p>
                We collect information to facilitate international trade and provide our brokerage services. The types of information we collect depend on your role (e.g., manufacturer, buyer, or general visitor).
              </p>
              <ul>
                <li>
                  <strong>Information from Buyers:</strong> When you submit a request for a quote or information, we collect your name, company name, email address, phone number, shipping country, and details about your product requirements.
                </li>
                <li>
                  <strong>Information from Manufacturers:</strong> To be listed as a partner, we collect company details, product catalogs, technical specifications, certifications, and contact information for key personnel.
                </li>
                <li>
                  <strong>Usage Data and Cookies:</strong> We automatically collect information about your device and how you interact with our Service, such as your IP address, browser type, pages visited, and time spent on the site, to improve user experience and for analytics.
                </li>
              </ul>

              <h2>2. How We Use Your Information</h2>
              <p>
                We use the information we collect for the following purposes:
              </p>
              <ul>
                <li>
                  <strong>To Facilitate Trade:</strong> To connect buyers with appropriate Turkish manufacturers based on product requirements and specifications. This involves sharing buyer inquiries with potential suppliers.
                </li>
                <li>
                  <strong>To Provide Our Services:</strong> To manage your inquiries, provide quotes, process orders, and handle logistics and export documentation.
                </li>
                <li>
                  <strong>To Communicate:</strong> To send you transaction-related information, updates on your orders, and marketing communications that may be of interest to you (you can opt-out at any time).
                </li>
                <li>
                  <strong>To Improve Our Service:</strong> To analyze usage trends, improve our website's functionality, and expand our network of manufacturers and buyers.
                </li>
              </ul>

              <h2>3. Sharing Your Information</h2>
              <p>
                Your information is shared selectively to make business connections happen:
              </p>
              <ul>
                <li>
                  <strong>With Manufacturers:</strong> We share buyer inquiries and contact information with our trusted network of Turkish manufacturers so they can provide quotes and product information.
                </li>
                <li>
                  <strong>With Buyers:</strong> We share manufacturer and product information with buyers to help them make informed purchasing decisions.
                </li>
                <li>
                  <strong>With Service Providers:</strong> We may share information with third-party service providers who perform services for us or on our behalf, such as logistics companies, customs brokers, and payment processors.
                </li>
                <li>
                  <strong>For Legal Reasons:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).
                </li>
              </ul>

              <h2>4. Data Security</h2>
              <p>
                We implement a variety of security measures to maintain the safety of your personal information. However, no electronic transmission or storage is 100% secure, and we cannot guarantee absolute data security.
              </p>

              <h2>5. International Data Transfers</h2>
              <p>
                As an international trade facilitator, your information will be transferred to and processed in Turkey and the countries where our buyers and service providers are located. We take steps to ensure that your data is treated securely and in accordance with this privacy policy.
              </p>

              <h2>6. Your Rights</h2>
              <p>
                You have the right to access, correct, or request the deletion of your personal data. Please contact us to exercise these rights.
              </p>

              <h2>7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us through the contact information provided on our website.
              </p>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  )
}