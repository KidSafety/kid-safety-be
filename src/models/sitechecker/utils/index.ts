import { URL } from 'url';
import { ISiteCheckerImportData } from '../types';

export function extractDnsAndDomain(fileContent: string): {
  category: string;
  data: ISiteCheckerImportData[];
} {
  const lines = fileContent.split('\n');

  let category = '';

  const dnsAndDomains: ISiteCheckerImportData[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('# Title:')) {
      // Extract the category using regex
      const categoryMatch = trimmedLine.match(/(?:with|extension)\s+(.+)/i);
      if (categoryMatch && categoryMatch.length > 1) {
        category = categoryMatch[1].trim();
      }
    } else {
      const parts = trimmedLine.split(/\s+/);
      if (parts.length >= 2 && parts[0] !== '#') {
        const dns = parts[0];
        const domain = parts[1];
        dnsAndDomains.push({ dns, domain });
      }
    }
  }

  return { category, data: dnsAndDomains };
}

export function extractDomainFromUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    let result = parsedUrl.hostname;
    if (result.includes('www.')) result = result.replace('www.', '');
    return result;
  } catch (error) {
    console.error(`Error extracting domain from url: ${url}`, error);
    return null;
  }
}
