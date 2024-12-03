import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '../components/data-table-view-options'

import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { statuses } from '@/config/status.config'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterKey: string
  filterColumns?: { title?: string, key: string; }[]
  filterStatus: boolean
}

export function DataTableToolbar<TData>({
  table, filterKey, filterColumns, filterStatus
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder={`Filter ${filterKey}...`}
          value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn(filterKey)?.setFilterValue(event.target.value)
          }
          className='h-8 min-w-[150px] lg:max-w-[250px]'
        />
        {/* Dynamically create an Input for each filterColumn */}
        {filterColumns?.map((filterColumn) => (
          <Input
            key={filterColumn.key}
            placeholder={`Filter ${filterColumn.title ?? filterColumn.key}...`}
            value={(table.getColumn(filterColumn.key)?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn(filterColumn.key)?.setFilterValue(event.target.value)
            }
            className='h-8  min-w-[150px] lg:max-w-[250px]'
          />
        ))}
        {
          filterStatus && (
            <div className='flex gap-x-2'>
              {table.getColumn('status') && (
                <DataTableFacetedFilter
                  column={table.getColumn('status')}
                  title='Status'
                  options={statuses}
                />
              )}
            </div>
          )
        }


        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
