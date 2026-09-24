# Arabic glossary

This file is the reference for Meethaq's Arabic UI copy. Every translated string uses these terms. If a term changes here, it changes everywhere.

**Status: APPROVED (2026-09-24).** Propose changes in a PR that updates this file first.

- **Language:** Modern Standard Arabic (فصحى), in a clear, neutral business tone. No dialect.
- **Digits:** always Western (0123), per the decision in phase 1.

---

## 1. Style rules

These apply to every string.

| # | Rule | Example |
|---|---|---|
| S1 | **Gender-neutral address.** Use verbal nouns and passive phrasing. Never use slash forms like «أدخل/ي». If neutral wording reads awkwardly, rephrase the whole sentence. Never fall back to the masculine. | «إدخال البريد الإلكتروني» rather than «أدخل بريدك»; «تم حفظ التغييرات» rather than «حفظتَ التغييرات». |
| S2 | **Buttons and actions use verbal nouns (مصدر).** | «حفظ»، «إلغاء»، «إرسال»، «تسليم العمل». |
| S3 | **Status words agree with their noun.** Use gender-free phrasing where possible; otherwise use the per-entity forms in §4 (milestone is feminine; project, contract and dispute are masculine). | «قيد التنفيذ»، «بانتظار المراجعة»؛ مرحلة «مدفوعة» / مشروع «مكتمل». |
| S4 | **Month names:** the Egyptian/Gulf set. Dates use the plain `ar` locale with `numberingSystem: "latn"`. | يناير، فبراير، مارس… |
| S5 | **Calendar:** Gregorian only. Every date format sets `calendar: "gregory"` explicitly, so it never depends on the locale (`ar-SA` would default to Hijri). | |
| S6 | **Currency:** `$1,500.00` in both languages, always Western digits. Inside Arabic sentences, wrap amounts in `<bdi>` or an LTR isolate (U+2066 … U+2069) so the `$` stays in place. | «إجمالي <bdi>$1,500.00</bdi> خلال 6 أشهر» |
| S7 | **Brand:** «Meethaq» (Latin) in the logo; «ميثاق» in Arabic sentences. | |
| S8 | **«مرحلة» means milestone only.** Steps anywhere else (onboarding, forms, wizards) are «خطوة». | «الخطوة 2 من 4»، never «المرحلة 2 من 4». |

---

## 2. Core entities

| English | Arabic | Plural | Alternatives | Notes |
|---|---|---|---|---|
| Project | مشروع | مشاريع | — | |
| Client | عميل | عملاء | — | |
| Freelancer | مستقل | مستقلون | عامل مستقل، فريلانسر | «مستقل» is the established term on Arabic freelance platforms. |
| Contract | عقد | عقود | — | |
| Agreement | اتفاقية | اتفاقيات | — | Dashboard "Agreements" section. |
| Milestone | مرحلة | مراحل | — | Feminine noun (S3). Reserved for milestones only (S8). |
| Deliverable | مُخرَج | مُخرَجات | تسليم | The work product itself. |
| Submission | تسليم | تسليمات | — | The act or record of handing in work. "Version 2" → «الإصدار 2». |
| Revision (of a submission) | تعديلات | — | مراجعة | "Request Revision" → «طلب تعديلات». |
| Change Request | طلب تغيير | طلبات تغيير | — | Proposes changes to scope, milestones or value. |
| Amendment (to a contract) | ملحق العقد | ملاحق | تعديل العقد | Deliberately **not** «تعديل», to keep it distinct from Revision. "Amendment #3" → «الملحق رقم 3». |
| Scope (of work) | نطاق العمل | — | — | |
| Dispute | نزاع | نزاعات | خلاف | |
| Evidence (dispute) | أدلة | — | إثباتات | |
| Evidence (payment) | إثبات الدفع | — | — | Kept distinct from dispute evidence. |
| Resolution (of a dispute) | تسوية | تسويات | حل | "Requested Resolution" → «التسوية المطلوبة»; "Proposed resolution" → «التسوية المقترحة». |
| Dispute hold (money) | مبلغ محتجز بسبب نزاع | — | معلّق بسبب نزاع | Short label: «محتجز». |
| Payment | دفعة | دفعات | — | "Payments" tab → «المدفوعات». |
| Invoice | فاتورة | فواتير | — | Not in the UI yet; listed for consistency. |
| Receipt | إيصال | إيصالات | — | |
| Transaction reference | الرقم المرجعي للعملية | — | رقم الحوالة | |
| Payment method | طريقة الدفع | — | — | |
| Bank transfer | تحويل بنكي | — | حوالة بنكية | |
| Cash | نقدًا | — | — | |
| Invitation | دعوة | دعوات | — | |
| Workspace | مساحة العمل | — | — | Contract and milestone workspaces. |
| Activity (log) | سجل النشاط | — | — | |
| Notification | إشعار | إشعارات | تنبيه | |
| Attachment | مرفق | مرفقات | — | |
| Delivery link | رابط التسليم | روابط التسليم | — | |
| Chat | المحادثة | — | الرسائل | |
| Dashboard | لوحة التحكم | — | الرئيسية | |
| Profile | الملف الشخصي | — | — | |

