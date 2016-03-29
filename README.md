# fauxSelect
***

VERSION 2.1.2

2.1.2
Patch:
Related to 2.0.2 - fauxWrapper has `overflow: auto`

2.1.0
Minor Update:
Updated z-index values so later `fauxEl`s do not sit on top of open `fauxEl`s

2.0.2
Patch:
If `maxHeight` option is selected, it would set the height of `fauxWrapper` to that height.  
Now it will either be set to`maxHeight` if the total height of options is greater than `maxHeight`  
or will set it to the total height of the options.

2.0.1
Patch:
Removed `overflow: -moz-scrollbars-none;`. Was intended to remove scrollbars, but didn't allow scrolling on Firefox

2.0.0
Major version updates include:
* Removes:
	* `bottomSpacer` and
	* `transitionDelay` options
* Changes:
	* `placeHolder` is now `defaultOption` with updated options
* Additions:
	* `optionCharReplace` and
	* `focusExpander` options

***

## Javascript

#### Call

In your javascript file simply run `.fauxSelect()` on your target element and pass optional parameters in object notation

_Example_:

`$('select').fauxSelect();`

-or-
```
$('select').fauxSelect({
	defaultOption: 'label',
	arrow: true,
	optionCharReplace: ['"', 'em'],
	maxHeight: 250
});
```


<br>
#### Options
<br>
`defaultOption` - (default `false`)

| Option     | Description     |
| :------------- | :------------- |
| `false`       | Nothing is added/changed and first option will be default option  |
| `'data'`       | give select `data-placeholder` attribute with text you want as your default option  |
| `'label'`       | uses `<label>` associated with select (must be `for` select to read it)  |

<br>
`arrow` - (default `false`)

Boolean - either adds `fauxArrow` for `true` or does nothing `false`

<br>
`optionCharReplace` - (default `false`)

| Option     | Description     |
| :------------- | :------------- |
| `false`      | Does nothing       |
| Array (i.e. `['-', 'span']`)      | Replaces special character in options (index 0) with markup tags (index 1)       |

<br>
`focusExpander` - (default `true`)

Boolean - adds additional "normal" select functionality
* Allows tabbing focus
* Down arrow opens when focused
* Down/Up arrows navigate options when open
* Enter selects highlighted option
* Adds `.fauxHover` class on arrow navigated options.
* User input searches through option text for matches

<br>
#### Triggers

`faux-initialized` runs when element is finished setting up.

_Returns_:
* Select object
* Options

_Example_:
```
$('select').on('faux-initialized', function(event, sel, opts) {
	$(this).focus(function() {
		sel.fEl.addClass('focus');
	});
	$(this).blur(function() {
		sel.fEl.removeClass('focus');
	});
	sel.fArrow.append("<div><img src="../images/your-cool-arrow.png"></div>");

	$(window).on('load resize', function(){
		if ( $(this).width() > 1000 ) {
			opts.maxHeight = 250;
		} else {
			opts.maxHeight = 150;
		}
	});
});
```

<br>
`faux-typing` runs when element has focus and user is typing

_Returns_:
* User input (lowercase)

_Example_:
```
$('.fauxEl').on('faux-typing', function(event, input) {
	if ( $(this).next('p')[0] ) {
		$('.fauxEl').next('p').text('Your input was: '+input);
	} else {
		$(this).after('<p>Your input was: '+input+'</p>');
	}
});
```

<br>
`faux-choose` runs when an object is chosen

_Returns_:
* Select object
* Selected option index

_Example_:
```
$('.fauxEl').on('faux-choose', function(event, sel, index) {
	console.log('You chose: option ' + index);
});
```

<br>
`faux-expand` runs when select is expanded

_Returns_:
* Select object
* Expanded height

_Example_:
```
$('.fauxEl').on('faux-expand', function(event, sel, height) {
	console.log('Select height is: ' + height);
});
```

***
## SCSS (CSS):
Taking full advantage of this plugin involves use of scss. You can just copy CSS and change certain styling from in there,  
but including `_helpers`, `_faux-config` and `_fauxSelect` scss files will allow you to customize styling from the config file.  
In your main scss file only include `_fauxSelect` and in `_fauxSelect` include first `_helpers` then `_faux-config`.

#### Animation Properties
Can include multiple properties, durations and timing functions as long as they are separated by commas.  
If multiple properties are written, they will correspond to same index of other properties.

_Example_:
```
$a_properties     : top, background-color;
$a_duration       : 500ms, 0.25s;
$a_timing_function: ease-in-out;
```
`500ms` corresponds to `top` while `0.25s` corresponds to `background-color`, and _both_ properties will have a  
`timing-function` of `ease-in-out`.

#### Element Styling

`faux_height` will give the height of the element

`faux_fonts`: include a key for each unique element you need to style. Can just  
use `'.fauxHead'` and `'.fauxOption'` or more detailed `'.fauxEl.unique .fauxOption'` selector.

`faux_arrow` can specify a background color and width to the `fauxArrow` element.

_NOTE_: `faux_height` and the `font-size` and `line-height` of each `faux_font`  
should be the same unit/without unit (i.e. all px, em, nothing, etc).  
** Kind of assumes using `px` height without the _actual_ unit label.



***
## Set-Up Notes:

###### Disabled Options

If you add the `disabled` attribute to an option it will add class `fauxDisabled` on the corresponding fauxOption.  
Clicking that option will reset the field, clearing `selected` attributes from options and closing the select. Good option  
if you do not want `defaultOption`, but would rather have your first option as a disabled "placeholder". This is also a good  
option if you want to add more styling for that particular disabled option.

###### Data Classes

You can add `data-class` on select or individual options to add those classes to the `fauxEl` or individual `fauxOption` respectively

_Example_:

```
<select data-class="medium">
	...
</select>
```
will return
```
<div class="fauxEl medium">
	...
</div>
```
_AND_
```
<select>
	<option></option>
	<option data-class="special-option"></option>
	<option></option>
</select>
```
will return
```
<div class="fauxEl">
	...
	<div class="fauxSelect">
		<div class="fauxOption></div>
		<div class="fauxOption special-option"></div>
		<div class="fauxOption></div>
	</div>
</div>
```
