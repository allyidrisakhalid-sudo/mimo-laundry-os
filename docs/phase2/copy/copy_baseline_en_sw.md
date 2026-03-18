# Copy Baseline EN/SW

## Objective

This document defines the baseline bilingual product copy for Phase 2. All user-facing text must map to i18n keys. No raw strings should be introduced in the UI without first being added here or in an approved extension file.

## Tone

* warm
* welcoming
* simple
* clear
* non-technical
* respectful
* operationally calm

## Writing Rules

* Keep labels short
* Keep buttons action-first
* Use sentence case
* Avoid slang
* Avoid internal terminology unless necessary
* Prefer clear verbs over abstract nouns

---

## Common Labels

| Key                | English          | Kiswahili      |
| ------------------ | ---------------- | -------------- |
| `common.ok`        | OK               | Sawa           |
| `common.cancel`    | Cancel           | Ghairi         |
| `common.save`      | Save             | Hifadhi        |
| `common.continue`  | Continue         | Endelea        |
| `common.back`      | Back             | Rudi           |
| `common.close`     | Close            | Funga          |
| `common.search`    | Search           | Tafuta         |
| `common.filter`    | Filter           | Chuja          |
| `common.clear`     | Clear            | Ondoa          |
| `common.apply`     | Apply            | Tumia          |
| `common.edit`      | Edit             | Hariri         |
| `common.update`    | Update           | Sasisha        |
| `common.view`      | View             | Tazama         |
| `common.details`   | Details          | Maelezo        |
| `common.submit`    | Submit           | Wasilisha      |
| `common.confirm`   | Confirm          | Thibitisha     |
| `common.retry`     | Try again        | Jaribu tena    |
| `common.loading`   | Loading          | Inapakia       |
| `common.noResults` | No results found | Hakuna matokeo |
| `common.status`    | Status           | Hali           |
| `common.date`      | Date             | Tarehe         |
| `common.time`      | Time             | Saa            |
| `common.amount`    | Amount           | Kiasi          |
| `common.total`     | Total            | Jumla          |
| `common.language`  | Language         | Lugha          |
| `common.profile`   | Profile          | Wasifu         |
| `common.logout`    | Log out          | Toka           |
| `common.next`      | Next             | Ifuatayo       |
| `common.previous`  | Previous         | Iliyotangulia  |

---

## Auth + Entry Labels

| Key                   | English                                                   | Kiswahili                                                       |
| --------------------- | --------------------------------------------------------- | --------------------------------------------------------------- |
| `auth.login.title`    | Log in                                                    | Ingia                                                           |
| `auth.login.cta`      | Log in                                                    | Ingia                                                           |
| `auth.signup.title`   | Create account                                            | Fungua akaunti                                                  |
| `auth.signup.cta`     | Create account                                            | Fungua akaunti                                                  |
| `auth.phone.label`    | Phone number                                              | Namba ya simu                                                   |
| `auth.password.label` | Password                                                  | Nenosiri                                                        |
| `auth.forgotPassword` | Forgot password?                                          | Umesahau nenosiri?                                              |
| `auth.route.auto`     | Well take you to the right workspace                     | Tutakupeleka kwenye sehemu sahihi ya kazi                       |
| `auth.invalid`        | We couldnt log you in. Check your details and try again. | Hatujaweza kukuingiza. Angalia taarifa zako kisha ujaribu tena. |

---

## Core Navigation Labels

