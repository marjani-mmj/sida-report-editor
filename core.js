// core.js
(function() {
    'use strict';

    // ========== رجیستری ==========
    window.handlersRegistry = {};
    window.registerSection = function(blockName, handlers) {
        window.handlersRegistry[blockName] = handlers;
    };

    // ========== شناسایی نوع کارنامه ==========
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

    // ========== پنل و آیکن شناور ==========
    var panel = null;
    var toggleIcon = null;
    var isPanelVisible = false;
    var dragState = { dragging: false, startX: 0, startY: 0, startLeft: 0, startTop: 0 };

    // ساخت آیکن شناور
    function createFloatingIcon() {
        if (toggleIcon) return;
        toggleIcon = document.createElement('div');
        toggleIcon.id = 'sida-floating-toggle';
        toggleIcon.innerHTML = '⚙️';
        toggleIcon.title = 'تنظیمات چاپ کارنامه';
        toggleIcon.style.cssText = [
            'position: fixed;',
            'bottom: 20px;',
            'right: 20px;',
            'z-index: 9999999;',
            'width: 44px;',
            'height: 44px;',
            'background: #ffc107;',
            'border-radius: 50%;',
            'display: flex;',
            'align-items: center;',
            'justify-content: center;',
            'font-size: 24px;',
            'cursor: pointer;',
            'box-shadow: 0 4px 8px rgba(0,0,0,0.3);',
            'user-select: none;'
        ].join('');
        toggleIcon.addEventListener('click', function() {
            if (!panel) createPanel();
            isPanelVisible = !isPanelVisible;
            panel.style.display = isPanelVisible ? 'block' : 'none';
            toggleIcon.innerHTML = isPanelVisible ? '🔧' : '⚙️';
        });
        document.body.appendChild(toggleIcon);
    }

    // ساخت پنل
    function createPanel() {
        if (panel) return;
        panel = document.createElement('div');
        panel.id = 'sida-editor-panel';
        panel.style.cssText = [
            'position: fixed; top: 100px; left: 20px; z-index: 999999;',
            'background: #fff; border: 1px solid #aaa; border-radius: 6px;',
            'box-shadow: 0 4px 12px rgba(0,0,0,0.3); padding: 10px; width: 220px;',
            'font-family: Tahoma, sans-serif; font-size: 13px; display: none; user-select: none;'
        ].join('');

        // نوار عنوان (قابل درگ)
        var titleBar = document.createElement('div');
        titleBar.style.cssText = 'cursor: move; background: #eee; padding: 4px 8px; margin: -10px -10px 8px -10px; border-radius: 6px 6px 0 0; font-weight: bold;';
        titleBar.textContent = 'تنظیمات چاپ';
        titleBar.addEventListener('mousedown', startDrag);
        panel.appendChild(titleBar);

        // بخش حاشیه‌ها
        var secMargin = document.createElement('div');
        secMargin.innerHTML = '<b>حاشیه‌ها</b> (۱px گام)';
        secMargin.style.marginBottom = '6px';
        panel.appendChild(secMargin);

        function addSpacingRow(label, incId, decId, dispId) {
            var row = document.createElement('div');
            row.style.cssText = 'display: flex; align-items: center; margin-bottom: 4px;';
            var lbl = document.createElement('span');
            lbl.textContent = label;
            lbl.style.width = '45px';
            lbl.style.textAlign = 'right';
            lbl.style.marginLeft = '5px';
            row.appendChild(lbl);

            var decBtn = document.createElement('button');
            decBtn.id = decId;
            decBtn.textContent = '−';
            decBtn.style.cssText = 'width: 26px; height: 26px; font-size: 16px; line-height: 1; margin: 0 3px;';
            row.appendChild(decBtn);

            var disp = document.createElement('div');
            disp.id = dispId;
            disp.style.cssText = 'width: 30px; text-align: center; font-weight: bold; color: #333;';
            disp.textContent = '0';
            row.appendChild(disp);

            var incBtn = document.createElement('button');
            incBtn.id = incId;
            incBtn.textContent = '+';
            incBtn.style.cssText = 'width: 26px; height: 26px; font-size: 16px; line-height: 1; margin: 0 3px;';
            row.appendChild(incBtn);

            panel.appendChild(row);
        }

        addSpacingRow('بالا', 'increaseTopBtn', 'decreaseTopBtn', 'topHeightDisp');
        addSpacingRow('پایین', 'increaseBottomBtn', 'decreaseBottomBtn', 'bottomHeightDisp');
        addSpacingRow('راست', 'increaseRightBtn', 'decreaseRightBtn', 'rightHeightDisp');
        addSpacingRow('چپ', 'increaseLeftBtn', 'decreaseLeftBtn', 'leftHeightDisp');

        // بخش فونت (رزرو)
        var secFont = document.createElement('div');
        secFont.innerHTML = '<b>فونت</b> (به‌زودی)';
        secFont.style.marginTop = '8px';
        secFont.style.color = '#888';
        panel.appendChild(secFont);

        document.body.appendChild(panel);

        // اتصال رویدادها پس از ساخت پنل
        attachEventListenersToPanel();
    }

    // ========== درگ پنل ==========
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

    // ========== اتصال event listenerها ==========
    function attachEventListenersToPanel() {
        var incTop = document.getElementById('increaseTopBtn');
        if (!incTop) return; // پنل هنوز آماده نیست (نباید رخ دهد)

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

        document.getElementById('increaseTopBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.increaseTop) h.increaseTop(displays); });
        document.getElementById('decreaseTopBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.decreaseTop) h.decreaseTop(displays); });
        document.getElementById('increaseBottomBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.increaseBottom) h.increaseBottom(displays); });
        document.getElementById('decreaseBottomBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.decreaseBottom) h.decreaseBottom(displays); });
        document.getElementById('increaseRightBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.increaseRight) h.increaseRight(displays); });
        document.getElementById('decreaseRightBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.decreaseRight) h.decreaseRight(displays); });
        document.getElementById('increaseLeftBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.increaseLeft) h.increaseLeft(displays); });
        document.getElementById('decreaseLeftBtn').addEventListener('click', function() { var h = getHandlers(); if (h && h.decreaseLeft) h.decreaseLeft(displays); });
    }

    // ========== راه‌اندازی ==========
    createFloatingIcon();  // آیکن شناور همیشه حاضر
    createPanel();         // پنل ساخته ولی مخفی می‌ماند
})();
