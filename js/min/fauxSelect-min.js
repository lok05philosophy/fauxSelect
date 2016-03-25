!function($){$.fn.fauxSelect=function(e){var s=$.extend({},$.fn.fauxSelect.defaultParameters,e);return this.each(function(){function e(){for(var e="transform WebkitTransform MozTransform OTransform msTransform".split(" "),s=document.createElement("div"),t=0;t<e.length;t++)if(s&&void 0!==s.style[e[t]])return e[t];return!1}var t=0,i={fOptions:[],setMarkup:function(){if(this.wrap('<div class="fauxEl"/>'),this.fEl=this.parent(),s.maxHeight&&this.fEl.addClass("maxHeight"),this.data("class"))for(var e=this.data("class").split(" "),t=0;t<e.length;t++)this.fEl.addClass(e[t]);this.before('<div class="fauxWrapper"/>'),this.fWrapper=this.fEl.find(".fauxWrapper"),this.fWrapper.append('<div class="fauxSelect"/>'),this.fSelect=this.fEl.find(".fauxSelect"),this.children("option:selected")[0]&&(this.initClick=this.children("option:selected").index()),this.createOptions(),s.defaultOption?this.setHeader(s.defaultOption):(this.fWrapper.prepend('<div class="fauxDropper"/>'),this.fDropper=this.fWrapper.find(".fauxDropper")),s.arrow&&(this.before('<div class="fauxArrow"/>'),this.fArrow=this.fEl.find(".fauxArrow"))},setHeader:function(e){var s;switch(this.fWrapper.prepend('<div class="fauxHead"/>'),this.fHead=this.fWrapper.find(".fauxHead"),e){case"data":if(!this.data("placeholder"))return void console.log("Please add data-placeholder to your select");s=this.data("placeholder"),this.fHead.text(s);break;case"label":var t=this.attr("id"),i=$('label[for="'+t+'"]');s=i.html(),this.fHead.html(s),i.hide();break;default:return}},createOptions:function(){var e=this;this.children().each(function(i){var a=$(this).text(),r=$(this).data("class")?$(this).data("class").split(" "):[];if($(this).attr("disabled")&&r.push("fauxDisabled"),s.optionCharReplace&&a.indexOf(s.optionCharReplace[0])>-1){for(var o=s.optionCharReplace[0],n=s.optionCharReplace[1],f=0;a.indexOf(s.optionCharReplace[0])>-1;){var l;f%2===0?(l="<"+n+">",a=a.replace(o,l)):(l="</"+n+">",a=a.replace(o,l)),f++}f%2!==0&&(a=a+"</"+n+">")}if(e.fSelect.append('<div class="fauxOption">'+a+"</div>"),r)for(var h=0;h<r.length;h++)e.fEl.find(".fauxOption").eq(i).addClass(r[h]);e.fOptions[i]=e.fEl.find(".fauxOption").eq(i),$(this).hide(),t++})},expand:function(){this.fEl.addClass("open");var t=0;s.defaultOption&&(t+=this.fHead.outerHeight(!0)),$.each(this.fOptions,function(){if(e)this.css("top",t);else{var s=parseInt(this.css("transition-duration"),10)||250;this.animate({top:t},s)}t+=this.outerHeight(!0)}),s.maxHeight&&(t>s.maxHeight?this.fWrapper.css("height",s.maxHeight):this.fWrapper.css("height",t)),this.trigger("faux-expand",[this,t])},choose:function(e,s,i){e.fSelect.children().removeClass("fauxHover").eq(s).addClass("chosen").css("z-index",t+1).siblings().each(function(){$(this).removeClass("chosen").css("z-index",$(this).index())}),e.children().eq(s).prop("selected","selected").siblings().removeProp("selected"),i||e.close(),e.fEl.addClass("selected"),this.trigger("faux-choose",[this,s])},close:function(){var t=this;$.each(this.fOptions,function(){if(e)this.css("top",0);else{var s=parseInt(this.css("transition-duration"),10)||250;this.animate({top:0},s)}}),this.fEl.removeClass("open"),s.focusExpander&&(this.fSelect.children().removeClass("fauxHover"),this.fInput=""),s.maxHeight&&t.fWrapper.removeAttr("style"),this.trigger("faux-close",[this])},fauxScroller:function(){var e=this.fSelect.children(".fauxHover").offset().top+this.fSelect.children(".fauxHover").innerHeight(),t=this.fWrapper.offset().top+this.fWrapper.innerHeight();if(t=s.defaultOption?t-this.fHead.innerHeight():t,e>t){var i=e-t,a=this.fWrapper.scrollTop();this.fWrapper.animate({scrollTop:a+i},100)}var r=this.fSelect.children(".fauxHover").offset().top,o=this.fWrapper.offset().top;if(o=s.defaultOption?o+this.fHead.innerHeight():o,o>r){var n=o-r,f=this.fWrapper.scrollTop();this.fWrapper.animate({scrollTop:f-n},100)}},fauxFocus:function(){var e=this;$(window).keydown(function(t){if(e.is(":focus"))switch(t.keyCode){case 40:e.fInput="",e.fEl.hasClass("open")?e.fSelect.children(".fauxHover")[0]?(e.fSelect.children(".fauxHover").next()&&e.fSelect.children(".fauxHover").next().addClass("fauxHover").siblings().removeClass("fauxHover"),s.maxHeight&&e.fauxScroller()):e.fSelect.children().eq(0).addClass("fauxHover"):e.expand();break;case 38:e.fInput="",e.fEl.hasClass("open")&&(e.fSelect.children(".fauxHover").prev()&&e.fSelect.children(".fauxHover").prev().addClass("fauxHover").siblings().removeClass("fauxHover"),s.maxHeight&&e.fauxScroller());break;case 13:if(e.fSelect.children().hasClass("fauxHover")){var i=e.fSelect.children(".fauxHover").index();e.choose(e,i)}return!1;case 9:e.close();break;case 27:e.close();break;default:e.focusTyper(t.keyCode)}})},focusTyper:function(e){this.fInput+=String.fromCharCode(e);var s=this,t=this.fInput.toLowerCase(),i=!0;$.each(this.fOptions,function(){var e=this.text().toLowerCase();e.indexOf(t)>-1&&i&&(i=!1,this.addClass("fauxHover").siblings().removeClass("fauxHover"),s.fauxScroller(),s.fEl.hasClass("open")||this.click())}),clearTimeout(s.touchedTimer),this.trigger("faux-typing",[t])},initialize:function(){this.setMarkup();var e=this,i=s.defaultOption?this.fHead:this.fDropper;i.css("z-index",t+2).click(function(){e.fEl.hasClass("open")?(e.fSelect.children().removeClass("chosen").css("z-index","auto"),e.fEl.removeClass("selected"),e.children().removeProp("selected"),e.close()):e.expand()}),this.fEl.find(".fauxArrow")[0]&&this.fArrow.click(function(){e.fEl.hasClass("open")?e.close():e.expand()}),$(window).mouseup(function(s){e.fEl.is(s.target)||0!==e.fEl.has(s.target).length||e.close()}),$(window).keydown(function(s){27===s.keyCode&&e.fEl.hasClass("open")&&e.close()}),this.fSelect.children().each(function(s){$(this).css("z-index",t-s),$(this).click(function(){var s=$(this).index();e.fEl.hasClass("open")&&""===e.fInput&&!$(this).hasClass("fauxDisabled")?e.choose(e,s):e.fEl.hasClass("open")||""!==e.fInput?e.fEl.hasClass("open")&&""!==e.fInput&&!$(this).hasClass("fauxDisabled")&&e.choose(e,s):e.expand(),""===e.fInput||$(this).hasClass("fauxDisabled")||e.choose(e,s,!0),$(this).hasClass("fauxDisabled")&&(e.fSelect.children().removeClass("chosen").css("z-index","auto"),e.fEl.removeClass("selected"),e.children().removeProp("selected"),e.close())})}),s.focusExpander&&(this.touchedTimer=null,this.fInput="",this.fauxFocus(),this.blur(function(){this.fInput=""}),$(window).keyup(function(){clearTimeout(e.touchedTimer),e.touchedTimer=setTimeout(function(){e.fInput=""},1250)}),this.fEl.click(function(){e.focus()})),$(window).load(function(){e.trigger("faux-initialized",[e,s]),e.initClick&&e.choose(e,e.initClick)})}},a=$.extend({},$(this),i);a.initialize()})},$.fn.fauxSelect.defaultParameters={defaultOption:!1,arrow:!1,optionCharReplace:!1,focusExpander:!0,maxHeight:!1}}(jQuery);