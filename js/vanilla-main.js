/* global console */

function addClass ( element, className ) {
	if ( element.className.indexOf( className ) === -1 ) {
		element.className += className;
	}
}
function removeClass ( element, className ) {
	if ( element.className.indexOf( className ) > -1 ) {
		element.className = element.className.replace( className, '' );
	}
}
function hasClass ( element, className ) {
	return element.className.indexOf( className ) > -1;
}
function hasTarget ( target, element ) {
	console.log(target);
	if ( target === element ) {
		return true;
	} else {
		var children = element.children;
		if ( children[0] ) {
			for ( var i = 0; i < children.length; i++ ) {
				hasTarget( target, children[i] );
			}
		} else {
			return false;
		}
	}
}
//⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃
//	Directory
//⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃
//
//	_Constructor
//	_SetParameters
//	_GetTagName
//	_SetClasses
//	_CharReplace
//	_SetMarkup
//	_SelectMarkup
//	_DefaultMarkup
//	_Initialize
//	_CreateObjects
//
//⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⁃⨷

/**
 * _Constructor FauxObject
 * @class Faux
 * @param {Object} domObject
 */
function Faux( domObject ) {
	this.params = {
		defaultOption : false,
		arrow         : false,
		charReplace   : false,
		maxHeight     : false,
		focusClass    : 'focused'
	};
	this.class = {
		focus   : ' focused',
		open    : ' open',
		selected: ' selected',
		hover   : ' hover',
		disabled: ' disabled'
	};
	this.object = domObject;
}


/**
 * _SetParameters
 * @param {Object} userParameters
 * If user params are set this will overwrite objects default params
 */
Faux.prototype.setParameters = function ( userParameters ) {
	var defaultKeys = Object.keys( this.params );

	for ( var i = 0; i < defaultKeys.length; i++ ) {
		if ( userParameters.hasOwnProperty( defaultKeys[i] ) ) {
			this.params[defaultKeys[i]] = userParameters[defaultKeys[i]];
		}
	}
};


/**
 * _GetTagName
 * Will be used to set more specific markup for the faux element
 */
Faux.prototype.getTagName = function () {
	return this.object.tagName.toLowerCase();
};


/**
 * _SetClasses
 * @param {Object} elemObject
 * @param {String} baseClass
 * transfers class names from original object/children
 * to the new faux object/children
 */
 Faux.prototype.setClasses = function ( elemObject, baseClass ) {
 	var elemClasses       = elemObject.className,
		additionalClasses = elemObject.getAttribute( 'data-class' ),
		newClass          = baseClass;

	if ( elemClasses !== '' && additionalClasses !== null ) {
		newClass += ' ' + elemClasses + ' ' + additionalClasses;
	} else if ( elemClasses !== '' ) {
		newClass += ' ' + elemClasses;
	} else if ( additionalClasses !== null ) {
		newClass += ' ' + additionalClasses;
	}

	return newClass;
 };


/**
 * _CharReplace
 * @param {Object} option
 * If set, replaces character with html tag type
 */
Faux.prototype.charReplace = function ( option ) {
	var charArray = this.params.charReplace,
		char      = charArray[0],
		tagType   = charArray[1] || 'span',
		charCount = 0,
		fauxHTML  = option.innerHTML;

	while ( fauxHTML.indexOf( char ) > -1 ) {
		var tag;

		if ( charCount % 2 === 0 ) {
			tag = '<' + tagType + '>';
		} else {
			tag = '</' + tagType + '>';
		}
		fauxHTML = fauxHTML.replace( char, tag );
		charCount++;
	}
	if ( charCount % 2 !== 0 ) {
		fauxHTML += '</' + tagType + '>';
	}
	option.innerHTML = option.innerHTML.replace( /char/g, '' );
	return fauxHTML;
};


/**
 * _StyleOptions
 * Styles faux options
 */
Faux.prototype.styleOptions = function () {
	for (var i = 0; i < this.fauxOptions.length; i++) {
		this.fauxOptions[i].style.zIndex = this.numOpts - i;
		if ( hasClass( this.fauxOptions[i], this.class.selected ) ) {
			this.fauxOptions[i].style.zIndex = this.numOpts;
		}
	}
};


