import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Globe, Users, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PricingPlans from '@/components/settings/PricingPlans';
import { LanguageTest } from '@/components/LanguageTest';

// Sample community data
const communities = [
  {
    id: 1,
    title: "Brotherhood Of Scent",
    image: "/lovable-uploads/598c2a9d-a24a-4854-ba20-b22476ca4f7b.png",
    description: "#1 Fragrance Community 👑 Our mission is to help YOU leverage the power of scent to become the man you know yourself to be.",
    members: "6.1k",
    price: "Free",
    category: "Hobbies"
  },
  {
    id: 2,
    title: "Calligraphy Skool",
    image: "/placeholder.svg",
    description: "Learn modern calligraphy the fun, easy way! ✍️ With sisters Jordan & Jillian",
    members: "1.2k",
    price: "$9/month",
    category: "Arts"
  },
  {
    id: 3,
    title: "That Pickleball School",
    image: "/placeholder.svg",
    description: "👉 THAT place for pickleball players serious about getting better.",
    members: "966",
    price: "$39/month",
    category: "Sports"
  },
  {
    id: 4,
    title: "Zero to Founder",
    image: "/placeholder.svg",
    description: "Start and grow your business with proven frameworks and mentorship.",
    members: "4.2k",
    price: "$29/month",
    category: "Money"
  },
  {
    id: 5,
    title: "Fitness with Sarah",
    image: "/placeholder.svg",
    description: "Transform your body and mind with expert-led workouts and nutrition plans.",
    members: "3.7k",
    price: "$19/month",
    category: "Health"
  },
  {
    id: 6,
    title: "Tech Innovators Hub",
    image: "/placeholder.svg",
    description: "Connect with fellow tech enthusiasts and stay ahead of industry trends.",
    members: "5.3k",
    price: "$15/month",
    category: "Tech"
  }
];

// Category data
const categories = [
  { name: "All", icon: null },
  { name: "Hobbies", icon: "🎨" },
  { name: "Music", icon: "🎵" },
  { name: "Money", icon: "💰" },
  { name: "Spirituality", icon: "🧘" },
  { name: "Tech", icon: "💻" },
  { name: "Health", icon: "🌿" },
  { name: "Sports", icon: "🏀" },
  { name: "Self-improvement", icon: "📈" },
  { name: "Arts", icon: "🎭" }
];

const Index: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  
  useEffect(() => {
    document.title = "Nortech Communities - Discover & Create Communities";
    window.scrollTo(0, 0);
  }, []);

  // Filter communities based on search and category
  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          community.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || community.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500">
              Nortech
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
              Browse
            </Link>
            <Link to="/events" className="text-gray-600 hover:text-gray-900">
              Events
            </Link>
            <Link to="/resources" className="text-gray-600 hover:text-gray-900">
              Resources
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Log in
            </Link>
            <Button asChild variant="outline" className="hidden sm:flex">
              <Link to="/onboarding/profile">
                Register
              </Link>
            </Button>
            <Button asChild className="bg-nortech-purple hover:bg-nortech-purple/90">
              <Link to="/onboarding/community">
                <Plus size={16} className="mr-1" />
                Create Community
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Language Test */}
      <div className="container mx-auto px-4 py-8">
        <LanguageTest />
      </div>
      
      {/* Hero section */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover communities</h1>
            <p className="text-xl text-gray-600 mb-8">
              Find your tribe or <button 
                onClick={() => setIsPricingModalOpen(true)}
                className="text-nortech-purple font-medium hover:underline">
                create your own
              </button>
            </p>
            
            <div className="relative max-w-2xl mx-auto mb-12">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input 
                type="search" 
                placeholder="Search for anything" 
                className="pl-10 h-12 w-full bg-white shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((category) => (
                <Badge 
                  key={category.name}
                  variant={activeCategory === category.name ? "default" : "outline"}
                  className={`px-4 py-2 text-sm cursor-pointer ${activeCategory === category.name ? 'bg-nortech-purple hover:bg-nortech-purple/90' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveCategory(category.name)}
                >
                  {category.icon && <span className="mr-1">{category.icon}</span>}
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Communities Grid */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <Card key={community.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={community.image} 
                    alt={community.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-sm">
                    #{community.id}
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-nortech-purple h-10 w-10 rounded-md flex items-center justify-center text-white mr-3">
                        {community.category === "Tech" && <Globe size={20} />}
                        {community.category === "Sports" && <Users size={20} />}
                        {community.category !== "Tech" && community.category !== "Sports" && 
                          <span>{categories.find(c => c.name === community.category)?.icon || '👥'}</span>}
                      </div>
                      <h3 className="font-bold text-lg">{community.title}</h3>
                    </div>
                    <Badge variant="outline" className="bg-gray-100">
                      {community.category}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{community.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{community.members} Members</span>
                    <span className="font-medium">{community.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredCommunities.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-800 mb-2">No communities found</h3>
              <p className="text-gray-600 mb-6">Try a different search term or category</p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("All");
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={() => setIsPricingModalOpen(true)}
              className="bg-nortech-purple hover:bg-nortech-purple/90"
            >
              Start Your Own Community
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonial/Features section */}
      <section className="py-16 bg-gradient-to-b from-white to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything you need to run a successful community</h2>
            <p className="text-lg text-gray-600">
              Nortech provides all the tools you need to build, engage, and monetize your community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-purple-100 w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center">
                <Users className="text-nortech-purple" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Member Management</h3>
              <p className="text-gray-600">
                Easily manage members, roles, and permissions with our intuitive dashboard.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-purple-100 w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center">
                <svg className="text-nortech-purple" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Content & Courses</h3>
              <p className="text-gray-600">
                Create and share content, courses, and resources that your community will love.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-purple-100 w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center">
                <svg className="text-nortech-purple" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Monetization</h3>
              <p className="text-gray-600">
                Multiple ways to monetize your community with subscriptions, courses, and more.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-nortech-purple text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to build your own community?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Start your 14-day free trial today. No credit card required.
          </p>
          <Button 
            size="lg" 
            onClick={() => setIsPricingModalOpen(true)}
            className="bg-white text-nortech-purple hover:bg-gray-100"
          >
            Start Your Community
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Nortech</h3>
              <p className="text-gray-400 mb-4">
                The all-in-one platform for building and growing online communities.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Testimonials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© 2025 Nortech Communities. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Pricing Modal */}
      <Dialog open={isPricingModalOpen} onOpenChange={setIsPricingModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Choose Your Plan</DialogTitle>
          </DialogHeader>
          <PricingPlans />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
