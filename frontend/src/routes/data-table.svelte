<script lang="ts" generics="TData, TValue">
  import { goto } from "$app/navigation";

  import {
    type ColumnDef,
    type PaginationState,
    getCoreRowModel,
  } from "@tanstack/table-core";
  import {
    createSvelteTable,
    FlexRender,
  } from "$lib/components/ui/data-table/index";
  import * as Table from "$lib/components/ui/table/index";
  import * as Select from "$lib/components/ui/select/index";
  import { Button } from "$lib/components/ui/button/index";

  type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    rowCount: number;
    page: number;
    status: number | "All" | "New" | "In Progress" | "Completed";
    class?: string;
  };

  let {
    data,
    columns,
    page,
    status,
    rowCount,
    class: className = "",
  }: DataTableProps<TData, TValue> = $props();

  let pagination = $state<PaginationState>({
    pageIndex: page - 1,
    pageSize: 10,
  });

  function goToNextPage() {
    const url = new URL(window.location.href);
    url.searchParams.set("page", (page + 1).toString());
    goto(url.toString());
  }

  function goToPreviousPage() {
    const url = new URL(window.location.href);
    url.searchParams.set("page", (page - 1).toString());
    goto(url.toString());
  }

  const statusOptions = [
    { value: "All", label: "All" },
    { value: "New", label: "New" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ];

  function handleStatusChange(newStatus: string) {
    const url = new URL(window.location.href);
    url.searchParams.set("page", "1"); // Reset to page 1 on status change
    if (newStatus !== "All") {
      url.searchParams.set("status", newStatus);
    } else {
      url.searchParams.delete("status");
    }
    goto(url.toString());
  }

  const table = createSvelteTable({
    get data() {
      return data;
    },
    columns,
    rowCount,
    manualPagination: true,
    state: {
      get pagination() {
        return pagination;
      },
    },
    getCoreRowModel: getCoreRowModel(),
  });
</script>

<div class={className}>
  <!-- Filtering -->
  <div class="py-4">
    <Select.Root type="single" onValueChange={handleStatusChange}>
      <Select.Trigger class="w-[180px]">{status}</Select.Trigger>
      <Select.Content>
        {#each statusOptions as status (status.value)}
          <Select.Item value={status.value} label={status.label}>
            {status.label}
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>

  <!-- Table -->
  <div class="rounded-md border">
    <Table.Root>
      <Table.Header>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <Table.Row>
            {#each headerGroup.headers as header (header.id)}
              <Table.Head colspan={header.colSpan}>
                {#if !header.isPlaceholder}
                  <FlexRender
                    content={header.column.columnDef.header}
                    context={header.getContext()}
                  />
                {/if}
              </Table.Head>
            {/each}
          </Table.Row>
        {/each}
      </Table.Header>
      <Table.Body>
        {#each table.getRowModel().rows as row (row.id)}
          <Table.Row data-state={row.getIsSelected() && "selected"}>
            {#each row.getVisibleCells() as cell (cell.id)}
              <Table.Cell>
                <FlexRender
                  content={cell.column.columnDef.cell}
                  context={cell.getContext()}
                />
              </Table.Cell>
            {/each}
          </Table.Row>
        {:else}
          <Table.Row>
            <Table.Cell colspan={columns.length} class="h-24 text-center">
              No results.
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>

  <!-- Pagination Controls -->
  <div class="flex items-center justify-end space-x-2 py-4">
    <Button
      variant="outline"
      size="sm"
      onclick={goToPreviousPage}
      disabled={page <= 1}
    >
      Previous
    </Button>
    <Button
      variant="outline"
      size="sm"
      onclick={goToNextPage}
      disabled={page >= Math.ceil(rowCount / 10)}
    >
      Next
    </Button>
  </div>
</div>
