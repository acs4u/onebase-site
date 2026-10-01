# Website lead follow-up: emails and workflows

Two sequences, triggered by the "Website capture" form. Personalisation tokens are HubSpot's (`{{ contact.firstname }}` etc.). Every email is sent from the assigned rep, plain text with the OneBase signature, no images. Sender: the contact owner, falling back to Jett Moody.

Tone: short, plain, specific. No "we're excited", no exclamation marks, no "just checking in".

---

## Sequence A · Spec-sheet nurture

**Enrol:** form submission where the message field contains `Website: Spec sheet download`.
**Exit:** contact replies, books a meeting, or a deal is created. Also stop if they enrol in Sequence B.
**Goal:** meeting booked.

### A1 · Immediately · "Your {{ product }} spec sheet"

> Hi {{ contact.firstname }},
>
> Here's the {{ product }} spec sheet you asked for: dimensions, electrical, certifications and clearances on one page.
>
> [Open the spec sheet]
>
> Two things people usually ask next:
>
> **Power.** {{ product_power_line }}
> **Space.** {{ product_space_line }}
>
> If you're working on a fit-out and want a CAD block or a dimensioned drawing, reply and I'll send it.
>
> {{ owner.firstname }}
> OneBase

Per-product lines (set by a workflow branch on `primary_equipment_type`, or one email per modality):

| Modality | Power line | Space line |
|---|---|---|
| Ice | The IceVault runs on a dedicated circuit; no water, drains or nitrogen supply. | Allow the footprint plus the monoblock: a Quad needs about 75 × 71 in plus a service gap. |
| Heat | The Yakisugi plugs into a dedicated circuit; no venting or plumbing. | A Quad is 79 × 79 in with 83 in of head height. |
| Light | The LightBed runs on a standard dedicated circuit. The LightZone booth needs 220–240 V, 40 A. | A LightBed is 90 × 51 in and 882 lb; allow room to walk round it. |
| Air | The AirSuite is delivered in four segments and assembled on site. It needs a dedicated supply and water for the air-conditioning system. | A full AirSuite is about 87 × 63 in and 900 kg; check floor loading and door widths. |

### A2 · Day 3 · "Where the {{ product }} fits"

> Hi {{ contact.firstname }},
>
> Most operators who download the spec sheet are working out where the equipment goes and how many people it can serve in a day.
>
> A few numbers that help:
>
> {{ product_throughput_line }}
>
> If it's easier, the planner on our site lays out a recovery room to scale and estimates daily capacity: [Plan your room]
>
> Happy to look at a floor plan if you send one over.
>
> {{ owner.firstname }}

Throughput lines:

| Modality | Line |
|---|---|
| Ice | Sessions run 3–15 minutes at 32–40°F. A Quad can turn over 4 people every 10 minutes with no reset between sessions. |
| Heat | Sessions are typically 20–40 minutes at 135–149°F. The Quad seats four; the Octo seats eight. |
| Light | A LightBed session is 10–20 minutes. Members lie down, close the lid, and the bed runs the programme. |
| Air | An HBOT session is 60–90 minutes. AirSuite can run two people in a session with medical-grade BIBS. |

### A3 · Day 10 · "Worth a 30-minute call?"

> Hi {{ contact.firstname }},
>
> If the {{ product }} is still on the list, a short call is the fastest way to get to a price and a lead time for your site.
>
> We'll cover your space, the right size and configuration, and delivery to {{ contact.country }}.
>
> [Book a call]
>
> If the timing's off, reply with a rough date and I'll come back to you then.
>
> {{ owner.firstname }}

**After A3:** if no response after 14 days, move to the monthly "researching" newsletter list and stop the sequence.

---

## Sequence B · Enquiry follow-up

**Enrol:** form submission where the message contains `Website: Enquiry form`, `Website: Configurator quote` or `Website: Book a call` (booking step 1 without a completed meeting).
**Exit:** contact replies, meeting booked, or deal created.

### B0 · Instant acknowledgement · "We've got your enquiry"

> Hi {{ contact.firstname }},
>
> Thanks for getting in touch about {{ product_or_equipment }}.
>
> Here's what happens next: {{ owner.firstname }} will read your enquiry and reply within one business day with pricing, lead time and any questions about your space.
>
> If you'd rather talk sooner, pick a time here: [Book a call]
>
> OneBase
> Sales: (208) 408-1801

Alongside B0, the workflow creates a **task** for the contact owner: "Reply to website enquiry: {{ contact.company }}", due end of day. If `when_are_you_planning_install` is "Ready now (0–30 days)" or `how_many_locations_do_you_own_or_manage` ≥ 2, the task is set to high priority and a Slack message goes to the sales channel.

