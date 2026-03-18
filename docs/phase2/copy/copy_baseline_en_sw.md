# Copy Baseline EN/SW  Phase 2 Blueprint Lock (P2.0)

System: Mimo Laundry OS  
Purpose: Implementation-grade i18n reference for Phase 2 UI.  
Direction: Midnight Silk

## 1) Tone and Style Rules

- warm
- welcoming
- simple
- premium
- calm
- direct
- no slang
- no robotic enterprise phrasing
- short sentences
- easy to translate cleanly into Swahili

---

## 2) Common UI Labels

| key | EN | SW | usage note |
|---|---|---|---|
| common.ok | OK | Sawa | Short universal confirmation. |
| common.cancel | Cancel | Ghairi | Cancel an action or close a flow. |
| common.save | Save | Hifadhi | Save changes to a form or setting. |
| common.continue | Continue | Endelea | Move to the next step in a flow. |
| common.back | Back | Rudi | Return to the previous view. |
| common.close | Close | Funga | Close a panel, modal, or drawer. |
| common.search | Search | Tafuta | Search lists, help, or records. |
| common.filter | Filter | Chuja | Refine a list or results set. |
| common.clear | Clear | Ondoa | Clear filters, search, or inputs. |
| common.retry | Retry | Jaribu tena | Retry a failed action. |
| common.viewAll | View all | Tazama yote | Open the full list view. |
| common.status | Status | Hali | Label for status/state fields. |
| common.actions | Actions | Hatua | Label for available actions. |
| common.loading | Loading | Inapakia | Short loading state label. |
| common.noResults | No results | Hakuna matokeo | Empty result state after search/filter. |

---

## 3) Auth Labels

| key | EN | SW | usage note |
|---|---|---|---|
| auth.login.title | Welcome back | Karibu tena | Login page title. |
| auth.login.subtitle | Sign in to continue with Mimo. | Ingia ili uendelee na Mimo. | Short login helper text. |
| auth.signup.title | Create your account | Fungua akaunti yako | Signup page title. |
| auth.signup.subtitle | Start with Mimo in a few simple steps. | Anza na Mimo kwa hatua chache rahisi. | Short signup helper text. |
| auth.phone | Phone number | Namba ya simu | Phone input label. |
| auth.password | Password | Nenosiri | Password input label. |
| auth.forgotPassword | Forgot password? | Umesahau nenosiri? | Password recovery entry. |
| auth.createAccount | Create account | Fungua akaunti | Signup CTA label. |
| auth.signIn | Sign in | Ingia | Login CTA label. |
| auth.signOut | Sign out | Toka | Sign-out menu action. |
| auth.resetPassword | Reset password | Weka upya nenosiri | Password reset action. |
| auth.routeByRole | Well take you to the right workspace. | Tutakupeleka kwenye sehemu sahihi ya kazi. | Helper text after successful auth or in auth flow notes. |

---

## 4) Navigation Labels

| key | EN | SW | usage note |
|---|---|---|---|
| nav.home | Home | Nyumbani | Customer home or public home label where applicable. |
| nav.orders | Orders | Oda | Order list navigation label. |
| nav.profile | Profile | Wasifu | Profile/settings navigation label. |
| nav.today | Today | Leo | Driver daily home label. |
| nav.tasks | Tasks | Kazi | Driver task list label. |
| nav.dashboard | Dashboard | Dashibodi | Role home for operational portals. |
| nav.intake | Intake | Mapokezi | Hub receiving/intake queue label. |
| nav.processing | Processing | Uchakataji | Hub processing board label. |
| nav.newOrder | New Order | Oda Mpya | Affiliate order creation entry. |
| nav.finance | Finance | Fedha | Finance and payout navigation label. |
| nav.operations | Operations | Operesheni | Admin operations overview label. |
| nav.diagnostics | Diagnostics | Uchunguzi | Dev diagnostic area label. |
| nav.tools | Tools | Zana | Dev support tools label. |
| nav.activity | Activity | Shughuli | Dev audit/activity label. |
| nav.help | Help | Msaada | Help/support entry label. |
| nav.track | Track | Fuatilia | Order tracking entry label. |

---

## 5) Order Status Labels

| key | EN | SW | usage note |
|---|---|---|---|
| status.order.new | New | Mpya | Order has been created. |
| status.order.confirmed | Confirmed | Imethibitishwa | Order has been confirmed. |
| status.order.assigned | Assigned | Imepewa | Order/task has been assigned. |
| status.order.pickedUp | Picked up | Imekusanywa | Laundry has been collected from customer or shop. |
| status.order.atHub | At hub | Ipo hubu | Order is at the processing hub. |
| status.order.processing | Processing | Inachakatwa | Order is in wash/process flow. |
| status.order.ready | Ready | Tayari | Order is ready for pickup or delivery. |
| status.order.outForDelivery | Out for delivery | Iko njiani kupelekwa | Order is on the way to the customer or return point. |
| status.order.delivered | Delivered | Imefikishwa | Order has reached the customer or return destination. |
| status.order.paid | Paid | Imelipwa | Payment has been completed. |
| status.order.cancelled | Cancelled | Imeghairiwa | Order has been cancelled. |

