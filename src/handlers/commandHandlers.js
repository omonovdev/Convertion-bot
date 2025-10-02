import { mainKeyboard, cancelKeyboard, mergeKeyboard } from '../keyboards/keyboards.js';
import { getWelcomeMessage, helpMessage, userIdMessage, waitingMessages } from '../messages.js';

// Foydalanuvchi holatlari
export const userStates = new Map();

/**
 * /start command handler
 */
export async function handleStart(ctx) {
    try {
        const welcomeMsg = getWelcomeMessage(ctx.from.first_name);
        await ctx.replyWithMarkdown(welcomeMsg, mainKeyboard);
        console.log(`👤 Yangi foydalanuvchi: ${ctx.from.first_name} (${ctx.from.id})`);
    } catch (error) {
        console.error('Start command xatoligi:', error);
        await ctx.reply('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
    }
}

/**
 * Yordam command handler
 */
export async function handleHelp(ctx) {
    try {
        await ctx.replyWithMarkdown(helpMessage);
    } catch (error) {
        console.error('Help command xatoligi:', error);
        await ctx.reply('Yordam ma\'lumotini yuklashda xatolik.');
    }
}

/**
 * ID ko'rsatish handler
 */
export async function handleUserId(ctx) {
    try {
        const idMsg = userIdMessage(ctx.from.id);
        await ctx.reply(idMsg, { parse_mode: 'Markdown' });
    } catch (error) {
        console.error('User ID xatoligi:', error);
        await ctx.reply('ID ma\'lumotini olishda xatolik.');
    }
}

/**
 * JPG to PDF handler
 */
export async function handleJpgToPdf(ctx) {
    try {
        userStates.set(ctx.from.id, 'waiting_jpg');
        await ctx.reply(waitingMessages.jpg, cancelKeyboard);
        console.log(`📸 ${ctx.from.first_name} JPG to PDF rejimini tanladi`);
    } catch (error) {
        console.error('JPG to PDF xatoligi:', error);
        await ctx.reply('Xatolik yuz berdi.');
    }
}

/**
 * PNG to PDF handler
 */
export async function handlePngToPdf(ctx) {
    try {
        userStates.set(ctx.from.id, 'waiting_png');
        await ctx.reply(waitingMessages.png, cancelKeyboard);
        console.log(`🖼 ${ctx.from.first_name} PNG to PDF rejimini tanladi`);
    } catch (error) {
        console.error('PNG to PDF xatoligi:', error);
        await ctx.reply('Xatolik yuz berdi.');
    }
}

/**
 * Word to PDF handler
 */
export async function handleWordToPdf(ctx) {
    try {
        userStates.set(ctx.from.id, 'waiting_docx');
        await ctx.reply(waitingMessages.docx, cancelKeyboard);
        console.log(`📝 ${ctx.from.first_name} Word to PDF rejimini tanladi`);
    } catch (error) {
        console.error('Word to PDF xatoligi:', error);
        await ctx.reply('Xatolik yuz berdi.');
    }
}

/**
 * PDF to Word handler
 */
export async function handlePdfToWord(ctx) {
    try {
        userStates.set(ctx.from.id, 'waiting_pdf_to_word');
        await ctx.reply(waitingMessages.pdfToWord, cancelKeyboard);
        console.log(`📄 ${ctx.from.first_name} PDF to Word rejimini tanladi`);
    } catch (error) {
        console.error('PDF to Word xatoligi:', error);
        await ctx.reply('Xatolik yuz berdi.');
    }
}

/**
 * PDF Merge handler
 */
export async function handlePdfMerge(ctx) {
    try {
        userStates.set(ctx.from.id, 'waiting_pdfs_to_merge');
        await ctx.reply(waitingMessages.pdfMerge, mergeKeyboard);
        console.log(`🔗 ${ctx.from.first_name} PDF Merge rejimini tanladi`);
    } catch (error) {
        console.error('PDF Merge xatoligi:', error);
        await ctx.reply('Xatolik yuz berdi.');
    }
}

/**
 * Bekor qilish handler
 */
export async function handleCancel(ctx) {
    try {
        const pdfFiles = userStates.get(ctx.from.id + '_pdf_files');
        if (pdfFiles) {
            userStates.delete(ctx.from.id + '_pdf_files');
        }
        userStates.delete(ctx.from.id);

        await ctx.reply('❌ Operatsiya bekor qilindi!', mainKeyboard);
        console.log(`❌ ${ctx.from.first_name} operatsiyani bekor qildi`);
    } catch (error) {
        console.error('Cancel xatoligi:', error);
        await ctx.reply('Xatolik yuz berdi.');
    }
}
