"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import i18n from "../../../src/i18n";

type AffiliateRole = "staff" | "admin";
type AffiliateOrderStatus =
  | "draft"
  | "received"
  | "processing"
  | "ready"
  | "picked_up"
  | "issue";

type AffiliateOrder = {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  serviceType: string;
  status: AffiliateOrderStatus;
  readiness: "not_ready" | "ready_for_pickup" | "return_scheduled";
  updatedAt: string;
  issue?: string | null;
};

type FinanceRow = {
  id: string;
  period: string;
  earned: string;
  pending: string;
  status: "pending" | "paid";
};

const affiliateOrders: AffiliateOrder[] = [
  {
    id: "aff-1001",
    reference: "MIMO-AFF-1001",
    customerName: "Asha Juma",
    customerPhone: "+255712345678",
    serviceType: "Wash & Fold",
    status: "ready",
    readiness: "ready_for_pickup",
    updatedAt: "10:30",
    issue: null,
  },
  {
    id: "aff-1002",
    reference: "MIMO-AFF-1002",
    customerName: "John Mushi",
    customerPhone: "+255754111222",
    serviceType: "Dry Cleaning",
    status: "processing",
    readiness: "not_ready",
    updatedAt: "09:10",
    issue: null,
  },
  {
    id: "aff-1003",
    reference: "MIMO-AFF-1003",
    customerName: "Neema Said",
    customerPhone: "+255743222333",
    serviceType: "Express Laundry",
    status: "issue",
    readiness: "not_ready",
    updatedAt: "Yesterday",
    issue: "Missing item review",
  },
];

const financeRows: FinanceRow[] = [
  { id: "f1", period: "This week", earned: "TZS 82,000", pending: "TZS 28,000", status: "pending" },
  { id: "f2", period: "Last week", earned: "TZS 74,000", pending: "TZS 0", status: "paid" },
];

function AffiliateKpi({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="mimo-card mimo-kpi-card">
      <div className="mimo-kpi-card__label">{label}</div>
      <div className="mimo-kpi-card__value">{value}</div>
      {detail ? <div className="mimo-kpi-card__detail">{detail}</div> : null}
    </div>
  );
}

