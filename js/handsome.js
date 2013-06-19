/*
                            
handsome.js

Author: Ken Wheeler
Date: 06/13/13
Version: 1.0b

*/

/*global window, document, $, setInterval, clearInterval */

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
}

/********** End Helpers *********/

/*

----------------
--- Carousel ---
----------------

Options:

autoplay: true|false - (default: false)- Enables auto play of slides

autoplaySpeed: int - (default:  3000) - Auto play change interval

dots: true|false - (default:  false) - Current slide indicator dots

arrows: true|false - (default: true) - Next/Prev arrows

infinite: true|false - (default: true) - Infinite looping

speed: int - (default: 300) - Transition speed

swipe: true|false - (default: true) - Enables touch swipe


Usage:

$(element).carousel({arrows: true});

*/

handsome.Carousel = (function() {

    'use strict';

    function Carousel(element, options) {

        var defaults = {
            autoplay: false,
            autoplaySpeed: 3000,
            dots: false,
            arrows: true,
            infinite: true,
            speed: 300,
            swipe: true
        };

        this.animType = null;
        this.autoPlayTimer = null;
        this.currentSlide = 0;
        this.currentLeft = null;
        this.direction = 1;
        this.dots = null;
        this.loadIndex = 0;
        this.nextArrow = null;
        this.prevArrow = null;
        this.slideCount = null;
        this.sliderWidth = null;
        this.slideTrack = null;
        this.slides = null;
        this.sliding = false;
        this.slideOffset = 0;
        this.slider = $(element);
        this.swipeLeft = null;
        this.list = null;
        this.touchObject = {};
        this.transformsEnabled = false;

        this.options = $.extend({}, defaults, options);

        this.changeSlide = functionBinder(this.changeSlide, this);
        this.setPosition = functionBinder(this.setPosition, this);
        this.swipeHandler = functionBinder(this.swipeHandler, this);
        this.autoPlayIterator = functionBinder(this.autoPlayIterator, this);

        this.init();

    }

    Carousel.prototype.init = function() {

        if (!$(this.slider).hasClass('sliderInitialized')) {

            $(this.slider).addClass('sliderInitialized');
            this.setValues();
            this.buildOut();
            this.getAnimType();
            this.setPosition();
            this.intializeEvents();
            this.startLoad();

        }

    };

    Carousel.prototype.getAnimType = function() {

        if (document.body.style.MozTransform !== undefined) {

            this.animType = 'MozTransform';

        } else if (document.body.style.webkitTransform !== undefined) {

            this.animType = "webkitTransform";

        } else if (document.body.style.msTransform !== undefined) {

            this.animType = "msTransform";

        }

        if (this.animType !== null) {

            this.transformsEnabled = true;

        }

    };

    Carousel.prototype.autoPlay = function() {

        this.autoPlayTimer = setInterval(this.autoPlayIterator, this.options.autoplaySpeed);

    };

    Carousel.prototype.autoPlayIterator = function() {

        if (this.options.infinite === false) {

            if (this.direction === 1) {

                if ((this.currentSlide + 1) === this.slideCount - 1) {
                    this.direction = 0;
                }

                this.slideHandler(this.currentSlide + 1);

            } else {

                if ((this.currentSlide - 1 === 0)) {

                    this.direction = 1;

                }

                this.slideHandler(this.currentSlide - 1);

            }

        } else {

            this.slideHandler(this.currentSlide + 1);

        }

    };

    Carousel.prototype.startLoad = function() {

        this.list.find('img').css('opacity', 0);

        if (this.options.arrows === true) {

            this.prevArrow.hide();
            this.nextArrow.hide();

        }

        if (this.options.dots === true) {

            this.dots.hide();

        }

        this.slider.addClass('bt-loading');

    };

    Carousel.prototype.checkLoad = function() {

        var self = this, totalImages = null;

        if (this.options.infinite === true) {
            totalImages = self.slideCount + 2;
        } else {
            totalImages = self.slideCount;
        }

        if (self.loadIndex === totalImages) {

            self.list.find('img').animate({ opacity: 1 }, this.options.speed, function() {
                self.setPosition();
            });

            if (self.options.arrows === true) {

                self.prevArrow.show();
                self.nextArrow.show();

            }

            if (self.options.dots === true) {

                self.dots.show();

            }

            self.slider.removeClass('bt-loading');

            if (self.options.autoplay === true) {

                self.autoPlay();

            }

        }

    };

    Carousel.prototype.stopLoad = function() {

        this.loadIndex += 1;

        this.checkLoad();

    };

    Carousel.prototype.setValues = function() {

        this.list = this.slider.find('ul:first').addClass('bt-list');
        this.sliderWidth = this.list.width();
        this.slides = $('li:not(.cloned)', this.list).addClass('slide');
        this.slideCount = this.slides.length;

    };

    Carousel.prototype.buildOut = function() {

        var i;

        this.slider.addClass("bt-slider");
        this.slideTrack = this.slides.wrapAll('<div class="bt-track"/>').parent();

        if (this.options.arrows === true) {

            this.prevArrow = $('<a href="javascript:void(0)">Previous</a>').appendTo(this.slider).addClass('bt-prev');
            this.nextArrow = $('<a href="javascript:void(0)">Next</a>').appendTo(this.slider).addClass('bt-next');

            if (this.options.infinite !== true) {
                this.prevArrow.addClass('disabled');
            }

        }

        if (this.options.dots === true) {

            this.dots = $('<ul class="bt-dots"></ul>').appendTo(this.slider);

            for (i = 1; i <= this.slideCount; i += 1) {

                $('<li><a href="javascript:void(0)">' + i + '</a></li>').appendTo(this.dots);

            }

            this.dots.find('li').first().addClass('active');

        }

        if (this.options.infinite === true) {

            this.slides.first().clone().appendTo(this.slideTrack).addClass('cloned');
            this.slides.last().clone().prependTo(this.slideTrack).addClass('cloned');

        }

    };

    Carousel.prototype.setDimensions = function() {
        this.list.find('li').width(this.sliderWidth);
        this.slideTrack.width(this.sliderWidth * this.slider.find('li').length);
    };

    Carousel.prototype.setPosition = function() {

        var animProps = {}, targetLeft = ((this.currentSlide * this.sliderWidth) * -1) + this.slideOffset;

        this.setValues();
        this.setDimensions();

        if (this.options.infinite === true) {
            this.slideOffset = this.sliderWidth * -1;

        }

        if (this.transformsEnabled === false) {

            this.slideTrack.css('left', targetLeft);

        } else {

            animProps[this.animType] = "translate(" + targetLeft + "px, 0px)";
            this.slideTrack.css(animProps);

        }

    };

    Carousel.prototype.intializeEvents = function() {

        var self = this;

        if (this.options.arrows === true) {

            this.prevArrow.on('click', {message: 'previous'}, this.changeSlide);
            this.nextArrow.on('click', {message: 'next'}, this.changeSlide);

        }

        if (this.options.dots === true) {

            $('li a', this.dots).on('click', {message: 'index'}, this.changeSlide);

        }

        if (this.options.swipe === true) {

            this.list.on('touchstart', {action: 'start'}, this.swipeHandler);

            this.list.on('touchmove', {action: 'move'}, this.swipeHandler);

            this.list.on('touchend', {action: 'end'}, this.swipeHandler);

            $(window).bind('orientationchange', this.setPosition);

        }

        $(window).on('resize', this.setPosition);

        this.list.find('img').load(function() { self.stopLoad(); });

    };

    Carousel.prototype.changeSlide = function(event) {

        switch (event.data.message) {

        case 'previous':
            this.slideHandler(this.currentSlide - 1);
            break;

        case 'next':
            this.slideHandler(this.currentSlide + 1);
            break;

        case 'index':
            this.slideHandler($(event.target).parent().index());
            break;

        default:
            return false;
        }

    };

    Carousel.prototype.updateDots = function() {

        this.dots.find('li').removeClass('active');
        $(this.dots.find('li').get(this.currentSlide)).addClass('active');

    };

    Carousel.prototype.slideHandler = function(index) {

        var animProps = {}, targetSlide, slideLeft, targetLeft = null, self = this;

        targetSlide = index;
        targetLeft = ((targetSlide * this.sliderWidth) * -1) + this.slideOffset;
        slideLeft = ((this.currentSlide * this.sliderWidth) * -1) + this.slideOffset;

        if (self.options.autoplay === true) {
            clearInterval(this.autoPlayTimer);
        }

        if (this.swipeLeft === null) {
            this.currentLeft = slideLeft;
        } else {
            this.currentLeft = this.swipeLeft;
        }

        if (targetSlide < 0) {

            if (this.options.infinite === true) {

                if (this.transformsEnabled === false) {

                    this.slideTrack.animate({
                        left: targetLeft
                    }, self.options.speed, function() {
                        self.currentSlide = self.slideCount - 1;
                        self.setPosition();

                        if (self.options.dots) {
                            self.updateDots();
                        }

                        if (self.options.autoplay === true) {
                            self.autoPlay();
                        }
                    });

                } else {

                    $({animStart: this.currentLeft}).animate({
                        animStart: targetLeft
                    }, {
                        duration:  self.options.speed,
                        step: function(now) {
                            animProps[self.animType] = "translate(" + now + "px, 0px)";
                            self.slideTrack.css(animProps);
                        },
                        complete: function() {

                            self.currentSlide = self.slideCount - 1;

                            self.setPosition();

                            if (self.swipeLeft !== null) {
                                self.swipeLeft = null;
                            }

                            if (self.options.dots) {
                                self.updateDots();
                            }

                            if (self.options.autoplay === true) {
                                self.autoPlay();
                            }
                        }
                    });

                }


            } else {

                return false;

            }

        } else if (targetSlide > (this.slideCount - 1)) {

            if (this.options.infinite === true) {

                if (this.transformsEnabled === false) {

                    this.slideTrack.animate({
                        left: targetLeft
                    }, self.options.speed, function() {

                        self.currentSlide = 0;
                        self.setPosition();

                        if (self.options.dots) {
                            self.updateDots();
                        }

                        if (self.options.autoplay === true) {
                            self.autoPlay();
                        }

                    });

                } else {

                    $({animStart: this.currentLeft}).animate({
                        animStart: targetLeft
                    }, {
                        duration:  self.options.speed,
                        step: function(now) {
                            animProps[self.animType] = "translate(" + now + "px, 0px)";
                            self.slideTrack.css(animProps);
                        },
                        complete: function() {

                            self.currentSlide = 0;

                            self.setPosition();

                            if (self.swipeLeft !== null) {
                                self.swipeLeft = null;
                            }

                            if (self.options.dots) {
                                self.updateDots();
                            }

                            if (self.options.autoplay === true) {
                                self.autoPlay();
                            }
                        }
                    });

                }

            } else {

                return false;

            }

        } else {

            if (this.transformsEnabled === false) {

                this.slideTrack.animate({
                    left: targetLeft
                }, self.options.speed, function() {
                    self.currentSlide = targetSlide;

                    if (self.options.dots) {
                        self.updateDots();
                    }

                    if (self.options.autoplay === true) {
                        self.autoPlay();
                    }

                    if (self.options.arrows === true && self.options.infinite !== true) {
                        if (self.currentSlide === 0) {
                            self.prevArrow.addClass('disabled');
                        } else if (self.currentSlide === self.slideCount - 1) {
                            self.nextArrow.addClass('disabled');
                        } else {
                            self.prevArrow.removeClass('disabled');
                            self.nextArrow.removeClass('disabled');
                        }
                    }
                });

            } else {

                $({animStart: this.currentLeft}).animate({
                    animStart: targetLeft
                }, {
                    duration:  self.options.speed,
                    step: function(now) {
                        animProps[self.animType] = "translate(" + now + "px, 0px)";
                        self.slideTrack.css(animProps);
                    },
                    complete: function() {

                        self.currentSlide = targetSlide;

                        if (self.swipeLeft !== null) {
                            self.swipeLeft = null;
                        }

                        if (self.options.dots) {
                            self.updateDots();
                        }

                        if (self.options.autoplay === true) {
                            self.autoPlay();
                        }

                        if (self.options.arrows === true && self.options.infinite !== true) {
                            if (self.currentSlide === 0) {
                                self.prevArrow.addClass('disabled');
                            } else if (self.currentSlide === self.slideCount - 1) {
                                self.nextArrow.addClass('disabled');
                            } else {
                                self.prevArrow.removeClass('disabled');
                                self.nextArrow.removeClass('disabled');
                            }
                        }
                    }
                });

            }

        }

    };

    Carousel.prototype.swipeHandler = function(event) {

        var animProps = {}, curLeft, newLeft = null;

        curLeft = ((this.currentSlide * this.sliderWidth) * -1) + this.slideOffset;

        event.originalEvent.preventDefault();

        this.touchObject.fingerCount = event.originalEvent.touches.length;

        this.touchObject.minSwipe = this.sliderWidth / 4;

        switch (event.data.action) {

        case 'start':

            if (this.touchObject.fingerCount === 1) {

                this.touchObject.startX = event.originalEvent.touches[0].pageX;
                this.touchObject.startY = event.originalEvent.touches[0].pageY;
                this.touchObject.curX = event.originalEvent.touches[0].pageX;
                this.touchObject.curY = event.originalEvent.touches[0].pageY;

            } else {

                this.touchObject = {};

            }

            break;

        case 'move':

            if (event.originalEvent.touches.length === 1) {

                this.touchObject.curX = event.originalEvent.touches[0].pageX;
                this.touchObject.curY = event.originalEvent.touches[0].pageY;

                this.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(this.touchObject.curX - this.touchObject.startX, 2)));

                if (this.touchObject.curX > this.touchObject.startX) {

                    newLeft = curLeft + this.touchObject.swipeLength;
                    if (this.transformsEnabled === false) {
                        this.slideTrack.css('left', newLeft);
                    } else {
                        animProps[this.animType] = "translate(" + newLeft + "px, 0px)";
                        this.slideTrack.css(animProps);
                        this.swipeLeft = newLeft;
                    }

                } else {

                    newLeft = curLeft - this.touchObject.swipeLength;
                    if (this.transformsEnabled === false) {
                        this.slideTrack.css('left', newLeft);
                    } else {
                        animProps[this.animType] = "translate(" + newLeft + "px, 0px)";
                        this.slideTrack.css(animProps);
                        this.swipeLeft = newLeft;
                    }

                }

            } else {

                this.touchObject = {};

            }

            break;

        case 'end':

            if (this.touchObject.fingerCount === 0 && this.touchObject.curX !== 0) {

                if (this.touchObject.swipeLength >= this.touchObject.minSwipe) {

                    switch (this.swipeDirection()) {

                    case 'left':

                        this.slideHandler(this.currentSlide + 1);
                        this.touchObject = {};

                        break;

                    case 'right':

                        this.slideHandler(this.currentSlide - 1);
                        this.touchObject = {};

                        break;

                    }

                } else {

                    this.slideHandler(this.currentSlide);
                    this.touchObject = {};

                }

            } else {

                this.touchObject = {};

            }

            break;

        case 'cancel':

            break;

        }

    };

    Carousel.prototype.swipeDirection = function() {

        var xDist, yDist, r, swipeAngle;

        xDist = this.touchObject.startX - this.touchObject.curX;
        yDist = this.touchObject.startY - this.touchObject.curY;
        r = Math.atan2(yDist, xDist);

        swipeAngle = Math.round(r * 180 / Math.PI);
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }

        if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
            return 'left';
        }
        if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
            return 'left';
        }
        if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
            return 'right';
        }

    };

    return Carousel;

}());

