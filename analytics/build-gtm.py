"""Builds analytics/gtm-container.json: a GTM web container to import (Admin → Import container → Merge).
Fill the six IDs in the "OB - ..." constant variables after import, then Preview and Publish."""
import json, datetime
A, C = "0", "0"
T = lambda k, v: {"type": "TEMPLATE", "key": k, "value": v}
B = lambda k, v: {"type": "BOOLEAN", "key": k, "value": "true" if v else "false"}
def LIST(k, rows): return {"type": "LIST", "key": k, "list": [{"type": "MAP", "map": [T(a, b) for a, b in r.items()]} for r in rows]}
V, TR, TG = [], [], []
def var_const(name, val): V.append({"accountId": A, "containerId": C, "variableId": str(len(V)+1), "name": name, "type": "c", "parameter": [T("value", val)]})
def var_dl(name, key): V.append({"accountId": A, "containerId": C, "variableId": str(len(V)+1), "name": name, "type": "v", "parameter": [B("setDefaultValue", False), T("name", key), {"type": "INTEGER", "key": "dataLayerVersion", "value": "2"}]})
def trig(name, event, regex=False):
    tid = str(100 + len(TR)); TR.append({"accountId": A, "containerId": C, "triggerId": tid, "name": name, "type": "CUSTOM_EVENT",
        "customEventFilter": [{"type": "MATCH_REGEX" if regex else "EQUALS", "parameter": [T("arg0", "{{_event}}"), T("arg1", event)]}]}); return tid
def consent(*types):
    if not types: return {"consentStatus": "NOT_NEEDED"}
    return {"consentStatus": "NEEDED", "consentType": {"type": "LIST", "list": [{"type": "TEMPLATE", "value": t} for t in types]}}
def tag(name, typ, params, triggers, cons=(), once=False):
    TG.append({"accountId": A, "containerId": C, "tagId": str(len(TG)+1), "name": name, "type": typ, "parameter": params,
               "firingTriggerId": triggers, "tagFiringOption": "ONCE_PER_LOAD" if once else "ONCE_PER_EVENT", "consentSettings": consent(*cons)})
ALL_PAGES, INIT = "2147479553", "2147479573"

# IDs to fill in after import
var_const("OB - GA4 Measurement ID", "G-XXXXXXXXXX")
var_const("OB - Google Ads ID", "AW-XXXXXXXXXX")
var_const("OB - Google Ads label - Lead", "XXXXXXXXXXXXXXXXXXX")
var_const("OB - Google Ads label - Meeting booked", "XXXXXXXXXXXXXXXXXXX")
var_const("OB - LinkedIn Partner ID", "0000000")
var_const("OB - LinkedIn conversion ID - Lead", "00000000")
var_const("OB - Meta Pixel ID", "000000000000000")
var_const("OB - Clarity Project ID", "xxxxxxxxxx")
# dataLayer fields the site pushes
for k in ["page_path", "page_title", "page_location", "page_type", "product_id", "product_name", "modality", "capture_type",
          "venue_type", "timeline", "sites", "role", "viewer", "action", "percent", "configuration", "link_url"]:
    var_dl("DL - " + k, k)

LEADS = "book_call_details|enquiry_submit|spec_sheet_download|configurator_quote|meeting_booked"
ENG = "product_view|book_call_open|configurator_complete|viewer_interact|spec_sheet_open|phone_click|email_click|outbound_click|scroll_depth"
t_pv = trig("CE - virtual_page_view", "virtual_page_view")
t_lead = trig("CE - Lead (any capture)", f"^({LEADS})$", True)
t_meet = trig("CE - meeting_booked", "meeting_booked")
t_eng = trig("CE - Engagement", f"^({ENG})$", True)
t_book = trig("CE - book_call_open", "book_call_open")

# GA4
tag("GA4 - Google tag", "googtag", [T("tagId", "{{OB - GA4 Measurement ID}}"),
    LIST("configSettingsTable", [{"parameter": "send_page_view", "parameterValue": "false"}])], [INIT])
ev_params = [{"parameter": k, "parameterValue": "{{DL - %s}}" % k} for k in
             ["page_path", "page_type", "product_id", "modality", "capture_type", "venue_type", "timeline", "sites", "role", "viewer", "action", "percent", "link_url"]]
tag("GA4 - page_view", "gaawe", [T("eventName", "page_view"), T("measurementIdOverride", "{{OB - GA4 Measurement ID}}"),
    LIST("eventSettingsTable", [{"parameter": "page_location", "parameterValue": "{{DL - page_location}}"},
                                {"parameter": "page_title", "parameterValue": "{{DL - page_title}}"},
                                {"parameter": "page_path", "parameterValue": "{{DL - page_path}}"},
                                {"parameter": "page_type", "parameterValue": "{{DL - page_type}}"}])], [t_pv], ("analytics_storage",))
tag("GA4 - Lead events", "gaawe", [T("eventName", "{{Event}}"), T("measurementIdOverride", "{{OB - GA4 Measurement ID}}"), LIST("eventSettingsTable", ev_params)], [t_lead], ("analytics_storage",))
tag("GA4 - generate_lead", "gaawe", [T("eventName", "generate_lead"), T("measurementIdOverride", "{{OB - GA4 Measurement ID}}"),
    LIST("eventSettingsTable", [{"parameter": "lead_source", "parameterValue": "{{DL - capture_type}}"}] + ev_params[2:4])], [t_lead], ("analytics_storage",))
