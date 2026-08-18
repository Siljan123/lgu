// composables/useOrganizationalStructure.ts
//
// Generic template — copy and rename per chart instance
// (e.g. useElectedOfficials, useBarangayOfficials, useDepartmentStructure).
//
// Rule: static placeholder data is fine to embed directly while no real
// backend/table exists yet. The moment real/dynamic data is available
// (a Supabase table, an API), the fetch MUST go through this composable's
// useAsyncData call — never inline in the chart component itself.

import type { OrganizationChartNode } from 'organization-chart-vue3'

export function useOrganizationalStructure() {
  return useAsyncData('organizational-structure', async (): Promise<OrganizationChartNode> => {
    // --- static placeholder data (use while no real table exists yet) ---
    return {
      title: 'Municipal Mayor',
      member: [
        { id: 'mayor', name: 'Office of the Mayor', add: 'Municipality of San Francisco' },
      ],
      children: [
        {
          title: 'Municipal Administrator',
          member: [{ id: 'admin', name: "Administrator's Office", add: 'Municipal Administrator' }],
        },
        {
          title: 'Municipal Planning & Development Office',
          member: [{ id: 'mpdc', name: 'MPDC', add: 'Planning & Development' }],
        },
        {
          title: 'Municipal Engineering Office',
          member: [{ id: 'meo', name: 'MEO', add: 'Engineering' }],
        },
        {
          title: 'Municipal Social Welfare & Development Office',
          member: [{ id: 'mswdo', name: 'MSWDO', add: 'Social Welfare & Development' }],
        },
        {
          title: 'Municipal Health Office',
          member: [{ id: 'mho', name: 'MHO', add: 'Health' }],
        },
      ],
    }

    // --- real/dynamic data (uncomment once the org_units table exists) ---
    // const supabase = useSupabaseClient()
    // const { data, error } = await supabase
    //   .from('org_units')
    //   .select('id, title, parent_id, head_name, head_position')
    //   .order('sort_order')
    // if (error) throw error
    // return buildOrgTree(data) // flat rows -> OrganizationChartNode tree
  })
}
