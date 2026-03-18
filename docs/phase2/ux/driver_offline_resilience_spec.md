# Driver Offline Resilience Spec  Mimo Phase 2

## 1) Resilience Principles

Locked resilience principles:
- network problems must not create panic
- the driver must always understand the current state
- retry must be obvious
- unsent progress must be handled calmly
- the UI must distinguish between saved locally, sending, failed, and synced states if applicable
- resilience UX must stay simple and not introduce technical complexity to the driver
- the app must preserve trust under weak network conditions

## 2) Connectivity States

### Online
- trigger:
  - connection is healthy and the system can send and confirm actions normally
- visible signal:
  - compact normal online status or no extra emphasis if the product keeps online silent by default
- what the driver can still do:
  - complete tasks, submit proof, confirm cash, and navigate normally
- next action:
  - continue work as normal

### Weak connection
- trigger:
  - unstable or slow network where actions may take longer than expected
- visible signal:
  - compact weak-connection label or banner with calm wording
- what the driver can still do:
  - continue task flow, attempt proof submission, and review task details
- next action:
  - continue carefully and watch for sending or retry feedback

### Offline
- trigger:
  - no active connection is available
- visible signal:
  - compact offline signal that is clearly visible on relevant task screens
- what the driver can still do:
  - review current task details and complete any locally supported capture steps
- next action:
  - wait for connection or use retry once back online

### Syncing
- trigger:
  - one or more pending actions are being sent or reconciled with the server
- visible signal:
  - compact syncing state near the affected task or action
- what the driver can still do:
  - stay in the flow, review task details, and monitor progress
- next action:
  - allow the action to finish syncing

### Sync failed
- trigger:
  - an attempted send did not complete successfully
- visible signal:
  - compact failed state with a clear retry path
- what the driver can still do:
  - review the failed action, retry, or report issue
- next action:
  - retry or report issue

### Synced
- trigger:
  - the system has confirmed the action successfully
- visible signal:
  - compact synced or completed confirmation
- what the driver can still do:
  - move forward safely to the next task or action
- next action:
  - continue work

## 3) Task Screen Offline Rules

- if proof action is attempted under poor network, the UI must explain whether the action is queued, retrying, or requires attention
- stop detail must not silently lose progress
- driver must not wonder whether the action went through
- visual signal must be compact but visible
- resilience messaging must appear close to the affected proof or cash area, not buried elsewhere
- the screen must preserve the dominant next step while still showing state clearly
- poor connection handling must not turn the stop detail into a technical diagnostics screen

## 4) Proof Submission Retry Rules

- after proof capture, the interface must show a sending state
- if sending fails, show retry path
- do not force the driver to redo work unless truly necessary
- if local temporary preservation is supported, reflect that calmly
- no technical stack error language
- retry action must be obvious and close to the affected proof item
- once proof is confirmed, the UI must clearly move to synced or completed state

## 5) Cash Confirmation Retry Rules

- same resilience pattern as proof submission
- if cash confirmation is pending sync, make that visible
- do not mark the task as final in a misleading way if the critical state has not been accepted by the system
- cash retry messaging must stay short and practical
- the driver must understand whether cash confirmation is still pending or safely accepted
- retry or issue reporting must remain obvious

## 6) Sync Recovery Rules

- once connectivity returns, pending actions should move toward synced state clearly
- the driver should see when the task is safe/complete
- if manual retry is needed, the action must be obvious
- recovery signals must remain compact and consistent with the rest of the portal
- the interface must reduce uncertainty instead of repeating warnings
- when sync succeeds, urgency should reduce immediately and clearly

## 7) Resilience Copy and Feedback Rules

- short calm labels only
- avoid blame
- avoid system failure language
- explain what to do next in one short instruction
- feedback must focus on driver confidence and action clarity
- status labels must stay operational and human:
  - online
  - weak connection
  - offline
  - sending
  - retry
  - failed
  - synced
- retry prompts must be direct and compact
- preserved or queued progress must be described calmly, never dramatically

## 8) Resilience Lock Statement

The driver resilience model is locked as a calm, launch-safe, low-complexity behavior system that preserves trust under weak network conditions. Drivers must always understand whether work is saved, sending, failed, retryable, or safely synced, without technical language, panic states, or hidden uncertainty.
