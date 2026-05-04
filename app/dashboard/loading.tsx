// Skeleton de chargement pour toutes les pages du dashboard
export default function DashboardLoading() {
  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header skeleton */}
      <div className="h-8 w-48 skeleton rounded-lg mb-2" />
      <div className="h-4 w-72 skeleton rounded-lg" />

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5">
            <div className="h-3 w-20 skeleton rounded mb-3" />
            <div className="h-7 w-28 skeleton rounded" />
          </div>
        ))}
      </div>

      {/* Contenu skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5 h-64 skeleton" />
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5 h-48 skeleton" />
        </div>
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl h-80 skeleton" />
      </div>
    </div>
  )
}
