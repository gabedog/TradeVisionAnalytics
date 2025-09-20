import { MainLayout } from "@/components/layout/main-layout"
import { ETFDetailContent } from "@/components/admin/etf-detail-content"

interface ETFDetailPageProps {
  params: {
    id: string
  }
}

export default function ETFDetailPage({ params }: ETFDetailPageProps) {
  return (
    <MainLayout>
      <ETFDetailContent etfId={params.id} />
    </MainLayout>
  )
}