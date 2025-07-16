import { ShieldCheck, Factory, ClipboardList, Award, ChevronRight, Star, TrendingUp } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Quality Assurance Services | Azul Global Trade',
  description: 'Ensure product excellence with our rigorous quality assurance and control services. We offer supplier vetting, production inspection, and certification for Turkish exports.',
  keywords: ['quality assurance services', 'production inspection', 'supplier vetting', 'product quality control', 'ISO certification', 'Turkish product quality'],
};

export default function QualityAssurancePage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-800 to-teal-600 text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <ShieldCheck className="mx-auto h-16 w-16 mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Uncompromising Quality, Guaranteed.
          </h1>
          <p className="text-lg md:text-xl text-green-200 max-w-3xl mx-auto">
            Our rigorous quality assurance is the cornerstone of our promise to you. We ensure every product meets the highest international standards of excellence.
          </p>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <ClipboardList className="h-12 w-12 mx-auto text-green-600 mb-2" />
              <p className="text-3xl font-bold">5,000+</p>
              <p className="text-gray-600">Inspections Conducted</p>
            </div>
            <div className="p-4">
              <Factory className="h-12 w-12 mx-auto text-green-600 mb-2" />
              <p className="text-3xl font-bold">500+</p>
              <p className="text-gray-600">Vetted Suppliers</p>
            </div>
            <div className="p-4">
              <TrendingUp className="h-12 w-12 mx-auto text-green-600 mb-2" />
              <p className="text-3xl font-bold">{'<0.5%'}</p>
              <p className="text-gray-600">Defect Rate</p>
            </div>
            <div className="p-4">
              <Award className="h-12 w-12 mx-auto text-green-600 mb-2" />
              <p className="text-3xl font-bold">100+</p>
              <p className="text-gray-600">Certifications Managed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        {/* Our Commitment Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Commitment to Excellence</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow">
              <Factory className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Supplier Vetting</h3>
              <p className="text-gray-600">We partner only with top-tier Turkish manufacturers who pass our stringent evaluation for quality, reliability, and ethical practices.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow">
              <ClipboardList className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">In-Process Inspection</h3>
              <p className="text-gray-600">Our experts conduct multi-stage inspections during production to ensure standards are met from raw material to final product.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow">
              <Award className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Certification & Compliance</h3>
              <p className="text-gray-600">We verify that all products hold necessary certifications (ISO, CE, etc.) required for your specific market.</p>
            </div>
          </div>
        </section>

        {/* Case Study Section */}
        <section className="mb-20 bg-green-50 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-center mb-10">Case Study: Carter Home Goods Reduces Defects</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="font-bold text-green-700 text-lg mb-2">The Challenge</h3>
              <p className="text-gray-600">Carter Home Goods was experiencing inconsistent quality with their textile imports from Turkey, leading to a high rate of customer returns and damaged brand reputation.</p>
            </div>
            <div>
              <h3 className="font-bold text-green-700 text-lg mb-2">Our Solution</h3>
              <p className="text-gray-600">We implemented a multi-stage inspection plan: vetting the raw materials, conducting in-process checks, and performing a final random inspection (FRI) before shipment.</p>
            </div>
            <div>
              <h3 className="font-bold text-green-700 text-lg mb-2">The Result</h3>
              <p className="text-gray-600">The defect rate dropped from 5% to under 0.5%. Carter Home Goods saved an estimated <strong>$50,000 in potential losses</strong> from returns and improved their customer satisfaction rating significantly.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Can I request a custom inspection plan?</AccordionTrigger>
              <AccordionContent>
                Absolutely. We can create a bespoke quality assurance plan tailored to your product's specific requirements and your risk tolerance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What happens if a product fails inspection?</AccordionTrigger>
              <AccordionContent>
                If any issues are found, we immediately work with the manufacturer to rectify them. The batch will not be shipped until it meets the agreed-upon quality standards, and you will be kept informed throughout the process.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Do you provide detailed inspection reports?</AccordionTrigger>
              <AccordionContent>
                Yes, after each inspection stage, you will receive a comprehensive report complete with photographs, findings, and our professional assessment, giving you full transparency and peace of mind.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Related Blog Posts Section */}
        <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Further Reading</h2>
            <div className="grid md:grid-cols-1 gap-8">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Understanding Quality Standards in Turkish Manufacturing (ISO, CE)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">What do certifications like ISO 9001 and CE marking mean? This guide demystifies the standards that guarantee product quality.</p>
                        <Link href="/blog/understanding-quality-standards-in-turkish-manufacturing-iso-ce" className="text-green-600 font-semibold hover:underline">
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
          <h2 className="text-3xl font-bold mb-4">Demand the Best for Your Business</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Don't leave quality to chance. Partner with us to ensure every product you import from Turkey meets your highest expectations.
          </p>
          <Link href="/contact" className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center">
            Request a Quality Consultation <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}