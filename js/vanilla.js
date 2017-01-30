(function($) {

/* global console */

$.fn.fauxSelect = function( optionalParams ) {
//⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃
//	Directory
//⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃
//
//	_AnimationSupport
//	_SetObject
//	_SetMarkup
//		__El
//		__Classes
//		__Wrapper
//		__Select
//		__InitClick
//		@_CreateOptions
//		@_SetHeader
//		__Arrow
//	_CreateOptions
//		__Disabled
//		__CharReplace
//		__AppendFauxOption
//		__Classes
//		__AnimationBackup
//	_SetHeader
//	_Expand
//		__DropOptions
//		__SetWrapperHeight
//		__Trigger
//	_Choose
//		__ChooseFaux
//		__ChooseReal
//		@_Close
//		__Trigger
//	_Close
//		__Clear
//		__Trigger
//	_Scroller
//	_KeyFocus
//		__DownArrow
//		__UpArrow
//		__Enter
//		__Tab
//		__ESC
//		@_Typer
//	_Typer
//	_Init
//		@_SetMarkup
//		__ArrowToggle
//		__Focus
//		__TargetClose
//		__Load
//
//⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⨷


var options = $.extend( {}, $.fn.fauxSelect.defaultParameters, optionalParams );

return this.each( function() {



	//---------------------------------
	//	_AnimationSupport
	//---------------------------------
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


	var numOps = 0;
	//---------------------------------
	//	_SetObject
	//---------------------------------
	var fauxObj = {
		fOptions    : [],
		fInput      : '',
		touchedTimer: null
	};



	//---------------------------------
	//	_SetMarkup
	//---------------------------------
	fauxObj.setMarkup = function() {

		//		__El
		this.wrap( '<div class="fauxEl"/>' );
		this.fEl = this.parent();

		//		__Classes
		if ( this.data( 'class' ) ) {
			var fClasses = this.data( 'class' ).split( ' ' );

			for (var e = 0; e < fClasses.length; e++) {
				this.fEl.addClass( fClasses[e] );
			}
		}

		//		__Wrapper
		this.before( '<div class="fauxWrapper"/>' );
		this.fWrapper = this.fEl.find( '.fauxWrapper' );

		//		__Select
		this.fWrapper.append( '<div class="fauxSelect"/>' );
		this.fSelect = this.fEl.find( '.fauxSelect' );

		//		__InitClick
		if ( this.children( 'option:selected' )[0] ) {
			this.initClick = this.children( 'option:selected' ).index();
		}

		//	@REF _CreateOptions
		this.createOptions();

		//	@REF _SetHeader
		if ( options.defaultOption ) {
			this.setHeader( options.defaultOption );
		}

		//		__Arrow
		if ( options.arrow ) {
			this.before( '<div class="fauxArrow"/>' );
			this.fArrow = this.fEl.find( '.fauxArrow' );
		}
	};



	//---------------------------------
	//	_CreateOptions
	//---------------------------------
	fauxObj.createOptions = function() {
		var sel = this;

		this.children().each( function( index ) {
			var optionText = $(this).text(),
				fClasses   = $(this).data( 'class' ) ? $(this).data( 'class' ).split( ' ' ) : [];

			//		__Disabled
			if ( $(this).attr( 'disabled' ) ) {
				fClasses.push( 'fauxDisabled' );
			}

			//		__CharReplace
			if ( options.optionCharReplace ) {
				if ( optionText.indexOf( options.optionCharReplace[0] ) > -1 ) {
					var char         = options.optionCharReplace[0],
						tagType      = options.optionCharReplace[1] || 'span',
						charCount    = 0,
						originalText = optionText,
						regEx        = new RegExp( char, 'g' );

					while ( optionText.indexOf(options.optionCharReplace[0]) > -1 ) {
						var tagHTML;

						if ( charCount % 2 === 0 ) {
							tagHTML = '<' + tagType + '>';
							optionText = optionText.replace( char, tagHTML);
						} else {
							tagHTML = '</' + tagType + '>';
							optionText = optionText.replace( char, tagHTML);
						}
						charCount++;
					}
					if ( charCount % 2 !== 0 ) {
						optionText = optionText + '</' + tagType + '>';
					}
					$(this).text( originalText.replace( regEx, '' ) );
				}
			}

			//		__AppendFauxOption
			sel.fSelect.append( '<div class="fauxOption">' + optionText + '</div>' );

			//		__Classes
			if ( fClasses ) {
				for (var o = 0; o < fClasses.length; o++) {
					sel.fEl.find('.fauxOption').eq(index).addClass(fClasses[o]);
				}
			}

			//		__AnimationBackup
			if ( !animationSupport ) {
				this.animationDuration = parseInt( $(this).css( 'transition-duration' ), 10 ) || 200;
			}

			sel.fOptions[index] = sel.fEl.find( '.fauxOption' ).eq( index );

			if ( !( 'ontouchstart' in document.documentElement ) ) {
				$(this).hide();
			}
			numOps++;
		});

	};



	//---------------------------------
	//	_SetHeader
	//---------------------------------
	fauxObj.setHeader = function( headerType ) {
		var headerText = '';

		this.fWrapper.prepend( '<div class="fauxHead"/>' );
		this.fHead = this.fWrapper.find( '.fauxHead' );

		switch ( headerType ) {
			case 'data':
				var data = this.data( 'placeholder' );

				if ( !data ) {
					console.log( 'Please add data-placeholder to your select' );
					return;
				}

				headerText = data;
				this.fHead.text( headerText );

				break;

			case 'label':
				var idForLabel = this.attr( 'id' ),
					label      = $( 'label[for="' + idForLabel + '"]' );

				if ( !label[0] ) {
					console.log( 'No label for select available' );
					return;
				}

				headerText = label.html();
				this.fHead.html( headerText );

				label.hide();
				break;

			default:
				console.log( 'Currently no support for this Header Type.' );
				return;

		}
	};



	//---------------------------------
	//	_Clear
	//---------------------------------
	fauxObj.clear = function() {
		this.fEl.removeClass( 'selected' );

		this.fSelect.children()
			.removeClass( 'chosen' )
			.each( function( index ) {
				$(this).css( 'z-index', numOps - index );
			});

		this.children().removeProp( 'selected' );

		this.close();
	};



	//---------------------------------
	//	_Expand
	//---------------------------------
	fauxObj.expand = function() {
		this.fEl.addClass( 'open' );
		var h = 0;

		if ( options.defaultOption ) {
			h += this.fHead.outerHeight( true );
		}

		//		__DropOptions
		$.each( this.fOptions, function() {

			if ( animationSupport ) {
				this.css( 'top', h );
			} else {
				this.animate( { 'top': h }, this.animationDuration );
			}

			h += this.outerHeight( true );

		});

		//		__SetWrapperHeight
		if ( options.maxHeight ) {
			if ( h > options.maxHeight ) {
				this.fWrapper.css( 'height', options.maxHeight );
			} else {
				this.fWrapper.css( 'height', h );
			}
		} else {
			this.fWrapper.css( 'height', h );
		}

		//		__Trigger
		this.trigger( 'faux-expand', [ this, h ] );
	};



	//---------------------------------
	//	_Choose
	//---------------------------------
	fauxObj.choose = function( chosenIndex ) {

		//		__ChooseFaux
		this.fSelect.children()
			.removeClass( 'fauxHover' )
			.eq( chosenIndex )
				.addClass( 'chosen' )
				.css( 'z-index', numOps + 1 )
			.siblings().each( function() {
				$(this)
					.removeClass( 'chosen' )
					.css( 'z-index', $(this).index() );
			});

		//		__ChooseReal
		this.children()
			.eq( chosenIndex )
				.prop( 'selected', 'selected' )
			.siblings()
				.removeProp( 'selected' );

		//	@REF _Choose
		this.close();

		this.fEl.addClass( 'selected' );

		//		__Trigger
		this.trigger( 'faux-choose', [ this, chosenIndex ] );
	};



	//---------------------------------
	//	_Close
	//---------------------------------
	fauxObj.close = function() {

		$.each( this.fOptions, function() {

			this.removeClass( 'fauxHover' );

			if ( animationSupport ) {
				this.css( 'top', 0 );
			} else {
				this.animate( { 'top': 0 }, this.animationDuration );
			}

		});

		//		__Clear
		this.fWrapper.removeAttr( 'style' );
		this.fEl.removeClass( 'open' );

		//		__Trigger
		this.trigger( 'faux-close', [ this ] );
	};



	//---------------------------------
	//	_Scroller
	//---------------------------------
	fauxObj.fauxScroller = function() {
		var hoverEl  = this.fSelect.children( '.fauxHover' ),
			headerH  = options.defaultOption ? this.fHead.outerHeight( true ) : 0,
			hOffset  = {
				'top': hoverEl.offset().top,
				'bot': hoverEl.offset().top + hoverEl.outerHeight( true )
			},
			wOffset  = {
				'top': this.fWrapper.offset().top + headerH,
				'bot': this.fWrapper.offset().top + this.fWrapper.innerHeight() - headerH
			},
			scrollPo = this.fWrapper.scrollTop(),
			scrollDest;

		if ( hOffset.bot > wOffset.bot ) {
			scrollDest = scrollPo + ( hOffset.bot - wOffset.bot );
		} else if ( hOffset.top < wOffset.top ) {
			scrollDest = scrollPo - ( wOffset.top - hOffset.top );
		}

		this.fWrapper.animate( { scrollTop: scrollDest }, 50 );
	};



	//---------------------------------
	//	_KeyFocus
	//---------------------------------
	fauxObj.fauxFocus = function() {
		var sel = this;

		$(window).keydown( function(e) {
			if ( sel.is( ':focus' ) ) {

				switch ( e.keyCode ) {

					//		__DownArrow
					case 40:
						sel.fInput = '';

						if ( !sel.fEl.hasClass( 'open' ) ) {
							sel.expand();
						} else {

							if ( !sel.fSelect.children( '.fauxHover' )[0] ) {
								sel.fSelect.children().eq(0).addClass( 'fauxHover' );
							} else {
								if ( sel.fSelect.children( '.fauxHover' ).next() ) {
									sel.fSelect.children( '.fauxHover' )
										.next().addClass( 'fauxHover' )
										.siblings().removeClass( 'fauxHover' );
								}
								if ( options.maxHeight ) {
									sel.fauxScroller();
								}
							}
						}
						break;

					//		__UpArrow
					case 38:
						sel.fInput = '';

						if ( sel.fEl.hasClass( 'open' ) ) {
							if ( sel.fSelect.children( '.fauxHover' ).prev() ) {
								sel.fSelect.children( '.fauxHover' )
									.prev().addClass( 'fauxHover' )
									.siblings().removeClass( 'fauxHover' );
							}
							if ( options.maxHeight ) {
								sel.fauxScroller();
							}
						}
						break;

					//		__Enter
					case 13:
						if ( sel.fSelect.children().hasClass( 'fauxHover' ) ) {
							var sIndex = sel.fSelect.children( '.fauxHover' ).index();
							sel.choose( sIndex );
						}
						break;

					//		__Tab
					case 9:
						sel.close();
						break;

					//		__ESC
					case 27:
						sel.close();
						break;

					//	@REF _Typer
					default:
						sel.focusTyper( e.keyCode );
				}

			}
		});
	};



	//---------------------------------
	//	_Typer
	//---------------------------------
	fauxObj.focusTyper = function( key ) {

		this.fInput += String.fromCharCode( key );

		var sel      = this,
			fInput   = this.fInput.toLowerCase(),
			notFound = true;

		$.each( this.fOptions, function() {
			var fOpText = this.text().toLowerCase();

			if ( fOpText.indexOf( fInput ) > -1 && notFound ) {
				notFound = false;

				this.addClass( 'fauxHover' ).siblings().removeClass( 'fauxHover' );

				if ( options.maxHeight ) {
					sel.fauxScroller();
				}

				if ( !sel.fEl.hasClass( 'open' ) ) {
					this.click();
				}

			}
		});

		clearTimeout( sel.touchedTimer );

		this.trigger( 'faux-typing', [ this, fInput ] );
	};



	//---------------------------------
	//	_Init
	//---------------------------------
	fauxObj.init = function() {
		var sel = this;

		//	@REF _SetMarkup
		this.setMarkup();

		//		__ArrowToggle
		if ( options.arrow ) {
			this.fArrow.click( function() {
				if ( sel.fEl.hasClass( 'open' ) ) {
					sel.close();
				} else {
					sel.expand();
				}
			});
		}

		//		__Focus
		this.focus( function() {
			sel.fEl.addClass( options.fauxFocusClass );
		});
		this.blur( function() {
			this.fInput = '';
			sel.fEl.removeClass( options.fauxFocusClass );
		});

		this.fauxFocus();

		this.fEl.click( function() {
			sel.focus();
		});

		$(window).keyup( function() {

			clearTimeout( sel.touchedTimer );

			sel.touchedTimer = setTimeout( function() {
				sel.fInput = '';
			}, 1250);

		});

		//		__OptionClick
		this.fSelect.children().each( function( index ) {

			$(this).css( 'z-index', numOps - index );

			$(this).click( function() {
				var sIndex = $(this).index();

				if ( sel.fEl.hasClass( 'open' ) ) {
					if ( !$(this).hasClass( 'fauxDisabled' ) ) {
						sel.choose( sIndex );
					} else {
						sel.close();
					}
				} else {
					if ( sel.fInput === '' ) {
						sel.expand();
					} else {
						sel.choose( sIndex );
					}
				}
			});

		});

		this.fHead.click( function() {
			if ( sel.fEl.hasClass( 'open' ) ) {
				sel.clear();
			} else {
				sel.expand();
			}
		});

		//		__TargetClose
		$(window).mouseup( function( e ) {
			if ( !sel.fEl.is( e.target ) && sel.fEl.has( e.target ).length === 0 ) {
				sel.close();
			}
		});


		//		__Load
		$(window).load(function() {
			sel.trigger('faux-initialized', [sel, options]);
			if ( sel.initClick ) {
				sel.choose(sel, sel.initClick);
			}
		});
	};



	var faux = $.extend( {}, $(this), fauxObj );

	faux.init();

});


//---------------------------------
};

$.fn.fauxSelect.defaultParameters = {
	defaultOption    : false,
	arrow            : false,
	optionCharReplace: false,
	maxHeight        : false,
	fauxFocusClass   : 'fauxFocus'
};


}(jQuery));
