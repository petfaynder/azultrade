import { Wrench, LifeBuoy, BookUser, Settings, ChevronRight, Star, TrendingUp } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Technical Support & After-Sales | Azul Global Trade',
  description: 'Receive expert technical support for your imported Turkish products. We offer installation guidance, troubleshooting, and spare parts to ensure optimal performance.',
  keywords: ['technical support services', 'product installation', 'after-sales support', 'export product troubleshooting', 'spare parts supply'],
};

export default function TechnicalSupportPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-700 to-pink-600 text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <Wrench className="mx-auto h-16 w-16 mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Your Partner, Beyond the Purchase
          </h1>
          <p className="text-lg md:text-xl text-red-200 max-w-3xl mx-auto">
            Our relationship doesn't end at the sale. We provide dedicated, ongoing technical support to ensure your continued success with our products.
          </p>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <LifeBuoy className="h-12 w-12 mx-auto text-red-600 mb-2" />
              <p className="text-3xl font-bold">24hr</p>
              <p className="text-gray-600">Avg. Response Time</p>
            </div>
            <div className="p-4">
              <TrendingUp className="h-12 w-12 mx-auto text-red-600 mb-2" />
              <p className="text-3xl font-bold">98%</p>
              <p className="text-gray-600">Issues Resolved First-Contact</p>
            </div>
            <div className="p-4">
              <Settings className="h-12 w-12 mx-auto text-red-600 mb-2" />
              <p className="text-3xl font-bold">10,000+</p>
              <p className="text-gray-600">Spare Parts in Stock</p>
            </div>
            <div className="p-4">
              <Star className="h-12 w-12 mx-auto text-red-600 mb-2" />
              <p className="text-3xl font-bold">4.9/5</p>
              <p className="text-gray-600">Support Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        {/* Our Support Pillars Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Pillars of Support</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow">
              <BookUser className="h-12 w-12 mx-auto text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Product Training</h3>
              <p className="text-gray-600">We provide your team with comprehensive training for correct installation, operation, and maintenance of your products.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow">
              <LifeBuoy className="h-12 w-12 mx-auto text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Responsive Troubleshooting</h3>
              <p className="text-gray-600">Our dedicated support team is ready to rapidly diagnose and resolve any technical issues via remote or on-site assistance.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow">
              <Settings className="h-12 w-12 mx-auto text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Spare Parts & Maintenance</h3>
              <p className="text-gray-600">We ensure a reliable supply of genuine spare parts and offer proactive maintenance plans to maximize product lifespan.</p>
            </div>
          </div>
        </section>

        {/* Case Study Section */}
        <section className="mb-20 bg-red-50 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-center mb-10">Case Study: Precision Manufacturing Minimizes Downtime</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="font-bold text-red-700 text-lg mb-2">The Challenge</h3>
              <p className="text-gray-600">A critical CNC machine imported from Turkey went down, halting a major production line for Precision Manufacturing and costing them thousands per hour.</p>
            </div>
            <div>
              <h3 className="font-bold text-red-700 text-lg mb-2">Our Solution</h3>
              <p className="text-gray-600">The client contacted our 24/7 support line. Our technician diagnosed the fault remotely via video call within an hour and identified the failing component. The genuine spare part was dispatched from our stock immediately.</p>
            </div>
            <div>
              <h3 className="font-bold text-red-700 text-lg mb-2">The Result</h3>
              <p className="text-gray-600">The part arrived in 48 hours, and the machine was operational again. The client avoided weeks of potential downtime waiting for a part from the OEM, saving an estimated <strong>$150,000 in lost production</strong>.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What are your support hours?</AccordionTrigger>
              <AccordionContent>
                Our standard technical support is available during business hours (9:00 AM - 6:00 PM, GMT+3). We also offer premium 24/7 support packages for critical operations.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is technical support included with my purchase?</AccordionTrigger>
              <AccordionContent>
                Yes, all our products come with a standard warranty and technical support package. We also offer extended warranty and enhanced support plans for added peace of mind.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How quickly can I get spare parts?</AccordionTrigger>
              <AccordionContent>
                We maintain a stock of critical spare parts for immediate dispatch. Delivery times depend on your location and the chosen shipping method, but we always prioritize speed to minimize your downtime.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Related Blog Posts Section */}
        <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Proactive Maintenance Tips</h2>
            <div className="grid md:grid-cols-1 gap-8">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>After-Sales Support: How to Extend the Lifespan of Your Imported Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">The purchase is just the beginning. Learn proactive maintenance tips and the importance of quality after-sales support.</p>
                        <Link href="/blog/after-sales-support-extending-product-lifespan" className="text-red-600 font-semibold hover:underline">
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
          <h2 className="text-3xl font-bold mb-4">We're Here to Help You Succeed</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Have a technical question or need assistance with a product? Our expert team is ready to help.
          </p>
          <Link href="/contact" className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center">
            Contact Technical Support <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}