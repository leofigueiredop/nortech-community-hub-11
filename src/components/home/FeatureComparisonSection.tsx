
import React from 'react';
import { Check } from 'lucide-react';

const FeatureComparisonSection = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-nortech-dark-blue dark:text-white">The complete community platform</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Build a home for your community, events, and courses — all under your own brand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 max-w-5xl mx-auto">
          <div className="text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto md:mx-0 mb-4">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            </div>
            <h3 className="text-xl font-bold mb-2">Start</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start building a community as you grow your audience.
            </p>
          </div>
          
          <div className="text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto md:mx-0 mb-4">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            </div>
            <h3 className="text-xl font-bold mb-2">Engage</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Build a home for your community with memberships, discussions, events, and courses.
            </p>
          </div>
          
          <div className="text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center mx-auto md:mx-0 mb-4">
              <div className="w-4 h-4 rounded-full bg-pink-500"></div>
            </div>
            <h3 className="text-xl font-bold mb-2">Monetize</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Use our best-in-class payments stack to turn your community into a meaningful business.
            </p>
          </div>
          
          <div className="text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto md:mx-0 mb-4">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
            </div>
            <h3 className="text-xl font-bold mb-2">Scale</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Scale your business to the next level with automations, AI, and branded apps.
            </p>
          </div>
        </div>

        <div className="mt-20 max-w-5xl mx-auto">
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transform -translate-y-1/2 z-0"></div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-10">
              {[
                {
                  color: "blue",
                  features: ["Community platform", "Member profiles", "Discussions", "Custom domains"]
                },
                {
                  color: "purple",
                  features: ["Content management", "Courses & lessons", "Live events", "Member groups"]
                },
                {
                  color: "pink",
                  features: ["Monetization", "Memberships", "One-time payments", "Bulk discounts"]
                },
                {
                  color: "green",
                  features: ["Advanced tools", "API access", "Automations", "Mobile apps"]
                }
              ].map((category, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
                  <ul className="space-y-3">
                    {category.features.map((feature, j) => (
                      <li key={j} className="flex items-center">
                        <Check className={`h-5 w-5 text-${category.color}-500 mr-2 shrink-0`} />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureComparisonSection;
