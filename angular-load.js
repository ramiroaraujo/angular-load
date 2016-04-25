/* angular-load.js / v0.4.1 / (c) 2014, 2015, 2016 Uri Shaked / MIT Licence */

(function () {
    'use strict';

    angular.module('angularLoad', [])
        .service('angularLoad', ['$document', '$q', '$timeout', function ($document, $q, $timeout) {
            var document = $document[0];

            function loader(createElement) {
                var promises = {};

                return function (url, attr) {
                    if (typeof promises[url] === 'undefined') {
                        var deferred = $q.defer();
                        var element = createElement.apply(this, [url, attr]);

                        element.onload = element.onreadystatechange = function (e) {
                            if (element.readyState && element.readyState !== 'complete' && element.readyState !== 'loaded') {
                                return;
                            }

                            $timeout(function () {
                                deferred.resolve(e);
                            });
                        };
                        element.onerror = function (e) {
                            $timeout(function () {
                                deferred.reject(e);
                            });
                        };

                        promises[url] = deferred.promise;
                    }

                    return promises[url];
                };
            }

            /**
             * Dynamically loads the given script
             * @param src The url of the script to load dynamically
             * @param attrbutes A hash of attributes to inject into the script tag
             * @returns {*} Promise that will be resolved once the script has been loaded.
             */
            this.loadScript = loader(function (src, attributes) {
                var script = document.createElement('script');
                if (typeof attributes === 'object') {
                    for (var key in attributes) {
                        if (!script.hasOwnProperty(key))script[key] = attributes[key];
                    }
                }

                script.src = src;

                document.body.appendChild(script);
                return script;
            });

            /**
             * Dynamically loads the given CSS file
             * @param href The url of the CSS to load dynamically
             * @returns {*} Promise that will be resolved once the CSS file has been loaded.
             */
            this.loadCSS = loader(function (href) {
                var style = document.createElement('link');

                style.rel = 'stylesheet';
                style.type = 'text/css';
                style.href = href;

                document.head.appendChild(style);
                return style;
            });
        }]);
})();
