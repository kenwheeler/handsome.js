/*
                            
handsome.js

Author: Ken Wheeler
Date: 06/13/13
Version: 1.0b

*/

// global window, $, clearInterval

var handsome = window.handsome || {};

/************ Helpers ***********/

// Function Binder

var functionBinder = function(fn, me) {
    'use strict';
    return function () {
        return fn.apply(me, arguments);
    };
};

// Mobile Detect

var mobileDetect = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

/********** End Helpers *********/

/*

----------------
--- CheckBox ---
----------------

Options:

none

Usage:

$(element).checkBox();

*/

handsome.Checkbox = (function() {

    'use strict';

    function Checkbox(element) {

        this.targetCheck = $(element);
        this.parentWrapper = null;
        this.checker = null;

        this.checkClicked = functionBinder(this.checkClicked, this);

        this.init();

    }

    Checkbox.prototype.init = function() {
        if (this.targetCheck.get(0).tagName === "INPUT") {
            if (this.targetCheck.attr('type') === "checkbox")
                if (!this.targetCheck.parent().hasClass('bt-checkbox')) {
                   this.buildOut();
                }
        }
    };

    Checkbox.prototype.buildOut = function() {
        this.parentWrapper = $(this.targetCheck).wrap('<div class="bt-checkbox"/>').parent();
        this.checker = $('<a href="javascript:void(0)" class="bt-checker"/>').appendTo(this.parentWrapper);
        this.targetCheck.hide();
        if(this.targetCheck.attr('checked') === "checked") {
            this.checker.addClass('checked');
        }
        this.intializeEvents();
    };

    Checkbox.prototype.intializeEvents = function() {
        this.checker.on('click', this.checkClicked);
    };

    Checkbox.prototype.checkClicked = function() {
        if (this.checker.hasClass('checked')) {
            this.checker.removeClass('checked');
            this.targetCheck.attr('checked', false);
        } else {
            this.checker.addClass('checked');
            this.targetCheck.attr('checked', true);
        }
    };

    return Checkbox;

}());


$.fn.checkBox = function (options) {

    'use strict';

    var checkboxes = [];

    return this.each(function (index) {
        checkboxes[index] = new handsome.Checkbox(this, options);
    });

};

/*

----- End CheckBox -----

*/

/*

----------------
--- RadioButton ---
----------------

Options:

none

Usage:

$(element).radio();

*/

handsome.Radio = (function() {

    'use strict';

    function Radio(element) {

        this.targetRadio = $(element);
        this.parentWrapper = null;
        this.radioTrigger = null;
        this.radioSisters = null;
        this.fakeRadioSisters = null;

        this.triggerClicked = functionBinder(this.triggerClicked, this);

        this.init();

    }

    Radio.prototype.init = function() {
        if (this.targetRadio.get(0).tagName === "INPUT") {
            if (this.targetRadio.attr('type') === "radio")
                if (!this.targetRadio.parent().hasClass('bt-radio')) {
                   this.buildOut();
                }
        }
    };

    Radio.prototype.buildOut = function() {
        this.parentWrapper = $(this.targetRadio).wrap('<div class="bt-radio"/>').parent();
        this.radioTrigger = $('<a href="javascript:void(0)" class="bt-radio-trigger"/>').appendTo(this.parentWrapper);
        this.targetRadio.hide();
        if(this.targetRadio.attr('checked') === "checked") {
            this.radioTrigger.addClass('checked');
        }
        this.radioSisters = $("input:radio[name='" + this.targetRadio.attr('name') + "']");
        this.radioTrigger.attr('data-radioname', this.targetRadio.attr('name'));
        this.intializeEvents();
    };

    Radio.prototype.intializeEvents = function() {
        this.radioTrigger.on('click', this.triggerClicked);
    };

    Radio.prototype.triggerClicked = function() {
            $('.bt-radio-trigger[data-radioname=' + this.targetRadio.attr('name') + ']').removeClass('checked');
            this.radioTrigger.addClass('checked');
            this.radioSisters.attr('checked', false);
            this.targetRadio.attr('checked', true);
    };

    return Radio;

}());


$.fn.radio = function (options) {

    'use strict';

    var radios = [];

    return this.each(function (index) {
        radios[index] = new handsome.Radio(this, options);
    });

};

/*

----- End RadioButton -----

*/

/*

----------------
--- Dropdown ---
----------------

Options:

none

Usage:

$(element).dropDown();

*/

