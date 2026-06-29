// panel-reportTosifi.js
(function() {
    'use strict';

    // فقط در صورتی اجرا می‌شود که صفحهٔ گزارش توصیفی وجود داشته باشد
    if (!document.querySelector('.reportTosifiSearch.print-panel')) return;

    var panel = null;
    var toggleIcon = null;
    var isPanelVisible = false;
    var dragState = { dragging: false, startX: 0, startY: 0, startLeft: 0, startTop: 0 };

    function minimizePanel() {
        if (!panel) return;
        isPanelVisible = false;
        panel.style.display = 'none';
        if (toggleIcon) toggleIcon.innerHTML = '📊';
    }
    window.minimizeReportPanel = minimizePanel; // در اختیار پنل کارنامه

    function createFloatingIcon() {
        if (toggleIcon) return;
        toggleIcon = document.createElement('div');
        toggleIcon.id = 'reportTosifi-floating-toggle';
        toggleIcon.innerHTML = '📊';
        toggleIcon.title = 'تنظیمات گزارش پیشرفت تحصیلی';
        toggleIcon.style.cssText = [
            'position: fixed; bottom: 20px; right: 80px; z-index: 9999999;',
            'width: 48px; height: 48px; background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);',
            'border-radius: 50%; display: flex; align-items: center; justify-content: center;',
            'font-size: 26px; cursor: pointer; box-shadow: 0 6px 12px rgba(0,0,0,0.4);',
            'user-select: none; transition: transform 0.2s;'
        ].join('');
        toggleIcon.addEventListener('mouseenter', function() { this.style.transform = 'scale(1.1)'; });
        toggleIcon.addEventListener('mouseleave', function() { this.style.transform = 'scale(1)'; });
        toggleIcon.addEventListener('click', function() {
            if (!panel) createPanel();
            if (isPanelVisible) {
                minimizePanel();
            } else {
                // بستن پنل کارنامه در صورت باز بودن
                if (window.minimizeMainPanel) window.minimizeMainPanel();
                isPanelVisible = true;
                panel.style.display = 'block';
                toggleIcon.innerHTML = '🔧';
            }
        });
        document.body.appendChild(toggleIcon);
    }

    function createPanel() {
        if (panel) return;
        panel = document.createElement('div');
        panel.id = 'reportTosifi-editor-panel';
        panel.style.cssText = [
            'position: fixed; top: 100px; right: 20px; z-index: 999999;',
            'background: #ffffff; border: 1px solid #ddd; border-radius: 8px;',
            'box-shadow: 0 8px 20px rgba(0,0,0,0.2); padding: 12px; width: 300px;',
            'font-family: Tahoma, sans-serif; font-size: 13px; display: none; user-select: none;'
        ].join('');

        var titleBar = document.createElement('div');
        titleBar.style.cssText = 'cursor: move; background: #f8f9fa; padding: 6px 30px 6px 10px; margin: -12px -12px 10px -12px; border-radius: 8px 8px 0 0; font-weight: bold; color: #333; border-bottom: 1px solid #dee2e6; position: relative;';
        titleBar.textContent = 'تنظیمات گزارش';
        titleBar.addEventListener('mousedown', startDrag);

        var closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = 'position: absolute; top: 4px; left: 8px; font-size: 18px; font-weight: bold; color: #888; cursor: pointer; line-height: 1;';
        closeBtn.title = 'بستن پنل';
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            minimizePanel();
        });
        closeBtn.addEventListener('mouseenter', function() { this.style.color = '#e74c3c'; });
        closeBtn.addEventListener('mouseleave', function() { this.style.color = '#888'; });
        titleBar.appendChild(closeBtn);
        panel.appendChild(titleBar);

        var secMargin = document.createElement('div');
        secMargin.innerHTML = '<b style="color:#495057;">حاشیه‌ها</b>';
        secMargin.style.marginBottom = '8px';
        panel.appendChild(secMargin);

        function addDirectionRow(label, incFineId, decFineId, dispId, incCoarseId, decCoarseId) {
            var container = document.createElement('div');
            container.style.cssText = 'margin-bottom: 6px;';
            var row = document.createElement('div');
            row.style.cssText = 'display: flex; align-items: center;';

            var lbl = document.createElement('span');
            lbl.textContent = label;
            lbl.style.cssText = 'width: 45px; text-align: right; margin-left: 5px; font-weight:bold; color:#495057;';
            row.appendChild(lbl);

            var decCoarse = document.createElement('button');
            decCoarse.id = decCoarseId;
            decCoarse.textContent = '−۵';
            decCoarse.style.cssText = 'width: 32px; height: 28px; font-size: 13px; font-weight:bold; line-height:1; margin: 0 1px; background:#ffc9c9; border:1px solid #ff8787; border-radius:4px; cursor:pointer; color:#c92a2a;';
            row.appendChild(decCoarse);

            var decFine = document.createElement('button');
            decFine.id = decFineId;
            decFine.textContent = '−';
            decFine.style.cssText = 'width: 28px; height: 28px; font-size: 16px; font-weight:bold; line-height:1; margin: 0 2px; background:#e9ecef; border:1px solid #ced4da; border-radius:4px; cursor:pointer; color:#495057;';
            row.appendChild(decFine);

            var disp = document.createElement('div');
            disp.id = dispId;
            disp.style.cssText = 'width: 36px; text-align: center; font-weight: bold; font-size:14px; color: #0050ef;';
            disp.textContent = '0';
            row.appendChild(disp);

            var incFine = document.createElement('button');
            incFine.id = incFineId;
            incFine.textContent = '+';
            incFine.style.cssText = 'width: 28px; height: 28px; font-size: 16px; font-weight:bold; line-height:1; margin: 0 2px; background:#e9ecef; border:1px solid #ced4da; border-radius:4px; cursor:pointer; color:#495057;';
            row.appendChild(incFine);

            var incCoarse = document.createElement('button');
            incCoarse.id = incCoarseId;
            incCoarse.textContent = '+۵';
            incCoarse.style.cssText = 'width: 32px; height: 28px; font-size: 13px; font-weight:bold; line-height:1; margin: 0 1px; background:#b2f2bb; border:1px solid #51cf66; border-radius:4px; cursor:pointer; color:#2b8a3e;';
            row.appendChild(incCoarse);

            container.appendChild(row);
            panel.appendChild(container);
        }

        // شناسه‌های یکتا برای گزارش
        addDirectionRow('بالا', 'reportTosifi-increaseTopBtn', 'reportTosifi-decreaseTopBtn', 'reportTosifi-topHeightDisp', 'reportTosifi-increaseTopCoarseBtn', 'reportTosifi-decreaseTopCoarseBtn');
        addDirectionRow('پایین', 'reportTosifi-increaseBottomBtn', 'reportTosifi-decreaseBottomBtn', 'reportTosifi-bottomHeightDisp', 'reportTosifi-increaseBottomCoarseBtn', 'reportTosifi-decreaseBottomCoarseBtn');
        addDirectionRow('راست', 'reportTosifi-increaseRightBtn', 'reportTosifi-decreaseRightBtn', 'reportTosifi-rightHeightDisp', 'reportTosifi-increaseRightCoarseBtn', 'reportTosifi-decreaseRightCoarseBtn');
        addDirectionRow('پهنا', 'reportTosifi-increaseWidthBtn', 'reportTosifi-decreaseWidthBtn', 'reportTosifi-widthDisp', 'reportTosifi-increaseWidthCoarseBtn', 'reportTosifi-decreaseWidthCoarseBtn');

        var applyBtn = document.createElement('button');
        applyBtn.id = 'reportTosifi-applySpacingBtn';
        applyBtn.textContent = 'اعمال فاصله‌ها';
        applyBtn.style.cssText = 'margin-top: 10px; width: 100%; padding: 6px; background: #0050ef; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: background 0.2s;';
        applyBtn.addEventListener('mouseenter', function() { this.style.background = '#003ecb'; });
        applyBtn.addEventListener('mouseleave', function() { this.style.background = '#0050ef'; });
        panel.appendChild(applyBtn);

        var footerText = document.createElement('div');
        footerText.style.cssText = 'margin-top: 12px; text-align: center; font-size: 11px; color: #adb5bd; line-height: 1.6;';
        footerText.innerHTML = 'اداره کل آموزش و پرورش خراسان رضوی<br>آموزش و پرورش خلیل آباد <br>کارشناسی سنجش - marjani.mmj@gmail.com';
        panel.appendChild(footerText);

        document.body.appendChild(panel);
        attachEventListeners();
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

    function attachEventListeners() {
        if (!document.getElementById('reportTosifi-increaseTopBtn')) return;

        var displays = {
            topHeight: document.getElementById('reportTosifi-topHeightDisp'),
            bottomHeight: document.getElementById('reportTosifi-bottomHeightDisp'),
            rightHeight: document.getElementById('reportTosifi-rightHeightDisp'),
            widthDisp: document.getElementById('reportTosifi-widthDisp')
        };

        var handlers = window.handlersRegistry['reportTosifi'] ? window.handlersRegistry['reportTosifi'].spacing : null;
        if (!handlers) {
            console.warn('handlers for reportTosifi not found');
            return;
        }

        document.getElementById('reportTosifi-increaseTopBtn').addEventListener('click', function() { handlers.increaseTop(displays); });
        document.getElementById('reportTosifi-decreaseTopBtn').addEventListener('click', function() { handlers.decreaseTop(displays); });
        document.getElementById('reportTosifi-increaseTopCoarseBtn').addEventListener('click', function() { handlers.increaseTopCoarse(displays); });
        document.getElementById('reportTosifi-decreaseTopCoarseBtn').addEventListener('click', function() { handlers.decreaseTopCoarse(displays); });

        document.getElementById('reportTosifi-increaseBottomBtn').addEventListener('click', function() { handlers.increaseBottom(displays); });
        document.getElementById('reportTosifi-decreaseBottomBtn').addEventListener('click', function() { handlers.decreaseBottom(displays); });
        document.getElementById('reportTosifi-increaseBottomCoarseBtn').addEventListener('click', function() { handlers.increaseBottomCoarse(displays); });
        document.getElementById('reportTosifi-decreaseBottomCoarseBtn').addEventListener('click', function() { handlers.decreaseBottomCoarse(displays); });

        document.getElementById('reportTosifi-increaseRightBtn').addEventListener('click', function() { handlers.increaseRight(displays); });
        document.getElementById('reportTosifi-decreaseRightBtn').addEventListener('click', function() { handlers.decreaseRight(displays); });
        document.getElementById('reportTosifi-increaseRightCoarseBtn').addEventListener('click', function() { handlers.increaseRightCoarse(displays); });
        document.getElementById('reportTosifi-decreaseRightCoarseBtn').addEventListener('click', function() { handlers.decreaseRightCoarse(displays); });

        document.getElementById('reportTosifi-increaseWidthBtn').addEventListener('click', function() { handlers.increaseWidth(displays); });
        document.getElementById('reportTosifi-decreaseWidthBtn').addEventListener('click', function() { handlers.decreaseWidth(displays); });
        document.getElementById('reportTosifi-increaseWidthCoarseBtn').addEventListener('click', function() { handlers.increaseWidthCoarse(displays); });
        document.getElementById('reportTosifi-decreaseWidthCoarseBtn').addEventListener('click', function() { handlers.decreaseWidthCoarse(displays); });

        document.getElementById('reportTosifi-applySpacingBtn').addEventListener('click', function() {
            if (handlers.applyStored) handlers.applyStored();
        });
    }

    // اگر فایل section-reportTosifi.js قبلاً handlers را ثبت کرده باشد، پنل را می‌سازیم
    // در غیر این صورت صبر می‌کنیم (اما معمولاً ترتیب بارگذاری درست است)
    if (window.handlersRegistry['reportTosifi']) {
        createFloatingIcon();
        createPanel();
    } else {
        // اگر handlers هنوز بارگذاری نشده، صبر می‌کنیم
        var checkInterval = setInterval(function() {
            if (window.handlersRegistry['reportTosifi']) {
                clearInterval(checkInterval);
                createFloatingIcon();
                createPanel();
            }
        }, 100);
    }
})();
