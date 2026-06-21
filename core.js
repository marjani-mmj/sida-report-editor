// core.js
(function() {

    // ***** رجیستری عمومی برای توابع بخش‌ها *****
    window.handlersRegistry = {};

    window.registerSection = function(blockName, handlers) {
        window.handlersRegistry[blockName] = handlers;
    };

    // ***** شناسایی نوع کارنامه *****
    function identifyBlock() {
        var elements = document.querySelectorAll('body *');
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            if (el.matches('.container > .ng-scope')) return 'daftsrNatayej';
            else if (el.matches('.modal-body.main > .col-md-12.p-0.m-0.panel-body-print') &&
                     !el.querySelector('table.table.table-bordered.table-striped')) return 'sarbarg';
            else if (el.matches('#panel-print-rokesh > .col-md-12.p-0.m-0.panel-body-print.main')) return 'rookeshKoli';
            else if (el.matches('.col-md-12.panel-body-print > .ng-scope[ng-repeat="items in item"]')) return 'rookeshPayeei';
            else if (el.matches('.modal-body.main#print-content > .col-md-12.main.panel-body-print')) return 'polomp';
            else if (el.matches('.modal-body.main#print-content > .col-md-12.p-0.m-0.panel-body-print.panel-total-row > table.table.table-bordered.table-striped')) return 'amarKoli';
        }
        return 0;
    }

    // ***** ابزار ساخت دکمه و نمایشگر *****
    function createButton(text, color) {
        var btn = document.createElement('button');
        btn.textContent = text;
        btn.style.position = 'fixed';
        btn.style.zIndex = 9999;
        btn.style.width = '120px';
        btn.style.height = '35px';
        btn.style.backgroundColor = color;
        btn.style.color = 'white';
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.style.margin = '0';
        return btn;
    }

    function createHeightDisplay(colorTop, colorBottom) {
        var display = document.createElement('div');
        display.style.position = 'fixed';
        display.style.zIndex = 9999;
        display.style.width = '30px';
        display.style.height = '70px';
        display.style.backgroundImage = 'linear-gradient(' + colorTop + ', ' + colorBottom + ')';
        display.style.opacity = '0.8';
        display.style.color = 'black';
        display.style.textAlign = 'center';
        display.style.lineHeight = '70px';
        display.style.fontSize = '20px';
        return display;
    }

    // ***** دکمه‌های اصلی حاشیه‌ها *****
    function createButtons() {
        var buttons = [
            { id: 'increaseTopButton', text: 'افزایش فاصله بالا', color: '#0050ef' },
            { id: 'decreaseTopButton', text: 'کاهش فاصله بالا', color: '#74b9ff' },
            { id: 'increaseBottomButton', text: 'افزایش فاصله پایین', color: '#0050ef' },
            { id: 'decreaseBottomButton', text: 'کاهش فاصله پایین', color: '#74b9ff' },
            { id: 'increaseRightButton', text: 'افزایش فاصله راست', color: '#0050ef' },
            { id: 'decreaseRightButton', text: 'کاهش فاصله راست', color: '#74b9ff' },
            { id: 'increaseLeftButton', text: 'افزایش فاصله چپ', color: '#0050ef' },
            { id: 'decreaseLeftButton', text: 'کاهش فاصله چپ', color: '#74b9ff' }
        ];
        buttons.forEach(function(b) {
            var btn = createButton(b.text, b.color);
            btn.id = b.id;
            document.body.appendChild(btn);
        });
    }

    function createDisplays() {
        var displays = [
            { id: 'topHeightDisplay', colorTop: 'green', colorBottom: 'red' },
            { id: 'bottomHeightDisplay', colorTop: 'blue', colorBottom: 'orange' },
            { id: 'rightHeightDisplay', colorTop: 'yellow', colorBottom: 'purple' },
            { id: 'leftHeightDisplay', colorTop: 'pink', colorBottom: 'brown' }
        ];
        displays.forEach(function(d) {
            var el = createHeightDisplay(d.colorTop, d.colorBottom);
            el.id = d.id;
            document.body.appendChild(el);
        });
    }

    function setButtonPositions() {
        var positions = [
            { id: 'increaseTopButton', top: '10px', left: '10px' },
            { id: 'decreaseTopButton', top: '45px', left: '10px' },
            { id: 'topHeightDisplay', top: '10px', left: '131px' },
            { id: 'increaseBottomButton', top: '85px', left: '10px' },
            { id: 'decreaseBottomButton', top: '120px', left: '10px' },
            { id: 'bottomHeightDisplay', top: '85px', left: '131px' },
            { id: 'increaseRightButton', top: '160px', left: '10px' },
            { id: 'decreaseRightButton', top: '195px', left: '10px' },
            { id: 'rightHeightDisplay', top: '160px', left: '131px' },
            { id: 'increaseLeftButton', top: '235px', left: '10px' },
            { id: 'decreaseLeftButton', top: '270px', left: '10px' },
            { id: 'leftHeightDisplay', top: '235px', left: '131px' }
        ];
        positions.forEach(function(p) {
            var el = document.getElementById(p.id);
            if (el) {
                el.style.top = p.top;
                el.style.left = p.left;
            }
        });
    }

    // ***** دکمه و پنل تنظیمات فونت *****
    function createFontSettingsButton() {
        var btn = document.createElement('button');
        btn.id = 'font-settings-button';
        btn.textContent = 'تنظیمات فونت';
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.right = '10px';
        btn.style.zIndex = '10000';
        btn.style.width = '120px';
        btn.style.height = '35px';
        btn.style.backgroundColor = 'blue';
        btn.style.color = 'white';
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.style.display = 'none'; // مخفی اولیه
        btn.onclick = createButtonGroups;
        document.body.appendChild(btn);
    }

    function createButtonGroups() {
        // حذف گروه قبلی اگر وجود داشت
        var old = document.getElementById('button-groups');
        if (old) old.remove();

        var container = document.createElement('div');
        container.id = 'button-groups';
        container.style.position = 'fixed';
        container.style.top = '50px';
        container.style.right = '10px';
        container.style.zIndex = '10000';
        container.style.backgroundColor = 'white';
        container.style.padding = '15px';
        container.style.border = '0px solid #ccc';
        container.style.borderRadius = '5px';
        container.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
        container.style.width = '120px';
        container.style.boxSizing = 'border-box';

        function createEl(tag, cls, html, parent) {
            var el = document.createElement(tag);
            el.className = cls || '';
            if (html) el.innerHTML = html;
            if (parent) parent.appendChild(el);
            return el;
        }

        // گروه فونت بالا
        var g1 = createEl('div', 'group', '', container);
        createEl('div', 'group-title', 'فونت بالا', g1);

        var r1 = createEl('div', 'row', '', g1);
        var sp1 = createEl('span', '', 'تیتر', r1);
        sp1.style.width = '25px'; sp1.style.marginRight = '5px'; sp1.style.display = 'inline-block';
        createEl('button', '', '+', r1).onclick = function() { callFontHandler('increaseFontSizeTopMarklabel'); };
        var db1 = createEl('button', '', '-', r1);
        db1.style.marginRight = '3px';
        db1.onclick = function() { callFontHandler('decreaseFontSizeTopMarklabel'); };
        createEl('div', '', ':', r1).id = 'fontSizeTopMarklabel';

        var r2 = createEl('div', 'row', '', g1);
        var sp2 = createEl('span', '', 'متن', r2);
        sp2.style.width = '25px'; sp2.style.marginRight = '5px'; sp2.style.display = 'inline-block';
        createEl('button', '', '+', r2).onclick = function() { callFontHandler('increaseFontSizeTopInfomark'); };
        var db2 = createEl('button', '', '-', r2);
        db2.style.marginRight = '3px';
        db2.onclick = function() { callFontHandler('decreaseFontSizeTopInfomark'); };
        createEl('div', '', ':', r2).id = 'fontSizeTopInfomark';

        // گروه فونت وسط
        var g2 = createEl('div', 'group', '', container);
        createEl('div', 'group-title', 'فونت وسط', g2);
        var r3 = createEl('div', 'row', '', g2);
        var sp3 = createEl('span', '', 'وسط', r3);
        sp3.style.width = '25px'; sp3.style.marginRight = '5px'; sp3.style.display = 'inline-block';
        createEl('button', '', '+', r3).onclick = function() { callFontHandler('increaseFontSizeMiddle'); };
        var db3 = createEl('button', '', '-', r3);
        db3.style.marginRight = '3px';
        db3.onclick = function() { callFontHandler('decreaseFontSizeMiddle'); };
        createEl('div', '', ':', r3).id = 'fontSizeMiddle';

        // گروه فونت پایین
        var g3 = createEl('div', 'group', '', container);
        createEl('div', 'group-title', 'فونت پایین', g3);
        var r4 = createEl('div', 'row', '', g3);
        var sp4 = createEl('span', '', 'تیتر', r4);
        sp4.style.width = '25px'; sp4.style.marginRight = '5px'; sp4.style.display = 'inline-block';
        createEl('button', '', '+', r4).onclick = function() { callFontHandler('increaseFontSizeBottomMarklabel'); };
        var db4 = createEl('button', '', '-', r4);
        db4.style.marginRight = '3px';
        db4.onclick = function() { callFontHandler('decreaseFontSizeBottomMarklabel'); };
        createEl('div', '', ':', r4).id = 'fontSizeBottomMarklabel';

        var r5 = createEl('div', 'row', '', g3);
        var sp5 = createEl('span', '', 'متن', r5);
        sp5.style.width = '25px'; sp5.style.marginRight = '5px'; sp5.style.display = 'inline-block';
        createEl('button', '', '+', r5).onclick = function() { callFontHandler('increaseFontSizeBottomInfomark'); };
        var db5 = createEl('button', '', '-', r5);
        db5.style.marginRight = '3px';
        db5.onclick = function() { callFontHandler('decreaseFontSizeBottomInfomark'); };
        createEl('div', '', ':', r5).id = 'fontSizeBottomInfomark';

        // دکمه بستن
        var closeBtn = createEl('button', 'close-button', 'بستن دکمه‌ها', container);
        closeBtn.style.marginTop = '8px';
        closeBtn.onclick = function() {
            container.remove();
            var fontBtn = document.getElementById('font-settings-button');
            if (fontBtn) fontBtn.style.display = 'block';
        };

        document.body.appendChild(container);
        var fontBtn = document.getElementById('font-settings-button');
        if (fontBtn) fontBtn.style.display = 'none';
    }

    // تابع کمکی فراخوانی فونت از رجیستری
    function callFontHandler(action) {
        var block = identifyBlock();
        var handlers = window.handlersRegistry[block];
        if (handlers && handlers.fonts && typeof handlers.fonts[action] === 'function') {
            handlers.fonts[action](); // تابع بدون پارامتر، id را از DOM می‌خواند
        }
    }

    // ***** نصب رویدادهای حاشیه و فونت *****
    function addEventListeners() {
        var displays = {
            topHeight: document.getElementById('topHeightDisplay'),
            bottomHeight: document.getElementById('bottomHeightDisplay'),
            rightHeight: document.getElementById('rightHeightDisplay'),
            leftHeight: document.getElementById('leftHeightDisplay')
        };

        function getHandlers() {
            var block = identifyBlock();
            return window.handlersRegistry[block] ? window.handlersRegistry[block].spacing : null;
        }

        // حاشیه‌ها
        document.getElementById('increaseTopButton').addEventListener('click', function() {
            var h = getHandlers();
            if (h && h.increaseTop) h.increaseTop(displays);
        });
        document.getElementById('decreaseTopButton').addEventListener('click', function() {
            var h = getHandlers();
            if (h && h.decreaseTop) h.decreaseTop(displays);
        });
        document.getElementById('increaseBottomButton').addEventListener('click', function() {
            var h = getHandlers();
            if (h && h.increaseBottom) h.increaseBottom(displays);
        });
        document.getElementById('decreaseBottomButton').addEventListener('click', function() {
            var h = getHandlers();
            if (h && h.decreaseBottom) h.decreaseBottom(displays);
        });
        document.getElementById('increaseRightButton').addEventListener('click', function() {
            var h = getHandlers();
            if (h && h.increaseRight) h.increaseRight(displays);
        });
        document.getElementById('decreaseRightButton').addEventListener('click', function() {
            var h = getHandlers();
            if (h && h.decreaseRight) h.decreaseRight(displays);
        });
        document.getElementById('increaseLeftButton').addEventListener('click', function() {
            var h = getHandlers();
            if (h && h.increaseLeft) h.increaseLeft(displays);
        });
        document.getElementById('decreaseLeftButton').addEventListener('click', function() {
            var h = getHandlers();
            if (h && h.decreaseLeft) h.decreaseLeft(displays);
        });
    }

    // ***** راه‌اندازی *****
    createButtons();
    createDisplays();
    setButtonPositions();
    createFontSettingsButton();
    addEventListeners();

})();