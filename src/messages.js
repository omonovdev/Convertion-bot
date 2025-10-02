import config from './config/config.js';

/**
 * Xush kelibsiz xabari
 * @param {string} firstName - Foydalanuvchi ismi
 * @returns {string} - Xush kelibsiz matni
 */
export function getWelcomeMessage(firstName) {
    return `
🤖 *Assalomu alaykum, ${firstName}!*

📁 *${config.botName}*ga xush kelibsiz!

Bu bot yordamida quyidagi operatsiyalarni amalga oshirishingiz mumkin:

📸 *JPG → PDF* ♻️
🖼 *PNG → PDF* ♻️  
📝 *Word → PDF* ♻️
📄 *PDF → Word* ♻️
🔗 *PDF fayllarni birlashtirish* ➕

Quyidagi tugmalardan birini tanlang:
    `;
}

/**
 * Yordam xabari
 */
export const helpMessage = `
📖 *Yordam bo'limi*

🔄 *Foydalanish tartibi:*
1️⃣ Kerakli operatsiyani tanlang
2️⃣ Faylni yuboring
3️⃣ Bot ishlov beradi va natijani yuboradi

📊 *Qo'llab-quvvatlanadigan formatlar:*
• JPG, JPEG, PNG → PDF
• DOCX → PDF  
• PDF → Text
• PDF + PDF = Birlashtirilgan PDF

⚠️ *Cheklovlar:*
• Maksimal fayl hajmi: ${Math.round(config.maxFileSize / 1024 / 1024)}MB
• Bir vaqtda faqat bitta fayl
• PDF birlashtirish uchun ketma-ket yuborishingiz mumkin

❓ Savollar uchun: @${config.adminUsername}
`;

/**
 * Muvaffaqiyatli operatsiya xabarlari
 */
export const successMessages = {
    imageConverted: '✅ Rasm muvaffaqiyatli PDF ga aylantirildi!',
    wordConverted: '✅ Word fayli muvaffaqiyatli PDF ga aylantirildi!',
    pdfConverted: '✅ PDF fayli muvaffaqiyatli text formatiga aylantirildi!',
    pdfsMerged: (count) => `✅ ${count} ta PDF fayl muvaffaqiyatli birlashtirildi!`,
    operationCancelled: '❌ Operatsiya bekor qilindi!'
};

/**
 * Kutish xabarlari
 */
export const waitingMessages = {
    jpg: '📸 JPG rasmni yuboring, men uni PDF ga aylantirib beraman!',
    png: '🖼 PNG rasmni yuboring, men uni PDF ga aylantirib beraman!',
    docx: '📝 Word (.docx) faylini yuboring, men uni PDF ga aylantirib beraman!',
    pdfToWord: '📄 PDF faylini yuboring, men uni text formatiga aylantirib beraman!',
    pdfMerge: '🔗 Birlashtirishni xohlagan PDF fayllaringizni ketma-ket yuboring. Tayyor bo\'lganda "✅ Birlashtirish" tugmasini bosing.'
};

/**
 * Jarayon xabarlari
 */
export const processMessages = {
    imageProcessing: '⏳ Rasm qayta ishlanmoqda...',
    wordProcessing: '⏳ Word fayli qayta ishlanmoqda...',
    pdfProcessing: '⏳ PDF fayli qayta ishlanmoqda...',
    merging: '⏳ PDF fayllar birlashtirilmoqda...'
};

/**
 * Xatolik xabarlari
 */
export const errorMessages = {
    invalidFormat: '❌ Noto\'g\'ri fayl formati! Iltimos, to\'g\'ri formatdagi faylni yuboring.',
    fileTooLarge: `❌ Fayl hajmi ${Math.round(config.maxFileSize / 1024 / 1024)}MB dan katta bo'lmasligi kerak!`,
    downloadError: '❌ Faylni yuklab olishda xatolik yuz berdi!',
    conversionError: '❌ Faylni konvertatsiya qilishda xatolik yuz berdi!',
    mergeError: '❌ PDF fayllarni birlashtirishda xatolik yuz berdi!',
    notEnoughFiles: '❌ Kamida 2 ta PDF fayl yuboring!',
    generalError: '❌ Ichki xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.',
    unknownCommand: '👋 Salom! Iltimos, yuqoridagi tugmalardan birini tanlang.'
};

/**
 * Fayl qabul qilindi xabari
 * @param {number} count - Qabul qilingan fayllar soni
 * @returns {string} - Xabar matni
 */
export function fileAcceptedMessage(count) {
    return `📄 PDF fayli qabul qilindi! Jami: ${count} ta fayl`;
}

/**
 * Foydalanuvchi ID xabari
 * @param {number} userId - Foydalanuvchi ID
 * @returns {string} - ID xabari
 */
export function userIdMessage(userId) {
    return `🆔 Sizning Telegram ID: \`${userId}\``;
}
