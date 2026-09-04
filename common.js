// ============================================================
//  ОБЩИЕ ФУНКЦИИ для всех режимов (субтитры, чат, чанксы)
// ============================================================

// 1. Только lowercase
function toLower(text) {
  return text.toLowerCase();
}

// 2. Разбивка по --- (для субтитров и чата)
function splitBySeparator(text) {
  return text.split(/^\s*---\s*$/m).filter(s => s.trim());
}

// 3. Разбивка по знакам препинания (для всех режимов)
function splitByPunctuation(text) {
  const cleaned = text.replace(/[.,!?;:""''„”’‘‛‚“`´ʹʺʻʼˈˈˊˋˌ״〃＂〟〝〞‟′″‴‵‶‷❝❞〝〞〟＂｢｣—–\-]/g, '§');
  return cleaned.split(/§+/).filter(s => s.trim());
}

// 4. Разбивка по N слов (для всех режимов)
function splitByWords(text, count = 5) {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const result = [];
  for (let i = 0; i < words.length; i += count) {
    result.push(words.slice(i, i + count).join(' '));
  }
  return result;
}

// 5. Разбивка по предложениям (для чанксов)
function splitBySentences(text) {
  const parts = text.split(/([.!?]+\s*)/);
  const result = [];
  for (let i = 0; i < parts.length; i += 2) {
    const chunk = (parts[i] || '') + (parts[i + 1] || '');
    if (chunk.trim()) result.push(chunk.trim());
  }
  if (result.length === 0 && text.trim()) result.push(text.trim());
  return result;
}

// 6. Экранирование HTML
function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// 7. Универсальная навигация (вперёд/назад по пробелу/энтеру)
function setupNavigation(container, getState, setState) {
  container.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;

    const { index, items } = getState();
    if (!items || !items.length) return;

    const isForward = e.key === ' ' || e.key === 'Spacebar' || e.key === 'Space' || e.key === 'Enter';
    if (!isForward) return;

    e.preventDefault();
    let newIndex = index;
    if (e.shiftKey) {
      newIndex = Math.max(0, index - 1);
    } else {
      newIndex = Math.min(items.length - 1, index + 1);
    }
    if (newIndex !== index) {
      setState(newIndex);
    }
  });
}

// 8. Автоскролл к последнему элементу
function scrollToLast(container, selector) {
  const els = container.querySelectorAll(selector);
  if (!els.length) return;
  const last = els[els.length - 1];
  const containerRect = container.getBoundingClientRect();
  const elRect = last.getBoundingClientRect();
  if (elRect.bottom > containerRect.bottom) {
    last.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }
}