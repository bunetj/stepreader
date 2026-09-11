// shared/prep.js — shared Prep popup and chunking.
// Uses shared/modal.css classes so all apps look the same.

function showLowPopup(inputEl, joinWith) {
    var existing = document.getElementById('__lowPopup');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = '__lowPopup';
    overlay.className = 'modal active';

    var box = document.createElement('div');
    box.className = 'modal-box';
    box.innerHTML =
        '<h3>Text Prep</h3>' +
        '<div class="sub">Apply to script</div>' +
        '<label><input type="checkbox" id="lowLower" checked> Lowercase</label>' +
        '<label><input type="checkbox" id="lowNoPunct"> Remove punctuation</label>' +
        '<label><input type="checkbox" id="lowOneLine"> One line</label>' +
        '<div class="btn-row">' +
        '   <button class="btn-cancel" id="lowCancel">Cancel</button>' +
        '   <button class="btn-save" id="lowApply">Apply</button>' +
        '</div>';
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    function close() { if (overlay.parentNode) overlay.remove(); }

    function apply() {
        var settings = {
            lowercase: document.getElementById('lowLower').checked,
            noPunct: document.getElementById('lowNoPunct').checked,
            oneLine: document.getElementById('lowOneLine').checked,
        };
        var raw = inputEl.value;
        var blocks = splitByBlankLines(raw);
        var transformed = blocks.map(function (b) { return applyLow(b, settings); })
                                .filter(function (b) { return b.trim(); });
        inputEl.value = transformed.join(joinWith);
        close();
    }

    box.querySelector('#lowCancel').onclick = close;
    box.querySelector('#lowApply').onclick = apply;
    overlay.onclick = function (e) { if (e.target === overlay) close(); };

    document.addEventListener('keydown', function onKey(e) {
        if (!document.getElementById('__lowPopup')) {
            document.removeEventListener('keydown', onKey);
            return;
        }
        if (e.key === 'Escape') {
            e.preventDefault(); close();
            document.removeEventListener('keydown', onKey);
        } else if (e.key === 'Enter') {
            if (e.target && e.target.tagName === 'TEXTAREA') return;
            e.preventDefault(); apply();
            document.removeEventListener('keydown', onKey);
        }
    });

    setTimeout(function () { document.getElementById('lowLower').focus(); }, 50);
}

function applyChunking(inputEl, joinWith) {
    var inputElCount = document.getElementById('wordCountInput');
    var n = parseInt(inputElCount ? inputElCount.value : 3) || 3;
    var raw = inputEl.value;
    var blocks = splitByBlankLines(raw);
    if (!blocks.length) return;
    var result = [];
    for (var i = 0; i < blocks.length; i++) {
        var chunks = splitWords(blocks[i], n);
        for (var j = 0; j < chunks.length; j++) {
            if (chunks[j].trim()) result.push(chunks[j]);
        }
    }
    if (result.length) {
        inputEl.value = result.join(joinWith);
    }
}
