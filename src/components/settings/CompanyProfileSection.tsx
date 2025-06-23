import React from 'react';

interface CompanyProfileSectionProps {
  companyName: string;
  companyDomain: string;
  onInputChange: (field: 'companyName' | 'companyDomain', value: string) => void;
}

const CompanyProfileSection: React.FC<CompanyProfileSectionProps> = ({
  companyName,
  companyDomain,
  onInputChange,
}) => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Company Profile</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => onInputChange('companyName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Website
          </label>
          <input
            type="text"
            value={companyDomain}
            onChange={(e) => onInputChange('companyDomain', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </section>
  );
};

export default CompanyProfileSection;