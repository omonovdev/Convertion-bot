import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import config from '../config/config.js';

/**
 * Rasmlarni PDF ga o'girish (bir nechta rasm)
 * @param {Array<string>} imagePaths - Rasm fayllari yo'llari
 * @param {string} outputPath - Chiqish PDF yo'li
 * @param {string} customName - Custom fayl nomi
 */
export async function imagesToPdf(imagePaths, outputPath, customName = null) {
    try {
        const pdfDoc = await PDFDocument.create();

        for (const imagePath of imagePaths) {
            // Sharp yordamida rasmni optimallashtirish
            const optimizedPath = path.join(
                process.cwd(),
                config.tempDir,
                `optimized_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`
            );

            await sharp(imagePath)
                .jpeg({ quality: 85, progressive: true })
                .resize(1200, 1600, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .toFile(optimizedPath);

            const imageBytes = fs.readFileSync(optimizedPath);
            const image = await pdfDoc.embedJpg(imageBytes);

            const { width, height } = image;

            // A4 sahifa o'lchamlari (595 x 842 points)
            const pageWidth = 595;
            const pageHeight = 842;

            // Rasmni sahifaga moslashtirish
            const scaleFactor = Math.min(
                (pageWidth - 40) / width,
                (pageHeight - 40) / height
            );

            const scaledWidth = width * scaleFactor;
            const scaledHeight = height * scaleFactor;

            const page = pdfDoc.addPage([pageWidth, pageHeight]);

            page.drawImage(image, {
                x: (pageWidth - scaledWidth) / 2,
                y: (pageHeight - scaledHeight) / 2,
                width: scaledWidth,
                height: scaledHeight,
            });

            // Optimized faylni o'chirish
            if (fs.existsSync(optimizedPath)) {
                fs.unlinkSync(optimizedPath);
            }
        }

        const pdfBytes = await pdfDoc.save();

        // Custom nom bilan saqlash
        let finalOutputPath = outputPath;
        if (customName) {
            const dir = path.dirname(outputPath);
            finalOutputPath = path.join(dir, `${customName}.pdf`);
        }

        fs.writeFileSync(finalOutputPath, pdfBytes);
        return finalOutputPath;

    } catch (error) {
        console.error('Images to PDF conversion error:', error);
        throw new Error('Rasmlarni PDF ga o\'girish muvaffaqiyatsiz');
    }
}

/**
 * Rasm formatini tekshirish va optimizatsiya qilish (cheklovsiz)
 * @param {string} imagePath - Rasm fayli yo'li
 * @returns {Promise<boolean>}
 */
export async function validateAndOptimizeImage(imagePath) {
    try {
        const metadata = await sharp(imagePath).metadata();

        // Qo'llab-quvvatlanadigan formatlar
        const supportedFormats = ['jpeg', 'jpg', 'png', 'webp', 'tiff', 'gif', 'svg'];

        if (!supportedFormats.includes(metadata.format)) {
            throw new Error('Qo\'llab-quvvatlanmaydigan rasm formati');
        }

        // Rasm o'lchamini tekshirish (minimal cheklov faqat)
        if (metadata.width < 10 || metadata.height < 10) {
            throw new Error('Rasm juda kichik (minimum 10x10 px)');
        }

        // Maksimal o'lcham cheklovi olib tashlandi - istalgan o'lchamdagi rasmlar qabul qilinadi

        return true;

    } catch (error) {
        console.error('Image validation error:', error);
        throw error;
    }
}

export default {
    imagesToPdf,
    validateAndOptimizeImage
};
