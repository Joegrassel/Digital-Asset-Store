# EmailOctopus Automation Workflow Setup Guide

**Purpose:** Automate email delivery for purchases, lead nurturing, and subscription management.

## Current Setup
- **API Key:** `eo_251f0b442117d9dd01f3e4313c541204445103194005972afb48f404886794b0`
- **List ID:** `68fa4dee-6d87-11f1-8610-b78c32b14f7f`
- **Tags in use:** lead_magnet, beta_launch, Real Estate, Aesthetic Clinic, Boutique Brand

## Workflow 1: Purchase Confirmation + Download Delivery

### Trigger: Tag Added
When a contact is tagged with `paid_real_estate`, `paid_clinic`, `paid_boutique`, or `paid_pro_plan`, this workflow activates.

### Automation Steps:
1. **Wait:** 1 minute (allow for tag propagation)
2. **Condition:** Check which tag was added
3. **Send Email:** Based on tag:

   **Real Estate:** ([View/download kit](https://joegrassel.github.io/Digital-Asset-Store/#/download?product=real-estate))
   ```
   Subject: 🎉 Your Real Estate Starter Kit is Ready!
   
   Hi {{FirstName}},
   
   Thanks for purchasing the Real Estate Starter Kit from SocialStream Studio!
   
   Download your kit here:
   👉 https://joegrassel.github.io/Digital-Asset-Store/#/download?product=real-estate
   
   Your kit includes:
   ✅ "Just Listed" announcement post (1080×1080)
   ✅ Market Update stats infographic (1080×1080)
   ✅ Property Showcase story template (1080×1920)
   ✅ Open House announcement story (1080×1920)
   ✅ LinkedIn brand banner (1584×396)
   ✅ Style guide & color palette
   
   Pro Tip: Ready for more? Upgrade to the Pro Plan for just $19/month and get access to all kits plus monthly content drops!
   👉 https://joegrassel.github.io/Digital-Asset-Store/#/pro-plan
   
   Happy posting,
   The SocialStream Studio Team
   ```

   **Clinic Essentials:**
   ```
   Subject: 🎉 Your Clinic Essentials Kit is Ready!
   
   Hi {{FirstName}},
   
   Thanks for purchasing the Clinic Essentials Kit from SocialStream Studio!
   
   Download your kit here:
   👉 https://joegrassel.github.io/Digital-Asset-Store/#/download?product=aesthetic-clinic
   
   Your kit includes:
   ✅ Treatment Before/After post (1080×1080)
   ✅ Educational ingredient highlight (1080×1080)
   ✅ Special Offer service menu story (1080×1920)
   ✅ Client Testimonial story (1080×1920)
   ✅ Clinic LinkedIn brand banner (1584×396)
   ✅ Style guide & color palette
   
   Happy posting,
   The SocialStream Studio Team
   ```

   **Boutique Brand:**
   ```
   Subject: 🎉 Your Boutique Brand Kit is Ready!
   
   Hi {{FirstName}},
   
   Thanks for purchasing the Boutique Brand Kit from SocialStream Studio!
   
   Download your kit here:
   👉 https://joegrassel.github.io/Digital-Asset-Store/#/download?product=boutique-brand
   
   Your kit includes:
   ✅ Portfolio Showcase gallery post (1080×1080)
   ✅ Transformation before/after post (1080×1080)
   ✅ Behind the Scenes process story (1080×1920)
   ✅ Client Love testimonial story (1080×1920)
   ✅ Boutique LinkedIn brand banner (1584×396)
   ✅ Style guide & color palette
   
   Happy posting,
   The SocialStream Studio Team
   ```

   **Pro Plan:**
   ```
   Subject: 🎉 Welcome to SocialStream Studio Pro!
   
   Hi {{FirstName}},
   
   Thanks for subscribing to the SocialStream Studio Pro Plan!
   
   You now have full access to ALL current kits plus monthly content drops:
   👉 https://joegrassel.github.io/Digital-Asset-Store/#/download?product=pro-plan
   
   Here's what you get:
   ✅ Real Estate Starter Kit
   ✅ Clinic Essentials Kit
   ✅ Boutique Brand Kit
   ✅ Exclusive monthly content drops
   ✅ Priority customization access
   
   Your first monthly drop will arrive on the 1st of next month!
   
   Happy posting,
   The SocialStream Studio Team
   ```

4. **Tag Management:** Remove `lead_magnet` tag (if present), add `customer` tag

---

## Workflow 2: Welcome Sequence (New Lead)

### Trigger: Tag Added
When a contact is tagged with `lead_magnet` (from free guide downloads)

### Automation Steps:

**Email 1 (Immediate): Free Resource Delivery**
```
Subject: Your free guide is inside 📥
Hi {{FirstName}},
Thanks for downloading our guide! Here's your free resource:
[Download page link based on their niche tag]
Looking for more? Check out our full kit for your industry.
```

**Email 2 (3 days later): Value Email**
```
Subject: A quick tip for your {{tags}} content
Hi {{FirstName}},
Here's a quick tip to improve your social media presence... [industry-specific tip]
Brought to you by SocialStream Studio.
```

**Email 3 (7 days later): Kit Offer**
```
Subject: Ready for the full kit?
Hi {{FirstName}},
You downloaded our free guide — now take it to the next level with the full {{niche}} kit.
👉 [Kit purchase link]
Use code WELCOME10 for 10% off!
```

---

## Workflow 3: Monthly Pro Drop

### Trigger: Date-Based
Runs on the 1st of every month.

### Automation Steps:
1. **Filter:** Contacts with `pro_subscriber` or `pro_annual` tag
2. **Send Email:**
```
Subject: 🆕 Your monthly content drop is here!
Hi {{FirstName}},
Here's your exclusive monthly content drop from SocialStream Studio Pro:
[Link to new monthly drop content]
Happy posting!
```

---

## Implementation Notes

To create these workflows in EmailOctopus:
1. Log into your EmailOctopus dashboard at https://emailoctopus.com
2. Go to **Automations** → **Create Automation**
3. Choose **Tag Added** trigger for workflows 1 & 2
4. Choose **Date-Based** trigger for workflow 3
5. Add the email steps following the templates above
6. Test each workflow with a test email address before activating

For tags, the storefront sends:
- `lead_magnet` + niche name (e.g. `Real Estate`) on free guide download
- `paid_real_estate`, `paid_clinic`, `paid_boutique` on kit purchase (via download page email capture)
- `paid_pro_plan` on Pro Plan subscription

**Note:** The "paid_" tags are added by the download page when users enter their email to access their purchase. This is the manual/email verification step since we can't receive Stripe webhooks.