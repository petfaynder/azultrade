import { Truck, Ship, Plane, Warehouse, FileBadge, ChevronRight, Star, TrendingUp } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Logistics Excellence | Azul Global Trade',
  description: 'Streamline your supply chain with our end-to-end export logistics services from Turkey, including freight forwarding, customs clearance, and warehousing.',
  keywords: ['international logistics', 'export logistics', 'customs clearance services', 'sea freight', 'air cargo', 'shipping from Turkey'],
};

export default function LogisticsExcellencePage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-800 to-indigo-600 text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <Truck className="mx-auto h-16 w-16 mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Seamless Logistics, Delivered.
          </h1>
          <p className="text-lg md:text-xl text-purple-200 max-w-3xl mx-auto">
            From factory floor to your doorstep, we orchestrate a flawless logistics journey, ensuring your goods arrive on time, every time.
          </p>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <Ship className="h-12 w-12 mx-auto text-purple-600 mb-2" />
              <p className="text-3xl font-bold">10,000+</p>
              <p className="text-gray-600">Containers Shipped</p>
            </div>
            <div className="p-4">
              <Plane className="h-12 w-12 mx-auto text-purple-600 mb-2" />
              <p className="text-3xl font-bold">99.8%</p>
              <p className="text-gray-600">On-Time Delivery</p>
            </div>
            <div className="p-4">
              <FileBadge className="h-12 w-12 mx-auto text-purple-600 mb-2" />
              <p className="text-3xl font-bold">100%</p>
              <p className="text-gray-600">Customs Compliance</p>
            </div>
            <div className="p-4">
              <Warehouse className="h-12 w-12 mx-auto text-purple-600 mb-2" />
              <p className="text-3xl font-bold">15+</p>
              <p className="text-gray-600">Global Warehouses</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        {/* Our Logistics Solutions Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Comprehensive Logistics Services</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <Ship className="h-10 w-10 mr-4 text-purple-600" />
                <h3 className="text-xl font-semibold">Ocean Freight</h3>
              </div>
              <p className="text-gray-600">Cost-effective and reliable sea transport for full container (FCL) and less-than-container (LCL) loads to all major global ports.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <Plane className="h-10 w-10 mr-4 text-purple-600" />
                <h3 className="text-xl font-semibold">Air Freight</h3>
              </div>
              <p className="text-gray-600">Fast and secure air cargo solutions for time-sensitive shipments, ensuring your products reach the market quickly.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <FileBadge className="h-10 w-10 mr-4 text-purple-600" />
                <h3 className="text-xl font-semibold">Customs Clearance</h3>
              </div>
              <p className="text-gray-600">Expert handling of all customs documentation and procedures to prevent delays and ensure smooth border crossings.</p>
            </div>
          </div>
        </section>

        {/* Case Study Section */}
        <section className="mb-20 bg-purple-50 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-center mb-10">Case Study: BuildRight Inc. Streamlines a Complex Order</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="font-bold text-purple-700 text-lg mb-2">The Challenge</h3>
              <p className="text-gray-600">BuildRight Inc. needed to source components from three different suppliers across Turkey for a single project, creating a complex logistical challenge.</p>
            </div>
            <div>
              <h3 className="font-bold text-purple-700 text-lg mb-2">Our Solution</h3>
              <p className="text-gray-600">We coordinated pickups from all three factories, consolidated the goods at our Istanbul warehouse into a single container, and managed the unified customs declaration.</p>
            </div>
            <div>
              <h3 className="font-bold text-purple-700 text-lg mb-2">The Result</h3>
              <p className="text-gray-600">BuildRight Inc. saved over <strong>25% in shipping costs</strong> compared to handling three separate shipments. The consolidated container arrived two days ahead of schedule, preventing project delays.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Do you handle door-to-door shipping?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer complete door-to-door services, managing every step from pickup at the manufacturer in Turkey to final delivery at your designated address.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can you consolidate shipments from multiple suppliers?</AccordionTrigger>
              <AccordionContent>
                Absolutely. We can consolidate goods from various Turkish suppliers into a single shipment, saving you significant costs on freight and customs clearance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is my shipment insured?</AccordionTrigger>
              <AccordionContent>
                We offer comprehensive cargo insurance options to protect your investment against any unforeseen circumstances during transit. We can discuss the best coverage for your specific needs.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Related Blog Posts Section */}
        <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Logistics Insights</h2>
            <div className="grid md:grid-cols-1 gap-8">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Logistics of Shipping from Turkey: A Cost & Time Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">Sea freight or air freight? This article breaks down the typical costs and transit times for shipping goods from Turkey.</p>
                        <Link href="/blog/logistics-of-shipping-from-turkey-a-cost-and-time-analysis" className="text-purple-600 font-semibold hover:underline">
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
          <h2 className="text-3xl font-bold mb-4">Get Your Shipment Moving</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Ready for a hassle-free logistics experience? Contact us for a customized shipping quote for your next import from Turkey.
          </p>
          <Link href="/contact" className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center">
            Request a Shipping Quote <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}