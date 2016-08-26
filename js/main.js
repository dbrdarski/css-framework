(function($){

    var getViewport = (function(){
        // create screnSize html component  
        var memory = [],
            isMobileMemory = [],
            screenObject = $(document.createElement('span'));
        
        screenObject.attr('id', 'viewport-sizes').appendTo('body');
        
        var viewport = function(){
            return screenObject.css('content').replace(/['"]+/g, '');
        };
        viewport.previous = function(){
            return memory[memory.length ? 1 : 0];
        };
        viewport.isMobile = function(){
            current = viewport();
            // return current === 'xs' || current === 's';
             return ($(window).width() < 960);
        };

        $(window).on('resize.viewport', function(){
            var previous = memory[0],
                current = viewport(),
                mobile = viewport.isMobile();

            if( mobile !== isMobileMemory[0]){
                if(mobile){
                    $(document).trigger('viewport-change', [{'device': 'mobile', 'current': current, 'previous': previous}]);
                } else {
                    if(isMobileMemory[0] === true){
                        $(document).trigger('viewport-change', [{'device': 'desktop', 'current': current, 'previous': previous}]);
                    }
                }
                memory.unshift(current);
                isMobileMemory.unshift(mobile);
            }
        });
        $(document).ready(function(){
            $(window).trigger('resize.viewport');
        });
        return viewport;
    })();    

	var touchDevice = (function(){
		var hasTouch = 'ontouchstart' in document.documentElement ? true : false;
		$('html').addClass( hasTouch ? 'is-touch' : 'no-touch');
		return hasTouch;
	})();

    /**
     * Tabs
     */

	// var tabs = $('.tabs');
	// tabs.each(function(){
	// 	var tab = $(this),
	// 	    links = tab.find('.tab-titles .tab-title'),
	// 	    contentTabs = tab.find('.tab-contents > article');
	// 	links.each(function(){
	// 		var link = $(this),
	// 		    article = contentTabs.filter('#'+link.attr('rel')),
	// 		    accordion = $('<div class="accordion-title">').text(link.text()).on('click', function(){
	// 	    	$(this).toggleClass('accordion-active');
	// 	    });

	// 		article.prepend(accordion);

	// 		link.on('click', function(){
	// 			link.addClass('active').siblings().removeClass('active');
	// 			article.addClass('active').siblings().removeClass('active');
	// 		});
	// 	});
	// });    

	var $testimonials = $('.testimonials-section .slides');
	
	if( $testimonials.length ){		

		$testimonials.each(function(){
			var $testimonial = $(this),
			    $bullets = $testimonial.siblings('.slide-bullets').children('.wrap-inner');

			$testimonial
			.on('init', function(){
				$(this).find('.slick-dots').appendTo($bullets);
			})
			.slick({
				dots: true,
				arrows: false,
				autoplay: true,
				fade: true,
			    autoplaySpeed: 4000,
				speed: 500
			});
		});
	}

	//Set up Google Maps embed (only if dealer-locator exists)
	if ($('#map-canvas').length > 0) {
	    function initialize() {
	        var mapOptions = {
	            zoom: 9,
	            center: new google.maps.LatLng(52.029977, 5.622855),
	            disableDefaultUI: true,
	            draggable: false,
	            scrollwheel: false
	        };
	        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	        var t = setTimeout(function(){
	        	$('.google-info-box').parent().addClass('info-box-container');
	        }, 5000)
	    }
	    function loadScript() {
	        var script = document.createElement('script');
	        script.type = 'text/javascript';
	        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' + '&signed_in=false&callback=initialize';
	        document.body.appendChild(script);
	    }
	    window.onload = loadScript;
	}	

    var fileInputs = $('input[type="file"]');
    if (fileInputs.length){
        fileInputs.each(function(){
            var fileInput = $(this),
                defaultText = fileInput.data('defaultText') || '&nbsp;',
                buttonText = fileInput.data('btnText') || 'Toevoegen',
                extraEl = $('<div class="file-input-container"><div class="file-input"><span class="file-input-text">'+defaultText+'</span><span class="file-input-btn">'+buttonText+'</span></div></div>');
            fileInput.after(extraEl).addClass('ready');
        
            var fileInputText = fileInput.siblings('.file-input-container').find('.file-input-text');
            
            fileInput.on('change', function(){
                if( typeof this.files[0] === "undefined" ){
                    fileInputText.html(defaultText);
                }else{
                    fileInputText.text(this.files[0].name);
                }
            }).parents('.ajax-form').on('reset', function(){
                fileInputText.html(defaultText);
            });     
        });
    }

	var switcher = $('#mobile-nav-switcher'),
	header = $('#header'),
	buttons = $('.row-top', header),
	items = $('.primary-nav li');
	switcher.on('click', function(){
		switcher.toggleClass('active');
		buttons.toggleClass('active');
		header.toggleClass('menu-active');
		items.removeClass('m-active');
	});

	var offset = 0;
	$(document).on('scroll.fixed-header', function(){
		offset = $(window).scrollTop();
		if( offset > 500 ){
			header.attr('state', 'fixed');
		} else if (offset > 120){
			header.attr('state', 'ready');
		} else if (offset > 10){
			header.attr('state', 'm-ready');			
		} else {
			header.attr('state', 'normal');
		}
	}).trigger('scroll.fixed-header');


	var searchForm = $('#search').parent('.search'),
	    searchInput = searchForm.find('#s');
	searchForm.on('click', function(e){
		e.stopPropagation();
		searchForm.addClass('active');
		header.addClass('search-active')
	});

	$(document).on('click', function(){
		searchForm.removeClass('active');
		header.removeClass('search-active')
	});

    var  video = $('.cloud .play-button'),
         target = $('.promo-banner'),
         banner_video_container = $('<div class="video-container">');

    if(video.length){
		banner_video_container.prependTo(target);
	  	
	  	video.on('click', function (e) {
	        e.preventDefault();
	        var video = '<div class="video-inner"><div class="iframe-wrapper"><iframe width="1280" height="720" src="'+ $(this).attr('data-video') +'?rel=0&amp;controls=0&amp;autoplay=1&amp;showinfo=0&amp;autohide=1"></iframe></div></div><span class="icon btn s-alternative blue i-close">film sluiten</span></div></div>';
	        target.addClass('video-open');

	        banner_video_container.html(video);
	        // $('.flex-vid').fitVids();
	        banner_video_container.slideToggle('400');
	        $('html, body').animate({scrollTop: (banner_video_container.offset().top - 70)});
	    });
	  
	    banner_video_container.on('click', '.i-close', function () {
	        banner_video_container.hide().html('');
	        target.removeClass('video-open');
	    });
	}
	
	// var watcher = $(document); 
	// watcher.on('scroll', function(){
	// 	if(watcher.scrollTop() > 120){
	// 		header.addClass('fixed');
	// 	}else{
	// 		header.removeClass('fixed');			
	// 	}		
	// }).trigger('scroll');		

    $('.primary-nav > ul').each(function(){
      var menu = $(this),
          menuItems = menu.children('li'),
          parents = menuItems.filter('.parent-item');

      menuItems.find('a').each(function(){
        var link = $(this),
            item = link.parent(),
            isParent = item.is('.parent-item');

        link.click(function(e){
        	var viewport = getViewport();
        	if(isParent && ( viewport==='xs' || viewport==="s" ) ){ e.preventDefault(); }
            item.siblings().removeClass('m-active');
            item.toggleClass('m-active');
        });
      });
    });

    //   parents.hover(function(){
    //   	$('#sub-menu').addClass("m-active");
    //   	},
    //   function(){
    //   	$('#sub-menu').removeClass("m-active");
    //   });


   //  var filters = $('.filter-widget').first();
    
   //  if(filters.length){

   //  	var contentSection = $('.main-content').first(),
   //  	    filterSwitcher = $('<div id="filter-switcher">Filter Vacatures</div>');

		 // $(document).on('viewport-change', function(e, viewport){
	  //       if( viewport.device === "mobile" ){
	  //       	filters.before('<div id="widget-placeholder"></div>').prependTo('.main-content').before(filterSwitcher);
	  //       	filterSwitcher.on('click', function(){
   //  	    	$(this).toggleClass('active');
   //  	    });
	  //           // filters.before('<div id="widget-placeholder"></div>').appendTo(contentSection);
	  //       } else if (viewport.device === "desktop"){
	  //           var placeholder = $('#widget-placeholder');
	  //           filters.prependTo(placeholder.parent());
	  //           // $('#mobile-filters').children().prependTo(placeholder.parent());
	  //           placeholder.remove();
	  //           filterSwitcher.remove();
	  //       }
	  //   }).trigger('viewport-change', [{ device: getViewport.isMobile() }]);
   //  }

})(jQuery);