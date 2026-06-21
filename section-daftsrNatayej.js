// section-daftsrNatayej.js
(function() {

    // ======== فاصله‌دهنده‌های سفارشی ========
    function checkAndCreateSpacers() {
        // حذف spacerهای قدیمی (در صورت وجود)
        document.querySelectorAll('.custom-spacer-top, .custom-spacer-bottom').forEach(function(el) {
            el.remove();
        });

        // انتخاب همه کارنامه‌ها (ng-repeat)
        var allCards = document.querySelectorAll('.container > .ng-scope[ng-repeat="rowItem in model.ksarnamehs"]');
        // فقط کارنامه‌های زوج (شاخص 0، 2، 4، ...) که اول هر صفحه‌اند
        var evenCards = Array.from(allCards).filter(function(card, index) {
            return index % 2 === 0;
        });

        evenCards.forEach(function(card) {
            // spacer بالا (قبل از کارنامه اول هر صفحه)
            var topSpacer = document.createElement('div');
            topSpacer.className = 'custom-spacer custom-spacer-top';
            topSpacer.style.height = '0px';
            card.parentNode.insertBefore(topSpacer, card);

            // spacer پایین (بین دو کارنامه همان صفحه – بعد از card جاری)
            var bottomSpacer = document.createElement('div');
            bottomSpacer.className = 'custom-spacer custom-spacer-bottom';
            bottomSpacer.style.height = '0px';
            card.parentNode.insertBefore(bottomSpacer, card.nextSibling);
        });
    }

    function adjustSpacing(selector, amount, display) {
        var spacers = document.querySelectorAll(selector);
        spacers.forEach(function(spacer) {
            var currentHeight = parseInt(spacer.style.height) || 0;
            var newHeight = Math.max(0, currentHeight + amount);
            spacer.style.height = newHeight + 'px';
        });
        if (spacers.length > 0 && display) {
            display.textContent = parseInt(spacers[0].style.height);
        }
    }

    function adjustRightMargin(amount) {
        var blocks = document.querySelectorAll('.ng-scope[ng-repeat="rowItem in model.ksarnamehs"]');
        var display = document.getElementById('rightHeightDisplay');
        blocks.forEach(function(block) {
            var currentMargin = parseInt(window.getComputedStyle(block).marginRight) || 0;
            block.style.marginRight = (currentMargin + amount) + 'px';
        });
        if (blocks.length > 0 && display) {
            display.textContent = parseInt(window.getComputedStyle(blocks[0]).marginRight);
        }
    }

    function adjustLeftMargin(amount) {
        var blocks = document.querySelectorAll('.ng-scope[ng-repeat="rowItem in model.ksarnamehs"]');
        var display = document.getElementById('leftHeightDisplay');
        blocks.forEach(function(block) {
            var currentMargin = parseInt(window.getComputedStyle(block).marginLeft) || 0;
            block.style.marginLeft = (currentMargin + amount) + 'px';
        });
        if (blocks.length > 0 && display) {
            display.textContent = parseInt(window.getComputedStyle(blocks[0]).marginLeft);
        }
    }

    // ======== توابع فونت (فعلاً خالی – بعداً تکمیل می‌شوند) ========
    function emptyFontHandler() {
        console.log('تنظیم فونت دفتر نتایج هنوز پیاده‌سازی نشده است.');
    }

    // ======== ثبت در رجیستری ========
    window.registerSection('daftsrNatayej', {
        spacing: {
            increaseTop: function(displays) {
                checkAndCreateSpacers();
                adjustSpacing('.custom-spacer-top', 5, displays.topHeight);
            },
            decreaseTop: function(displays) {
                checkAndCreateSpacers();
                adjustSpacing('.custom-spacer-top', -5, displays.topHeight);
            },
            increaseBottom: function(displays) {
                checkAndCreateSpacers();
                adjustSpacing('.custom-spacer-bottom', 5, displays.bottomHeight);
            },
            decreaseBottom: function(displays) {
                checkAndCreateSpacers();
                adjustSpacing('.custom-spacer-bottom', -5, displays.bottomHeight);
            },
            increaseRight: function(displays) {
                adjustRightMargin(5);
            },
            decreaseRight: function(displays) {
                adjustRightMargin(-5);
            },
            increaseLeft: function(displays) {
                adjustLeftMargin(5);
            },
            decreaseLeft: function(displays) {
                adjustLeftMargin(-5);
            }
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