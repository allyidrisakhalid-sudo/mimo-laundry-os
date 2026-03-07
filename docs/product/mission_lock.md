# Mission Lock MIMO Laundry OS

## System Name

MIMO Laundry OS (Multi-Hub + Multi-Affiliate + Zoned Drivers)

## Product Goal

MIMO Laundry OS is considered **done** for MVP when it is live and usable to run daily laundry operations end-to-end in production for a real business, with configuration-driven support for multiple hubs, multiple affiliate shops, multiple drivers, and zone-based operations.

## Operational Definition of Done

The system must provide:

1. **Live production surfaces**
   - Admin web portal
   - Hub operations web portal
   - Affiliate web portal
   - Customer web portal
   - Driver mobile app
   - Customer mobile experience provided by web first in MVP; native customer mobile app is not required for MVP

2. **Configuration-driven operating model**
   - Hubs are configurable, not hardcoded
   - Affiliates are configurable, not hardcoded
   - Drivers are configurable, not hardcoded
   - Zones are configurable and used to connect hubs, affiliates, drivers, and orders

3. **Proven end-to-end production workflow**
   - Customer creates order
   - Order is assigned to door pickup, shop drop, or hybrid workflow
   - Pickup is completed by driver or affiliate shop
   - Order reaches hub intake
   - Order is processed through operational stages
   - Order is dispatched for return
   - Order is delivered to customer or affiliate pickup point
   - Payment is recorded
   - Receipt is produced
   - Affiliate commission is recorded when applicable
   - Admin reporting reflects the transaction trail

4. **Business-operable admin capability**
   - Manage orders
   - Manage users and roles
   - Manage hubs
   - Manage affiliate shops
   - Manage drivers
   - Manage zones
   - Manage pricing plans and versions
   - Manage payouts and commission workflows
   - View accounting basics and operational reports

5. **Core truth and control requirements**
   - Order timeline is immutable through OrderEvents
   - Pricing is versioned and locked per order
   - RBAC and resource scoping are enforced
   - Privileged actions are audit logged

## MVP Delivery Decision

For MVP:

- Customer experience is delivered through **web**
- Driver experience is delivered through **mobile**
- Customer native mobile app may be added after MVP and is explicitly out of MVP unless later approved

## Done Means Business Ready

MVP is complete only when the production system can support real orders across at least one live zone using the full operating chain:
customer order pickup/dropoff hub intake processing dispatch delivery payment receipt commission/accounting trail.
