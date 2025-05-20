import React from 'react';
import PaywallTemplateCard from './PaywallTemplateCard';
import { Lock, Check } from 'lucide-react';
import { PaywallTemplate } from '@/types/paywall';

export type PaywallTemplateType = 'simple' | 'featured' | 'premium' | string;

interface PaywallTemplateGridProps {
  activeTemplate: PaywallTemplateType;
  setActiveTemplate: (template: PaywallTemplateType) => void;
  onPreview: () => void;
  availableTemplates?: PaywallTemplate[];
}

const PaywallTemplateGrid: React.FC<PaywallTemplateGridProps> = ({ 
  activeTemplate, 
  setActiveTemplate,
  onPreview,
  availableTemplates = []
}) => {
  const defaultTemplates = {
    simple: {
      title: "Simple & Clean",
      description: "A straightforward paywall with minimal distractions",
      preview: (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="p-6 text-center space-y-4">
            <Lock className="h-12 w-12 mx-auto text-purple-500" />
            <h2 className="text-2xl font-bold">Premium Content</h2>
            <p className="text-gray-600 dark:text-gray-400">
              This content is available exclusively for members.
            </p>
            <div className="pt-4">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      )
    },
    featured: {
      title: "Featured Content",
      description: "Highlights benefits of premium content",
      preview: (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-4 text-white">
            <h2 className="text-xl font-bold">Premium Members Only</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Get access to premium content and exclusive resources:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Exclusive courses and tutorials</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Access to member-only community</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Early access to new content</span>
              </li>
            </ul>
            <div className="pt-4">
              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-2 px-4 rounded">
                Unlock Premium Access
              </button>
            </div>
          </div>
        </div>
      )
    },
    premium: {
      title: "Premium Offer",
      description: "Focused on value with pricing details",
      preview: (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="bg-indigo-600 p-6 text-white text-center">
            <h2 className="text-2xl font-bold">Premium Membership</h2>
            <p className="opacity-80 mt-1">Unlock all premium features</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold">$19.99<span className="text-sm font-normal text-gray-500">/month</span></div>
              <p className="text-sm text-gray-500 mt-1">Cancel anytime</p>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Full access to all courses</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Premium community features</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Exclusive events and webinars</span>
              </li>
            </ul>
            <div className="pt-4">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded">
                Subscribe Now
              </button>
              <p className="text-xs text-center text-gray-500 mt-2">
                Secure payment via Stripe
              </p>
            </div>
          </div>
        </div>
      )
    }
  };

  // Combine default templates with custom ones from API
  const templatesMap = { ...defaultTemplates };
  
  // Add custom templates if provided
  if (availableTemplates && availableTemplates.length > 0) {
    availableTemplates.forEach(template => {
      if (!defaultTemplates[template.id]) {
        templatesMap[template.id] = {
          title: template.name,
          description: template.description,
          preview: (
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 flex items-center justify-center p-8">
              {template.previewImage ? (
                <img 
                  src={template.previewImage} 
                  alt={template.name} 
                  className="max-w-full h-auto rounded" 
                />
              ) : (
                <div className="text-center p-12">
                  <h3 className="font-medium text-lg">{template.name}</h3>
                  <p className="text-sm text-gray-500 mt-2">Layout: {template.layout}</p>
                </div>
              )}
            </div>
          )
        };
      }
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
      {Object.entries(templatesMap).map(([key, template]) => (
        <PaywallTemplateCard 
          key={key}
          title={template.title}
          description={template.description}
          preview={template.preview}
          isActive={activeTemplate === key}
          onSelect={() => setActiveTemplate(key as PaywallTemplateType)}
          onPreview={(e) => {
            e.stopPropagation();
            onPreview();
          }}
        />
      ))}
    </div>
  );
};

export default PaywallTemplateGrid;
