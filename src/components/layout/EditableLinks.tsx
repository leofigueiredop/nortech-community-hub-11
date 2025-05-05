import React from 'react';

interface EditableLinksProps {
  className?: string;
}

const EditableLinks: React.FC<EditableLinksProps> = ({ className }) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-800 rounded-md py-1.5 px-3">
        Powered by Nortech
      </div>
    </div>
  );
};

export default EditableLinks;
