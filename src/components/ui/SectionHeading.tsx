import React from 'react';

interface SectionHeadingProps {
  title: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ title }) => {
  return (
    <h2 className="numbered-heading">
      {title}
    </h2>
  );
};
