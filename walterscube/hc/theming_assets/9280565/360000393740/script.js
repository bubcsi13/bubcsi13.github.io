document.addEventListener('DOMContentLoaded', function() {
  function closest (element, selector) {
    if (Element.prototype.closest) {
      return element.closest(selector);
    }
    do {
      if (Element.prototype.matches && element.matches(selector)
        || Element.prototype.msMatchesSelector && element.msMatchesSelector(selector)
        || Element.prototype.webkitMatchesSelector && element.webkitMatchesSelector(selector)) {
        return element;
      }
      element = element.parentElement || element.parentNode;
    } while (element !== null && element.nodeType === 1);
    return null;
  }

  // social share popups
  Array.prototype.forEach.call(document.querySelectorAll('.share a'), function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      window.open(this.href, '', 'height = 500, width = 500');
    });
  });

  // In some cases we should preserve focus after page reload
  function saveFocus() {
    var activeElementId = document.activeElement.getAttribute("id");
    sessionStorage.setItem('returnFocusTo', '#' + activeElementId);
  }
  var returnFocusTo = sessionStorage.getItem('returnFocusTo');
  if (returnFocusTo) {
    sessionStorage.removeItem('returnFocusTo');
    var returnFocusToEl = document.querySelector(returnFocusTo);
    returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus();
  }

  // show form controls when the textarea receives focus or backbutton is used and value exists
  var commentContainerTextarea = document.querySelector('.comment-container textarea'),
    commentContainerFormControls = document.querySelector('.comment-form-controls, .comment-ccs');

  if (commentContainerTextarea) {
    commentContainerTextarea.addEventListener('focus', function focusCommentContainerTextarea() {
      commentContainerFormControls.style.display = 'block';
      commentContainerTextarea.removeEventListener('focus', focusCommentContainerTextarea);
    });

    if (commentContainerTextarea.value !== '') {
      commentContainerFormControls.style.display = 'block';
    }
  }

  // Expand Request comment form when Add to conversation is clicked
  var showRequestCommentContainerTrigger = document.querySelector('.request-container .comment-container .comment-show-container'),
    requestCommentFields = document.querySelectorAll('.request-container .comment-container .comment-fields'),
    requestCommentSubmit = document.querySelector('.request-container .comment-container .request-submit-comment');

  if (showRequestCommentContainerTrigger) {
    showRequestCommentContainerTrigger.addEventListener('click', function() {
      showRequestCommentContainerTrigger.style.display = 'none';
      Array.prototype.forEach.call(requestCommentFields, function(e) { e.style.display = 'block'; });
      requestCommentSubmit.style.display = 'inline-block';

      if (commentContainerTextarea) {
        commentContainerTextarea.focus();
      }
    });
  }

  // Mark as solved button
  var requestMarkAsSolvedButton = document.querySelector('.request-container .mark-as-solved:not([data-disabled])'),
    requestMarkAsSolvedCheckbox = document.querySelector('.request-container .comment-container input[type=checkbox]'),
    requestCommentSubmitButton = document.querySelector('.request-container .comment-container input[type=submit]');

  if (requestMarkAsSolvedButton) {
    requestMarkAsSolvedButton.addEventListener('click', function () {
      requestMarkAsSolvedCheckbox.setAttribute('checked', true);
      requestCommentSubmitButton.disabled = true;
      this.setAttribute('data-disabled', true);
      // Element.closest is not supported in IE11
      closest(this, 'form').submit();
    });
  }

  // Change Mark as solved text according to whether comment is filled
  var requestCommentTextarea = document.querySelector('.request-container .comment-container textarea');

  if (requestCommentTextarea) {
    requestCommentTextarea.addEventListener('input', function() {
      if (requestCommentTextarea.value === '') {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-translation');
        }
        requestCommentSubmitButton.disabled = true;
      } else {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-and-submit-translation');
        }
        requestCommentSubmitButton.disabled = false;
      }
    });
  }

  // Disable submit button if textarea is empty
  if (requestCommentTextarea && requestCommentTextarea.value === '') {
    requestCommentSubmitButton.disabled = true;
  }

  // Submit requests filter form on status or organization change in the request list page
  Array.prototype.forEach.call(document.querySelectorAll('#request-status-select, #request-organization-select'), function(el) {
    el.addEventListener('change', function(e) {
      e.stopPropagation();
      saveFocus();
      closest(this, 'form').submit();
    });
  });

  // Submit requests filter form on search in the request list page
  var quickSearch = document.querySelector('#quick-search');
  quickSearch && quickSearch.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) { // Enter key
      e.stopPropagation();
      saveFocus();
      closest(this, 'form').submit();
    }
  });

  function toggleNavigation(toggle, menu) {
    var isExpanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', !isExpanded);
    toggle.setAttribute('aria-expanded', !isExpanded);
  }

  function closeNavigation(toggle, menu) {
    menu.setAttribute('aria-expanded', false);
    toggle.setAttribute('aria-expanded', false);
    toggle.focus();
  }

  var burgerMenu = document.querySelector('.header .icon-menu');
  var userMenu = document.querySelector('#user-nav');

  if (burgerMenu && userMenu) {
    burgerMenu.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleNavigation(this, userMenu);
    });

    burgerMenu.addEventListener('keyup', function(e) {
      if (e.keyCode === 13) { // Enter key
        e.stopPropagation();
        toggleNavigation(this, userMenu);
      }
    });

    userMenu.addEventListener('keyup', function(e) {
      if (e.keyCode === 27) { // Escape key
        e.stopPropagation();
        closeNavigation(burgerMenu, this);
      }
    });

    if (userMenu.children.length === 0) {
      burgerMenu.style.display = 'none';
    }
  }

  // Toggles expanded aria to collapsible elements
  var collapsible = document.querySelectorAll('.collapsible-nav, .collapsible-sidebar');

  Array.prototype.forEach.call(collapsible, function(el) {
    var toggle = el.querySelector('.collapsible-nav-toggle, .collapsible-sidebar-toggle');

    el.addEventListener('click', function(e) {
      toggleNavigation(toggle, this);
    });

    el.addEventListener('keyup', function(e) {
      if (e.keyCode === 27) { // Escape key
        closeNavigation(toggle, this);
      }
    });
  });

  // Submit organization form in the request page
  var requestOrganisationSelect = document.querySelector('#request-organization select');

  if (requestOrganisationSelect) {
    requestOrganisationSelect.addEventListener('change', function() {
      closest(this, 'form').submit();
    });
  }

  // If a section has more than 6 subsections, we collapse the list, and show a trigger to display them all
  const seeAllTrigger = document.querySelector("#see-all-sections-trigger");
  const subsectionsList = document.querySelector(".section-list");

  if (subsectionsList && subsectionsList.children.length > 6) {
    seeAllTrigger.setAttribute("aria-hidden", false);

    seeAllTrigger.addEventListener("click", function(e) {
      subsectionsList.classList.remove("section-list--collapsed");
      seeAllTrigger.parentNode.removeChild(seeAllTrigger);
    });
  }

  window.artlogic.init();
});

