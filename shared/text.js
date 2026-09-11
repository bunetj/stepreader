// shared/text.js — shared text helpers (extracted verbatim from apps)
// Apps must NOT redefine these locally.

function splitByBlankLines(text) {
    return text.split(/\n\s*\n/).filter(s => s.trim() !== '');
}

function splitBySeparator(text, sep) {
    // sep is a string like '\n---\n'; kept explicit so Telegram and
    // Subtitles/LED can use different delimiters without forking logic.
    return text.split(sep).filter(s => s.trim() !== '');
}

function splitWords(text, n) {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const chunks = [];
    for (let i = 0; i < words.length; i += n) {
        chunks.push(words.slice(i, i + n).join(' '));
    }
    return chunks;
}

function toLower(text) {
    let output = text.replace(/—/g, '-').replace(/–/g, '-').replace(/ -- /g, ' - ');
    output = output.replace(/[""]/g, '"').replace(/['']/g, "'").replace(/[‚‛]/g, "'")
        .replace(/[„“”]/g, '"').replace(/[’‘]/g, "'").replace(/[‹›]/g, "'")
        .replace(/[«»]/g, '"');
    const parts = output.split(/(\s+)/);
    const result = [];
    for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (!/[a-zA-Zа-яА-Я]/.test(p)) { result.push(p); continue; }
        const latinOnly = p.replace(/[^a-zA-Z]/g, '');
        const isLatinCaps = latinOnly.length >= 2 && latinOnly === latinOnly.toUpperCase();
        const cyrOnly = p.replace(/[^а-яА-Я]/g, '');
        const isCyrCaps = cyrOnly.length >= 2 && cyrOnly === cyrOnly.toUpperCase();
        if (isLatinCaps || isCyrCaps) { result.push(p); continue; }
        result.push(p.toLowerCase());
    }
    return result.join('');
}

function removePunctuation(text) {
    return text.replace(/[^\w\s\n]/g, '');
}

function splitPunct(text) {
    // Split on . , ! ? ; : only when followed by whitespace or end of string.
    // Keeps URLs (https://...), times (10:30), decimals (1.5), etc. intact.
    const chars = '. , ! ? ; :'.split(' ');
    const punctClass = '.!?;:';
    const lines = [];
    let current = '';
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        current += c;
        if (punctClass.indexOf(c) !== -1) {
            const next = text[i + 1];
            if (next === undefined || /\s/.test(next)) {
                lines.push(current);
                current = '';
            }
        }
    }
    if (current) lines.push(current);
    return lines.map(function (s) { return s.trim(); }).filter(function (s) { return s; });
}

function splitSentences(text) {
    const result = [];
    let start = 0;
    let i = 0;
    while (i < text.length) {
        if (text[i] === '…' || (text[i] === '.' && text[i + 1] === '.' && text[i + 2] === '.')) {
            const len = text[i] === '…' ? 1 : 3;
            const next = text[i + len] || '';
            if (next === ' ' || next === '\n' || next === '\t' || !next) {
                result.push(text.slice(start, i + len));
                start = i + len;
                i += len;
                continue;
            }
        }
        if (text[i] === '.' || text[i] === '!' || text[i] === '?') {
            const next = text[i + 1] || '';
            if (next === ' ' || next === '\n' || next === '\t' || !next) {
                result.push(text.slice(start, i + 1));
                start = i + 1;
            }
        }
        i++;
    }
    if (start < text.length) result.push(text.slice(start));
    return result.length ? result : [text];
}

function applyLow(text, settings) {
    let result = text;
    if (settings.lowercase) result = toLower(result);
    if (settings.noPunct) result = removePunctuation(result);
    if (settings.oneLine) result = result.replace(/\s+/g, ' ').trim();
    return result;
}
