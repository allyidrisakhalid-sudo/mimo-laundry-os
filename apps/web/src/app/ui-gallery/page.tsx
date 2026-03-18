"use client";

import * as React from "react";
import {
  AddressForm,
  AppShell,
  ConfirmDialog,
  EmptyState,
  FieldState,
  FiltersBar,
  InlineAlert,
  LoadingState,
  PageHeader,
  Pagination,
  PhoneInputTZ,
  SectionHeader,
  Sidebar,
  SLAChip,
  StatusBadge,
  Table,
  Timeline,
  Toast,
  Topbar,
  WizardSteps,
} from "@mimo/ui";

export default function UIGalleryPage() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [phone, setPhone] = React.useState("712345678");
  const [dialogOpen, setDialogOpen] = React.useState(true);
  const [address, setAddress] = React.useState({
    contactName: "Asha Mushi",
    phone: "+255 712 345 678",
    area: "Masaki",
    street: "Chole Road",
    landmark: "Near the gym entrance",
    notes: "Call on arrival and use side gate.",
  });

  const rows = [
    {
      id: "ORD-24018",
      customer: "Asha Mushi",
      channel: "Door pickup",
      status: "In processing",
      sla: "24h express",
    },
    {
      id: "ORD-24019",
      customer: "Khalid Juma",
      channel: "Affiliate walk-in",
      status: "Ready for dispatch",
      sla: "48h standard",
    },
  ];

  return (
    <div className="mimo-gallery">
      <PageHeader
        eyebrow="Phase 2 proof surface"
        title="Mimo UI Gallery"
        description="Production-grade shared components for public pages and role portals, using the Phase 2 token layer and reusable state patterns."
        actions={
          <div className="mimo-gallery__row">
            <button className="mimo-button mimo-button--primary">Use shared components</button>
            <button className="mimo-button mimo-button--ghost">Review docs</button>
          </div>
        }
      />

      <section className="mimo-card mimo-gallery__grid">
        <SectionHeader
          title="Layout components"
          description="AppShell, Sidebar, Topbar, PageHeader, and SectionHeader are the default layout layer for later portal screens."
        />

        <AppShell
          sidebar={
            <Sidebar
              brand={<span>Mimo Laundry OS</span>}
              roleLabel="Admin portal"
              items={[
                { key: "dashboard", label: "Dashboard", href: "/app/admin", active: true, badge: "08" },
                { key: "orders", label: "Orders", href: "/app/admin/orders" },
                { key: "finance", label: "Finance", href: "/app/admin/finance" },
                { key: "settings", label: "Settings", href: "#", disabled: true },
              ]}
              footer={<InlineAlert tone="info" title="Shared shell active" body="Later admin and ops screens must consume this shell instead of inventing one-off wrappers." />}
            />
          }
          topbar={
            <Topbar
              title="Operations overview"
              context="EN / SW toggle slot, page context, and account area are supported."
              languageSlot={<button className="mimo-button mimo-button--ghost">EN | SW</button>}
              profileSlot={<button className="mimo-button mimo-button--ghost">A. Idrisa</button>}
            />
          }
          mobileTabs={
            <>
              <button className="mimo-button mimo-button--ghost">Home</button>
              <button className="mimo-button mimo-button--ghost">Orders</button>
              <button className="mimo-button mimo-button--ghost">Account</button>
            </>
          }
        >
          <div className="mimo-card">
            <SectionHeader
              title="Portal content area"
              description="Desktop shell and mobile shell compatibility are built into one shared structure."
              actions={<button className="mimo-button mimo-button--primary">Primary action</button>}
            />
          </div>
        </AppShell>
      </section>

      <section className="mimo-card mimo-gallery__grid">
        <SectionHeader
          title="Data components"
          description="Structured list/table patterns, clear filtering, pagination, empty states, and layout-preserving loading."
        />

        <FiltersBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by order ID or customer"
          onClear={() => setSearch("")}
        >
          <select className="mimo-select" defaultValue="all">
            <option value="all">All zones</option>
            <option value="masaki">Masaki</option>
            <option value="mikocheni">Mikocheni</option>
          </select>

          <select className="mimo-select" defaultValue="active">
            <option value="active">Active orders</option>
            <option value="completed">Completed</option>
            <option value="exceptions">Exceptions</option>
          </select>
        </FiltersBar>

        <Table
          columns={[
            { key: "id", header: "Order", render: (row) => row.id },
            { key: "customer", header: "Customer", render: (row) => row.customer },
            { key: "channel", header: "Channel", render: (row) => row.channel },
            {
              key: "status",
              header: "Status",
              render: (row) => <StatusBadge label={row.status} tone="info" />,
            },
            {
              key: "sla",
              header: "SLA",
              render: (row) => <SLAChip label={row.sla} tone={row.sla.includes("24h") ? "watch" : "calm"} />,
            },
          ]}
          rows={rows.filter((row) => {
            const haystack = `${row.id} ${row.customer} ${row.channel} ${row.status} ${row.sla}`.toLowerCase();
            return haystack.includes(search.toLowerCase());
          })}
          rowKey={(row) => row.id}
          loading={false}
          loadingState={<LoadingState lines={5} />}
          emptyState={
            <EmptyState
              icon=""
              title="No matching orders"
              body="Try a wider search, clear filters, or switch to another queue."
              action={<button className="mimo-button mimo-button--primary">Clear filters</button>}
            />
          }
        />

        <div className="mimo-gallery__split">
          <div className="mimo-card">
            <SectionHeader title="Empty state" description="Real action-oriented empty pattern." />
            <EmptyState
              icon=""
              title="No ready-for-dispatch orders"
              body="Dispatch opens automatically when hub processing marks an order ready."
              action={<button className="mimo-button mimo-button--primary">Refresh queue</button>}
            />
          </div>

          <div className="mimo-card">
            <SectionHeader title="Loading state" description="Structural skeleton instead of spinner-only waiting." />
            <LoadingState lines={6} />
          </div>
        </div>

        <Pagination
          page={page}
          totalPages={4}
          onPrevious={() => setPage((current) => Math.max(1, current - 1))}
          onNext={() => setPage((current) => Math.min(4, current + 1))}
        />
      </section>

      <section className="mimo-card mimo-gallery__grid">
        <SectionHeader
          title="Form components"
          description="Wizard steps, field-state pattern, Tanzanian phone input, and structured address capture."
        />

        <WizardSteps
          steps={[
            { key: "details", label: "Details" },
            { key: "pickup", label: "Pickup" },
            { key: "review", label: "Review" },
          ]}
          currentStep={2}
        />

        <div className="mimo-gallery__split">
          <div className="mimo-card">
            <SectionHeader title="Validation states" description="Field helper, success, and error patterns." />
            <div className="mimo-gallery__grid">
              <div className="mimo-field">
                <label className="mimo-label">Customer name</label>
                <input className="mimo-input" defaultValue="Asha Mushi" />
                <FieldState tone="success" message="Name format looks good." />
              </div>

              <div className="mimo-field">
                <label className="mimo-label">Pickup note</label>
                <input className="mimo-input" defaultValue="" placeholder="Optional short note" />
                <FieldState tone="helper" message="Use notes only for access details that help pickup or delivery." />
              </div>

              <div className="mimo-field">
                <label className="mimo-label">Building name</label>
                <input className="mimo-input" defaultValue="" />
                <FieldState tone="error" message="Add a building, compound, or landmark to reduce failed stops." />
              </div>
            </div>
          </div>

          <div className="mimo-card">
            <SectionHeader title="PhoneInputTZ" description="Single shared +255 pattern for later customer, address, and affiliate flows." />
            <PhoneInputTZ
              value={phone}
              onChange={setPhone}
              stateTone={phone.length < 9 ? "error" : "helper"}
              stateMessage={phone.length < 9 ? "Enter all 9 local digits after +255." : "TZ phone format is ready for order submission."}
            />
          </div>
        </div>

        <div className="mimo-card">
          <SectionHeader title="AddressForm" description="Structured grouped inputs for customer and order contexts." />
          <AddressForm value={address} onChange={setAddress} />
        </div>
      </section>

      <section className="mimo-card mimo-gallery__grid">
        <SectionHeader
          title="Status components"
          description="Shared status labels, timeline truth surface, and calm SLA urgency signaling."
        />

        <div className="mimo-gallery__row">
          <StatusBadge label="Pending intake" tone="neutral" />
          <StatusBadge label="Driver assigned" tone="info" />
          <StatusBadge label="Delivered" tone="success" />
          <StatusBadge label="Awaiting customer action" tone="warning" />
          <StatusBadge label="Refund review" tone="danger" />
        </div>

        <div className="mimo-gallery__row">
          <SLAChip label="48h standard" tone="calm" />
          <SLAChip label="24h express" tone="watch" />
          <SLAChip label="Same-day risk" tone="urgent" />
        </div>

        <div className="mimo-card">
          <SectionHeader title="Timeline" description="Immutable order progress view with latest-event emphasis and proof markers." />
          <Timeline
            items={[
              {
                key: "1",
                time: "08:10",
                title: "Pickup confirmed",
                note: "Driver scanned two bags at the customer gate.",
              },
              {
                key: "2",
                time: "10:25",
                title: "Hub intake completed",
                note: "Weight captured and one care note added.",
                proof: "Proof: bag scan + intake note",
              },
              {
                key: "3",
                time: "15:40",
                title: "Ready for dispatch",
                note: "Order passed QC and entered evening batch planning.",
                proof: "Proof: QC pass",
                isLatest: true,
              },
            ]}
          />
        </div>
      </section>

      <section className="mimo-card mimo-gallery__grid">
        <SectionHeader
          title="Feedback components"
          description="Shared confirmations, controlled toast style, and inline operational alerts."
        />

        <div className="mimo-gallery__grid">
          <Toast
            tone="success"
            title="Order reassigned successfully"
            body="The stop now belongs to the Mikocheni evening route."
            onDismiss={() => {}}
          />

          <Toast
            tone="error"
            title="Dispatch save failed"
            body="Retry after network recovers or contact admin if the queue remains locked."
            action={<button className="mimo-button mimo-button--ghost">Retry</button>}
          />

          <InlineAlert
            tone="warning"
            icon="!"
            title="Customer confirmation still pending"
            body="Do not finalize this refund until support confirms the damaged item photos."
            action={<button className="mimo-button mimo-button--ghost">Open case</button>}
          />

          <InlineAlert
            tone="info"
            icon="i"
            title="Shared component rule active"
            body="Later screen work should consume this feedback layer rather than inventing local warning blocks or ad hoc modals."
          />
        </div>
      </section>

      <section className="mimo-card mimo-gallery__grid">
        <SectionHeader
          title="State demonstrations"
          description="Proof that the shared layer supports default, empty, loading, success, and error surfaces without custom hacks."
        />

        <div className="mimo-gallery__split">
          <div className="mimo-card">
            <SectionHeader title="Success" description="Operational confirmation stays compact and clear." />
            <Toast tone="success" title="Pickup completed" body="Customer timeline updated and bag intake is now ready." />
          </div>

          <div className="mimo-card">
            <SectionHeader title="Error" description="Shared warning surface for recoverable problems." />
            <InlineAlert
              tone="danger"
              icon="!"
              title="Payment reference mismatch"
              body="Pause close-out and recheck the payment entry before daily reconciliation."
            />
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={dialogOpen}
        title="Approve payout for Masaki partner?"
        body="This confirms the payout batch and writes the action into the audit trail."
        confirmLabel="Approve payout"
        cancelLabel="Review later"
        onConfirm={() => setDialogOpen(false)}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
}
