export interface LanguageItem {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const POPULAR_100_LANGUAGES: LanguageItem[] = [
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "简体中文", flag: "🇨🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "jv", name: "Javanese", nativeName: "Basa Jawa", flag: "🇮🇩" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "su", name: "Sundanese", nativeName: "Basa Sunda", flag: "🇮🇩" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦" },
  { code: "fa", name: "Persian", nativeName: "فارسی", flag: "🇮🇷" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "my", name: "Burmese", nativeName: "မြန်မာစာ", flag: "🇲🇲" },
  { code: "tl", name: "Tagalog (Filipino)", nativeName: "Filipino", flag: "🇵🇭" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷" },
  { code: "cs", name: "Czech", nativeName: "Čeština", flag: "🇨🇿" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  { code: "ro", name: "Romanian", nativeName: "Română", flag: "🇷🇴" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", flag: "🇭🇺" },
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱" },
  { code: "da", name: "Danish", nativeName: "Dansk", flag: "🇩🇰" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", flag: "🇫🇮" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina", flag: "🇸🇰" },
  { code: "bg", name: "Bulgarian", nativeName: "Български", flag: "🇧🇬" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski", flag: "🇭🇷" },
  { code: "sr", name: "Serbian", nativeName: "Српски", flag: "🇷🇸" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių", flag: "🇱🇹" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina", flag: "🇸🇮" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu", flag: "🇱🇻" },
  { code: "et", name: "Estonian", nativeName: "Eesti", flag: "🇪🇪" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", flag: "🇪🇹" },
  { code: "az", name: "Azerbaijani", nativeName: "Azərbaycan", flag: "🇦🇿" },
  { code: "uz", name: "Uzbek", nativeName: "Oʻzbekcha", flag: "🇺🇿" },
  { code: "kk", name: "Kazakh", nativeName: "Қазақша", flag: "🇰🇿" },
  { code: "hy", name: "Armenian", nativeName: "Հայերեն", flag: "🇦🇲" },
  { code: "ka", name: "Georgian", nativeName: "ქართული", flag: "🇬🇪" },
  { code: "mn", name: "Mongolian", nativeName: "Монгол", flag: "🇲🇳" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", flag: "🇳🇵" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල", flag: "🇱🇰" },
  { code: "km", name: "Khmer", nativeName: "ខ្មែរ", flag: "🇰🇭" },
  { code: "lo", name: "Lao", nativeName: "ລາວ", flag: "🇱🇦" },
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans", flag: "🇿🇦" },
  { code: "sq", name: "Albanian", nativeName: "Shqip", flag: "🇦🇱" },
  { code: "bs", name: "Bosnian", nativeName: "Bosanski", flag: "🇧🇦" },
  { code: "ca", name: "Catalan", nativeName: "Català", flag: "🇪🇸" },
  { code: "cy", name: "Welsh", nativeName: "Cymraeg", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  { code: "eu", name: "Basque", nativeName: "Euskara", flag: "🇪🇸" },
  { code: "gl", name: "Galician", nativeName: "Galego", flag: "🇪🇸" },
  { code: "is", name: "Icelandic", nativeName: "Íslenska", flag: "🇮🇸" },
  { code: "ga", name: "Irish", nativeName: "Gaeilge", flag: "🇮🇪" },
  { code: "mk", name: "Macedonian", nativeName: "Македонски", flag: "🇲🇰" },
  { code: "mt", name: "Maltese", nativeName: "Malti", flag: "🇲🇹" },
  { code: "be", name: "Belarusian", nativeName: "Беларуская", flag: "🇧🇾" },
  { code: "tg", name: "Tajik", nativeName: "Тоҷикӣ", flag: "🇹🇯" },
  { code: "tk", name: "Turkmen", nativeName: "Türkmençe", flag: "🇹🇲" },
  { code: "ky", name: "Kyrgyz", nativeName: "Кыргызча", flag: "🇰🇬" },
  { code: "ps", name: "Pashto", nativeName: "پښتو", flag: "🇦🇫" },
  { code: "ku", name: "Kurdish", nativeName: "Kurdî", flag: "🇮🇶" },
  { code: "sd", name: "Sindhi", nativeName: "سنڌي", flag: "🇵🇰" },
  { code: "so", name: "Somali", nativeName: "Soomaali", flag: "🇸🇴" },
  { code: "ha", name: "Hausa", nativeName: "Hausa", flag: "🇳🇬" },
  { code: "yo", name: "Yoruba", nativeName: "Èdè Yorùbá", flag: "🇳🇬" },
  { code: "ig", name: "Igbo", nativeName: "Asụsụ Igbo", flag: "🇳🇬" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu", flag: "🇿🇦" },
  { code: "xh", name: "Xhosa", nativeName: "isiXhosa", flag: "🇿🇦" },
  { code: "st", name: "Sesotho", nativeName: "Sesotho", flag: "🇱🇸" },
  { code: "sn", name: "Shona", nativeName: "chiShona", flag: "🇿🇼" },
  { code: "mg", name: "Malagasy", nativeName: "Malagasy", flag: "🇲🇬" },
  { code: "rw", name: "Kinyarwanda", nativeName: "Ikinyarwanda", flag: "🇷🇼" },
  { code: "ny", name: "Chichewa", nativeName: "Chichewa", flag: "🇲🇼" },
  { code: "ht", name: "Haitian Creole", nativeName: "Kreyòl Ayisyen", flag: "🇭🇹" },
  { code: "la", name: "Latin", nativeName: "Latina", flag: "🇻🇦" },
  { code: "eo", name: "Esperanto", nativeName: "Esperanto", flag: "🌍" },
  { code: "lb", name: "Luxembourgish", nativeName: "Lëtzebuergesch", flag: "🇱🇺" },
  { code: "ceb", name: "Cebuano", nativeName: "Binisaya", flag: "🇵🇭" },
  { code: "min", name: "Minangkabau", nativeName: "Baso Minang", flag: "🇮🇩" },
  { code: "ban", name: "Balinese", nativeName: "Basa Bali", flag: "🇮🇩" },
  { code: "ace", name: "Acehnese", nativeName: "Bahsa Acèh", flag: "🇮🇩" },
];

export type TranslationKey =
  | "nav_dashboard"
  | "nav_drafts"
  | "nav_insights"
  | "nav_profile"
  | "safe_to_spend"
  | "real_balance"
  | "locked_in_drafts"
  | "add_income"
  | "add_draft"
  | "recent_activity"
  | "view_all"
  | "filter_all"
  | "filter_expenses"
  | "filter_incomes"
  | "filter_date"
  | "real_time"
  | "all_dates"
  | "select_date"
  | "drafts_title"
  | "tab_togo"
  | "tab_tobuy"
  | "tab_todo"
  | "mark_done"
  | "scan_receipt"
  | "insights_title"
  | "insights_subtitle"
  | "regrets"
  | "high_value"
  | "never_again"
  | "again_favorite"
  | "mindful_score"
  | "profile_title"
  | "edit_profile"
  | "username"
  | "email"
  | "password"
  | "new_password"
  | "save_changes"
  | "theme"
  | "theme_dark"
  | "theme_light"
  | "notifications"
  | "notifications_enabled"
  | "notifications_disabled"
  | "test_notification"
  | "language"
  | "select_language"
  | "search_language"
  | "logout"
  | "empty_state"
  | "no_transactions_month"
  | "completed_removed";

export const TRANSLATIONS: Record<string, Partial<Record<TranslationKey, string>>> = {
  id: {
    nav_dashboard: "Beranda",
    nav_drafts: "Drafts",
    nav_insights: "Insight",
    nav_profile: "Profil",
    safe_to_spend: "Saldo Aman Belanja",
    real_balance: "Total Kas Aktif",
    locked_in_drafts: "Terkunci di Draft",
    add_income: "+ Tambah Pemasukan",
    add_draft: "+ Buat Rencana Baru",
    recent_activity: "Aktivitas Terkini",
    view_all: "Lihat Semua",
    filter_all: "Semua",
    filter_expenses: "Pengeluaran",
    filter_incomes: "Pemasukan",
    filter_date: "Pilih Tanggal",
    real_time: "Real-Time (Terbaru)",
    all_dates: "Semua Tanggal",
    select_date: "Pilih Tanggal Tertentu",
    drafts_title: "Drafts & Wishlist",
    tab_togo: "📍 To-Go",
    tab_tobuy: "🛍️ To-Buy",
    tab_todo: "📅 To-Do",
    mark_done: "Tandai Selesai",
    scan_receipt: "Scan Struk",
    insights_title: "Worth-It Insights",
    insights_subtitle: "Evaluasi pengeluaran untuk belanja lebih bijak",
    regrets: "Penyesalan",
    high_value: "Nilai Tinggi",
    never_again: "Never Again",
    again_favorite: "Again! Favorit",
    mindful_score: "Mindful Score",
    profile_title: "Pengaturan & Profil",
    edit_profile: "Edit Profil Akun",
    username: "Nama Pengguna",
    email: "Alamat Email",
    password: "Password",
    new_password: "Password Baru (Opsional)",
    save_changes: "Simpan Perubahan",
    theme: "Tema Aplikasi",
    theme_dark: "Tema Gelap",
    theme_light: "Tema Terang",
    notifications: "Notifikasi Sistem",
    notifications_enabled: "Notifikasi Aktif",
    notifications_disabled: "Notifikasi Nonaktif",
    test_notification: "Kirim Notifikasi Uji Coba",
    language: "Bahasa",
    select_language: "Pilih Bahasa (100 Bahasa)",
    search_language: "Cari bahasa...",
    logout: "Keluar Akun",
    empty_state: "Belum ada data",
    no_transactions_month: "Belum ada transaksi di bulan yang dipilih.",
    completed_removed: "Rencana telah diselesaikan dan dihapus dari draft!",
  },
  en: {
    nav_dashboard: "Home",
    nav_drafts: "Drafts",
    nav_insights: "Insights",
    nav_profile: "Profile",
    safe_to_spend: "Safe-to-Spend",
    real_balance: "Total Active Cash",
    locked_in_drafts: "Locked in Drafts",
    add_income: "+ Add Income",
    add_draft: "+ New Draft Plan",
    recent_activity: "Recent Activity",
    view_all: "View All",
    filter_all: "All",
    filter_expenses: "Expenses",
    filter_incomes: "Income",
    filter_date: "Pick Date",
    real_time: "Real-Time (Newest)",
    all_dates: "All Dates",
    select_date: "Select Specific Date",
    drafts_title: "Drafts & Wishlist",
    tab_togo: "📍 To-Go",
    tab_tobuy: "🛍️ To-Buy",
    tab_todo: "📅 To-Do",
    mark_done: "Mark Done",
    scan_receipt: "Scan Receipt",
    insights_title: "Worth-It Insights",
    insights_subtitle: "Reflect on past spending to spend smarter",
    regrets: "Regrets",
    high_value: "High Value",
    never_again: "Never Again",
    again_favorite: "Again! Favorite",
    mindful_score: "Mindful Score",
    profile_title: "Settings & Profile",
    edit_profile: "Edit Account Profile",
    username: "Username",
    email: "Email Address",
    password: "Password",
    new_password: "New Password (Optional)",
    save_changes: "Save Changes",
    theme: "App Theme",
    theme_dark: "Dark Mode",
    theme_light: "Light Mode",
    notifications: "System Notifications",
    notifications_enabled: "Notifications Active",
    notifications_disabled: "Notifications Disabled",
    test_notification: "Send Test Notification",
    language: "Language",
    select_language: "Select Language (100 World Languages)",
    search_language: "Search language...",
    logout: "Log Out",
    empty_state: "No data available",
    no_transactions_month: "No transactions recorded for the selected month.",
    completed_removed: "Plan marked completed and removed from drafts!",
  },
  es: {
    nav_dashboard: "Inicio",
    nav_drafts: "Borradores",
    nav_insights: "Estadísticas",
    nav_profile: "Perfil",
    safe_to_spend: "Disponible para gastar",
    real_balance: "Saldo Real",
    locked_in_drafts: "Bloqueado en planes",
    add_income: "+ Añadir Ingreso",
    add_draft: "+ Nuevo Plan",
    theme: "Tema",
    theme_dark: "Modo Oscuro",
    theme_light: "Modo Claro",
    notifications: "Notificaciones",
    language: "Idioma",
    logout: "Cerrar sesión",
  },
  zh: {
    nav_dashboard: "主页",
    nav_drafts: "草稿计划",
    nav_insights: "消费洞察",
    nav_profile: "个人设置",
    safe_to_spend: "安全消费额度",
    real_balance: "当前总现金",
    locked_in_drafts: "草稿锁定额度",
    add_income: "+ 添加收入",
    add_draft: "+ 新建草稿计划",
    theme: "主题",
    theme_dark: "深色模式",
    theme_light: "浅色模式",
    notifications: "系统通知",
    language: "语言",
    logout: "退出登录",
  },
  ja: {
    nav_dashboard: "ホーム",
    nav_drafts: "下書き",
    nav_insights: "支出分析",
    nav_profile: "プロフィール",
    safe_to_spend: "安全支出枠",
    real_balance: "総資産残高",
    locked_in_drafts: "計画予約額",
    add_income: "+ 収入を追加",
    add_draft: "+ 計画を作成",
    theme: "テーマ",
    theme_dark: "ダークモード",
    theme_light: "ライトモード",
    notifications: "通知",
    language: "言語",
    logout: "ログアウト",
  },
};

export function getTranslation(key: TranslationKey, lang: string = "id"): string {
  if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
    return TRANSLATIONS[lang][key]!;
  }
  // Fallback to Indonesian if key exists, then English
  if (TRANSLATIONS["id"] && TRANSLATIONS["id"][key]) {
    return TRANSLATIONS["id"][key]!;
  }
  return TRANSLATIONS["en"]?.[key] || key;
}
