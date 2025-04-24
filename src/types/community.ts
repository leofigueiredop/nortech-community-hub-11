
export interface Community {
  id: string;
  name: string;
  logo?: string;
}

export const mockCommunities: Community[] = [
  { id: '1', name: 'Nortech', logo: '/nortech-logo.png' },
  { id: '2', name: 'Alphractal', logo: '/alphractal-logo.png' },
  { id: '3', name: 'CryptoSync', logo: '/cryptosync-logo.png' },
];
