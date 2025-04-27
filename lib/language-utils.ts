/**
 * Detect the language of a text string
 * This is a simplified version - in a real app, you would use a more robust solution
 * or leverage Groq's built-in language detection capabilities
 *
 * @param {string} text - The text to detect language for
 * @returns {string} The detected language code
 */
export function detectLanguage(text: string): string {
  // Common language patterns and characters
  const patterns = [
    {
      lang: "es",
      regex: /[áéíóúüñ¿¡]/i,
      words: ["hola", "gracias", "por favor", "como", "que", "bien", "dinero", "cuenta"],
    },
    {
      lang: "fr",
      regex: /[àâæçéèêëîïôœùûüÿ]/i,
      words: ["bonjour", "merci", "comment", "pourquoi", "argent", "compte", "banque"],
    },
    { lang: "de", regex: /[äöüß]/i, words: ["hallo", "danke", "bitte", "wie", "geld", "konto", "bank"] },
    { lang: "pt", regex: /[áàâãçéêíóôõú]/i, words: ["olá", "obrigado", "como", "dinheiro", "conta", "banco"] },
    { lang: "it", regex: /[àèéìíîòóùú]/i, words: ["ciao", "grazie", "come", "denaro", "conto", "banca"] },
    { lang: "zh", regex: /[\u4e00-\u9fff]/, words: [] },
    { lang: "ja", regex: /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/, words: [] },
    { lang: "ko", regex: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF]/, words: [] },
    { lang: "hi", regex: /[\u0900-\u097F]/, words: [] },
    { lang: "ar", regex: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/, words: [] },
    { lang: "ru", regex: /[\u0400-\u04FF\u0500-\u052F]/, words: [] },
    { lang: "th", regex: /[\u0E00-\u0E7F]/, words: [] },
    { lang: "vi", regex: /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i, words: [] },
    { lang: "tr", regex: /[çğıöşü]/i, words: ["merhaba", "teşekkürler", "nasıl", "para", "hesap", "banka"] },
    { lang: "nl", regex: /[àáèéëêïìíòóöôùúûü]/i, words: ["hallo", "dank", "hoe", "geld", "rekening", "bank"] },
    { lang: "sv", regex: /[åäö]/i, words: ["hej", "tack", "hur", "pengar", "konto", "bank"] },
  ]

  const lowerText = text.toLowerCase()

  // Check for character patterns first (more reliable)
  for (const { lang, regex } of patterns) {
    if (regex.test(text)) {
      return lang
    }
  }

  // Check for common words
  for (const { lang, words } of patterns) {
    if (words.length > 0 && words.some((word) => lowerText.includes(word))) {
      return lang
    }
  }

  // Default to English if no other language is detected
  return "en"
}

/**
 * Get a greeting in the detected language
 * @param {string} langCode - The language code
 * @returns {string} A greeting in the detected language
 */
export function getGreeting(langCode: string): string {
  const greetings: Record<string, string> = {
    en: "Hello! How can I help with your finances today?",
    es: "¡Hola! ¿Cómo puedo ayudarte con tus finanzas hoy?",
    fr: "Bonjour! Comment puis-je vous aider avec vos finances aujourd'hui?",
    de: "Hallo! Wie kann ich Ihnen heute mit Ihren Finanzen helfen?",
    pt: "Olá! Como posso ajudá-lo com suas finanças hoje?",
    it: "Ciao! Come posso aiutarti con le tue finanze oggi?",
    zh: "你好！今天我能如何帮助您处理财务问题？",
    ja: "こんにちは！今日はどのように財務のお手伝いができますか？",
    ko: "안녕하세요! 오늘 재정 문제를 어떻게 도와 드릴까요?",
    hi: "नमस्ते! आज मैं आपके वित्त में कैसे मदद कर सकता हूँ?",
    ar: "مرحبا! كيف يمكنني مساعدتك في أمورك المالية اليوم؟",
    ru: "Привет! Как я могу помочь вам с финансами сегодня?",
    th: "สวัสดี! ฉันจะช่วยคุณเกี่ยวกับการเงินของคุณได้อย่างไรในวันนี้?",
    vi: "Xin chào! Tôi có thể giúp gì cho bạn về tài chính hôm nay?",
    tr: "Merhaba! Bugün finansal konularda size nasıl yardımcı olabilirim?",
    nl: "Hallo! Hoe kan ik u vandaag helpen met uw financiën?",
    sv: "Hej! Hur kan jag hjälpa dig med din ekonomi idag?",
  }

  return greetings[langCode] || greetings.en
}

/**
 * Get financial terms in different languages
 * @param {string} term - The financial term in English
 * @param {string} langCode - The language code
 * @returns {string} The translated term
 */
export function getFinancialTerm(term: string, langCode: string): string {
  const terms: Record<string, Record<string, string>> = {
    wallet: {
      en: "wallet",
      es: "billetera",
      fr: "portefeuille",
      de: "Brieftasche",
      pt: "carteira",
      it: "portafoglio",
      zh: "钱包",
      ja: "ウォレット",
      ko: "지갑",
      hi: "वॉलेट",
      ar: "محفظة",
      ru: "кошелек",
      th: "กระเป๋าเงิน",
      vi: "ví",
      tr: "cüzdan",
      nl: "portemonnee",
      sv: "plånbok",
    },
    balance: {
      en: "balance",
      es: "saldo",
      fr: "solde",
      de: "Kontostand",
      pt: "saldo",
      it: "saldo",
      zh: "余额",
      ja: "残高",
      ko: "잔액",
      hi: "शेष राशि",
      ar: "رصيد",
      ru: "баланс",
      th: "ยอดคงเหลือ",
      vi: "số dư",
      tr: "bakiye",
      nl: "saldo",
      sv: "saldo",
    },
    transaction: {
      en: "transaction",
      es: "transacción",
      fr: "transaction",
      de: "Transaktion",
      pt: "transação",
      it: "transazione",
      zh: "交易",
      ja: "取引",
      ko: "거래",
      hi: "लेन-देन",
      ar: "معاملة",
      ru: "транзакция",
      th: "ธุรกรรม",
      vi: "giao dịch",
      tr: "işlem",
      nl: "transactie",
      sv: "transaktion",
    },
    // Add more financial terms as needed
  }

  return terms[term]?.[langCode] || terms[term]?.en || term
}
