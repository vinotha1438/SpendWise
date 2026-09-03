import i18n from "../i18n";

const translations = {
    en: {
        Dashboard: "Dashboard",
        Income: "Income",
        Expense: "Expense",
        "Budget Planner": "Budget Planner",
        "Recurring Expenses": "Recurring Expenses",
        Goals: "Goals",
        Analytics: "Analytics",
        Reports: "Reports",
        Settings: "Settings",
        Logout: "Logout",

        "Add Expense": "Add Expense",
        "Add Income": "Add Income",
        "Total Expense": "Total Expense",
        "Current Balance": "Current Balance",
        "Total Savings": "Total Savings",
        "Money Spent": "Money Spent",
        "Available Balance": "Available Balance",
        "Saved Amount": "Saved Amount",

        "Expense History": "Expense History",
        "Income History": "Income History",
        "View, search and manage all your expenses.":
            "View, search and manage all your expenses.",
        "View, manage and edit all your income records.":
            "View, manage and edit all your income records.",

        Search: "Search",
        "All Categories": "All Categories",
        "Search expense...": "Search expense...",

        Today: "Today",
        "This Week": "This Week",
        "This Month": "This Month",
        "This Year": "This Year",
        All: "All",

        Edit: "Edit",
        Delete: "Delete",
        Save: "Save",
        Update: "Update",
        Close: "Close",

        "Create Monthly Budget": "Create Monthly Budget",
        "Update Budget": "Update Budget",
        "Monthly Budget": "Monthly Budget",
        "Select Category": "Select Category",
        "Add New Category": "Add New Category",
        "Save Category": "Save Category",

        "Budget Progress": "Budget Progress",
        "No Budgets Found": "No Budgets Found",

        "Recurring Expense": "Recurring Expense",
        "Add Recurring Expense": "Add Recurring Expense",

        "Good Morning ☀️": "Good Morning ☀️",
        "Good Afternoon 🌤️": "Good Afternoon 🌤️",
        "Good Evening 🌙": "Good Evening 🌙",

        Welcome: "Welcome",
        "SpendWise User": "SpendWise User",
        "Personal Finance": "Personal Finance",
        "Live Balance": "Live Balance",
        Notifications: "Notifications",
        "No Notifications": "No Notifications",
    },

    ta: {
        Dashboard: "டாஷ்போர்டு",
        Income: "வருமானம்",
        Expense: "செலவு",
        "Budget Planner": "பட்ஜெட் திட்டம்",
        "Recurring Expenses": "தொடர் செலவுகள்",
        Goals: "இலக்குகள்",
        Analytics: "பகுப்பாய்வு",
        Reports: "அறிக்கைகள்",
        Settings: "அமைப்புகள்",
        Logout: "வெளியேறு",

        "Add Expense": "செலவு சேர்க்கவும்",
        "Add Income": "வருமானம் சேர்க்கவும்",
        "Total Expense": "மொத்த செலவு",
        "Current Balance": "தற்போதைய இருப்பு",
        "Total Savings": "மொத்த சேமிப்பு",
        "Money Spent": "செலவிட்ட பணம்",
        "Available Balance": "கிடைக்கும் இருப்பு",
        "Saved Amount": "சேமித்த தொகை",

        "Expense History": "செலவு வரலாறு",
        "Income History": "வருமான வரலாறு",
        "View, search and manage all your expenses.":
            "உங்கள் அனைத்து செலவுகளையும் பார்க்கவும், தேடவும் மற்றும் நிர்வகிக்கவும்.",
        "View, manage and edit all your income records.":
            "உங்கள் அனைத்து வருமான பதிவுகளையும் பார்க்கவும், நிர்வகிக்கவும் மற்றும் திருத்தவும்.",

        Search: "தேடு",
        "All Categories": "அனைத்து வகைகள்",
        "Search expense...": "செலவை தேடுங்கள்...",

        Today: "இன்று",
        "This Week": "இந்த வாரம்",
        "This Month": "இந்த மாதம்",
        "This Year": "இந்த ஆண்டு",
        All: "அனைத்தும்",

        Edit: "திருத்து",
        Delete: "நீக்கு",
        Save: "சேமி",
        Update: "புதுப்பி",
        Close: "மூடு",

        "Create Monthly Budget": "மாதாந்திர பட்ஜெட்டை உருவாக்கவும்",
        "Update Budget": "பட்ஜெட்டை புதுப்பிக்கவும்",
        "Monthly Budget": "மாதாந்திர பட்ஜெட்",
        "Select Category": "வகையைத் தேர்ந்தெடுக்கவும்",
        "Add New Category": "புதிய வகையைச் சேர்க்கவும்",
        "Save Category": "வகையைச் சேமிக்கவும்",

        "Budget Progress": "பட்ஜெட் முன்னேற்றம்",
        "No Budgets Found": "பட்ஜெட்கள் எதுவும் இல்லை",

        "Recurring Expense": "தொடர் செலவு",
        "Add Recurring Expense": "தொடர் செலவைச் சேர்க்கவும்",

        "Good Morning ☀️": "காலை வணக்கம் ☀️",
        "Good Afternoon 🌤️": "மதிய வணக்கம் 🌤️",
        "Good Evening 🌙": "மாலை வணக்கம் 🌙",

        Welcome: "வரவேற்கிறோம்",
        "SpendWise User": "SpendWise பயனர்",
        "Personal Finance": "தனிப்பட்ட நிதி",
        "Live Balance": "நேரடி இருப்பு",
        Notifications: "அறிவிப்புகள்",
        "No Notifications": "அறிவிப்புகள் இல்லை",
    },
};

export const autoTranslate = (text) => {
    if (!text || typeof text !== "string") {
        return text;
    }

    const language = i18n.language?.startsWith("ta")
        ? "ta"
        : "en";

    return translations[language][text] || text;
};

export default autoTranslate;