| Key                | English       | Kiswahili            |
| ------------------ | ------------- | -------------------- |
| `nav.home`         | Home          | Mwanzo               |
| `nav.orders`       | Orders        | Oda                  |
| `nav.newOrder`     | New order     | Oda mpya             |
| `nav.tasks`        | Tasks         | Kazi                 |
| `nav.cash`         | Cash          | Fedha                |
| `nav.dashboard`    | Dashboard     | Dashibodi            |
| `nav.intake`       | Intake        | Mapokezi             |
| `nav.processing`   | Processing    | Uchakatishaji        |
| `nav.dispatch`     | Dispatch      | Usafirishaji         |
| `nav.exceptions`   | Exceptions    | Matatizo             |
| `nav.staff`        | Staff         | Wafanyakazi          |
| `nav.payouts`      | Payouts       | Malipo               |
| `nav.performance`  | Performance   | Utendaji             |
| `nav.operations`   | Operations    | Uendeshaji           |
| `nav.finance`      | Finance       | Fedha                |
| `nav.settings`     | Settings      | Mipangilio           |
| `nav.featureFlags` | Feature flags | Bendera za vipengele |
| `nav.logsJobs`     | Logs & jobs   | Kumbukumbu na kazi   |
| `nav.audit`        | Audit         | Ukaguzi              |

---

## Order Status Labels

| Key                             | English            | Kiswahili               |
| ------------------------------- | ------------------ | ----------------------- |
| `status.order.created`          | Created            | Imeanzishwa             |
| `status.order.scheduledPickup`  | Pickup scheduled   | Ukusanyaji umepangwa    |
| `status.order.pickedUp`         | Picked up          | Imekusanywa             |
| `status.order.receivedAtHub`    | Received at hub    | Imepokelewa kituoni     |
| `status.order.processing`       | Processing         | Inachakatishwa          |
| `status.order.qc`               | Quality check      | Ukaguzi wa ubora        |
| `status.order.readyForDispatch` | Ready for dispatch | Tayari kwa usafirishaji |
| `status.order.outForDelivery`   | Out for delivery   | Inapelekwa              |
| `status.order.readyForPickup`   | Ready for pickup   | Tayari kuchukuliwa      |
| `status.order.delivered`        | Delivered          | Imefikishwa             |
| `status.order.completed`        | Completed          | Imekamilika             |
| `status.order.cancelled`        | Cancelled          | Imeghairiwa             |
| `status.order.delayed`          | Delayed            | Imechelewa              |

---

## Issue / Exception Status Labels

| Key                            | English                     | Kiswahili                |
| ------------------------------ | --------------------------- | ------------------------ |
| `status.issue.open`            | Open                        | Wazi                     |
| `status.issue.inReview`        | In review                   | Inakaguliwa              |
| `status.issue.waitingCustomer` | Waiting for customer        | Inamsubiri mteja         |
| `status.issue.waitingInternal` | Waiting for internal action | Inasubiri hatua ya ndani |
| `status.issue.resolved`        | Resolved                    | Imetatuliwa              |
| `status.issue.closed`          | Closed                      | Imefungwa                |

---

## Payment Status Labels

| Key                            | English        | Kiswahili        |
| ------------------------------ | -------------- | ---------------- |
| `status.payment.unpaid`        | Unpaid         | Haijalipwa       |
| `status.payment.partiallyPaid` | Partially paid | Imelipwa sehemu  |
| `status.payment.paid`          | Paid           | Imelipwa         |
| `status.payment.refunded`      | Refunded       | Imerejeshwa      |
| `status.payment.creditApplied` | Credit applied | Salio limetumika |

---

## Role Primary CTAs

| Key                             | English                 | Kiswahili                    |
| ------------------------------- | ----------------------- | ---------------------------- |
| `cta.customer.createOrder`      | Create new order        | Tengeneza oda mpya           |
| `cta.customer.trackOrder`       | Track order             | Fuatilia oda                 |
| `cta.driver.startNextTask`      | Start next task         | Anza kazi inayofuata         |
| `cta.driver.completeTask`       | Confirm completion      | Thibitisha ukamilishaji      |
| `cta.hub.checkInOrder`          | Check in order          | Pokea oda                    |
| `cta.hub.updateStage`           | Update stage            | Sasisha hatua                |
| `cta.hub.markDispatchReady`     | Mark ready for dispatch | Weka tayari kwa usafirishaji |
| `cta.affiliate.createShopOrder` | Create shop order       | Tengeneza oda ya duka        |
| `cta.affiliate.releaseOrder`    | Release order           | Kabidhi oda                  |
| `cta.admin.reviewPriority`      | Review priority items   | Kagua vitu vya kipaumbele    |
| `cta.admin.openOrder`           | Open order              | Fungua oda                   |
| `cta.dev.inspectSystem`         | Inspect system          | Kagua mfumo                  |
| `cta.dev.reviewFlag`            | Review flag             | Kagua bendera                |

