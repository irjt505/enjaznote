export const d = {
  /** Login page */
  login: {
    title: 'لوحة التحكم',
    subtitle: 'تسجيل الدخول إلى نظام الإدارة',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'admin@example.com',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: '••••••••',
    submit: 'دخول',
    loading: 'جاري التحميل...',
    invalidCredentials: 'بيانات الدخول غير صحيحة',
  },

  /** Sidebar */
  sidebar: {
    dashboard: 'لوحة التحكم',
    stats: 'الإحصائيات',
    reviews: 'التقييمات',
    orders: 'الطلبات',
    newsletter: 'النشرات البريدية',
    logout: 'تسجيل خروج',
  },

  /** Greeting */
  greeting: {
    morning: 'صباح الخير',
    evening: 'مساء الخير',
  },

  /** Tab headers */
  tabs: {
    overview: 'نظرة عامة',
    manageReviews: 'إدارة التقييمات',
    manageOrders: 'إدارة الطلبات',
    manageNewsletter: 'النشرات البريدية',
  },

  /** Quick actions */
  quickActions: {
    site: 'الموقع',
    reviews: 'التقييمات',
    orders: 'الطلبات',
  },

  /** Stat cards */
  stats: {
    reviews: 'التقييمات',
    pending: 'معلقة',
    orders: 'الطلبات',
    rating: 'التقييم',
    activityReviews: 'نشاط التقييمات',
    activityOrders: 'نشاط الطلبات',
    last14Days: 'آخر 14 يوم',
  },

  /** Reviews tab */
  reviews: {
    awaitingApproval: 'في انتظار الموافقة',
    approveAll: (n: number) => `قبول الكل (${n})`,
    allReviews: 'جميع التقييمات',
    deleteAll: 'حذف الكل',
    filterAll: 'الكل',
    filterPending: 'معلقة',
    filterApproved: 'مقبولة',
    empty: 'لا توجد تقييمات بعد',
    approve: 'قبول',
    reject: 'رفض',
    delete: 'حذف',
    approveSuccess: 'تم قبول التقييم بنجاح',
    approveError: 'فشل في الموافقة على التقييم',
    deleteSuccess: 'تم حذف التقييم',
    deleteError: 'فشل في حذف التقييم',
    approveAllSuccess: (n: number) => `تم قبول ${n} تقييم`,
    approveAllError: 'فشل في قبول التقييمات',
    deleteAllSuccess: 'تم حذف جميع التقييمات',
    deleteAllError: 'فشل في حذف التقييمات',
    confirmDeleteOne: 'هل أنت متأكد من حذف هذا التقييم؟',
    confirmDeleteAll: 'هل أنت متأكد من حذف جميع التقييمات؟',
    filterLabel: 'فلترة التقييمات',
  },

  /** Orders tab */
  orders: {
    allOrders: 'جميع الطلبات',
    filterAll: 'الكل',
    filterToday: 'اليوم',
    filterWeek: 'آخر أسبوع',
    empty: 'لا توجد طلبات بعد',
    deleteTitle: 'حذف',
    deleteConfirm: 'هل أنت متأكد من حذف هذا الطلب؟',
    deleteSuccess: 'تم حذف الطلب',
    deleteError: 'فشل في حذف الطلب',
    filterLabel: 'فلترة الطلبات',
  },

  /** Newsletter tab */
  newsletter: {
    subscribers: 'المشتركين',
    sentCount: 'النشرات المرسلة',
    totalSent: 'إجمالي المرسلات',
    newNewsletter: 'نشرة جديدة',
    edit: 'تعديل',
    preview: 'معاينة',
    subjectPlaceholder: 'عنوان النشرة',
    contentPlaceholder: 'اكتب محتوى النشرة هنا... يستخدم **النص العريض**، - للقوائم، والروابط تتحول تلقائيًا',
    hintBold: '**نص عريض**',
    hintList: '- قائمة',
    hintLink: 'https:// رابط تلقائي',
    hintParagraph: 'سطر فارغ = فقرة جديدة',
    emptySubscribers: 'لا يوجد مشتركين بعد',
    noHistory: 'لم ترسل أي نشرة بعد',
    sending: 'جارٍ الإرسال...',
    sendTo: (n: number) => `إرسال إلى ${n}`,
    sentTo: (n: number, date: string) => `أُرسلت إلى ${n} مشترك في ${date}`,
    reuseTitle: 'إعادة الاستخدام',
    confirmSend: (subject: string, n: number) => `تأكيد إرسال النشرة "${subject}" إلى ${n} مشترك؟`,
    sendSuccess: (sent: number, failed: number) => `تم الإرسال: ${sent} بنجاح، ${failed} فشل`,
    sendError: 'فشل الإرسال',
    connectionError: 'خطأ في الاتصال',
  },

  /** Shared */
  shared: {
    confirm: 'تأكيد',
    cancel: 'إلغاء',
    userLabel: 'مستخدم',
    searchPlaceholder: 'بحث...',
    loading: 'جاري تحميل البيانات...',
    fetchError: 'تعذر تحميل البيانات — سيتم إعادة المحاولة تلقائياً',
  },

  /** Pagination */
  pagination: {
    prev: 'السابق',
    next: 'التالي',
    page: (n: number) => `صفحة ${n}`,
    showing: (from: number, to: number, total: number) => `${from}-${to} من ${total}`,
  },

  /** Modal */
  modal: {
    confirmLabel: 'تأكيد',
    cancelLabel: 'إلغاء',
  },

  /** SEO tab */
  seo: {
    heading: 'تحسين محركات البحث',
    totalPages: 'إجمالي الصفحات',
    withTitle: 'بعنوان مخصص',
    withoutTitle: 'بلا عنوان',
    withoutDescription: 'بلا وصف',
    withoutKeywords: 'بلا كلمات مفتاحية',
    pagePathPlaceholder: 'مسار الصفحة (مثال: /services/digital/ecommerce)',
    addPage: 'إضافة صفحة',
    adding: 'جارٍ الإضافة...',
    searchPlaceholder: 'بحث في المسار أو العنوان...',
    save: 'حفظ',
    saving: 'جارٍ الحفظ...',
    deleteConfirm: 'هل أنت متأكد من حذف إعدادات SEO لهذه الصفحة؟',
    deleteSuccess: 'تم حذف الصفحة',
    deleteError: 'فشل الحذف',
    saveSuccess: 'تم الحفظ',
    saveError: 'فشل الحفظ',
    addSuccess: 'تمت إضافة الصفحة',
    addError: 'فشلت الإضافة',
    labelTitle: 'العنوان',
    labelDescription: 'الوصف',
    labelKeywords: 'الكلمات المفتاحية',
    titlePlaceholder: 'عنوان meta — بدون اسم الموقع',
    descriptionPlaceholder: 'وصف meta لنتائج البحث',
    keywordsPlaceholder: 'كلمة1, كلمة2, كلمة3',
    titleLength: (n: number) => `${n} محرف`,
    titleTooLong: 'أفضل: 50-60 محرف',
    descTooLong: 'أفضل: 150-160 محرف',
    noResults: 'لا توجد نتائج',
    previewTitle: 'معاينة في البحث',
    deleteTooltip: 'حذف',
    saveBtn: 'حفظ',
    savingBtn: 'جارٍ الحفظ...',
    keywordsAddPlaceholder: 'اكتب كلمة مفتاحية واضغط Enter',
    keywordsCount: (n: number) => `${n} كلمة مفتاحية`,
  },
}
