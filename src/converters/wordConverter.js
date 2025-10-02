export async function wordToPdf(inputPath, outputPath) {
	// TODO: Word faylni PDF ga o'zgartirish logikasi
	return outputPath;
}

export function isValidWordFormat(fileName) {
	return fileName.endsWith('.docx') || fileName.endsWith('.doc');
}
