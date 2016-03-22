(function($) {

/* global console */

$.fn.fauxSelect = function( userParameters ) {

	var options = $.extend( {}, $.fn.fauxSelect.defaultParameters, userParameters );

	return this.each(function() {

		var numOps = 0;

		function animationSupport() {
			var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' '),
				div = document.createElement('div');
			for(var i = 0; i < prefixes.length; i++) {
				if(div && div.style[prefixes[i]] !== undefined) {
					return prefixes[i];
				}
			}
			return false;
		}

		var fauxer = {
			fOptions: [],

			// _setMarkup
			setMarkup: function() {
				// creates faux element markup
				this.wrap('<div class="fauxEl"/>');
				this.fEl = this.parent();

				if ( options.maxHeight ) {
					this.fEl.addClass('maxHeight');
				}

				// adds classes to the fauxEl based on select's data-class
				if ( this.data('class') ) {
					var fClasses = this.data('class').split(' ');

					for (var i = 0; i < fClasses.length; i++) {
						this.fEl.addClass(fClasses[i]);
					}
				}

				// creates inner wrapper for interactive faux elements
				this.before('<div class="fauxWrapper"/>');
				this.fWrapper = this.fEl.find('.fauxWrapper');

				// creates faux select
				this.fWrapper.append('<div class="fauxSelect"/>');
				this.fSelect = this.fEl.find('.fauxSelect');

				if ( this.children('option:selected')[0] ) {
					this.initClick = this.children('option:selected').index();
				}

				// @REF _createOptions
				this.createOptions();

				// @REF _setHeader
				if ( options.defaultOption ) {
					this.setHeader(options.defaultOption);
				} else {
					this.fWrapper.prepend('<div class="fauxDropper"/>');
					this.fDropper = this.fWrapper.find('.fauxDropper');
				}

				// creates a drop down indicator if arrow (option) is true
				if ( options.arrow ) {
					this.before('<div class="fauxArrow"/>');
					this.fArrow = this.fEl.find('.fauxArrow');
				}
			},

			// _setHeader
			setHeader: function(headerType) {
				// creates empty var for header text
				var headerText;

				// creates header element
				this.fWrapper.prepend('<div class="fauxHead"/>');
				this.fHead = this.fWrapper.find('.fauxHead');

				// sets header text based off defaultOption (option)
				switch (headerType) {
					case 'data':
						// checks to see if a data-placeholder actually exists
						if ( !this.data('placeholder') ) {
							console.log('Please add data-placeholder to your select');
							return;
						}

						// sets header text to data-placeholder
						headerText = this.data('placeholder');
						this.fHead.text(headerText);
						break;

					case 'label':
						// finds label associated with select
						var idForLabel = this.attr('id'),
							label = $('label[for="' + idForLabel + '"]');

						// sets header text to label
						headerText = label.html();
						this.fHead.html(headerText);

						// hides original label
						label.hide();
						break;

					// TODO: consider other cases for faux head
					default:
						return;
				}
			},

			// _createOptions
			createOptions: function() {
				var sel = this;

				this.children().each(function(index) {
					var optionText = $(this).text(),
						fClasses = $(this).data('class') ? $(this).data('class').split(' ') : [];

					if ( $(this).attr('disabled') ) {
						fClasses.push('fauxDisabled');
					}

					// checks if the character replace option is select
					if ( options.optionCharReplace ) {
						// checks to see if that character exists in each option
						if ( optionText.indexOf(options.optionCharReplace[0]) > -1 ) {
							var char      = options.optionCharReplace[0],
								tagType   = options.optionCharReplace[1],
								charCount = 0;

							// while there are special characters replace them with HTML tags
							while ( optionText.indexOf(options.optionCharReplace[0]) > -1 ) {
								var tagHTML;
								if ( charCount % 2 === 0 ) {
									tagHTML = '<' + tagType + '>';
									optionText = optionText.replace(char, tagHTML);
								} else {
									tagHTML = '</' + tagType + '>';
									optionText = optionText.replace(char, tagHTML);
								}
								charCount++;
							}
							// fallback to close tag if someone inputs an uneven number of characters
							if ( charCount % 2 !== 0 ) {
								optionText = optionText + '</' + tagType + '>';
							}
						}
					}

					// sets the faux option text (with or without additionally generated markup)
					sel.fSelect.append('<div class="fauxOption">' + optionText + '</div>');

					if ( fClasses ) {
						for (var o = 0; o < fClasses.length; o++) {
							sel.fEl.find('.fauxOption').eq(index).addClass(fClasses[o]);
						}
					}

					sel.fOptions[index] = sel.fEl.find('.fauxOption').eq(index);

					// hides option
					$(this).hide();
					numOps++;
				});
			},

			// _expand
			expand: function() {
				this.fEl.addClass('open');
				var t = 0;

				if ( options.defaultOption ) {
					t += this.fHead.outerHeight(true);
				}
				$.each(this.fOptions, function() {
					// detects if css animations are supported
					if ( animationSupport ) {
						this.css('top', t);
					// fall back to animate property
					} else {
						var aD = parseInt(this.css('transition-duration'), 10) || 250;
						this.animate({'top': t}, aD);
					}
					t += this.outerHeight(true);
				});

				if ( options.maxHeight ) {
					this.fWrapper.css('height', options.maxHeight);
				}

				this.trigger('faux-expand', [this, t]);
			},

			// _choose
			choose: function(obj, index, close) {
				obj.fSelect.children()
					.removeClass('fauxHover')
					.eq(index)
						.addClass('chosen')
						.css('z-index', numOps + 1)
					.siblings().each(function() {
						$(this)
							.removeClass('chosen')
							.css('z-index', $(this).index());
					});

				// adds selected property to real option
				obj.children().eq(index).prop('selected', 'selected').siblings().removeProp('selected');

				if ( !close ) {
					obj.close();
				}

				obj.fEl.addClass('selected');

				this.trigger('faux-choose', [this, index]);
			},

			// _close
			close: function() {
				var sel = this;
				$.each(this.fOptions, function() {
					if ( animationSupport ) {
						this.css('top', 0);
					} else {
						var aD = parseInt(this.css('transition-duration'), 10) || 250;
						this.animate({'top': 0}, aD);
					}
				});
				this.fEl.removeClass('open');

				if ( options.focusExpander ) {
					this.fSelect.children().removeClass('fauxHover');
					this.fInput = '';
				}

				if ( options.maxHeight ) {
					sel.fWrapper.removeAttr('style');
				}

				this.trigger('faux-close', [this]);
			},

			fauxScroller: function() {
				// gets bottom of "hovered" option and the faux wrapper
				var fauxHoverBotOffset = this.fSelect.children('.fauxHover').offset().top + this.fSelect.children('.fauxHover').innerHeight(),
					fauxWrapperBottomOffset = this.fWrapper.offset().top + this.fWrapper.innerHeight();

				// if there is a header, subtract that height from the offset
				fauxWrapperBottomOffset = options.defaultOption ? fauxWrapperBottomOffset - this.fHead.innerHeight() : fauxWrapperBottomOffset;

				// if option is below the viewable portion of wrapper, scroll down
				if ( fauxHoverBotOffset > fauxWrapperBottomOffset ) {
					var oBDiff = fauxHoverBotOffset - fauxWrapperBottomOffset,
						oBScroll = this.fWrapper.scrollTop();

					this.fWrapper.animate({
						scrollTop: oBScroll + oBDiff
					}, 100);
				}

				// gets top of "hovered" option and the faux wrapper
				var fauxHoverOffset = this.fSelect.children('.fauxHover').offset().top,
					fauxWrapperOffset = this.fWrapper.offset().top;

				// if there is a header, add that height to the offset
				fauxWrapperOffset = options.defaultOption ? fauxWrapperOffset + this.fHead.innerHeight() : fauxWrapperOffset;

				// if option is above the viewable portion of wrapper, scroll up
				if ( fauxHoverOffset < fauxWrapperOffset ) {
					var oDiff = fauxWrapperOffset - fauxHoverOffset,
						oScroll = this.fWrapper.scrollTop();

					this.fWrapper.animate({
						scrollTop: oScroll - oDiff
					}, 100);
				}
			},

			// _focus
			fauxFocus: function() {
				var sel = this;
				$(window).keydown(function(e) {
					if ( sel.is(':focus') ) {
						switch ( e.keyCode ) {
							// down arrow
							case 40:
								sel.fInput = '';
								// expands
								if ( !sel.fEl.hasClass('open') ) {
									sel.expand();
								// navigates down faux options and adds class fauxHover to "highlighted"
								} else {
									// adds fauxHover to first faux option none currently have fauxHover class
									if ( !sel.fSelect.children('.fauxHover')[0] ) {
										sel.fSelect.children().eq(0).addClass('fauxHover');
									// if fauxHover class is present, add it to next faux option if it exists
									} else {
										if ( sel.fSelect.children('.fauxHover').next() ) {
											sel.fSelect.children('.fauxHover').next().addClass('fauxHover')
												.siblings().removeClass('fauxHover');
										}
										if ( options.maxHeight ) {
											sel.fauxScroller();
										}
									}
								}
								break;
							// up arrow
							case 38:
								sel.fInput = '';
								if ( sel.fEl.hasClass('open') ) {
									// if fauxHover class is present, add it to previous faux option if it exists
									if ( sel.fSelect.children('.fauxHover').prev() ) {
										sel.fSelect.children('.fauxHover').prev().addClass('fauxHover')
											.siblings().removeClass('fauxHover');
									}
									if ( options.maxHeight ) {
										sel.fauxScroller();
									}
								}
								break;
							// enter
							case 13:
								if ( sel.fSelect.children().hasClass('fauxHover') ) {
									// if faux option has class fauxHover, select it
									var sIndex = sel.fSelect.children('.fauxHover').index();
									sel.choose(sel, sIndex);
								}
								return false;
							// tab
							case 9:
								sel.close();
								break;
							// esc
							case 27:
								sel.close();
								break;
							default:
								// catches key strokes to compare option text to @REF _focusTyper
								sel.focusTyper(e.keyCode);
						}
					}
				});
			},

			// _focusTyper
			focusTyper: function(key) {
				// assign property to user input if select has focus
				this.fInput += String.fromCharCode(key);

				var sel = this,
					fInput = this.fInput.toLowerCase(),
					notFound = true;

				// if faux input matches an options text, select it
				$.each(this.fOptions, function() {
					var fOpText = this.text().toLowerCase();

					if ( fOpText.indexOf(fInput) > -1 && notFound ) {
						notFound = false;
						this.addClass('fauxHover').siblings().removeClass('fauxHover');
						sel.fauxScroller();
						if ( !sel.fEl.hasClass('open') ) {
							this.click();
						}
					}
				});

				clearTimeout(sel.touchedTimer);

				this.trigger('faux-typing', [fInput]);
			},

			// initialize each faux select element
			initialize: function() {

				// @REF _setMarkup
				this.setMarkup();

				var sel = this,
					// sets expander to either faux head or faux dropper
					expander = (options.defaultOption) ? this.fHead : this.fDropper;

				// expander either expands faux select or resets it if open
				expander
					.css('z-index', numOps + 2)
					.click(function() {
						if ( sel.fEl.hasClass('open') ) {

							sel.fSelect.children().removeClass('chosen').css('z-index', 'auto');
							sel.fEl.removeClass('selected');

							sel.children().removeProp('selected');
							sel.close();
						} else {
							sel.expand();
						}
					});

				// arrow expand/close
				if ( this.fEl.find('.fauxArrow')[0] ) {
					this.fArrow.click(function() {
						if ( sel.fEl.hasClass('open') ) {
							sel.close();
						} else {
							sel.expand();
						}
					});
				}

				// close faux select if something other than faux element is clicked
				$(window).mouseup(function(e){
					if ( !sel.fEl.is(e.target) && sel.fEl.has(e.target).length === 0 ) {
						sel.close();
				    }
				});

				$(window).keydown(function(e){
					if ( e.keyCode === 27 && sel.fEl.hasClass('open') ) {
						sel.close();
					}
				});

				// faux option click to expand/select
				this.fSelect.children().each(function(index) {
					$(this).css('z-index', numOps - index);
					$(this).click(function() {
						var sIndex = $(this).index();
						if ( sel.fEl.hasClass('open') && sel.fInput === '' && !$(this).hasClass('fauxDisabled') ) {
							sel.choose(sel, sIndex);
						} else if ( !sel.fEl.hasClass('open') && sel.fInput === '' ) {
							sel.expand();
						} else if ( sel.fEl.hasClass('open') && sel.fInput !== '' && !$(this).hasClass('fauxDisabled') ) {
							sel.choose(sel, sIndex);
						}
						if ( sel.fInput !== '' && !$(this).hasClass('fauxDisabled') ) {
							sel.choose(sel, sIndex, true);
						}
						if ( $(this).hasClass('fauxDisabled') ) {
							sel.fSelect.children().removeClass('chosen').css('z-index', 'auto');
							sel.fEl.removeClass('selected');

							sel.children().removeProp('selected');
							sel.close();
						}
					});
				});

				// sets properties and methods if focusExpander is chosen @REF _focus
				if ( options.focusExpander ) {
					this.touchedTimer = null;

					this.fInput = '';
					this.fauxFocus();

					this.blur(function() {
						this.fInput = '';
					});

					$(window).keyup(function() {
						clearTimeout(sel.touchedTimer);
						sel.touchedTimer = setTimeout(function() {
							sel.fInput = '';
						}, 1250);
					});

					this.fEl.click(function() {
						sel.focus();
					});
				}

				$(window).load(function() {
					sel.trigger('faux-initialized', [sel, options]);
					if ( sel.initClick ) {
						sel.choose(sel, sel.initClick);
					}
				});
			}
		};

		var fauxMe = $.extend( {}, $(this), fauxer );

		fauxMe.initialize();

	});

};

$.fn.fauxSelect.defaultParameters = {
	// sets the option to display as default
	// false   = will use the first option
	// 'data'  = give select data-placeholder to use
	// 'label' = uses label text associated with select and hides it
	defaultOption    : false,
	// adds a styleable element for drop down indicator (ie arrow)
	// boolean
	arrow            : false,
	// will grab string characters and replace them with tag
	// use an array where the first is the character to be replaced
	// and the second what tag you want to use (ie ['-', 'span'])
	// if second is not provided, a span will be assumed
	optionCharReplace: false,
	// will treat faux select like a normal select, on focus
	// hitting down arrow will expand and navigate through options
	focusExpander    : true,
	maxHeight        : false
};

}(jQuery));