/**
 * _SetMarkup
 * @fires selectMarkup if tagName is select otherwise
 * @fires defaultMarkup
 */
Faux.prototype.setMarkup = function () {
	var	objectOpts = this.object.children;
	this.numOpts = objectOpts.length;

	// create fauxElement
	this.fauxEl = document.createElement( 'div' );
	this.fauxEl.className = this.setClasses( this.object, 'fauxEl' );

	// creates fauxWrapper
	this.fauxWrapper = document.createElement( 'div' );
	this.fauxWrapper.className = 'fauxWrapper';
	this.fauxEl.appendChild( this.fauxWrapper );

	// gives faux wrapper a max height if parameter is not false
	if ( this.params.maxHeight ) {
		this.fauxWrapper.style.maxHeight = this.params.maxHeight + 'px';
	}

	switch ( this.getTagName() ) {
		case 'select':
			this.selectMarkup( objectOpts, this.object.value );
			break;
		default:
			this.defaultMarkup( objectOpts );
	}

	// makes faux children array object property
	this.fauxOptions = this.fauxWrapper.children;
	this.styleOptions();

	// insert fauxEl into dom and append the object
	this.object.parentNode.insertBefore( this.fauxEl, this.object );
	this.fauxEl.append( this.object );
};


/**
 * _SelectMarkup
 * @param {Object} options
 * @fires charReplace if user added that parameter
 * Sets markup for faux options if object is select
 */
Faux.prototype.selectMarkup = function ( options/*, value*/ ) {

	for ( var i = 0; i < options.length; i++ ) {

		var fauxOption = document.createElement( 'div' ),		// creates fauxOption
			nodeVal    = options[i].getAttribute( 'value' ),	// option value
			nodeHTML   = options[i].innerHTML;					// option html

		// set class names and attributes
		fauxOption.className = this.setClasses( options[i], 'fauxOption' );
		if ( this.object.value === nodeVal ) {
			addClass( fauxOption, this.class.selected );
		}
		if ( options[i].hasAttribute( 'disabled' ) ) {
			addClass( fauxOption, this.class.disabled );
		}
		fauxOption.setAttribute( 'data-val', nodeVal );

		// char replace
		if (
			this.params.charReplace &&
			nodeHTML.indexOf( this.params.charReplace[0] ) > -1
		) {
			fauxOption.innerHTML = this.charReplace( options[i] );
		} else {
			fauxOption.innerHTML = nodeHTML;
		}

		this.fauxWrapper.appendChild( fauxOption );

		// if not touch device, hide object children
		if ( !( 'ontouchstart' in document.documentElement ) ) {
			options[i].style.display = 'none';
		}
	}

};


/**
 * _DefaultMarkup
 * @param {Object} options
 * Sets markup for faux options if object is not select
 */
Faux.prototype.defaultMarkup = function ( options ) {

	for (var i = 0; i < options.length; i++) {

		var fauxOption = document.createElement( 'div' ),
			nodeHTML   = options[i].innerHTML;

		fauxOption.className = this.setClasses( options[i], 'fauxOption' );
		if ( options[i].hasAttribute( 'selected' ) ) {
			addClass( fauxOption, this.class.selected );
		}
		if ( options[i].hasAttribute( 'disabled' ) ) {
			addClass( fauxOption, this.class.disabled );
		}
		fauxOption.innerHTML = nodeHTML;
		this.fauxWrapper.appendChild( fauxOption );

		// hide object children
		options[i].style.display = 'none';

	}

};


/**
 * _FauxExpand
 * Expands faux object
 */
Faux.prototype.fauxExpand = function () {
	var t = 0; // value to catch option heights and set top values

	addClass( this.fauxEl, this.class.open );
	// this.fauxEl.className += this.class.open;

	for ( var i = 0; i < this.fauxOptions.length; i++ ) {
		this.fauxOptions[i].style.top = t + 'px';
		t += this.fauxOptions[i].offsetHeight;
	}

	this.fauxWrapper.style.height = t + 'px';
};


/**
 * _FauxChoose
 * @param {String||Int} selected
 * @fires styleOptions
 * @fires fauxClose
 * Chooses an option
 */
