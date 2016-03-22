!function($){$.fn.fauxSelect=function(e){var t=$.extend({},$.fn.fauxSelect.defaultParameters,e);return this.each(function(){function e(){for(var e="transform WebkitTransform MozTransform OTransform msTransform".split(" "),t=document.createElement("div"),i=0;i<e.length;i++)if(t&&void 0!==t.style[e[i]])return e[i];return!1}var i=0,s={fOptions:[],setMarkup:function(){if(this.wrap('<div class="fauxEl"/>'),this.fEl=this.parent(),t.maxHeight&&this.fEl.addClass("maxHeight"),this.data("class"))for(var e=this.data("class").split(" "),i=0;i<e.length;i++)this.fEl.addClass(e[i]);this.before('<div class="fauxWrapper"/>'),this.fWrapper=this.fEl.find(".fauxWrapper"),this.fWrapper.append('<div class="fauxSelect"/>'),this.fSelect=this.fEl.find(".fauxSelect"),this.children("option:selected")[0]&&(this.initClick=this.children("option:selected").index()),this.createOptions(),t.defaultOption?this.setHeader(t.defaultOption):(this.fWrapper.prepend('<div class="fauxDropper"/>'),this.fDropper=this.fWrapper.find(".fauxDropper")),t.arrow&&(this.before('<div class="fauxArrow"/>'),this.fArrow=this.fEl.find(".fauxArrow"))},setHeader:function(e){var t;switch(this.fWrapper.prepend('<div class="fauxHead"/>'),this.fHead=this.fWrapper.find(".fauxHead"),e){case"data":if(!this.data("placeholder"))return void console.log("Please add data-placeholder to your select");t=this.data("placeholder"),this.fHead.text(t);break;case"label":var i=this.attr("id"),s=$('label[for="'+i+'"]');t=s.html(),this.fHead.html(t),s.hide();break;default:return}},createOptions:function(){var e=this;this.children().each(function(s){var a=$(this).text(),r=$(this).data("class")?$(this).data("class").split(" "):null;if(t.optionCharReplace&&a.indexOf(t.optionCharReplace[0])>-1){for(var o=t.optionCharReplace[0],n=t.optionCharReplace[1],f=0;a.indexOf(t.optionCharReplace[0])>-1;){var l;f%2===0?(l="<"+n+">",a=a.replace(o,l)):(l="</"+n+">",a=a.replace(o,l)),f++}f%2!==0&&(a=a+"</"+n+">")}if(e.fSelect.append('<div class="fauxOption">'+a+"</div>"),r)for(var c=0;c<r.length;c++)e.fEl.find(".fauxOption").eq(s).addClass(r[c]);e.fOptions[s]=e.fEl.find(".fauxOption").eq(s),$(this).hide(),i++})},expand:function(){this.fEl.addClass("open");var i=0;t.defaultOption&&(i+=this.fHead.outerHeight(!0)),$.each(this.fOptions,function(){if(e)this.css("top",i);else{var t=parseInt(this.css("transition-duration"),10)||250;this.animate({top:i},t)}i+=this.outerHeight(!0)}),t.maxHeight&&this.fWrapper.css("height",t.maxHeight),this.trigger("faux-expand",[this,i])},choose:function(e,t,s){e.fSelect.children().removeClass("fauxHover").eq(t).addClass("chosen").css("z-index",i+1).siblings().each(function(){$(this).removeClass("chosen").css("z-index",$(this).index())}),e.children().eq(t).prop("selected","selected").siblings().removeProp("selected"),s||e.close(),e.fEl.addClass("selected"),this.trigger("faux-choose",[this,t])},close:function(){var i=this;$.each(this.fOptions,function(){if(e)this.css("top",0);else{var t=parseInt(this.css("transition-duration"),10)||250;this.animate({top:0},t)}}),this.fEl.removeClass("open"),t.focusExpander&&(this.fSelect.children().removeClass("fauxHover"),this.fInput=""),t.maxHeight&&i.fWrapper.removeAttr("style"),this.trigger("faux-close",[this])},fauxScroller:function(){var e=this.fSelect.children(".fauxHover").offset().top+this.fSelect.children(".fauxHover").innerHeight(),i=this.fWrapper.offset().top+this.fWrapper.innerHeight();if(i=t.defaultOption?i-this.fHead.innerHeight():i,e>i){var s=e-i,a=this.fWrapper.scrollTop();this.fWrapper.animate({scrollTop:a+s},100)}var r=this.fSelect.children(".fauxHover").offset().top,o=this.fWrapper.offset().top;if(o=t.defaultOption?o+this.fHead.innerHeight():o,o>r){var n=o-r,f=this.fWrapper.scrollTop();this.fWrapper.animate({scrollTop:f-n},100)}},fauxFocus:function(){var e=this;$(window).keydown(function(i){if(e.is(":focus"))switch(i.keyCode){case 40:e.fInput="",e.fEl.hasClass("open")?e.fSelect.children(".fauxHover")[0]?(e.fSelect.children(".fauxHover").next()&&e.fSelect.children(".fauxHover").next().addClass("fauxHover").siblings().removeClass("fauxHover"),t.maxHeight&&e.fauxScroller()):e.fSelect.children().eq(0).addClass("fauxHover"):e.expand();break;case 38:e.fInput="",e.fEl.hasClass("open")&&(e.fSelect.children(".fauxHover").prev()&&e.fSelect.children(".fauxHover").prev().addClass("fauxHover").siblings().removeClass("fauxHover"),t.maxHeight&&e.fauxScroller());break;case 13:if(e.fSelect.children().hasClass("fauxHover")){var s=e.fSelect.children(".fauxHover").index();e.choose(e,s)}return!1;case 9:e.close();break;case 27:e.close();break;default:e.focusTyper(i.keyCode)}})},focusTyper:function(e){this.fInput+=String.fromCharCode(e);var t=this,i=this.fInput.toLowerCase(),s=!0;$.each(this.fOptions,function(){var e=this.text().toLowerCase();e.indexOf(i)>-1&&s&&(s=!1,this.addClass("fauxHover").siblings().removeClass("fauxHover"),t.fauxScroller(),t.fEl.hasClass("open")||this.click())}),clearTimeout(t.touchedTimer),this.trigger("faux-typing",[i])},initialize:function(){this.setMarkup();var e=this,s=t.defaultOption?this.fHead:this.fDropper;s.css("z-index",i+2).click(function(){e.fEl.hasClass("open")?(e.fSelect.children().removeClass("chosen").css("z-index","auto"),e.fEl.removeClass("selected"),e.children().removeProp("selected"),e.close()):e.expand()}),this.fEl.find(".fauxArrow")[0]&&this.fArrow.click(function(){e.fEl.hasClass("open")?e.close():e.expand()}),$(window).mouseup(function(t){e.fEl.is(t.target)||0!==e.fEl.has(t.target).length||e.close()}),$(window).keydown(function(t){27===t.keyCode&&e.fEl.hasClass("open")&&e.close()}),this.fSelect.children().each(function(t){$(this).css("z-index",i-t),$(this).click(function(){var t=$(this).index();e.fEl.hasClass("open")&&""===e.fInput?e.choose(e,t):e.fEl.hasClass("open")||""!==e.fInput?e.fEl.hasClass("open")&&""!==e.fInput&&e.choose(e,t):e.expand(),""!==e.fInput&&e.choose(e,t,!0)})}),t.focusExpander&&(this.touchedTimer=null,this.fInput="",this.fauxFocus(),this.blur(function(){this.fInput=""}),$(window).keyup(function(){clearTimeout(e.touchedTimer),e.touchedTimer=setTimeout(function(){e.fInput=""},1250)}),this.fEl.click(function(){e.focus()})),$(window).load(function(){e.trigger("faux-initialized",[e,t]),e.initClick&&e.choose(e,e.initClick)})}},a=$.extend({},$(this),s);a.initialize()})},$.fn.fauxSelect.defaultParameters={defaultOption:!1,arrow:!1,optionCharReplace:!1,focusExpander:!0,maxHeight:!1}}(jQuery);