"use client";

import * as React from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Modal,
  OrderTimeline,
  SkeletonCard,
  SkeletonLine,
  SkeletonList,
  ToastProvider,
  useToast,
} from "@mimo/ui";

function GalleryInner() {
  const { showError, showInfo, showSuccess } = useToast();
  const [modalOpen, setModalOpen] = React.useState(false);

  const timelineItems = [
    { label: "Order created", timestamp: "2026-03-09 16:40", status: "done" as const },
    { label: "Driver assigned", timestamp: "2026-03-09 16:55", status: "done" as const },
    { label: "Picked up", timestamp: "2026-03-09 17:20", status: "done" as const, proofHref: "#" },
    { label: "Hub intake", timestamp: "2026-03-09 18:05", status: "current" as const },
    { label: "Processing", status: "pending" as const },
    { label: "Quality check", status: "pending" as const },
    { label: "Dispatch", status: "pending" as const },
    { label: "Delivered", status: "pending" as const },
  ];

  return (
    <main className="min-h-screen bg-[var(--mimo-color-background)] px-6 py-10 text-[var(--mimo-color-text)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Mimo UI Kit</h1>
          <p className="text-sm text-[var(--mimo-color-text-muted)]">
            Chapter 7.2 component library gallery.
          </p>
        </header>

        <section className="grid gap-4">
          <h2 className="text-2xl font-semibold">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="sm">
              Primary SM
            </Button>
            <Button variant="primary" size="md">
              Primary MD
            </Button>
            <Button variant="primary" size="lg">
              Primary LG
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-semibold">Inputs</h2>
          <div className="grid max-w-2xl gap-4 md:grid-cols-2">
            <Input
              label="Customer name"
              placeholder="Enter full name"
              helperText="Required for order creation"
            />
            <Input
              label="Phone number"
              inputType="phone"
              placeholder="+255 7XX XXX XXX"
              helperText="TZ format later"
            />
            <Input label="Password" inputType="password" placeholder="Enter password" />
            <Input
              label="Error example"
              placeholder="Invalid value"
              error="This field is required"
            />
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-semibold">Cards</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default card</CardTitle>
                <CardDescription>Standard surface container</CardDescription>
              </CardHeader>
              <CardContent>Used for dashboards, panels, and forms.</CardContent>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>

            <Card variant="subtle">
              <CardHeader>
                <CardTitle>Subtle card</CardTitle>
                <CardDescription>Surface 2 variant</CardDescription>
              </CardHeader>
              <CardContent>Good for grouped supporting information.</CardContent>
            </Card>

            <Card variant="clickable" role="button" tabIndex={0}>
              <CardHeader>
                <CardTitle>Clickable card</CardTitle>
                <CardDescription>Selectable interaction state</CardDescription>
              </CardHeader>
              <CardContent>Suitable for pickers and selectable lists.</CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-semibold">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-semibold">Toasts</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => showSuccess("Saved", "Order changes were saved successfully.")}>
              Show success toast
            </Button>
            <Button
              variant="secondary"
              onClick={() => showInfo("Heads up", "Dispatch batch closes at 18:00.")}
            >
              Show info toast
            </Button>
            <Button
              variant="danger"
              onClick={() => showError("Failed", "Could not assign driver task.")}
            >
              Show error toast
            </Button>
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-semibold">Modal</h2>
          <div>
            <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          </div>

          <Modal
            open={modalOpen}
            title="Confirm hub assignment"
            onClose={() => setModalOpen(false)}
            footer={
              <>
                <Button variant="ghost" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setModalOpen(false)}>Confirm</Button>
              </>
            }
          >
            This is a reusable controlled modal with title, body, and footer actions.
          </Modal>
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-semibold">Skeleton loaders</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-3">
              <SkeletonLine />
              <SkeletonLine className="w-4/5" />
              <SkeletonLine className="w-3/5" />
            </div>
            <SkeletonCard />
            <SkeletonList rows={3} />
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-semibold">Timeline</h2>
          <div className="max-w-3xl">
            <OrderTimeline items={timelineItems} />
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ComponentsPage() {
  return (
    <ToastProvider>
      <GalleryInner />
    </ToastProvider>
  );
}
