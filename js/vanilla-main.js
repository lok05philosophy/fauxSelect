/* global console */

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
		focusClass    : 'fauxFocus'
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

	for (var i = 0; i < defaultKeys.length; i++) {
		if ( userParameters.hasOwnProperty( defaultKeys[i] ) ) {
			this.params[defaultKeys[i]] = userParameters[defaultKeys[i]];
		}
	}
};


/**
 * _GetTagName
 * Will be used to set more specific markup for the Faux Element
 */
Faux.prototype.getTagName = function() {
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
 * _SetMarkup
 * @fires selectMarkup if tagName is select otherwise
 * @fires defaultMarkup
 */
Faux.prototype.setMarkup = function() {
	var objectHTML = this.object.cloneNode( true ),	// clone object
		objectOpts = this.object.childNodes;		// get object children

	// creates fauxElement and appends select clone
	this.fauxEl = document.createElement( 'div' );
	this.fauxEl.className = this.setClasses( this.object, 'fauxEl' );
	this.fauxEl.appendChild( objectHTML );

	// creates fauxWrapper
	this.fauxWrapper = document.createElement( 'div' );
	this.fauxWrapper.className = 'fauxWrapper';
	this.fauxEl.appendChild( this.fauxWrapper );

	switch ( this.getTagName() ) {
		case 'select':
			this.selectMarkup( objectOpts, this.object.value );
			break;
		default:
			this.defaultMarkup( objectOpts );
	}

	this.object.outerHTML = this.fauxEl.outerHTML;
};


/**
 * _SelectMarkup
 * @param {Object} options
 * @fires charReplace if user added that parameter
 * Sets markup for faux children if object is select
 */
Faux.prototype.selectMarkup = function( options/*, value*/ ) {

	for (var i = 0; i < options.length; i++) {
		if ( options[i].tagName !== undefined ) {

			var fauxOption = document.createElement( 'div' ),		// creates fauxOption
				nodeVal    = options[i].getAttribute( 'value' ),	// option value
				nodeHTML   = options[i].innerHTML;					// option html

			// set class names and attributes
			fauxOption.className = this.setClasses( options[i], 'fauxOption' );
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


			// chooses options and adds classes for
			// if ( value === nodeVal ) {
			// 	fauxOption.className += ' fauxOption--chosen';
			// 	this.fauxEl.className += ' fauxEl--selected';
			// }
			this.fauxWrapper.appendChild( fauxOption );

		}
	}

};


/**
 * _DefaultMarkup
 * @param {Object} options
 * Sets markup for faux children if object is not select
 */
Faux.prototype.defaultMarkup = function( options ) {

	for (var i = 0; i < options.length; i++) {
		if ( options[i].tagName !== undefined ) {

			var fauxOption = document.createElement( 'div' ),
				nodeHTML   = options[i].innerHTML;

			fauxOption.className = this.setClasses( options[i], 'fauxOption' );
			fauxOption.innerHTML = nodeHTML;
			this.fauxWrapper.appendChild( fauxOption );

		}
	}

};


/**
 * _FauxExpand
 * Expands faux object
 */
Faux.prototype.fauxExpand = function () {
	console.log('made it!');
};


/**
 * _Initialize
 */
Faux.prototype.init = function ( userParameters ) {
	var object = this;
	if ( userParameters ) {
		this.setParameters( userParameters );
	}
	this.setMarkup();
};


/**
 * _CreateObjects
 */
function fauxSelect( selector, userParameters ) {
	var array = document.querySelectorAll( selector );

	for (var i = 0; i < array.length; i++) {
		var faux = new Faux( array[i], userParameters );
		faux.init( userParameters );
	}
}

fauxSelect( 'select', {
	defaultOption: 'label',
	charReplace: [ '"', 'span' ]
});
fauxSelect( 'ul' );
