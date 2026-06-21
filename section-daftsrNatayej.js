// section-daftsrNatayej.js
(function() {
    'use strict';

    // ========== فاصله‌دهنده‌ها (spacerها) ==========
    function ensureSpacersExist() {
        if (document.querySelector('.custom-spacer-top')) return; // قبلاً ساخته شده

        var allCards = document.querySelectorAll('.container > .ng-scope[ng-repeat="rowItem in model.ksarnamehs"]');
        var evenCards = Array.from(allCards).filter(function(card, index) {
            return index % 2 === 0; // فقط کارنامه‌های بالای صفحه
        });

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
            var newH = Math.max(0, cur + amount);
            spacer.style.height = newH + 'px';
        });
        if (spacers.length > 0 && display) {
            display.textContent = parseInt(spacers[0].style.height);
        }
    }

    // ========== حاشیه چپ و راست (مستقیم روی بلوک‌های کارنامه) ==========
    function adjustRightMargin(amount) {
        var blocks = document.querySelectorAll('.ng-scope[ng-repeat="rowItem in model.ksarnamehs"]');
        var display = document.getElementById('rightHeightDisp');
        blocks.forEach(function(block) {
            var cur = parseInt(window.getComputedStyle(block).marginRight) || 0;
            block.style.marginRight = (cur + amount) + 'px';
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
            block.style.marginLeft = (cur + amount) + 'px';
        });
        if (blocks.length > 0 && display) {
            display.textContent = parseInt(window.getComputedStyle(blocks[0]).marginLeft);
        }
    }

    // ========== ثبت در رجیستری ==========
    window.registerSection('daftsrNatayej', {
        spacing: {
            increaseTop: function(displays) {
                ensureSpacersExist();
                adjustSpacing('.custom-spacer-top', 1, displays.topHeight);
            },
            decreaseTop: function(displays) {
                ensureSpacersExist();
                adjustSpacing('.custom-spacer-top', -1, displays.topHeight);
            },
            increaseBottom: function(displays) {
                ensureSpacersExist();
                adjustSpacing('.custom-spacer-bottom', 1, displays.bottomHeight);
            },
            decreaseBottom: function(displays) {
                ensureSpacersExist();
                adjustSpacing('.custom-spacer-bottom', -1, displays.bottomHeight);
            },
            increaseRight: function(displays) {
                adjustRightMargin(1);
            },
            decreaseRight: function(displays) {
                adjustRightMargin(-1);
            },
            increaseLeft: function(displays) {
                adjustLeftMargin(1);
            },
            decreaseLeft: function(displays) {
                adjustLeftMargin(-1);
            }
        },
        fonts: {
            // فعلاً خالی
        }
    });

})();