### B1 · Day 3, only if the rep hasn't logged a reply · "Following up on {{ contact.company }}"

> Hi {{ contact.firstname }},
>
> Following up on your enquiry about {{ product_or_equipment }}.
>
> To get you an accurate quote we need three things:
>
> 1. Which size or configuration you're considering
> 2. The delivery address, for freight and lead time
> 3. Your rough timeline
>
> Reply with whatever you have and I'll come back with numbers.
>
> {{ owner.firstname }}

### B2 · Day 8, if still no reply · "Quick one"

> Hi {{ contact.firstname }},
>
> I don't want to keep filling your inbox. If {{ product_or_equipment }} is on hold, no problem. Reply "later" and I'll check in next quarter.
>
> If it's still live, here's a 30-minute slot to get it moving: [Book a call]
>
> {{ owner.firstname }}

**After B2:** if no response after 14 days, move to the "researching" list. If they reply "later", set a follow-up task for 90 days.

---

## Workflow logic (HubSpot)

**1. Website lead routing** (contact-based, trigger: form submission "Website capture")
- Set `Lead source` = Website; `Lifecycle stage` = Lead.
- Score: +30 timeline "Ready now", +20 "1–3 months", +10 "3–6 months"; +20 sites ≥ 6, +10 sites 2–5; +15 venue in {Fitness Facilities, Pro Sports Teams & Performance Centers, Luxury & Boutique Hospitality}; −20 "Just researching".
- Assign owner by country: US and Canada → Jett; Australia, NZ and Asia → Andrew (or as agreed); everywhere else → round robin.
- Branch by message content: `Spec sheet download` → enrol Sequence A; `Enquiry form` / `Configurator quote` / `Book a call` → enrol Sequence B.
- If score ≥ 50: task (high priority, due today) + Slack alert.

**2. Meeting booked** (trigger: meeting booked via the HubSpot Meetings link)
- Unenrol from A and B.
- Send confirmation with what to have ready: floor plan or room dimensions, power available, target opening date, how many members or clients per day.
- Reminder email the day before, plus a task for the rep to prepare a quote outline.

**3. Researching list** (static list "Website – researching")
- Monthly email: one case study or install story, one product update, one link to book a call. Stop when they book, reply or a deal opens.

**4. Modality-specific content** (later)
- Once the four modalities each have a case study and a video, split Sequence A's A2 email by modality rather than using the table above.

---

## Before building

- Confirm the two owners and the country split for routing.
- Confirm the sending address (the rep's own address is best for reply rates).
- The links: spec sheet (the site's printable sheet), planner (`/#/guide`), book a call (Jett's meetings link).
- HubSpot needs Marketing Hub Starter or above for the email sequences and Professional for branching workflows. Check which tier the portal is on; if it's Starter, A2/A3 and B1/B2 can run as Sales Hub sequences instead, triggered manually from the task.

---

## Built in HubSpot (26 Sep 2026), all switched off pending review

Emails (Marketing → Email, drafts, sender = contact owner): A1 222861307932 · A2 222861303732 · A3 222861306712 · B0 222855275157 · B1 222861303737 · B2 222861309835 · M1 222861309839 · R (monthly template) 222855284383.

Static list "Website – researching": 1883.

Workflows (Automation → Workflows, search "Website"):
- `[DRAFT] Website · 1 · Lead routing` (1890960711): lead status + lifecycle; ready-now or 2+ sites → Slack #C06LB2UUP47 "call within the hour" + high-priority task due today.
- `[DRAFT] Website · A · Spec-sheet nurture` (1890887047): A1 → 3 d → A2 → 7 d → A3 → 14 d → add to researching list.
- `[DRAFT] Website · B · Enquiry follow-up` (1890887014): B0 + rep task → 3 d → B1 → 5 d → B2 → 14 d → add to researching list.
- `[DRAFT] Website · M · Meeting booked` (1890960687): M1 + prep task. Tighten trigger in the editor to re-enrol on each new booking.

Monthly researching email: clone "Website · R · Monthly" each month, swap the story, send to list 1883. (A recurring send needs Marketing Hub's scheduled email; one clone a month is simpler and keeps each story fresh.)

Site additions (same commit): `/#/roi` calculator (scripts/proto/roi.js, in the nav and on every product page), and case studies at `/#/customers/the-covery`, `/gym-chains` (The Edge + PURE Family Fitness), `/razor-sharp` (infrared + IceVault, contrast suite), `/pro-teams` (scripts/proto/cases.js). Facts only from closed deals; no quotes or performance numbers unless a customer supplies them.

To go live: publish the form and the 8 emails → in A and B set the goal (meeting booked or deal created) and add "contact replied" as an unenrolment → turn on 1, A, B, M. Owner-by-region branch still to add to workflow 1.
