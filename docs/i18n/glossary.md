# Arabic glossary (proposed — for review)

This file is the reference for Meethaq's Arabic UI copy. Every translated string uses these terms. If a term changes here, it changes everywhere.

**Status: DRAFT, awaiting review.** Mark changes inline or in the PR. No strings get translated until this is approved.

- **Language:** Modern Standard Arabic (فصحى), in a clear, neutral business tone. No dialect.
- **Digits:** always Western (0123), per the decision in phase 1.

---

## 1. Style decisions needed

These choices affect every string, so they come first.

| # | Question | Proposal | Alternative |
|---|---|---|---|
| S1 | **Addressing the user.** Arabic imperatives and "you" are gendered (أدخِل / أدخِلي). | Gender-neutral: prefer verbal nouns and passive forms, e.g. button «إرسال» not «أرسِل», hint «إدخال البريد الإلكتروني». Where a direct "you" is unavoidable, use the unvocalized form (عودتك), which reads for both. | Masculine default, which is common in Arabic apps but excludes half the users. |
| S2 | **Buttons and actions** | Verbal noun (مصدر): «حفظ»، «إلغاء»، «تسليم العمل». | Imperative verb: «احفظ»، «ألغِ». |
| S3 | **Status words agree in gender with their noun.** A milestone (مرحلة) is feminine; a project (مشروع) or contract (عقد) is masculine. | Use gender-free phrasing where possible («قيد التنفيذ»، «بانتظار المراجعة»، «تم القبول»). Otherwise give each entity its own agreeing form (see §4). | Masculine forms everywhere, which will read as wrong on milestones. |
| S4 | **Month names** | Egyptian/Gulf set: يناير، فبراير، مارس… (what `Intl` produces for `ar`). | Levantine set: كانون الثاني، شباط، آذار… (more natural in Jordan, Syria, Lebanon). |
| S5 | **Calendar** | Gregorian only. Note: `ar-SA` defaults to the Hijri calendar in `Intl`, so we use the plain `ar` locale. | Show Hijri alongside Gregorian. |
| S6 | **Currency format** | Keep the app's existing format, `$1,500.00`, with Western digits. | Arabic `Intl` style: `1,500.00 US$` (symbol after the number). |
| S7 | **Brand name** | Keep «Meethaq» in Latin script in the logo. In running Arabic text write «ميثاق». | Latin script everywhere. |

---

## 2. Core entities

| English | Proposed Arabic | Plural | Alternatives | Notes |
|---|---|---|---|---|
| Project | مشروع | مشاريع | — | |
| Client | عميل | عملاء | — | |
| Freelancer | مستقل | مستقلون | عامل مستقل، فريلانسر | «مستقل» is the established term on Arabic freelance platforms. |
| Contract | عقد | عقود | — | |
| Agreement | اتفاقية | اتفاقيات | — | Dashboard "Agreements" section. |
| Milestone | مرحلة | مراحل | مرحلة تسليم، دفعة مرحلية | Feminine noun (see S3). |
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

| English | Proposed Arabic | Notes |
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
| Pending | قيد الانتظار |
| Accepted | مقبول |
| Rejected | مرفوض |
| Resolved | تمت التسوية |
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
