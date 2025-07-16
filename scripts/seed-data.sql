-- Insert sample products
INSERT INTO products (name, category, manufacturer, price, description, features, image, badge, status) VALUES
('Premium Feed Mixer TMR-500', 'Agricultural Machinery', 'Ankara Agricultural Tech', '$45,000', 'High-capacity total mixed ration feed mixer with advanced mixing technology for dairy and beef operations.', ARRAY['500kg capacity', 'Stainless steel construction', 'Digital control panel', '2-year warranty'], '/placeholder.svg?height=300&width=400', 'Best Seller', 'active'),

('Industrial Pasta Production Line', 'Food Processing', 'Istanbul Food Systems', '$125,000', 'Complete pasta production line with cutting-edge technology for commercial pasta manufacturing.', ARRAY['500kg/hour capacity', 'Automated control', 'Food grade materials', 'CE certified'], '/placeholder.svg?height=300&width=400', 'Premium', 'active'),

('Organic Turkish Honey', 'Food Products', 'Anatolian Bee Farms', '$25/kg', 'Pure organic honey from the pristine mountains of Anatolia, certified organic and sustainably harvested.', ARRAY['100% organic', 'Raw and unprocessed', 'Multiple floral sources', 'Glass jar packaging'], '/placeholder.svg?height=300&width=400', 'Organic', 'active'),

('CNC Machining Center', 'Industrial Equipment', 'Bursa Precision Tools', '$85,000', 'High-precision CNC machining center for automotive and aerospace applications.', ARRAY['5-axis capability', 'Tool changer', 'Precision ±0.001mm', 'Training included'], '/placeholder.svg?height=300&width=400', 'High-Tech', 'active'),

('Turkish Delight Assortment', 'Food Products', 'Istanbul Confectionery', '$15/box', 'Traditional Turkish delight in various flavors, made with authentic recipes passed down through generations.', ARRAY['12 different flavors', 'Natural ingredients', 'Gift packaging', 'Halal certified'], '/placeholder.svg?height=300&width=400', 'Traditional', 'active'),

('Hydraulic Press 200T', 'Industrial Equipment', 'Izmir Heavy Industries', '$35,000', 'Heavy-duty hydraulic press for metal forming and industrial applications.', ARRAY['200 ton capacity', 'Programmable controls', 'Safety systems', 'Installation support'], '/placeholder.svg?height=300&width=400', 'Industrial', 'active');

