// data/officials.ts
import type { Official } from '../types/official'

export const officials: Official[] = [
  {
    id: 'mayor',
    name: 'Hon. Juan Dela Cruz',
    position: 'Municipal Mayor',
    avatar_url: null,
    bio: null,
    parent_id: null,
    sort_order: 0,
    is_active: true,
  },
  {
    id: 'vice-mayor',
    name: 'Hon. Maria Santos',
    position: 'Municipal Vice Mayor',
    avatar_url: null,
    bio: null,
    parent_id: 'mayor',
    sort_order: 0,
    is_active: true,
  },
  {
    id: 'councilor-1',
    name: 'Hon. Pedro Reyes',
    position: 'Sangguniang Bayan Member',
    avatar_url: null,
    bio: null,
    parent_id: 'vice-mayor',
    sort_order: 0,
    is_active: true,
  },
  {
    id: 'councilor-2',
    name: 'Hon. Ana Villanueva',
    position: 'Sangguniang Bayan Member',
    avatar_url: null,
    bio: null,
    parent_id: 'vice-mayor',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'councilor-3',
    name: 'Hon. Ramon Cruz',
    position: 'Sangguniang Bayan Member',
    avatar_url: null,
    bio: null,
    parent_id: 'vice-mayor',
    sort_order: 2,
    is_active: true,
  },
 
]