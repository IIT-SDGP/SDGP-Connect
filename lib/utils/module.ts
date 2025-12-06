import { yearOptions } from '@/lib/types/mapping';

export function getModuleFromYear(sdgpYear?: string | null): string {
  if (!sdgpYear) return '';
  const selectedYear = yearOptions.find((year) => year.value === sdgpYear);
  return selectedYear!.type;
}