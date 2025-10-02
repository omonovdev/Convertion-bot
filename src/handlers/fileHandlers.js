import path from 'path';
import { userStates } from './commandHandlers.js';
import { downloadFile, cleanupFiles, generateFileName, validateFileSize } from '../utils.js';
import { imageToPdf, isValidImageFormat } from '../converters/imageConverter.js';
import { wordToPdf, isValidWordFormat } from '../converters/wordConverter.js';
import { pdfToText, mergePdfs, isValidPdfFormat } from '../converters/pdfConverter.js';
import { mainKeyboard } from '../keyboards.js';
import { successMessages, processMessages, errorMessages, fileAcceptedMessage } from '../messages.js';
import config from '../config/config.js';

/**
 * Rasm fayllarini qayta ishlash
 */
export async function handlePhoto(ctx) {
    const userState = userStates.get(ctx.from.id);

    if (userState === 'waiting_jpg' || userState === 'waiting_png') {
        let processingMsg;

        try {
            processingMsg = await ctx.reply(processMessages.imageProcessing);

            const photo = ctx.message.photo[ctx.message.photo.length - 1];
            const fileName = generateFileName('image', '.jpg');
            const imagePath = await downloadFile(ctx, photo.file_id, fileName);

            const outputPath = path.join(config.tempDir, generateFileName('converted', '.pdf'));
            await imageToPdf(imagePath, outputPath);

            await ctx.replyWithDocument({
                source: outputPath,
                filename: generateFileName('converted_image', '.pdf')
            });

            await ctx.telegram.deleteMessage(ctx.chat.id, processingMsg.message_id);
            await ctx.reply(successMessages.imageConverted, mainKeyboard);

            cleanupFiles([imagePath, outputPath]);
            userStates.delete(ctx.from.id);

            console.log(`✅ ${ctx.from.first_name} rasm PDF ga aylantirdi`);

        } catch (error) {
            if (processingMsg) {
                await ctx.telegram.deleteMessage(ctx.chat.id, processingMsg.message_id);
            }
            await ctx.reply(errorMessages.conversionError, mainKeyboard);
            userStates.delete(ctx.from.id);
            console.error('Rasm konvertatsiya xatoligi:', error);
        }
    }
}

/**
 * Hujjat fayllarini qayta ishlash
 */
export async function handleDocument(ctx) {
    const userState = userStates.get(ctx.from.id);
    const document = ctx.message.document;

    // Fayl hajmini tekshirish
    if (!validateFileSize(document.file_size)) {
        await ctx.reply(errorMessages.fileTooLarge);
        return;
    }

    // Word to PDF
    if (userState === 'waiting_docx' && isValidWordFormat(document.file_name)) {
        await handleWordToPdf(ctx, document);
    }
    // PDF to Word
    else if (userState === 'waiting_pdf_to_word' && isValidPdfFormat(document.file_name)) {
        await handlePdfToText(ctx, document);
    }
    // PDF Merge
    else if (userState === 'waiting_pdfs_to_merge' && isValidPdfFormat(document.file_name)) {
        await handlePdfForMerge(ctx, document);
    }
    else {
        await ctx.reply(errorMessages.invalidFormat);
    }
}

/**
 * Word faylini PDF ga aylantirish
 */
async function handleWordToPdf(ctx, document) {
    let processingMsg;

    try {
        processingMsg = await ctx.reply(processMessages.wordProcessing);

        const docxPath = await downloadFile(ctx, document.file_id, document.file_name);
    const outputPath = path.join(config.tempDir, generateFileName('converted', '.pdf'));

        await wordToPdf(docxPath, outputPath);

        await ctx.replyWithDocument({
            source: outputPath,
            filename: document.file_name.replace('.docx', '.pdf')
        });

        await ctx.telegram.deleteMessage(ctx.chat.id, processingMsg.message_id);
        await ctx.reply(successMessages.wordConverted, mainKeyboard);

        cleanupFiles([docxPath, outputPath]);
        userStates.delete(ctx.from.id);

        console.log(`✅ ${ctx.from.first_name} Word PDF ga aylantirdi`);

    } catch (error) {
        if (processingMsg) {
            await ctx.telegram.deleteMessage(ctx.chat.id, processingMsg.message_id);
        }
        await ctx.reply(errorMessages.conversionError, mainKeyboard);
        userStates.delete(ctx.from.id);
        console.error('Word konvertatsiya xatoligi:', error);
    }
}

