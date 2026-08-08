/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CustomerType,
  DeliveryCenterType,
  FilterState,
  UserRole,
  BranchName,
} from './types';
import { SAMPLE_LICENSES } from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RoleAccessBanner } from './components/RoleAccessBanner';
import { FilterBar } from './components/FilterBar';
import { KpiCards } from './components/KpiCards';
import { OverviewCharts } from './components/OverviewCharts';
import { DeliveryCenterChart } from './components/DeliveryCenterChart';
import { ServiceBreakdownSection } from './components/ServiceBreakdownSection';
import { TaxonomyOwnershipSection } from './components/TaxonomyOwnershipSection';
import { CaseworkerPerformance } from './components/CaseworkerPerformance';
import { BranchComparison } from './components/BranchComparison';
import { LicenseTableModal } from './components/LicenseTableModal';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSidebarItem, setActiveSidebarItem] = useState('Dashboard');

  // Active Role state for Access Control simulation
  const [currentRole, setCurrentRole] = useState<UserRole>('DIRECTORATE');

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    customerType: 'ALL',
    role: 'DIRECTORATE',
    deliveryCenter: 'ALL',
    branch: 'All Branches',
    woreda: 'ALL',
    period: 'MONTHLY',
    ownership: 'ALL',
    searchQuery: '',
  });

  // Calculate allowed Customer Types based on selected User Role
  const getAllowedCustomerTypes = (role: UserRole): CustomerType[] => {
    switch (role) {
      case 'DIRECTORATE':
      case 'ALL_BRANCH_ROLE':
        return ['ALL', 'HP', 'HF', 'FHR'];
      case 'BRANCH_MANAGER_BOLE':
        return ['ALL', 'HF', 'FHR']; // HP disabled, Bole branch only
      case 'FHR_TEAM_LEAD_BOLE':
        return ['FHR']; // ONLY FHR
      case 'HF_TEAM_LEAD_KIRKOS':
        return ['HF']; // ONLY HF
      case 'INSPECTOR':
        return ['HF', 'FHR'];
      default:
        return ['ALL', 'HP', 'HF', 'FHR'];
    }
  };

  // Calculate allowed Branches based on selected User Role
  const getAllowedBranches = (role: UserRole): BranchName[] => {
    switch (role) {
      case 'DIRECTORATE':
      case 'ALL_BRANCH_ROLE':
        return [
          'All Branches',
          'Head Office',
          'Bole',
          'Kirkos',
          'Yeka',
          'Akaki Kality',
          'Nifas Silk Lafto',
          'Lideta',
          'Arada',
          'Addis Ketema',
          'Gullele',
          'Lemi Kura',
          'Kolfe Keranio',
        ];
      case 'BRANCH_MANAGER_BOLE':
      case 'FHR_TEAM_LEAD_BOLE':
        return ['Bole'];
      case 'HF_TEAM_LEAD_KIRKOS':
        return ['Kirkos'];
      case 'INSPECTOR':
        return ['Bole', 'Kirkos', 'Yeka'];
      default:
        return ['All Branches'];
    }
  };

  // Update filter defaults whenever test role changes
  useEffect(() => {
    const allowedTypes = getAllowedCustomerTypes(currentRole);
    const allowedB = getAllowedBranches(currentRole);

    setFilters((prev) => ({
      ...prev,
      role: currentRole,
      customerType: allowedTypes.includes(prev.customerType)
        ? prev.customerType
        : allowedTypes[0],
      branch: allowedB.includes(prev.branch) ? prev.branch : allowedB[0],
    }));
  }, [currentRole]);

  // Role description label for banner
  const getRoleDescription = (role: UserRole): string => {
    switch (role) {
      case 'DIRECTORATE':
        return 'Directorate User: Unrestricted access across all 3 customer types (HP, HF, FHR), all delivery centers, and all sub-city branches.';
      case 'BRANCH_MANAGER_BOLE':
        return 'Branch Manager (Bole): Restricted to Bole Branch data. Access granted for Health Facility (HF) and Food & Health Related (FHR) dashboards.';
      case 'FHR_TEAM_LEAD_BOLE':
        return 'FHR Team Lead (Bole): Restricted strictly to Food & Health Related (FHR) institution data for Bole Branch.';
      case 'HF_TEAM_LEAD_KIRKOS':
        return 'Health Facility Team Lead (Kirkos): Restricted strictly to Health Facility (HF) clinic/hospital data for Kirkos Branch.';
      case 'INSPECTOR':
        return 'Inspector Persona: Filtered view for assigned facilities and inspection audit task queues.';
      case 'ALL_BRANCH_ROLE':
        return 'All-Branch / All-Role User: Full read & analytics view across all centers.';
      default:
        return 'License Management Access Control Active';
    }
  };

  const handleResetFilters = () => {
    const allowedTypes = getAllowedCustomerTypes(currentRole);
    const allowedB = getAllowedBranches(currentRole);

    setFilters({
      customerType: allowedTypes[0],
      role: currentRole,
      deliveryCenter: 'ALL',
      branch: allowedB[0],
      woreda: 'ALL',
      period: 'MONTHLY',
      ownership: 'ALL',
      searchQuery: '',
    });
  };

  const handleExport = () => {
    alert('Exporting License Management Dashboard analytics report (PDF/CSV)...');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* 1. Header Navigation Bar (Fixed Top) */}
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        activeRoleLabel={
          currentRole === 'DIRECTORATE'
            ? 'Directorate HQ'
            : currentRole === 'BRANCH_MANAGER_BOLE'
            ? 'Bole Manager'
            : currentRole === 'FHR_TEAM_LEAD_BOLE'
            ? 'Bole FHR Lead'
            : currentRole === 'HF_TEAM_LEAD_KIRKOS'
            ? 'Kirkos HF Lead'
            : 'Inspector'
        }
      />

      {/* 2. Left Menu Sidebar (Fixed Left 250px) */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        activeItem={activeSidebarItem}
        setActiveItem={setActiveSidebarItem}
      />

      {/* 3. Main Content Container - Positioned AFTER fixed Sidebar (250px) and Top Nav (64px) */}
      <main className="mt-[64px] md:ml-[250px] p-4 sm:p-6 transition-all duration-200 flex-1">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Access Control Role Switcher & Persona Simulator */}
          <RoleAccessBanner
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
            roleDescription={getRoleDescription(currentRole)}
          />

          {/* Filters Bar */}
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            allowedCustomerTypes={getAllowedCustomerTypes(currentRole)}
            allowedBranches={getAllowedBranches(currentRole)}
            onReset={handleResetFilters}
            onExport={handleExport}
          />

          {/* Section 1: KPI Metric Summary Cards */}
          <KpiCards filters={filters} />

          {/* Section 2: Overview Applications, Licenses, Decisions Status */}
          <OverviewCharts filters={filters} />

          {/* Section 3: License Distribution by Delivery Center */}
          <DeliveryCenterChart filters={filters} />

          {/* Section 4: Service Type Breakdown (Matches Screenshot 2 paired doughnut layout) */}
          <ServiceBreakdownSection filters={filters} />

          {/* Section 5: Ownership Types & Taxonomy Hierarchy Browser */}
          <TaxonomyOwnershipSection filters={filters} />

          {/* Section 6: Caseworker Performance Summary (Matches Screenshot 1 bottom graph & rankings) */}
          <CaseworkerPerformance filters={filters} />

          {/* Section 7: Branch Comparison Dashboard */}
          <BranchComparison filters={filters} />

          {/* Section 8: License Register Data Table & Detail Preview Modal */}
          <LicenseTableModal filters={filters} licenses={SAMPLE_LICENSES} />
        </div>
      </main>
    </div>
  );
}
