import { FileText, Banknote, CheckCircle, ShieldAlert, ChevronRight, Star, TrendingUp } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Export Documentation Services | Azul Global Trade',
  description: 'Navigate international trade with confidence. We provide meticulous export documentation services, including L/C management and customs paperwork, to ensure compliance.',
  keywords: ['export documents', 'customs paperwork', 'certificate of origin', 'bill of lading', 'letter of credit management', 'commercial invoice'],
};

export default function ExportDocumentationPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-700 to-orange-500 text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <FileText className="mx-auto h-16 w-16 mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Flawless Documentation for Seamless Trade
          </h1>
          <p className="text-lg md:text-xl text-yellow-200 max-w-3xl mx-auto">
            Accurate paperwork is the key to successful exports. Our experts manage every detail, ensuring your shipments clear customs without a hitch.
          </p>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <CheckCircle className="h-12 w-12 mx-auto text-yellow-600 mb-2" />
              <p className="text-3xl font-bold">100%</p>
              <p className="text-gray-600">Document Accuracy</p>
            </div>
            <div className="p-4">
              <Banknote className="h-12 w-12 mx-auto text-yellow-600 mb-2" />
              <p className="text-3xl font-bold">$50M+</p>
              <p className="text-gray-600">in L/C Transactions</p>
            </div>
            <div className="p-4">
              <TrendingUp className="h-12 w-12 mx-auto text-yellow-600 mb-2" />
              <p className="text-3xl font-bold">0</p>
              <p className="text-gray-600">Fines or Penalties</p>
            </div>
            <div className="p-4">
              <ShieldAlert className="h-12 w-12 mx-auto text-yellow-600 mb-2" />
              <p className="text-3xl font-bold">48-Hour</p>
              <p className="text-gray-600">Document Turnaround</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        {/* Our Documentation Expertise Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Documentation Expertise</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow">
              <CheckCircle className="h-12 w-12 mx-auto text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Accuracy & Compliance</h3>
              <p className="text-gray-600">We guarantee meticulous preparation of all documents, ensuring 100% compliance with the regulations of the destination country.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow">
              <Banknote className="h-12 w-12 mx-auto text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Letter of Credit (L/C)</h3>
              <p className="text-gray-600">Expert management of complex L/C transactions to secure your payments and satisfy all banking requirements.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow">
              <ShieldAlert className="h-12 w-12 mx-auto text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Risk Mitigation</h3>
              <p className="text-gray-600">Proper documentation minimizes the risk of customs penalties, delays, and payment disputes, protecting your investment.</p>
            </div>
          </div>
        </section>

        {/* Case Study Section */}
        <section className="mb-20 bg-yellow-50 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-center mb-10">Case Study: Jamil Textiles Secures Payment</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="font-bold text-yellow-700 text-lg mb-2">The Challenge</h3>
              <p className="text-gray-600">Jamil Textiles was entering a new market and needed to secure a large payment from a new buyer, but was concerned about the risk of non-payment.</p>
            </div>
            <div>
              <h3 className="font-bold text-yellow-700 text-lg mb-2">Our Solution</h3>
              <p className="text-gray-600">We structured the deal using a confirmed Letter of Credit (L/C). Our team meticulously prepared all shipping documents to perfectly match the L/C terms, ensuring zero discrepancies.</p>
            </div>
            <div>
              <h3 className="font-bold text-yellow-700 text-lg mb-2">The Result</h3>
              <p className="text-gray-600">The documents were accepted by the bank on first presentation. Jamil Textiles received their full payment <strong>within 48 hours of shipment</strong>, completely eliminating payment risk and building trust with their new buyer.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Why is a Certificate of Origin important?</AccordionTrigger>
              <AccordionContent>
                A Certificate of Origin is crucial for customs clearance and can determine the tariff or duty rate applied to your goods. It's often required under Free Trade Agreements to receive preferential treatment.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How long does the documentation process take?</AccordionTrigger>
              <AccordionContent>
                The timeline varies depending on the complexity and destination country. However, our expertise allows us to work efficiently, and we typically have all documents prepared and ready before the shipment is scheduled to depart.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can you handle documents for restricted or specialized goods?</AccordionTrigger>
              <AccordionContent>
                Yes, we have experience managing documentation for a wide variety of goods, including those that require special permits or licenses. We will advise you on all specific requirements for your product.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Related Blog Posts Section */}
        <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Documentation Deep Dive</h2>
            <div className="grid md:grid-cols-1 gap-8">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Navigating Customs When Importing from Turkey</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">Understand the key documents, potential duties, and procedures for a smooth customs process when importing goods from Turkey.</p>
                        <Link href="/blog/navigating-customs-when-importing-from-turkey" className="text-yellow-600 font-semibold hover:underline">
                            Read More <ChevronRight className="inline h-4 w-4" />
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="bg-gray-100">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't Let Paperwork Slow You Down</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Focus on your business, and let us handle the complexities of export documentation. Contact us for a consultation.
          </p>
          <Link href="/contact" className="bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-700 transition-colors inline-flex items-center">
            Get Documentation Support <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}