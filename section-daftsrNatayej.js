// section-daftsrNatayej.js
(function() {
    'use strict';

    var lastTop = 0, lastBottom = 0, lastRight = 0, lastLeft = 0;

    function initStoredValues() {
        var cards = document.querySelectorAll('.ng-scope[ng-repeat="rowItem in model.ksarnamehs"]');
        if (cards.length > 0) {
            lastRight = parseInt(window.getComputedStyle(cards[0]).marginRight) || 0;
            lastLeft = parseInt(window.getComputedStyle(cards[0]).marginLeft) || 0;
        }
        updateDisplays();
    }

    function updateDisplays() {
        var dt = document.getElementById('topHeightDisp'); if (dt) dt.textContent = lastTop;
        var db = document.getElementById('bottomHeightDisp'); if (db) db.textContent = lastBottom;
        var dr = document.getElementById('rightHeightDisp'); if (dr) dr.textContent = lastRight;
        var dl = document.getElementById('leftHeightDisp'); if (dl) dl.textContent = lastLeft;
    }

    function ensureSpacersExist() {
        if (document.querySelector('.custom-spacer-top')) return;
        var allCards = document.querySelectorAll('.container > .ng-scope[ng-repeat="rowItem in model.ksarnamehs"]');
        var evenCards = Array.from(allCards).filter(function(card, index) { return index % 2 === 0; });
        evenCards.forEach(function(card) {
            var topSpacer = document.createElement('div'); topSpacer.className = 'custom-spacer custom-spacer-top'; topSpacer.style.height = '0px';
            card.parentNode.insertBefore(topSpacer, card);
            var bottomSpacer = document.createElement('div'); bottomSpacer.className = 'custom-spacer custom-spacer-bottom'; bottomSpacer.style.height = '0px';
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
            if (selector === '.custom-spacer-top') lastTop = newHeight;
            else if (selector === '.custom-spacer-bottom') lastBottom = newHeight;
            if (display) display.textContent = newHeight;
        }
    }

    function adjustRightMargin(amount) {
        var blocks = document.querySelectorAll('.ng-scope[ng-repeat="rowItem in model.ksarnamehs"]');
        var newVal = 0;
        blocks.forEach(function(block) {
            var cur = parseInt(window.getComputedStyle(block).marginRight) || 0;
            newVal = cur + amount;
            block.style.setProperty('margin-right', newVal + 'px', 'important');
        });
        lastRight = newVal;
        var display = document.getElementById('rightHeightDisp');
        if (display) display.textContent = newVal;
    }

    function adjustLeftMargin(amount) {
        var blocks = document.querySelectorAll('.ng-scope[ng-repeat="rowItem in model.ksarnamehs"]');
        var newVal = 0;
        blocks.forEach(function(block) {
            var cur = parseInt(window.getComputedStyle(block).marginLeft) || 0;
            newVal = cur + amount;
            block.style.setProperty('margin-left', newVal + 'px', 'important');
        });
        lastLeft = newVal;
        var display = document.getElementById('leftHeightDisp');
        if (display) display.textContent = newVal;
    }

    function applyStored() {
        ensureSpacersExist();
        document.querySelectorAll('.custom-spacer-top').forEach(function(s) { s.style.height = lastTop + 'px'; });
        document.querySelectorAll('.custom-spacer-bottom').forEach(function(s) { s.style.height = lastBottom + 'px'; });
        document.querySelectorAll('.ng-scope[ng-repeat="rowItem in model.ksarnamehs"]').forEach(function(card) {
            card.style.setProperty('margin-right', lastRight + 'px', 'important');
            card.style.setProperty('margin-left', lastLeft + 'px', 'important');
        });
        updateDisplays();
    }

    function emptyFontHandler() {}

    initStoredValues();

    window.registerSection('daftsrNatayej', {
        spacing: {
            // گام ۱px
            increaseTop: function(d) { ensureSpacersExist(); adjustSpacing('.custom-spacer-top', 1, d.topHeight); },
            decreaseTop: function(d) { ensureSpacersExist(); adjustSpacing('.custom-spacer-top', -1, d.topHeight); },
            increaseBottom: function(d) { ensureSpacersExist(); adjustSpacing('.custom-spacer-bottom', 1, d.bottomHeight); },
            decreaseBottom: function(d) { ensureSpacersExist(); adjustSpacing('.custom-spacer-bottom', -1, d.bottomHeight); },
            increaseRight: function(d) { adjustRightMargin(1); },
            decreaseRight: function(d) { adjustRightMargin(-1); },
            increaseLeft: function(d) { adjustLeftMargin(1); },
            decreaseLeft: function(d) { adjustLeftMargin(-1); },

            // گام ۵px (دکمه‌های درشت)
            increaseTopCoarse: function(d) { ensureSpacersExist(); adjustSpacing('.custom-spacer-top', 5, d.topHeight); },
            decreaseTopCoarse: function(d) { ensureSpacersExist(); adjustSpacing('.custom-spacer-top', -5, d.topHeight); },
            increaseBottomCoarse: function(d) { ensureSpacersExist(); adjustSpacing('.custom-spacer-bottom', 5, d.bottomHeight); },
            decreaseBottomCoarse: function(d) { ensureSpacersExist(); adjustSpacing('.custom-spacer-bottom', -5, d.bottomHeight); },
            increaseRightCoarse: function(d) { adjustRightMargin(5); },
            decreaseRightCoarse: function(d) { adjustRightMargin(-5); },
            increaseLeftCoarse: function(d) { adjustLeftMargin(5); },
            decreaseLeftCoarse: function(d) { adjustLeftMargin(-5); },

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
