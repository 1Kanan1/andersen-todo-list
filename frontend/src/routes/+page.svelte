<script lang="ts">
  import type { PageProps } from "./$types";

  import DataTable from "./data-table.svelte";
  import { columns } from "./columns";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Tasks</title>
</svelte:head>

<DataTable
  data={data.tasks}
  rowCount={data.count}
  {columns}
  page={data.page}
  status={data.status}
  class="w-full max-w-sm"
/>