---

## Empty State Copy

| Key                            | English                                                         | Kiswahili                                                    |
| ------------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------ |
| `empty.customer.orders.title`  | No orders yet                                                   | Bado hakuna oda                                              |
| `empty.customer.orders.body`   | When you create your first order, it will appear here.          | Ukishatengeneza oda yako ya kwanza, itaonekana hapa.         |
| `empty.customer.orders.cta`    | Create new order                                                | Tengeneza oda mpya                                           |
| `empty.driver.tasks.title`     | No tasks assigned right now                                     | Hakuna kazi ulizopewa kwa sasa                               |
| `empty.driver.tasks.body`      | New tasks will appear here when they are assigned to you.       | Kazi mpya zitaonekana hapa ukishapewa.                       |
| `empty.driver.tasks.cta`       | Refresh tasks                                                   | Onyesha upya kazi                                            |
| `empty.hub.intake.title`       | Nothing waiting at intake                                       | Hakuna kinachosubiri mapokezi                                |
| `empty.hub.intake.body`        | New incoming orders will appear here.                           | Oda mpya zinazoingia zitaonekana hapa.                       |
| `empty.hub.intake.cta`         | Go to dashboard                                                 | Nenda dashibodi                                              |
| `empty.affiliate.orders.title` | No shop orders yet                                              | Bado hakuna oda za duka                                      |
| `empty.affiliate.orders.body`  | Orders created for your shop will appear here.                  | Oda zilizotengenezwa kwa duka lako zitaonekana hapa.         |
| `empty.affiliate.orders.cta`   | Create shop order                                               | Tengeneza oda ya duka                                        |
| `empty.admin.exceptions.title` | No open exceptions                                              | Hakuna matatizo ya wazi                                      |
| `empty.admin.exceptions.body`  | When an operational issue needs attention, it will appear here. | Tatizo la uendeshaji likihitaji uangalizi, litaonekana hapa. |
| `empty.admin.exceptions.cta`   | Back to dashboard                                               | Rudi dashibodi                                               |

---

## Helpful Microcopy

| Key                                      | English                                            | Kiswahili                                              |
| ---------------------------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| `microcopy.track.subtitle`               | Follow your order from pickup to delivery          | Fuatilia oda yako kuanzia ukusanyaji hadi uwasilishaji |
| `microcopy.customer.home.subtitle`       | Everything you need for your laundry, in one place | Kila unachohitaji kwa huduma ya nguo, mahali pamoja    |
| `microcopy.driver.today.subtitle`        | Your assigned work for today                       | Kazi ulizopewa za leo                                  |
| `microcopy.hub.dashboard.subtitle`       | Keep the hub moving smoothly                       | Endesha kituo kwa utulivu na ufanisi                   |
| `microcopy.affiliate.dashboard.subtitle` | Manage shop orders with clarity                    | Simamia oda za duka kwa uwazi                          |
| `microcopy.admin.dashboard.subtitle`     | Monitor the business and act on priorities         | Fuatilia biashara na chukua hatua kwa vipaumbele       |
| `microcopy.dev.dashboard.subtitle`       | Keep releases safe and systems healthy             | Linda utoaji wa matoleo na afya ya mfumo               |

## Copy Lock

This file is the Phase 2 baseline. Any new user-facing copy must be added through i18n keys before implementation.