tag("GA4 - Engagement events", "gaawe", [T("eventName", "{{Event}}"), T("measurementIdOverride", "{{OB - GA4 Measurement ID}}"), LIST("eventSettingsTable", ev_params)], [t_eng], ("analytics_storage",))

# Google Ads
tag("Ads - Conversion linker", "gclidw", [B("enableCrossDomain", False), B("enableUrlPassthrough", True)], [ALL_PAGES], ("ad_storage",))
tag("Ads - Remarketing", "sp", [T("conversionId", "{{OB - Google Ads ID}}"), B("enableDynamicRemarketing", False)], [t_pv], ("ad_storage",))
tag("Ads - Conversion - Lead", "awct", [T("conversionId", "{{OB - Google Ads ID}}"), T("conversionLabel", "{{OB - Google Ads label - Lead}}")], [t_lead], ("ad_storage",))
tag("Ads - Conversion - Meeting booked", "awct", [T("conversionId", "{{OB - Google Ads ID}}"), T("conversionLabel", "{{OB - Google Ads label - Meeting booked}}")], [t_meet], ("ad_storage",))

# LinkedIn Insight
LI = """<script type="text/javascript">
_linkedin_partner_id = "{{OB - LinkedIn Partner ID}}";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}
var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;
b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s);})(window.lintrk);
</script>"""
tag("LinkedIn - Insight tag", "html", [T("html", LI), B("supportDocumentWrite", False)], [ALL_PAGES], ("ad_storage",), once=True)
tag("LinkedIn - Page view", "html", [T("html", '<script>window.lintrk && window.lintrk("track");</script>'), B("supportDocumentWrite", False)], [t_pv], ("ad_storage",))
tag("LinkedIn - Conversion - Lead", "html", [T("html", '<script>window.lintrk && window.lintrk("track", { conversion_id: {{OB - LinkedIn conversion ID - Lead}} });</script>'), B("supportDocumentWrite", False)], [t_lead], ("ad_storage",))

# Meta Pixel
META = """<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '{{OB - Meta Pixel ID}}');
</script>"""
tag("Meta - Pixel base", "html", [T("html", META), B("supportDocumentWrite", False)], [ALL_PAGES], ("ad_storage",), once=True)
tag("Meta - PageView", "html", [T("html", "<script>window.fbq && fbq('track', 'PageView');</script>"), B("supportDocumentWrite", False)], [t_pv], ("ad_storage",))
tag("Meta - Lead", "html", [T("html", "<script>window.fbq && fbq('track', 'Lead', { content_category: '{{DL - capture_type}}', content_name: '{{DL - product_id}}' });</script>"), B("supportDocumentWrite", False)], [t_lead], ("ad_storage",))
tag("Meta - Schedule (meeting booked)", "html", [T("html", "<script>window.fbq && fbq('track', 'Schedule');</script>"), B("supportDocumentWrite", False)], [t_meet], ("ad_storage",))
tag("Meta - ViewContent (product)", "html", [T("html", "<script>if (window.fbq && '{{Event}}' === 'product_view') fbq('track', 'ViewContent', { content_ids: ['{{DL - product_id}}'], content_type: 'product', content_category: '{{DL - modality}}' });</script>"), B("supportDocumentWrite", False)], [t_eng], ("ad_storage",))

# Microsoft Clarity (heatmaps, recordings)
CL = """<script type="text/javascript">
(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "{{OB - Clarity Project ID}}");
</script>"""
tag("Clarity - Base", "html", [T("html", CL), B("supportDocumentWrite", False)], [ALL_PAGES], ("analytics_storage",), once=True)
tag("Clarity - Lead tag", "html", [T("html", "<script>window.clarity && clarity('set', 'lead', '{{DL - capture_type}}');</script>"), B("supportDocumentWrite", False)], [t_lead], ("analytics_storage",))

BI = [{"accountId": A, "containerId": C, "type": t, "name": n} for t, n in
      [("PAGE_URL", "Page URL"), ("PAGE_HOSTNAME", "Page Hostname"), ("PAGE_PATH", "Page Path"), ("REFERRER", "Referrer"), ("EVENT", "Event")]]
out = {"exportFormatVersion": 2, "exportTime": datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
       "containerVersion": {"path": "accounts/0/containers/0/versions/0", "accountId": A, "containerId": C, "containerVersionId": "0",
           "name": "OneBase website analytics", "description": "GA4, Google Ads, LinkedIn, Meta, Clarity. Driven by dataLayer events from scripts/proto/analytics.js.",
           "container": {"path": "accounts/0/containers/0", "accountId": A, "containerId": C, "name": "onebasehealth.com", "publicId": "GTM-T433HTQJ", "usageContext": ["WEB"]},
           "tag": TG, "trigger": TR, "variable": V, "builtInVariable": BI}}
json.dump(out, open("analytics/gtm-container.json", "w"), indent=2)
print(len(TG), "tags", len(TR), "triggers", len(V), "variables")
