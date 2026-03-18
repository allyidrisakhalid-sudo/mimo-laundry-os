# Driver Portal Spec  Mimo Phase 2

## 1) Driver Portal Principles

Locked driver portal principles:
- mobile-first execution speed
- next stop first
- proof actions must be obvious
- cash handling must be clear and accountable
- no training required to complete a task
- route clarity over dashboard decoration
- one dominant action at a time
- low tap count
- poor network conditions must not collapse the workflow
- driver portal must feel fast, sharp, and trustworthy

## 2) Driver Today Spec

### Route
- /app/driver

### Purpose
- give the driver one sharp view of todays work, the next stop, and anything that needs immediate attention

### Primary CTA
- Start next task

### Secondary Actions
- View all tasks
- Review cash
- Get help

### Page Structure
1) PageHeader
2) Today summary strip
3) Next task hero card
4) Grouped task sections
5) Cash summary block
6) Alerts/exceptions block

### Top Summary Rules
- show only the information needed to start work
- include:
  - availability state
  - assigned task count
  - pending proof count if relevant
  - cash to reconcile if relevant
- do not turn the page into a KPI dashboard

### Task Grouping Rules
- group tasks by practical execution logic
- primary grouping order:
  - Next
  - Upcoming
  - Completed today
- if batch/trip grouping is operationally stronger, show it clearly without adding complexity
- each task row/card must show:
  - task type
  - stop/customer/shop reference
  - status
  - time or sequence clue
  - proof/cash indicator if relevant

### Route Clarity Rules
- the next task must be visually dominant
- sequence must be understandable without map dependence
- route meaning must be explained with simple ordering cues
- no heavy map UI in this chapter
- no ambiguous stop order

### Cash Visibility Rules
- cash collection and reconciliation state must be visible but secondary to the next stop
- if cash is outstanding, surface it clearly
- do not hide cash state deep in profile

### Alerts and Exceptions Rules
- late or blocked tasks must surface clearly
- proof pending or issue states must be visible
- keep alerts concise and actionable

### No Tasks State
- show a clean empty state
- explain there are no assigned tasks right now
- keep availability and support entry visible
- do not create a dead-end page

### Mobile Rules
- next task visible immediately
- grouped tasks remain scan-friendly
- no dense table behavior
- one-thumb reach for primary CTA
- no horizontal scrolling

### Visual Rules
- next task card gets strongest emphasis
- grouped tasks use clean list cards
- premium calm urgency treatment
- strong status clarity
- no decorative clutter

### Forbidden Patterns
- map-first screen
- dense desktop-style tables
- too many filters on today screen
- duplicate stop detail content on the root page
- hidden next step

## 3) Tasks List Summary

### Route
- /app/driver/tasks

### Purpose
- provide one clean list view of assigned work beyond the root today screen without weakening the next-task-first model

### Primary Job
- help the driver scan, open, and complete assigned tasks in practical execution order

### Structure
1) PageHeader
2) Light status/filter strip only if operationally needed
3) Pending task list
4) Completed today list or collapsible section
5) Compact cash/retry indicators when relevant

### List Rules
- keep the list simple and mobile-first
- default ordering should support real execution, not data exploration
- each row must remain tap-friendly and scannable
- show only the fields that help action:
  - task type
  - stop/customer/shop reference
  - status
  - time or sequence clue
  - proof/cash/sync indicator if relevant
- completed items must remain visually distinct from pending items
- search or filters may exist only if truly needed and must stay light

### Relationship to Today
- Today is the execution home
- Tasks is the wider list context
- Tasks must not duplicate the root page hero treatment for the next stop
- opening a task always leads into stop detail

## 4) Stop Detail Spec

### Route
- /app/driver/tasks/[id]

### Purpose
- let the driver complete one stop correctly with the fewest necessary taps

### Primary Action
- complete the required next proof or handoff action for this stop

### Allowed Supporting Actions
- call/contact if supported
- view order/task reference
- report issue
- review cash prompt if applicable

### Page Structure
1) PageHeader
2) Stop summary block
3) Proof action block
4) Cash collection block if relevant
5) Issue/help block
6) Supporting task details

### Stop Summary Block Rules
- include:
  - task type
  - customer/shop reference
  - order/bag reference as relevant
  - short location/handoff context
  - current task status
- keep it concise and scannable
- no excessive secondary metadata above the action block