/**
 * PDF faylini text ga aylantirish
 */
async function handlePdfToText(ctx, document) {
    let processingMsg;

    try {
        processingMsg = await ctx.reply(processMessages.pdfProcessing);

        const pdfPath = await downloadFile(ctx, document.file_id, document.file_name);
    const outputPath = path.join(config.tempDir, generateFileName('converted', '.txt'));

        await pdfToText(pdfPath, outputPath);

        await ctx.replyWithDocument({
            source: outputPath,
            filename: document.file_name.replace('.pdf', '.txt')
        });

        await ctx.telegram.deleteMessage(ctx.chat.id, processingMsg.message_id);
        await ctx.reply(successMessages.pdfConverted, mainKeyboard);

        cleanupFiles([pdfPath, outputPath]);
        userStates.delete(ctx.from.id);

        console.log(`✅ ${ctx.from.first_name} PDF text ga aylantirdi`);

    } catch (error) {
        if (processingMsg) {
            await ctx.telegram.deleteMessage(ctx.chat.id, processingMsg.message_id);
        }
        await ctx.reply(errorMessages.conversionError, mainKeyboard);
        userStates.delete(ctx.from.id);
        console.error('PDF konvertatsiya xatoligi:', error);
    }
}

/**
 * PDF faylni merge uchun qabul qilish
 */
async function handlePdfForMerge(ctx, document) {
    try {
        const pdfPath = await downloadFile(ctx, document.file_id, document.file_name);

        if (!userStates.has(ctx.from.id + '_pdf_files')) {
            userStates.set(ctx.from.id + '_pdf_files', []);
        }

        const pdfFiles = userStates.get(ctx.from.id + '_pdf_files');
        pdfFiles.push(pdfPath);
        userStates.set(ctx.from.id + '_pdf_files', pdfFiles);

        await ctx.reply(fileAcceptedMessage(pdfFiles.length));
        console.log(`📄 ${ctx.from.first_name} PDF fayl qo'shdi (${pdfFiles.length})`);

    } catch (error) {
        await ctx.reply(errorMessages.downloadError);
        console.error('PDF yuklab olish xatoligi:', error);
    }
}

/**
 * PDF fayllarni birlashtirish
 */
export async function handleMergePdfs(ctx) {
    const pdfFiles = userStates.get(ctx.from.id + '_pdf_files');

    if (!pdfFiles || pdfFiles.length < 2) {
        await ctx.reply(errorMessages.notEnoughFiles);
        return;
    }

    let processingMsg;

    try {
        processingMsg = await ctx.reply(processMessages.merging);

    const outputPath = path.join(config.tempDir, generateFileName('merged', '.pdf'));
        await mergePdfs(pdfFiles, outputPath);

        await ctx.replyWithDocument({
            source: outputPath,
            filename: generateFileName('merged_pdfs', '.pdf')
        });

        await ctx.telegram.deleteMessage(ctx.chat.id, processingMsg.message_id);
        await ctx.reply(successMessages.pdfsMerged(pdfFiles.length), mainKeyboard);

        cleanupFiles([...pdfFiles, outputPath]);
        userStates.delete(ctx.from.id);
        userStates.delete(ctx.from.id + '_pdf_files');

        console.log(`✅ ${ctx.from.first_name} ${pdfFiles.length} ta PDF birlashtirdi`);

    } catch (error) {
        if (processingMsg) {
            await ctx.telegram.deleteMessage(ctx.chat.id, processingMsg.message_id);
        }
        await ctx.reply(errorMessages.mergeError, mainKeyboard);
        console.error('PDF merge xatoligi:', error);
    }
}
