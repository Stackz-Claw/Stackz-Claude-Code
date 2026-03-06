# LAUNCH CHECKLIST
*Run by: sprint | Signed off by: founder | Nothing ships until this is complete*

---

## VENTURE: [name]
**Target Launch Date:**  
**Checklist run by:** sprint  
**Final sign-off:** founder  

---

## PRODUCT

- [ ] Core user flow works end-to-end without errors
- [ ] All MVP features defined in proposal are shipped
- [ ] Mobile responsive (test on iOS + Android viewport)
- [ ] Load time < 3 seconds on standard connection
- [ ] Error states handled gracefully (no blank pages, no raw error messages)
- [ ] `tester` has run full regression suite and signed off

---

## PAYMENTS & REVENUE

- [ ] Stripe (or equivalent) integration is live and tested
- [ ] Test payment processed and refunded successfully
- [ ] Pricing page displays correctly and is accurate
- [ ] Subscription/billing emails configured
- [ ] Failed payment handling is active
- [ ] `cashflow` has confirmed revenue tracking is live

---

## INFRASTRUCTURE

- [ ] Deployed to production environment (not staging)
- [ ] Custom domain live and SSL active
- [ ] Health check endpoint returning 200
- [ ] Uptime monitoring configured (`devops`)
- [ ] Error logging active (not just local console)
- [ ] Database backups configured
- [ ] `devops` has confirmed all infrastructure checks

---

## DESIGN & BRAND

- [ ] Logo and brand assets consistent with brand guide
- [ ] Landing page copy reviewed by `ghost`
- [ ] All images optimized (no uncompressed 5MB PNGs)
- [ ] `brand-guard` has reviewed all public-facing pages
- [ ] Favicon set

---

## LEGAL & COMPLIANCE

- [ ] Privacy policy live and linked
- [ ] Terms of service live and linked
- [ ] Cookie consent (if applicable to region)
- [ ] GDPR/CCPA data handling confirmed (if serving EU/CA users)

---

## MARKETING

- [ ] Launch content created and scheduled (`ghost` + `scheduler`)
- [ ] Social accounts set up if needed
- [ ] Email sequence for new signups ready
- [ ] First 10 outreach targets identified
- [ ] `megaphone` has reviewed and approved launch plan

---

## SUPPORT

- [ ] Support contact method is live (email, chat, or form)
- [ ] FAQ page or help docs exist for at least top 5 questions
- [ ] `retention` has customer onboarding sequence ready

---

## INTERNAL

- [ ] `METRICS.md` in venture folder is configured with baseline KPIs
- [ ] Venture registered in `finance/ledger/transactions.json`
- [ ] Venture status updated in `startup/ventures/[slug]/STATUS.md` to `launched`
- [ ] Stackz notified of launch

---

## SIGN-OFF

| Role | Agent | Sign-off Date |
|------|-------|---------------|
| Sprint Manager | sprint | |
| Dev Lead | forge | |
| QA | tester | |
| Finance | cashflow | |
| Marketing | megaphone | |
| **Execution Lead** | **founder** | |

**LAUNCH APPROVED:** [ ] YES — [ ] NO (items outstanding: list below)

Outstanding items blocking launch:
-
