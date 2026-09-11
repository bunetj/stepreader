// shared/ui.js — shared menu reorganization.
// Byte-identical in subtitles and telegram; extracted verbatim.

function reorganizeMenu() {
    var toolbar = document.getElementById('toolbar');
    if (!toolbar) return;

    var sections = toolbar.querySelectorAll('.menu-section');
    if (sections.length < 2) return;

    var prepSection = null;
    var chunkSection = null;
    var otherSections = [];

    sections.forEach(function(section) {
        if (section.querySelector('#lowBtn') || section.querySelector('#punctBtn')) {
            prepSection = section;
        } else if (section.querySelector('#wordCountInput') || section.querySelector('#applyBtn')) {
            chunkSection = section;
        } else {
            otherSections.push(section);
        }
    });

    if (!prepSection && !chunkSection) return;

    var displayControls = document.createElement('div');
    displayControls.style.display = 'flex';
    displayControls.style.flexWrap = 'wrap';
    displayControls.style.gap = '4px 2px';
    displayControls.style.alignItems = 'center';
    displayControls.style.width = '100%';

    otherSections.forEach(function(section) {
        displayControls.appendChild(section.cloneNode(true));
    });

    toolbar.innerHTML = '';
    toolbar.appendChild(displayControls);

    var textboxArea = document.querySelector('.textbox-area');
    if (textboxArea) {
        var existingBottom = document.getElementById('toolbar-bottom');
        if (existingBottom) existingBottom.remove();

        var bottomToolbar = document.createElement('div');
        bottomToolbar.className = 'toolbar';
        bottomToolbar.id = 'toolbar-bottom';
        bottomToolbar.style.marginTop = '4px';

        var bottomContent = document.createElement('div');
        bottomContent.style.display = 'flex';
        bottomContent.style.flexWrap = 'wrap';
        bottomContent.style.gap = '4px 2px';
        bottomContent.style.alignItems = 'center';
        bottomContent.style.width = '100%';

        if (prepSection) bottomContent.appendChild(prepSection.cloneNode(true));
        if (chunkSection) bottomContent.appendChild(chunkSection.cloneNode(true));

        bottomToolbar.appendChild(bottomContent);
        textboxArea.parentNode.insertBefore(bottomToolbar, textboxArea.nextSibling);
    }
}
