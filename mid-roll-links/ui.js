// Generated by CoffeeScript 1.6.2
var midroll,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

window.jsFileName = 'plugin.js';

window.jsProductionPath = 'fast.wistia.com/labs/mid-roll-links';

midroll = (function() {
  function midroll() {
    this.updatePreview = __bind(this.updatePreview, this);
    this.updateOutputEmbedCode = __bind(this.updateOutputEmbedCode, this);
    var _this = this;

    this.previewEmbedded = false;
    this.change = false;
    this.exampleEmbedCode = "<div id=\"wistia_r2wybv7xr0\" class=\"wistia_embed\" style=\"width:640px;height:360px;\" data-video-width=\"640\" data-video-height=\"360\">&nbsp;</div><script charset=\"ISO-8859-1\" src=\"http://fast.wistia.com/static/concat/E-v1.js\"></script> <script> wistiaEmbed = Wistia.embed(\"r2wybv7xr0\", { version: \"v1\", videoWidth: 640, videoHeight: 360, volumeControl: true, controlsVisibleOnLoad: true }); </script>";
    $(document).on("click", ".turn_off_fullscreen", function(event) {
      var source;

      event.preventDefault();
      source = Wistia.EmbedCode.parse($("#source_embed_code").val());
      source.setOption("fullscreenButton", false);
      return $("#source_embed_code").val(source.toString()).keyup();
    });
    $("#source_embed_code").on("keyup", function() {
      _this.change = true;
      return _this.debounceUpdates();
    });
    $("a[name=add_new]").on('click', function(e) {
      e.preventDefault();
      return _this.addMidrollInput();
    });
    $("a[name=remove_all]").on('click', function(e) {
      e.preventDefault();
      _this.removeAllInputs();
      _this.addMidrollInput();
      return _this.debounceUpdates();
    });
    $("a[name=see_example]").on('click', function(e) {
      e.preventDefault();
      _this.removeAllInputs();
      $("#source_embed_code").val(_this.exampleEmbedCode);
      _this.previewEmbedded = false;
      _this.debounceUpdates();
      _this.addMidrollData("YOU SHOULD CLICK HERE", "unclebenny.com", 2, 10);
      _this.addMidrollData("CHECK OUT UNCLE BENNY!", "unclebenny.com", 8, 14);
      _this.addMidrollData("BUY OUR STUFF!", "unclebenny.com", 12, 22);
      return _this.debounceUpdates();
    });
    $("#configure").on("keyup", "input[type=text], textarea", function() {
      return _this.debounceUpdates();
    });
  }

  midroll.prototype.debounceUpdates = function() {
    var updateOutputTimeout;

    clearTimeout("updateOutputTimeout");
    return updateOutputTimeout = setTimeout(this.updateOutputEmbedCode, 500);
  };

  midroll.prototype.updateOutputEmbedCode = function() {
    this.sourceEmbedCode = Wistia.EmbedCode.parse($("#source_embed_code").val());
    this.outputEmbedCode = Wistia.EmbedCode.parse($("#source_embed_code").val());
    if (this.sourceEmbedCode && this.sourceEmbedCode.isValid()) {
      this.errors = this.getErrors();
      this.playerColor = this.outputEmbedCode.options().playerColor || "636155";
      this.midrollData = this.midrollDataFromPage();
      this.outputEmbedCode.setOption('plugin.midrollLinks.src', pluginSrc(this.sourceEmbedCode));
      this.outputEmbedCode.setOption('plugin.midrollLinks.links', this.midrollData);
      if (this.errors) {
        $("#alert").html(this.errors).show();
      } else {
        $("#alert").html("").hide();
      }
      $("#output_embed_code").val(this.outputEmbedCode.toString());
      return this.updatePreview();
    } else {
      $("#output_embed_code").val("Please enter a valid Wistia embed code.");
      return $("#preview").html('<div id="placeholder_preview">Your video here</div>');
    }
  };

  midroll.prototype.updatePreview = function() {
    var _this = this;

    return Wistia.timeout('updatePreview', function() {
      if (_this.change) {
        return _this.outputEmbedCode.previewInElem("preview", {
          type: 'api'
        }, function() {
          window.previewEmbed.plugin.midrollLinks.update({
            links: _this.midrollData,
            playerColor: _this.playerColor
          });
          return _this.change = false;
        });
      } else if (!_this.previewEmbedded) {
        return _this.outputEmbedCode.previewInElem("preview", {
          type: 'api'
        }, function() {
          window.previewEmbed.plugin.midrollLinks.update({
            links: _this.midrollData
          });
          return _this.previewEmbedded = true;
        });
      } else {
        return window.previewEmbed.plugin.midrollLinks.update({
          links: _this.midrollData
        });
      }
    }, 250);
  };

  midroll.prototype.midrollDataFromPage = function() {
    var result,
      _this = this;

    result = [];
    $(".midrolls .link_and_time_range_combo").not("#link_and_time_range_combo_template").each(function(index, entry) {
      var end, linkHref, linkText, start;

      linkText = $(entry).find("input[name=link_text]").val();
      linkHref = _this.maybeAddHttp($(entry).find("input[name=link_href]").val());
      start = $(entry).find("input[name=start]").val();
      end = $(entry).find("input[name=end]").val();
      if (linkText && linkHref && parseInt(start, 10) && end) {
        return result.push({
          linkText: linkText,
          linkHref: linkHref,
          start: parseInt(start, 10),
          end: parseInt(end, 10)
        });
      }
    });
    return result;
  };

  midroll.prototype.addMidrollInput = function() {
    var $elem;

    $elem = $("#link_and_time_range_combo_template").clone();
    $elem.show().removeAttr("id");
    $(".midrolls .mid_roll_entries").append($elem);
    $elem.find(".timing input").timeatEntry();
    return $elem;
  };

  midroll.prototype.addMidrollData = function(linkText, linkHref, start, end) {
    var $elem;

    $elem = this.addMidrollInput();
    $elem.find("input[name=link_text]").val(linkText);
    $elem.find("input[name=link_href]").val(linkHref);
    $elem.find("input[name=start]").val(start).triggerHandler("update");
    return $elem.find("input[name=end]").val(end).triggerHandler("update");
  };

  midroll.prototype.removeAllInputs = function() {
    return $(".midrolls .link_and_time_range_combo").not("#link_and_time_range_combo_template").remove();
  };

  midroll.prototype.getErrors = function() {
    var fullScreenAlert, hasFullscreen, hasMidRoll;

    hasFullscreen = this.sourceEmbedCode.options().fullscreenButton === null || this.sourceEmbedCode.options().fullscreenButton;
    hasMidRoll = Wistia.obj.get(this.outputEmbedCode.options(), "plugin.midRollLinks");
    fullScreenAlert = "This embed code has fullscreen enabled with mid-rolls. " + "Just so you know, the Midroll Links won't show up when fullscreen. " + "You might want to <a href='#' class='turn_off_fullscreen'>turn off fullscreen</a>.";
    if (hasFullscreen && hasMidRoll) {
      return fullScreenAlert;
    } else {
      return "";
    }
  };

  midroll.prototype.maybeAddHttp = function(href) {
    if (href.indexOf("http") === -1) {
      return "http://" + href;
    } else {
      return href;
    }
  };

  return midroll;

})();

window.setupLabInterface = function($) {
  return $(function() {
    return window.midroll = new midroll();
  });
};

setupLabInterface(jQuery);
