
export function ProductTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-slate-900/50 border border-slate-800 shadow-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-900/70">
            <tr>
              <th className="px-6 py-3 text-left">
                <div className="h-4 w-16 animate-pulse rounded bg-slate-800" />
              </th>
              <th className="px-6 py-3 text-left">
                <div className="h-4 w-20 animate-pulse rounded bg-slate-800" />
              </th>
              <th className="px-6 py-3 text-left">
                <div className="h-4 w-16 animate-pulse rounded bg-slate-800" />
              </th>
              <th className="px-6 py-3 text-left">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />
              </th>
              <th className="px-6 py-3 text-right">
                <div className="ml-auto h-4 w-16 animate-pulse rounded bg-slate-800" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/30">
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <div className="h-12 w-12 animate-pulse rounded bg-slate-800" />
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-800" />
                    <div className="h-3 w-48 animate-pulse rounded bg-slate-800" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-16 animate-pulse rounded bg-slate-800" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-800" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <div className="h-8 w-16 animate-pulse rounded bg-slate-800" />
                    <div className="h-8 w-16 animate-pulse rounded bg-slate-800" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

