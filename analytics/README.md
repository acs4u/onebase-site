# Website analytics

The site pushes events to Google Tag Manager (`GTM-T433HTQJ`, set in `scripts/proto/analytics.js`). Every marketing tool runs as a tag inside GTM, so tools can be added or removed without touching site code.

## Set up (about 30 minutes)

1. **Create the accounts and copy their IDs**
   - GA4: property → Data stream → Measurement ID (`G-…`)
   - Google Ads: Goals → Conversions → create "Website lead" and "Meeting booked" → Tag setup → Google Tag Manager → Conversion ID (`AW-…`) and each Conversion label
   - LinkedIn Campaign Manager: Analyze → Insight Tag → Partner ID; Conversions → create "Website lead" (event-specific, JavaScript) → Conversion ID
   - Meta Events Manager: Data sources → Pixel ID
   - Microsoft Clarity: new project → Settings → Project ID
2. **Import the container**: GTM → Admin → Import container → `gtm-container.json` → existing workspace → **Merge**, rename conflicting.
3. **Fill in the IDs**: Variables → the eight `OB - …` constants.
4. **Consent**: HubSpot → Settings → Privacy & consent → Cookies → turn on the banner for the new domain, with Analytics and Advertisement categories.
5. **Preview** in GTM on the live site, click through a product page and the booking form, check each tag fires once. Then **Publish**.
6. **GA4**: Admin → Events → mark `generate_lead` and `meeting_booked` as key events. Link Google Ads and Search Console.

To change the container, edit `build-gtm.py` and run `python3 analytics/build-gtm.py`.

## Events the site sends

| Event | When | Lead |
|---|---|---|
| `virtual_page_view` | Every page change (the site uses real URLs; the preview uses hash routes) | |
| `product_view` | Product page opened | |
| `book_call_open` | Any "Book a call" / sales CTA | |
| `book_call_details` | Booking step 1 with an email | ✓ |
| `meeting_booked` | HubSpot Meetings confirms the booking | ✓ |
| `enquiry_submit` | Enquiry form sent | ✓ |
| `configurator_quote` | Enquiry sent with a configurator build | ✓ |
| `spec_sheet_download` | Spec sheet form sent | ✓ |
| `configurator_complete` | "Get pricing for this build" clicked | |
| `viewer_interact` | 3D model rotated, LightZone turned or door opened | |
| `spec_sheet_open`, `phone_click`, `email_click`, `outbound_click` | As named | |
| `scroll_depth` | 50% and 90% of a page | |

Parameters: `page_path`, `page_type`, `product_id`, `modality`, `capture_type`, `venue_type`, `timeline`, `sites`, `role`. No email, name or phone is ever pushed.

## Consent

Google Consent Mode v2. Denied by default in the EEA, UK and Switzerland; granted elsewhere. The HubSpot cookie banner updates it. Analytics tags (GA4, Clarity) need `analytics_storage`; ad tags (Google Ads, LinkedIn, Meta) need `ad_storage`.