-- Insert sample blog posts
INSERT INTO blog_posts (title, excerpt, content, author, author_role, category, tags, image, featured) VALUES
('The Future of Turkish Agricultural Exports', 'Exploring how Turkish agricultural machinery is revolutionizing farming practices worldwide and driving export growth.', 'Turkish agricultural machinery has become a cornerstone of the country''s export success, with innovative companies developing cutting-edge solutions that meet the evolving needs of farmers worldwide. From precision farming equipment to sustainable processing technologies, Turkish manufacturers are at the forefront of agricultural innovation.

The sector has experienced remarkable growth, with exports reaching new heights year after year. This success can be attributed to several factors: advanced engineering capabilities, competitive pricing, and a deep understanding of diverse agricultural needs across different climates and farming practices.

Key areas of innovation include:

**Smart Farming Technologies**
Turkish manufacturers are integrating IoT sensors, GPS guidance, and AI-powered analytics into their equipment, enabling farmers to optimize their operations with unprecedented precision.

**Sustainable Solutions**
Environmental consciousness drives the development of energy-efficient machinery and sustainable farming practices, aligning with global trends toward eco-friendly agriculture.

**Customization and Adaptability**
Understanding that farming needs vary significantly across regions, Turkish companies excel at customizing their equipment for specific crops, climates, and farming methods.

The future looks bright for Turkish agricultural exports, with continued investment in R&D and strong partnerships with international distributors ensuring sustained growth in global markets.', 'Mehmet Özkan', 'Agricultural Export Specialist', 'Agriculture', ARRAY['agriculture', 'exports', 'technology', 'farming'], '/placeholder.svg?height=400&width=600', true),

('Turkish Food Products: A Global Culinary Journey', 'Discover how traditional Turkish food products are conquering international markets with their authentic flavors and premium quality.', 'Turkish cuisine has captivated food lovers worldwide for centuries, and today, Turkish food products are experiencing unprecedented global demand. From the aromatic spices of Istanbul''s Grand Bazaar to the organic honey of Anatolia''s pristine mountains, Turkish food exports represent a perfect blend of tradition and modern quality standards.

**The Heritage of Flavor**
Turkish food products carry with them thousands of years of culinary tradition. Each product tells a story of ancient trade routes, diverse cultural influences, and time-tested recipes that have been perfected over generations.

**Quality and Certification**
Modern Turkish food producers combine traditional methods with contemporary quality assurance practices. Many products carry international certifications including:
- Organic certification for natural products
- Halal certification for Muslim markets
- EU quality standards for European exports
- FDA approval for US markets

**Popular Export Categories**

*Confectionery and Sweets*
Turkish delight, baklava, and other traditional sweets have found enthusiastic audiences in luxury food markets worldwide.

*Dried Fruits and Nuts*
Turkey''s diverse climate produces exceptional dried fruits, nuts, and legumes that are prized for their quality and flavor.

*Dairy and Honey Products*
Artisanal cheeses and pure honey from Turkey''s pristine regions command premium prices in international markets.

**Market Expansion**
Turkish food exporters are successfully penetrating new markets through strategic partnerships, participation in international food fairs, and digital marketing initiatives that showcase the authenticity and quality of Turkish products.

The future of Turkish food exports looks promising, with growing consumer interest in authentic, high-quality food products driving continued expansion into new markets worldwide.', 'Ayşe Demir', 'Food Industry Analyst', 'Food & Beverage', ARRAY['food', 'exports', 'turkish cuisine', 'international markets'], '/placeholder.svg?height=400&width=600', true),

('Industrial Equipment: Turkey''s Manufacturing Excellence', 'How Turkish industrial equipment manufacturers are competing on the global stage with innovative solutions and competitive advantages.', 'Turkey''s industrial equipment sector has emerged as a powerhouse in global manufacturing, combining decades of engineering expertise with modern production capabilities to serve industries worldwide. From textile machinery to heavy industrial equipment, Turkish manufacturers have established themselves as reliable partners for businesses seeking quality, innovation, and value.

**Engineering Excellence**
Turkish industrial equipment manufacturers benefit from a strong engineering tradition, with many companies founded by experienced engineers who understand both the technical requirements and practical applications of industrial machinery.

**Competitive Advantages**

*Strategic Location*
Turkey''s position between Europe, Asia, and Africa provides unique advantages for both sourcing materials and accessing global markets.

*Skilled Workforce*
A well-educated workforce with strong technical skills ensures high-quality manufacturing and continuous innovation.

*Cost Effectiveness*
Competitive production costs without compromising quality make Turkish equipment attractive to cost-conscious buyers worldwide.

**Key Sectors**

*Textile and Garment Machinery*
Turkey''s strong textile industry has driven innovation in textile machinery, with Turkish manufacturers now exporting advanced equipment globally.

*Food Processing Equipment*
Leveraging expertise from Turkey''s food industry, manufacturers produce sophisticated food processing and packaging equipment.

*Construction and Mining Equipment*
Heavy machinery for construction and mining applications represents a growing segment of Turkish industrial exports.

**Innovation and R&D**
Turkish manufacturers invest heavily in research and development, often collaborating with universities and research institutions to develop next-generation industrial solutions.

**Global Partnerships**
Success in international markets comes through strategic partnerships with distributors, service providers, and end users who appreciate the reliability and performance of Turkish industrial equipment.

The sector continues to grow, with increasing focus on automation, digitalization, and sustainable manufacturing practices that position Turkish industrial equipment manufacturers for continued success in global markets.', 'Can Yılmaz', 'Industrial Equipment Expert', 'Manufacturing', ARRAY['industrial equipment', 'manufacturing', 'exports', 'innovation'], '/placeholder.svg?height=400&width=600', false),

('Sustainable Export Practices: Turkey''s Green Initiative', 'Exploring how Turkish exporters are adopting sustainable practices to meet global environmental standards and consumer demands.', 'Sustainability has become a critical factor in global trade, and Turkish exporters are rising to meet this challenge with innovative approaches that balance economic growth with environmental responsibility. From renewable energy adoption to sustainable packaging solutions, Turkish companies are demonstrating that profitability and environmental stewardship can go hand in hand.

**The Sustainability Imperative**
Global consumers and businesses increasingly prioritize sustainability in their purchasing decisions. This shift has created both challenges and opportunities for Turkish exporters, who must adapt their practices while maintaining competitiveness.

**Key Sustainability Initiatives**

*Renewable Energy Adoption*
Many Turkish manufacturing facilities are transitioning to renewable energy sources, particularly solar power, which is abundant in Turkey''s climate.

*Sustainable Packaging*
Exporters are investing in biodegradable, recyclable, and minimal packaging solutions that reduce environmental impact while maintaining product protection.

*Water Conservation*
Advanced water recycling and conservation systems are being implemented across various industries, particularly in textile and food processing.

*Carbon Footprint Reduction*
Companies are measuring and actively working to reduce their carbon emissions through improved logistics, energy efficiency, and production optimization.

**Certification and Standards**
Turkish exporters are obtaining various sustainability certifications to demonstrate their commitment:
- ISO 14001 Environmental Management
- Carbon Trust certification
- Sustainable packaging certifications
- Organic and eco-friendly product certifications

**Economic Benefits**
Sustainable practices often lead to cost savings through:
- Reduced energy consumption
- Lower waste disposal costs
- Improved efficiency
- Access to premium markets
- Enhanced brand reputation

**Future Outlook**
The trend toward sustainability is expected to accelerate, with Turkish exporters well-positioned to meet growing demand for environmentally responsible products and services.

Government support through incentives and regulations is helping drive the adoption of sustainable practices across Turkish export industries, ensuring long-term competitiveness in global markets that increasingly value environmental responsibility.', 'Zeynep Kaya', 'Sustainability Consultant', 'Sustainability', ARRAY['sustainability', 'green practices', 'exports', 'environment'], '/placeholder.svg?height=400&width=600', true);
