"use client";

import { DriverTaskDetailScreen } from "../../../_components/p2DriverPortal";

type DriverTaskDetailPageProps = {
  params: {
    id: string;
  };
};

export default function DriverTaskDetailPage({ params }: DriverTaskDetailPageProps) {
  return <DriverTaskDetailScreen taskId={params.id} />;
}
