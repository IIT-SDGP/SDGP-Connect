// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { ProjectDomainEnum } from '@prisma/client';

// Map display names to enum values
export const categoryDisplayMap = {
  'All': 'All',
  'AI': ProjectDomainEnum.AI,
  'ML': ProjectDomainEnum.ML,
  'AR/VR': ProjectDomainEnum.AR_VR,
  'Blockchain': ProjectDomainEnum.BLOCKCHAIN,
  'IoT': ProjectDomainEnum.IOT,
  'HealthTech': ProjectDomainEnum.HEALTHTECH,
  'FinTech': ProjectDomainEnum.FINTECH,
  'EdTech': ProjectDomainEnum.EDTECH,
  'AgriTech': ProjectDomainEnum.AGRITECH,
  'E-Commerce': ProjectDomainEnum.ECOMMERCE,
  'Social': ProjectDomainEnum.SOCIAL,
  'Gaming': ProjectDomainEnum.GAMING,
  'Security': ProjectDomainEnum.SECURITY,
  'Data Analytics': ProjectDomainEnum.DATA_ANALYTICS,
  'Entertainment': ProjectDomainEnum.ENTERTAINMENT,
  'Sustainability': ProjectDomainEnum.SUSTAINABILITY,
} as const;

// Reverse map for display purposes
export const categoryEnumToDisplayMap = Object.fromEntries(
  Object.entries(categoryDisplayMap).map(([display, enumValue]) => [enumValue, display])
) as Record<ProjectDomainEnum | 'All', string>;

// Get all available categories for filtering
export const getAllCategories = () => {
  return Object.keys(categoryDisplayMap);
};

// Convert display name to enum value
export const getEnumFromDisplay = (displayName: string): ProjectDomainEnum | 'All' => {
  return categoryDisplayMap[displayName as keyof typeof categoryDisplayMap] || 'All';
};

// Convert enum value to display name
export const getDisplayFromEnum = (enumValue: ProjectDomainEnum | string): string => {
  // Handle string values that might come from the database
  if (typeof enumValue === 'string') {
    // Try to find the enum value
    const matchedEnum = Object.values(ProjectDomainEnum).find(e => e === enumValue);
    if (matchedEnum) {
      return categoryEnumToDisplayMap[matchedEnum] || enumValue;
    }
    // If not found, return the string as is
    return enumValue;
  }
  return categoryEnumToDisplayMap[enumValue] || enumValue;
};

// Format category for API calls
export const formatCategoryForApi = (category: string): string => {
  if (category === 'All') return 'All';
  
  // Find the enum value from display name
  const enumValue = Object.entries(categoryDisplayMap).find(
    ([display]) => display === category
  )?.[1];
  
  return enumValue === 'All' || !enumValue ? 'All' : enumValue;
};

// Calculate read time based on content length
export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Format date for display
export const formatDateForDisplay = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
