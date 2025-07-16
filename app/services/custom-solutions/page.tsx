import { Lightbulb, Search, Package, Palette, ChevronRight, Star, TrendingUp } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Custom Solutions & Private Label | Azul Global Trade',
  description: 'Bring your unique product vision to life. We offer custom sourcing, private label manufacturing, and bespoke packaging solutions from top Turkish producers.',
  keywords: ['custom manufacturing solutions', 'private label Turkey', 'contract manufacturing', 'custom product sourcing', 'bespoke export solutions', 'Turkish manufacturers'],
};

export default function CustomSolutionsPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-800 to-blue-600 text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <Lightbulb className="mx-auto h-16 w-16 mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Your Vision, Manufactured.
          </h1>
          <p className="text-lg md:text-xl text-indigo-200 max-w-3xl mx-auto">
            Go beyond the standard catalog. We specialize in turning your unique ideas into market-ready products through our extensive network of Turkish manufacturers.
          </p>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <Search className="h-12 w-12 mx-auto text-indigo-600 mb-2" />
              <p className="text-3xl font-bold">100+</p>
              <p className="text-gray-600">Custom Projects</p>
            </div>
            <div className="p-4">
              <Palette className="h-12 w-12 mx-auto text-indigo-600 mb-2" />
              <p className="text-3xl font-bold">50+</p>
              <p className="text-gray-600">Private Label Brands</p>
            </div>
            <div className="p-4">
              <TrendingUp className="h-12 w-12 mx-auto text-indigo-600 mb-2" />
              <p className="text-3xl font-bold">6 months</p>
              <p className="text-gray-600">Avg. Idea-to-Market</p>
            </div>
            <div className="p-4">
              <Package className="h-12 w-12 mx-auto text-indigo-600 mb-2" />
              <p className="text-3xl font-bold">1M+</p>
              <p className="text-gray-600">Custom Units Shipped</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        {/* Our Custom Services Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Tailor-Made Export Solutions</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <Search className="h-10 w-10 mr-4 text-indigo-600" />
                <h3 className="text-xl font-semibold">Custom Sourcing</h3>
              </div>
              <p className="text-gray-600">Have a specific product in mind? We'll leverage our deep industry connections to find the perfect Turkish manufacturer to produce it for you.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <Palette className="h-10 w-10 mr-4 text-indigo-600" />
                <h3 className="text-xl font-semibold">Private Labeling</h3>
              </div>
              <p className="text-gray-600">Build your own brand. We manage the entire private label process, from product modification to branded packaging.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <Package className="h-10 w-10 mr-4 text-indigo-600" />
                <h3 className="text-xl font-semibold">Bespoke Packaging</h3>
              </div>
              <p className="text-gray-600">Create a lasting impression with custom packaging solutions designed to protect your product and reflect your brand identity.</p>
            </div>
          </div>
        </section>

        {/* Case Study Section */}
        <section className="mb-20 bg-indigo-50 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-center mb-10">Case Study: Loren Home Essentials Launches a New Product Line</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="font-bold text-indigo-700 text-lg mb-2">The Challenge</h3>
              <p className="text-gray-600">Loren Home Essentials, an online retailer, wanted to launch a new line of organic cotton towels but lacked manufacturing experience and connections.</p>
            </div>
            <div>
              <h3 className="font-bold text-indigo-700 text-lg mb-2">Our Solution</h3>
              <p className="text-gray-600">We sourced a GOTS-certified textile manufacturer in Denizli, managed the sample approval process, and oversaw the production of custom-branded packaging and labels.</p>
            </div>
            <div>
              <h3 className="font-bold text-indigo-700 text-lg mb-2">The Result</h3>
              <p className="text-gray-600">The product line was launched in <strong>under 6 months</strong> from the initial concept. The high-quality product received excellent customer reviews, becoming a bestseller for the brand within its first quarter.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is the minimum order quantity (MOQ) for custom products?</AccordionTrigger>
              <AccordionContent>
                MOQs vary greatly depending on the product and manufacturer. During our initial consultation, we will discuss your needs and find a partner whose production capabilities align with your desired order volume.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I make modifications to an existing product?</AccordionTrigger>
              <AccordionContent>
                Yes, this is a very common request. We can work with manufacturers to modify existing products to your specifications, whether it's a change in material, color, features, or branding.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Who owns the intellectual property (IP) for a custom-designed product?</AccordionTrigger>
              <AccordionContent>
                You, the client, retain the intellectual property rights for any unique designs you commission. We can facilitate non-disclosure agreements (NDAs) with manufacturers to protect your IP.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Related Blog Posts Section */}
        <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Creator's Corner</h2>
            <div className="grid md:grid-cols-1 gap-8">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Private Label in Turkey: From Concept to Branded Product</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">Leverage Turkey's manufacturing prowess to build your own brand. This guide covers the process, benefits, and key considerations for private label manufacturing.</p>
                        <Link href="/blog/private-label-in-turkey-from-concept-to-branded-product" className="text-indigo-600 font-semibold hover:underline">
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
          <h2 className="text-3xl font-bold mb-4">Have a Unique Product Idea?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Let's make it happen. Contact our custom solutions team to explore the possibilities of manufacturing in Turkey.
          </p>
          <Link href="/contact" className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center">
            Discuss Your Project <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}