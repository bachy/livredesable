jQuery(document).ready(function($) {

  var first_load_length = 6;
  var first_content_loaded = 0;
  var wiki_api_path = "https://fr.wikipedia.org/w/api.php?callback=?";

  function init(){
    for (var i = first_load_length; i >= 0; i--) {
      searchWikiPedia(getRandomWord(3));
    };
  };

  function getRandomWord(length) {
    var consonants = 'bcdfghjklmnpqrstvwxyz',
        vowels = 'aeiou',
        rand = function(limit) {
          return Math.floor(Math.random()*limit);
        },
        i, word='', length = parseInt(length,10),
        consonants = consonants.split(''),
        vowels = vowels.split('');
    for (i=0;i<length/2;i++) {
      var randConsonant = consonants[rand(consonants.length)],
          randVowel = vowels[rand(vowels.length)];
      word += (i===0) ? randConsonant.toUpperCase() : randConsonant;
      word += i*2<length-1 ? randVowel : '';
    }
    return word;
  }

  function searchWikiPedia(string){
    $.getJSON(wiki_api_path,
      {
        srsearch: string,
        action: "query",
        list: "search",
        format: "json"
      },
      function(data) {
        console.log('wikipedia search result :: data', data);
        var i = 0;
        for(var index in data.query.search){
          i++;
        }
        var rand_title = data.query.search[Math.floor(Math.random()*i)].title;
        getWikiPageContent(rand_title);
      });
  };

/*
  https://en.wikipedia.org/w/api.php
  prop - Which pieces of information to get
   text           - Gives the parsed text of the wikitext
   langlinks      - Gives the language links in the parsed wikitext
   categories     - Gives the categories in the parsed wikitext
   categorieshtml - Gives the HTML version of the categories
   languageshtml  - DEPRECATED. Will be removed in MediaWiki 1.24.
                    Gives the HTML version of the language links
   links          - Gives the internal links in the parsed wikitext
   templates      - Gives the templates in the parsed wikitext
   images         - Gives the images in the parsed wikitext
   externallinks  - Gives the external links in the parsed wikitext
   sections       - Gives the sections in the parsed wikitext
   revid          - Adds the revision ID of the parsed page
   displaytitle   - Adds the title of the parsed wikitext
   headitems      - Gives items to put in the <head> of the page
   headhtml       - Gives parsed <head> of the page
   modules        - Gives the ResourceLoader modules used on the page
   iwlinks        - Gives interwiki links in the parsed wikitext
   wikitext       - Gives the original wikitext that was parsed
   properties     - Gives various properties defined in the parsed wikitext
   limitreportdata - Gives the limit report in a structured way.
                     Gives no data, when disablepp is set.
   limitreporthtml - Gives the HTML version of the limit report.
                     Gives no data, when disablepp is set.
    Values (separate with '|'): text, langlinks, languageshtml, categories, categorieshtml, links, templates, images, externallinks,
      sections, revid, displaytitle, headitems, headhtml, modules, iwlinks, wikitext, properties,
      limitreportdata, limitreporthtml
  Default: text|langlinks|categories|links|templates|images|externallinks|sections|revid|displaytitle|iwlinks|properties

  */

  function getWikiPageContent(title){
    $.getJSON(wiki_api_path,
      {
        action:"parse",
        format:"json",
        page:title,
        prop:'text',
        uselang:'fr',
      })
      .done(function(data) {
        // console.log('wiki page content loaded');
        onGetWikiPageContent(data);
      })
      .fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
      });
  };

  function onGetWikiPageContent(data){
    console.info('onGetWikiPage', data);
    var $row = $('<div>').addClass('row').appendTo('.container');
    var $title = $('<h1>').addClass('title').appendTo($row);
    var $content = $('<div>').addClass('text').appendTo($row);

    $title.append(data.parse.title);

    $.each(data.parse.text, function(elmt){
      $content.append(data.parse.text[elmt]);
    });

    onContentDisplayed();
  };

  function onContentDisplayed(){
    first_content_loaded ++;
    if(first_load_length == first_content_loaded){
      // var $target = $('.row').eq(Math.floor(Math.random()*first_load_length));
      var $target = $('.row').eq(Math.floor(first_load_length/2));
      $('body').scrollTo($target);
    };
  };

  init();
});