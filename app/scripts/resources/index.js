angular.module('madApp')

        .factory('Data', function($resource) {
            return $resource('http://reversinglabs.bergb.com/reader.php?', {filename: "@file", seek: "@seek", size: "@size"}, {
                getData: {method: "GET", responseType: "blob", transformResponse: function(data, headersGetter) {
                        return {data: data};
                    }},
                get: {method: "GET", isArray: true},
            });
        })
