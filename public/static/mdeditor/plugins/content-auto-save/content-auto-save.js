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
        var pluginName   = "content-auto-save";

        exports.fn.ContentAutoSave = function() {
                // 初始化变量
                var _this       = this; // this == the current instance object of Editor.md
                var settings    = _this.settings;
                var editor      = _this.editor;
                var cm          = _this.cm;
                var classPrefix = _this.classPrefix;
                var id          = _this.id;

                var ContentAutoSave = {
                    options : {
                        saveInterval: null,// 存储计时器 句柄
                        saveTime: 10000, // 存储间隔时间 ms
                        storage: null,
                        saveKey: ( location.protocol + location.host + location.pathname + location.search ).replace( /[.:?=\/-]/g, '_' ) + "_" + _this.id,
                    },
                    init: function () {
                        // 存储计时器 句柄
                        this.options.saveInterval  = null;
                        // 存储间隔时间 ms
                        this.options.saveTime = 10000;
                        var that = this;
                        if( typeof(Storage)=="undefined" ){
                            console.log('浏览器不支持 LocalStorage 存储。');
                            return ;
                        } else {
                            this.options.storage = window.localStorage;
                            this.read();
                        }
                        this.options.saveInterval = (function () {
                            this.save();
                        }, this.options.saveTime);
                        $(document).keydown(function(event){
                            if (  (event.ctrlKey || event.metaKey) && event.keyCode == 83 ) {
                                that.save();
                                event.returnvalue = false;
                                event.preventDefault();
                                return false;
                            }
                        });
                    },
                    read: function () {
                        if (this.options.storage.getItem(this.options.saveKey) != null) {
                            _this.setValue(this.options.storage.getItem(this.options.saveKey));
                            console.log('缓存读取成功！');
                        } else {
                            console.log("本地无缓存数据");
                        }
                    },
                    save: function () {
                        this.options.storage.setItem( this.options.saveKey, _this.getValue());
                        var timetamp = Number(new Date()) ;
                        console.log(timetamp + '：缓存保存成功！');
                    }
                };

                ContentAutoSave.init();

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