Faux.prototype.fauxChoose = function ( selected ) {
	if ( typeof selected === 'string' ) {
		for ( var i = 0; i < this.fauxOptions.length; i++ ) {
			if ( this.fauxOptions[i].getAttribute( 'data-val' ) === selected ) {
				addClass( this.fauxOptions[i], this.class.selected );
			} else {
				removeClass( this.fauxOptions[i], this.class.selected );
			}
		}
		for ( var i = 0; i < this.object.children.length; i++ ) {
			if ( this.object.children[i].getAttribute( 'value' ) === selected ) {
				this.object.children[i].setAttribute( 'selected', 'selected' );
			} else {
				this.object.children[i].removeAttribute( 'selected' );
			}
		}
	} else {
		for ( var i = 0; i < this.fauxOptions.length; i++ ) {
			if ( i === selected ) {
				addClass( this.fauxOptions[i], this.class.selected );
				this.object.children[i].setAttribute( 'selected', 'selected' );
			} else {
				removeClass( this.fauxOptions[i], this.class.selected );
				this.object.children[i].removeAttribute( 'selected' );
			}
		}
	}
	this.styleOptions();
	this.fauxClose();
};


/**
 * _FauxClose
 * Closes faux object
 */
Faux.prototype.fauxClose = function () {
	removeClass( this.fauxEl, this.class.open );

	for ( var i = 0; i < this.fauxOptions.length; i++ ) {
		this.fauxOptions[i].style.top = '';
	}
	this.fauxWrapper.style.height = '';
};


/**
 * _FauxFocus
 */
Faux.prototype.fauxFocus = function () {
	addClass( this.fauxEl, this.class.focus );
};


/**
 * _FauxBlur
 */
Faux.prototype.fauxBlur = function () {
	removeClass( this.fauxEl, this.class.open );
	removeClass( this.fauxEl, this.class.focus );
};


/**
 * _Initialize
 * @fires setParameters
 * @fires setMarkup
 */
Faux.prototype.init = function ( userParameters ) {
	var faux = this;
	if ( userParameters ) {
		this.setParameters( userParameters );
	}
	this.setMarkup();
	this.fauxEl.addEventListener( 'click', function (e) {
		if ( !hasClass( faux.fauxEl, faux.class.open ) ) {
			faux.fauxExpand();
		} else {
			var target = e.target;

			if ( !hasClass( target, faux.class.disabled ) ) {
				var optsArray = Array.prototype.slice.call( target.parentNode.children ),
					selected  = target.getAttribute( 'data-val' ) ? target.getAttribute( 'data-val' ) : optsArray.indexOf( target );

				faux.fauxChoose( selected );
			} else {
				faux.fauxClose();
			}
		}
	});
	this.object.addEventListener( 'focus', function () {
		faux.fauxFocus();
	});
	this.object.addEventListener( 'blur', function () {
		faux.fauxBlur();
	});
};


/**
 * _CreateObjects
 */
function fauxSelect( selector, userParameters ) {
	var array = document.querySelectorAll( selector );

	if ( array[0] ) {
		var fauxObjectArray = [];

		for ( var i = 0; i < array.length; i++ ) {
			var faux = new Faux( array[i], userParameters );
			faux.init( userParameters );
			fauxObjectArray.push( faux );
		}

		document.addEventListener( 'click', function (e) {
			for ( var i = 0; i < fauxObjectArray.length; i++ ) {
				if ( i === 1 ) {
					console.log( hasTarget( e.target, fauxObjectArray[i].fauxEl ) );
				}
				// console.log( hasTarget( e.target, fauxObjectArray[i].fauxEl ) );
				// if ( !hasTarget( e.target, fauxObjectArray[i].fauxEl ) ) {
				// 	fauxObjectArray[i].fauxClose();
				// }
			}
		});
	}
}

fauxSelect( 'select', {
	defaultOption: 'label',
	charReplace: [ '"', 'span' ],
	maxHeight: 250
});
fauxSelect( 'ul' );


(function($) {

	$('.this_form').submit(function(e) {
		e.preventDefault();
		console.log($(this).serialize());
	});

}(jQuery));
