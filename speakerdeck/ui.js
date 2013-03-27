// Generated by CoffeeScript 1.6.2
var Prez;

window.jsFileName = 'plugin.js';

window.jsProductionPath = 'fast.wistia.com/labs/speakerdeck';

Prez = (function() {
  function Prez() {
    var _this = this;

    this.prezChromeHeight = 65;
    this.hasPrez = false;
    this.prezPosition = $('#presentation_position').val();
    this.$timingsTable = $('#timings');
    $("#presentation_url").on("keyup", function() {
      return Wistia.timeout('updatePresentation', (function() {
        return _this.updatePresentation();
      }), 500);
    });
    $("#presentation_position").on("change", function() {
      return Wistia.timeout('updatePresentationPosition', (function() {
        return _this.updatePresentationPosition();
      }), 500);
    });
    $("#source_embed_code").on("keyup", function() {
      return _this.updateEmbedCodeAndPreview();
    });
    $("#default_timings").on("click", function() {
      var msg;

      msg = "This will clear your existing slide timings and replace them with evenly spaced slide advances for the duration of your video.\n\nMight be good for the Chariots of Fire soundtrack and a presentation that contains lots of childhood photos of yourself.\n\nAre you sure you want to continue?";
      if (confirm(msg)) {
        _this.addDefaultTimings();
      }
      return false;
    });
    $("#clear_timings").on("click", function() {
      var msg;

      msg = "This will erase all your current slide timings. Are you sure you want this?";
      if (confirm(msg)) {
        _this.clearTimings();
      }
      return false;
    });
    $('#timings').on('keyup', 'input', function() {
      return _this.updateTimings();
    });
    $('#next_slide').on('click', function() {
      _this.nextSlide();
      return false;
    });
    $(document).on('keypress', function(e) {
      if (e.which === 110) {
        return _this.nextSlide();
      }
    });
    this.previewTop = $('#preview').position().top;
    this.fixed = false;
    this.noFixed = false;
    $(window).scroll(function() {
      return _this.afixPreview();
    });
    $('#fixed_toggle').on('click', function() {
      if (_this.noFixed) {
        $('#fixed_toggle').html('Unfollow');
        _this.noFixed = false;
        _this.fixed = false;
        _this.afixPreview();
      } else {
        $('#fixed_toggle').html('Follow');
        _this.noFixed = true;
        _this.fixed = false;
        $('#preview').css({
          position: 'relative',
          top: 0
        });
      }
      return false;
    });
    $('#load_example').on('click', function() {
      _this.setupExample();
      $('#header .load').hide();
      $('#header .clear').show();
      return false;
    });
    $('#clear_example').on('click', function() {
      _this.clearAll();
      $('#header .clear').hide();
      $('#header .load').show();
      return false;
    });
  }

  Prez.prototype.afixPreview = function() {
    if ($(window).scrollTop() > (this.previewTop - 20) && !this.fixed) {
      if (!this.noFixed) {
        $('#preview').css({
          position: 'fixed',
          top: 20
        });
      }
      $('#fixed_toggle').show();
      return this.fixed = true;
    } else if ($(window).scrollTop() < (this.previewTop - 20) && this.fixed) {
      $('#preview').css({
        position: 'relative',
        top: 0
      });
      $('#fixed_toggle').hide();
      return this.fixed = false;
    }
  };

  Prez.prototype.setupExample = function() {
    $('#source_embed_code').val('<iframe src="http://fast.wistia.net/embed/iframe/ylwyrd86it?controlsVisibleOnLoad=true&version=v1&videoHeight=360&videoWidth=640&volumeControl=true" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" width="640" height="360"></iframe>');
    $('#presentation_url').val('https://speakerdeck.com/ezrafishman/the-bschwartz-labz-preso');
    $('#presentation_position').val('right');
    this.clearTimings();
    this.addTiming(1, 0);
    this.addTiming(2, 9);
    this.addTiming(3, 16);
    this.addTiming(4, 24);
    this.addTiming(5, 33);
    return this.updatePresentation();
  };

  Prez.prototype.clearAll = function() {
    $('#next_slide').addClass('disabled');
    $('#source_embed_code').val('');
    $('#presentation_url').val('');
    $('#presentation_position').val('right');
    this.clearTimings();
    this.updateEmbedCodeAndPreview();
    return $("#output_embed_code").val('');
  };

  Prez.prototype.nextSlide = function() {
    if ($('#next_slide').hasClass('disabled')) {
      return;
    }
    if (window.previewEmbed.state() === 'beforeplay') {
      window.previewEmbed.play();
      return this.addTiming(1, 0);
    } else {
      return this.addTiming(window.previewEmbed.plugin.speakerdeck.currentSlide() + 1, parseInt(window.previewEmbed.time()));
    }
  };

  Prez.prototype.updateTimings = function() {
    var _this = this;

    return Wistia.timeout('updateTimings', function() {
      var _ref, _ref1;

      if (!((_ref = window.previewEmbed) != null ? (_ref1 = _ref.plugin) != null ? _ref1.speakerdeck : void 0 : void 0)) {
        return;
      }
      window.previewEmbed.plugin.speakerdeck.updateTimings(_this.timings());
      return _this.timeChange();
    }, 250);
  };

  Prez.prototype.timings = function() {
    var row, _i, _len, _ref, _results;

    _ref = this.$timingsTable.find('tbody tr');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      _results.push([parseInt($(row).find('input.slide').val()), parseInt($(row).find('input.time').val())]);
    }
    return _results;
  };

  Prez.prototype.addTiming = function(slide, time) {
    var row,
      _this = this;

    if (slide == null) {
      slide = 1;
    }
    if (time == null) {
      time = 0;
    }
    row = $("<tr>\n  <td><input class=\"slide\" type=\"text\" value=\"" + slide + "\" /></td>\n  <td>@</td>\n  <td><input class=\"time timeat\" type=\"text\" value=\"" + time + "\" /></td>\n  <td><a href=\"#\" class=\"delete icon icon-cancel\" tabindex=\"-1\"></a></td>\n</tr>");
    this.$timingsTable.append(row);
    row.find(".timeat").timeatEntry();
    row.find("a.delete").click(function() {
      row.remove();
      if (_this.$timingsTable.find('tbody tr').length === 0) {
        _this.$timingsTable.hide();
      }
      _this.updateTimings();
      return false;
    });
    this.sortTimings();
    this.$timingsTable.show();
    this.updateTimings();
    return this.alreadyTimed = true;
  };

  Prez.prototype.sortTimings = function() {
    var $rows, row, _i, _len, _results;

    $rows = this.$timingsTable.find('tbody tr');
    $rows.sort(function(a, b) {
      var timeA, timeB;

      timeA = parseInt($(a).find('input.timeat').val());
      timeB = parseInt($(b).find('input.timeat').val());
      return timeA - timeB;
    });
    _results = [];
    for (_i = 0, _len = $rows.length; _i < _len; _i++) {
      row = $rows[_i];
      _results.push(this.$timingsTable.append(row));
    }
    return _results;
  };

  Prez.prototype.addDefaultTimings = function() {
    var duration, slide, slides, _i, _results;

    this.clearTimings();
    slides = window.previewEmbed.plugin.speakerdeck.numberOfSlides() || 1;
    duration = window.previewEmbed.duration();
    _results = [];
    for (slide = _i = 1; 1 <= slides ? _i <= slides : _i >= slides; slide = 1 <= slides ? ++_i : --_i) {
      _results.push(this.addTiming(slide, parseInt(duration * (slide - 1) / slides)));
    }
    return _results;
  };

  Prez.prototype.clearTimings = function() {
    this.$timingsTable.find('tbody tr').remove();
    this.$timingsTable.hide();
    return this.updateTimings();
  };

  Prez.prototype.updatePresentation = function() {
    var prezUrl,
      _this = this;

    this.hasPrez = false;
    prezUrl = $('#presentation_url').val();
    if (!(prezUrl.indexOf('speakerdeck.com') > -1)) {
      return;
    }
    return this.getPresentationData(prezUrl, function(data) {
      if (data && data.width) {
        _this.prezOriginalWidth = data.width;
        _this.prezOriginalHeight = data.height;
        _this.prezId = _this._extractSpeakerDeckId(data.html);
        _this.hasPrez = true;
        return _this.updateEmbedCodeAndPreview();
      } else {
        return $("#alert").html("Invalid Speaker Deck URL.").show();
      }
    });
  };

  Prez.prototype.updatePresentationPosition = function() {
    this.prezPosition = $('#presentation_position').val();
    return this.updateEmbedCodeAndPreview();
  };

  Prez.prototype._extractSpeakerDeckId = function(embedCode) {
    var regex;

    regex = /speakerdeck\.com\/player\/([0-9a-zA-Z]+)/;
    return regex.exec(embedCode)[1];
  };

  Prez.prototype.timeChange = function(t) {
    var _ref,
      _this = this;

    return (_ref = window.previewEmbed) != null ? _ref.ready(function() {
      var row, rowTime, rows, _i;

      if (t == null) {
        t = window.previewEmbed.time();
      }
      rows = _this.$timingsTable.find('tbody tr');
      for (_i = rows.length - 1; _i >= 0; _i += -1) {
        row = rows[_i];
        rowTime = parseInt($(row).find('input.time').val());
        if (t >= rowTime) {
          _this.$timingsTable.find('tbody tr').removeClass('selected');
          $(row).addClass('selected');
          return;
        }
      }
    }) : void 0;
  };

  Prez.prototype.prezWidth = function() {
    if (this.prezPosition === 'left' || this.prezPosition === 'right') {
      return Math.round((this.sourceEmbedCode.height() - this.prezChromeHeight) * this.prezSlideAspect());
    } else {
      return this.sourceEmbedCode.width();
    }
  };

  Prez.prototype.prezHeight = function() {
    if (this.prezPosition === 'left' || this.prezPosition === 'right') {
      return this.sourceEmbedCode.height();
    } else {
      return Math.round(this.sourceEmbedCode.width() / this.prezSlideAspect() + this.prezChromeHeight);
    }
  };

  Prez.prototype.prezSlideAspect = function() {
    return this.prezOriginalWidth / (this.prezOriginalHeight - this.prezChromeHeight);
  };

  Prez.prototype.updateEmbedCodeAndPreview = function() {
    this.updateEmbedCode();
    return this.updatePreview();
  };

  Prez.prototype.updateEmbedCode = function() {
    this.sourceEmbedCode = Wistia.EmbedCode.parse($("#source_embed_code").val());
    this.outputEmbedCode = Wistia.EmbedCode.parse($("#source_embed_code").val());
    if (this.sourceEmbedCode && this.sourceEmbedCode.isValid()) {
      if (this.hasPrez) {
        if (this.prezPosition === 'left' || this.prezPosition === 'right') {
          this.outputEmbedCode.width(this.sourceEmbedCode.width() + this.prezWidth());
        } else {
          this.outputEmbedCode.height(this.sourceEmbedCode.height() + this.prezHeight());
        }
        this.outputEmbedCode.setOption("plugin.speakerdeck.src", pluginSrc(this.sourceEmbedCode));
        this.outputEmbedCode.setOption("plugin.speakerdeck.deckId", this.prezId);
        this.outputEmbedCode.setOption("plugin.speakerdeck.width", this.prezWidth());
        this.outputEmbedCode.setOption("plugin.speakerdeck.height", this.prezHeight());
        this.outputEmbedCode.setOption("plugin.speakerdeck.aspect", this.prezSlideAspect());
        this.outputEmbedCode.setOption("plugin.speakerdeck.position", this.prezPosition);
      }
      return $("#output_embed_code").val(this.outputEmbedCode.toString());
    } else {
      return $("#output_embed_code").val("Enter a valid Wistia embed code.");
    }
  };

  Prez.prototype.updatePreview = function() {
    var _this = this;

    if (this.sourceEmbedCode && this.sourceEmbedCode.isValid()) {
      return Wistia.timeout('updatePreview', function() {
        return _this.outputEmbedCode.previewInElem("preview", {
          type: 'api'
        }, function() {
          window.previewEmbed.bind("timechange", function(t) {
            return _this.timeChange(t);
          });
          if (window.previewEmbed.plugin.speakerdeck) {
            _this.updateTimings();
            return $('#next_slide').removeClass('disabled');
          }
        });
      }, 250);
    } else {
      return $("#preview").html('<div id="placeholder_preview">Your video here</div>');
    }
  };

  Prez.prototype.getPresentationData = function(url, callback) {
    var speakerDeckOembedUrl;

    speakerDeckOembedUrl = "https://speakerdeck.com/oembed.json?url=" + (encodeURIComponent(url));
    return $.getJSON("http://jsonp.ru/?callback=?", {
      url: speakerDeckOembedUrl
    }, function(raw) {
      var data;

      data = $.parseJSON(raw['body']);
      return callback(data);
    });
  };

  return Prez;

})();

window.setupLabInterface = function($) {
  return $(function() {
    return window.prez = new Prez();
  });
};

setupLabInterface(jQuery);
