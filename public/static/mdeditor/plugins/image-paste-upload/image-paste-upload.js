/*!
 * Link dialog plugin for Editor.md
 *
 * @file        content-auto-save.js
 * @author      Lang Hu
 * @version     1.1.0
 * @updateTime  2019-03-11
 * @link        http://r-5.net
 * @license     MIT
 */

(function() {

    var factory = function (exports) {

        var $ = jQuery;           // if using module loader(Require.js/Sea.js).
        var pluginName   = "image-paste-upload";

        exports.fn.ImagePasteUpload = function() {
                // 初始化变量
                var _this       = this; // this == the current instance object of Editor.md
                var settings    = _this.settings;
                var editor      = _this.editor;
                var cm          = _this.cm;
                var classPrefix = _this.classPrefix;
                var id          = _this.id;

                console.log(_this);

                var ImagePasteUpload = {
                    options: {
                        url: settings.imageUploadURL + (settings.imageUploadURL.indexOf("?") >= 0 ? "&" : "?") + "guid=" + (new Date).getTime(),
                    },
                    init: function () {
                        // 初始化事件
                        this.addListener();
                    },
                    addListener: function () {
                        var that = this;
                        _this.codeMirror.on('paste', function(event) {
                            if (!(event.clipboardData && event.clipboardData.items) && !(event.originalEvent && event.originalEvent.clipboardData.items))
                                return console.log("浏览器不支持！");
                            event.preventDefault();
                            var items = event.originalEvent.clipboardData.items;
                            for (var i = items.length - 1; i >= 0; i--) {
                                var item = items[i];
                                if (item.kind === "string") {
                                    item.getAsString(function(str) {
                                        if (that.isImageUrl(str)) {
                                            that.getWebImage(str);
                                            return false;
                                        } else {
                                            cm.replaceSelection(str);
                                        }
                                    });
                                }
                                else if (item.kind === "file") {
                                    var file = item.getAsFile();
                                    var fileName = file.name;
                                    var isImage = new RegExp("(\\.(" + settings.imageFormats.join("|") + "))$");
                                    if (isImage.test(fileName)) {
                                        that.uploadFile(file);
                                        return false;
                                    }
                                }
                            }
                        });
                    },
                    isImageUrl: function(url) {
                        var pattern_url = /^((https|http)?:\/\/)[^\s]+/ ;
                        if( !pattern_url.test(url) )
                            return false;
                        var pattern_image = new RegExp("(\\.(" +_this.settings.imageFormats.join("|") + "))$") ;
                        if( !pattern_image.test(url) )
                            return false;
                        return true;
                    },
                    getWebImage: function(url) {
                        var that = this;
                        var fileName = url.substring(url.lastIndexOf("/")+1);
                        var xhr = new XMLHttpRequest();
                        if ("withCredentials" in xhr){
                          xhr.open('get', url, true);
                        } else if (typeof XDomainRequest != "undefined"){
                          xhr = new XDomainRequest();
                          xhr.open('get' , url);
                        } else {
                            cm.replaceSelection(url);
                            return false;
                        }
                        $(_this.mask).show();
                        xhr.responseType = "blob";
                        xhr.onload = function() {
                            var data = new FormData();
                            data.append('editormd-image-file', this.response, fileName);
                            $.ajax({
                                url: that.options.url,
                                type: 'POST',
                                data: data,
                                dataType: "JSON",
                                processData: false,
                                contentType: false,
                                success:function (res) {
                                    if (res.success) {
                                        content = "![]("+res.url+")";
                                        cm.replaceSelection(content);
                                    }
                                    else
                                    {
                                        alert(res.message);
                                        cm.replaceSelection(url);
                                    }
                                    $(_this.mask).hide();
                                }
                            });
                        };
                        xhr.send();
                        
                    },
                    uploadFile: function (file) {
                        // loading(true);
                        $(_this.mask).show();
                        var data = new FormData();
                        data.append('editormd-image-file', file);
                        $.ajax({
                            url: this.options.url,
                            type: 'POST',
                            data: data,
                            dataType: "JSON",
                            processData: false,
                            contentType: false,
                            success:function (res) {
                                if (res.success) {
                                    content = "![]("+res.url+")";
                                    cm.replaceSelection(content);
                                }
                                else
                                {
                                    alert(res.message);
                                }
                                $(_this.mask).hide();
                            }
                        });

                    }
                };

                ImagePasteUpload.init();

            }

    };

    // CommonJS/Node.js
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
    {
        module.exports = factory;
    }
    else if (typeof define === "function")  // AMD/CMD/Sea.js
    {
        if (define.amd) { // for Require.js

            define(["editormd"], function(editormd) {
                factory(editormd);
            });

        } else { // for Sea.js
            define(function(require) {
                var editormd = require("./../../editormd");
                factory(editormd);
            });
        }
    }
    else
    {
        factory(window.editormd);
    }

})();