handsome.Dropdown = (function() {

    'use strict';

    function Dropdown(element, options) {

        var defaults = {
            useNativeMobile: true,
            width: null
        }

        this.targetSelect = $(element);
        this.parentWrapper = null;
        this.dropdownTrigger = null;
        this.dropdownOptions = null;
        this.selectOptions = null;
        this.keysActive = null;
        this.activeOption = null;

        this.options = $.extend({}, defaults, options);

        this.openDropdown = functionBinder(this.openDropdown, this);
        this.closeDropdown = functionBinder(this.closeDropdown, this);
        this.focusHandler = functionBinder(this.focusHandler, this);
        this.makeSelection = functionBinder(this.makeSelection, this);
        this.setTitle = functionBinder(this.setTitle, this);
        this.keysHandler = functionBinder(this.keysHandler, this);
        this.mouseInto = functionBinder(this.mouseInto, this);

        this.init();

    }

    Dropdown.prototype.init = function() {
        if (this.targetSelect.get(0).tagName === "SELECT") {
                if (!this.targetSelect.parent().hasClass('bt-dropdown')) {
                   this.buildOut();
                }
        }
    };

    Dropdown.prototype.buildOut = function() {

        var self = this, targetWidth = null;

        this.parentWrapper = $(this.targetSelect).wrap('<div class="bt-dropdown" tabindex="' + this.targetSelect.attr('tabindex') + '"/>').parent();
        this.dropdownTrigger = $('<a class="bt-dropdown-toggle" href="javascript:void(0)">' + this.targetSelect.find('option:selected').text() + '<span class="icon"></span></a>').appendTo(this.parentWrapper);
        this.selectOptions = this.targetSelect.find('option');
        this.dropdownOptions = $('<ul class="bt-dropdown-options"></ul>').appendTo(this.parentWrapper);
        $(this.selectOptions).each(function(index) {
            $('<li class="bt-dropdown-option"><a href="javascript:void(0)" data-value="' + $(this).val() + '">' + $(this).text() + '</a></li>').appendTo(self.dropdownOptions);
        });
        targetWidth = this.options.width || this.targetSelect.outerWidth();
        this.dropdownTrigger.width(targetWidth);
        this.parentWrapper.addClass('initialized');
        this.parentWrapper.addClass('closed');
        if (mobileDetect() === true && this.options.useNativeMobile === true) {
            this.parentWrapper.addClass('mobile');
            this.targetSelect.width(this.parentWrapper.innerWidth());
            this.targetSelect.height(this.parentWrapper.innerHeight());
        } else {
            this.parentWrapper.addClass('notMobile');
        }
        this.intializeEvents();

    };

    Dropdown.prototype.intializeEvents = function() {
        this.parentWrapper.on('focus', this.focusHandler);
        this.dropdownTrigger.on('click', this.openDropdown);
        this.parentWrapper.on('blur', this.closeDropdown);
        this.dropdownOptions.find('li a').on('click', {target: this}, this.makeSelection);
        this.dropdownOptions.find('li').on('mouseover', this.mouseInto);
        this.targetSelect.on('change', this.setTitle);
        $(window).on('keydown', this.keysHandler);
    };

    Dropdown.prototype.mouseInto = function(event){
        $('.bt-dropdown-option').removeClass('active'); 
        this.activeOption = $(event.currentTarget).addClass('active');
    }

    Dropdown.prototype.focusHandler = function() {
        this.openDropdown();
        this.dropdownOptions.find('li').removeClass('active');
        this.activeOption = $(this.dropdownOptions.find('li')[0]).addClass('active');
        this.keysActive = true;
    };

    Dropdown.prototype.keysHandler = function(e) {
        var event = window.event ? window.event : e;
        if(this.keysActive) {
            if(e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13) {
                e.preventDefault();
                switch(e.keyCode) {
                    case 38: {
                        if(this.activeOption.index() > 0) {
                            this.activeOption.removeClass('active');
                            this.activeOption = this.activeOption.prev();
                            this.activeOption.addClass('active');
                            if(this.shouldScroll()) {
                                this.dropdownOptions[0].scrollTop-=this.activeOption.height();
                            }
                        }
                        break;
                    }

                    case 40: {
                        if(this.activeOption.index() < (this.dropdownOptions.find('li').length - 1)) {
                            this.activeOption.removeClass('active');
                            this.activeOption = this.activeOption.next();
                            this.activeOption.addClass('active');
                            if(this.shouldScroll()) {
                                this.dropdownOptions[0].scrollTop+=this.activeOption.height();
                            }
                        }
                        break;
                    }

                    case 13: {
                        this.activeOption.find('a').trigger('click');
                        break;
                    }

                }
            }
        }
    };

    Dropdown.prototype.shouldScroll = function() {
        if(this.activeOption.position().top > (this.dropdownOptions.height() - this.activeOption.height())) {
            return true;
        }
        if(this.dropdownOptions[0].scrollTop > (this.activeOption.position().top  - this.activeOption.height())) {
            return true;
        }
    }

    Dropdown.prototype.setTitle = function() {
        this.dropdownTrigger.html(this.targetSelect.find('option:selected').text() + '<span class="icon"></span>');
    };

    Dropdown.prototype.openDropdown = function() {
        $('.bt-dropdown').removeClass('open');
        this.parentWrapper.removeClass('closed');
        this.parentWrapper.addClass('open');
        this.dropdownOptions[0].scrollTop=0;
        this.keysActive = true;
    };

    Dropdown.prototype.closeDropdown = function() {
        this.parentWrapper.removeClass('open');
        this.parentWrapper.addClass('closed');
        this.keysActive = false;
    };

    Dropdown.prototype.makeSelection = function(event) {
        var clickIndex = null;
        this.targetSelect.get(0).value = $(event.target).data('value');
        clickIndex = $(event.target).parent().index();
        this.targetSelect.find('option').get(clickIndex).selected = 'selected';
        this.targetSelect.trigger('change');
        this.closeDropdown();
    };

    return Dropdown;

}());


$.fn.dropDown = function (options) {

    'use strict';

    var dropdowns = [];

    return this.each(function (index) {
        dropdowns[index] = new handsome.Dropdown(this, options);
    });

};

/*

----- End Dropdown -----

*/