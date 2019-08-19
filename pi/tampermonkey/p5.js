/*! p5.js v0.7.3 January 20, 2019 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.p5 = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
module.exports={
    "project": {
        "name": "p5",
        "description": "[![Build Status](https://travis-ci.org/processing/p5.js.svg?branch=master)](https://travis-ci.org/processing/p5.js) [![npm version](https://badge.fury.io/js/p5.svg)](https://www.npmjs.com/package/p5)",
        "version": "0.7.3",
        "url": "https://github.com/processing/p5.js#readme"
    },
    "files": {
        "src/color/color_conversion.js": {
            "name": "src/color/color_conversion.js",
            "modules": {
                "Color Conversion": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/color/creating_reading.js": {
            "name": "src/color/creating_reading.js",
            "modules": {
                "Creating & Reading": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/color/p5.Color.js": {
            "name": "src/color/p5.Color.js",
            "modules": {},
            "classes": {
                "p5.Color": 1
            },
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/color/setting.js": {
            "name": "src/color/setting.js",
            "modules": {
                "Setting": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/core/shape/2d_primitives.js": {
            "name": "src/core/shape/2d_primitives.js",
            "modules": {
                "2D Primitives": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/core/shape/attributes.js": {
            "name": "src/core/shape/attributes.js",
            "modules": {
                "Attributes": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/core/shape/curves.js": {
            "name": "src/core/shape/curves.js",
            "modules": {
                "Curves": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/core/shape/vertex.js": {
            "name": "src/core/shape/vertex.js",
            "modules": {
                "Vertex": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/core/constants.js": {
            "name": "src/core/constants.js",
            "modules": {
                "Constants": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/core/environment.js": {
            "name": "src/core/environment.js",
            "modules": {
                "Environment": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/core/error_helpers.js": {
            "name": "src/core/error_helpers.js",
            "modules": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/core/helpers.js": {
            "name": "src/core/helpers.js",
            "modules": {},
            "classes": {},
            "fors": {},
            "namespaces": {}
        },
        "src/core/init.js": {
            "name": "src/core/init.js",
            "modules": {},
            "classes": {},
            "fors": {},
            "namespaces": {}
        },
        "src/core/legacy.js": {
            "name": "src/core/legacy.js",
            "modules": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/core/main.js": {
            "name": "src/core/main.js",
            "modules": {
                "Structure": 1
            },
            "classes": {
                "p5": 1
            },
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/core/p5.Element.js": {
            "name": "src/core/p5.Element.js",
            "modules": {
                "DOM": 1
            },
            "classes": {
                "p5.Element": 1
            },
            "fors": {
                "p5.Element": 1
            },
            "namespaces": {}
        },
        "src/core/p5.Graphics.js": {
            "name": "src/core/p5.Graphics.js",
            "modules": {
                "Rendering": 1
            },
            "classes": {
                "p5.Graphics": 1
            },
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/core/p5.Renderer.js": {
            "name": "src/core/p5.Renderer.js",
            "modules": {},
            "classes": {
                "p5.Renderer": 1
            },
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/core/p5.Renderer2D.js": {
            "name": "src/core/p5.Renderer2D.js",
            "modules": {},
            "classes": {},
            "fors": {},
            "namespaces": {}
        },
        "src/core/rendering.js": {
            "name": "src/core/rendering.js",
            "modules": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/core/shim.js": {
            "name": "src/core/shim.js",
            "modules": {},
            "classes": {},
            "fors": {},
            "namespaces": {}
        },
        "src/core/structure.js": {
            "name": "src/core/structure.js",
            "modules": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/core/transform.js": {
            "name": "src/core/transform.js",
            "modules": {
                "Transform": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/data/p5.TypedDict.js": {
            "name": "src/data/p5.TypedDict.js",
            "modules": {
                "Dictionary": 1
            },
            "classes": {
                "p5.TypedDict": 1,
                "p5.StringDict": 1,
                "p5.NumberDict": 1
            },
            "fors": {
                "p5.TypedDict": 1,
                "p5": 1
            },
            "namespaces": {}
        },
        "src/events/acceleration.js": {
            "name": "src/events/acceleration.js",
            "modules": {
                "Acceleration": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/events/keyboard.js": {
            "name": "src/events/keyboard.js",
            "modules": {
                "Keyboard": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/events/mouse.js": {
            "name": "src/events/mouse.js",
            "modules": {
                "Mouse": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/events/touch.js": {
            "name": "src/events/touch.js",
            "modules": {
                "Touch": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/image/filters.js": {
            "name": "src/image/filters.js",
            "modules": {},
            "classes": {},
            "fors": {},
            "namespaces": {}
        },
        "src/image/image.js": {
            "name": "src/image/image.js",
            "modules": {
                "Image": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/image/loading_displaying.js": {
            "name": "src/image/loading_displaying.js",
            "modules": {
                "Loading & Displaying": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/image/p5.Image.js": {
            "name": "src/image/p5.Image.js",
            "modules": {},
            "classes": {
                "p5.Image": 1
            },
            "fors": {},
            "namespaces": {}
        },
        "src/image/pixels.js": {
            "name": "src/image/pixels.js",
            "modules": {
                "Pixels": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/io/files.js": {
            "name": "src/io/files.js",
            "modules": {
                "Input": 1,
                "Output": 1
            },
            "classes": {
                "p5.PrintWriter": 1
            },
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/io/p5.Table.js": {
            "name": "src/io/p5.Table.js",
            "modules": {
                "Table": 1
            },
            "classes": {
                "p5.Table": 1
            },
            "fors": {},
            "namespaces": {}
        },
        "src/io/p5.TableRow.js": {
            "name": "src/io/p5.TableRow.js",
            "modules": {},
            "classes": {
                "p5.TableRow": 1
            },
            "fors": {},
            "namespaces": {}
        },
        "src/io/p5.XML.js": {
            "name": "src/io/p5.XML.js",
            "modules": {
                "XML": 1
            },
            "classes": {
                "p5.XML": 1
            },
            "fors": {},
            "namespaces": {}
        },
        "src/math/calculation.js": {
            "name": "src/math/calculation.js",
            "modules": {
                "Calculation": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/math/math.js": {
            "name": "src/math/math.js",
            "modules": {
                "Math": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/math/noise.js": {
            "name": "src/math/noise.js",
            "modules": {
                "Noise": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/math/p5.Vector.js": {
            "name": "src/math/p5.Vector.js",
            "modules": {},
            "classes": {
                "p5.Vector": 1
            },
            "fors": {},
            "namespaces": {}
        },
        "src/math/random.js": {
            "name": "src/math/random.js",
            "modules": {
                "Random": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/math/trigonometry.js": {
            "name": "src/math/trigonometry.js",
            "modules": {
                "Trigonometry": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/typography/attributes.js": {
            "name": "src/typography/attributes.js",
            "modules": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/typography/loading_displaying.js": {
            "name": "src/typography/loading_displaying.js",
            "modules": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/typography/p5.Font.js": {
            "name": "src/typography/p5.Font.js",
            "modules": {
                "Font": 1
            },
            "classes": {
                "p5.Font": 1
            },
            "fors": {},
            "namespaces": {}
        },
        "src/utilities/array_functions.js": {
            "name": "src/utilities/array_functions.js",
            "modules": {
                "Array Functions": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/utilities/conversion.js": {
            "name": "src/utilities/conversion.js",
            "modules": {
                "Conversion": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/utilities/string_functions.js": {
            "name": "src/utilities/string_functions.js",
            "modules": {
                "String Functions": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/utilities/time_date.js": {
            "name": "src/utilities/time_date.js",
            "modules": {
                "Time & Date": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/webgl/3d_primitives.js": {
            "name": "src/webgl/3d_primitives.js",
            "modules": {
                "3D Primitives": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/webgl/interaction.js": {
            "name": "src/webgl/interaction.js",
            "modules": {
                "Interaction": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/webgl/light.js": {
            "name": "src/webgl/light.js",
            "modules": {
                "Lights": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/webgl/loading.js": {
            "name": "src/webgl/loading.js",
            "modules": {
                "3D Models": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/webgl/material.js": {
            "name": "src/webgl/material.js",
            "modules": {
                "Material": 1
            },
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/webgl/p5.Camera.js": {
            "name": "src/webgl/p5.Camera.js",
            "modules": {
                "Camera": 1
            },
            "classes": {
                "p5.Camera": 1
            },
            "fors": {
                "p5": 1,
                "p5.Camera": 1
            },
            "namespaces": {}
        },
        "src/webgl/p5.Geometry.js": {
            "name": "src/webgl/p5.Geometry.js",
            "modules": {},
            "classes": {
                "p5.Geometry": 1
            },
            "fors": {},
            "namespaces": {}
        },
        "src/webgl/p5.Matrix.js": {
            "name": "src/webgl/p5.Matrix.js",
            "modules": {},
            "classes": {
                "p5.Matrix": 1
            },
            "fors": {},
            "namespaces": {}
        },
        "src/webgl/p5.RendererGL.Immediate.js": {
            "name": "src/webgl/p5.RendererGL.Immediate.js",
            "modules": {},
            "classes": {},
            "fors": {},
            "namespaces": {}
        },
        "src/webgl/p5.RendererGL.Retained.js": {
            "name": "src/webgl/p5.RendererGL.Retained.js",
            "modules": {},
            "classes": {},
            "fors": {},
            "namespaces": {}
        },
        "src/webgl/p5.RendererGL.js": {
            "name": "src/webgl/p5.RendererGL.js",
            "modules": {},
            "classes": {
                "p5.RendererGL": 1
            },
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/webgl/p5.Shader.js": {
            "name": "src/webgl/p5.Shader.js",
            "modules": {
                "Shaders": 1
            },
            "classes": {
                "p5.Shader": 1
            },
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/webgl/p5.Texture.js": {
            "name": "src/webgl/p5.Texture.js",
            "modules": {},
            "classes": {
                "p5.Texture": 1
            },
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "src/webgl/text.js": {
            "name": "src/webgl/text.js",
            "modules": {},
            "classes": {
                "ImageInfos": 1,
                "FontInfo": 1,
                "Cubic": 1
            },
            "fors": {},
            "namespaces": {}
        },
        "lib/addons/p5.dom.js": {
            "name": "lib/addons/p5.dom.js",
            "modules": {
                "p5.dom": 1
            },
            "classes": {
                "p5.MediaElement": 1,
                "p5.File": 1
            },
            "fors": {
                "p5": 1,
                "p5.Element": 1
            },
            "namespaces": {}
        },
        "lib/addons/p5.sound.js": {
            "name": "lib/addons/p5.sound.js",
            "modules": {
                "p5.sound": 1
            },
            "classes": {
                "p5.SoundFile": 1,
                "p5.Amplitude": 1,
                "p5.FFT": 1,
                "p5.Signal": 1,
                "p5.Oscillator": 1,
                "p5.SinOsc": 1,
                "p5.TriOsc": 1,
                "p5.SawOsc": 1,
                "p5.SqrOsc": 1,
                "p5.Envelope": 1,
                "p5.Pulse": 1,
                "p5.Noise": 1,
                "p5.AudioIn": 1,
                "p5.Effect": 1,
                "p5.Filter": 1,
                "p5.LowPass": 1,
                "p5.HighPass": 1,
                "p5.BandPass": 1,
                "p5.EQ": 1,
                "p5.Panner3D": 1,
                "p5.Delay": 1,
                "p5.Reverb": 1,
                "p5.Convolver": 1,
                "p5.Phrase": 1,
                "p5.Part": 1,
                "p5.Score": 1,
                "p5.SoundLoop": 1,
                "p5.Compressor": 1,
                "p5.SoundRecorder": 1,
                "p5.PeakDetect": 1,
                "p5.Gain": 1,
                "p5.AudioVoice": 1,
                "p5.MonoSynth": 1,
                "p5.PolySynth": 1,
                "p5.Distortion": 1
            },
            "fors": {
                "p5.sound": 1,
                "p5": 1
            },
            "namespaces": {}
        },
        "lib/addons/p5.sound.min.js": {
            "name": "lib/addons/p5.sound.min.js",
            "modules": {},
            "classes": {},
            "fors": {},
            "namespaces": {}
        }
    },
    "modules": {
        "Color": {
            "name": "Color",
            "submodules": {
                "Color Conversion": 1,
                "Creating & Reading": 1,
                "Setting": 1
            },
            "elements": {},
            "classes": {
                "p5.Color": 1
            },
            "fors": {
                "p5": 1
            },
            "namespaces": {},
            "file": "src/color/p5.Color.js",
            "line": 16
        },
        "Color Conversion": {
            "name": "Color Conversion",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Color",
            "namespace": "",
            "file": "src/color/color_conversion.js",
            "line": 1,
            "requires": [
                "core"
            ]
        },
        "Creating & Reading": {
            "name": "Creating & Reading",
            "submodules": {},
            "elements": {},
            "classes": {
                "p5.Color": 1
            },
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Color",
            "namespace": "",
            "file": "src/color/p5.Color.js",
            "line": 16,
            "requires": [
                "core",
                "constants"
            ],
            "description": "<p>Each color stores the color mode and level maxes that applied at the\ntime of its construction. These are used to interpret the input arguments\n(at construction and later for that instance of color) and to format the\noutput e.g. when <a href=\"#/p5/saturation\">saturation()</a> is requested.</p>\n<p>Internally we store an array representing the ideal RGBA values in floating\npoint form, normalized from 0 to 1. From this we calculate the closest\nscreen color (RGBA levels from 0 to 255) and expose this to the renderer.</p>\n<p>We also cache normalized, floating point components of the color in various\nrepresentations as they are calculated. This is done to prevent repeating a\nconversion that has already been performed.</p>\n"
        },
        "Setting": {
            "name": "Setting",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Color",
            "namespace": "",
            "file": "src/color/setting.js",
            "line": 1,
            "requires": [
                "core",
                "constants"
            ]
        },
        "Shape": {
            "name": "Shape",
            "submodules": {
                "2D Primitives": 1,
                "Curves": 1,
                "Vertex": 1,
                "3D Primitives": 1,
                "3D Models": 1
            },
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "2D Primitives": {
            "name": "2D Primitives",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Shape",
            "namespace": "",
            "file": "src/core/shape/2d_primitives.js",
            "line": 1,
            "requires": [
                "core",
                "constants"
            ]
        },
        "Attributes": {
            "name": "Attributes",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Typography",
            "namespace": "",
            "file": "src/core/shape/attributes.js",
            "line": 1,
            "requires": [
                "core",
                "constants"
            ]
        },
        "Curves": {
            "name": "Curves",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Shape",
            "namespace": "",
            "file": "src/core/shape/curves.js",
            "line": 1,
            "requires": [
                "core"
            ]
        },
        "Vertex": {
            "name": "Vertex",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Shape",
            "namespace": "",
            "file": "src/core/shape/vertex.js",
            "line": 1,
            "requires": [
                "core",
                "constants"
            ]
        },
        "Constants": {
            "name": "Constants",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {},
            "module": "Constants",
            "file": "src/core/constants.js",
            "line": 1
        },
        "Environment": {
            "name": "Environment",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {},
            "module": "Environment",
            "file": "src/core/environment.js",
            "line": 1,
            "requires": [
                "core",
                "constants"
            ]
        },
        "Structure": {
            "name": "Structure",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {},
            "module": "IO",
            "file": "src/core/main.js",
            "line": 1,
            "requires": [
                "constants"
            ]
        },
        "DOM": {
            "name": "DOM",
            "submodules": {},
            "elements": {},
            "classes": {
                "p5.Element": 1
            },
            "fors": {
                "p5.Element": 1
            },
            "namespaces": {},
            "module": "DOM",
            "file": "src/core/p5.Element.js",
            "line": 11,
            "description": "<p>Base class for all elements added to a sketch, including canvas,\ngraphics buffers, and other HTML elements. Methods in blue are\nincluded in the core functionality, methods in brown are added\nwith the <a href=\"http://p5js.org/reference/#/libraries/p5.dom\">p5.dom\nlibrary</a>.\nIt is not called directly, but <a href=\"#/p5.Element\">p5.Element</a>\nobjects are created by calling <a href=\"#/p5/createCanvas\">createCanvas</a>, <a href=\"#/p5/createGraphics\">createGraphics</a>,\nor in the p5.dom library, <a href=\"#/p5/createDiv\">createDiv</a>, <a href=\"#/p5/createImg\">createImg</a>, <a href=\"#/p5/createInput\">createInput</a>, etc.</p>\n"
        },
        "Rendering": {
            "name": "Rendering",
            "submodules": {
                "undefined": 1
            },
            "elements": {},
            "classes": {
                "p5.RendererGL": 1,
                "p5.Graphics": 1,
                "p5.Renderer": 1
            },
            "fors": {
                "p5": 1
            },
            "namespaces": {},
            "module": "Rendering",
            "file": "src/webgl/p5.RendererGL.js",
            "line": 428,
            "description": "<p>Thin wrapper around a renderer, to be used for creating a\ngraphics buffer object. Use this class if you need\nto draw into an off-screen graphics buffer. The two parameters define the\nwidth and height in pixels. The fields and methods for this class are\nextensive, but mirror the normal drawing API for p5.</p>\n"
        },
        "Transform": {
            "name": "Transform",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {},
            "module": "Transform",
            "file": "src/core/transform.js",
            "line": 1,
            "requires": [
                "core",
                "constants"
            ]
        },
        "Data": {
            "name": "Data",
            "submodules": {
                "Dictionary": 1,
                "Array Functions": 1,
                "Conversion": 1,
                "String Functions": 1
            },
            "elements": {},
            "classes": {
                "p5.TypedDict": 1,
                "p5.StringDict": 1,
                "p5.NumberDict": 1
            },
            "fors": {
                "p5.TypedDict": 1,
                "p5": 1
            },
            "namespaces": {},
            "file": "src/data/p5.TypedDict.js",
            "line": 422
        },
        "Dictionary": {
            "name": "Dictionary",
            "submodules": {},
            "elements": {},
            "classes": {
                "p5.TypedDict": 1,
                "p5.StringDict": 1,
                "p5.NumberDict": 1
            },
            "fors": {
                "p5.TypedDict": 1,
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Data",
            "namespace": "",
            "file": "src/data/p5.TypedDict.js",
            "line": 422,
            "requires": [
                "core\n\nThis module defines the p5 methods for the p5 Dictionary classes.\nThe classes StringDict and NumberDict are for storing and working\nwith key-value pairs."
            ],
            "description": "<p>Base class for all p5.Dictionary types. Specifically\n typed Dictionary classes inherit from this class.</p>\n"
        },
        "Events": {
            "name": "Events",
            "submodules": {
                "Acceleration": 1,
                "Keyboard": 1,
                "Mouse": 1,
                "Touch": 1
            },
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "namespaces": {}
        },
        "Acceleration": {
            "name": "Acceleration",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Events",
            "namespace": "",
            "file": "src/events/acceleration.js",
            "line": 1,
            "requires": [
                "core"
            ]
        },
        "Keyboard": {
            "name": "Keyboard",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Events",
            "namespace": "",
            "file": "src/events/keyboard.js",
            "line": 1,
            "requires": [
                "core"
            ]
        },
        "Mouse": {
            "name": "Mouse",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Events",
            "namespace": "",
            "file": "src/events/mouse.js",
            "line": 1,
            "requires": [
                "core",
                "constants"
            ]
        },
        "Touch": {
            "name": "Touch",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Events",
            "namespace": "",
            "file": "src/events/touch.js",
            "line": 1,
            "requires": [
                "core"
            ]
        },
        "Image": {
            "name": "Image",
            "submodules": {
                "Pixels": 1
            },
            "elements": {},
            "classes": {
                "p5.Image": 1
            },
            "fors": {
                "p5": 1
            },
            "namespaces": {},
            "module": "Image",
            "file": "src/image/p5.Image.js",
            "line": 23,
            "requires": [
                "core"
            ],
            "description": "<p>Creates a new <a href=\"#/p5.Image\">p5.Image</a>. A <a href=\"#/p5.Image\">p5.Image</a> is a canvas backed representation of an\nimage.\n<br><br>\np5 can display .gif, .jpg and .png images. Images may be displayed\nin 2D and 3D space. Before an image is used, it must be loaded with the\n<a href=\"#/p5/loadImage\">loadImage()</a> function. The <a href=\"#/p5.Image\">p5.Image</a> class contains fields for the width and\nheight of the image, as well as an array called <a href=\"#/p5.Image/pixels\">pixels[]</a> that contains the\nvalues for every pixel in the image.\n<br><br>\nThe methods described below allow easy access to the image&#39;s pixels and\nalpha channel and simplify the process of compositing.\n<br><br>\nBefore using the <a href=\"#/p5.Image/pixels\">pixels[]</a> array, be sure to use the <a href=\"#/p5.Image/loadPixels\">loadPixels()</a> method on\nthe image to make sure that the pixel data is properly loaded.</p>\n"
        },
        "Loading & Displaying": {
            "name": "Loading & Displaying",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Typography",
            "namespace": "",
            "file": "src/image/loading_displaying.js",
            "line": 1,
            "requires": [
                "core"
            ]
        },
        "Pixels": {
            "name": "Pixels",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Image",
            "namespace": "",
            "file": "src/image/pixels.js",
            "line": 1,
            "requires": [
                "core"
            ]
        },
        "IO": {
            "name": "IO",
            "submodules": {
                "Structure": 1,
                "Input": 1,
                "Output": 1,
                "Table": 1,
                "XML": 1,
                "Time & Date": 1
            },
            "elements": {},
            "classes": {
                "p5": 1,
                "p5.PrintWriter": 1,
                "p5.Table": 1,
                "p5.TableRow": 1,
                "p5.XML": 1
            },
            "fors": {
                "p5": 1
            },
            "namespaces": {},
            "file": "src/io/p5.XML.js",
            "line": 11
        },
        "Input": {
            "name": "Input",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "IO",
            "namespace": "",
            "file": "src/io/files.js",
            "line": 1,
            "requires": [
                "core"
            ]
        },
        "Output": {
            "name": "Output",
            "submodules": {},
            "elements": {},
            "classes": {
                "p5": 1,
                "p5.PrintWriter": 1
            },
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "IO",
            "namespace": "",
            "file": "src/io/files.js",
            "line": 1228,
            "description": "<p>This is the p5 instance constructor.</p>\n<p>A p5 instance holds all the properties and methods related to\na p5 sketch.  It expects an incoming sketch closure and it can also\ntake an optional node parameter for attaching the generated p5 canvas\nto a node.  The sketch closure takes the newly created p5 instance as\nits sole argument and may optionally set <a href=\"#/p5/preload\">preload()</a>, <a href=\"#/p5/setup\">setup()</a>, and/or\n<a href=\"#/p5/draw\">draw()</a> properties on it for running a sketch.</p>\n<p>A p5 sketch can run in &quot;global&quot; or &quot;instance&quot; mode:\n&quot;global&quot;   - all properties and methods are attached to the window\n&quot;instance&quot; - all properties and methods are bound to this p5 object</p>\n"
        },
        "Table": {
            "name": "Table",
            "submodules": {},
            "elements": {},
            "classes": {
                "p5.Table": 1,
                "p5.TableRow": 1
            },
            "fors": {},
            "is_submodule": 1,
            "namespaces": {},
            "module": "IO",
            "namespace": "",
            "file": "src/io/p5.TableRow.js",
            "line": 11,
            "requires": [
                "core"
            ],
            "description": "<p><a href=\"#/p5.Table\">Table</a> objects store data with multiple rows and columns, much\nlike in a traditional spreadsheet. Tables can be generated from\nscratch, dynamically, or using data from an existing file.</p>\n"
        },
        "XML": {
            "name": "XML",
            "submodules": {},
            "elements": {},
            "classes": {
                "p5.XML": 1
            },
            "fors": {},
            "is_submodule": 1,
            "namespaces": {},
            "module": "IO",
            "namespace": "",
            "file": "src/io/p5.XML.js",
            "line": 11,
            "requires": [
                "core"
            ],
            "description": "<p>XML is a representation of an XML object, able to parse XML code. Use\n<a href=\"#/p5/loadXML\">loadXML()</a> to load external XML files and create XML objects.</p>\n"
        },
        "Math": {
            "name": "Math",
            "submodules": {
                "Calculation": 1,
                "Noise": 1,
                "Random": 1,
                "Trigonometry": 1
            },
            "elements": {},
            "classes": {
                "p5.Vector": 1
            },
            "fors": {
                "p5": 1
            },
            "namespaces": {},
            "module": "Math",
            "file": "src/math/p5.Vector.js",
            "line": 12,
            "requires": [
                "core"
            ],
            "description": "<p>A class to describe a two or three dimensional vector, specifically\na Euclidean (also known as geometric) vector. A vector is an entity\nthat has both magnitude and direction. The datatype, however, stores\nthe components of the vector (x, y for 2D, and x, y, z for 3D). The magnitude\nand direction can be accessed via the methods <a href=\"#/p5/mag\">mag()</a> and <a href=\"#/p5/heading\">heading()</a>.\n<br><br>\nIn many of the p5.js examples, you will see <a href=\"#/p5.Vector\">p5.Vector</a> used to describe a\nposition, velocity, or acceleration. For example, if you consider a rectangle\nmoving across the screen, at any given instant it has a position (a vector\nthat points from the origin to its location), a velocity (the rate at which\nthe object&#39;s position changes per time unit, expressed as a vector), and\nacceleration (the rate at which the object&#39;s velocity changes per time\nunit, expressed as a vector).\n<br><br>\nSince vectors represent groupings of values, we cannot simply use\ntraditional addition/multiplication/etc. Instead, we&#39;ll need to do some\n&quot;vector&quot; math, which is made easy by the methods inside the <a href=\"#/p5.Vector\">p5.Vector</a> class.</p>\n"
        },
        "Calculation": {
            "name": "Calculation",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Math",
            "namespace": "",
            "file": "src/math/calculation.js",
            "line": 1,
            "requires": [
                "core"
            ]
        },
        "Noise": {
            "name": "Noise",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Math",
            "namespace": "",
            "file": "src/math/noise.js",
            "line": 14,
            "requires": [
                "core"
            ]
        },
        "Random": {
            "name": "Random",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Math",
            "namespace": "",
            "file": "src/math/random.js",
            "line": 1,
            "requires": [
                "core"
            ]
        },
        "Trigonometry": {
            "name": "Trigonometry",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Math",
            "namespace": "",
            "file": "src/math/trigonometry.js",
            "line": 1,
            "requires": [
                "core",
                "constants"
            ]
        },
        "Typography": {
            "name": "Typography",
            "submodules": {
                "Attributes": 1,
                "Loading & Displaying": 1,
                "Font": 1
            },
            "elements": {},
            "classes": {
                "p5.Font": 1
            },
            "fors": {
                "p5": 1
            },
            "namespaces": {},
            "file": "src/typography/p5.Font.js",
            "line": 15
        },
        "Font": {
            "name": "Font",
            "submodules": {},
            "elements": {},
            "classes": {
                "p5.Font": 1
            },
            "fors": {},
            "is_submodule": 1,
            "namespaces": {},
            "module": "Typography",
            "namespace": "",
            "file": "src/typography/p5.Font.js",
            "line": 15,
            "description": "<p>This module defines the <a href=\"#/p5.Font\">p5.Font</a> class and functions for\ndrawing text to the display canvas.</p>\n",
            "requires": [
                "core",
                "constants"
            ]
        },
        "Array Functions": {
            "name": "Array Functions",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Data",
            "namespace": "",
            "file": "src/utilities/array_functions.js",
            "line": 1,
            "requires": [
                "core"
            ]
        },
        "Conversion": {
            "name": "Conversion",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Data",
            "namespace": "",
            "file": "src/utilities/conversion.js",
            "line": 1,
            "requires": [
                "core"
            ]
        },
        "String Functions": {
            "name": "String Functions",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Data",
            "namespace": "",
            "file": "src/utilities/string_functions.js",
            "line": 1,
            "requires": [
                "core"
            ]
        },
        "Time & Date": {
            "name": "Time & Date",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "IO",
            "namespace": "",
            "file": "src/utilities/time_date.js",
            "line": 1,
            "requires": [
                "core"
            ]
        },
        "3D Primitives": {
            "name": "3D Primitives",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Shape",
            "namespace": "",
            "file": "src/webgl/3d_primitives.js",
            "line": 1,
            "requires": [
                "core",
                "p5.Geometry"
            ]
        },
        "Lights, Camera": {
            "name": "Lights, Camera",
            "submodules": {
                "Interaction": 1,
                "Lights": 1,
                "Material": 1,
                "Camera": 1,
                "Shaders": 1
            },
            "elements": {},
            "classes": {
                "p5.Camera": 1,
                "p5.Geometry": 1,
                "p5.Matrix": 1,
                "p5.Shader": 1,
                "p5.Texture": 1,
                "ImageInfos": 1,
                "FontInfo": 1,
                "Cubic": 1
            },
            "fors": {
                "p5": 1,
                "p5.Camera": 1
            },
            "namespaces": {},
            "file": "src/webgl/text.js",
            "line": 259
        },
        "Interaction": {
            "name": "Interaction",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Lights, Camera",
            "namespace": "",
            "file": "src/webgl/interaction.js",
            "line": 1,
            "requires": [
                "core"
            ]
        },
        "Lights": {
            "name": "Lights",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Lights, Camera",
            "namespace": "",
            "file": "src/webgl/light.js",
            "line": 1,
            "requires": [
                "core"
            ]
        },
        "3D Models": {
            "name": "3D Models",
            "submodules": {},
            "elements": {},
            "classes": {},
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Shape",
            "namespace": "",
            "file": "src/webgl/loading.js",
            "line": 1,
            "requires": [
                "core",
                "p5.Geometry"
            ]
        },
        "Material": {
            "name": "Material",
            "submodules": {},
            "elements": {},
            "classes": {
                "p5.Texture": 1
            },
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Lights, Camera",
            "namespace": "",
            "file": "src/webgl/p5.Texture.js",
            "line": 14,
            "requires": [
                "core"
            ],
            "description": "<p>This module defines the p5.Texture class</p>\n"
        },
        "Camera": {
            "name": "Camera",
            "submodules": {},
            "elements": {},
            "classes": {
                "p5.Camera": 1
            },
            "fors": {
                "p5": 1,
                "p5.Camera": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Lights, Camera",
            "namespace": "",
            "file": "src/webgl/p5.Camera.js",
            "line": 209,
            "requires": [
                "core"
            ],
            "description": "<p>This class describes a camera for use in p5&#39;s\n<a href=\"https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5\">\nWebGL mode</a>. It contains camera position, orientation, and projection\ninformation necessary for rendering a 3D scene.</p>\n<p>New p5.Camera objects can be made through the\n<a href=\"#/p5/createCamera\">createCamera()</a> function and controlled through\nthe methods described below. A camera created in this way will use a default\nposition in the scene and a default perspective projection until these\nproperties are changed through the various methods available. It is possible\nto create multiple cameras, in which case the current camera\ncan be set through the <a href=\"#/p5/setCamera\">setCamera()</a> method.</p>\n<p>Note:\nThe methods below operate in two coordinate systems: the &#39;world&#39; coordinate\nsystem describe positions in terms of their relationship to the origin along\nthe X, Y and Z axes whereas the camera&#39;s &#39;local&#39; coordinate system\ndescribes positions from the camera&#39;s point of view: left-right, up-down,\nand forward-backward. The <a href=\"#/p5.Camera/move\">move()</a> method,\nfor instance, moves the camera along its own axes, whereas the\n<a href=\"#/p5.Camera/setPosition\">setPosition()</a>\nmethod sets the camera&#39;s position in world-space.</p>\n"
        },
        "Shaders": {
            "name": "Shaders",
            "submodules": {},
            "elements": {},
            "classes": {
                "p5.Shader": 1
            },
            "fors": {
                "p5": 1
            },
            "is_submodule": 1,
            "namespaces": {},
            "module": "Lights, Camera",
            "namespace": "",
            "file": "src/webgl/p5.Shader.js",
            "line": 13,
            "description": "<p>This module defines the p5.Shader class</p>\n",
            "requires": [
                "core"
            ]
        },
        "p5.dom": {
            "name": "p5.dom",
            "submodules": {},
            "elements": {},
            "classes": {
                "p5.MediaElement": 1,
                "p5.File": 1
            },
            "fors": {
                "p5": 1,
                "p5.Element": 1
            },
            "namespaces": {},
            "module": "p5.dom",
            "file": "lib/addons/p5.dom.js",
            "line": 3170,
            "description": "<p><p>The web is much more than just canvas and p5.dom makes it easy to interact\nwith other HTML5 objects, including text, hyperlink, image, input, video,\naudio, and webcam.</p></p>\n<p><p>There is a set of creation methods, DOM manipulation methods, and\nan extended <a href=\"#/p5.Element\">p5.Element</a> that supports a range of HTML elements. See the\n<a href='https://github.com/processing/p5.js/wiki/Beyond-the-canvas'>\nbeyond the canvas tutorial</a> for a full overview of how this addon works.</p>\n<p><p>Methods and properties shown in black are part of the p5.js core, items in\nblue are part of the p5.dom library. You will need to include an extra file\nin order to access the blue functions. See the\n<a href='http://p5js.org/libraries/#using-a-library'>using a library</a>\nsection for information on how to include this library. p5.dom comes with\n<a href='http://p5js.org/download'>p5 complete</a> or you can download the single file\n<a href='https://raw.githubusercontent.com/lmccart/p5.js/master/lib/addons/p5.dom.js'>\nhere</a>.</p></p>\n<p><p>See <a href='https://github.com/processing/p5.js/wiki/Beyond-the-canvas'>tutorial: beyond the canvas</a>\nfor more info on how to use this library.</a></p>\n",
            "tag": "main",
            "itemtype": "main"
        },
        "p5.sound": {
            "name": "p5.sound",
            "submodules": {},
            "elements": {},
            "classes": {
                "p5.sound": 1,
                "p5.SoundFile": 1,
                "p5.Amplitude": 1,
                "p5.FFT": 1,
                "p5.Signal": 1,
                "p5.Oscillator": 1,
                "p5.SinOsc": 1,
                "p5.TriOsc": 1,
                "p5.SawOsc": 1,
                "p5.SqrOsc": 1,
                "p5.Envelope": 1,
                "p5.Pulse": 1,
                "p5.Noise": 1,
                "p5.AudioIn": 1,
                "p5.Effect": 1,
                "p5.Filter": 1,
                "p5.LowPass": 1,
                "p5.HighPass": 1,
                "p5.BandPass": 1,
                "p5.EQ": 1,
                "p5.Panner3D": 1,
                "p5.Delay": 1,
                "p5.Reverb": 1,
                "p5.Convolver": 1,
                "p5.Phrase": 1,
                "p5.Part": 1,
                "p5.Score": 1,
                "p5.SoundLoop": 1,
                "p5.Compressor": 1,
                "p5.SoundRecorder": 1,
                "p5.PeakDetect": 1,
                "p5.Gain": 1,
                "p5.AudioVoice": 1,
                "p5.MonoSynth": 1,
                "p5.PolySynth": 1,
                "p5.Distortion": 1
            },
            "fors": {
                "p5.sound": 1,
                "p5": 1
            },
            "namespaces": {},
            "module": "p5.sound",
            "file": "lib/addons/p5.sound.js",
            "line": 12761,
            "description": "<p>p5.sound extends p5 with <a href=\"http://caniuse.com/audio-api\"\ntarget=\"_blank\">Web Audio</a> functionality including audio input,\nplayback, analysis and synthesis.\n<br/><br/>\n<a href=\"#/p5.SoundFile\"><b>p5.SoundFile</b></a>: Load and play sound files.<br/>\n<a href=\"#/p5.Amplitude\"><b>p5.Amplitude</b></a>: Get the current volume of a sound.<br/>\n<a href=\"#/p5.AudioIn\"><b>p5.AudioIn</b></a>: Get sound from an input source, typically\n  a computer microphone.<br/>\n<a href=\"#/p5.FFT\"><b>p5.FFT</b></a>: Analyze the frequency of sound. Returns\n  results from the frequency spectrum or time domain (waveform).<br/>\n<a href=\"#/p5.Oscillator\"><b>p5.Oscillator</b></a>: Generate Sine,\n  Triangle, Square and Sawtooth waveforms. Base class of\n  <a href=\"#/p5.Noise\">p5.Noise</a> and <a href=\"#/p5.Pulse\">p5.Pulse</a>.\n  <br/>\n<a href=\"#/p5.Envelope\"><b>p5.Envelope</b></a>: An Envelope is a series\n  of fades over time. Often used to control an object&#39;s\n  output gain level as an &quot;ADSR Envelope&quot; (Attack, Decay,\n  Sustain, Release). Can also modulate other parameters.<br/>\n<a href=\"#/p5.Delay\"><b>p5.Delay</b></a>: A delay effect with\n  parameters for feedback, delayTime, and lowpass filter.<br/>\n<a href=\"#/p5.Filter\"><b>p5.Filter</b></a>: Filter the frequency range of a\n  sound.\n<br/>\n<a href=\"#/p5.Reverb\"><b>p5.Reverb</b></a>: Add reverb to a sound by specifying\n  duration and decay. <br/>\n<b><a href=\"#/p5.Convolver\">p5.Convolver</a>:</b> Extends\n<a href=\"#/p5.Reverb\">p5.Reverb</a> to simulate the sound of real\n  physical spaces through convolution.<br/>\n<b><a href=\"#/p5.SoundRecorder\">p5.SoundRecorder</a></b>: Record sound for playback\n  / save the .wav file.\n<b><a href=\"#/p5.Phrase\">p5.Phrase</a></b>, <b><a href=\"#/p5.Part\">p5.Part</a></b> and\n<b><a href=\"#/p5.Score\">p5.Score</a></b>: Compose musical sequences.\n<br/><br/>\np5.sound is on <a href=\"https://github.com/therewasaguy/p5.sound/\">GitHub</a>.\nDownload the latest version\n<a href=\"https://github.com/therewasaguy/p5.sound/blob/master/lib/p5.sound.js\">here</a>.</p>\n",
            "tag": "main",
            "itemtype": "main"
        }
    },
    "classes": {
        "p5": {
            "name": "p5",
            "shortname": "p5",
            "classitems": [],
            "plugins": [],
            "extensions": [],
            "plugin_for": [],
            "extension_for": [],
            "module": "IO",
            "submodule": "Output",
            "namespace": "",
            "file": "src/core/main.js",
            "line": 15,
            "description": "<p>This is the p5 instance constructor.</p>\n<p>A p5 instance holds all the properties and methods related to\na p5 sketch.  It expects an incoming sketch closure and it can also\ntake an optional node parameter for attaching the generated p5 canvas\nto a node.  The sketch closure takes the newly created p5 instance as\nits sole argument and may optionally set <a href=\"#/p5/preload\">preload()</a>, <a href=\"#/p5/setup\">setup()</a>, and/or\n<a href=\"#/p5/draw\">draw()</a> properties on it for running a sketch.</p>\n<p>A p5 sketch can run in &quot;global&quot; or &quot;instance&quot; mode:\n&quot;global&quot;   - all properties and methods are attached to the window\n&quot;instance&quot; - all properties and methods are bound to this p5 object</p>\n",
            "is_constructor": 1,
            "params": [
                {
                    "name": "sketch",
                    "description": "<p>a closure that can set optional <a href=\"#/p5/preload\">preload()</a>,\n                             <a href=\"#/p5/setup\">setup()</a>, and/or <a href=\"#/p5/draw\">draw()</a> properties on the\n                             given p5 instance</p>\n",
                    "type": "Function"
                },
                {
                    "name": "node",
                    "description": "<p>element to attach canvas to, if a\n                                     boolean is passed in use it as sync</p>\n",
                    "type": "HTMLElement|Boolean",
                    "optional": true
                },
                {
                    "name": "sync",
                    "description": "<p>start synchronously (optional)</p>\n",
                    "type": "Boolean",
                    "optional": true
                }
            ],
            "return": {
                "description": "a p5 instance",
                "type": "P5"
            }
        },
        "p5.Color": {
            "name": "p5.Color",
            "shortname": "p5.Color",
            "classitems": [],
            "plugins": [],
            "extensions": [],
            "plugin_for": [],
            "extension_for": [],
            "module": "Color",
            "submodule": "Creating & Reading",
            "namespace": "",
            "file": "src/color/p5.Color.js",
            "line": 16,
            "description": "<p>Each color stores the color mode and level maxes that applied at the\ntime of its construction. These are used to interpret the input arguments\n(at construction and later for that instance of color) and to format the\noutput e.g. when <a href=\"#/p5/saturation\">saturation()</a> is requested.</p>\n<p>Internally we store an array representing the ideal RGBA values in floating\npoint form, normalized from 0 to 1. From this we calculate the closest\nscreen color (RGBA levels from 0 to 255) and expose this to the renderer.</p>\n<p>We also cache normalized, floating point components of the color in various\nrepresentations as they are calculated. This is done to prevent repeating a\nconversion that has already been performed.</p>\n"
        },
        "p5.Element": {
            "name": "p5.Element",
            "shortname": "p5.Element",
            "classitems": [],
            "plugins": [],
            "extensions": [],
            "plugin_for": [],
            "extension_for": [],
            "module": "DOM",
            "submodule": "DOM",
            "namespace": "",
            "file": "src/core/p5.Element.js",
            "line": 11,
            "description": "<p>Base class for all elements added to a sketch, including canvas,\ngraphics buffers, and other HTML elements. Methods in blue are\nincluded in the core functionality, methods in brown are added\nwith the <a href=\"http://p5js.org/reference/#/libraries/p5.dom\">p5.dom\nlibrary</a>.\nIt is not called directly, but <a href=\"#/p5.Element\">p5.Element</a>\nobjects are created by calling <a href=\"#/p5/createCanvas\">createCanvas</a>, <a href=\"#/p5/createGraphics\">createGraphics</a>,\nor in the p5.dom library, <a href=\"#/p5/createDiv\">createDiv</a>, <a href=\"#/p5/createImg\">createImg</a>, <a href=\"#/p5/createInput\">createInput</a>, etc.</p>\n",
            "params": [
                {
                    "name": "elt",
                    "description": "<p>DOM node that is wrapped</p>\n",
                    "type": "String"
                },
                {
                    "name": "pInst",
                    "description": "<p>pointer to p5 instance</p>\n",
                    "type": "P5",
                    "optional": true
                }
            ]
        },
        "p5.Graphics": {
            "name": "p5.Graphics",
            "shortname": "p5.Graphics",
            "classitems": [],
            "plugins": [],
            "extensions": [],
            "plugin_for": [],
            "extension_for": [],
            "module": "Rendering",
            "submodule": "Rendering",
            "namespace": "",
            "file": "src/core/p5.Graphics.js",
            "line": 12,
            "description": "<p>Thin wrapper around a renderer, to be used for creating a\ngraphics buffer object. Use this class if you need\nto draw into an off-screen graphics buffer. The two parameters define the\nwidth and height in pixels. The fields and methods for this class are\nextensive, but mirror the normal drawing API for p5.</p>\n",
            "extends": "p5.Element",
            "params": [
                {
                    "name": "w",
                    "description": "<p>width</p>\n",
                    "type": "Number"
                },
                {
                    "name": "h",
                    "description": "<p>height</p>\n",
                    "type": "Number"
                },
                {
                    "name": "renderer",
                    "description": "<p>the renderer to use, either P2D or WEBGL</p>\n",
                    "type": "Constant"
                },
                {
                    "name": "pInst",
                    "description": "<p>pointer to p5 instance</p>\n",
                    "type": "P5",
                    "optional": true
                }
            ]
        },
        "p5.Renderer": {
            "name": "p5.Renderer",
            "shortname": "p5.Renderer",
            "classitems": [],
            "plugins": [],
            "extensions": [],
            "plugin_for": [],
            "extension_for": [],
            "module": "Rendering",
            "submodule": "Rendering",
            "namespace": "",
            "file": "src/core/p5.Renderer.js",
            "line": 12,
            "description": "<p>Main graphics and rendering context, as well as the base API\nimplementation for p5.js &quot;core&quot;. To be used as the superclass for\nRenderer2D and Renderer3D classes, respecitvely.</p>\n",
            "is_constructor": 1,
            "extends": "p5.Element",
            "params": [
                {
                    "name": "elt",
                    "description": "<p>DOM node that is wrapped</p>\n",
                    "type": "String"
                },
                {
                    "name": "pInst",
                    "desc