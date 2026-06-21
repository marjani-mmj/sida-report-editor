// section-daftsrNatayej.js
(function() {
    'use strict';

    // ========== مقادیر ذخیره‌شده ==========
    var lastTop = 0;
    var lastBottom = 0;
    var lastRight = 0;
    var lastLeft = 0;

    // ========== مقداردهی اولیه از کارنامه‌های موجود ==========
    function initStoredValues() {
        var cards = document.querySelectorAll('.ng-scope[ng-repeat="rowItem in model.ksarnamehs"]');
        if (cards.length > 0) {
            lastRight = parseInt(window.getComputedStyle(cards[0]).marginRight) || 0;
            lastLeft = parseInt(window.getComputedStyle(cards[0]).marginLeft) || 0;
        }
        updateDisplays();
    }

    function updateDisplays() {
        var dt = document.getElementById('topHeightDisp');
        if (dt) dt.textContent = lastTop;
        var db = document.getElementById('bottomHeightDisp');
        if (db) db.textContent = lastBottom;
        var dr = document.getElementById('rightHeightDisp');
        if (dr) dr.textContent = lastRight;
        var dl = document.getElementById('leftHeightDisp');
        if (dl) dl.textContent = lastLeft;
    }

    // ========== Spacerها ==========
    function ensureSpacersExist() {
        if (document.querySelector('.custom-spacer-top')) return;
        var allCards = document.querySelectorAll('.container > .ng-scope[ng-repeat="rowItem in model.ksarnamehs"]');
        var evenCards = Array.from(allCards).filter(function(card, index) { return index % 2 === 0; });
        evenCards.forEach(function(card) {
            var topSpacer = document.createElement('div');
            topSpacer.className = 'custom-spacer custom-spacer-top';
            topSpacer.style.height = '0px';
            card.parentNode.insertBefore(topSpacer, card);

            var bottomSpacer = document.createElement('div');
            bottomSpacer.className = 'custom-spacer custom-spacer-bottom';
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
            if (selector === '.custom-spacer-top') lastTop = newHeight;
            else if (selector === '.custom-spacer-bottom') lastBottom = newHeight;
            if (display) display.textContent = newHeight;
        }
    }

    // ========== حاشیه چپ و راست ==========
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

    // ========== اعمال تنظیمات ذخیره‌شده روی تمام کارنامه‌ها ==========
    function applyStored() {
        ensureSpacersExist();

        var topSpacers = document.querySelectorAll('.custom-spacer-top');
        topSpacers.forEach(function(s) { s.style.height = lastTop + 'px'; });
        var bottomSpacers = document.querySelectorAll('.custom-spacer-bottom');
        bottomSpacers.forEach(function(s) { s.style.height = lastBottom + 'px'; });

        var cards = document.querySelectorAll('.ng-scope[ng-repeat="rowItem in model.ksarnamehs"]');
        cards.forEach(function(card) {
            card.style.setProperty('margin-right', lastRight + 'px', 'important');
            card.style.setProperty('margin-left', lastLeft + 'px', 'important');
        });

        updateDisplays();
    }

    // ========== فونت (خالی) ==========
    function emptyFontHandler() {}

    // ========== راه‌اندازی اولیه ==========
    initStoredValues();

    // ========== ثبت در رجیستری ==========
    window.registerSection('daftsrNatayej', {
        spacing: {
            increaseTop: function(displays) { ensureSpacersExist(); adjustSpacing('.custom-spacer-top', 1, displays.topHeight); },
            decreaseTop: function(displays) { ensureSpacersExist(); adjustSpacing('.custom-spacer-top', -1, displays.topHeight); },
            increaseBottom: function(displays) { ensureSpacersExist(); adjustSpacing('.custom-spacer-bottom', 1, displays.bottomHeight); },
            decreaseBottom: function(displays) { ensureSpacersExist(); adjustSpacing('.custom-spacer-bottom', -1, displays.bottomHeight); },
            increaseRight: function(displays) { adjustRightMargin(1); },
            decreaseRight: function(displays) { adjustRightMargin(-1); },
            increaseLeft: function(displays) { adjustLeftMargin(1); },
            decreaseLeft: function(displays) { adjustLeftMargin(-1); },
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
