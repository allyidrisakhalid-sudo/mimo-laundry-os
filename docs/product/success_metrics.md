# Success Metrics MIMO Laundry OS

## Measurement Rule

These are launch-stage target metrics for MVP operations. Each metric must be measurable from application records, reports, or ledgers.

## Ops Metrics

| Metric                        | Definition                                                                   |                   Launch Target |
| ----------------------------- | ---------------------------------------------------------------------------- | ------------------------------: |
| On-time delivery rate         | % of delivered orders completed within promised SLA window                   |                          >= 95% |
| Average turnaround time       | Average hours from order creation to delivery completion by fulfilled orders | <= 48 hours for standard orders |
| Dispute rate                  | % of completed orders that create a customer dispute or exception claim      |                            < 3% |
| Rewash rate                   | % of completed orders requiring rewash after QC or customer complaint        |                            < 2% |
| Intake-to-dispatch cycle time | Average hours from hub intake to dispatch-ready status                       | <= 24 hours for standard orders |

## Growth Metrics

| Metric                        | Definition                                                           |                               Launch Target |
| ----------------------------- | -------------------------------------------------------------------- | ------------------------------------------: |
| Orders per day                | Total completed or active orders created per day across all channels |        >= 20/day after launch stabilization |
| Door vs shop mix              | Share of orders by DOOR, SHOP_DROP, HYBRID channels                  | Reported weekly, no target in first 30 days |
| Repeat customer rate          | % of customers placing a second order within 30 days                 |                                      >= 25% |
| Affiliate activation rate     | % of onboarded affiliate shops that create at least 1 order per week |                                      >= 60% |
| Orders per affiliate per week | Average count of orders created by active affiliate shops            |                                  >= 10/week |

## Finance Metrics

| Metric                       | Definition                                                                             |       Launch Target |
| ---------------------------- | -------------------------------------------------------------------------------------- | ------------------: |
| Average order value          | Average final invoice value per completed order in TZS                                 |       >= 18,000 TZS |
| Gross margin estimate        | Final invoice less direct processing, commission, and delivery variable cost per order | Positive on average |
| Delivery cost per order      | Average variable delivery cost allocated per completed order                           |        <= 4,500 TZS |
| Commission payout ratio      | Affiliate commissions paid as % of affiliate-sourced revenue                           |              <= 15% |
| Cash reconciliation accuracy | % of daily closes with no unexplained cash variance                                    |              >= 98% |

## Reporting Notes

- Targets are initial operational thresholds, not long-term ceilings.
- Metrics must be reviewable by date range, hub, zone, channel, and affiliate where applicable.
- If a metric cannot be produced from system data, the chapter is incomplete in practice even if the feature exists.
