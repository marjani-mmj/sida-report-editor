// section-daftsrNatayej.js
(function() {
    'use strict';

    // ========== فاصله‌دهنده‌های عمودی (spacer) ==========
    function ensureSpacersExist() {
        if (document.querySelector('.custom-spacer-top')) return;

        var allCards = document.querySelectorAll('.container > .ng-scope[ng-repeat="rowItem in model.ksarnamehs"]');
        var evenCards = Array.from(allCards).filter(function(card, index) { return index % 2 === 0; });

        evenCards.forEach(function(card) {
            // spacer بالا
            var topSpacer = document.createElement('div');
            topSpacer.className = 'custom-spacer custom-spacer-top';
            topSpacer.style.height = '0px';
            card.parentNode.insertBefore(topSpacer, card);

            // spacer پایین (بین دو کارنامه همان صفحه)
            var bottomSpacer = document.createElement('div');
            bottomSpacer.className = 'custom-spacer custom-spacer-bottom';
            bottomSpacer.style.height = '0px';
            card.parentNode.insertBefore(bottomSpacer, card.nextSibling);
        });
    }

    function adjustSpacing(selector, amount, display) {
        var spacers = document.querySelectorAll(selector);
        spacers.forEach(function(spacer) {
            var cur = parseInt(spacer.style.height) || 0;
            spacer.style.height = Math.max(0, cur + amount) + 'px';
        });
        if (spacers.length > 0 && display) {
            display.textContent = parseInt(spacers[0].style.height);
        }
    }

    // ========== حاشیه‌های چپ و راست (با !important) ==========
    function adjustRightMargin(amount) {
        var blocks = document.querySelectorAll('.ng-scope[ng-repeat="rowItem in model.ksarnamehs"]');
        var display = document.getElementById('rightHeightDisp');
        blocks.forEach(function(block) {
            var cur = parseInt(window.getComputedStyle(block).marginRight) || 0;
            var newVal = cur + amount;
            block.style.setProperty('margin-right', newVal + 'px', 'important');
        });
        if (blocks.length > 0 && display) {
            display.textContent = parseInt(window.getComputedStyle(blocks[0]).marginRight);
        }
    }

    function adjustLeftMargin(amount) {
        var blocks = document.querySelectorAll('.ng-scope[ng-repeat="rowItem in model.ksarnamehs"]');
        var display = document.getElementById('leftHeightDisp');
        blocks.forEach(function(block) {
            var cur = parseInt(window.getComputedStyle(block).marginLeft) || 0;
            var newVal = cur + amount;
            block.style.setProperty('margin-left', newVal + 'px', 'important');
        });
        if (blocks.length > 0 && display) {
            display.textContent = parseInt(window.getComputedStyle(blocks[0]).marginLeft);
        }
    }

    // ========== فونت‌ها (فعلاً خالی) ==========
    function emptyFontHandler() {}

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
            decreaseLeft: function(displays) { adjustLeftMargin(-1); }
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