$.fn.carousel = function (options) {

    'use strict';

    var carousels = [];

    return this.each(function (index) {
        carousels[index] = new handsome.Carousel(this, options);
    });

};

/*

----- End Carousel -----

*/


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

        this.options = $.extend({}, defaults, options);

        this.openDropdown = functionBinder(this.openDropdown, this);
        this.closeDropdown = functionBinder(this.closeDropdown, this);
        this.makeSelection = functionBinder(this.makeSelection, this);
        this.setTitle = functionBinder(this.setTitle, this);

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
            this.targetSelect.width(this.parentWrapper.width());
            this.targetSelect.height(this.parentWrapper.height());
        } else {
            this.parentWrapper.addClass('notMobile');
        }
        this.intializeEvents();

    };

    Dropdown.prototype.intializeEvents = function() {
        this.dropdownTrigger.on('click', this.openDropdown);
        this.parentWrapper.on('blur', this.closeDropdown);
        this.dropdownOptions.find('li a').on('click', {target: this}, this.makeSelection);
        this.targetSelect.on('change', this.setTitle);
    };

    Dropdown.prototype.setTitle = function() {
        this.dropdownTrigger.html(this.targetSelect.find('option:selected').text() + '<span class="icon"></span>');
    };

    Dropdown.prototype.openDropdown = function() {
        $('.bt-dropdown').removeClass('open');
        this.parentWrapper.removeClass('closed');
        this.parentWrapper.addClass('open');
    };

    Dropdown.prototype.closeDropdown = function() {
        this.parentWrapper.removeClass('open');
        this.parentWrapper.addClass('closed');
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