// core.js
(function() {
    'use strict';

    // ========== رجیستری عمومی ==========
    window.handlersRegistry = {};

    window.registerSection = function(blockName, handlers) {
        window.handlersRegistry[blockName] = handlers;
    };

    // ========== شناسایی نوع کارنامه ==========
    function identifyBlock() {
        // ترتیب اولویت بر اساس ساختار فعلی سیدا
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
            if (el && (!selectors[i].extra || selectors[i].extra(el))) {
                return selectors[i].name;
            }
        }
        return 0;
    }

    // ========== پنل شناور ==========
    var panel = null;
    var isPanelVisible = false;
    var dragState = { dragging: false, startX: 0, startY: 0, startLeft: 0, startTop: 0 };

    function createPanel() {
        if (panel) return;

        // پنل اصلی
        panel = document.createElement('div');
        panel.id = 'sida-editor-panel';
        panel.style.cssText = [
            'position: fixed;',
            'top: 100px;',
            'left: 20px;',
            'z-index: 999999;',
            'background: #fff;',
            'border: 1px solid #aaa;',
            'border-radius: 6px;',
            'box-shadow: 0 4px 12px rgba(0,0,0,0.3);',
            'padding: 10px;',
            'width: 220px;',
            'font-family: Tahoma, sans-serif;',
            'font-size: 13px;',
            'display: none;',
            'user-select: none;'
        ].join('');

        // نوار عنوان برای درگ
        var titleBar = document.createElement('div');
        titleBar.style.cssText = 'cursor: move; background: #eee; padding: 4px 8px; margin: -10px -10px 8px -10px; border-radius: 6px 6px 0 0; font-weight: bold;';
        titleBar.textContent = 'تنظیمات چاپ';
        titleBar.addEventListener('mousedown', startDrag);
        panel.appendChild(titleBar);

        // ---------- بخش حاشیه‌ها ----------
        var secMargin = document.createElement('div');
        secMargin.innerHTML = '<b>حاشیه‌ها</b> (۱px گام)';
        secMargin.style.marginBottom = '6px';
        panel.appendChild(secMargin);

        // ساخت یک خط کنترل برای هر جهت
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

        // ---------- بخش فونت (فضای خالی برای بعد) ----------
        var secFont = document.createElement('div');
        secFont.innerHTML = '<b>فونت</b> (به‌زودی)';
        secFont.style.marginTop = '8px';
        secFont.style.color = '#888';
        panel.appendChild(secFont);

        document.body.appendChild(panel);
    }

    // ========== درگ کردن پنل ==========
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
        var dx = e.clientX - dragState.startX;
        var dy = e.clientY - dragState.startY;
        panel.style.left = (dragState.startLeft + dx) + 'px';
        panel.style.top = (dragState.startTop + dy) + 'px';
    }

    function stopDrag() {
        dragState.dragging = false;
        window.removeEventListener('mousemove', onDrag);
        window.removeEventListener('mouseup', stopDrag);
    }

    // ========== دکمه تاگل در نوار ابزار سیدا ==========
    function injectToolbarToggle() {
        // نوار ابزار در modal-header است
        var header = document.querySelector('.modal-header.topbar-modal');
        if (!header) return;

        // جلوگیری از ساخت دکمه تکراری
        if (document.getElementById('sida-toggle-btn')) return;

        var toggleBtn = document.createElement('button');
        toggleBtn.id = 'sida-toggle-btn';
        toggleBtn.textContent = '⚙️';
        toggleBtn.title = 'تنظیمات چاپ کارنامه';
        toggleBtn.style.cssText = [
            'float: left;',
            'margin-right: 10px;',
            'background: #ffc107;',
            'border: none;',
            'font-size: 18px;',
            'cursor: pointer;',
            'border-radius: 4px;',
            'padding: 2px 8px;'
        ].join('');

        toggleBtn.addEventListener('click', function() {
            if (!panel) createPanel();
            isPanelVisible = !isPanelVisible;
            panel.style.display = isPanelVisible ? 'block' : 'none';
            toggleBtn.textContent = isPanelVisible ? '🔧' : '⚙️';
        });

        // افزودن به ابتدای هدر (قبل از دکمه بستن)
        var closeIcon = header.querySelector('i[data-dismiss="modal"], i.fa-times');
        if (closeIcon) {
            header.insertBefore(toggleBtn, closeIcon);
        } else {
            header.appendChild(toggleBtn);
        }
    }

    // ========== نصب رویدادها روی پنل ==========
    function bindPanelEvents() {
        // بعد از ساخته شدن پنل (در صورت نیاز به تاخیر)، این تابع را صدا می‌زنیم.
        // ولی چون پنل ممکن است هنوز ساخته نشده باشد، از observer استفاده می‌کنیم.
        var observer = new MutationObserver(function(mutations) {
            if (document.getElementById('increaseTopBtn')) {
                observer.disconnect();
                attachEventListenersToPanel();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function attachEventListenersToPanel() {
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

        // بالا
        document.getElementById('increaseTopBtn').addEventListener('click', function() {
            var h = getHandlers(); if (h && h.increaseTop) h.increaseTop(displays);
        });
        document.getElementById('decreaseTopBtn').addEventListener('click', function() {
            var h = getHandlers(); if (h && h.decreaseTop) h.decreaseTop(displays);
        });
        // پایین
        document.getElementById('increaseBottomBtn').addEventListener('click', function() {
            var h = getHandlers(); if (h && h.increaseBottom) h.increaseBottom(displays);
        });
        document.getElementById('decreaseBottomBtn').addEventListener('click', function() {
            var h = getHandlers(); if (h && h.decreaseBottom) h.decreaseBottom(displays);
        });
        // راست
        document.getElementById('increaseRightBtn').addEventListener('click', function() {
            var h = getHandlers(); if (h && h.increaseRight) h.increaseRight(displays);
        });
        document.getElementById('decreaseRightBtn').addEventListener('click', function() {
            var h = getHandlers(); if (h && h.decreaseRight) h.decreaseRight(displays);
        });
        // چپ
        document.getElementById('increaseLeftBtn').addEventListener('click', function() {
            var h = getHandlers(); if (h && h.increaseLeft) h.increaseLeft(displays);
        });
        document.getElementById('decreaseLeftBtn').addEventListener('click', function() {
            var h = getHandlers(); if (h && h.decreaseLeft) h.decreaseLeft(displays);
        });
    }

    // ========== راه‌اندازی ==========
    createPanel();        // پنل ساخته می‌شود ولی مخفی است
    injectToolbarToggle();// دکمه در هدر قرار می‌گیرد
    bindPanelEvents();    // منتظر پنل می‌ماند و eventها را وصل می‌کند

})();