---

## 3. Money and time

| English | Arabic | Notes |
|---|---|---|
| Amount | المبلغ | |
| Budget | الميزانية | |
| Agreed amount | المبلغ المتفق عليه | |
| Approved value | القيمة المعتمدة | |
| Total paid / Total unpaid | إجمالي المدفوع / إجمالي غير المدفوع | |
| Income | الدخل | "Income Trend" → «اتجاه الدخل». |
| Due date | تاريخ الاستحقاق | |
| Deadline | الموعد النهائي | |
| Start date / End date | تاريخ البدء / تاريخ الانتهاء | |
| Overdue | متأخر / متأخرة | Agrees with the noun (S3). |
| Step (onboarding, forms, wizards) | خطوة / خطوات | Never «مرحلة» (S8). |
| Next 7 / 30 days | خلال الأيام السبعة القادمة / خلال 30 يومًا القادمة | Plural forms are handled by ICU messages. |
| 6 / 12 months | 6 أشهر / 12 شهرًا | Arabic counts take different noun forms (3–10 plural, 11+ singular accusative). ICU `plural` covers this. |

---

## 4. Statuses

Gender-free phrasing is used where possible. Where a status must agree, the form is given per entity.

**Project** (masculine)

| English | Arabic |
|---|---|
| Draft | مسودة |
| Active | نشط |
| Completed | مكتمل |
| Cancelled | ملغى |

**Contract** (masculine)

| English | Arabic |
|---|---|
| No Contract | لا يوجد عقد |
| Draft | مسودة |
| Pending Approval | بانتظار الموافقة |
| Changes Requested | طُلبت تعديلات |
| Approved | معتمد |

**Milestone execution** (feminine)

| English | Arabic |
|---|---|
| Not Started | لم تبدأ |
| In Progress | قيد التنفيذ |
| Submitted | تم التسليم |
| Awaiting Review | بانتظار المراجعة |
| Revision Requested | طُلبت تعديلات |
| Accepted | تم القبول |

**Milestone payment** (feminine)

| English | Arabic |
|---|---|
| Not Eligible | غير مستحقة بعد |
| Eligible | مستحقة الدفع |
| Awaiting Confirmation | بانتظار التأكيد |
| Paid | مدفوعة |
| Issue Reported | تم الإبلاغ عن مشكلة |

**Dispute** (masculine)

| English | Arabic |
|---|---|
| Open | مفتوح |
| Resolution Proposed | تم اقتراح تسوية |
| Resolved | تمت التسوية |
| Withdrawn | تم السحب |

**Dispute proposal and change request** (gender-free, S3)

| English | Arabic |
|---|---|
| Draft | مسودة |
| Pending / Pending Approval | قيد الانتظار / بانتظار الموافقة |
| Accepted / Approved | تم القبول / تمت الموافقة |
| Rejected | تم الرفض |
| Withdrawn | تم السحب |

**Dispute categories**

| English | Arabic |
|---|---|
| Deliverable Quality | جودة المُخرَجات |
| Scope Disagreement | خلاف على نطاق العمل |
| Missed Deadline | تجاوز الموعد النهائي |
| Acceptance Disagreement | خلاف على القبول |
| Payment Issue | مشكلة في الدفع |
| Other | أخرى |

---

## 5. Actions (buttons, verbal-noun style per S2)

| English | Arabic |
|---|---|
| Save / Save Changes | حفظ / حفظ التغييرات |
| Cancel | إلغاء |
| Edit | تعديل |
| Delete | حذف |
| Submit work | تسليم العمل |
| Send for approval | إرسال للموافقة |
| Approve (contract) | اعتماد |
| Accept (submission) | قبول |
| Request changes / revision | طلب تعديلات |
| Reject | رفض |
| Withdraw | سحب |
| Remind | تذكير |
| Record payment | تسجيل دفعة |
| Confirm receipt | تأكيد الاستلام |
| Report an issue | الإبلاغ عن مشكلة |
| Open a dispute | فتح نزاع |
| Add client / Add project | إضافة عميل / إضافة مشروع |
| View all | عرض الكل |
| Try again | إعادة المحاولة |
| Sign in / Sign up / Log out | تسجيل الدخول / إنشاء حساب / تسجيل الخروج |

---

## 6. Roles and people

| English | Arabic | Notes |
|---|---|---|
| Freelancer (role label) | مستقل | |
| Client (role label) | عميل | |
| Counterparty | الطرف الآخر | Generic "other side" in shared views. |
