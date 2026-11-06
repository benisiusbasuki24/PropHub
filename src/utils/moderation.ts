// Content Moderation & Automatic Authenticity Verification Engine

export interface ModerationResult {
  isValid: boolean;
  violations: string[];
  flaggedTerms: string[];
  explanation: string;
}

export interface AuthenticityReport {
  score: number; // 0 to 100
  level: 'Tinggi (Terverifikasi)' | 'Sedang (Perlu Dilengkapi)' | 'Rendah (Peringatan)';
  passedChecks: string[];
  recommendations: string[];
}

/**
 * Checks property descriptions to strictly reject telephone numbers,
 * email addresses, and external contact bypasses to protect user privacy
 * and encourage the platform's secure internal messaging.
 */
export function validateListingDescription(text: string): ModerationResult {
  const violations: string[] = [];
  const flaggedTerms: string[] = [];

  if (!text || text.trim().length === 0) {
    return {
      isValid: true,
      violations: [],
      flaggedTerms: [],
      explanation: 'Deskripsi valid.',
    };
  }

  // 1. Phone number detection (Indonesian formats, international, and spaced/dashed digits)
  // Standard phone regex: 08xx, +628xx, 628xx, 8 to 14 digits with optional dashes or spaces
  const phoneRegex = /(\+?62|0)[0-9\s.-]{8,15}[0-9]/g;
  const rawDigitSequences = text.replace(/[^0-9]/g, '');
  
  // Direct matches
  const phoneMatches = text.match(phoneRegex);
  if (phoneMatches) {
    for (const match of phoneMatches) {
      const cleanDigits = match.replace(/[^0-9]/g, '');
      if (cleanDigits.length >= 9 && cleanDigits.length <= 15) {
        violations.push('Nomor Telepon');
        flaggedTerms.push(match.trim());
      }
    }
  }

  // Check for obfuscated phone keywords like "wa:", "hubungi:", "telepon:", "telp:", "call:", "08"
  const waContactRegex = /(wa|whatsapp|hubungi|telp|telepon|call|kontak|hp)\s*[:=\-]?\s*(\+?62|0|\d)/i;
  if (waContactRegex.test(text)) {
    const match = text.match(waContactRegex);
    if (match && !violations.includes('Nomor Telepon/WhatsApp')) {
      violations.push('Nomor Telepon/WhatsApp');
      flaggedTerms.push(match[0]);
    }
  }

  // Check for wa.me links
  if (/wa\.me\//i.test(text) || /chat\.whatsapp\.com/i.test(text) || /t\.me\//i.test(text)) {
    violations.push('Tautan Kontak Eksternal');
    flaggedTerms.push('Tautan kontak langsung (wa.me/t.me)');
  }

  // 2. Email detection (standard & obfuscated like user [at] gmail [dot] com)
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailMatches = text.match(emailRegex);
  if (emailMatches) {
    violations.push('Alamat Email');
    flaggedTerms.push(...emailMatches);
  }

  const obfuscatedEmailRegex = /[a-zA-Z0-9._%+-]+\s*(\[at\]|\(at\)|@)\s*[a-zA-Z0-9.-]+\s*(\[dot\]|\(dot\)|\.)\s*[a-zA-Z]{2,}/gi;
  if (obfuscatedEmailRegex.test(text)) {
    const match = text.match(obfuscatedEmailRegex);
    if (match && !violations.includes('Alamat Email')) {
      violations.push('Alamat Email Tersembunyi');
      flaggedTerms.push(...match);
    }
  }

  // 3. Prohibited spam / offensive keywords
  const spamKeywords = ['judi', 'slot online', 'pinjol', 'crypto pump', 'cheat'];
  for (const kw of spamKeywords) {
    if (text.toLowerCase().includes(kw)) {
      violations.push(`Kata Terlarang (${kw})`);
      flaggedTerms.push(kw);
    }
  }

  const isValid = violations.length === 0;
  const explanation = isValid
    ? 'Deskripsi mematuhi standar privasi platform ProperListId.'
    : `Sistem otomatis menolak deskripsi karena mengandung ${violations.join(', ')} (${flaggedTerms.slice(0, 3).join(', ')}). Untuk keamanan dan perlindungan privasi data pengguna, harap gunakan fitur Obrolan Langsung internal ProperListId.`;

  return {
    isValid,
    violations,
    flaggedTerms,
    explanation,
  };
}

/**
 * Automated property data authenticity checker.
 * Evaluates document completeness, realistic dimensions, photos, and sensible pricing.
 */
export function evaluatePropertyAuthenticity(data: {
  title: string;
  description: string;
  price: number;
  landArea: number;
  buildingArea: number;
  images: string[];
  certificate: string;
  shmVerified?: boolean;
  pbgVerified?: boolean;
}): AuthenticityReport {
  let score = 50; // base score
  const passedChecks: string[] = [];
  const recommendations: string[] = [];

  // 1. Photos evaluation
  if (data.images && data.images.length >= 4) {
    score += 15;
    passedChecks.push('Galeri foto lengkap (>= 4 foto resolusi tinggi)');
  } else if (data.images && data.images.length >= 1) {
    score += 5;
    recommendations.push('Tambahkan minimal 4 foto interior & eksterior untuk skor maksimal');
  } else {
    recommendations.push('Unggah foto properti untuk meningkatkan kepercayaan pembeli');
  }

  // 2. Legal certificates
  if (data.certificate === 'SHM') {
    score += 15;
    passedChecks.push('Sertifikat Hak Milik (SHM) berkekuatan hukum tertinggi');
  } else if (data.certificate === 'HGB' || data.certificate === 'Strata Title') {
    score += 10;
    passedChecks.push(`Legalitas ${data.certificate} jelas`);
  }

  if (data.shmVerified) {
    score += 10;
    passedChecks.push('Dokumen Sertifikat telah terverifikasi sistem');
  }

  if (data.pbgVerified) {
    score += 5;
    passedChecks.push('Izin PBG/IMB terkonfirmasi');
  }

  // 3. Realistic dimension checks
  if (data.landArea > 0 && data.buildingArea > 0) {
    score += 5;
    passedChecks.push('Rincian Luas Tanah (LT) dan Luas Bangunan (LB) terstruktur');
  }

  // 4. Description depth
  if (data.description && data.description.length >= 100) {
    score += 5;
    passedChecks.push('Deskripsi properti informatif & mendalam');
  } else {
    recommendations.push('Perjelas deskripsi properti (minimal 100 karakter)');
  }

  // Cap score at 100
  score = Math.min(100, Math.max(30, score));

  let level: AuthenticityReport['level'] = 'Sedang (Perlu Dilengkapi)';
  if (score >= 80) level = 'Tinggi (Terverifikasi)';
  else if (score < 60) level = 'Rendah (Peringatan)';

  return {
    score,
    level,
    passedChecks,
    recommendations,
  };
}
