import type { NavItem } from '../types/navigation'

export function useGuestNavigation() {
  const navigationItems = useState<NavItem[]>('guest-navigation-items', () => [
    {
      name: 'LGU Profile',
      to: '/history',
      type: 'dropdown',
      children: [
        {
          name: 'History & Heritage',
          to: '/history',
          type: 'link',
          description: 'Learn about the history of the LGU SFADS.',
        },
        {
          name: 'Quick Facts & Demographics',
          to: '/quick-facts',
          type: 'link',
          description: 'Quick facts about the LGU SFADS.',
        },
        {
          name: 'Organizational Structure',
          to: '/organization',
          type: 'link',
          description: 'Learn about the organizational structure of the LGU SFADS.',
        },
        {
          name: 'Barangay Directory',
          to: '/barangay-directory',
          type: 'link',
          description: 'Browse the barangay directory of the LGU SFADS.',
        }
      ]
    },
    {
      name: 'Good Governance',
      to: '/good-governance',
      type: 'dropdown',
      children: [
        {
          name: 'Elected Officials',
          to: '/elected-officials',
          type: 'link',
          description: 'Meet the elected officials of the LGU SFADS.',
        },
        {
          name: 'Ordinances & Executive Orders',
          to: '/ordinances',
          type: 'link',
          description: 'Browse the ordinances and executive orders of the LGU SFADS.',
        },
        {
          name: 'Full Disclosure Policy Portal',
          to: '/full-disclosure',
          type: 'link',
          description: 'Access the full disclosure policy portal of the LGU SFADS.',
        },
        {
          name: 'Bids & Awards Committee',
          to: '/bids-awards',
          type: 'link',
          description: 'Learn about the bids and awards committee of the LGU SFADS.',
        },
        {
          name: "Citizen's Charter",
          to: '/citizen-charter',
          type: 'link',
          description: "Access the citizen's charter of the LGU SFADS.",
        },
         {
          name: "Mission, Vision, and Core Values",
          to: '/mission-vision',
          type: 'link',
          description: "Access the mission, vision, and core values of the LGU SFADS.",
        },
      ]
    },
    {
      name: 'Tourism',
      to: '/tourism',
      type: 'dropdown',
      children: [
        {
          name: 'Destinations & Landmarks',
          to: '/destinations',
          type: 'link',
          description: 'Explore the destinations and landmarks of the LGU SFADS.',
        },
        {
          name: 'Events & Festivals',
          to: '/events-festivals',
          type: 'link',
          description: 'Discover the events and festivals of the LGU SFADS.',
        },
        {
          name: 'Where to Stay & Eat',
          to: '/where-to-stay-eat',
          type: 'link',
          description: 'Find great places to stay and eat in the LGU SFADS.',
        },
        {
          name: "Traveler's Guide",
          to: '/travelers-guide',
          type: 'link',
          description: 'Get travel tips and guidelines for visiting the LGU SFADS.',
        }
      ]
    },
    {
      name: 'Business',
      to: '/business',
      type: 'dropdown',
      children: [
        {
          name: 'Business One-Stop Shop (BOSS)',
          to: '/boss',
          type: 'link',
          description: 'Access the Business One-Stop Shop (BOSS) of the LGU SFADS.',
        },
        {
          name: 'Permits & Licensing',
          to: '/permits-licensing',
          type: 'link',
          description: 'Learn about permits and licensing in the LGU SFADS.',
        },
        {
          name: 'Investment Profile',
          to: '/investment-profile',
          type: 'link',
          description: 'Explore the investment profile of the LGU SFADS.',
        },
        {
          name: 'Careers & Job Vacancies',
          to: '/careers',
          type: 'link',
          description: 'Find career opportunities and job vacancies in the LGU SFADS.',
        }
      ]
    }
  ])

  return {
    navigationItems,
  }
}
