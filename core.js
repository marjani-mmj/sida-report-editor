// core.js
(function() {
    'use strict';

    window.handlersRegistry = {};
    window.registerSection = function(blockName, handlers) {
        window.handlersRegistry[blockName] = handlers;
    };

    function identifyBlock() {
        var selectors = [
            { sel: '.container > .ng-scope', name: 'daftsrNatayej' },
            { sel: '.modal-body.main > .col-md-12.p-0.m-0.panel-body-print', name: 'sarbarg', extra: function(el) { return !el.querySelector('table.table.table-bordered.table-striped'); } },
            { sel: '#panel-print-rokesh > .col-md-12.p-0.m-0.panel-body-print.main', name: 'rookeshKoli' },
            { sel: '.col-md-12.panel-body-print > .ng-scope[ng-repeat="items in item"]', name: 'rookeshPayeei' },
            { sel: '.modal-body.main#print-content > .col-md-12.main.panel-body-print', name: 'polomp' },
            { sel: '.modal-body.main#print-content > .col-md-12.p-0.m-0.panel-body-print.panel-total-row > table.table.table-bordered.table-striped', name: 'amarKoli' }
        ];
        for (var i = 0; i < selectors.length; i++) {
            var el = document.querySelector(selectors[i].sel);
            if (el && (!selectors[i].extra || selectors[i].extra(el))) return selectors[i].name;
        }
        return 0;
    }

    var panel = null;
    var toggleIcon = null;
    var isPanelVisible = false;
    var dragState = { dragging: false, startX: 0, startY: 0, startLeft: 0, startTop: 0 };

    function createFloatingIcon() {
        if (toggleIcon) return;
        toggleIcon = document.createElement('div');
        toggleIcon.id = 'sida-floating-toggle';
        toggleIcon.innerHTML = '⚙️';
        toggleIcon.title = 'تنظیمات چاپ کارنامه';
        toggleIcon.style.cssText = [
            'position: fixed; bottom: 20px; right: 20px; z-index: 9999999;',
            'width: 48px; height: 48px; background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);',
            'border-radius: 50%; display: flex; align-items: center; justify-content: center;',
            'font-size: 26px; cursor: pointer; box-shadow: 0 6px 12px rgba(0,0,0,0.4);',
            'user-select: none; transition: transform 0.2s;'
        ].join('');
        toggleIcon.addEventListener('mouseenter', function() { this.style.transform = 'scale(1.1)'; });
        toggleIcon.addEventListener('mouseleave', function() { this.style.transform = 'scale(1)'; });
        toggleIcon.addEventListener('click', function() {
            if (!panel) createPanel();
            isPanelVisible = !isPanelVisible;
            panel.style.display = isPanelVisible ? 'block' : 'none';
            toggleIcon.innerHTML = isPanelVisible ? '🔧' : '⚙️';
        });
        document.body.appendChild(toggleIcon);
    }

    function createPanel() {
        if (panel) return;
        panel = document.createElement('div');
        panel.id = 'sida-editor-panel';
        panel.style.cssText = [
            'position: fixed; top: 100px; left: 20px; z-index: 999999;',
            'background: #ffffff; border: 1px solid #ddd; border-radius: 8px;',
            'box-shadow: 0 8px 20px rgba(0,0,0,0.2); padding: 12px; width: 300px;',
            'font-family: Tahoma, sans-serif; font-size: 13px; display: none; user-select: none;'
        ].join('');

        var titleBar = document.createElement('div');
        titleBar.style.cssText = 'cursor: move; background: #f8f9fa; padding: 6px 10px; margin: -12px -12px 10px -12px; border-radius: 8px 8px 0 0; font-weight: bold; color: #333; border-bottom: 1px solid #dee2e6;';
        titleBar.textContent = 'تنظیمات چاپ';
        titleBar.addEventListener('mousedown', startDrag);
        panel.appendChild(titleBar);

        var secMargin = document.createElement('div');
        secMargin.innerHTML = '<b style="color:#495057;">حاشیه‌ها</b>';
        secMargin.style.marginBottom = '8px';
        panel.appendChild(secMargin);

        function addFullDirectionRow(label, incFineId, decFineId, dispId, incCoarseId, decCoarseId) {
            var container = document.createElement('div');
            container.style.cssText = 'margin-bottom: 6px;';

            var row = document.createElement('div');
            row.style.cssText = 'display: flex; align-items: center;';

            var lbl = document.createElement('span');
            lbl.textContent = label;
            lbl.style.cssText = 'width: 45px; text-align: right; margin-left: 5px; font-weight:bold; color:#495057;';
            row.appendChild(lbl);

            // دکمه کاهش ۵px (سمت چپ منفی)
            var decCoarse = document.createElement('button');
            decCoarse.id = decCoarseId;
            decCoarse.textContent = '−۵';
            decCoarse.style.cssText = 'width: 32px; height: 28px; font-size: 13px; font-weight:bold; line-height:1; margin: 0 1px; background:#ffc9c9; border:1px solid #ff8787; border-radius:4px; cursor:pointer; color:#c92a2a;';
            row.appendChild(decCoarse);

            // دکمه کاهش ۱px
            var decFine = document.createElement('button');
            decFine.id = decFineId;
            decFine.textContent = '−';
            decFine.style.cssText = 'width: 28px; height: 28px; font-size: 16px; font-weight:bold; line-height:1; margin: 0 2px; background:#e9ecef; border:1px solid #ced4da; border-radius:4px; cursor:pointer; color:#495057;';
            row.appendChild(decFine);

            // نمایشگر
            var disp = document.createElement('div');
            disp.id = dispId;
            disp.style.cssText = 'width: 36px; text-align: center; font-weight: bold; font-size:14px; color: #0050ef;';
            disp.textContent = '0';
            row.appendChild(disp);

            // دکمه افزایش ۱px
            var incFine = document.createElement('button');
            incFine.id = incFineId;
            incFine.textContent = '+';
            incFine.style.cssText = 'width: 28px; height: 28px; font-size: 16px; font-weight:bold; line-height:1; margin: 0 2px; background:#e9ecef; border:1px solid #ced4da; border-radius:4px; cursor:pointer; color:#495057;';
            row.appendChild(incFine);

            // دکمه افزایش ۵px (سمت راست مثبت)
            var incCoarse = document.createElement('button');
            incCoarse.id = incCoarseId;
            incCoarse.textContent = '+۵';
            incCoarse.style.cssText = 'width: 32px; height: 28px; font-size: 13px; font-weight:bold; line-height:1; margin: 0 1px; background:#b2f2bb; border:1px solid #51cf66; border-radius:4px; cursor:pointer; color:#2b8a3e;';
            row.appendChild(incCoarse);

            container.appendChild(row);
            panel.appendChild(container);
        }

        addFullDirectionRow('بالا', 'increaseTopBtn', 'decreaseTopBtn', 'topHeightDisp', 'increaseTopCoarseBtn', 'decreaseTopCoarseBtn');
        addFullDirectionRow('پایین', 'increaseBottomBtn', 'decreaseBottomBtn', 'bottomHeightDisp', 'increaseBottomCoarseBtn', 'decreaseBottomCoarseBtn');
        addFullDirectionRow('راست', 'increaseRightBtn', 'decreaseRightBtn', 'rightHeightDisp', 'increaseRightCoarseBtn', 'decreaseRightCoarseBtn');
        addFullDirectionRow('چپ', 'increaseLeftBtn', 'decreaseLeftBtn', 'leftHeightDisp', 'increaseLeftCoarseBtn', 'decreaseLeftCoarseBtn');

        // دکمه اعمال فاصله‌ها
        var applyBtn = document.createElement('button');
        applyBtn.id = 'applySpacingBtn';
        applyBtn.textContent = 'اعمال فاصله‌ها';
        applyBtn.style.cssText = 'margin-top: 10px; width: 100%; padding: 6px; background: #0050ef; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: background 0.2s;';
        applyBtn.addEventListener('mouseenter', function() { this.style.background = '#003ecb'; });
        applyBtn.addEventListener('mouseleave', function() { this.style.background = '#0050ef'; });
        panel.appendChild(applyBtn);

        var secFont = document.createElement('div');
        secFont.innerHTML = '<b style="color:#495057;">فونت</b> (به‌زودی)';
        secFont.style.marginTop = '10px';
        secFont.style.color = '#888';
        panel.appendChild(secFont);

        document.body.appendChild(panel);
        attachEventListenersToPanel();
    }

    function startDrag(e) {
        e.preventDefault();
        dragState.dragging = true;
        dragState.startX = e.clientX;
        dragState.startY = e.clientY;
        dragState.startLeft = panel.offsetLeft;
        dragState.startTop = panel.offsetTop;
        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', stopDrag);
    }

    function onDrag(e) {
        if (!dragState.dragging) return;
        panel.style.left = (dragState.startLeft + e.clientX - dragState.startX) + 'px';
        panel.style.top = (dragState.startTop + e.clientY - dragState.startY) + 'px';
    }

    function stopDrag() {
        dragState.dragging = false;
        window.removeEventListener('mousemove', onDrag);
        window.removeEventListener('mouseup', stopDrag);
    }

    function attachEventListenersToPanel() {
        if (!document.getElementById('increaseTopBtn')) return;

        var displays = {
            topHeight: document.getElementById('topHeightDisp'),
            bottomHeight: document.getElementById('bottomHeightDisp'),
            rightHeight: document.getElementById('rightHeightDisp'),
            leftHeight: document.getElementById('leftHeightDisp')
        };

        function getHandlers() {
            var block = identifyBlock();
            return window.handlersRegistry[block] ? window.handlersRegistry[block].spacing : null;
        }

        // ۱px دکمه‌های
        document.getElementById('increaseTopBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.increaseTop) h.increaseTop(displays); });
        document.getElementById('decreaseTopBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.decreaseTop) h.decreaseTop(displays); });
        document.getElementById('increaseBottomBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.increaseBottom) h.increaseBottom(displays); });
        document.getElementById('decreaseBottomBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.decreaseBottom) h.decreaseBottom(displays); });
        document.getElementById('increaseRightBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.increaseRight) h.increaseRight(displays); });
        document.getElementById('decreaseRightBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.decreaseRight) h.decreaseRight(displays); });
        document.getElementById('increaseLeftBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.increaseLeft) h.increaseLeft(displays); });
        document.getElementById('decreaseLeftBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.decreaseLeft) h.decreaseLeft(displays); });

        // ۵px دکمه‌های
        document.getElementById('increaseTopCoarseBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.increaseTopCoarse) h.increaseTopCoarse(displays); });
        document.getElementById('decreaseTopCoarseBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.decreaseTopCoarse) h.decreaseTopCoarse(displays); });
        document.getElementById('increaseBottomCoarseBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.increaseBottomCoarse) h.increaseBottomCoarse(displays); });
        document.getElementById('decreaseBottomCoarseBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.decreaseBottomCoarse) h.decreaseBottomCoarse(displays); });
        document.getElementById('increaseRightCoarseBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.increaseRightCoarse) h.increaseRightCoarse(displays); });
        document.getElementById('decreaseRightCoarseBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.decreaseRightCoarse) h.decreaseRightCoarse(displays); });
        document.getElementById('increaseLeftCoarseBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.increaseLeftCoarse) h.increaseLeftCoarse(displays); });
        document.getElementById('decreaseLeftCoarseBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.decreaseLeftCoarse) h.decreaseLeftCoarse(displays); });

        document.getElementById('applySpacingBtn').addEventListener('click', function() {
            var block = identifyBlock();
            var handlers = window.handlersRegistry[block] ? window.handlersRegistry[block].spacing : null;
            if (handlers && handlers.applyStored) handlers.applyStored();
        });
    }

    createFloatingIcon();
    createPanel();
})();