### Proof Action Block Rules
- this is the hero of the screen
- proof actions must be large and unmistakable
- action type must change based on task requirement:
  - pickup confirmation
  - bag/code scan if supported
  - OTP confirmation
  - signature/photo proof
  - delivery confirmation
- only the valid next proof action should dominate
- supporting proof guidance must be one short line only
- if multiple proof inputs are required, sequence them clearly and one at a time

### Cash Collection Block Rules
- appears only when relevant
- clearly state whether cash is due
- show amount and collection requirement cleanly
- tie cash confirmation to the stop completion flow without clutter
- do not mix cash detail into proof copy confusingly

### Issue/Help Block Rules
- one clear issue path
- issue categories must stay short and practical
- help entry must remain available without overpowering the task flow

### Supporting Task Details Rules
- secondary details only
- include customer/shop info, special note, or handoff context as needed
- keep below the action area

### Stop Detail Forbidden Patterns
- burying the proof action below long metadata
- multiple competing primary buttons
- forcing the driver to hunt for the next step
- giant support FAQ wall
- overloaded multi-section complexity

## 5) Cash and Reconciliation Spec

### Scope
- cash handling applies only where the order/task requires collection or reconciliation

### Cash Prompt Rules
- when a stop requires cash, the prompt appears in stop detail
- prompt must clearly show:
  - amount expected
  - what the driver must confirm
  - whether proof and cash are both required before completion
- wording must remain direct and calm
- do not expose accounting jargon

### Cash Confirmation Rules
- driver confirms collected cash with one clear action
- if exact amount confirmation is needed, keep it minimal
- if cash is not collected, issue path must be available
- cash confirmation must feel connected to the stop, not like a separate app area

### Today Screen Cash Summary Rules
- show:
  - total cash collected today or pending reconciliation
  - whether end-of-day action is needed
- summary remains a compact block on Today
- use one CTA:
  - Review cash

### End-of-Day Reconciliation Rules
- reconciliation entry may live in Today or Tasks context, not as a separate permanent tab
- driver sees:
  - todays collected total
  - outstanding items or discrepancies if any
  - one clear complete/review action
- keep the flow short and practical
- this is not a bookkeeping screen

### Reconciliation Completion Rules
- once reconciliation is complete, state it clearly
- reduce the urgency state on Today
- preserve history state if the product already supports it, but do not expand scope in P2.8

### Error and Mismatch Rules
- missing cash confirmation or mismatch must surface calmly
- next step must be obvious:
  - review
  - retry
  - report issue
- no alarmist language
- no raw ledger terminology

### Forbidden Patterns
- separate finance portal behavior for drivers
- giant reconciliation workflow
- hidden cash state
- forcing drivers to remember amounts from prior screens
- duplicate cash prompts in multiple competing places

## 6) Driver Portal State Rules

### Core Screens
- /app/driver
- /app/driver/tasks
- /app/driver/tasks/[id]
- /app/driver/profile

### Today State Rules
- if the driver has assigned work, show next task hero first
- if the driver has no tasks, show the no-tasks state with availability and help visible
- if cash needs review, surface it as a compact secondary block
- if alerts or proof pending states exist, show them as concise action rows

### Tasks State Rules
- pending tasks remain the primary list
- completed today remains visible but secondary
- sync, proof, and cash indicators may appear only when they help action
- task lists must stay simple enough for repeated daily scanning

### Stop Detail State Rules
- only one dominant next step may lead the screen
- proof actions must adapt by task requirement without changing the overall structure
- cash appears only when relevant
- issue/help remains available but secondary
- supporting details remain below the action stack

### Profile State Rules
- profile exists for driver availability, account basics, help, and logout
- profile must not become a bloated settings surface
- availability must be clear and easy to update
- support and logout must be easy to find

### Portal Consistency Rules
- Today is the execution home
- Tasks is the wider task list
- Stop detail is the action screen
- Profile is the account/support area
- no screen may duplicate another screens main purpose
- the overall flow must support a full day of work with minimal taps and low confusion

## 7) Driver Portal Lock Statement

The driver portal is locked as a minimal 4-screen, mobile-first execution system built around next-task-first routing, large proof actions, clear secondary cash handling, and calm recovery paths under poor network conditions. The portal must feel sharp, fast, trustworthy, and operationally clear without dashboard clutter, desktop carryover, or duplicated content.
