import { Globe, BarChart, Landmark, Users, ChevronRight, Star, TrendingUp, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Global Market Access | Azul Global Trade',
  description: 'Unlock new international markets with Azul Global Trade. We provide expert export consultancy, market analysis, and regulatory compliance for seamless global expansion.',
  keywords: ['international market access', 'export consultancy', 'global trade solutions', 'market research reports', 'import regulations', 'Turkish export'],
};

export default function GlobalMarketAccessPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-sky-600 text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <Globe className="mx-auto h-16 w-16 mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Unlock the World with Our Global Market Access
          </h1>
          <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto">
            We are your strategic partner in navigating the complexities of international trade. Our expert export consultancy turns global challenges into profitable opportunities.
          </p>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <TrendingUp className="h-12 w-12 mx-auto text-blue-600 mb-2" />
              <p className="text-3xl font-bold">50+</p>
              <p className="text-gray-600">Countries Reached</p>
            </div>
            <div className="p-4">
              <Users className="h-12 w-12 mx-auto text-blue-600 mb-2" />
              <p className="text-3xl font-bold">200+</p>
              <p className="text-gray-600">Global Partners</p>
            </div>
            <div className="p-4">
              <Landmark className="h-12 w-12 mx-auto text-blue-600 mb-2" />
              <p className="text-3xl font-bold">1,000+</p>
              <p className="text-gray-600">Customs Cleared</p>
            </div>
            <div className="p-4">
              <Star className="h-12 w-12 mx-auto text-blue-600 mb-2" />
              <p className="text-3xl font-bold">99%</p>
              <p className="text-gray-600">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        {/* Why Partner With Us Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why Partner with Azul for Market Expansion?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow">
              <BarChart className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Data-Driven Strategy</h3>
              <p className="text-gray-600">We leverage in-depth market research and analysis to build a targeted, effective market entry strategy for your products.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow">
              <Landmark className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Regulatory Mastery</h3>
              <p className="text-gray-600">Our team expertly handles all customs, compliance, and import regulations, ensuring a smooth, delay-free process.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-shadow">
              <Users className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Extensive Network</h3>
              <p className="text-gray-600">Gain access to our established network of distributors, buyers, and partners in over 50 countries worldwide.</p>
            </div>
          </div>
        </section>

        {/* Case Study Section */}
        <section className="mb-20 bg-blue-50 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-center mb-10">Case Study: Yılmaz Machinery Enters the German Market</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="font-bold text-blue-700 text-lg mb-2">The Challenge</h3>
              <p className="text-gray-600">Yılmaz Machinery, a leading Turkish manufacturer of industrial parts, wanted to enter the competitive German market but lacked the local knowledge of regulations and distribution channels.</p>
            </div>
            <div>
              <h3 className="font-bold text-blue-700 text-lg mb-2">Our Solution</h3>
              <p className="text-gray-600">Azul Global Trade conducted a comprehensive market analysis, identified key distributors, and managed the entire TUV certification and customs process. We provided a complete door-to-door logistics solution.</p>
            </div>
            <div>
              <h3 className="font-bold text-blue-700 text-lg mb-2">The Result</h3>
              <p className="text-gray-600">Within the first year, Yılmaz Machinery secured three major distribution deals, leading to a <strong>40% increase in their total export sales</strong> and establishing a strong foothold in the EU market.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Which markets do you specialize in?</AccordionTrigger>
              <AccordionContent>
                While we have a global reach, we have particularly strong networks in the European Union, Middle East, and North Africa. We conduct custom research to find the best fit for your specific product.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do you handle import regulations and tariffs?</AccordionTrigger>
              <AccordionContent>
                Our team of experts stays up-to-date with the latest trade policies and regulations for each country. We handle all paperwork and customs procedures to ensure full compliance and minimize costs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What kind of products do you work with?</AccordionTrigger>
              <AccordionContent>
                We work with a wide range of high-quality Turkish products, from industrial machinery and automotive parts to textiles and agricultural goods. Contact us to discuss your specific product category.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Related Blog Posts Section */}
        <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Insights & Strategies</h2>
            <div className="grid md:grid-cols-1 gap-8">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Top 5 In-Demand Turkish Products for International Markets in 2025</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">Turkey's diverse manufacturing sector offers a wealth of opportunities. We highlight the top 5 product categories that are seeing high demand globally.</p>
                        <Link href="/blog/top-5-in-demand-turkish-products-for-international-markets-2025" className="text-blue-600 font-semibold hover:underline">
                            Read More <ArrowRight className="inline h-4 w-4" />
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="bg-gray-100">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Your Business Global?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Let's discuss how our global market access solutions can help you achieve your export ambitions.
          </p>
          <Link href="/contact" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center">
            Contact Our Experts <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}