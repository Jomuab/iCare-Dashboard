import React from 'react';
import { ApplicationDetail } from '../../types';
import { HealthProfessionalDetailPage } from './HealthProfessionalDetailPage';
import { CompanyDetailPage } from './CompanyDetailPage';

interface ApplicationDetailPageProps {
  application: ApplicationDetail;
  onBackToList: () => void;
  onSelectApplication: (appId: string) => void;
  allApplications: ApplicationDetail[];
}

export const ApplicationDetailPage: React.FC<ApplicationDetailPageProps> = ({
  application,
  onBackToList,
  onSelectApplication,
  allApplications,
}) => {
  // Determine if this is a Health Professional application
  const isHealthProfessional =
    application.categoryType === 'PROFESSIONAL' ||
    Boolean(application.educationalDetails) ||
    application.category === 'Health Professional' ||
    application.organizationType === 'Health Professional';

  if (isHealthProfessional) {
    return (
      <HealthProfessionalDetailPage
        application={application}
        onBackToList={onBackToList}
        onSelectApplication={onSelectApplication}
        allApplications={allApplications}
      />
    );
  }

  return (
    <CompanyDetailPage
      application={application}
      onBackToList={onBackToList}
      onSelectApplication={onSelectApplication}
      allApplications={allApplications}
    />
  );
};