window.artlogic = {

  /**
   * Runs the appropriate methods for the current page
   */

  init: function(){

    this.add_body_classes();
    this.event_listeners();
    this.init_product_page();

    this.init_homepage_webinar();
    this.init_webinars_page();
    this.init_referrer_banner();

    if (this.is_article_page()) {
      this.init_article_page();
    } else {
      this.fix_product_heading();
    }

    if (this.get_page_name() === 'new_request_page') {
      this.highlight_account_id();
    }

    this.fix_breadcrumbs();

    window.artlogic.toc();
    window.artlogic.fancybox();

    $(".article-content").fitVids();

  },

  /**
   * Adds classes to the body to use in CSS
   */

  add_body_classes: function () {

    var page_name = this.get_page_name();

    if (page_name) {
      $('body').addClass(page_name);
    }

    if (window.history && window.history.length > 1) {
      $('body').addClass('has-history');
    }

  },

  init_referrer_banner: function() {
    if ((document.referrer || '').indexOf('google') > -1) {
      $('body > header.header').before('<div class="referrer-banner"><a href="https://artlogic.net" target="_blank">👋 Find out how Artlogic can help your art business thrive online today - click here.</a><button class="close-btn"></button></div>');
    }
  },

  /**
   * Sets up event listeners for the help centre
   */

  event_listeners: function() {

    var that = this;

    // toggle functionality to show all promoted articles on homepage
    $('.show-all-promoted-articles-btn').click(function(event) {
      var promoted_articles = $('.promoted-articles');
      promoted_articles.toggleClass('show-all');

      if (promoted_articles.hasClass('show-all')) {
        $(this).text('Show less');
      } else {
        $(this).text('Show all promoted articels');
      }
    });

    // handle the form submission to prevent redirect and display thank you message
    $('#new_request').on('submit', function(event) {

      var request_form = $(this);

      // prevent submit
      event.preventDefault();

      // post the form manually to prevent redirect
      $.ajax({
        url: '/hc/en-gb/requests',
        method: 'POST',
        data: $('#new_request').serialize(),
        error: function() {
          $('.request-form').html('<h1>Error submitting form</h1><div>Your request has not been sent - please <a href="">try again</a>.</div>');
        }
      }).then(function(response, status, jqXHR) {

        var form_not_valid = response.indexOf('notification-error') > -1 && response.indexOf('_error') > -1;

        // the form was invalid, replace the form on the page with the form from the response containing error notifications
        if (form_not_valid) {

          var response_form = $(response).find('#new_request');

          // append the error notification to the field container
          request_form.find('.form-field.required').each(function(index) {
            var response_error = response_form.find('.form-field.required').eq(index).find('.notification-error');
            if (!$(this).find('.notification-error').length && response_error.length) {
              $(this).append(response_error);
            } else if ($(this).find('.notification-error').length && !response_error.length) {
              $(this).find('.notification-error').remove();
            }
          });
          request_form.find('footer').html(response_form.find('footer').html());
          that.highlight_account_id();

        // hide form and display thank you message
        } else {
          $('.request-form').remove();
          $('.request-success-page').css('display', 'block');
        }
      });
    });

    // manually implement anchor links to prevent history from changing
    $('.article-sidebar').on('click', 'a', function(event) {
      var href = $(this).attr('href');
      var heading = $(href);

      if (window.history && window.scroll) {
        event.preventDefault();
        window.scroll(0, heading.offset().top - 30);
        history.replaceState({}, document.title, href);
      }
    });

    // trigger a click on the link when clicking on webinar box
    $('body').on('click', '.webinar-box', function(event) {
      $(this).closest('.webinar').find('.action-btn')[0].click();
    });

    // remove referrer banner
    $('body').on('click', '.referrer-banner .close-btn', function(event) {
      $(this).closest('.referrer-banner').remove();
    });
  },

  path_map: {
    '/hc/en-gb': 'homepage',
    '/hc/en-gb/requests/new': 'new_request_page'
  },

  products: [
    {
      name: 'database',
      search_string: '?product=database',
      replace_string: 'Database - ',
      title: 'Database',
      className: 'product-database'
    },
    {
      name: 'mailings',
      search_string: '?product=mailings',
      replace_string: 'Mailings - ',
      title: 'Mailings',
      className: 'product-mailings'
    },
    {
      name: 'websites',
      search_string: '?product=websites',
      replace_string: 'Websites - ',
      title: 'Websites',
      className: 'product-websites'
    },
    // {
    //   name: 'privateviews',
    //   search_string: '?product=privateviews',
    //   replace_string: 'PrivateViews - ',
    //   title: 'PrivateViews',
    //   className: 'product-privateviews'
    // }
  ],

  /**
   * Returns a string identifying the type of page we're on
   */

  get_page_name: function() {

    var is_webinars_page = this.is_webinars_page();
    var filtered_products = this.products.filter(function(product) { return product.search_string === location.search});

    if (is_webinars_page) {
      return 'webinars-page';
    } else if (filtered_products.length) {
      return filtered_products[0].className;
    } else {
      return this.path_map[window.location.pathname];
    }
  },

  /**
   * Check if we're on the product page
   */

  is_product_page: function() {
    var page = this.get_page_name();
    return page && page.indexOf('product-') > -1;
  },

  /**
   * Check if we're on the webinars page
   */

  is_webinars_page: function() {
    return location.search === '?page=webinars';
  },

  /**
   * Check if we're on the article page
   */

  is_article_page: function() {
    return window.location.pathname.indexOf('/hc/en-gb/articles/') > -1;
  },

  /**
   * Returns the product data for the current product page
   */

  get_product: function() {
    var product;

    if (location.search) {
      this.products.forEach(function(p) {
        if (p.search_string === location.search) {
          product = p;
        }
      });
    }

    return product;
  },

  /**
   * Creates a new view for the additional product category level.
   * This view is displayed in the homepage template and is determined
   * by a url parameter, e.g. ?product=database
   */

  init_product_page: function() {

    var is_homepage = this.path_map[window.location.pathname] === 'homepage';
    var is_product_page =  this.is_product_page();
    var homepage_container = $('.homepage-container');
    var product_container = $('.product-container');
    var webinars_container = $('.webinars-page');

    if (is_product_page) {

      var product = this.get_product();
      var categories = product_container.find('[data-category]');
      var page_title = product.title;

      // remove the homepage content
      homepage_container.remove();

      //remove the webinars content
      webinars_container.remove();

      // set the title to the name of the current product
      product_container.find('.page-header h1').text(product.title);
      $('title').text(product.title + ' - Artlogic Support');

      categories.each(function() {

        var category_does_not_match_product = $(this).attr('data-category').indexOf(product.replace_string) === -1;

        if (category_does_not_match_product) {
          // remove the category
          $(this).remove();
        } else {
          // strip product name from the title of the category
          var title_element = $(this).find('.section-tree-title a');
          title_element.text(title_element.text().replace(product.replace_string, ''));
        }
      });

      if (product.name === 'database') {
        this.replace_contact_with_login();
      }

    } else if (is_homepage) {
      // remove the product page content
      product_container.remove();
    }

  },

  init_webinars_page: function() {
    var that = this;
    var is_webinars_page = this.is_webinars_page();
    var homepage_container = $('.homepage-container');
    var product_container = $('.product-container');
    var webinars_container = $('.webinars-page');
    var prev_webinars_container = $('.previous-webinars-section');

    if (is_webinars_page) {
      // remove the homepage content
      homepage_container.remove();
      product_container.remove();

      this.convert_webinar_markup();

      var articlesFetch = this.fetch_webinars();

      articlesFetch.then(function(articlesResponse) {
        return articlesResponse.json();
      }).then(function(data) {
        if (!(data.page === 1 && data.results.length <= 6)) {
          that.add_webinars_to_page(data.results);
          if (data.page_count > data.page) {
            prev_webinars_container.append('<div class="load-more-webinars-container"><button class="load-more-webinars primary-action-link" data-page="'+(data.page+1)+'">Load more webinars</button></div>');
          }
        }
      });

      $('body').on('click', '.load-more-webinars', function() {
        const element = $(this);
        const new_page = parseInt(element.attr('data-page'));
        that.fetch_webinars(new_page).then(function(articlesResponse) {
          return articlesResponse.json();
        }).then(function(data) {
          that.add_webinars_to_page(data.results);
          if (data.page_count > data.page) {
            element.attr('data-page', data.page+1);
          } else {
            element.remove();
          }
        });
      });

    } else {
      webinars_container.remove();
    }
  },

  fetch_webinars: function(page) {
    return fetch('https://artlogic.zendesk.com/api/v2/help_center/articles/search.json?section=360005453119&sort_by=created_at' + (page ? ('&page='+page) : ''));
  },

  add_webinars_to_page: function(webinars) {
    var list_container = $('.previous-webinars-section .webinars-list');
    webinars.filter(function(article) {
      return !list_container.find('[data-id="'+article.id+'"]').length;
    }).forEach(function(article) {
      var html = '<div class="webinar" data-section="previous" data-id="'+article.id+'" data-body="'+article.body+'">'+article.title+'</div>';
      list_container.find('.webinar').last().after(html);
    });
    this.convert_webinar_markup();
  },

  convert_webinar_markup: function() {
    var that = this;
    var webinars_container = $('.webinars-page');

    webinars_container.find('.webinar:not([data-rendered="true"])').each(function() {
      var data = that.get_webinar_data($(this));

      var date_container = data.fulldate ? '<div class="webinar-fulldate">'+data.fulldate+'</div>' : '';
      var btn_text = data.section === 'previous' ? 'Watch' : 'Register';

      var webinar_text_el = '<div class="webinar-text">'+date_container+'<div class="webinar-description">'+data.description+'</div><div><a class="action-btn" href="'+data.link+'" target="_blank">'+btn_text+'</a></div></div>';

      var date_box = data.fulldate ? '<div class="webinar-date-short"><div class="webinar-date">'+data.date+'</div><div class="webinar-month">'+data.month+'</div></div>' : '';

      var webinar_box_el = '<div class="webinar-box" data-product="'+data.product+'">'+date_box+'<div class="webinar-product">'+data.product+'</div><div class="webinar-title">'+data.title+'</div></div>';

      $(this).html(webinar_box_el + webinar_text_el);
      $(this).attr('data-rendered','true');
    });
  },

  /**
   * Replaces the text and link for 'Contact us' in the footer with a message to login to the database
   */

  replace_contact_with_login: function() {
    var text = 'Login to your Artlogic Database account';
    var btn_text = 'Login';
    var link = 'https://artlogic.net/login/';
    var contact_element = $('footer .contact-us-block');

    contact_element.find('h3').text(text);
    contact_element.find('.contact-us-subtitle').remove();
    contact_element.find('.action-btn').text(btn_text).attr('href', link);
  },

  /**
   * Take the data from the webinar body and create elements
   */

  init_homepage_webinar: function() {
    var webinar_el = $('.homepage-webinar');

    if (webinar_el.length) {
      var data = this.get_webinar_data(webinar_el);

      var webinar_text_el = '<div class="webinar-text"><div class="webinar-title">'+data.title+'</div><div class="webinar-fulldate">'+data.fulldate+'</div><div class="webinar-description">'+data.description+'</div><div><a class="action-btn" href="'+data.link+'" target="_blank">Register</a></div></div>';

      var webinar_box_el = '<div class="webinar-box" data-product="'+data.product+'"><div class="webinar-date-short"><div class="webinar-date">'+data.date+'</div><div class="webinar-month">'+data.month+'</div></div><div class="webinar-product">'+data.product+'</div><div class="webinar-title">'+data.title+'</div></div>';

      webinar_el.html(webinar_text_el + webinar_box_el);

    }
  },

  /**
   * Retrieve the data from the webinar body
   */

  get_webinar_data: function(el) {
    var data = {};

    if (el.length) {

      var body = el.attr('data-body') || '';

      var matches = body.match(/\[(.*?)\]/g) || [];
      var products = ['[Database]','[Websites]','[Database + Websites]','[PrivateViews App]','[Online Viewing Rooms]', '[Events]'];
      var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      var days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

      data.title = el.text();
      data.description = body.split('<p>').join('').split('</p>').join('');
      data.section = el.attr('data-section') || '';
      data.product = '';

      matches.forEach(function(m) {
        if (products.indexOf(m) > -1) {
          data.product = m.split('[').join('').split(']').join('');
        } else {
          var includes_month = false;
          var included_month;
          var includes_day = false;
          var includes_http = m.indexOf('http') > -1;
          var includes_www = m.indexOf('www') > -1;

          months.forEach(function(month) {
            if (m.indexOf(month) > -1) {
              includes_month = true;
              included_month = month;
            }
          });
          days.forEach(function(day) {
            if (m.indexOf(day) > -1) {
              includes_day = true;
            }
          });

          if (!includes_http && !includes_www && (includes_month || includes_day)) {
            data.fulldate = m.split('[').join('').split(']').join('');
            data.month = included_month.substring(0,3);

            var split_month = data.fulldate.split(included_month)[0].trim().split(' ');
            data.date = parseInt(split_month[split_month.length - 1]) || '?';
          } else if (includes_http || includes_www) {
            data.link = m.split('[').join('').split(']').join('');
          }
        }

        data.description = data.description.replace(m,'');
      });


      return data;
    }
  },

  /**
   * Implements functionality for the article sidebar
   */

  init_article_page: function() {

    var article = $('.article');
    var article_sidebar = $('.article-sidebar');
    var headings = article.find('h1,h2:not(.article-subheading)');

    // hide the sidebar if there aren't many sections in the article
    if (article.find('h2').length < 2) {
      if (article.find('h3').length < 3) {
        $('body').addClass('hide-article-sidebar');
      }
    }

    // activate the top section by default
    article_sidebar.find('h2').addClass('active');

    // make the sidebar reflect the current scroll position in the article
    $(document).on('scroll', function(event) {

      var scrolltop = $(this).scrollTop();
      var scrolled_near_bottom = scrolltop + $(window).height() > $(document).height() - 50;

      // check which section is in view and highlight it in the sidebar
      headings.each(function() {

        var id = $(this).attr('id');
        var top_offset = $(this).offset().top - scrolltop;
        var section_is_in_view = top_offset < 100 && top_offset >= - 100;
        var sidebar_link = article_sidebar.find('[data-toc-link="'+id+'"]');

        if (section_is_in_view && !sidebar_link.closest('li, h2').hasClass('active')) {


          var sidebar_link_position = sidebar_link.position().top;// - article_sidebar.scrollTop();
          var sidebar_link_is_hidden_below = sidebar_link_position + sidebar_link.height() > article_sidebar.height();
          var sidebar_link_is_hidden_above = sidebar_link_position < 0;

          article_sidebar.find('.active').removeClass('active');
          sidebar_link.closest('li, h2').addClass('active');

          // here we mke sure the links are scrolled into view, if the sidebar content overflows
          if (sidebar_link_is_hidden_above) {
            article_sidebar.scrollTop(article_sidebar.scrollTop() + sidebar_link_position - 30);
          } else if (sidebar_link_is_hidden_below) {
            article_sidebar.scrollTop(sidebar_link[0].offsetTop + sidebar_link.outerHeight() - article_sidebar.height() + 30);
          }
        }

      });

      // when we get to the bottom, make sure the last section is active
      if (scrolled_near_bottom) {

        var id = headings.last().attr('id');
        article_sidebar.find('.active').removeClass('active');
        article_sidebar.find('[data-toc-link="'+id+'"]').closest('li, h2').addClass('active');
      }
    });
  },

  /**
   * Modifies the breadcrumbs to reflect the additional product category level.
   */

  fix_breadcrumbs: function() {

    var that = this;
    var breadcrumbs = $('.breadcrumbs > li');

    breadcrumbs.each(function() {

      var li = $(this);
      var title = li.attr('title');
      var product_string_in_title = false;
      var matching_product;
      var home_string = 'Home';


      // change 'Artlogic Support' to 'Home'
      if (title === 'Artlogic Support') {
        $(this).attr('title', home_string).find('a').text(home_string);
      }


      that.products.forEach(function(product) {

        var is_product_breadcrumb = title.indexOf(product.replace_string) > -1;
        var is_product_page_breadcrumb = title === 'product' && product.search_string === window.location.search;

        // change the title of the hard coded breadcrumb for the product page
        if (is_product_page_breadcrumb) {
          li.attr('title', product.title).text(product.title);

        // the breadcrumb matches the product
        } else if (is_product_breadcrumb) {
          product_string_in_title = true;
          matching_product = product;
        }
      });

      // this breadcrumb contains a product, so we need to modify it
      if (product_string_in_title) {

        var parent_category = li.clone();
        var modified_title = title.replace(matching_product.replace_string, '');
        var link_element = li.find('a');

        // set new title for child
        li.attr('title', modified_title);

        // there's a link - change the text of the link
        if (link_element.length) {
          link_element.text(modified_title);

        // there's no link - just change the title and create a link in the parent
        } else {
          li.text(modified_title);
          parent_category.html('<a></a>');
        }

        // set title and link on parent
        parent_category
          .attr('title', matching_product.title)
          .find('a')
          .text(matching_product.title + ' ')
          .attr('href', '/hc/en-gb'+matching_product.search_string);

        // insert parent before the child
        parent_category.insertBefore(li);
      }
    });
  },

  /**
   * Modifies the heading on the category page to reflect the additional product category level.
   */

  fix_product_heading: function() {

    var h1 = $('.page-header h1');
    var title = h1.text();

    this.products.forEach(function(product) {
      if (title.indexOf(product.replace_string) > -1) {
        h1.text(h1.text().replace(product.replace_string, ''));
      }
    });
  },

  /**
   * Changes html in form field string to enable styling of substring
   */

  highlight_account_id: function() {

    var form_field_text = $('form .form-field p');

    form_field_text.each(function() {
      var el = $(this);
      var text = el.text();
      var strings = ['app.artlogic.net/', 'website-', '.artlogic.net}'];

      if (text.indexOf(strings[0]) > -1) {
        el.addClass('account-id-info');
        text += '}';
      }

      strings.forEach(function(string) {
        if (text.indexOf(string) > -1) {

          if (string !== '.artlogic.net}') {
            var account_string = text.split(string)[1].split(' ')[0].replace('.artlogic.net}', '');
            text = text.replace(account_string, '<span class="account-string">'+account_string+'</span>');
          }

          text = text.replace(string, '<span class="product-string">'+string.replace('}','')+'</span>');

        }
      });

      $(this).html(text);
    });
  },

  toc: function() {

    $(".article-sidebar > ul").toc({content: ".article-body", headings: "h2:not(.article-subheading),h3"});

    $(".article-sidebar a").each(function(){
      var text = $(this).text();
      var regex = new RegExp(/^\d+.$/); // a series of digits followed by a dot
      if( text.match(/^\d/) ){
          var trimmed_text = text.replace(/^\d+\.\s*/, '');
          $(this).text(trimmed_text);
      }
    });

  },

  fancybox: function(){

    $('.article-body img').each(function(){
      $(this).wrap('<a data-fancybox href="'+$(this).attr('src')+'"></a>');
    });

    // $('.article-body img').fancybox();

  },




}
