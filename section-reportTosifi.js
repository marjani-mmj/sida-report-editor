// section-reportTosifi.js
(function() {
    'use strict';

    var lastTop = 0, lastBottom = 0, lastRight = 0, lastWidth = 1090;

    function initStoredValues() {
        var cards = document.querySelectorAll('[ng-repeat="rowItem in dataItems"]');
        if (cards.length > 0) {
            var firstCard = cards[0];
            lastRight = parseInt(window.getComputedStyle(firstCard).marginRight) || 0;
            lastWidth = parseInt(window.getComputedStyle(firstCard).width) || 1090;
        }
        updateDisplays();
    }

    function updateDisplays() {
        var dt = document.getElementById('reportTosifi-topHeightDisp'); if (dt) dt.textContent = lastTop;
        var db = document.getElementById('reportTosifi-bottomHeightDisp'); if (db) db.textContent = lastBottom;
        var dr = document.getElementById('reportTosifi-rightHeightDisp'); if (dr) dr.textContent = lastRight;
        var dw = document.getElementById('reportTosifi-widthDisp'); if (dw) dw.textContent = lastWidth;
    }

    function ensureSpacersExist() {
        if (document.querySelector('.reportTosifi-spacer-top')) return;

        var cards = document.querySelectorAll('[ng-repeat="rowItem in dataItems"]');
        cards.forEach(function(card) {
            var topSpacer = document.createElement('div');
            topSpacer.className = 'reportTosifi-spacer reportTosifi-spacer-top';
            topSpacer.style.height = '0px';
            card.parentNode.insertBefore(topSpacer, card);

            var bottomSpacer = document.createElement('div');
            bottomSpacer.className = 'reportTosifi-spacer reportTosifi-spacer-bottom';
            bottomSpacer.style.height = '0px';
            card.parentNode.insertBefore(bottomSpacer, card.nextSibling);
        });
    }

    function adjustSpacing(selector, amount, display) {
        var spacers = document.querySelectorAll(selector);
        var newHeight = 0;
        spacers.forEach(function(spacer) {
            var cur = parseInt(spacer.style.height) || 0;
            newHeight = Math.max(0, cur + amount);
            spacer.style.height = newHeight + 'px';
        });
        if (spacers.length > 0) {
            if (selector === '.reportTosifi-spacer-top') lastTop = newHeight;
            else if (selector === '.reportTosifi-spacer-bottom') lastBottom = newHeight;
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
        ensureSpacersExist();
        document.querySelectorAll('.reportTosifi-spacer-top').forEach(function(s) { s.style.height = lastTop + 'px'; });
        document.querySelectorAll('.reportTosifi-spacer-bottom').forEach(function(s) { s.style.height = lastBottom + 'px'; });
        document.querySelectorAll('[ng-repeat="rowItem in dataItems"]').forEach(function(card) {
            card.style.setProperty('margin-right', lastRight + 'px', 'important');
            card.style.setProperty('width', lastWidth + 'px', 'important');
            card.style.setProperty('max-width', lastWidth + 'px', 'important');
        });
        updateDisplays();
    }

    function emptyFontHandler() {}

    initStoredValues();

    window.registerSection('reportTosifi', {
        spacing: {
            increaseTop: function(d) { ensureSpacersExist(); adjustSpacing('.reportTosifi-spacer-top', 1, d.topHeight); },
            decreaseTop: function(d) { ensureSpacersExist(); adjustSpacing('.reportTosifi-spacer-top', -1, d.topHeight); },
            increaseTopCoarse: function(d) { ensureSpacersExist(); adjustSpacing('.reportTosifi-spacer-top', 5, d.topHeight); },
            decreaseTopCoarse: function(d) { ensureSpacersExist(); adjustSpacing('.reportTosifi-spacer-top', -5, d.topHeight); },
            increaseBottom: function(d) { ensureSpacersExist(); adjustSpacing('.reportTosifi-spacer-bottom', 1, d.bottomHeight); },
            decreaseBottom: function(d) { ensureSpacersExist(); adjustSpacing('.reportTosifi-spacer-bottom', -1, d.bottomHeight); },
            increaseBottomCoarse: function(d) { ensureSpacersExist(); adjustSpacing('.reportTosifi-spacer-bottom', 5, d.bottomHeight); },
            decreaseBottomCoarse: function(d) { ensureSpacersExist(); adjustSpacing('.reportTosifi-spacer-bottom', -5, d.bottomHeight); },
            increaseRight: function(d) { adjustRightMargin(1); },
            decreaseRight: function(d) { adjustRightMargin(-1); },
            increaseRightCoarse: function(d) { adjustRightMargin(5); },
            decreaseRightCoarse: function(d) { adjustRightMargin(-5); },
            increaseWidth: function(d) { adjustWidth(1); },
            decreaseWidth: function(d) { adjustWidth(-1); },
            increaseWidthCoarse: function(d) { adjustWidth(5); },
            decreaseWidthCoarse: function(d) { adjustWidth(-5); },
            applyStored: applyStored
        },
        fonts: {
            increaseFontSizeTopMarklabel: emptyFontHandler,
            decreaseFontSizeTopMarklabel: emptyFontHandler,
            increaseFontSizeTopInfomark: emptyFontHandler,
            decreaseFontSizeTopInfomark: emptyFontHandler,
            increaseFontSizeMiddle: emptyFontHandler,
            decreaseFontSizeMiddle: emptyFontHandler,
            increaseFontSizeBottomMarklabel: emptyFontHandler,
            decreaseFontSizeBottomMarklabel: emptyFontHandler,
            increaseFontSizeBottomInfomark: emptyFontHandler,
            decreaseFontSizeBottomInfomark: emptyFontHandler
        }
    });
})();
