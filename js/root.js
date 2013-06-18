/*
                            
 ______     ______     ______     ______     __     ______    
/\  == \   /\  __ \   /\  __ \   /\__  _\   /\ \   /\  ___\   
\ \  __<   \ \ \/\ \  \ \ \/\ \  \/_/\ \/  _\_\ \  \ \___  \  
 \ \_\ \_\  \ \_____\  \ \_____\    \ \_\ /\_____\  \/\_____\ 
  \/_/ /_/   \/_____/   \/_____/     \/_/ \/_____/   \/_____/         


  --- Let's save some fucking time here, shall we? ---                                                

Author: Ken Wheeler
Date: 06/13/13
Version: 1.0b

Features:

1. Responsive, swipeable Carousel
2. Custom selects *Coming Soon*
3. Custom radios & checkboxes *Coming Soon*
4. And much more...

*/

/*global window, document, $, setInterval, clearInterval */

var root = window.root || {};

/************ Helpers ***********/

// Function Binder

var functionBinder = function(fn, me) {
    'use strict';
    return function () {
        return fn.apply(me, arguments);
    };
};

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

root.Carousel = (function() {

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

            self.setPosition();

            self.list.find('img').animate({ opacity: 1 }, this.options.speed);

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
        carousels[index] = new root.Carousel(this, options);
    });

};

/*

----- End Carousel -----

*/