'use strict';

/**
 * @ngdoc function
 * @name madApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the madApp
 */
angular.module('madApp')
        .controller('MainCtrl', function($scope, Data) {

            $scope.size = 1024;
            $scope.seek = 0;
            $scope.noseek = false;
            $scope.loading = false;
            $scope.offsets = false;
            $scope.table = []


            //get files
            Data.get(function(data) {
                $scope.files = data
            })


            $scope.bytesToSize = function(bytes) {
                if (bytes == 0)
                    return '0 Byte';
                var k = 1000;
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                var i = Math.floor(Math.log(bytes) / Math.log(k));
                return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
            }

            $scope.loadData = function() {
                $scope.offsetCalc()  
                $scope.loading = true;
                $scope.table = []
                Data.getData({filename: $scope.activeFile.filename, size: $scope.size, seek: $scope.seek * $scope.size}, function(data) {
                    var reader = new FileReader();
                    reader.readAsArrayBuffer(data.data);
                    reader.onloadend = function() {
                        $scope.makeMatrix(reader.result)

                    }
                })

            }


            $scope.offsetCalc=function(){
                var size=$scope.activeFile.size
                var total=Math.floor(size/$scope.size);
                $scope.offsets=[]
                console.info(total)
                
                for(var i=0;i<=total;i++){
                var m=$scope.size*i;
                $scope.offsets.push({name:"0x" + m.toString(16).toUpperCase(),val:i})
               
                    
                }
                
            }

            $scope.setActive = function(file) {
                $scope.seek = 0;
                $scope.nseek={name:"Ox0",val:0}
                $scope.noseek = false;
                $scope.activeFile = file
                  

                $scope.loadData()
            }


            $scope.makeMatrix = function(data) {
                var length = data.byteLength;
                var out = [],
                        offset = [],
                        row = -1;

                out[0] = [];

                console.warn("length:", data.byteLength)
                for (var i = 0; i < length; i++)
                {
                    var x = new DataView(data, i, 1);
                    var byte = x.getUint8(0)

                    var hex = byte.toString(16)
                    hex = (hex.length === 1) ? '0' + hex : hex;

                    if (i % 16 === 0)
                    {
                        row++
                        out[row] = []
                        var ii = i + $scope.seek * $scope.size;
                        offset.push("0x" + ii.toString(16).toUpperCase())
                        
                    }

                    out[row].push({hex: hex.toUpperCase(), char: byte})



                }
                
                
                //$scope.calculate(matrix, chars)
                $scope.$apply(function() {
                    $scope.table.offset = offset
                    $scope.table.data = out
                 
                    $scope.loading = false;

                });

            }
            $scope.texttable=function(r){
                var l=r.length
                var out=""
                for(var i=0;i<l;i++){
                    out+=$scope.toASCII(r[i].char)+" ";
                    
                }
                return out;
                
            }
            
            $scope.hextable=function(r){
                var l=r.length
                var out=""
                for(var i=0;i<l;i++){
                    out+=r[i].hex+" ";
                    
                }
                return out;
                
            }

            $scope.toASCII = function(a) {
                if (a == 32)
                    return "<span>.</span>";

                var code = String.fromCharCode(a);
                if ($scope.isASCII(code, true))
                    return code;
                else
                    return "<span>.</span>";

            }
            $scope.isASCII = function(str, extended) {
                var ascii = /^[ -~]+$/;

                if (!ascii.test(str)) {
                    return false // string has non-ascii characters
                }
                return true;
            }


            $scope.hover = function(r, c) {

                $scope.rh = r
                $scope.ch = c

            }

            $scope.isHover = function(r, c) {

                if ($scope.rh === r && $scope.ch === c) {
                    return "active";

                }

            }


            $scope.seekTo = function(key) {
                $scope.noseek = false
                if (!key) {
                    $scope.seek--;
                } else {
                    var total = $scope.activeFile.size
                    var cur = ($scope.seek + 2) * $scope.size;
                    console.log(cur, total)
                    if (total <= cur)
                        $scope.noseek = true

                    $scope.seek++;

                }
                $scope.loadData()
            }

        })
        .filter('unsafe', function($sce) {
            return function(val) {
                return $sce.trustAsHtml(val);
            };
        });
