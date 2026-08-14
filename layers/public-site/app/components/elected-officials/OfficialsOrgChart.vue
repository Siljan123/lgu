<script setup lang="ts">
import OrganizationChart from 'organization-chart-vue3'
import 'organization-chart-vue3/style.css'
import type {
  OrganizationChartNode,
  OrganizationChartSelectPayload,
} from 'organization-chart-vue3'

withDefaults(
  defineProps<{
    treeRoot: OrganizationChartNode | null
    pending?: boolean
    error?: unknown
  }>(),
  {
    pending: false,
    error: undefined,
  }
)

function handleSelect(payload: OrganizationChartSelectPayload) {
  if (payload.kind === 'member') {
    console.log('official selected', payload.member?.name)
    return
  }
  console.log('position selected', payload.node.title)
}
</script>

<template>
  <div class="w-full">
    <div v-if="pending" class="py-12 text-center text-muted-foreground">
      Loading elected officials…
    </div>

    <div v-else-if="error" class="py-12 text-center text-destructive">
      Couldn't load elected officials. Please try again later.
    </div>

    <OrganizationChart
      v-else-if="treeRoot"
      :data="treeRoot"
      @select="handleSelect"
    >
      <template #member="{ member }">
        <div class="flex items-center p-2 text-center">
          <img
            v-if="member.image_url"
            :src="member.image_url"
            :alt="member.name"
            class="w-12 h-12 rounded-full object-cover"
          />
          <strong class="text-sm">{{ member.name }}</strong>&nbsp;
          <span class="text-xs text-muted-foreground">{{ member.add }}</span>
        </div>
      </template>
    </OrganizationChart>

    <div v-else class="py-12 text-center text-muted-foreground">
      No officials to display yet.
    </div>
  </div>
</template>

<style scoped>
:deep(.org-table) {
  margin: 0 auto;
}
</style>