function AffiliateStateCard({
  title,
  body,
  actionLabel,
  href,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  href?: string;
}) {
  return (
    <div className="mimo-card mimo-empty-state">
      <div className="mimo-empty-state__title">{title}</div>
      <div className="mimo-empty-state__body">{body}</div>
      {actionLabel && href ? (
        <Link className="mimo-button mimo-button--primary" href={href}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

function AffiliateForbidden({
  title,
  body,
  backHref,
  backLabel,
}: {
  title: string;
  body: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div className="mimo-card mimo-alert-card">
      <div className="mimo-alert-card__title">{title}</div>
      <div className="mimo-alert-card__body">{body}</div>
      <Link className="mimo-button mimo-button--ghost" href={backHref}>
        {backLabel}
      </Link>
    </div>
  );
}

function useAffiliateRole(): AffiliateRole {
  return "admin";
}

export function P2AffiliateDashboard() {
  const t = i18n.t.bind(i18n);
  const role = useAffiliateRole();

  const readyOrders = affiliateOrders.filter((order) => order.readiness === "ready_for_pickup");
  const issueOrders = affiliateOrders.filter((order) => order.status === "issue");

  return (
    <div className="mimo-page-stack">
      <div className="mimo-page-header">
        <div>
          <div className="mimo-eyebrow">{t("affiliate.dashboard.eyebrow")}</div>
          <h1 className="mimo-page-title">{t("affiliate.dashboard.title")}</h1>
          <p className="mimo-page-subtitle">{t("affiliate.dashboard.subtitle")}</p>
        </div>
        <Link className="mimo-button mimo-button--primary" href="/app/affiliate/orders/new">
          {t("affiliate.dashboard.createOrder")}
        </Link>
      </div>

      <div className="mimo-kpi-grid mimo-kpi-grid--four">
        <AffiliateKpi
          label={t("affiliate.dashboard.kpi.todayOrders")}
          value={String(affiliateOrders.length)}
          detail={t("affiliate.state.loadingOrdersComplete")}
        />
        <AffiliateKpi
          label={t("affiliate.dashboard.kpi.ready")}
          value={String(readyOrders.length)}
          detail={t("affiliate.dashboard.kpi.readyDetail")}
        />
        <AffiliateKpi
          label={t("affiliate.dashboard.kpi.issues")}
          value={String(issueOrders.length)}
          detail={t("affiliate.dashboard.kpi.issuesDetail")}
        />
        {role === "admin" ? (
          <AffiliateKpi
            label={t("affiliate.dashboard.kpi.finance")}
            value="TZS 28,000"
            detail={t("affiliate.dashboard.kpi.financeDetail")}
          />
        ) : null}
      </div>

      <div className="mimo-two-column mimo-two-column--balanced">
        <section className="mimo-card mimo-section-card">
          <div className="mimo-section-card__title">{t("affiliate.dashboard.queueTitle")}</div>
          <div className="mimo-action-list">
            <Link className="mimo-action-row" href="/app/affiliate/orders/new">
              <span>{t("affiliate.dashboard.queue.create")}</span>
              <span></span>
            </Link>
            <Link className="mimo-action-row" href="/app/affiliate/orders/aff-1001">
              <span>{t("affiliate.dashboard.queue.ready")}</span>
              <span></span>
            </Link>
            <Link className="mimo-action-row" href="/app/affiliate/orders/aff-1003">
              <span>{t("affiliate.dashboard.queue.issue")}</span>
              <span></span>
            </Link>
          </div>
        </section>

        <section className="mimo-card mimo-section-card">
          <div className="mimo-section-card__title">{t("affiliate.dashboard.supportTitle")}</div>
          <p className="mimo-section-card__body">{t("affiliate.dashboard.supportBody")}</p>
          <Link className="mimo-button mimo-button--ghost" href="/help">
            {t("affiliate.dashboard.supportAction")}
          </Link>
        </section>
      </div>

      <section className="mimo-card mimo-section-card">
        <div className="mimo-section-card__title">{t("affiliate.dashboard.attentionTitle")}</div>
        <div className="mimo-list">
          {affiliateOrders.map((order) => (
            <Link key={order.id} href={`/app/affiliate/orders/${order.id}`} className="mimo-list-row">
              <div>
                <div className="mimo-list-row__title">{order.reference}</div>
                <div className="mimo-list-row__meta">
                  {order.customerName}  {order.serviceType}
                </div>
              </div>
              <div className="mimo-list-row__status">
                {order.readiness === "ready_for_pickup"
                  ? t("affiliate.orders.readiness.ready")
                  : order.issue
                    ? t("affiliate.state.issueRaised")
                    : t("affiliate.orders.readiness.notReady")}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {role === "admin" ? (
        <section className="mimo-card mimo-section-card">
          <div className="mimo-section-card__title">{t("affiliate.dashboard.financeSnapshotTitle")}</div>
          <div className="mimo-inline-summary">
            <div>{t("affiliate.finance.earned")}: TZS 82,000</div>
            <div>{t("affiliate.finance.pending")}: TZS 28,000</div>
          </div>
          <Link className="mimo-button mimo-button--ghost" href="/app/affiliate/finance">
            {t("affiliate.dashboard.financeSnapshotAction")}
          </Link>
        </section>
      ) : null}
    </div>
  );
}

export function P2AffiliateOrdersNew() {
  const t = i18n.t.bind(i18n);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("+255");
  const [serviceType, setServiceType] = useState("Wash & Fold");
  const [handoffType, setHandoffType] = useState("shop_pickup");

  return (
    <div className="mimo-page-stack">
      <div className="mimo-page-header">
        <div>
          <div className="mimo-eyebrow">{t("affiliate.ordersNew.eyebrow")}</div>
          <h1 className="mimo-page-title">{t("affiliate.ordersNew.title")}</h1>
          <p className="mimo-page-subtitle">{t("affiliate.ordersNew.subtitle")}</p>
        </div>
      </div>

      <div className="mimo-card mimo-section-card">
        <div className="mimo-section-card__title">{t("affiliate.ordersNew.customerTitle")}</div>
        <div className="mimo-form-grid">
          <label className="mimo-field">
            <span>{t("affiliate.ordersNew.customerName")}</span>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </label>
          <label className="mimo-field">
            <span>{t("affiliate.ordersNew.customerPhone")}</span>
            <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
          </label>
        </div>
      </div>

      <div className="mimo-card mimo-section-card">
        <div className="mimo-section-card__title">{t("affiliate.ordersNew.serviceTitle")}</div>
        <label className="mimo-field">
          <span>{t("affiliate.ordersNew.serviceType")}</span>
          <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
            <option>Wash & Fold</option>
            <option>Dry Cleaning</option>
            <option>Express Laundry</option>
          </select>
        </label>
      </div>

      <div className="mimo-card mimo-section-card">
        <div className="mimo-section-card__title">{t("affiliate.ordersNew.handoffTitle")}</div>
        <label className="mimo-field">
          <span>{t("affiliate.ordersNew.handoffType")}</span>
          <select value={handoffType} onChange={(e) => setHandoffType(e.target.value)}>
            <option value="shop_pickup">{t("affiliate.ordersNew.handoff.shopPickup")}</option>
            <option value="return_delivery">{t("affiliate.ordersNew.handoff.returnDelivery")}</option>
          </select>
        </label>
      </div>

      <div className="mimo-card mimo-section-card">
        <div className="mimo-section-card__title">{t("affiliate.ordersNew.reviewTitle")}</div>
        <div className="mimo-inline-summary">
          <div>{customerName || t("affiliate.ordersNew.reviewPendingName")}</div>
          <div>{customerPhone || "+255"}</div>
          <div>{serviceType}</div>
          <div>
            {handoffType === "shop_pickup"
              ? t("affiliate.ordersNew.handoff.shopPickup")
              : t("affiliate.ordersNew.handoff.returnDelivery")}
          </div>
        </div>
      </div>

      <div className="mimo-page-actions">
        <Link className="mimo-button mimo-button--ghost" href="/app/affiliate">
          {t("common.cancel")}
        </Link>
        <Link className="mimo-button mimo-button--primary" href="/app/affiliate/orders">
          {t("affiliate.ordersNew.submit")}
        </Link>
      </div>
    </div>
  );
}

export function P2AffiliateOrdersPage() {
  const t = i18n.t.bind(i18n);
  const [statusFilter, setStatusFilter] = useState("all");
  const [readinessFilter, setReadinessFilter] = useState("all");

  const filteredOrders = useMemo(() => {
    return affiliateOrders.filter((order) => {
      const statusOk = statusFilter === "all" || order.status === statusFilter;
      const readinessOk = readinessFilter === "all" || order.readiness === readinessFilter;
      return statusOk && readinessOk;
    });
  }, [statusFilter, readinessFilter]);

  return (
    <div className="mimo-page-stack">
      <div className="mimo-page-header">
        <div>
          <div className="mimo-eyebrow">{t("affiliate.orders.eyebrow")}</div>
          <h1 className="mimo-page-title">{t("affiliate.orders.title")}</h1>
          <p className="mimo-page-subtitle">{t("affiliate.orders.subtitle")}</p>
        </div>
        <Link className="mimo-button mimo-button--primary" href="/app/affiliate/orders/new">
          {t("affiliate.orders.createOrder")}
        </Link>
      </div>

      <div className="mimo-card mimo-section-card">
        <div className="mimo-filter-bar">
          <label className="mimo-field">
            <span>{t("affiliate.orders.filters.status")}</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">{t("affiliate.orders.filters.all")}</option>
              <option value="received">{t("affiliate.orders.status.received")}</option>
              <option value="processing">{t("affiliate.orders.status.processing")}</option>
              <option value="ready">{t("affiliate.orders.status.ready")}</option>
              <option value="issue">{t("affiliate.orders.status.issue")}</option>
            </select>
          </label>
          <label className="mimo-field">
            <span>{t("affiliate.orders.filters.readiness")}</span>
            <select value={readinessFilter} onChange={(e) => setReadinessFilter(e.target.value)}>
              <option value="all">{t("affiliate.orders.filters.all")}</option>
              <option value="ready_for_pickup">{t("affiliate.orders.readiness.ready")}</option>
              <option value="not_ready">{t("affiliate.orders.readiness.notReady")}</option>
              <option value="return_scheduled">{t("affiliate.orders.readiness.returnScheduled")}</option>
            </select>
          </label>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <AffiliateStateCard
          title={t("affiliate.state.noOrders")}
          body={t("affiliate.state.noOrdersBody")}
          actionLabel={t("affiliate.orders.createOrder")}
          href="/app/affiliate/orders/new"
        />
      ) : (
        <div className="mimo-card mimo-section-card">
          <div className="mimo-table">
            <div className="mimo-table__header">
              <div>{t("affiliate.orders.columns.reference")}</div>
              <div>{t("affiliate.orders.columns.customer")}</div>
              <div>{t("affiliate.orders.columns.service")}</div>
              <div>{t("affiliate.orders.columns.status")}</div>
              <div>{t("affiliate.orders.columns.readiness")}</div>
            </div>

            {filteredOrders.map((order) => (
              <Link key={order.id} href={`/app/affiliate/orders/${order.id}`} className="mimo-table__row">
                <div>{order.reference}</div>
                <div>
                  {order.customerName}
                  <div className="mimo-table__sub">{order.customerPhone}</div>
                </div>
                <div>{order.serviceType}</div>
                <div>{t(`affiliate.orders.status.${order.status}`)}</div>
                <div>
                  {order.readiness === "ready_for_pickup"
                    ? t("affiliate.orders.readiness.ready")
                    : order.readiness === "return_scheduled"
                      ? t("affiliate.orders.readiness.returnScheduled")
                      : t("affiliate.orders.readiness.notReady")}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function P2AffiliateOrderDetail({ orderId }: { orderId: string }) {
  const t = i18n.t.bind(i18n);
  const order = affiliateOrders.find((entry) => entry.id === orderId) || affiliateOrders[0];

  if (!order) {
    return (
      <AffiliateStateCard
        title={t("affiliate.state.noOrders")}
        body={t("affiliate.state.noOrdersBody")}
        actionLabel={t("affiliate.orderDetail.back")}
        href="/app/affiliate/orders"
      />
    );
  }

  const [pickedUp, setPickedUp] = useState(order.status === "picked_up");

  const isReady = order.readiness === "ready_for_pickup";
  const hasIssue = Boolean(order.issue);

  return (
    <div className="mimo-page-stack">
      <div className="mimo-page-header">
        <div>
          <div className="mimo-eyebrow">{t("affiliate.orderDetail.eyebrow")}</div>
          <h1 className="mimo-page-title">{order.reference}</h1>
          <p className="mimo-page-subtitle">{t("affiliate.orderDetail.subtitle")}</p>
        </div>
        <Link className="mimo-button mimo-button--ghost" href="/app/affiliate/orders">
          {t("affiliate.orderDetail.back")}
        </Link>
      </div>

      <div className="mimo-two-column mimo-two-column--balanced">
        <section className="mimo-card mimo-section-card">
          <div className="mimo-section-card__title">{t("affiliate.orderDetail.summaryTitle")}</div>
          <div className="mimo-inline-summary">
            <div>{order.customerName}</div>
            <div>{order.customerPhone}</div>
            <div>{order.serviceType}</div>
            <div>{t(`affiliate.orders.status.${order.status}`)}</div>
          </div>
        </section>

        <section className="mimo-card mimo-section-card">
          <div className="mimo-section-card__title">{t("affiliate.orderDetail.timelineTitle")}</div>
          <div className="mimo-list">
            <div className="mimo-list-row">
              <div>{t("affiliate.orderDetail.timeline.received")}</div>
              <div>08:15</div>
            </div>
            <div className="mimo-list-row">
              <div>{t("affiliate.orderDetail.timeline.processing")}</div>
              <div>09:40</div>
            </div>
            <div className="mimo-list-row">
              <div>{isReady ? t("affiliate.orderDetail.timeline.ready") : t("affiliate.orderDetail.timeline.waiting")}</div>
              <div>{order.updatedAt}</div>
            </div>
          </div>
        </section>
      </div>

      <section className="mimo-card mimo-section-card">
        <div className="mimo-section-card__title">{t("affiliate.orderDetail.pickupTitle")}</div>

        {hasIssue ? (
          <div className="mimo-inline-alert">
            <strong>{t("affiliate.state.issueRaised")}</strong>
            <span>{order.issue}</span>
          </div>
        ) : null}

        {pickedUp ? (
          <AffiliateStateCard
            title={t("affiliate.orderDetail.pickedUpTitle")}
            body={t("affiliate.orderDetail.pickedUpBody")}
          />
        ) : isReady ? (
          <div className="mimo-page-actions">
            <div className="mimo-inline-alert">
              <strong>{t("affiliate.state.readyForPickup")}</strong>
              <span>{t("affiliate.orderDetail.readyBody")}</span>
            </div>
            <button className="mimo-button mimo-button--primary" onClick={() => setPickedUp(true)}>
              {t("affiliate.orderDetail.confirmPickup")}
            </button>
          </div>
        ) : (
          <AffiliateStateCard
            title={t("affiliate.state.noReadyPickups")}
            body={t("affiliate.orderDetail.notReadyBody")}
          />
        )}
      </section>

      <section className="mimo-card mimo-section-card">
        <div className="mimo-section-card__title">{t("affiliate.orderDetail.customerTitle")}</div>
        <div className="mimo-inline-summary">
          <div>{order.customerName}</div>
          <div>{order.customerPhone}</div>
          <div>{t("affiliate.orderDetail.handoffAtShop")}</div>
        </div>
      </section>

      <section className="mimo-card mimo-section-card">
        <div className="mimo-section-card__title">{t("affiliate.orderDetail.helpTitle")}</div>
        <p className="mimo-section-card__body">{t("affiliate.orderDetail.helpBody")}</p>
        <Link className="mimo-button mimo-button--ghost" href="/help">
          {t("affiliate.orderDetail.helpAction")}
        </Link>
      </section>
    </div>
  );
}

export function P2AffiliateFinancePage() {
  const t = i18n.t.bind(i18n);
  const role = useAffiliateRole();

  if (role !== "admin") {
    return (
      <AffiliateForbidden
        title={t("affiliate.finance.forbiddenTitle")}
        body={t("affiliate.finance.forbiddenBody")}
        backHref="/app/affiliate"
        backLabel={t("affiliate.finance.forbiddenAction")}
      />
    );
  }

  return (
    <div className="mimo-page-stack">
      <div className="mimo-page-header">
        <div>
          <div className="mimo-eyebrow">{t("affiliate.finance.eyebrow")}</div>
          <h1 className="mimo-page-title">{t("affiliate.finance.title")}</h1>
          <p className="mimo-page-subtitle">{t("affiliate.finance.subtitle")}</p>
        </div>
      </div>

      <div className="mimo-kpi-grid mimo-kpi-grid--three">
        <AffiliateKpi label={t("affiliate.finance.earned")} value="TZS 82,000" />
        <AffiliateKpi label={t("affiliate.finance.pending")} value="TZS 28,000" />
        <AffiliateKpi label={t("affiliate.finance.recent")} value="TZS 74,000" />
      </div>

      <div className="mimo-card mimo-section-card">
        <div className="mimo-section-card__title">{t("affiliate.finance.activityTitle")}</div>
        <div className="mimo-table">
          <div className="mimo-table__header">
            <div>{t("affiliate.finance.columns.period")}</div>
            <div>{t("affiliate.finance.columns.earned")}</div>
            <div>{t("affiliate.finance.columns.pending")}</div>
            <div>{t("affiliate.finance.columns.status")}</div>
          </div>

          {financeRows.map((row) => (
            <div key={row.id} className="mimo-table__row">
              <div>{row.period}</div>
              <div>{row.earned}</div>
              <div>{row.pending}</div>
              <div>{row.status === "paid" ? t("affiliate.finance.status.paid") : t("affiliate.finance.status.pending")}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