---

## 6) Issue / Exception Labels

| key | EN | SW | usage note |
|---|---|---|---|
| status.issue.none | No issue | Hakuna tatizo | No active issue on the order. |
| status.issue.delay | Delay | Ucheleweshaji | Order is delayed or at risk of delay. |
| status.issue.damage | Damage | Uharibifu | Damage has been reported. |
| status.issue.missingItem | Missing item | Kitu kimepotea | An item is missing from the order. |
| status.issue.refundRequested | Refund requested | Marejesho yameombwa | Refund workflow has been requested. |
| status.issue.actionNeeded | Action needed | Hatua inahitajika | User or operator must act. |
| status.issue.resolved | Resolved | Limetatuliwa | Issue has been resolved. |

---

## 7) Primary CTAs by Role

| key | EN | SW | usage note |
|---|---|---|---|
| cta.customer.newOrder | Start new order | Anza oda mpya | Main customer order creation CTA. |
| cta.customer.trackOrder | Track order | Fuatilia oda | Customer tracking CTA. |
| cta.customer.viewOrder | View order | Tazama oda | Open one order detail view. |
| cta.driver.startNextTask | Start next task | Anza kazi inayofuata | Driver daily primary CTA. |
| cta.driver.completeTask | Complete task | Kamilisha kazi | Driver proof/execution CTA. |
| cta.hub.openNextQueue | Open next queue | Fungua foleni inayofuata | Hub next-action CTA. |
| cta.hub.advanceStage | Move to next stage | Hamisha hatua inayofuata | Hub processing progression CTA. |
| cta.affiliate.createOrder | Create order | Fungua oda | Affiliate primary new-order CTA. |
| cta.affiliate.openOrder | Open order | Fungua oda | Affiliate list-to-detail CTA. |
| cta.affiliate.reviewPayouts | Review payouts | Kagua malipo | Affiliate admin finance CTA. |
| cta.admin.reviewIssues | Review issues | Kagua matatizo | Admin issue queue CTA. |
| cta.admin.openOperations | Open operations | Fungua operesheni | Admin operations CTA. |
| cta.dev.runDiagnostic | Run diagnostic | Endesha uchunguzi | Dev diagnostic CTA. |
| cta.dev.openTool | Open tool | Fungua zana | Dev support tool CTA. |

---

## 8) Empty States

| key | EN | SW | usage note |
|---|---|---|---|
| empty.customer.orders | No orders yet. Your next order will appear here. | Bado hakuna oda. Oda yako inayofuata itaonekana hapa. | Customer orders empty state. |
| empty.driver.tasks | No tasks assigned right now. New work will appear here. | Hakuna kazi ulizopewa kwa sasa. Kazi mpya zitaonekana hapa. | Driver tasks empty state. |
| empty.hub.intake | Nothing is waiting in intake right now. | Hakuna kinachosubiri mapokezi kwa sasa. | Hub intake empty state. |
| empty.affiliate.orders | No shop orders yet. New customer orders will appear here. | Bado hakuna oda za duka. Oda mpya za wateja zitaonekana hapa. | Affiliate orders empty state. |
| empty.admin.orders | No orders match this view right now. | Hakuna oda zinazolingana na mwonekano huu kwa sasa. | Admin orders/filter empty state. |
| empty.search.noResults | No results found. Try a different search or filter. | Hakuna matokeo yaliyopatikana. Jaribu utafutaji au uchujaji mwingine. | Search empty state across product. |

---

## 9) 403 / 404 / System Feedback

| key | EN | SW | usage note |
|---|---|---|---|
| feedback.403.title | Access denied | Huna ruhusa | 403 page title. |
| feedback.403.body | You do not have permission to view this page. | Huna ruhusa ya kuona ukurasa huu. | 403 page body copy. |
| feedback.404.title | Page not found | Ukurasa haujapatikana | 404 page title. |
| feedback.404.body | We could not find the page you were looking for. | Hatujaweza kupata ukurasa uliokuwa unatafuta. | 404 page body copy. |
| feedback.error.generic | Something went wrong. Please try again. | Kuna hitilafu. Tafadhali jaribu tena. | Generic error state. |
| feedback.success.saved | Saved successfully. | Imehifadhiwa kikamilifu. | Save success feedback. |
| feedback.success.updated | Updated successfully. | Imesasishwa kikamilifu. | Update success feedback. |

---

## 10) Notes for i18n Implementation

- All user-facing copy must map to stable i18n keys.
- Sidebar and tab labels must use the navigation keys above.
- Role-specific dashboard CTAs must use the CTA keys above.
- Order and issue states must remain aligned with Phase 1 operational terminology.
- Swahili copy should remain natural, short, and easy to scan on mobile.
- Avoid raw text inside components, forms, badges, alerts, and empty states.

## Hardcoded String Rule

All future UI text must reference i18n keys. No raw display copy should be introduced directly in UI components.
