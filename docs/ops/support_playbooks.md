# Support Playbooks Disputes, Refunds, Delays

## Scope

This playbook defines how support/admin/hub leadership handle operational issues while preserving evidence and auditability.

## Core Rules

- Never resolve customer-impacting issues off-system.
- Every issue must leave evidence in OrderEvents, issue records, notes, receipts, ledgers, or audit logs.
- RBAC must remain enforced.
- Privileged actions require proper staff/admin accounts.

---

# A. Missing Item Workflow

## Trigger

Customer or staff reports a missing garment/item.

## Roles

- Support/Admin
- Hub Supervisor
- Affiliate Manager (if affiliate-sourced)
- Driver, if relevant to chain of custody

## Steps

1. Open the affected order.
2. Confirm timeline and processing history.
3. Create/log the issue as missing item.
4. Review:
   - intake notes/photos
   - processing/QC history
   - dispatch/delivery evidence
5. Identify last known custody point.
6. Assign investigation owner.
7. Contact relevant staff (hub/driver/shop) for evidence.
8. Record findings in the issue log.
9. Resolve by one of:
   - item found and returned
   - compensation approved
   - claim denied with documented reason
10. Confirm final customer-facing resolution is recorded.

## Proof

- Issue record exists.
- Notes/events document investigation.
- Resolution is visible and attributable.

## Escalation

- High-value item or repeated pattern -> Admin + business owner review.

---

# B. Damage Workflow

## Trigger

Damage is reported by customer or found during processing/QC.

## Steps

1. Open order and log damage issue immediately.
2. Capture evidence:
   - photos
   - notes
   - stage where issue was found
3. Determine whether damage was pre-existing or operationally caused.
4. Route to supervisor/admin for approval decision.
5. Choose resolution path:
   - rework
   - compensation/credit
   - refund
   - documented rejection
6. Record approval identity and reason.
7. Confirm customer communication and final outcome.

## Proof

- Damage issue/evidence exists.
- Approval is auditable.
- Financial correction, if any, appears in ledger/refund records.

## Escalation

- Sensitive/high-value customer case -> Admin/business owner review before final settlement.

---

# C. Delay Workflow

## Trigger

SLA risk or actual delay detected.

## Steps

1. Identify the delayed order(s).
2. Confirm current stage and bottleneck.
3. Prioritize by tier:
   - SAME-DAY highest
   - EXPRESS next
   - STANDARD normal
4. Notify operations owner/hub supervisor.
5. Contact customer using approved message.
6. Record delay note/event.
7. If policy allows credit/refund:
   - approve via admin path
   - record financial impact in system
8. Monitor until closure.

## Customer Message Template

"Hello, your Laundry OS order is delayed and we are actively resolving it. We apologize for the inconvenience. Your updated expected completion/delivery time is [TIME]. If applicable, we will apply the approved service recovery on your order."

## Proof

- Delay evidence exists in order notes/events.
- Customer communication is documented where possible.
- Credit/refund is auditable if used.

## Escalation

- Same-day missed commitment -> Admin review same day.

---

# D. Refund Workflow

## Trigger

Approved refund or credit decision.

## Steps

1. Open order and verify eligibility/reason.
2. Confirm payment history and current balance.
3. Approve refund using proper admin/staff authority.
4. Record refund transaction in system.
5. Confirm updated order balance/ledger impact.
6. If cash was involved, ensure reconciliation impact is understood.
7. Add reason/reference note.
8. Confirm audit entry exists.

## Proof

- Refund transaction exists.
- Order balance/ledger updated correctly.
- Audit entry shows actor + time.
- Receipt/reference evidence is retained where applicable.

## Escalation

- Large refund or repeated refund trend -> finance/admin review.

---

# Issue Logging Rule for Dry-Run

Any deviation found during simulation must be logged with:

- issue title
- order reference
- severity (P1/P2/P3)
- owner
- workaround
- permanent fix recommendation
