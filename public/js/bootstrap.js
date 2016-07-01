(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function () {
      return (root['Chartist'] = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['Chartist'] = factory();
  }
}(this, function () {

/* Chartist.js 0.9.8
 * Copyright © 2016 Gion Kunz
 * Free to use under either the WTFPL license or the MIT license.
 * https://raw.githubusercontent.com/gionkunz/chartist-js/master/LICENSE-WTFPL
 * https://raw.githubusercontent.com/gionkunz/chartist-js/master/LICENSE-MIT
 */
/**
 * The core module of Chartist that is mainly providing static functions and higher level functions for chart modules.
 *
 * @module Chartist.Core
 */
var Chartist = {
  version: '0.9.8'
};

(function (window, document, Chartist) {
  'use strict';

  /**
   * This object contains all namespaces used within Chartist.
   *
   * @memberof Chartist.Core
   * @type {{svg: string, xmlns: string, xhtml: string, xlink: string, ct: string}}
   */
  Chartist.namespaces = {
    svg: 'http://www.w3.org/2000/svg',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    ct: 'http://gionkunz.github.com/chartist-js/ct'
  };

  /**
   * Helps to simplify functional style code
   *
   * @memberof Chartist.Core
   * @param {*} n This exact value will be returned by the noop function
   * @return {*} The same value that was provided to the n parameter
   */
  Chartist.noop = function (n) {
    return n;
  };

  /**
   * Generates a-z from a number 0 to 26
   *
   * @memberof Chartist.Core
   * @param {Number} n A number from 0 to 26 that will result in a letter a-z
   * @return {String} A character from a-z based on the input number n
   */
  Chartist.alphaNumerate = function (n) {
    // Limit to a-z
    return String.fromCharCode(97 + n % 26);
  };

  /**
   * Simple recursive object extend
   *
   * @memberof Chartist.Core
   * @param {Object} target Target object where the source will be merged into
   * @param {Object...} sources This object (objects) will be merged into target and then target is returned
   * @return {Object} An object that has the same reference as target but is extended and merged with the properties of source
   */
  Chartist.extend = function (target) {
    target = target || {};

    var sources = Array.prototype.slice.call(arguments, 1);
    sources.forEach(function(source) {
      for (var prop in source) {
        if (typeof source[prop] === 'object' && source[prop] !== null && !(source[prop] instanceof Array)) {
          target[prop] = Chartist.extend({}, target[prop], source[prop]);
        } else {
          target[prop] = source[prop];
        }
      }
    });

    return target;
  };

  /**
   * Replaces all occurrences of subStr in str with newSubStr and returns a new string.
   *
   * @memberof Chartist.Core
   * @param {String} str
   * @param {String} subStr
   * @param {String} newSubStr
   * @return {String}
   */
  Chartist.replaceAll = function(str, subStr, newSubStr) {
    return str.replace(new RegExp(subStr, 'g'), newSubStr);
  };

  /**
   * Converts a number to a string with a unit. If a string is passed then this will be returned unmodified.
   *
   * @memberof Chartist.Core
   * @param {Number} value
   * @param {String} unit
   * @return {String} Returns the passed number value with unit.
   */
  Chartist.ensureUnit = function(value, unit) {
    if(typeof value === 'number') {
      value = value + unit;
    }

    return value;
  };

  /**
   * Converts a number or string to a quantity object.
   *
   * @memberof Chartist.Core
   * @param {String|Number} input
   * @return {Object} Returns an object containing the value as number and the unit as string.
   */
  Chartist.quantity = function(input) {
    if (typeof input === 'string') {
      var match = (/^(\d+)\s*(.*)$/g).exec(input);
      return {
        value : +match[1],
        unit: match[2] || undefined
      };
    }
    return { value: input };
  };

  /**
   * This is a wrapper around document.querySelector that will return the query if it's already of type Node
   *
   * @memberof Chartist.Core
   * @param {String|Node} query The query to use for selecting a Node or a DOM node that will be returned directly
   * @return {Node}
   */
  Chartist.querySelector = function(query) {
    return query instanceof Node ? query : document.querySelector(query);
  };

  /**
   * Functional style helper to produce array with given length initialized with undefined values
   *
   * @memberof Chartist.Core
   * @param length
   * @return {Array}
   */
  Chartist.times = function(length) {
    return Array.apply(null, new Array(length));
  };

  /**
   * Sum helper to be used in reduce functions
   *
   * @memberof Chartist.Core
   * @param previous
   * @param current
   * @return {*}
   */
  Chartist.sum = function(previous, current) {
    return previous + (current ? current : 0);
  };

  /**
   * Multiply helper to be used in `Array.map` for multiplying each value of an array with a factor.
   *
   * @memberof Chartist.Core
   * @param {Number} factor
   * @returns {Function} Function that can be used in `Array.map` to multiply each value in an array
   */
  Chartist.mapMultiply = function(factor) {
    return function(num) {
      return num * factor;
    };
  };

  /**
   * Add helper to be used in `Array.map` for adding a addend to each value of an array.
   *
   * @memberof Chartist.Core
   * @param {Number} addend
   * @returns {Function} Function that can be used in `Array.map` to add a addend to each value in an array
   */
  Chartist.mapAdd = function(addend) {
    return function(num) {
      return num + addend;
    };
  };

  /**
   * Map for multi dimensional arrays where their nested arrays will be mapped in serial. The output array will have the length of the largest nested array. The callback function is called with variable arguments where each argument is the nested array value (or undefined if there are no more values).
   *
   * @memberof Chartist.Core
   * @param arr
   * @param cb
   * @return {Array}
   */
  Chartist.serialMap = function(arr, cb) {
    var result = [],
        length = Math.max.apply(null, arr.map(function(e) {
          return e.length;
        }));

    Chartist.times(length).forEach(function(e, index) {
      var args = arr.map(function(e) {
        return e[index];
      });

      result[index] = cb.apply(null, args);
    });

    return result;
  };

  /**
   * This helper function can be used to round values with certain precision level after decimal. This is used to prevent rounding errors near float point precision limit.
   *
   * @memberof Chartist.Core
   * @param {Number} value The value that should be rounded with precision
   * @param {Number} [digits] The number of digits after decimal used to do the rounding
   * @returns {number} Rounded value
   */
  Chartist.roundWithPrecision = function(value, digits) {
    var precision = Math.pow(10, digits || Chartist.precision);
    return Math.round(value * precision) / precision;
  };

  /**
   * Precision level used internally in Chartist for rounding. If you require more decimal places you can increase this number.
   *
   * @memberof Chartist.Core
   * @type {number}
   */
  Chartist.precision = 8;

  /**
   * A map with characters to escape for strings to be safely used as attribute values.
   *
   * @memberof Chartist.Core
   * @type {Object}
   */
  Chartist.escapingMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#039;'
  };

  /**
   * This function serializes arbitrary data to a string. In case of data that can't be easily converted to a string, this function will create a wrapper object and serialize the data using JSON.stringify. The outcoming string will always be escaped using Chartist.escapingMap.
   * If called with null or undefined the function will return immediately with null or undefined.
   *
   * @memberof Chartist.Core
   * @param {Number|String|Object} data
   * @return {String}
   */
  Chartist.serialize = function(data) {
    if(data === null || data === undefined) {
      return data;
    } else if(typeof data === 'number') {
      data = ''+data;
    } else if(typeof data === 'object') {
      data = JSON.stringify({data: data});
    }

    return Object.keys(Chartist.escapingMap).reduce(function(result, key) {
      return Chartist.replaceAll(result, key, Chartist.escapingMap[key]);
    }, data);
  };

  /**
   * This function de-serializes a string previously serialized with Chartist.serialize. The string will always be unescaped using Chartist.escapingMap before it's returned. Based on the input value the return type can be Number, String or Object. JSON.parse is used with try / catch to see if the unescaped string can be parsed into an Object and this Object will be returned on success.
   *
   * @memberof Chartist.Core
   * @param {String} data
   * @return {String|Number|Object}
   */
  Chartist.deserialize = function(data) {
    if(typeof data !== 'string') {
      return data;
    }

    data = Object.keys(Chartist.escapingMap).reduce(function(result, key) {
      return Chartist.replaceAll(result, Chartist.escapingMap[key], key);
    }, data);

    try {
      data = JSON.parse(data);
      data = data.data !== undefined ? data.data : data;
    } catch(e) {}

    return data;
  };

  /**
   * Create or reinitialize the SVG element for the chart
   *
   * @memberof Chartist.Core
   * @param {Node} container The containing DOM Node object that will be used to plant the SVG element
   * @param {String} width Set the width of the SVG element. Default is 100%
   * @param {String} height Set the height of the SVG element. Default is 100%
   * @param {String} className Specify a class to be added to the SVG element
   * @return {Object} The created/reinitialized SVG element
   */
  Chartist.createSvg = function (container, width, height, className) {
    var svg;

    width = width || '100%';
    height = height || '100%';

    // Check if there is a previous SVG element in the container that contains the Chartist XML namespace and remove it
    // Since the DOM API does not support namespaces we need to manually search the returned list http://www.w3.org/TR/selectors-api/
    Array.prototype.slice.call(container.querySelectorAll('svg')).filter(function filterChartistSvgObjects(svg) {
      return svg.getAttributeNS(Chartist.namespaces.xmlns, 'ct');
    }).forEach(function removePreviousElement(svg) {
      container.removeChild(svg);
    });

    // Create svg object with width and height or use 100% as default
    svg = new Chartist.Svg('svg').attr({
      width: width,
      height: height
    }).addClass(className).attr({
      style: 'width: ' + width + '; height: ' + height + ';'
    });

    // Add the DOM node to our container
    container.appendChild(svg._node);

    return svg;
  };

  /**
   * Ensures that the data object passed as second argument to the charts is present and correctly initialized.
   *
   * @param  {Object} data The data object that is passed as second argument to the charts
   * @return {Object} The normalized data object
   */
  Chartist.normalizeData = function(data) {
    // Ensure data is present otherwise enforce
    data = data || {series: [], labels: []};
    data.series = data.series || [];
    data.labels = data.labels || [];

    // Check if we should generate some labels based on existing series data
    if (data.series.length > 0 && data.labels.length === 0) {
      var normalized = Chartist.getDataArray(data),
          labelCount;

      // If all elements of the normalized data array are arrays we're dealing with
      // data from Bar or Line charts and we need to find the largest series if they are un-even
      if (normalized.every(function(value) {
        return value instanceof Array;
      })) {
        // Getting the series with the the most elements
        labelCount = Math.max.apply(null, normalized.map(function(series) {
          return series.length;
        }));
      } else {
        // We're dealing with Pie data so we just take the normalized array length
        labelCount = normalized.length;
      }

      // Setting labels to an array with emptry strings using our labelCount estimated above
      data.labels = Chartist.times(labelCount).map(function() {
        return '';
      });
    }
    return data;
  };

  /**
   * Reverses the series, labels and series data arrays.
   *
   * @memberof Chartist.Core
   * @param data
   */
  Chartist.reverseData = function(data) {
    data.labels.reverse();
    data.series.reverse();
    for (var i = 0; i < data.series.length; i++) {
      if(typeof(data.series[i]) === 'object' && data.series[i].data !== undefined) {
        data.series[i].data.reverse();
      } else if(data.series[i] instanceof Array) {
        data.series[i].reverse();
      }
    }
  };

  /**
   * Convert data series into plain array
   *
   * @memberof Chartist.Core
   * @param {Object} data The series object that contains the data to be visualized in the chart
   * @param {Boolean} reverse If true the whole data is reversed by the getDataArray call. This will modify the data object passed as first parameter. The labels as well as the series order is reversed. The whole series data arrays are reversed too.
   * @param {Boolean} multi Create a multi dimensional array from a series data array where a value object with `x` and `y` values will be created.
   * @return {Array} A plain array that contains the data to be visualized in the chart
   */
  Chartist.getDataArray = function (data, reverse, multi) {
    // If the data should be reversed but isn't we need to reverse it
    // If it's reversed but it shouldn't we need to reverse it back
    // That's required to handle data updates correctly and to reflect the responsive configurations
    if(reverse && !data.reversed || !reverse && data.reversed) {
      Chartist.reverseData(data);
      data.reversed = !data.reversed;
    }

    // Recursively walks through nested arrays and convert string values to numbers and objects with value properties
    // to values. Check the tests in data core -> data normalization for a detailed specification of expected values
    function recursiveConvert(value) {
      if(Chartist.isFalseyButZero(value)) {
        // This is a hole in data and we should return undefined
        return undefined;
      } else if((value.data || value) instanceof Array) {
        return (value.data || value).map(recursiveConvert);
      } else if(value.hasOwnProperty('value')) {
        return recursiveConvert(value.value);
      } else {
        if(multi) {
          var multiValue = {};

          // Single series value arrays are assumed to specify the Y-Axis value
          // For example: [1, 2] => [{x: undefined, y: 1}, {x: undefined, y: 2}]
          // If multi is a string then it's assumed that it specified which dimension should be filled as default
          if(typeof multi === 'string') {
            multiValue[multi] = Chartist.getNumberOrUndefined(value);
          } else {
            multiValue.y = Chartist.getNumberOrUndefined(value);
          }

          multiValue.x = value.hasOwnProperty('x') ? Chartist.getNumberOrUndefined(value.x) : multiValue.x;
          multiValue.y = value.hasOwnProperty('y') ? Chartist.getNumberOrUndefined(value.y) : multiValue.y;

          return multiValue;

        } else {
          return Chartist.getNumberOrUndefined(value);
        }
      }
    }

    return data.series.map(recursiveConvert);
  };

  /**
   * Converts a number into a padding object.
   *
   * @memberof Chartist.Core
   * @param {Object|Number} padding
   * @param {Number} [fallback] This value is used to fill missing values if a incomplete padding object was passed
   * @returns {Object} Returns a padding object containing top, right, bottom, left properties filled with the padding number passed in as argument. If the argument is something else than a number (presumably already a correct padding object) then this argument is directly returned.
   */
  Chartist.normalizePadding = function(padding, fallback) {
    fallback = fallback || 0;

    return typeof padding === 'number' ? {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    } : {
      top: typeof padding.top === 'number' ? padding.top : fallback,
      right: typeof padding.right === 'number' ? padding.right : fallback,
      bottom: typeof padding.bottom === 'number' ? padding.bottom : fallback,
      left: typeof padding.left === 'number' ? padding.left : fallback
    };
  };

  Chartist.getMetaData = function(series, index) {
    var value = series.data ? series.data[index] : series[index];
    return value ? Chartist.serialize(value.meta) : undefined;
  };

  /**
   * Calculate the order of magnitude for the chart scale
   *
   * @memberof Chartist.Core
   * @param {Number} value The value Range of the chart
   * @return {Number} The order of magnitude
   */
  Chartist.orderOfMagnitude = function (value) {
    return Math.floor(Math.log(Math.abs(value)) / Math.LN10);
  };

  /**
   * Project a data length into screen coordinates (pixels)
   *
   * @memberof Chartist.Core
   * @param {Object} axisLength The svg element for the chart
   * @param {Number} length Single data value from a series array
   * @param {Object} bounds All the values to set the bounds of the chart
   * @return {Number} The projected data length in pixels
   */
  Chartist.projectLength = function (axisLength, length, bounds) {
    return length / bounds.range * axisLength;
  };

  /**
   * Get the height of the area in the chart for the data series
   *
   * @memberof Chartist.Core
   * @param {Object} svg The svg element for the chart
   * @param {Object} options The Object that contains all the optional values for the chart
   * @return {Number} The height of the area in the chart for the data series
   */
  Chartist.getAvailableHeight = function (svg, options) {
    return Math.max((Chartist.quantity(options.height).value || svg.height()) - (options.chartPadding.top +  options.chartPadding.bottom) - options.axisX.offset, 0);
  };

  /**
   * Get highest and lowest value of data array. This Array contains the data that will be visualized in the chart.
   *
   * @memberof Chartist.Core
   * @param {Array} data The array that contains the data to be visualized in the chart
   * @param {Object} options The Object that contains the chart options
   * @param {String} dimension Axis dimension 'x' or 'y' used to access the correct value and high / low configuration
   * @return {Object} An object that contains the highest and lowest value that will be visualized on the chart.
   */
  Chartist.getHighLow = function (data, options, dimension) {
    // TODO: Remove workaround for deprecated global high / low config. Axis high / low configuration is preferred
    options = Chartist.extend({}, options, dimension ? options['axis' + dimension.toUpperCase()] : {});

    var highLow = {
        high: options.high === undefined ? -Number.MAX_VALUE : +options.high,
        low: options.low === undefined ? Number.MAX_VALUE : +options.low
      };
    var findHigh = options.high === undefined;
    var findLow = options.low === undefined;

    // Function to recursively walk through arrays and find highest and lowest number
    function recursiveHighLow(data) {
      if(data === undefined) {
        return undefined;
      } else if(data instanceof Array) {
        for (var i = 0; i < data.length; i++) {
          recursiveHighLow(data[i]);
        }
      } else {
        var value = dimension ? +data[dimension] : +data;

        if (findHigh && value > highLow.high) {
          highLow.high = value;
        }

        if (findLow && value < highLow.low) {
          highLow.low = value;
        }
      }
    }

    // Start to find highest and lowest number recursively
    if(findHigh || findLow) {
      recursiveHighLow(data);
    }

    // Overrides of high / low based on reference value, it will make sure that the invisible reference value is
    // used to generate the chart. This is useful when the chart always needs to contain the position of the
    // invisible reference value in the view i.e. for bipolar scales.
    if (options.referenceValue || options.referenceValue === 0) {
      highLow.high = Math.max(options.referenceValue, highLow.high);
      highLow.low = Math.min(options.referenceValue, highLow.low);
    }

    // If high and low are the same because of misconfiguration or flat data (only the same value) we need
    // to set the high or low to 0 depending on the polarity
    if (highLow.high <= highLow.low) {
      // If both values are 0 we set high to 1
      if (highLow.low === 0) {
        highLow.high = 1;
      } else if (highLow.low < 0) {
        // If we have the same negative value for the bounds we set bounds.high to 0
        highLow.high = 0;
      } else if (highLow.high > 0) {
        // If we have the same positive value for the bounds we set bounds.low to 0
        highLow.low = 0;
      } else {
        // If data array was empty, values are Number.MAX_VALUE and -Number.MAX_VALUE. Set bounds to prevent errors
        highLow.high = 1;
        highLow.low = 0;
      }
    }

    return highLow;
  };

  /**
   * Checks if the value is a valid number or string with a number.
   *
   * @memberof Chartist.Core
   * @param value
   * @returns {Boolean}
   */
  Chartist.isNum = function(value) {
    return !isNaN(value) && isFinite(value);
  };

  /**
   * Returns true on all falsey values except the numeric value 0.
   *
   * @memberof Chartist.Core
   * @param value
   * @returns {boolean}
   */
  Chartist.isFalseyButZero = function(value) {
    return !value && value !== 0;
  };

  /**
   * Returns a number if the passed parameter is a valid number or the function will return undefined. On all other values than a valid number, this function will return undefined.
   *
   * @memberof Chartist.Core
   * @param value
   * @returns {*}
   */
  Chartist.getNumberOrUndefined = function(value) {
    return isNaN(+value) ? undefined : +value;
  };

  /**
   * Gets a value from a dimension `value.x` or `value.y` while returning value directly if it's a valid numeric value. If the value is not numeric and it's falsey this function will return undefined.
   *
   * @param value
   * @param dimension
   * @returns {*}
   */
  Chartist.getMultiValue = function(value, dimension) {
    if(Chartist.isNum(value)) {
      return +value;
    } else if(value) {
      return value[dimension || 'y'] || 0;
    } else {
      return 0;
    }
  };

  /**
   * Pollard Rho Algorithm to find smallest factor of an integer value. There are more efficient algorithms for factorization, but this one is quite efficient and not so complex.
   *
   * @memberof Chartist.Core
   * @param {Number} num An integer number where the smallest factor should be searched for
   * @returns {Number} The smallest integer factor of the parameter num.
   */
  Chartist.rho = function(num) {
    if(num === 1) {
      return num;
    }

    function gcd(p, q) {
      if (p % q === 0) {
        return q;
      } else {
        return gcd(q, p % q);
      }
    }

    function f(x) {
      return x * x + 1;
    }

    var x1 = 2, x2 = 2, divisor;
    if (num % 2 === 0) {
      return 2;
    }

    do {
      x1 = f(x1) % num;
      x2 = f(f(x2)) % num;
      divisor = gcd(Math.abs(x1 - x2), num);
    } while (divisor === 1);

    return divisor;
  };

  /**
   * Calculate and retrieve all the bounds for the chart and return them in one array
   *
   * @memberof Chartist.Core
   * @param {Number} axisLength The length of the Axis used for
   * @param {Object} highLow An object containing a high and low property indicating the value range of the chart.
   * @param {Number} scaleMinSpace The minimum projected length a step should result in
   * @param {Boolean} onlyInteger
   * @return {Object} All the values to set the bounds of the chart
   */
  Chartist.getBounds = function (axisLength, highLow, scaleMinSpace, onlyInteger) {
    var i,
      optimizationCounter = 0,
      newMin,
      newMax,
      bounds = {
        high: highLow.high,
        low: highLow.low
      };

    bounds.valueRange = bounds.high - bounds.low;
    bounds.oom = Chartist.orderOfMagnitude(bounds.valueRange);
    bounds.step = Math.pow(10, bounds.oom);
    bounds.min = Math.floor(bounds.low / bounds.step) * bounds.step;
    bounds.max = Math.ceil(bounds.high / bounds.step) * bounds.step;
    bounds.range = bounds.max - bounds.min;
    bounds.numberOfSteps = Math.round(bounds.range / bounds.step);

    // Optimize scale step by checking if subdivision is possible based on horizontalGridMinSpace
    // If we are already below the scaleMinSpace value we will scale up
    var length = Chartist.projectLength(axisLength, bounds.step, bounds);
    var scaleUp = length < scaleMinSpace;
    var smallestFactor = onlyInteger ? Chartist.rho(bounds.range) : 0;

    // First check if we should only use integer steps and if step 1 is still larger than scaleMinSpace so we can use 1
    if(onlyInteger && Chartist.projectLength(axisLength, 1, bounds) >= scaleMinSpace) {
      bounds.step = 1;
    } else if(onlyInteger && smallestFactor < bounds.step && Chartist.projectLength(axisLength, smallestFactor, bounds) >= scaleMinSpace) {
      // If step 1 was too small, we can try the smallest factor of range
      // If the smallest factor is smaller than the current bounds.step and the projected length of smallest factor
      // is larger than the scaleMinSpace we should go for it.
      bounds.step = smallestFactor;
    } else {
      // Trying to divide or multiply by 2 and find the best step value
      while (true) {
        if (scaleUp && Chartist.projectLength(axisLength, bounds.step, bounds) <= scaleMinSpace) {
          bounds.step *= 2;
        } else if (!scaleUp && Chartist.projectLength(axisLength, bounds.step / 2, bounds) >= scaleMinSpace) {
          bounds.step /= 2;
          if(onlyInteger && bounds.step % 1 !== 0) {
            bounds.step *= 2;
            break;
          }
        } else {
          break;
        }

        if(optimizationCounter++ > 1000) {
          throw new Error('Exceeded maximum number of iterations while optimizing scale step!');
        }
      }
    }

    // step must not be less than EPSILON to create values that can be represented as floating number.
    var EPSILON = 2.221E-16;
    bounds.step = Math.max(bounds.step, EPSILON);

    // Narrow min and max based on new step
    newMin = bounds.min;
    newMax = bounds.max;
    while(newMin + bounds.step <= bounds.low) {
      newMin += bounds.step;
    }
    while(newMax - bounds.step >= bounds.high) {
      newMax -= bounds.step;
    }
    bounds.min = newMin;
    bounds.max = newMax;
    bounds.range = bounds.max - bounds.min;

    var values = [];
    for (i = bounds.min; i <= bounds.max; i += bounds.step) {
      var value = Chartist.roundWithPrecision(i);
      if (value !== values[values.length - 1]) {
        values.push(i);
      }
    }
    bounds.values = values;
    return bounds;
  };

  /**
   * Calculate cartesian coordinates of polar coordinates
   *
   * @memberof Chartist.Core
   * @param {Number} centerX X-axis coordinates of center point of circle segment
   * @param {Number} centerY X-axis coordinates of center point of circle segment
   * @param {Number} radius Radius of circle segment
   * @param {Number} angleInDegrees Angle of circle segment in degrees
   * @return {{x:Number, y:Number}} Coordinates of point on circumference
   */
  Chartist.polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  /**
   * Initialize chart drawing rectangle (area where chart is drawn) x1,y1 = bottom left / x2,y2 = top right
   *
   * @memberof Chartist.Core
   * @param {Object} svg The svg element for the chart
   * @param {Object} options The Object that contains all the optional values for the chart
   * @param {Number} [fallbackPadding] The fallback padding if partial padding objects are used
   * @return {Object} The chart rectangles coordinates inside the svg element plus the rectangles measurements
   */
  Chartist.createChartRect = function (svg, options, fallbackPadding) {
    var hasAxis = !!(options.axisX || options.axisY);
    var yAxisOffset = hasAxis ? options.axisY.offset : 0;
    var xAxisOffset = hasAxis ? options.axisX.offset : 0;
    // If width or height results in invalid value (including 0) we fallback to the unitless settings or even 0
    var width = svg.width() || Chartist.quantity(options.width).value || 0;
    var height = svg.height() || Chartist.quantity(options.height).value || 0;
    var normalizedPadding = Chartist.normalizePadding(options.chartPadding, fallbackPadding);

    // If settings were to small to cope with offset (legacy) and padding, we'll adjust
    width = Math.max(width, yAxisOffset + normalizedPadding.left + normalizedPadding.right);
    height = Math.max(height, xAxisOffset + normalizedPadding.top + normalizedPadding.bottom);

    var chartRect = {
      padding: normalizedPadding,
      width: function () {
        return this.x2 - this.x1;
      },
      height: function () {
        return this.y1 - this.y2;
      }
    };

    if(hasAxis) {
      if (options.axisX.position === 'start') {
        chartRect.y2 = normalizedPadding.top + xAxisOffset;
        chartRect.y1 = Math.max(height - normalizedPadding.bottom, chartRect.y2 + 1);
      } else {
        chartRect.y2 = normalizedPadding.top;
        chartRect.y1 = Math.max(height - normalizedPadding.bottom - xAxisOffset, chartRect.y2 + 1);
      }

      if (options.axisY.position === 'start') {
        chartRect.x1 = normalizedPadding.left + yAxisOffset;
        chartRect.x2 = Math.max(width - normalizedPadding.right, chartRect.x1 + 1);
      } else {
        chartRect.x1 = normalizedPadding.left;
        chartRect.x2 = Math.max(width - normalizedPadding.right - yAxisOffset, chartRect.x1 + 1);
      }
    } else {
      chartRect.x1 = normalizedPadding.left;
      chartRect.x2 = Math.max(width - normalizedPadding.right, chartRect.x1 + 1);
      chartRect.y2 = normalizedPadding.top;
      chartRect.y1 = Math.max(height - normalizedPadding.bottom, chartRect.y2 + 1);
    }

    return chartRect;
  };

  /**
   * Creates a grid line based on a projected value.
   *
   * @memberof Chartist.Core
   * @param position
   * @param index
   * @param axis
   * @param offset
   * @param length
   * @param group
   * @param classes
   * @param eventEmitter
   */
  Chartist.createGrid = function(position, index, axis, offset, length, group, classes, eventEmitter) {
    var positionalData = {};
    positionalData[axis.units.pos + '1'] = position;
    positionalData[axis.units.pos + '2'] = position;
    positionalData[axis.counterUnits.pos + '1'] = offset;
    positionalData[axis.counterUnits.pos + '2'] = offset + length;

    var gridElement = group.elem('line', positionalData, classes.join(' '));

    // Event for grid draw
    eventEmitter.emit('draw',
      Chartist.extend({
        type: 'grid',
        axis: axis,
        index: index,
        group: group,
        element: gridElement
      }, positionalData)
    );
  };

  /**
   * Creates a label based on a projected value and an axis.
   *
   * @memberof Chartist.Core
   * @param position
   * @param length
   * @param index
   * @param labels
   * @param axis
   * @param axisOffset
   * @param labelOffset
   * @param group
   * @param classes
   * @param useForeignObject
   * @param eventEmitter
   */
  Chartist.createLabel = function(position, length, index, labels, axis, axisOffset, labelOffset, group, classes, useForeignObject, eventEmitter) {
    var labelElement;
    var positionalData = {};

    positionalData[axis.units.pos] = position + labelOffset[axis.units.pos];
    positionalData[axis.counterUnits.pos] = labelOffset[axis.counterUnits.pos];
    positionalData[axis.units.len] = length;
    positionalData[axis.counterUnits.len] = Math.max(0, axisOffset - 10);

    if(useForeignObject) {
      // We need to set width and height explicitly to px as span will not expand with width and height being
      // 100% in all browsers
      var content = '<span class="' + classes.join(' ') + '" style="' +
        axis.units.len + ': ' + Math.round(positionalData[axis.units.len]) + 'px; ' +
        axis.counterUnits.len + ': ' + Math.round(positionalData[axis.counterUnits.len]) + 'px">' +
        labels[index] + '</span>';

      labelElement = group.foreignObject(content, Chartist.extend({
        style: 'overflow: visible;'
      }, positionalData));
    } else {
      labelElement = group.elem('text', positionalData, classes.join(' ')).text(labels[index]);
    }

    eventEmitter.emit('draw', Chartist.extend({
      type: 'label',
      axis: axis,
      index: index,
      group: group,
      element: labelElement,
      text: labels[index]
    }, positionalData));
  };

  /**
   * Helper to read series specific options from options object. It automatically falls back to the global option if
   * there is no option in the series options.
   *
   * @param {Object} series Series object
   * @param {Object} options Chartist options object
   * @param {string} key The options key that should be used to obtain the options
   * @returns {*}
   */
  Chartist.getSeriesOption = function(series, options, key) {
    if(series.name && options.series && options.series[series.name]) {
      var seriesOptions = options.series[series.name];
      return seriesOptions.hasOwnProperty(key) ? seriesOptions[key] : options[key];
    } else {
      return options[key];
    }
  };

  /**
   * Provides options handling functionality with callback for options changes triggered by responsive options and media query matches
   *
   * @memberof Chartist.Core
   * @param {Object} options Options set by user
   * @param {Array} responsiveOptions Optional functions to add responsive behavior to chart
   * @param {Object} eventEmitter The event emitter that will be used to emit the options changed events
   * @return {Object} The consolidated options object from the defaults, base and matching responsive options
   */
  Chartist.optionsProvider = function (options, responsiveOptions, eventEmitter) {
    var baseOptions = Chartist.extend({}, options),
      currentOptions,
      mediaQueryListeners = [],
      i;

    function updateCurrentOptions(mediaEvent) {
      var previousOptions = currentOptions;
      currentOptions = Chartist.extend({}, baseOptions);

      if (responsiveOptions) {
        for (i = 0; i < responsiveOptions.length; i++) {
          var mql = window.matchMedia(responsiveOptions[i][0]);
          if (mql.matches) {
            currentOptions = Chartist.extend(currentOptions, responsiveOptions[i][1]);
          }
        }
      }

      if(eventEmitter && mediaEvent) {
        eventEmitter.emit('optionsChanged', {
          previousOptions: previousOptions,
          currentOptions: currentOptions
        });
      }
    }

    function removeMediaQueryListeners() {
      mediaQueryListeners.forEach(function(mql) {
        mql.removeListener(updateCurrentOptions);
      });
    }

    if (!window.matchMedia) {
      throw 'window.matchMedia not found! Make sure you\'re using a polyfill.';
    } else if (responsiveOptions) {

      for (i = 0; i < responsiveOptions.length; i++) {
        var mql = window.matchMedia(responsiveOptions[i][0]);
        mql.addListener(updateCurrentOptions);
        mediaQueryListeners.push(mql);
      }
    }
    // Execute initially without an event argument so we get the correct options
    updateCurrentOptions();

    return {
      removeMediaQueryListeners: removeMediaQueryListeners,
      getCurrentOptions: function getCurrentOptions() {
        return Chartist.extend({}, currentOptions);
      }
    };
  };


  /**
   * Splits a list of coordinates and associated values into segments. Each returned segment contains a pathCoordinates
   * valueData property describing the segment.
   *
   * With the default options, segments consist of contiguous sets of points that do not have an undefined value. Any
   * points with undefined values are discarded.
   *
   * **Options**
   * The following options are used to determine how segments are formed
   * ```javascript
   * var options = {
   *   // If fillHoles is true, undefined values are simply discarded without creating a new segment. Assuming other options are default, this returns single segment.
   *   fillHoles: false,
   *   // If increasingX is true, the coordinates in all segments have strictly increasing x-values.
   *   increasingX: false
   * };
   * ```
   *
   * @memberof Chartist.Core
   * @param {Array} pathCoordinates List of point coordinates to be split in the form [x1, y1, x2, y2 ... xn, yn]
   * @param {Array} values List of associated point values in the form [v1, v2 .. vn]
   * @param {Object} options Options set by user
   * @return {Array} List of segments, each containing a pathCoordinates and valueData property.
   */
  Chartist.splitIntoSegments = function(pathCoordinates, valueData, options) {
    var defaultOptions = {
      increasingX: false,
      fillHoles: false
    };

    options = Chartist.extend({}, defaultOptions, options);

    var segments = [];
    var hole = true;

    for(var i = 0; i < pathCoordinates.length; i += 2) {
      // If this value is a "hole" we set the hole flag
      if(valueData[i / 2].value === undefined) {
        if(!options.fillHoles) {
          hole = true;
        }
      } else {
        if(options.increasingX && i >= 2 && pathCoordinates[i] <= pathCoordinates[i-2]) {
          // X is not increasing, so we need to make sure we start a new segment
          hole = true;
        }


        // If it's a valid value we need to check if we're coming out of a hole and create a new empty segment
        if(hole) {
          segments.push({
            pathCoordinates: [],
            valueData: []
          });
          // As we have a valid value now, we are not in a "hole" anymore
          hole = false;
        }

        // Add to the segment pathCoordinates and valueData
        segments[segments.length - 1].pathCoordinates.push(pathCoordinates[i], pathCoordinates[i + 1]);
        segments[segments.length - 1].valueData.push(valueData[i / 2]);
      }
    }

    return segments;
  };
}(window, document, Chartist));
;/**
 * Chartist path interpolation functions.
 *
 * @module Chartist.Interpolation
 */
/* global Chartist */
(function(window, document, Chartist) {
  'use strict';

  Chartist.Interpolation = {};

  /**
   * This interpolation function does not smooth the path and the result is only containing lines and no curves.
   *
   * @example
   * var chart = new Chartist.Line('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5],
   *   series: [[1, 2, 8, 1, 7]]
   * }, {
   *   lineSmooth: Chartist.Interpolation.none({
   *     fillHoles: false
   *   })
   * });
   *
   *
   * @memberof Chartist.Interpolation
   * @return {Function}
   */
  Chartist.Interpolation.none = function(options) {
    var defaultOptions = {
      fillHoles: false
    };
    options = Chartist.extend({}, defaultOptions, options);
    return function none(pathCoordinates, valueData) {
      var path = new Chartist.Svg.Path();
      var hole = true;

      for(var i = 0; i < pathCoordinates.length; i += 2) {
        var currX = pathCoordinates[i];
        var currY = pathCoordinates[i + 1];
        var currData = valueData[i / 2];

        if(currData.value !== undefined) {

          if(hole) {
            path.move(currX, currY, false, currData);
          } else {
            path.line(currX, currY, false, currData);
          }

          hole = false;
        } else if(!options.fillHoles) {
          hole = true;
        }
      }

      return path;
    };
  };

  /**
   * Simple smoothing creates horizontal handles that are positioned with a fraction of the length between two data points. You can use the divisor option to specify the amount of smoothing.
   *
   * Simple smoothing can be used instead of `Chartist.Smoothing.cardinal` if you'd like to get rid of the artifacts it produces sometimes. Simple smoothing produces less flowing lines but is accurate by hitting the points and it also doesn't swing below or above the given data point.
   *
   * All smoothing functions within Chartist are factory functions that accept an options parameter. The simple interpolation function accepts one configuration parameter `divisor`, between 1 and ∞, which controls the smoothing characteristics.
   *
   * @example
   * var chart = new Chartist.Line('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5],
   *   series: [[1, 2, 8, 1, 7]]
   * }, {
   *   lineSmooth: Chartist.Interpolation.simple({
   *     divisor: 2,
   *     fillHoles: false
   *   })
   * });
   *
   *
   * @memberof Chartist.Interpolation
   * @param {Object} options The options of the simple interpolation factory function.
   * @return {Function}
   */
  Chartist.Interpolation.simple = function(options) {
    var defaultOptions = {
      divisor: 2,
      fillHoles: false
    };
    options = Chartist.extend({}, defaultOptions, options);

    var d = 1 / Math.max(1, options.divisor);

    return function simple(pathCoordinates, valueData) {
      var path = new Chartist.Svg.Path();
      var prevX, prevY, prevData;

      for(var i = 0; i < pathCoordinates.length; i += 2) {
        var currX = pathCoordinates[i];
        var currY = pathCoordinates[i + 1];
        var length = (currX - prevX) * d;
        var currData = valueData[i / 2];

        if(currData.value !== undefined) {

          if(prevData === undefined) {
            path.move(currX, currY, false, currData);
          } else {
            path.curve(
              prevX + length,
              prevY,
              currX - length,
              currY,
              currX,
              currY,
              false,
              currData
            );
          }

          prevX = currX;
          prevY = currY;
          prevData = currData;
        } else if(!options.fillHoles) {
          prevX = currX = prevData = undefined;
        }
      }

      return path;
    };
  };

  /**
   * Cardinal / Catmull-Rome spline interpolation is the default smoothing function in Chartist. It produces nice results where the splines will always meet the points. It produces some artifacts though when data values are increased or decreased rapidly. The line may not follow a very accurate path and if the line should be accurate this smoothing function does not produce the best results.
   *
   * Cardinal splines can only be created if there are more than two data points. If this is not the case this smoothing will fallback to `Chartist.Smoothing.none`.
   *
   * All smoothing functions within Chartist are factory functions that accept an options parameter. The cardinal interpolation function accepts one configuration parameter `tension`, between 0 and 1, which controls the smoothing intensity.
   *
   * @example
   * var chart = new Chartist.Line('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5],
   *   series: [[1, 2, 8, 1, 7]]
   * }, {
   *   lineSmooth: Chartist.Interpolation.cardinal({
   *     tension: 1,
   *     fillHoles: false
   *   })
   * });
   *
   * @memberof Chartist.Interpolation
   * @param {Object} options The options of the cardinal factory function.
   * @return {Function}
   */
  Chartist.Interpolation.cardinal = function(options) {
    var defaultOptions = {
      tension: 1,
      fillHoles: false
    };

    options = Chartist.extend({}, defaultOptions, options);

    var t = Math.min(1, Math.max(0, options.tension)),
      c = 1 - t;

    return function cardinal(pathCoordinates, valueData) {
      // First we try to split the coordinates into segments
      // This is necessary to treat "holes" in line charts
      var segments = Chartist.splitIntoSegments(pathCoordinates, valueData, {
        fillHoles: options.fillHoles
      });

      if(!segments.length) {
        // If there were no segments return 'Chartist.Interpolation.none'
        return Chartist.Interpolation.none()([]);
      } else if(segments.length > 1) {
        // If the split resulted in more that one segment we need to interpolate each segment individually and join them
        // afterwards together into a single path.
          var paths = [];
        // For each segment we will recurse the cardinal function
        segments.forEach(function(segment) {
          paths.push(cardinal(segment.pathCoordinates, segment.valueData));
        });
        // Join the segment path data into a single path and return
        return Chartist.Svg.Path.join(paths);
      } else {
        // If there was only one segment we can proceed regularly by using pathCoordinates and valueData from the first
        // segment
        pathCoordinates = segments[0].pathCoordinates;
        valueData = segments[0].valueData;

        // If less than two points we need to fallback to no smoothing
        if(pathCoordinates.length <= 4) {
          return Chartist.Interpolation.none()(pathCoordinates, valueData);
        }

        var path = new Chartist.Svg.Path().move(pathCoordinates[0], pathCoordinates[1], false, valueData[0]),
          z;

        for (var i = 0, iLen = pathCoordinates.length; iLen - 2 * !z > i; i += 2) {
          var p = [
            {x: +pathCoordinates[i - 2], y: +pathCoordinates[i - 1]},
            {x: +pathCoordinates[i], y: +pathCoordinates[i + 1]},
            {x: +pathCoordinates[i + 2], y: +pathCoordinates[i + 3]},
            {x: +pathCoordinates[i + 4], y: +pathCoordinates[i + 5]}
          ];
          if (z) {
            if (!i) {
              p[0] = {x: +pathCoordinates[iLen - 2], y: +pathCoordinates[iLen - 1]};
            } else if (iLen - 4 === i) {
              p[3] = {x: +pathCoordinates[0], y: +pathCoordinates[1]};
            } else if (iLen - 2 === i) {
              p[2] = {x: +pathCoordinates[0], y: +pathCoordinates[1]};
              p[3] = {x: +pathCoordinates[2], y: +pathCoordinates[3]};
            }
          } else {
            if (iLen - 4 === i) {
              p[3] = p[2];
            } else if (!i) {
              p[0] = {x: +pathCoordinates[i], y: +pathCoordinates[i + 1]};
            }
          }

          path.curve(
            (t * (-p[0].x + 6 * p[1].x + p[2].x) / 6) + (c * p[2].x),
            (t * (-p[0].y + 6 * p[1].y + p[2].y) / 6) + (c * p[2].y),
            (t * (p[1].x + 6 * p[2].x - p[3].x) / 6) + (c * p[2].x),
            (t * (p[1].y + 6 * p[2].y - p[3].y) / 6) + (c * p[2].y),
            p[2].x,
            p[2].y,
            false,
            valueData[(i + 2) / 2]
          );
        }

        return path;
      }
    };
  };

  /**
   * Monotone Cubic spline interpolation produces a smooth curve which preserves monotonicity. Unlike cardinal splines, the curve will not extend beyond the range of y-values of the original data points.
   *
   * Monotone Cubic splines can only be created if there are more than two data points. If this is not the case this smoothing will fallback to `Chartist.Smoothing.none`.
   *
   * The x-values of subsequent points must be increasing to fit a Monotone Cubic spline. If this condition is not met for a pair of adjacent points, then there will be a break in the curve between those data points.
   *
   * All smoothing functions within Chartist are factory functions that accept an options parameter.
   *
   * @example
   * var chart = new Chartist.Line('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5],
   *   series: [[1, 2, 8, 1, 7]]
   * }, {
   *   lineSmooth: Chartist.Interpolation.monotoneCubic({
   *     fillHoles: false
   *   })
   * });
   *
   * @memberof Chartist.Interpolation
   * @param {Object} options The options of the monotoneCubic factory function.
   * @return {Function}
   */
  Chartist.Interpolation.monotoneCubic = function(options) {
    var defaultOptions = {
      fillHoles: false
    };

    options = Chartist.extend({}, defaultOptions, options);

    return function monotoneCubic(pathCoordinates, valueData) {
      // First we try to split the coordinates into segments
      // This is necessary to treat "holes" in line charts
      var segments = Chartist.splitIntoSegments(pathCoordinates, valueData, {
        fillHoles: options.fillHoles,
        increasingX: true
      });

      if(!segments.length) {
        // If there were no segments return 'Chartist.Interpolation.none'
        return Chartist.Interpolation.none()([]);
      } else if(segments.length > 1) {
        // If the split resulted in more that one segment we need to interpolate each segment individually and join them
        // afterwards together into a single path.
          var paths = [];
        // For each segment we will recurse the monotoneCubic fn function
        segments.forEach(function(segment) {
          paths.push(monotoneCubic(segment.pathCoordinates, segment.valueData));
        });
        // Join the segment path data into a single path and return
        return Chartist.Svg.Path.join(paths);
      } else {
        // If there was only one segment we can proceed regularly by using pathCoordinates and valueData from the first
        // segment
        pathCoordinates = segments[0].pathCoordinates;
        valueData = segments[0].valueData;

        // If less than three points we need to fallback to no smoothing
        if(pathCoordinates.length <= 4) {
          return Chartist.Interpolation.none()(pathCoordinates, valueData);
        }

        var xs = [],
          ys = [],
          i,
          n = pathCoordinates.length / 2,
          ms = [],
          ds = [], dys = [], dxs = [],
          path;

        // Populate x and y coordinates into separate arrays, for readability

        for(i = 0; i < n; i++) {
          xs[i] = pathCoordinates[i * 2];
          ys[i] = pathCoordinates[i * 2 + 1];
        }

        // Calculate deltas and derivative

        for(i = 0; i < n - 1; i++) {
          dys[i] = ys[i + 1] - ys[i];
          dxs[i] = xs[i + 1] - xs[i];
          ds[i] = dys[i] / dxs[i];
        }

        // Determine desired slope (m) at each point using Fritsch-Carlson method
        // See: http://math.stackexchange.com/questions/45218/implementation-of-monotone-cubic-interpolation

        ms[0] = ds[0];
        ms[n - 1] = ds[n - 2];

        for(i = 1; i < n - 1; i++) {
          if(ds[i] === 0 || ds[i - 1] === 0 || (ds[i - 1] > 0) !== (ds[i] > 0)) {
            ms[i] = 0;
          } else {
            ms[i] = 3 * (dxs[i - 1] + dxs[i]) / (
              (2 * dxs[i] + dxs[i - 1]) / ds[i - 1] +
              (dxs[i] + 2 * dxs[i - 1]) / ds[i]);

            if(!isFinite(ms[i])) {
              ms[i] = 0;
            }
          }
        }

        // Now build a path from the slopes

        path = new Chartist.Svg.Path().move(xs[0], ys[0], false, valueData[0]);

        for(i = 0; i < n - 1; i++) {
          path.curve(
            // First control point
            xs[i] + dxs[i] / 3,
            ys[i] + ms[i] * dxs[i] / 3,
            // Second control point
            xs[i + 1] - dxs[i] / 3,
            ys[i + 1] - ms[i + 1] * dxs[i] / 3,
            // End point
            xs[i + 1],
            ys[i + 1],

            false,
            valueData[i + 1]
          );
        }

        return path;
      }
    };
  };

  /**
   * Step interpolation will cause the line chart to move in steps rather than diagonal or smoothed lines. This interpolation will create additional points that will also be drawn when the `showPoint` option is enabled.
   *
   * All smoothing functions within Chartist are factory functions that accept an options parameter. The step interpolation function accepts one configuration parameter `postpone`, that can be `true` or `false`. The default value is `true` and will cause the step to occur where the value actually changes. If a different behaviour is needed where the step is shifted to the left and happens before the actual value, this option can be set to `false`.
   *
   * @example
   * var chart = new Chartist.Line('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5],
   *   series: [[1, 2, 8, 1, 7]]
   * }, {
   *   lineSmooth: Chartist.Interpolation.step({
   *     postpone: true,
   *     fillHoles: false
   *   })
   * });
   *
   * @memberof Chartist.Interpolation
   * @param options
   * @returns {Function}
   */
  Chartist.Interpolation.step = function(options) {
    var defaultOptions = {
      postpone: true,
      fillHoles: false
    };

    options = Chartist.extend({}, defaultOptions, options);

    return function step(pathCoordinates, valueData) {
      var path = new Chartist.Svg.Path();

      var prevX, prevY, prevData;

      for (var i = 0; i < pathCoordinates.length; i += 2) {
        var currX = pathCoordinates[i];
        var currY = pathCoordinates[i + 1];
        var currData = valueData[i / 2];

        // If the current point is also not a hole we can draw the step lines
        if(currData.value !== undefined) {
          if(prevData === undefined) {
            path.move(currX, currY, false, currData);
          } else {
            if(options.postpone) {
              // If postponed we should draw the step line with the value of the previous value
              path.line(currX, prevY, false, prevData);
            } else {
              // If not postponed we should draw the step line with the value of the current value
              path.line(prevX, currY, false, currData);
            }
            // Line to the actual point (this should only be a Y-Axis movement
            path.line(currX, currY, false, currData);
          }

          prevX = currX;
          prevY = currY;
          prevData = currData;
        } else if(!options.fillHoles) {
          prevX = prevY = prevData = undefined;
        }
      }

      return path;
    };
  };

}(window, document, Chartist));
;/**
 * A very basic event module that helps to generate and catch events.
 *
 * @module Chartist.Event
 */
/* global Chartist */
(function (window, document, Chartist) {
  'use strict';

  Chartist.EventEmitter = function () {
    var handlers = [];

    /**
     * Add an event handler for a specific event
     *
     * @memberof Chartist.Event
     * @param {String} event The event name
     * @param {Function} handler A event handler function
     */
    function addEventHandler(event, handler) {
      handlers[event] = handlers[event] || [];
      handlers[event].push(handler);
    }

    /**
     * Remove an event handler of a specific event name or remove all event handlers for a specific event.
     *
     * @memberof Chartist.Event
     * @param {String} event The event name where a specific or all handlers should be removed
     * @param {Function} [handler] An optional event handler function. If specified only this specific handler will be removed and otherwise all handlers are removed.
     */
    function removeEventHandler(event, handler) {
      // Only do something if there are event handlers with this name existing
      if(handlers[event]) {
        // If handler is set we will look for a specific handler and only remove this
        if(handler) {
          handlers[event].splice(handlers[event].indexOf(handler), 1);
          if(handlers[event].length === 0) {
            delete handlers[event];
          }
        } else {
          // If no handler is specified we remove all handlers for this event
          delete handlers[event];
        }
      }
    }

    /**
     * Use this function to emit an event. All handlers that are listening for this event will be triggered with the data parameter.
     *
     * @memberof Chartist.Event
     * @param {String} event The event name that should be triggered
     * @param {*} data Arbitrary data that will be passed to the event handler callback functions
     */
    function emit(event, data) {
      // Only do something if there are event handlers with this name existing
      if(handlers[event]) {
        handlers[event].forEach(function(handler) {
          handler(data);
        });
      }

      // Emit event to star event handlers
      if(handlers['*']) {
        handlers['*'].forEach(function(starHandler) {
          starHandler(event, data);
        });
      }
    }

    return {
      addEventHandler: addEventHandler,
      removeEventHandler: removeEventHandler,
      emit: emit
    };
  };

}(window, document, Chartist));
;/**
 * This module provides some basic prototype inheritance utilities.
 *
 * @module Chartist.Class
 */
/* global Chartist */
(function(window, document, Chartist) {
  'use strict';

  function listToArray(list) {
    var arr = [];
    if (list.length) {
      for (var i = 0; i < list.length; i++) {
        arr.push(list[i]);
      }
    }
    return arr;
  }

  /**
   * Method to extend from current prototype.
   *
   * @memberof Chartist.Class
   * @param {Object} properties The object that serves as definition for the prototype that gets created for the new class. This object should always contain a constructor property that is the desired constructor for the newly created class.
   * @param {Object} [superProtoOverride] By default extens will use the current class prototype or Chartist.class. With this parameter you can specify any super prototype that will be used.
   * @return {Function} Constructor function of the new class
   *
   * @example
   * var Fruit = Class.extend({
     * color: undefined,
     *   sugar: undefined,
     *
     *   constructor: function(color, sugar) {
     *     this.color = color;
     *     this.sugar = sugar;
     *   },
     *
     *   eat: function() {
     *     this.sugar = 0;
     *     return this;
     *   }
     * });
   *
   * var Banana = Fruit.extend({
     *   length: undefined,
     *
     *   constructor: function(length, sugar) {
     *     Banana.super.constructor.call(this, 'Yellow', sugar);
     *     this.length = length;
     *   }
     * });
   *
   * var banana = new Banana(20, 40);
   * console.log('banana instanceof Fruit', banana instanceof Fruit);
   * console.log('Fruit is prototype of banana', Fruit.prototype.isPrototypeOf(banana));
   * console.log('bananas prototype is Fruit', Object.getPrototypeOf(banana) === Fruit.prototype);
   * console.log(banana.sugar);
   * console.log(banana.eat().sugar);
   * console.log(banana.color);
   */
  function extend(properties, superProtoOverride) {
    var superProto = superProtoOverride || this.prototype || Chartist.Class;
    var proto = Object.create(superProto);

    Chartist.Class.cloneDefinitions(proto, properties);

    var constr = function() {
      var fn = proto.constructor || function () {},
        instance;

      // If this is linked to the Chartist namespace the constructor was not called with new
      // To provide a fallback we will instantiate here and return the instance
      instance = this === Chartist ? Object.create(proto) : this;
      fn.apply(instance, Array.prototype.slice.call(arguments, 0));

      // If this constructor was not called with new we need to return the instance
      // This will not harm when the constructor has been called with new as the returned value is ignored
      return instance;
    };

    constr.prototype = proto;
    constr.super = superProto;
    constr.extend = this.extend;

    return constr;
  }

  // Variable argument list clones args > 0 into args[0] and retruns modified args[0]
  function cloneDefinitions() {
    var args = listToArray(arguments);
    var target = args[0];

    args.splice(1, args.length - 1).forEach(function (source) {
      Object.getOwnPropertyNames(source).forEach(function (propName) {
        // If this property already exist in target we delete it first
        delete target[propName];
        // Define the property with the descriptor from source
        Object.defineProperty(target, propName,
          Object.getOwnPropertyDescriptor(source, propName));
      });
    });

    return target;
  }

  Chartist.Class = {
    extend: extend,
    cloneDefinitions: cloneDefinitions
  };

}(window, document, Chartist));
;/**
 * Base for all chart types. The methods in Chartist.Base are inherited to all chart types.
 *
 * @module Chartist.Base
 */
/* global Chartist */
(function(window, document, Chartist) {
  'use strict';

  // TODO: Currently we need to re-draw the chart on window resize. This is usually very bad and will affect performance.
  // This is done because we can't work with relative coordinates when drawing the chart because SVG Path does not
  // work with relative positions yet. We need to check if we can do a viewBox hack to switch to percentage.
  // See http://mozilla.6506.n7.nabble.com/Specyfing-paths-with-percentages-unit-td247474.html
  // Update: can be done using the above method tested here: http://codepen.io/gionkunz/pen/KDvLj
  // The problem is with the label offsets that can't be converted into percentage and affecting the chart container
  /**
   * Updates the chart which currently does a full reconstruction of the SVG DOM
   *
   * @param {Object} [data] Optional data you'd like to set for the chart before it will update. If not specified the update method will use the data that is already configured with the chart.
   * @param {Object} [options] Optional options you'd like to add to the previous options for the chart before it will update. If not specified the update method will use the options that have been already configured with the chart.
   * @param {Boolean} [override] If set to true, the passed options will be used to extend the options that have been configured already. Otherwise the chart default options will be used as the base
   * @memberof Chartist.Base
   */
  function update(data, options, override) {
    if(data) {
      this.data = data;
      // Event for data transformation that allows to manipulate the data before it gets rendered in the charts
      this.eventEmitter.emit('data', {
        type: 'update',
        data: this.data
      });
    }

    if(options) {
      this.options = Chartist.extend({}, override ? this.options : this.defaultOptions, options);

      // If chartist was not initialized yet, we just set the options and leave the rest to the initialization
      // Otherwise we re-create the optionsProvider at this point
      if(!this.initializeTimeoutId) {
        this.optionsProvider.removeMediaQueryListeners();
        this.optionsProvider = Chartist.optionsProvider(this.options, this.responsiveOptions, this.eventEmitter);
      }
    }

    // Only re-created the chart if it has been initialized yet
    if(!this.initializeTimeoutId) {
      this.createChart(this.optionsProvider.getCurrentOptions());
    }

    // Return a reference to the chart object to chain up calls
    return this;
  }

  /**
   * This method can be called on the API object of each chart and will un-register all event listeners that were added to other components. This currently includes a window.resize listener as well as media query listeners if any responsive options have been provided. Use this function if you need to destroy and recreate Chartist charts dynamically.
   *
   * @memberof Chartist.Base
   */
  function detach() {
    // Only detach if initialization already occurred on this chart. If this chart still hasn't initialized (therefore
    // the initializationTimeoutId is still a valid timeout reference, we will clear the timeout
    if(!this.initializeTimeoutId) {
      window.removeEventListener('resize', this.resizeListener);
      this.optionsProvider.removeMediaQueryListeners();
    } else {
      window.clearTimeout(this.initializeTimeoutId);
    }

    return this;
  }

  /**
   * Use this function to register event handlers. The handler callbacks are synchronous and will run in the main thread rather than the event loop.
   *
   * @memberof Chartist.Base
   * @param {String} event Name of the event. Check the examples for supported events.
   * @param {Function} handler The handler function that will be called when an event with the given name was emitted. This function will receive a data argument which contains event data. See the example for more details.
   */
  function on(event, handler) {
    this.eventEmitter.addEventHandler(event, handler);
    return this;
  }

  /**
   * Use this function to un-register event handlers. If the handler function parameter is omitted all handlers for the given event will be un-registered.
   *
   * @memberof Chartist.Base
   * @param {String} event Name of the event for which a handler should be removed
   * @param {Function} [handler] The handler function that that was previously used to register a new event handler. This handler will be removed from the event handler list. If this parameter is omitted then all event handlers for the given event are removed from the list.
   */
  function off(event, handler) {
    this.eventEmitter.removeEventHandler(event, handler);
    return this;
  }

  function initialize() {
    // Add window resize listener that re-creates the chart
    window.addEventListener('resize', this.resizeListener);

    // Obtain current options based on matching media queries (if responsive options are given)
    // This will also register a listener that is re-creating the chart based on media changes
    this.optionsProvider = Chartist.optionsProvider(this.options, this.responsiveOptions, this.eventEmitter);
    // Register options change listener that will trigger a chart update
    this.eventEmitter.addEventHandler('optionsChanged', function() {
      this.update();
    }.bind(this));

    // Before the first chart creation we need to register us with all plugins that are configured
    // Initialize all relevant plugins with our chart object and the plugin options specified in the config
    if(this.options.plugins) {
      this.options.plugins.forEach(function(plugin) {
        if(plugin instanceof Array) {
          plugin[0](this, plugin[1]);
        } else {
          plugin(this);
        }
      }.bind(this));
    }

    // Event for data transformation that allows to manipulate the data before it gets rendered in the charts
    this.eventEmitter.emit('data', {
      type: 'initial',
      data: this.data
    });

    // Create the first chart
    this.createChart(this.optionsProvider.getCurrentOptions());

    // As chart is initialized from the event loop now we can reset our timeout reference
    // This is important if the chart gets initialized on the same element twice
    this.initializeTimeoutId = undefined;
  }

  /**
   * Constructor of chart base class.
   *
   * @param query
   * @param data
   * @param defaultOptions
   * @param options
   * @param responsiveOptions
   * @constructor
   */
  function Base(query, data, defaultOptions, options, responsiveOptions) {
    this.container = Chartist.querySelector(query);
    this.data = data;
    this.defaultOptions = defaultOptions;
    this.options = options;
    this.responsiveOptions = responsiveOptions;
    this.eventEmitter = Chartist.EventEmitter();
    this.supportsForeignObject = Chartist.Svg.isSupported('Extensibility');
    this.supportsAnimations = Chartist.Svg.isSupported('AnimationEventsAttribute');
    this.resizeListener = function resizeListener(){
      this.update();
    }.bind(this);

    if(this.container) {
      // If chartist was already initialized in this container we are detaching all event listeners first
      if(this.container.__chartist__) {
        this.container.__chartist__.detach();
      }

      this.container.__chartist__ = this;
    }

    // Using event loop for first draw to make it possible to register event listeners in the same call stack where
    // the chart was created.
    this.initializeTimeoutId = setTimeout(initialize.bind(this), 0);
  }

  // Creating the chart base class
  Chartist.Base = Chartist.Class.extend({
    constructor: Base,
    optionsProvider: undefined,
    container: undefined,
    svg: undefined,
    eventEmitter: undefined,
    createChart: function() {
      throw new Error('Base chart type can\'t be instantiated!');
    },
    update: update,
    detach: detach,
    on: on,
    off: off,
    version: Chartist.version,
    supportsForeignObject: false
  });

}(window, document, Chartist));
;/**
 * Chartist SVG module for simple SVG DOM abstraction
 *
 * @module Chartist.Svg
 */
/* global Chartist */
(function(window, document, Chartist) {
  'use strict';

  /**
   * Chartist.Svg creates a new SVG object wrapper with a starting element. You can use the wrapper to fluently create sub-elements and modify them.
   *
   * @memberof Chartist.Svg
   * @constructor
   * @param {String|Element} name The name of the SVG element to create or an SVG dom element which should be wrapped into Chartist.Svg
   * @param {Object} attributes An object with properties that will be added as attributes to the SVG element that is created. Attributes with undefined values will not be added.
   * @param {String} className This class or class list will be added to the SVG element
   * @param {Object} parent The parent SVG wrapper object where this newly created wrapper and it's element will be attached to as child
   * @param {Boolean} insertFirst If this param is set to true in conjunction with a parent element the newly created element will be added as first child element in the parent element
   */
  function Svg(name, attributes, className, parent, insertFirst) {
    // If Svg is getting called with an SVG element we just return the wrapper
    if(name instanceof Element) {
      this._node = name;
    } else {
      this._node = document.createElementNS(Chartist.namespaces.svg, name);

      // If this is an SVG element created then custom namespace
      if(name === 'svg') {
        this.attr({
          'xmlns:ct': Chartist.namespaces.ct
        });
      }
    }

    if(attributes) {
      this.attr(attributes);
    }

    if(className) {
      this.addClass(className);
    }

    if(parent) {
      if (insertFirst && parent._node.firstChild) {
        parent._node.insertBefore(this._node, parent._node.firstChild);
      } else {
        parent._node.appendChild(this._node);
      }
    }
  }

  /**
   * Set attributes on the current SVG element of the wrapper you're currently working on.
   *
   * @memberof Chartist.Svg
   * @param {Object|String} attributes An object with properties that will be added as attributes to the SVG element that is created. Attributes with undefined values will not be added. If this parameter is a String then the function is used as a getter and will return the attribute value.
   * @param {String} ns If specified, the attribute will be obtained using getAttributeNs. In order to write namepsaced attributes you can use the namespace:attribute notation within the attributes object.
   * @return {Object|String} The current wrapper object will be returned so it can be used for chaining or the attribute value if used as getter function.
   */
  function attr(attributes, ns) {
    if(typeof attributes === 'string') {
      if(ns) {
        return this._node.getAttributeNS(ns, attributes);
      } else {
        return this._node.getAttribute(attributes);
      }
    }

    Object.keys(attributes).forEach(function(key) {
      // If the attribute value is undefined we can skip this one
      if(attributes[key] === undefined) {
        return;
      }

      if (key.indexOf(':') !== -1) {
        var namespacedAttribute = key.split(':');
        this._node.setAttributeNS(Chartist.namespaces[namespacedAttribute[0]], key, attributes[key]);
      } else {
        this._node.setAttribute(key, attributes[key]);
      }
    }.bind(this));

    return this;
  }

  /**
   * Create a new SVG element whose wrapper object will be selected for further operations. This way you can also create nested groups easily.
   *
   * @memberof Chartist.Svg
   * @param {String} name The name of the SVG element that should be created as child element of the currently selected element wrapper
   * @param {Object} [attributes] An object with properties that will be added as attributes to the SVG element that is created. Attributes with undefined values will not be added.
   * @param {String} [className] This class or class list will be added to the SVG element
   * @param {Boolean} [insertFirst] If this param is set to true in conjunction with a parent element the newly created element will be added as first child element in the parent element
   * @return {Chartist.Svg} Returns a Chartist.Svg wrapper object that can be used to modify the containing SVG data
   */
  function elem(name, attributes, className, insertFirst) {
    return new Chartist.Svg(name, attributes, className, this, insertFirst);
  }

  /**
   * Returns the parent Chartist.SVG wrapper object
   *
   * @memberof Chartist.Svg
   * @return {Chartist.Svg} Returns a Chartist.Svg wrapper around the parent node of the current node. If the parent node is not existing or it's not an SVG node then this function will return null.
   */
  function parent() {
    return this._node.parentNode instanceof SVGElement ? new Chartist.Svg(this._node.parentNode) : null;
  }

  /**
   * This method returns a Chartist.Svg wrapper around the root SVG element of the current tree.
   *
   * @memberof Chartist.Svg
   * @return {Chartist.Svg} The root SVG element wrapped in a Chartist.Svg element
   */
  function root() {
    var node = this._node;
    while(node.nodeName !== 'svg') {
      node = node.parentNode;
    }
    return new Chartist.Svg(node);
  }

  /**
   * Find the first child SVG element of the current element that matches a CSS selector. The returned object is a Chartist.Svg wrapper.
   *
   * @memberof Chartist.Svg
   * @param {String} selector A CSS selector that is used to query for child SVG elements
   * @return {Chartist.Svg} The SVG wrapper for the element found or null if no element was found
   */
  function querySelector(selector) {
    var foundNode = this._node.querySelector(selector);
    return foundNode ? new Chartist.Svg(foundNode) : null;
  }

  /**
   * Find the all child SVG elements of the current element that match a CSS selector. The returned object is a Chartist.Svg.List wrapper.
   *
   * @memberof Chartist.Svg
   * @param {String} selector A CSS selector that is used to query for child SVG elements
   * @return {Chartist.Svg.List} The SVG wrapper list for the element found or null if no element was found
   */
  function querySelectorAll(selector) {
    var foundNodes = this._node.querySelectorAll(selector);
    return foundNodes.length ? new Chartist.Svg.List(foundNodes) : null;
  }

  /**
   * This method creates a foreignObject (see https://developer.mozilla.org/en-US/docs/Web/SVG/Element/foreignObject) that allows to embed HTML content into a SVG graphic. With the help of foreignObjects you can enable the usage of regular HTML elements inside of SVG where they are subject for SVG positioning and transformation but the Browser will use the HTML rendering capabilities for the containing DOM.
   *
   * @memberof Chartist.Svg
   * @param {Node|String} content The DOM Node, or HTML string that will be converted to a DOM Node, that is then placed into and wrapped by the foreignObject
   * @param {String} [attributes] An object with properties that will be added as attributes to the foreignObject element that is created. Attributes with undefined values will not be added.
   * @param {String} [className] This class or class list will be added to the SVG element
   * @param {Boolean} [insertFirst] Specifies if the foreignObject should be inserted as first child
   * @return {Chartist.Svg} New wrapper object that wraps the foreignObject element
   */
  function foreignObject(content, attributes, className, insertFirst) {
    // If content is string then we convert it to DOM
    // TODO: Handle case where content is not a string nor a DOM Node
    if(typeof content === 'string') {
      var container = document.createElement('div');
      container.innerHTML = content;
      content = container.firstChild;
    }

    // Adding namespace to content element
    content.setAttribute('xmlns', Chartist.namespaces.xmlns);

    // Creating the foreignObject without required extension attribute (as described here
    // http://www.w3.org/TR/SVG/extend.html#ForeignObjectElement)
    var fnObj = this.elem('foreignObject', attributes, className, insertFirst);

    // Add content to foreignObjectElement
    fnObj._node.appendChild(content);

    return fnObj;
  }

  /**
   * This method adds a new text element to the current Chartist.Svg wrapper.
   *
   * @memberof Chartist.Svg
   * @param {String} t The text that should be added to the text element that is created
   * @return {Chartist.Svg} The same wrapper object that was used to add the newly created element
   */
  function text(t) {
    this._node.appendChild(document.createTextNode(t));
    return this;
  }

  /**
   * This method will clear all child nodes of the current wrapper object.
   *
   * @memberof Chartist.Svg
   * @return {Chartist.Svg} The same wrapper object that got emptied
   */
  function empty() {
    while (this._node.firstChild) {
      this._node.removeChild(this._node.firstChild);
    }

    return this;
  }

  /**
   * This method will cause the current wrapper to remove itself from its parent wrapper. Use this method if you'd like to get rid of an element in a given DOM structure.
   *
   * @memberof Chartist.Svg
   * @return {Chartist.Svg} The parent wrapper object of the element that got removed
   */
  function remove() {
    this._node.parentNode.removeChild(this._node);
    return this.parent();
  }

  /**
   * This method will replace the element with a new element that can be created outside of the current DOM.
   *
   * @memberof Chartist.Svg
   * @param {Chartist.Svg} newElement The new Chartist.Svg object that will be used to replace the current wrapper object
   * @return {Chartist.Svg} The wrapper of the new element
   */
  function replace(newElement) {
    this._node.parentNode.replaceChild(newElement._node, this._node);
    return newElement;
  }

  /**
   * This method will append an element to the current element as a child.
   *
   * @memberof Chartist.Svg
   * @param {Chartist.Svg} element The Chartist.Svg element that should be added as a child
   * @param {Boolean} [insertFirst] Specifies if the element should be inserted as first child
   * @return {Chartist.Svg} The wrapper of the appended object
   */
  function append(element, insertFirst) {
    if(insertFirst && this._node.firstChild) {
      this._node.insertBefore(element._node, this._node.firstChild);
    } else {
      this._node.appendChild(element._node);
    }

    return this;
  }

  /**
   * Returns an array of class names that are attached to the current wrapper element. This method can not be chained further.
   *
   * @memberof Chartist.Svg
   * @return {Array} A list of classes or an empty array if there are no classes on the current element
   */
  function classes() {
    return this._node.getAttribute('class') ? this._node.getAttribute('class').trim().split(/\s+/) : [];
  }

  /**
   * Adds one or a space separated list of classes to the current element and ensures the classes are only existing once.
   *
   * @memberof Chartist.Svg
   * @param {String} names A white space separated list of class names
   * @return {Chartist.Svg} The wrapper of the current element
   */
  function addClass(names) {
    this._node.setAttribute('class',
      this.classes(this._node)
        .concat(names.trim().split(/\s+/))
        .filter(function(elem, pos, self) {
          return self.indexOf(elem) === pos;
        }).join(' ')
    );

    return this;
  }

  /**
   * Removes one or a space separated list of classes from the current element.
   *
   * @memberof Chartist.Svg
   * @param {String} names A white space separated list of class names
   * @return {Chartist.Svg} The wrapper of the current element
   */
  function removeClass(names) {
    var removedClasses = names.trim().split(/\s+/);

    this._node.setAttribute('class', this.classes(this._node).filter(function(name) {
      return removedClasses.indexOf(name) === -1;
    }).join(' '));

    return this;
  }

  /**
   * Removes all classes from the current element.
   *
   * @memberof Chartist.Svg
   * @return {Chartist.Svg} The wrapper of the current element
   */
  function removeAllClasses() {
    this._node.setAttribute('class', '');

    return this;
  }

  /**
   * Get element height using `getBoundingClientRect`
   *
   * @memberof Chartist.Svg
   * @return {Number} The elements height in pixels
   */
  function height() {
    return this._node.getBoundingClientRect().height;
  }

  /**
   * Get element width using `getBoundingClientRect`
   *
   * @memberof Chartist.Core
   * @return {Number} The elements width in pixels
   */
  function width() {
    return this._node.getBoundingClientRect().width;
  }

  /**
   * The animate function lets you animate the current element with SMIL animations. You can add animations for multiple attributes at the same time by using an animation definition object. This object should contain SMIL animation attributes. Please refer to http://www.w3.org/TR/SVG/animate.html for a detailed specification about the available animation attributes. Additionally an easing property can be passed in the animation definition object. This can be a string with a name of an easing function in `Chartist.Svg.Easing` or an array with four numbers specifying a cubic Bézier curve.
   * **An animations object could look like this:**
   * ```javascript
   * element.animate({
   *   opacity: {
   *     dur: 1000,
   *     from: 0,
   *     to: 1
   *   },
   *   x1: {
   *     dur: '1000ms',
   *     from: 100,
   *     to: 200,
   *     easing: 'easeOutQuart'
   *   },
   *   y1: {
   *     dur: '2s',
   *     from: 0,
   *     to: 100
   *   }
   * });
   * ```
   * **Automatic unit conversion**
   * For the `dur` and the `begin` animate attribute you can also omit a unit by passing a number. The number will automatically be converted to milli seconds.
   * **Guided mode**
   * The default behavior of SMIL animations with offset using the `begin` attribute is that the attribute will keep it's original value until the animation starts. Mostly this behavior is not desired as you'd like to have your element attributes already initialized with the animation `from` value even before the animation starts. Also if you don't specify `fill="freeze"` on an animate element or if you delete the animation after it's done (which is done in guided mode) the attribute will switch back to the initial value. This behavior is also not desired when performing simple one-time animations. For one-time animations you'd want to trigger animations immediately instead of relative to the document begin time. That's why in guided mode Chartist.Svg will also use the `begin` property to schedule a timeout and manually start the animation after the timeout. If you're using multiple SMIL definition objects for an attribute (in an array), guided mode will be disabled for this attribute, even if you explicitly enabled it.
   * If guided mode is enabled the following behavior is added:
   * - Before the animation starts (even when delayed with `begin`) the animated attribute will be set already to the `from` value of the animation
   * - `begin` is explicitly set to `indefinite` so it can be started manually without relying on document begin time (creation)
   * - The animate element will be forced to use `fill="freeze"`
   * - The animation will be triggered with `beginElement()` in a timeout where `begin` of the definition object is interpreted in milli seconds. If no `begin` was specified the timeout is triggered immediately.
   * - After the animation the element attribute value will be set to the `to` value of the animation
   * - The animate element is deleted from the DOM
   *
   * @memberof Chartist.Svg
   * @param {Object} animations An animations object where the property keys are the attributes you'd like to animate. The properties should be objects again that contain the SMIL animation attributes (usually begin, dur, from, and to). The property begin and dur is auto converted (see Automatic unit conversion). You can also schedule multiple animations for the same attribute by passing an Array of SMIL definition objects. Attributes that contain an array of SMIL definition objects will not be executed in guided mode.
   * @param {Boolean} guided Specify if guided mode should be activated for this animation (see Guided mode). If not otherwise specified, guided mode will be activated.
   * @param {Object} eventEmitter If specified, this event emitter will be notified when an animation starts or ends.
   * @return {Chartist.Svg} The current element where the animation was added
   */
  function animate(animations, guided, eventEmitter) {
    if(guided === undefined) {
      guided = true;
    }

    Object.keys(animations).forEach(function createAnimateForAttributes(attribute) {

      function createAnimate(animationDefinition, guided) {
        var attributeProperties = {},
          animate,
          timeout,
          easing;

        // Check if an easing is specified in the definition object and delete it from the object as it will not
        // be part of the animate element attributes.
        if(animationDefinition.easing) {
          // If already an easing Bézier curve array we take it or we lookup a easing array in the Easing object
          easing = animationDefinition.easing instanceof Array ?
            animationDefinition.easing :
            Chartist.Svg.Easing[animationDefinition.easing];
          delete animationDefinition.easing;
        }

        // If numeric dur or begin was provided we assume milli seconds
        animationDefinition.begin = Chartist.ensureUnit(animationDefinition.begin, 'ms');
        animationDefinition.dur = Chartist.ensureUnit(animationDefinition.dur, 'ms');

        if(easing) {
          animationDefinition.calcMode = 'spline';
          animationDefinition.keySplines = easing.join(' ');
          animationDefinition.keyTimes = '0;1';
        }

        // Adding "fill: freeze" if we are in guided mode and set initial attribute values
        if(guided) {
          animationDefinition.fill = 'freeze';
          // Animated property on our element should already be set to the animation from value in guided mode
          attributeProperties[attribute] = animationDefinition.from;
          this.attr(attributeProperties);

          // In guided mode we also set begin to indefinite so we can trigger the start manually and put the begin
          // which needs to be in ms aside
          timeout = Chartist.quantity(animationDefinition.begin || 0).value;
          animationDefinition.begin = 'indefinite';
        }

        animate = this.elem('animate', Chartist.extend({
          attributeName: attribute
        }, animationDefinition));

        if(guided) {
          // If guided we take the value that was put aside in timeout and trigger the animation manually with a timeout
          setTimeout(function() {
            // If beginElement fails we set the animated attribute to the end position and remove the animate element
            // This happens if the SMIL ElementTimeControl interface is not supported or any other problems occured in
            // the browser. (Currently FF 34 does not support animate elements in foreignObjects)
            try {
              animate._node.beginElement();
            } catch(err) {
              // Set animated attribute to current animated value
              attributeProperties[attribute] = animationDefinition.to;
              this.attr(attributeProperties);
              // Remove the animate element as it's no longer required
              animate.remove();
            }
          }.bind(this), timeout);
        }

        if(eventEmitter) {
          animate._node.addEventListener('beginEvent', function handleBeginEvent() {
            eventEmitter.emit('animationBegin', {
              element: this,
              animate: animate._node,
              params: animationDefinition
            });
          }.bind(this));
        }

        animate._node.addEventListener('endEvent', function handleEndEvent() {
          if(eventEmitter) {
            eventEmitter.emit('animationEnd', {
              element: this,
              animate: animate._node,
              params: animationDefinition
            });
          }

          if(guided) {
            // Set animated attribute to current animated value
            attributeProperties[attribute] = animationDefinition.to;
            this.attr(attributeProperties);
            // Remove the animate element as it's no longer required
            animate.remove();
          }
        }.bind(this));
      }

      // If current attribute is an array of definition objects we create an animate for each and disable guided mode
      if(animations[attribute] instanceof Array) {
        animations[attribute].forEach(function(animationDefinition) {
          createAnimate.bind(this)(animationDefinition, false);
        }.bind(this));
      } else {
        createAnimate.bind(this)(animations[attribute], guided);
      }

    }.bind(this));

    return this;
  }

  Chartist.Svg = Chartist.Class.extend({
    constructor: Svg,
    attr: attr,
    elem: elem,
    parent: parent,
    root: root,
    querySelector: querySelector,
    querySelectorAll: querySelectorAll,
    foreignObject: foreignObject,
    text: text,
    empty: empty,
    remove: remove,
    replace: replace,
    append: append,
    classes: classes,
    addClass: addClass,
    removeClass: removeClass,
    removeAllClasses: removeAllClasses,
    height: height,
    width: width,
    animate: animate
  });

  /**
   * This method checks for support of a given SVG feature like Extensibility, SVG-animation or the like. Check http://www.w3.org/TR/SVG11/feature for a detailed list.
   *
   * @memberof Chartist.Svg
   * @param {String} feature The SVG 1.1 feature that should be checked for support.
   * @return {Boolean} True of false if the feature is supported or not
   */
  Chartist.Svg.isSupported = function(feature) {
    return document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#' + feature, '1.1');
  };

  /**
   * This Object contains some standard easing cubic bezier curves. Then can be used with their name in the `Chartist.Svg.animate`. You can also extend the list and use your own name in the `animate` function. Click the show code button to see the available bezier functions.
   *
   * @memberof Chartist.Svg
   */
  var easingCubicBeziers = {
    easeInSine: [0.47, 0, 0.745, 0.715],
    easeOutSine: [0.39, 0.575, 0.565, 1],
    easeInOutSine: [0.445, 0.05, 0.55, 0.95],
    easeInQuad: [0.55, 0.085, 0.68, 0.53],
    easeOutQuad: [0.25, 0.46, 0.45, 0.94],
    easeInOutQuad: [0.455, 0.03, 0.515, 0.955],
    easeInCubic: [0.55, 0.055, 0.675, 0.19],
    easeOutCubic: [0.215, 0.61, 0.355, 1],
    easeInOutCubic: [0.645, 0.045, 0.355, 1],
    easeInQuart: [0.895, 0.03, 0.685, 0.22],
    easeOutQuart: [0.165, 0.84, 0.44, 1],
    easeInOutQuart: [0.77, 0, 0.175, 1],
    easeInQuint: [0.755, 0.05, 0.855, 0.06],
    easeOutQuint: [0.23, 1, 0.32, 1],
    easeInOutQuint: [0.86, 0, 0.07, 1],
    easeInExpo: [0.95, 0.05, 0.795, 0.035],
    easeOutExpo: [0.19, 1, 0.22, 1],
    easeInOutExpo: [1, 0, 0, 1],
    easeInCirc: [0.6, 0.04, 0.98, 0.335],
    easeOutCirc: [0.075, 0.82, 0.165, 1],
    easeInOutCirc: [0.785, 0.135, 0.15, 0.86],
    easeInBack: [0.6, -0.28, 0.735, 0.045],
    easeOutBack: [0.175, 0.885, 0.32, 1.275],
    easeInOutBack: [0.68, -0.55, 0.265, 1.55]
  };

  Chartist.Svg.Easing = easingCubicBeziers;

  /**
   * This helper class is to wrap multiple `Chartist.Svg` elements into a list where you can call the `Chartist.Svg` functions on all elements in the list with one call. This is helpful when you'd like to perform calls with `Chartist.Svg` on multiple elements.
   * An instance of this class is also returned by `Chartist.Svg.querySelectorAll`.
   *
   * @memberof Chartist.Svg
   * @param {Array<Node>|NodeList} nodeList An Array of SVG DOM nodes or a SVG DOM NodeList (as returned by document.querySelectorAll)
   * @constructor
   */
  function SvgList(nodeList) {
    var list = this;

    this.svgElements = [];
    for(var i = 0; i < nodeList.length; i++) {
      this.svgElements.push(new Chartist.Svg(nodeList[i]));
    }

    // Add delegation methods for Chartist.Svg
    Object.keys(Chartist.Svg.prototype).filter(function(prototypeProperty) {
      return ['constructor',
          'parent',
          'querySelector',
          'querySelectorAll',
          'replace',
          'append',
          'classes',
          'height',
          'width'].indexOf(prototypeProperty) === -1;
    }).forEach(function(prototypeProperty) {
      list[prototypeProperty] = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        list.svgElements.forEach(function(element) {
          Chartist.Svg.prototype[prototypeProperty].apply(element, args);
        });
        return list;
      };
    });
  }

  Chartist.Svg.List = Chartist.Class.extend({
    constructor: SvgList
  });
}(window, document, Chartist));
;/**
 * Chartist SVG path module for SVG path description creation and modification.
 *
 * @module Chartist.Svg.Path
 */
/* global Chartist */
(function(window, document, Chartist) {
  'use strict';

  /**
   * Contains the descriptors of supported element types in a SVG path. Currently only move, line and curve are supported.
   *
   * @memberof Chartist.Svg.Path
   * @type {Object}
   */
  var elementDescriptions = {
    m: ['x', 'y'],
    l: ['x', 'y'],
    c: ['x1', 'y1', 'x2', 'y2', 'x', 'y'],
    a: ['rx', 'ry', 'xAr', 'lAf', 'sf', 'x', 'y']
  };

  /**
   * Default options for newly created SVG path objects.
   *
   * @memberof Chartist.Svg.Path
   * @type {Object}
   */
  var defaultOptions = {
    // The accuracy in digit count after the decimal point. This will be used to round numbers in the SVG path. If this option is set to false then no rounding will be performed.
    accuracy: 3
  };

  function element(command, params, pathElements, pos, relative, data) {
    var pathElement = Chartist.extend({
      command: relative ? command.toLowerCase() : command.toUpperCase()
    }, params, data ? { data: data } : {} );

    pathElements.splice(pos, 0, pathElement);
  }

  function forEachParam(pathElements, cb) {
    pathElements.forEach(function(pathElement, pathElementIndex) {
      elementDescriptions[pathElement.command.toLowerCase()].forEach(function(paramName, paramIndex) {
        cb(pathElement, paramName, pathElementIndex, paramIndex, pathElements);
      });
    });
  }

  /**
   * Used to construct a new path object.
   *
   * @memberof Chartist.Svg.Path
   * @param {Boolean} close If set to true then this path will be closed when stringified (with a Z at the end)
   * @param {Object} options Options object that overrides the default objects. See default options for more details.
   * @constructor
   */
  function SvgPath(close, options) {
    this.pathElements = [];
    this.pos = 0;
    this.close = close;
    this.options = Chartist.extend({}, defaultOptions, options);
  }

  /**
   * Gets or sets the current position (cursor) inside of the path. You can move around the cursor freely but limited to 0 or the count of existing elements. All modifications with element functions will insert new elements at the position of this cursor.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} [pos] If a number is passed then the cursor is set to this position in the path element array.
   * @return {Chartist.Svg.Path|Number} If the position parameter was passed then the return value will be the path object for easy call chaining. If no position parameter was passed then the current position is returned.
   */
  function position(pos) {
    if(pos !== undefined) {
      this.pos = Math.max(0, Math.min(this.pathElements.length, pos));
      return this;
    } else {
      return this.pos;
    }
  }

  /**
   * Removes elements from the path starting at the current position.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} count Number of path elements that should be removed from the current position.
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function remove(count) {
    this.pathElements.splice(this.pos, count);
    return this;
  }

  /**
   * Use this function to add a new move SVG path element.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} x The x coordinate for the move element.
   * @param {Number} y The y coordinate for the move element.
   * @param {Boolean} [relative] If set to true the move element will be created with relative coordinates (lowercase letter)
   * @param {*} [data] Any data that should be stored with the element object that will be accessible in pathElement
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function move(x, y, relative, data) {
    element('M', {
      x: +x,
      y: +y
    }, this.pathElements, this.pos++, relative, data);
    return this;
  }

  /**
   * Use this function to add a new line SVG path element.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} x The x coordinate for the line element.
   * @param {Number} y The y coordinate for the line element.
   * @param {Boolean} [relative] If set to true the line element will be created with relative coordinates (lowercase letter)
   * @param {*} [data] Any data that should be stored with the element object that will be accessible in pathElement
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function line(x, y, relative, data) {
    element('L', {
      x: +x,
      y: +y
    }, this.pathElements, this.pos++, relative, data);
    return this;
  }

  /**
   * Use this function to add a new curve SVG path element.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} x1 The x coordinate for the first control point of the bezier curve.
   * @param {Number} y1 The y coordinate for the first control point of the bezier curve.
   * @param {Number} x2 The x coordinate for the second control point of the bezier curve.
   * @param {Number} y2 The y coordinate for the second control point of the bezier curve.
   * @param {Number} x The x coordinate for the target point of the curve element.
   * @param {Number} y The y coordinate for the target point of the curve element.
   * @param {Boolean} [relative] If set to true the curve element will be created with relative coordinates (lowercase letter)
   * @param {*} [data] Any data that should be stored with the element object that will be accessible in pathElement
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function curve(x1, y1, x2, y2, x, y, relative, data) {
    element('C', {
      x1: +x1,
      y1: +y1,
      x2: +x2,
      y2: +y2,
      x: +x,
      y: +y
    }, this.pathElements, this.pos++, relative, data);
    return this;
  }

  /**
   * Use this function to add a new non-bezier curve SVG path element.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} rx The radius to be used for the x-axis of the arc.
   * @param {Number} ry The radius to be used for the y-axis of the arc.
   * @param {Number} xAr Defines the orientation of the arc
   * @param {Number} lAf Large arc flag
   * @param {Number} sf Sweep flag
   * @param {Number} x The x coordinate for the target point of the curve element.
   * @param {Number} y The y coordinate for the target point of the curve element.
   * @param {Boolean} [relative] If set to true the curve element will be created with relative coordinates (lowercase letter)
   * @param {*} [data] Any data that should be stored with the element object that will be accessible in pathElement
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function arc(rx, ry, xAr, lAf, sf, x, y, relative, data) {
    element('A', {
      rx: +rx,
      ry: +ry,
      xAr: +xAr,
      lAf: +lAf,
      sf: +sf,
      x: +x,
      y: +y
    }, this.pathElements, this.pos++, relative, data);
    return this;
  }

  /**
   * Parses an SVG path seen in the d attribute of path elements, and inserts the parsed elements into the existing path object at the current cursor position. Any closing path indicators (Z at the end of the path) will be ignored by the parser as this is provided by the close option in the options of the path object.
   *
   * @memberof Chartist.Svg.Path
   * @param {String} path Any SVG path that contains move (m), line (l) or curve (c) components.
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function parse(path) {
    // Parsing the SVG path string into an array of arrays [['M', '10', '10'], ['L', '100', '100']]
    var chunks = path.replace(/([A-Za-z])([0-9])/g, '$1 $2')
      .replace(/([0-9])([A-Za-z])/g, '$1 $2')
      .split(/[\s,]+/)
      .reduce(function(result, element) {
        if(element.match(/[A-Za-z]/)) {
          result.push([]);
        }

        result[result.length - 1].push(element);
        return result;
      }, []);

    // If this is a closed path we remove the Z at the end because this is determined by the close option
    if(chunks[chunks.length - 1][0].toUpperCase() === 'Z') {
      chunks.pop();
    }

    // Using svgPathElementDescriptions to map raw path arrays into objects that contain the command and the parameters
    // For example {command: 'M', x: '10', y: '10'}
    var elements = chunks.map(function(chunk) {
        var command = chunk.shift(),
          description = elementDescriptions[command.toLowerCase()];

        return Chartist.extend({
          command: command
        }, description.reduce(function(result, paramName, index) {
          result[paramName] = +chunk[index];
          return result;
        }, {}));
      });

    // Preparing a splice call with the elements array as var arg params and insert the parsed elements at the current position
    var spliceArgs = [this.pos, 0];
    Array.prototype.push.apply(spliceArgs, elements);
    Array.prototype.splice.apply(this.pathElements, spliceArgs);
    // Increase the internal position by the element count
    this.pos += elements.length;

    return this;
  }

  /**
   * This function renders to current SVG path object into a final SVG string that can be used in the d attribute of SVG path elements. It uses the accuracy option to round big decimals. If the close parameter was set in the constructor of this path object then a path closing Z will be appended to the output string.
   *
   * @memberof Chartist.Svg.Path
   * @return {String}
   */
  function stringify() {
    var accuracyMultiplier = Math.pow(10, this.options.accuracy);

    return this.pathElements.reduce(function(path, pathElement) {
        var params = elementDescriptions[pathElement.command.toLowerCase()].map(function(paramName) {
          return this.options.accuracy ?
            (Math.round(pathElement[paramName] * accuracyMultiplier) / accuracyMultiplier) :
            pathElement[paramName];
        }.bind(this));

        return path + pathElement.command + params.join(',');
      }.bind(this), '') + (this.close ? 'Z' : '');
  }

  /**
   * Scales all elements in the current SVG path object. There is an individual parameter for each coordinate. Scaling will also be done for control points of curves, affecting the given coordinate.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} x The number which will be used to scale the x, x1 and x2 of all path elements.
   * @param {Number} y The number which will be used to scale the y, y1 and y2 of all path elements.
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function scale(x, y) {
    forEachParam(this.pathElements, function(pathElement, paramName) {
      pathElement[paramName] *= paramName[0] === 'x' ? x : y;
    });
    return this;
  }

  /**
   * Translates all elements in the current SVG path object. The translation is relative and there is an individual parameter for each coordinate. Translation will also be done for control points of curves, affecting the given coordinate.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} x The number which will be used to translate the x, x1 and x2 of all path elements.
   * @param {Number} y The number which will be used to translate the y, y1 and y2 of all path elements.
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function translate(x, y) {
    forEachParam(this.pathElements, function(pathElement, paramName) {
      pathElement[paramName] += paramName[0] === 'x' ? x : y;
    });
    return this;
  }

  /**
   * This function will run over all existing path elements and then loop over their attributes. The callback function will be called for every path element attribute that exists in the current path.
   * The method signature of the callback function looks like this:
   * ```javascript
   * function(pathElement, paramName, pathElementIndex, paramIndex, pathElements)
   * ```
   * If something else than undefined is returned by the callback function, this value will be used to replace the old value. This allows you to build custom transformations of path objects that can't be achieved using the basic transformation functions scale and translate.
   *
   * @memberof Chartist.Svg.Path
   * @param {Function} transformFnc The callback function for the transformation. Check the signature in the function description.
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function transform(transformFnc) {
    forEachParam(this.pathElements, function(pathElement, paramName, pathElementIndex, paramIndex, pathElements) {
      var transformed = transformFnc(pathElement, paramName, pathElementIndex, paramIndex, pathElements);
      if(transformed || transformed === 0) {
        pathElement[paramName] = transformed;
      }
    });
    return this;
  }

  /**
   * This function clones a whole path object with all its properties. This is a deep clone and path element objects will also be cloned.
   *
   * @memberof Chartist.Svg.Path
   * @param {Boolean} [close] Optional option to set the new cloned path to closed. If not specified or false, the original path close option will be used.
   * @return {Chartist.Svg.Path}
   */
  function clone(close) {
    var c = new Chartist.Svg.Path(close || this.close);
    c.pos = this.pos;
    c.pathElements = this.pathElements.slice().map(function cloneElements(pathElement) {
      return Chartist.extend({}, pathElement);
    });
    c.options = Chartist.extend({}, this.options);
    return c;
  }

  /**
   * Split a Svg.Path object by a specific command in the path chain. The path chain will be split and an array of newly created paths objects will be returned. This is useful if you'd like to split an SVG path by it's move commands, for example, in order to isolate chunks of drawings.
   *
   * @memberof Chartist.Svg.Path
   * @param {String} command The command you'd like to use to split the path
   * @return {Array<Chartist.Svg.Path>}
   */
  function splitByCommand(command) {
    var split = [
      new Chartist.Svg.Path()
    ];

    this.pathElements.forEach(function(pathElement) {
      if(pathElement.command === command.toUpperCase() && split[split.length - 1].pathElements.length !== 0) {
        split.push(new Chartist.Svg.Path());
      }

      split[split.length - 1].pathElements.push(pathElement);
    });

    return split;
  }

  /**
   * This static function on `Chartist.Svg.Path` is joining multiple paths together into one paths.
   *
   * @memberof Chartist.Svg.Path
   * @param {Array<Chartist.Svg.Path>} paths A list of paths to be joined together. The order is important.
   * @param {boolean} close If the newly created path should be a closed path
   * @param {Object} options Path options for the newly created path.
   * @return {Chartist.Svg.Path}
   */

  function join(paths, close, options) {
    var joinedPath = new Chartist.Svg.Path(close, options);
    for(var i = 0; i < paths.length; i++) {
      var path = paths[i];
      for(var j = 0; j < path.pathElements.length; j++) {
        joinedPath.pathElements.push(path.pathElements[j]);
      }
    }
    return joinedPath;
  }

  Chartist.Svg.Path = Chartist.Class.extend({
    constructor: SvgPath,
    position: position,
    remove: remove,
    move: move,
    line: line,
    curve: curve,
    arc: arc,
    scale: scale,
    translate: translate,
    transform: transform,
    parse: parse,
    stringify: stringify,
    clone: clone,
    splitByCommand: splitByCommand
  });

  Chartist.Svg.Path.elementDescriptions = elementDescriptions;
  Chartist.Svg.Path.join = join;
}(window, document, Chartist));
;/* global Chartist */
(function (window, document, Chartist) {
  'use strict';

  var axisUnits = {
    x: {
      pos: 'x',
      len: 'width',
      dir: 'horizontal',
      rectStart: 'x1',
      rectEnd: 'x2',
      rectOffset: 'y2'
    },
    y: {
      pos: 'y',
      len: 'height',
      dir: 'vertical',
      rectStart: 'y2',
      rectEnd: 'y1',
      rectOffset: 'x1'
    }
  };

  function Axis(units, chartRect, ticks, options) {
    this.units = units;
    this.counterUnits = units === axisUnits.x ? axisUnits.y : axisUnits.x;
    this.chartRect = chartRect;
    this.axisLength = chartRect[units.rectEnd] - chartRect[units.rectStart];
    this.gridOffset = chartRect[units.rectOffset];
    this.ticks = ticks;
    this.options = options;
  }

  function createGridAndLabels(gridGroup, labelGroup, useForeignObject, chartOptions, eventEmitter) {
    var axisOptions = chartOptions['axis' + this.units.pos.toUpperCase()];
    var projectedValues = this.ticks.map(this.projectValue.bind(this));
    var labelValues = this.ticks.map(axisOptions.labelInterpolationFnc);

    projectedValues.forEach(function(projectedValue, index) {
      var labelOffset = {
        x: 0,
        y: 0
      };

      // TODO: Find better solution for solving this problem
      // Calculate how much space we have available for the label
      var labelLength;
      if(projectedValues[index + 1]) {
        // If we still have one label ahead, we can calculate the distance to the next tick / label
        labelLength = projectedValues[index + 1] - projectedValue;
      } else {
        // If we don't have a label ahead and we have only two labels in total, we just take the remaining distance to
        // on the whole axis length. We limit that to a minimum of 30 pixel, so that labels close to the border will
        // still be visible inside of the chart padding.
        labelLength = Math.max(this.axisLength - projectedValue, 30);
      }

      // Skip grid lines and labels where interpolated label values are falsey (execpt for 0)
      if(Chartist.isFalseyButZero(labelValues[index]) && labelValues[index] !== '') {
        return;
      }

      // Transform to global coordinates using the chartRect
      // We also need to set the label offset for the createLabel function
      if(this.units.pos === 'x') {
        projectedValue = this.chartRect.x1 + projectedValue;
        labelOffset.x = chartOptions.axisX.labelOffset.x;

        // If the labels should be positioned in start position (top side for vertical axis) we need to set a
        // different offset as for positioned with end (bottom)
        if(chartOptions.axisX.position === 'start') {
          labelOffset.y = this.chartRect.padding.top + chartOptions.axisX.labelOffset.y + (useForeignObject ? 5 : 20);
        } else {
          labelOffset.y = this.chartRect.y1 + chartOptions.axisX.labelOffset.y + (useForeignObject ? 5 : 20);
        }
      } else {
        projectedValue = this.chartRect.y1 - projectedValue;
        labelOffset.y = chartOptions.axisY.labelOffset.y - (useForeignObject ? labelLength : 0);

        // If the labels should be positioned in start position (left side for horizontal axis) we need to set a
        // different offset as for positioned with end (right side)
        if(chartOptions.axisY.position === 'start') {
          labelOffset.x = useForeignObject ? this.chartRect.padding.left + chartOptions.axisY.labelOffset.x : this.chartRect.x1 - 10;
        } else {
          labelOffset.x = this.chartRect.x2 + chartOptions.axisY.labelOffset.x + 10;
        }
      }

      if(axisOptions.showGrid) {
        Chartist.createGrid(projectedValue, index, this, this.gridOffset, this.chartRect[this.counterUnits.len](), gridGroup, [
          chartOptions.classNames.grid,
          chartOptions.classNames[this.units.dir]
        ], eventEmitter);
      }

      if(axisOptions.showLabel) {
        Chartist.createLabel(projectedValue, labelLength, index, labelValues, this, axisOptions.offset, labelOffset, labelGroup, [
          chartOptions.classNames.label,
          chartOptions.classNames[this.units.dir],
          chartOptions.classNames[axisOptions.position]
        ], useForeignObject, eventEmitter);
      }
    }.bind(this));
  }

  Chartist.Axis = Chartist.Class.extend({
    constructor: Axis,
    createGridAndLabels: createGridAndLabels,
    projectValue: function(value, index, data) {
      throw new Error('Base axis can\'t be instantiated!');
    }
  });

  Chartist.Axis.units = axisUnits;

}(window, document, Chartist));
;/**
 * The auto scale axis uses standard linear scale projection of values along an axis. It uses order of magnitude to find a scale automatically and evaluates the available space in order to find the perfect amount of ticks for your chart.
 * **Options**
 * The following options are used by this axis in addition to the default axis options outlined in the axis configuration of the chart default settings.
 * ```javascript
 * var options = {
 *   // If high is specified then the axis will display values explicitly up to this value and the computed maximum from the data is ignored
 *   high: 100,
 *   // If low is specified then the axis will display values explicitly down to this value and the computed minimum from the data is ignored
 *   low: 0,
 *   // This option will be used when finding the right scale division settings. The amount of ticks on the scale will be determined so that as many ticks as possible will be displayed, while not violating this minimum required space (in pixel).
 *   scaleMinSpace: 20,
 *   // Can be set to true or false. If set to true, the scale will be generated with whole numbers only.
 *   onlyInteger: true,
 *   // The reference value can be used to make sure that this value will always be on the chart. This is especially useful on bipolar charts where the bipolar center always needs to be part of the chart.
 *   referenceValue: 5
 * };
 * ```
 *
 * @module Chartist.AutoScaleAxis
 */
/* global Chartist */
(function (window, document, Chartist) {
  'use strict';

  function AutoScaleAxis(axisUnit, data, chartRect, options) {
    // Usually we calculate highLow based on the data but this can be overriden by a highLow object in the options
    var highLow = options.highLow || Chartist.getHighLow(data.normalized, options, axisUnit.pos);
    this.bounds = Chartist.getBounds(chartRect[axisUnit.rectEnd] - chartRect[axisUnit.rectStart], highLow, options.scaleMinSpace || 20, options.onlyInteger);
    this.range = {
      min: this.bounds.min,
      max: this.bounds.max
    };

    Chartist.AutoScaleAxis.super.constructor.call(this,
      axisUnit,
      chartRect,
      this.bounds.values,
      options);
  }

  function projectValue(value) {
    return this.axisLength * (+Chartist.getMultiValue(value, this.units.pos) - this.bounds.min) / this.bounds.range;
  }

  Chartist.AutoScaleAxis = Chartist.Axis.extend({
    constructor: AutoScaleAxis,
    projectValue: projectValue
  });

}(window, document, Chartist));
;/**
 * The fixed scale axis uses standard linear projection of values along an axis. It makes use of a divisor option to divide the range provided from the minimum and maximum value or the options high and low that will override the computed minimum and maximum.
 * **Options**
 * The following options are used by this axis in addition to the default axis options outlined in the axis configuration of the chart default settings.
 * ```javascript
 * var options = {
 *   // If high is specified then the axis will display values explicitly up to this value and the computed maximum from the data is ignored
 *   high: 100,
 *   // If low is specified then the axis will display values explicitly down to this value and the computed minimum from the data is ignored
 *   low: 0,
 *   // If specified then the value range determined from minimum to maximum (or low and high) will be divided by this number and ticks will be generated at those division points. The default divisor is 1.
 *   divisor: 4,
 *   // If ticks is explicitly set, then the axis will not compute the ticks with the divisor, but directly use the data in ticks to determine at what points on the axis a tick need to be generated.
 *   ticks: [1, 10, 20, 30]
 * };
 * ```
 *
 * @module Chartist.FixedScaleAxis
 */
/* global Chartist */
(function (window, document, Chartist) {
  'use strict';

  function FixedScaleAxis(axisUnit, data, chartRect, options) {
    var highLow = options.highLow || Chartist.getHighLow(data.normalized, options, axisUnit.pos);
    this.divisor = options.divisor || 1;
    this.ticks = options.ticks || Chartist.times(this.divisor).map(function(value, index) {
      return highLow.low + (highLow.high - highLow.low) / this.divisor * index;
    }.bind(this));
    this.ticks.sort(function(a, b) {
      return a - b;
    });
    this.range = {
      min: highLow.low,
      max: highLow.high
    };

    Chartist.FixedScaleAxis.super.constructor.call(this,
      axisUnit,
      chartRect,
      this.ticks,
      options);

    this.stepLength = this.axisLength / this.divisor;
  }

  function projectValue(value) {
    return this.axisLength * (+Chartist.getMultiValue(value, this.units.pos) - this.range.min) / (this.range.max - this.range.min);
  }

  Chartist.FixedScaleAxis = Chartist.Axis.extend({
    constructor: FixedScaleAxis,
    projectValue: projectValue
  });

}(window, document, Chartist));
;/**
 * The step axis for step based charts like bar chart or step based line charts. It uses a fixed amount of ticks that will be equally distributed across the whole axis length. The projection is done using the index of the data value rather than the value itself and therefore it's only useful for distribution purpose.
 * **Options**
 * The following options are used by this axis in addition to the default axis options outlined in the axis configuration of the chart default settings.
 * ```javascript
 * var options = {
 *   // Ticks to be used to distribute across the axis length. As this axis type relies on the index of the value rather than the value, arbitrary data that can be converted to a string can be used as ticks.
 *   ticks: ['One', 'Two', 'Three'],
 *   // If set to true the full width will be used to distribute the values where the last value will be at the maximum of the axis length. If false the spaces between the ticks will be evenly distributed instead.
 *   stretch: true
 * };
 * ```
 *
 * @module Chartist.StepAxis
 */
/* global Chartist */
(function (window, document, Chartist) {
  'use strict';

  function StepAxis(axisUnit, data, chartRect, options) {
    Chartist.StepAxis.super.constructor.call(this,
      axisUnit,
      chartRect,
      options.ticks,
      options);

    this.stepLength = this.axisLength / (options.ticks.length - (options.stretch ? 1 : 0));
  }

  function projectValue(value, index) {
    return this.stepLength * index;
  }

  Chartist.StepAxis = Chartist.Axis.extend({
    constructor: StepAxis,
    projectValue: projectValue
  });

}(window, document, Chartist));
;/**
 * The Chartist line chart can be used to draw Line or Scatter charts. If used in the browser you can access the global `Chartist` namespace where you find the `Line` function as a main entry point.
 *
 * For examples on how to use the line chart please check the examples of the `Chartist.Line` method.
 *
 * @module Chartist.Line
 */
/* global Chartist */
(function(window, document, Chartist){
  'use strict';

  /**
   * Default options in line charts. Expand the code view to see a detailed list of options with comments.
   *
   * @memberof Chartist.Line
   */
  var defaultOptions = {
    // Options for X-Axis
    axisX: {
      // The offset of the labels to the chart area
      offset: 30,
      // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
      position: 'end',
      // Allows you to correct label positioning on this axis by positive or negative x and y offset.
      labelOffset: {
        x: 0,
        y: 0
      },
      // If labels should be shown or not
      showLabel: true,
      // If the axis grid should be drawn or not
      showGrid: true,
      // Interpolation function that allows you to intercept the value from the axis label
      labelInterpolationFnc: Chartist.noop,
      // Set the axis type to be used to project values on this axis. If not defined, Chartist.StepAxis will be used for the X-Axis, where the ticks option will be set to the labels in the data and the stretch option will be set to the global fullWidth option. This type can be changed to any axis constructor available (e.g. Chartist.FixedScaleAxis), where all axis options should be present here.
      type: undefined
    },
    // Options for Y-Axis
    axisY: {
      // The offset of the labels to the chart area
      offset: 40,
      // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
      position: 'start',
      // Allows you to correct label positioning on this axis by positive or negative x and y offset.
      labelOffset: {
        x: 0,
        y: 0
      },
      // If labels should be shown or not
      showLabel: true,
      // If the axis grid should be drawn or not
      showGrid: true,
      // Interpolation function that allows you to intercept the value from the axis label
      labelInterpolationFnc: Chartist.noop,
      // Set the axis type to be used to project values on this axis. If not defined, Chartist.AutoScaleAxis will be used for the Y-Axis, where the high and low options will be set to the global high and low options. This type can be changed to any axis constructor available (e.g. Chartist.FixedScaleAxis), where all axis options should be present here.
      type: undefined,
      // This value specifies the minimum height in pixel of the scale steps
      scaleMinSpace: 20,
      // Use only integer values (whole numbers) for the scale steps
      onlyInteger: false
    },
    // Specify a fixed width for the chart as a string (i.e. '100px' or '50%')
    width: undefined,
    // Specify a fixed height for the chart as a string (i.e. '100px' or '50%')
    height: undefined,
    // If the line should be drawn or not
    showLine: true,
    // If dots should be drawn or not
    showPoint: true,
    // If the line chart should draw an area
    showArea: false,
    // The base for the area chart that will be used to close the area shape (is normally 0)
    areaBase: 0,
    // Specify if the lines should be smoothed. This value can be true or false where true will result in smoothing using the default smoothing interpolation function Chartist.Interpolation.cardinal and false results in Chartist.Interpolation.none. You can also choose other smoothing / interpolation functions available in the Chartist.Interpolation module, or write your own interpolation function. Check the examples for a brief description.
    lineSmooth: true,
    // Overriding the natural low of the chart allows you to zoom in or limit the charts lowest displayed value
    low: undefined,
    // Overriding the natural high of the chart allows you to zoom in or limit the charts highest displayed value
    high: undefined,
    // Padding of the chart drawing area to the container element and labels as a number or padding object {top: 5, right: 5, bottom: 5, left: 5}
    chartPadding: {
      top: 15,
      right: 15,
      bottom: 5,
      left: 10
    },
    // When set to true, the last grid line on the x-axis is not drawn and the chart elements will expand to the full available width of the chart. For the last label to be drawn correctly you might need to add chart padding or offset the last label with a draw event handler.
    fullWidth: false,
    // If true the whole data is reversed including labels, the series order as well as the whole series data arrays.
    reverseData: false,
    // Override the class names that get used to generate the SVG structure of the chart
    classNames: {
      chart: 'ct-chart-line',
      label: 'ct-label',
      labelGroup: 'ct-labels',
      series: 'ct-series',
      line: 'ct-line',
      point: 'ct-point',
      area: 'ct-area',
      grid: 'ct-grid',
      gridGroup: 'ct-grids',
      vertical: 'ct-vertical',
      horizontal: 'ct-horizontal',
      start: 'ct-start',
      end: 'ct-end'
    }
  };

  /**
   * Creates a new chart
   *
   */
  function createChart(options) {
    this.data = Chartist.normalizeData(this.data);
    var data = {
      raw: this.data,
      normalized: Chartist.getDataArray(this.data, options.reverseData, true)
    };

    // Create new svg object
    this.svg = Chartist.createSvg(this.container, options.width, options.height, options.classNames.chart);
    // Create groups for labels, grid and series
    var gridGroup = this.svg.elem('g').addClass(options.classNames.gridGroup);
    var seriesGroup = this.svg.elem('g');
    var labelGroup = this.svg.elem('g').addClass(options.classNames.labelGroup);

    var chartRect = Chartist.createChartRect(this.svg, options, defaultOptions.padding);
    var axisX, axisY;

    if(options.axisX.type === undefined) {
      axisX = new Chartist.StepAxis(Chartist.Axis.units.x, data, chartRect, Chartist.extend({}, options.axisX, {
        ticks: data.raw.labels,
        stretch: options.fullWidth
      }));
    } else {
      axisX = options.axisX.type.call(Chartist, Chartist.Axis.units.x, data, chartRect, options.axisX);
    }

    if(options.axisY.type === undefined) {
      axisY = new Chartist.AutoScaleAxis(Chartist.Axis.units.y, data, chartRect, Chartist.extend({}, options.axisY, {
        high: Chartist.isNum(options.high) ? options.high : options.axisY.high,
        low: Chartist.isNum(options.low) ? options.low : options.axisY.low
      }));
    } else {
      axisY = options.axisY.type.call(Chartist, Chartist.Axis.units.y, data, chartRect, options.axisY);
    }

    axisX.createGridAndLabels(gridGroup, labelGroup, this.supportsForeignObject, options, this.eventEmitter);
    axisY.createGridAndLabels(gridGroup, labelGroup, this.supportsForeignObject, options, this.eventEmitter);

    // Draw the series
    data.raw.series.forEach(function(series, seriesIndex) {
      var seriesElement = seriesGroup.elem('g');

      // Write attributes to series group element. If series name or meta is undefined the attributes will not be written
      seriesElement.attr({
        'ct:series-name': series.name,
        'ct:meta': Chartist.serialize(series.meta)
      });

      // Use series class from series data or if not set generate one
      seriesElement.addClass([
        options.classNames.series,
        (series.className || options.classNames.series + '-' + Chartist.alphaNumerate(seriesIndex))
      ].join(' '));

      var pathCoordinates = [],
        pathData = [];

      data.normalized[seriesIndex].forEach(function(value, valueIndex) {
        var p = {
          x: chartRect.x1 + axisX.projectValue(value, valueIndex, data.normalized[seriesIndex]),
          y: chartRect.y1 - axisY.projectValue(value, valueIndex, data.normalized[seriesIndex])
        };
        pathCoordinates.push(p.x, p.y);
        pathData.push({
          value: value,
          valueIndex: valueIndex,
          meta: Chartist.getMetaData(series, valueIndex)
        });
      }.bind(this));

      var seriesOptions = {
        lineSmooth: Chartist.getSeriesOption(series, options, 'lineSmooth'),
        showPoint: Chartist.getSeriesOption(series, options, 'showPoint'),
        showLine: Chartist.getSeriesOption(series, options, 'showLine'),
        showArea: Chartist.getSeriesOption(series, options, 'showArea'),
        areaBase: Chartist.getSeriesOption(series, options, 'areaBase')
      };

      var smoothing = typeof seriesOptions.lineSmooth === 'function' ?
        seriesOptions.lineSmooth : (seriesOptions.lineSmooth ? Chartist.Interpolation.monotoneCubic() : Chartist.Interpolation.none());
      // Interpolating path where pathData will be used to annotate each path element so we can trace back the original
      // index, value and meta data
      var path = smoothing(pathCoordinates, pathData);

      // If we should show points we need to create them now to avoid secondary loop
      // Points are drawn from the pathElements returned by the interpolation function
      // Small offset for Firefox to render squares correctly
      if (seriesOptions.showPoint) {

        path.pathElements.forEach(function(pathElement) {
          var point = seriesElement.elem('line', {
            x1: pathElement.x,
            y1: pathElement.y,
            x2: pathElement.x + 0.01,
            y2: pathElement.y
          }, options.classNames.point).attr({
            'ct:value': [pathElement.data.value.x, pathElement.data.value.y].filter(Chartist.isNum).join(','),
            'ct:meta': pathElement.data.meta
          });

          this.eventEmitter.emit('draw', {
            type: 'point',
            value: pathElement.data.value,
            index: pathElement.data.valueIndex,
            meta: pathElement.data.meta,
            series: series,
            seriesIndex: seriesIndex,
            axisX: axisX,
            axisY: axisY,
            group: seriesElement,
            element: point,
            x: pathElement.x,
            y: pathElement.y
          });
        }.bind(this));
      }

      if(seriesOptions.showLine) {
        var line = seriesElement.elem('path', {
          d: path.stringify()
        }, options.classNames.line, true);

        this.eventEmitter.emit('draw', {
          type: 'line',
          values: data.normalized[seriesIndex],
          path: path.clone(),
          chartRect: chartRect,
          index: seriesIndex,
          series: series,
          seriesIndex: seriesIndex,
          axisX: axisX,
          axisY: axisY,
          group: seriesElement,
          element: line
        });
      }

      // Area currently only works with axes that support a range!
      if(seriesOptions.showArea && axisY.range) {
        // If areaBase is outside the chart area (< min or > max) we need to set it respectively so that
        // the area is not drawn outside the chart area.
        var areaBase = Math.max(Math.min(seriesOptions.areaBase, axisY.range.max), axisY.range.min);

        // We project the areaBase value into screen coordinates
        var areaBaseProjected = chartRect.y1 - axisY.projectValue(areaBase);

        // In order to form the area we'll first split the path by move commands so we can chunk it up into segments
        path.splitByCommand('M').filter(function onlySolidSegments(pathSegment) {
          // We filter only "solid" segments that contain more than one point. Otherwise there's no need for an area
          return pathSegment.pathElements.length > 1;
        }).map(function convertToArea(solidPathSegments) {
          // Receiving the filtered solid path segments we can now convert those segments into fill areas
          var firstElement = solidPathSegments.pathElements[0];
          var lastElement = solidPathSegments.pathElements[solidPathSegments.pathElements.length - 1];

          // Cloning the solid path segment with closing option and removing the first move command from the clone
          // We then insert a new move that should start at the area base and draw a straight line up or down
          // at the end of the path we add an additional straight line to the projected area base value
          // As the closing option is set our path will be automatically closed
          return solidPathSegments.clone(true)
            .position(0)
            .remove(1)
            .move(firstElement.x, areaBaseProjected)
            .line(firstElement.x, firstElement.y)
            .position(solidPathSegments.pathElements.length + 1)
            .line(lastElement.x, areaBaseProjected);

        }).forEach(function createArea(areaPath) {
          // For each of our newly created area paths, we'll now create path elements by stringifying our path objects
          // and adding the created DOM elements to the correct series group
          var area = seriesElement.elem('path', {
            d: areaPath.stringify()
          }, options.classNames.area, true);

          // Emit an event for each area that was drawn
          this.eventEmitter.emit('draw', {
            type: 'area',
            values: data.normalized[seriesIndex],
            path: areaPath.clone(),
            series: series,
            seriesIndex: seriesIndex,
            axisX: axisX,
            axisY: axisY,
            chartRect: chartRect,
            index: seriesIndex,
            group: seriesElement,
            element: area
          });
        }.bind(this));
      }
    }.bind(this));

    this.eventEmitter.emit('created', {
      bounds: axisY.bounds,
      chartRect: chartRect,
      axisX: axisX,
      axisY: axisY,
      svg: this.svg,
      options: options
    });
  }

  /**
   * This method creates a new line chart.
   *
   * @memberof Chartist.Line
   * @param {String|Node} query A selector query string or directly a DOM element
   * @param {Object} data The data object that needs to consist of a labels and a series array
   * @param {Object} [options] The options object with options that override the default options. Check the examples for a detailed list.
   * @param {Array} [responsiveOptions] Specify an array of responsive option arrays which are a media query and options object pair => [[mediaQueryString, optionsObject],[more...]]
   * @return {Object} An object which exposes the API for the created chart
   *
   * @example
   * // Create a simple line chart
   * var data = {
   *   // A labels array that can contain any sort of values
   *   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
   *   // Our series array that contains series objects or in this case series data arrays
   *   series: [
   *     [5, 2, 4, 2, 0]
   *   ]
   * };
   *
   * // As options we currently only set a static size of 300x200 px
   * var options = {
   *   width: '300px',
   *   height: '200px'
   * };
   *
   * // In the global name space Chartist we call the Line function to initialize a line chart. As a first parameter we pass in a selector where we would like to get our chart created. Second parameter is the actual data object and as a third parameter we pass in our options
   * new Chartist.Line('.ct-chart', data, options);
   *
   * @example
   * // Use specific interpolation function with configuration from the Chartist.Interpolation module
   *
   * var chart = new Chartist.Line('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5],
   *   series: [
   *     [1, 1, 8, 1, 7]
   *   ]
   * }, {
   *   lineSmooth: Chartist.Interpolation.cardinal({
   *     tension: 0.2
   *   })
   * });
   *
   * @example
   * // Create a line chart with responsive options
   *
   * var data = {
   *   // A labels array that can contain any sort of values
   *   labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
   *   // Our series array that contains series objects or in this case series data arrays
   *   series: [
   *     [5, 2, 4, 2, 0]
   *   ]
   * };
   *
   * // In addition to the regular options we specify responsive option overrides that will override the default configutation based on the matching media queries.
   * var responsiveOptions = [
   *   ['screen and (min-width: 641px) and (max-width: 1024px)', {
   *     showPoint: false,
   *     axisX: {
   *       labelInterpolationFnc: function(value) {
   *         // Will return Mon, Tue, Wed etc. on medium screens
   *         return value.slice(0, 3);
   *       }
   *     }
   *   }],
   *   ['screen and (max-width: 640px)', {
   *     showLine: false,
   *     axisX: {
   *       labelInterpolationFnc: function(value) {
   *         // Will return M, T, W etc. on small screens
   *         return value[0];
   *       }
   *     }
   *   }]
   * ];
   *
   * new Chartist.Line('.ct-chart', data, null, responsiveOptions);
   *
   */
  function Line(query, data, options, responsiveOptions) {
    Chartist.Line.super.constructor.call(this,
      query,
      data,
      defaultOptions,
      Chartist.extend({}, defaultOptions, options),
      responsiveOptions);
  }

  // Creating line chart type in Chartist namespace
  Chartist.Line = Chartist.Base.extend({
    constructor: Line,
    createChart: createChart
  });

}(window, document, Chartist));
;/**
 * The bar chart module of Chartist that can be used to draw unipolar or bipolar bar and grouped bar charts.
 *
 * @module Chartist.Bar
 */
/* global Chartist */
(function(window, document, Chartist){
  'use strict';

  /**
   * Default options in bar charts. Expand the code view to see a detailed list of options with comments.
   *
   * @memberof Chartist.Bar
   */
  var defaultOptions = {
    // Options for X-Axis
    axisX: {
      // The offset of the chart drawing area to the border of the container
      offset: 30,
      // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
      position: 'end',
      // Allows you to correct label positioning on this axis by positive or negative x and y offset.
      labelOffset: {
        x: 0,
        y: 0
      },
      // If labels should be shown or not
      showLabel: true,
      // If the axis grid should be drawn or not
      showGrid: true,
      // Interpolation function that allows you to intercept the value from the axis label
      labelInterpolationFnc: Chartist.noop,
      // This value specifies the minimum width in pixel of the scale steps
      scaleMinSpace: 30,
      // Use only integer values (whole numbers) for the scale steps
      onlyInteger: false
    },
    // Options for Y-Axis
    axisY: {
      // The offset of the chart drawing area to the border of the container
      offset: 40,
      // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
      position: 'start',
      // Allows you to correct label positioning on this axis by positive or negative x and y offset.
      labelOffset: {
        x: 0,
        y: 0
      },
      // If labels should be shown or not
      showLabel: true,
      // If the axis grid should be drawn or not
      showGrid: true,
      // Interpolation function that allows you to intercept the value from the axis label
      labelInterpolationFnc: Chartist.noop,
      // This value specifies the minimum height in pixel of the scale steps
      scaleMinSpace: 20,
      // Use only integer values (whole numbers) for the scale steps
      onlyInteger: false
    },
    // Specify a fixed width for the chart as a string (i.e. '100px' or '50%')
    width: undefined,
    // Specify a fixed height for the chart as a string (i.e. '100px' or '50%')
    height: undefined,
    // Overriding the natural high of the chart allows you to zoom in or limit the charts highest displayed value
    high: undefined,
    // Overriding the natural low of the chart allows you to zoom in or limit the charts lowest displayed value
    low: undefined,
    // Padding of the chart drawing area to the container element and labels as a number or padding object {top: 5, right: 5, bottom: 5, left: 5}
    chartPadding: {
      top: 15,
      right: 15,
      bottom: 5,
      left: 10
    },
    // Specify the distance in pixel of bars in a group
    seriesBarDistance: 15,
    // If set to true this property will cause the series bars to be stacked. Check the `stackMode` option for further stacking options.
    stackBars: false,
    // If set to 'overlap' this property will force the stacked bars to draw from the zero line.
    // If set to 'accumulate' this property will form a total for each series point. This will also influence the y-axis and the overall bounds of the chart. In stacked mode the seriesBarDistance property will have no effect.
    stackMode: 'accumulate',
    // Inverts the axes of the bar chart in order to draw a horizontal bar chart. Be aware that you also need to invert your axis settings as the Y Axis will now display the labels and the X Axis the values.
    horizontalBars: false,
    // If set to true then each bar will represent a series and the data array is expected to be a one dimensional array of data values rather than a series array of series. This is useful if the bar chart should represent a profile rather than some data over time.
    distributeSeries: false,
    // If true the whole data is reversed including labels, the series order as well as the whole series data arrays.
    reverseData: false,
    // Override the class names that get used to generate the SVG structure of the chart
    classNames: {
      chart: 'ct-chart-bar',
      horizontalBars: 'ct-horizontal-bars',
      label: 'ct-label',
      labelGroup: 'ct-labels',
      series: 'ct-series',
      bar: 'ct-bar',
      grid: 'ct-grid',
      gridGroup: 'ct-grids',
      vertical: 'ct-vertical',
      horizontal: 'ct-horizontal',
      start: 'ct-start',
      end: 'ct-end'
    }
  };

  /**
   * Creates a new chart
   *
   */
  function createChart(options) {
    this.data = Chartist.normalizeData(this.data);
    var data = {
      raw: this.data,
      normalized: options.distributeSeries ? Chartist.getDataArray(this.data, options.reverseData, options.horizontalBars ? 'x' : 'y').map(function(value) {
        return [value];
      }) : Chartist.getDataArray(this.data, options.reverseData, options.horizontalBars ? 'x' : 'y')
    };

    var highLow;

    // Create new svg element
    this.svg = Chartist.createSvg(
      this.container,
      options.width,
      options.height,
      options.classNames.chart + (options.horizontalBars ? ' ' + options.classNames.horizontalBars : '')
    );

    // Drawing groups in correct order
    var gridGroup = this.svg.elem('g').addClass(options.classNames.gridGroup);
    var seriesGroup = this.svg.elem('g');
    var labelGroup = this.svg.elem('g').addClass(options.classNames.labelGroup);

    if(options.stackBars && data.normalized.length !== 0) {
      // If stacked bars we need to calculate the high low from stacked values from each series
      var serialSums = Chartist.serialMap(data.normalized, function serialSums() {
        return Array.prototype.slice.call(arguments).map(function(value) {
          return value;
        }).reduce(function(prev, curr) {
          return {
            x: prev.x + (curr && curr.x) || 0,
            y: prev.y + (curr && curr.y) || 0
          };
        }, {x: 0, y: 0});
      });

      highLow = Chartist.getHighLow([serialSums], Chartist.extend({}, options, {
        referenceValue: 0
      }), options.horizontalBars ? 'x' : 'y');
    } else {
      highLow = Chartist.getHighLow(data.normalized, Chartist.extend({}, options, {
        referenceValue: 0
      }), options.horizontalBars ? 'x' : 'y');
    }
    // Overrides of high / low from settings
    highLow.high = +options.high || (options.high === 0 ? 0 : highLow.high);
    highLow.low = +options.low || (options.low === 0 ? 0 : highLow.low);

    var chartRect = Chartist.createChartRect(this.svg, options, defaultOptions.padding);

    var valueAxis,
      labelAxisTicks,
      labelAxis,
      axisX,
      axisY;

    // We need to set step count based on some options combinations
    if(options.distributeSeries && options.stackBars) {
      // If distributed series are enabled and bars need to be stacked, we'll only have one bar and therefore should
      // use only the first label for the step axis
      labelAxisTicks = data.raw.labels.slice(0, 1);
    } else {
      // If distributed series are enabled but stacked bars aren't, we should use the series labels
      // If we are drawing a regular bar chart with two dimensional series data, we just use the labels array
      // as the bars are normalized
      labelAxisTicks = data.raw.labels;
    }

    // Set labelAxis and valueAxis based on the horizontalBars setting. This setting will flip the axes if necessary.
    if(options.horizontalBars) {
      if(options.axisX.type === undefined) {
        valueAxis = axisX = new Chartist.AutoScaleAxis(Chartist.Axis.units.x, data, chartRect, Chartist.extend({}, options.axisX, {
          highLow: highLow,
          referenceValue: 0
        }));
      } else {
        valueAxis = axisX = options.axisX.type.call(Chartist, Chartist.Axis.units.x, data, chartRect, Chartist.extend({}, options.axisX, {
          highLow: highLow,
          referenceValue: 0
        }));
      }

      if(options.axisY.type === undefined) {
        labelAxis = axisY = new Chartist.StepAxis(Chartist.Axis.units.y, data, chartRect, {
          ticks: labelAxisTicks
        });
      } else {
        labelAxis = axisY = options.axisY.type.call(Chartist, Chartist.Axis.units.y, data, chartRect, options.axisY);
      }
    } else {
      if(options.axisX.type === undefined) {
        labelAxis = axisX = new Chartist.StepAxis(Chartist.Axis.units.x, data, chartRect, {
          ticks: labelAxisTicks
        });
      } else {
        labelAxis = axisX = options.axisX.type.call(Chartist, Chartist.Axis.units.x, data, chartRect, options.axisX);
      }

      if(options.axisY.type === undefined) {
        valueAxis = axisY = new Chartist.AutoScaleAxis(Chartist.Axis.units.y, data, chartRect, Chartist.extend({}, options.axisY, {
          highLow: highLow,
          referenceValue: 0
        }));
      } else {
        valueAxis = axisY = options.axisY.type.call(Chartist, Chartist.Axis.units.y, data, chartRect, Chartist.extend({}, options.axisY, {
          highLow: highLow,
          referenceValue: 0
        }));
      }
    }

    // Projected 0 point
    var zeroPoint = options.horizontalBars ? (chartRect.x1 + valueAxis.projectValue(0)) : (chartRect.y1 - valueAxis.projectValue(0));
    // Used to track the screen coordinates of stacked bars
    var stackedBarValues = [];

    labelAxis.createGridAndLabels(gridGroup, labelGroup, this.supportsForeignObject, options, this.eventEmitter);
    valueAxis.createGridAndLabels(gridGroup, labelGroup, this.supportsForeignObject, options, this.eventEmitter);

    // Draw the series
    data.raw.series.forEach(function(series, seriesIndex) {
      // Calculating bi-polar value of index for seriesOffset. For i = 0..4 biPol will be -1.5, -0.5, 0.5, 1.5 etc.
      var biPol = seriesIndex - (data.raw.series.length - 1) / 2;
      // Half of the period width between vertical grid lines used to position bars
      var periodHalfLength;
      // Current series SVG element
      var seriesElement;

      // We need to set periodHalfLength based on some options combinations
      if(options.distributeSeries && !options.stackBars) {
        // If distributed series are enabled but stacked bars aren't, we need to use the length of the normaizedData array
        // which is the series count and divide by 2
        periodHalfLength = labelAxis.axisLength / data.normalized.length / 2;
      } else if(options.distributeSeries && options.stackBars) {
        // If distributed series and stacked bars are enabled we'll only get one bar so we should just divide the axis
        // length by 2
        periodHalfLength = labelAxis.axisLength / 2;
      } else {
        // On regular bar charts we should just use the series length
        periodHalfLength = labelAxis.axisLength / data.normalized[seriesIndex].length / 2;
      }

      // Adding the series group to the series element
      seriesElement = seriesGroup.elem('g');

      // Write attributes to series group element. If series name or meta is undefined the attributes will not be written
      seriesElement.attr({
        'ct:series-name': series.name,
        'ct:meta': Chartist.serialize(series.meta)
      });

      // Use series class from series data or if not set generate one
      seriesElement.addClass([
        options.classNames.series,
        (series.className || options.classNames.series + '-' + Chartist.alphaNumerate(seriesIndex))
      ].join(' '));

      data.normalized[seriesIndex].forEach(function(value, valueIndex) {
        var projected,
          bar,
          previousStack,
          labelAxisValueIndex;

        // We need to set labelAxisValueIndex based on some options combinations
        if(options.distributeSeries && !options.stackBars) {
          // If distributed series are enabled but stacked bars aren't, we can use the seriesIndex for later projection
          // on the step axis for label positioning
          labelAxisValueIndex = seriesIndex;
        } else if(options.distributeSeries && options.stackBars) {
          // If distributed series and stacked bars are enabled, we will only get one bar and therefore always use
          // 0 for projection on the label step axis
          labelAxisValueIndex = 0;
        } else {
          // On regular bar charts we just use the value index to project on the label step axis
          labelAxisValueIndex = valueIndex;
        }

        // We need to transform coordinates differently based on the chart layout
        if(options.horizontalBars) {
          projected = {
            x: chartRect.x1 + valueAxis.projectValue(value && value.x ? value.x : 0, valueIndex, data.normalized[seriesIndex]),
            y: chartRect.y1 - labelAxis.projectValue(value && value.y ? value.y : 0, labelAxisValueIndex, data.normalized[seriesIndex])
          };
        } else {
          projected = {
            x: chartRect.x1 + labelAxis.projectValue(value && value.x ? value.x : 0, labelAxisValueIndex, data.normalized[seriesIndex]),
            y: chartRect.y1 - valueAxis.projectValue(value && value.y ? value.y : 0, valueIndex, data.normalized[seriesIndex])
          }
        }

        // If the label axis is a step based axis we will offset the bar into the middle of between two steps using
        // the periodHalfLength value. Also we do arrange the different series so that they align up to each other using
        // the seriesBarDistance. If we don't have a step axis, the bar positions can be chosen freely so we should not
        // add any automated positioning.
        if(labelAxis instanceof Chartist.StepAxis) {
          // Offset to center bar between grid lines, but only if the step axis is not stretched
          if(!labelAxis.options.stretch) {
            projected[labelAxis.units.pos] += periodHalfLength * (options.horizontalBars ? -1 : 1);
          }
          // Using bi-polar offset for multiple series if no stacked bars or series distribution is used
          projected[labelAxis.units.pos] += (options.stackBars || options.distributeSeries) ? 0 : biPol * options.seriesBarDistance * (options.horizontalBars ? -1 : 1);
        }

        // Enter value in stacked bar values used to remember previous screen value for stacking up bars
        previousStack = stackedBarValues[valueIndex] || zeroPoint;
        stackedBarValues[valueIndex] = previousStack - (zeroPoint - projected[labelAxis.counterUnits.pos]);

        // Skip if value is undefined
        if(value === undefined) {
          return;
        }

        var positions = {};
        positions[labelAxis.units.pos + '1'] = projected[labelAxis.units.pos];
        positions[labelAxis.units.pos + '2'] = projected[labelAxis.units.pos];

        if(options.stackBars && (options.stackMode === 'accumulate' || !options.stackMode)) {
          // Stack mode: accumulate (default)
          // If bars are stacked we use the stackedBarValues reference and otherwise base all bars off the zero line
          // We want backwards compatibility, so the expected fallback without the 'stackMode' option
          // to be the original behaviour (accumulate)
          positions[labelAxis.counterUnits.pos + '1'] = previousStack;
          positions[labelAxis.counterUnits.pos + '2'] = stackedBarValues[valueIndex];
        } else {
          // Draw from the zero line normally
          // This is also the same code for Stack mode: overlap
          positions[labelAxis.counterUnits.pos + '1'] = zeroPoint;
          positions[labelAxis.counterUnits.pos + '2'] = projected[labelAxis.counterUnits.pos];
        }

        // Limit x and y so that they are within the chart rect
        positions.x1 = Math.min(Math.max(positions.x1, chartRect.x1), chartRect.x2);
        positions.x2 = Math.min(Math.max(positions.x2, chartRect.x1), chartRect.x2);
        positions.y1 = Math.min(Math.max(positions.y1, chartRect.y2), chartRect.y1);
        positions.y2 = Math.min(Math.max(positions.y2, chartRect.y2), chartRect.y1);

        // Create bar element
        bar = seriesElement.elem('line', positions, options.classNames.bar).attr({
          'ct:value': [value.x, value.y].filter(Chartist.isNum).join(','),
          'ct:meta': Chartist.getMetaData(series, valueIndex)
        });

        this.eventEmitter.emit('draw', Chartist.extend({
          type: 'bar',
          value: value,
          index: valueIndex,
          meta: Chartist.getMetaData(series, valueIndex),
          series: series,
          seriesIndex: seriesIndex,
          axisX: axisX,
          axisY: axisY,
          chartRect: chartRect,
          group: seriesElement,
          element: bar
        }, positions));
      }.bind(this));
    }.bind(this));

    this.eventEmitter.emit('created', {
      bounds: valueAxis.bounds,
      chartRect: chartRect,
      axisX: axisX,
      axisY: axisY,
      svg: this.svg,
      options: options
    });
  }

  /**
   * This method creates a new bar chart and returns API object that you can use for later changes.
   *
   * @memberof Chartist.Bar
   * @param {String|Node} query A selector query string or directly a DOM element
   * @param {Object} data The data object that needs to consist of a labels and a series array
   * @param {Object} [options] The options object with options that override the default options. Check the examples for a detailed list.
   * @param {Array} [responsiveOptions] Specify an array of responsive option arrays which are a media query and options object pair => [[mediaQueryString, optionsObject],[more...]]
   * @return {Object} An object which exposes the API for the created chart
   *
   * @example
   * // Create a simple bar chart
   * var data = {
   *   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
   *   series: [
   *     [5, 2, 4, 2, 0]
   *   ]
   * };
   *
   * // In the global name space Chartist we call the Bar function to initialize a bar chart. As a first parameter we pass in a selector where we would like to get our chart created and as a second parameter we pass our data object.
   * new Chartist.Bar('.ct-chart', data);
   *
   * @example
   * // This example creates a bipolar grouped bar chart where the boundaries are limitted to -10 and 10
   * new Chartist.Bar('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5, 6, 7],
   *   series: [
   *     [1, 3, 2, -5, -3, 1, -6],
   *     [-5, -2, -4, -1, 2, -3, 1]
   *   ]
   * }, {
   *   seriesBarDistance: 12,
   *   low: -10,
   *   high: 10
   * });
   *
   */
  function Bar(query, data, options, responsiveOptions) {
    Chartist.Bar.super.constructor.call(this,
      query,
      data,
      defaultOptions,
      Chartist.extend({}, defaultOptions, options),
      responsiveOptions);
  }

  // Creating bar chart type in Chartist namespace
  Chartist.Bar = Chartist.Base.extend({
    constructor: Bar,
    createChart: createChart
  });

}(window, document, Chartist));
;/**
 * The pie chart module of Chartist that can be used to draw pie, donut or gauge charts
 *
 * @module Chartist.Pie
 */
/* global Chartist */
(function(window, document, Chartist) {
  'use strict';

  /**
   * Default options in line charts. Expand the code view to see a detailed list of options with comments.
   *
   * @memberof Chartist.Pie
   */
  var defaultOptions = {
    // Specify a fixed width for the chart as a string (i.e. '100px' or '50%')
    width: undefined,
    // Specify a fixed height for the chart as a string (i.e. '100px' or '50%')
    height: undefined,
    // Padding of the chart drawing area to the container element and labels as a number or padding object {top: 5, right: 5, bottom: 5, left: 5}
    chartPadding: 5,
    // Override the class names that are used to generate the SVG structure of the chart
    classNames: {
      chartPie: 'ct-chart-pie',
      chartDonut: 'ct-chart-donut',
      series: 'ct-series',
      slicePie: 'ct-slice-pie',
      sliceDonut: 'ct-slice-donut',
      label: 'ct-label'
    },
    // The start angle of the pie chart in degrees where 0 points north. A higher value offsets the start angle clockwise.
    startAngle: 0,
    // An optional total you can specify. By specifying a total value, the sum of the values in the series must be this total in order to draw a full pie. You can use this parameter to draw only parts of a pie or gauge charts.
    total: undefined,
    // If specified the donut CSS classes will be used and strokes will be drawn instead of pie slices.
    donut: false,
    // Specify the donut stroke width, currently done in javascript for convenience. May move to CSS styles in the future.
    // This option can be set as number or string to specify a relative width (i.e. 100 or '30%').
    donutWidth: 60,
    // If a label should be shown or not
    showLabel: true,
    // Label position offset from the standard position which is half distance of the radius. This value can be either positive or negative. Positive values will position the label away from the center.
    labelOffset: 0,
    // This option can be set to 'inside', 'outside' or 'center'. Positioned with 'inside' the labels will be placed on half the distance of the radius to the border of the Pie by respecting the 'labelOffset'. The 'outside' option will place the labels at the border of the pie and 'center' will place the labels in the absolute center point of the chart. The 'center' option only makes sense in conjunction with the 'labelOffset' option.
    labelPosition: 'inside',
    // An interpolation function for the label value
    labelInterpolationFnc: Chartist.noop,
    // Label direction can be 'neutral', 'explode' or 'implode'. The labels anchor will be positioned based on those settings as well as the fact if the labels are on the right or left side of the center of the chart. Usually explode is useful when labels are positioned far away from the center.
    labelDirection: 'neutral',
    // If true the whole data is reversed including labels, the series order as well as the whole series data arrays.
    reverseData: false,
    // If true empty values will be ignored to avoid drawing unncessary slices and labels
    ignoreEmptyValues: false
  };

  /**
   * Determines SVG anchor position based on direction and center parameter
   *
   * @param center
   * @param label
   * @param direction
   * @return {string}
   */
  function determineAnchorPosition(center, label, direction) {
    var toTheRight = label.x > center.x;

    if(toTheRight && direction === 'explode' ||
      !toTheRight && direction === 'implode') {
      return 'start';
    } else if(toTheRight && direction === 'implode' ||
      !toTheRight && direction === 'explode') {
      return 'end';
    } else {
      return 'middle';
    }
  }

  /**
   * Creates the pie chart
   *
   * @param options
   */
  function createChart(options) {
    this.data = Chartist.normalizeData(this.data);
    var seriesGroups = [],
      labelsGroup,
      chartRect,
      radius,
      labelRadius,
      totalDataSum,
      startAngle = options.startAngle,
      dataArray = Chartist.getDataArray(this.data, options.reverseData);

    // Create SVG.js draw
    this.svg = Chartist.createSvg(this.container, options.width, options.height,options.donut ? options.classNames.chartDonut : options.classNames.chartPie);
    // Calculate charting rect
    chartRect = Chartist.createChartRect(this.svg, options, defaultOptions.padding);
    // Get biggest circle radius possible within chartRect
    radius = Math.min(chartRect.width() / 2, chartRect.height() / 2);
    // Calculate total of all series to get reference value or use total reference from optional options
    totalDataSum = options.total || dataArray.reduce(function(previousValue, currentValue) {
      return previousValue + currentValue;
    }, 0);

    var donutWidth = Chartist.quantity(options.donutWidth);
    if (donutWidth.unit === '%') {
      donutWidth.value *= radius / 100;
    }

    // If this is a donut chart we need to adjust our radius to enable strokes to be drawn inside
    // Unfortunately this is not possible with the current SVG Spec
    // See this proposal for more details: http://lists.w3.org/Archives/Public/www-svg/2003Oct/0000.html
    radius -= options.donut ? donutWidth.value / 2  : 0;

    // If labelPosition is set to `outside` or a donut chart is drawn then the label position is at the radius,
    // if regular pie chart it's half of the radius
    if(options.labelPosition === 'outside' || options.donut) {
      labelRadius = radius;
    } else if(options.labelPosition === 'center') {
      // If labelPosition is center we start with 0 and will later wait for the labelOffset
      labelRadius = 0;
    } else {
      // Default option is 'inside' where we use half the radius so the label will be placed in the center of the pie
      // slice
      labelRadius = radius / 2;
    }
    // Add the offset to the labelRadius where a negative offset means closed to the center of the chart
    labelRadius += options.labelOffset;

    // Calculate end angle based on total sum and current data value and offset with padding
    var center = {
      x: chartRect.x1 + chartRect.width() / 2,
      y: chartRect.y2 + chartRect.height() / 2
    };

    // Check if there is only one non-zero value in the series array.
    var hasSingleValInSeries = this.data.series.filter(function(val) {
      return val.hasOwnProperty('value') ? val.value !== 0 : val !== 0;
    }).length === 1;

    //if we need to show labels we create the label group now
    if(options.showLabel) {
      labelsGroup = this.svg.elem('g', null, null, true);
    }

    // Draw the series
    // initialize series groups
    for (var i = 0; i < this.data.series.length; i++) {
      // If current value is zero and we are ignoring empty values then skip to next value
      if (dataArray[i] === 0 && options.ignoreEmptyValues) continue;

      var series = this.data.series[i];
      seriesGroups[i] = this.svg.elem('g', null, null, true);

      // If the series is an object and contains a name or meta data we add a custom attribute
      seriesGroups[i].attr({
        'ct:series-name': series.name
      });

      // Use series class from series data or if not set generate one
      seriesGroups[i].addClass([
        options.classNames.series,
        (series.className || options.classNames.series + '-' + Chartist.alphaNumerate(i))
      ].join(' '));

      var endAngle = startAngle + dataArray[i] / totalDataSum * 360;

      // Use slight offset so there are no transparent hairline issues
      var overlappigStartAngle = Math.max(0, startAngle - (i === 0 || hasSingleValInSeries ? 0 : 0.2));

      // If we need to draw the arc for all 360 degrees we need to add a hack where we close the circle
      // with Z and use 359.99 degrees
      if(endAngle - overlappigStartAngle >= 359.99) {
        endAngle = overlappigStartAngle + 359.99;
      }

      var start = Chartist.polarToCartesian(center.x, center.y, radius, overlappigStartAngle),
        end = Chartist.polarToCartesian(center.x, center.y, radius, endAngle);

      // Create a new path element for the pie chart. If this isn't a donut chart we should close the path for a correct stroke
      var path = new Chartist.Svg.Path(!options.donut)
        .move(end.x, end.y)
        .arc(radius, radius, 0, endAngle - startAngle > 180, 0, start.x, start.y);

      // If regular pie chart (no donut) we add a line to the center of the circle for completing the pie
      if(!options.donut) {
        path.line(center.x, center.y);
      }

      // Create the SVG path
      // If this is a donut chart we add the donut class, otherwise just a regular slice
      var pathElement = seriesGroups[i].elem('path', {
        d: path.stringify()
      }, options.donut ? options.classNames.sliceDonut : options.classNames.slicePie);

      // Adding the pie series value to the path
      pathElement.attr({
        'ct:value': dataArray[i],
        'ct:meta': Chartist.serialize(series.meta)
      });

      // If this is a donut, we add the stroke-width as style attribute
      if(options.donut) {
        pathElement.attr({
          'style': 'stroke-width: ' + donutWidth.value + 'px'
        });
      }

      // Fire off draw event
      this.eventEmitter.emit('draw', {
        type: 'slice',
        value: dataArray[i],
        totalDataSum: totalDataSum,
        index: i,
        meta: series.meta,
        series: series,
        group: seriesGroups[i],
        element: pathElement,
        path: path.clone(),
        center: center,
        radius: radius,
        startAngle: startAngle,
        endAngle: endAngle
      });

      // If we need to show labels we need to add the label for this slice now
      if(options.showLabel) {
        // Position at the labelRadius distance from center and between start and end angle
        var labelPosition = Chartist.polarToCartesian(center.x, center.y, labelRadius, startAngle + (endAngle - startAngle) / 2),
          interpolatedValue = options.labelInterpolationFnc(this.data.labels && !Chartist.isFalseyButZero(this.data.labels[i]) ? this.data.labels[i] : dataArray[i], i);

        if(interpolatedValue || interpolatedValue === 0) {
          var labelElement = labelsGroup.elem('text', {
            dx: labelPosition.x,
            dy: labelPosition.y,
            'text-anchor': determineAnchorPosition(center, labelPosition, options.labelDirection)
          }, options.classNames.label).text('' + interpolatedValue);

          // Fire off draw event
          this.eventEmitter.emit('draw', {
            type: 'label',
            index: i,
            group: labelsGroup,
            element: labelElement,
            text: '' + interpolatedValue,
            x: labelPosition.x,
            y: labelPosition.y
          });
        }
      }

      // Set next startAngle to current endAngle.
      // (except for last slice)
      startAngle = endAngle;
    }

    this.eventEmitter.emit('created', {
      chartRect: chartRect,
      svg: this.svg,
      options: options
    });
  }

  /**
   * This method creates a new pie chart and returns an object that can be used to redraw the chart.
   *
   * @memberof Chartist.Pie
   * @param {String|Node} query A selector query string or directly a DOM element
   * @param {Object} data The data object in the pie chart needs to have a series property with a one dimensional data array. The values will be normalized against each other and don't necessarily need to be in percentage. The series property can also be an array of value objects that contain a value property and a className property to override the CSS class name for the series group.
   * @param {Object} [options] The options object with options that override the default options. Check the examples for a detailed list.
   * @param {Array} [responsiveOptions] Specify an array of responsive option arrays which are a media query and options object pair => [[mediaQueryString, optionsObject],[more...]]
   * @return {Object} An object with a version and an update method to manually redraw the chart
   *
   * @example
   * // Simple pie chart example with four series
   * new Chartist.Pie('.ct-chart', {
   *   series: [10, 2, 4, 3]
   * });
   *
   * @example
   * // Drawing a donut chart
   * new Chartist.Pie('.ct-chart', {
   *   series: [10, 2, 4, 3]
   * }, {
   *   donut: true
   * });
   *
   * @example
   * // Using donut, startAngle and total to draw a gauge chart
   * new Chartist.Pie('.ct-chart', {
   *   series: [20, 10, 30, 40]
   * }, {
   *   donut: true,
   *   donutWidth: 20,
   *   startAngle: 270,
   *   total: 200
   * });
   *
   * @example
   * // Drawing a pie chart with padding and labels that are outside the pie
   * new Chartist.Pie('.ct-chart', {
   *   series: [20, 10, 30, 40]
   * }, {
   *   chartPadding: 30,
   *   labelOffset: 50,
   *   labelDirection: 'explode'
   * });
   *
   * @example
   * // Overriding the class names for individual series as well as a name and meta data.
   * // The name will be written as ct:series-name attribute and the meta data will be serialized and written
   * // to a ct:meta attribute.
   * new Chartist.Pie('.ct-chart', {
   *   series: [{
   *     value: 20,
   *     name: 'Series 1',
   *     className: 'my-custom-class-one',
   *     meta: 'Meta One'
   *   }, {
   *     value: 10,
   *     name: 'Series 2',
   *     className: 'my-custom-class-two',
   *     meta: 'Meta Two'
   *   }, {
   *     value: 70,
   *     name: 'Series 3',
   *     className: 'my-custom-class-three',
   *     meta: 'Meta Three'
   *   }]
   * });
   */
  function Pie(query, data, options, responsiveOptions) {
    Chartist.Pie.super.constructor.call(this,
      query,
      data,
      defaultOptions,
      Chartist.extend({}, defaultOptions, options),
      responsiveOptions);
  }

  // Creating pie chart type in Chartist namespace
  Chartist.Pie = Chartist.Base.extend({
    constructor: Pie,
    createChart: createChart,
    determineAnchorPosition: determineAnchorPosition
  });

}(window, document, Chartist));

return Chartist;

}));

},{}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],4:[function(require,module,exports){
/**
 * vue-resource v0.7.2
 * https://github.com/vuejs/vue-resource
 * Released under the MIT License.
 */

module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Install plugin.
	 */

	function plugin(Vue) {

	    if (plugin.installed) {
	        return;
	    }

	    var _ = __webpack_require__(1);

	    _.config = Vue.config;
	    _.warning = Vue.util.warn;
	    _.nextTick = Vue.util.nextTick;

	    Vue.url = __webpack_require__(2);
	    Vue.http = __webpack_require__(8);
	    Vue.resource = __webpack_require__(23);
	    Vue.Promise = __webpack_require__(10);

	    Object.defineProperties(Vue.prototype, {

	        $url: {
	            get: function get() {
	                return _.options(Vue.url, this, this.$options.url);
	            }
	        },

	        $http: {
	            get: function get() {
	                return _.options(Vue.http, this, this.$options.http);
	            }
	        },

	        $resource: {
	            get: function get() {
	                return Vue.resource.bind(this);
	            }
	        },

	        $promise: {
	            get: function get() {
	                var _this = this;

	                return function (executor) {
	                    return new Vue.Promise(executor, _this);
	                };
	            }
	        }

	    });
	}

	if (typeof window !== 'undefined' && window.Vue) {
	    window.Vue.use(plugin);
	}

	module.exports = plugin;

/***/ },
/* 1 */
/***/ function(module, exports) {

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * Utility functions.
	 */

	var _ = exports,
	    array = [],
	    console = window.console;

	_.warn = function (msg) {
	    if (console && _.warning && (!_.config.silent || _.config.debug)) {
	        console.warn('[VueResource warn]: ' + msg);
	    }
	};

	_.error = function (msg) {
	    if (console) {
	        console.error(msg);
	    }
	};

	_.trim = function (str) {
	    return str.replace(/^\s*|\s*$/g, '');
	};

	_.toLower = function (str) {
	    return str ? str.toLowerCase() : '';
	};

	_.isArray = Array.isArray;

	_.isString = function (val) {
	    return typeof val === 'string';
	};

	_.isFunction = function (val) {
	    return typeof val === 'function';
	};

	_.isObject = function (obj) {
	    return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
	};

	_.isPlainObject = function (obj) {
	    return _.isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype;
	};

	_.options = function (fn, obj, options) {

	    options = options || {};

	    if (_.isFunction(options)) {
	        options = options.call(obj);
	    }

	    return _.merge(fn.bind({ $vm: obj, $options: options }), fn, { $options: options });
	};

	_.each = function (obj, iterator) {

	    var i, key;

	    if (typeof obj.length == 'number') {
	        for (i = 0; i < obj.length; i++) {
	            iterator.call(obj[i], obj[i], i);
	        }
	    } else if (_.isObject(obj)) {
	        for (key in obj) {
	            if (obj.hasOwnProperty(key)) {
	                iterator.call(obj[key], obj[key], key);
	            }
	        }
	    }

	    return obj;
	};

	_.defaults = function (target, source) {

	    for (var key in source) {
	        if (target[key] === undefined) {
	            target[key] = source[key];
	        }
	    }

	    return target;
	};

	_.extend = function (target) {

	    var args = array.slice.call(arguments, 1);

	    args.forEach(function (arg) {
	        merge(target, arg);
	    });

	    return target;
	};

	_.merge = function (target) {

	    var args = array.slice.call(arguments, 1);

	    args.forEach(function (arg) {
	        merge(target, arg, true);
	    });

	    return target;
	};

	function merge(target, source, deep) {
	    for (var key in source) {
	        if (deep && (_.isPlainObject(source[key]) || _.isArray(source[key]))) {
	            if (_.isPlainObject(source[key]) && !_.isPlainObject(target[key])) {
	                target[key] = {};
	            }
	            if (_.isArray(source[key]) && !_.isArray(target[key])) {
	                target[key] = [];
	            }
	            merge(target[key], source[key], deep);
	        } else if (source[key] !== undefined) {
	            target[key] = source[key];
	        }
	    }
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Service for URL templating.
	 */

	var _ = __webpack_require__(1);
	var ie = document.documentMode;
	var el = document.createElement('a');

	function Url(url, params) {

	    var options = url,
	        transform;

	    if (_.isString(url)) {
	        options = { url: url, params: params };
	    }

	    options = _.merge({}, Url.options, this.$options, options);

	    Url.transforms.forEach(function (handler) {
	        transform = factory(handler, transform, this.$vm);
	    }, this);

	    return transform(options);
	};

	/**
	 * Url options.
	 */

	Url.options = {
	    url: '',
	    root: null,
	    params: {}
	};

	/**
	 * Url transforms.
	 */

	Url.transforms = [__webpack_require__(3), __webpack_require__(5), __webpack_require__(6), __webpack_require__(7)];

	/**
	 * Encodes a Url parameter string.
	 *
	 * @param {Object} obj
	 */

	Url.params = function (obj) {

	    var params = [],
	        escape = encodeURIComponent;

	    params.add = function (key, value) {

	        if (_.isFunction(value)) {
	            value = value();
	        }

	        if (value === null) {
	            value = '';
	        }

	        this.push(escape(key) + '=' + escape(value));
	    };

	    serialize(params, obj);

	    return params.join('&').replace(/%20/g, '+');
	};

	/**
	 * Parse a URL and return its components.
	 *
	 * @param {String} url
	 */

	Url.parse = function (url) {

	    if (ie) {
	        el.href = url;
	        url = el.href;
	    }

	    el.href = url;

	    return {
	        href: el.href,
	        protocol: el.protocol ? el.protocol.replace(/:$/, '') : '',
	        port: el.port,
	        host: el.host,
	        hostname: el.hostname,
	        pathname: el.pathname.charAt(0) === '/' ? el.pathname : '/' + el.pathname,
	        search: el.search ? el.search.replace(/^\?/, '') : '',
	        hash: el.hash ? el.hash.replace(/^#/, '') : ''
	    };
	};

	function factory(handler, next, vm) {
	    return function (options) {
	        return handler.call(vm, options, next);
	    };
	}

	function serialize(params, obj, scope) {

	    var array = _.isArray(obj),
	        plain = _.isPlainObject(obj),
	        hash;

	    _.each(obj, function (value, key) {

	        hash = _.isObject(value) || _.isArray(value);

	        if (scope) {
	            key = scope + '[' + (plain || hash ? key : '') + ']';
	        }

	        if (!scope && array) {
	            params.add(value.name, value.value);
	        } else if (hash) {
	            serialize(params, value, key);
	        } else {
	            params.add(key, value);
	        }
	    });
	}

	module.exports = _.url = Url;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * URL Template (RFC 6570) Transform.
	 */

	var UrlTemplate = __webpack_require__(4);

	module.exports = function (options) {

	    var variables = [],
	        url = UrlTemplate.expand(options.url, options.params, variables);

	    variables.forEach(function (key) {
	        delete options.params[key];
	    });

	    return url;
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * URL Template v2.0.6 (https://github.com/bramstein/url-template)
	 */

	exports.expand = function (url, params, variables) {

	    var tmpl = this.parse(url),
	        expanded = tmpl.expand(params);

	    if (variables) {
	        variables.push.apply(variables, tmpl.vars);
	    }

	    return expanded;
	};

	exports.parse = function (template) {

	    var operators = ['+', '#', '.', '/', ';', '?', '&'],
	        variables = [];

	    return {
	        vars: variables,
	        expand: function expand(context) {
	            return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
	                if (expression) {

	                    var operator = null,
	                        values = [];

	                    if (operators.indexOf(expression.charAt(0)) !== -1) {
	                        operator = expression.charAt(0);
	                        expression = expression.substr(1);
	                    }

	                    expression.split(/,/g).forEach(function (variable) {
	                        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
	                        values.push.apply(values, exports.getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
	                        variables.push(tmp[1]);
	                    });

	                    if (operator && operator !== '+') {

	                        var separator = ',';

	                        if (operator === '?') {
	                            separator = '&';
	                        } else if (operator !== '#') {
	                            separator = operator;
	                        }

	                        return (values.length !== 0 ? operator : '') + values.join(separator);
	                    } else {
	                        return values.join(',');
	                    }
	                } else {
	                    return exports.encodeReserved(literal);
	                }
	            });
	        }
	    };
	};

	exports.getValues = function (context, operator, key, modifier) {

	    var value = context[key],
	        result = [];

	    if (this.isDefined(value) && value !== '') {
	        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
	            value = value.toString();

	            if (modifier && modifier !== '*') {
	                value = value.substring(0, parseInt(modifier, 10));
	            }

	            result.push(this.encodeValue(operator, value, this.isKeyOperator(operator) ? key : null));
	        } else {
	            if (modifier === '*') {
	                if (Array.isArray(value)) {
	                    value.filter(this.isDefined).forEach(function (value) {
	                        result.push(this.encodeValue(operator, value, this.isKeyOperator(operator) ? key : null));
	                    }, this);
	                } else {
	                    Object.keys(value).forEach(function (k) {
	                        if (this.isDefined(value[k])) {
	                            result.push(this.encodeValue(operator, value[k], k));
	                        }
	                    }, this);
	                }
	            } else {
	                var tmp = [];

	                if (Array.isArray(value)) {
	                    value.filter(this.isDefined).forEach(function (value) {
	                        tmp.push(this.encodeValue(operator, value));
	                    }, this);
	                } else {
	                    Object.keys(value).forEach(function (k) {
	                        if (this.isDefined(value[k])) {
	                            tmp.push(encodeURIComponent(k));
	                            tmp.push(this.encodeValue(operator, value[k].toString()));
	                        }
	                    }, this);
	                }

	                if (this.isKeyOperator(operator)) {
	                    result.push(encodeURIComponent(key) + '=' + tmp.join(','));
	                } else if (tmp.length !== 0) {
	                    result.push(tmp.join(','));
	                }
	            }
	        }
	    } else {
	        if (operator === ';') {
	            result.push(encodeURIComponent(key));
	        } else if (value === '' && (operator === '&' || operator === '?')) {
	            result.push(encodeURIComponent(key) + '=');
	        } else if (value === '') {
	            result.push('');
	        }
	    }

	    return result;
	};

	exports.isDefined = function (value) {
	    return value !== undefined && value !== null;
	};

	exports.isKeyOperator = function (operator) {
	    return operator === ';' || operator === '&' || operator === '?';
	};

	exports.encodeValue = function (operator, value, key) {

	    value = operator === '+' || operator === '#' ? this.encodeReserved(value) : encodeURIComponent(value);

	    if (key) {
	        return encodeURIComponent(key) + '=' + value;
	    } else {
	        return value;
	    }
	};

	exports.encodeReserved = function (str) {
	    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
	        if (!/%[0-9A-Fa-f]/.test(part)) {
	            part = encodeURI(part);
	        }
	        return part;
	    }).join('');
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Legacy Transform.
	 */

	var _ = __webpack_require__(1);

	module.exports = function (options, next) {

	    var variables = [],
	        url = next(options);

	    url = url.replace(/(\/?):([a-z]\w*)/gi, function (match, slash, name) {

	        _.warn('The `:' + name + '` parameter syntax has been deprecated. Use the `{' + name + '}` syntax instead.');

	        if (options.params[name]) {
	            variables.push(name);
	            return slash + encodeUriSegment(options.params[name]);
	        }

	        return '';
	    });

	    variables.forEach(function (key) {
	        delete options.params[key];
	    });

	    return url;
	};

	function encodeUriSegment(value) {

	    return encodeUriQuery(value, true).replace(/%26/gi, '&').replace(/%3D/gi, '=').replace(/%2B/gi, '+');
	}

	function encodeUriQuery(value, spaces) {

	    return encodeURIComponent(value).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, spaces ? '%20' : '+');
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Query Parameter Transform.
	 */

	var _ = __webpack_require__(1);

	module.exports = function (options, next) {

	    var urlParams = Object.keys(_.url.options.params),
	        query = {},
	        url = next(options);

	    _.each(options.params, function (value, key) {
	        if (urlParams.indexOf(key) === -1) {
	            query[key] = value;
	        }
	    });

	    query = _.url.params(query);

	    if (query) {
	        url += (url.indexOf('?') == -1 ? '?' : '&') + query;
	    }

	    return url;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Root Prefix Transform.
	 */

	var _ = __webpack_require__(1);

	module.exports = function (options, next) {

	    var url = next(options);

	    if (_.isString(options.root) && !url.match(/^(https?:)?\//)) {
	        url = options.root + '/' + url;
	    }

	    return url;
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Service for sending network requests.
	 */

	var _ = __webpack_require__(1);
	var Client = __webpack_require__(9);
	var Promise = __webpack_require__(10);
	var interceptor = __webpack_require__(13);
	var jsonType = { 'Content-Type': 'application/json' };

	function Http(url, options) {
	    var _this = this;

	    var client = Client,
	        request,
	        promise;

	    Http.interceptors.forEach(function (handler) {
	        client = interceptor(handler, _this.$vm)(client);
	    });

	    options = _.isObject(url) ? url : _.extend({ url: url }, options);
	    request = _.merge({}, Http.options, this.$options, options);
	    promise = client(request).bind(this.$vm).then(function (response) {

	        return response.ok ? response : Promise.reject(response);
	    }, function (response) {

	        if (response instanceof Error) {
	            _.error(response);
	        }

	        return Promise.reject(response);
	    });

	    if (request.success) {
	        promise.success(request.success);
	    }

	    if (request.error) {
	        promise.error(request.error);
	    }

	    return promise;
	}

	Http.options = {
	    method: 'get',
	    data: '',
	    params: {},
	    headers: {},
	    xhr: null,
	    upload: null,
	    jsonp: 'callback',
	    beforeSend: null,
	    crossOrigin: null,
	    emulateHTTP: false,
	    emulateJSON: false,
	    timeout: 0
	};

	Http.interceptors = [__webpack_require__(14), __webpack_require__(15), __webpack_require__(16), __webpack_require__(18), __webpack_require__(19), __webpack_require__(20), __webpack_require__(21)];

	Http.headers = {
	    put: jsonType,
	    post: jsonType,
	    patch: jsonType,
	    delete: jsonType,
	    common: { 'Accept': 'application/json, text/plain, */*' },
	    custom: { 'X-Requested-With': 'XMLHttpRequest' }
	};

	['get', 'put', 'post', 'patch', 'delete', 'jsonp'].forEach(function (method) {

	    Http[method] = function (url, data, success, options) {

	        if (_.isFunction(data)) {
	            options = success;
	            success = data;
	            data = undefined;
	        }

	        if (_.isObject(success)) {
	            options = success;
	            success = undefined;
	        }

	        return this(url, _.extend({ method: method, data: data, success: success }, options));
	    };
	});

	module.exports = _.http = Http;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Base client.
	 */

	var _ = __webpack_require__(1);
	var Promise = __webpack_require__(10);
	var xhrClient = __webpack_require__(12);

	module.exports = function (request) {

	    var response = (request.client || xhrClient)(request);

	    return Promise.resolve(response).then(function (response) {

	        if (response.headers) {

	            var headers = parseHeaders(response.headers);

	            response.headers = function (name) {

	                if (name) {
	                    return headers[_.toLower(name)];
	                }

	                return headers;
	            };
	        }

	        response.ok = response.status >= 200 && response.status < 300;

	        return response;
	    });
	};

	function parseHeaders(str) {

	    var headers = {},
	        value,
	        name,
	        i;

	    if (_.isString(str)) {
	        _.each(str.split('\n'), function (row) {

	            i = row.indexOf(':');
	            name = _.trim(_.toLower(row.slice(0, i)));
	            value = _.trim(row.slice(i + 1));

	            if (headers[name]) {

	                if (_.isArray(headers[name])) {
	                    headers[name].push(value);
	                } else {
	                    headers[name] = [headers[name], value];
	                }
	            } else {

	                headers[name] = value;
	            }
	        });
	    }

	    return headers;
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Promise adapter.
	 */

	var _ = __webpack_require__(1);
	var PromiseObj = window.Promise || __webpack_require__(11);

	function Promise(executor, context) {

	    if (executor instanceof PromiseObj) {
	        this.promise = executor;
	    } else {
	        this.promise = new PromiseObj(executor.bind(context));
	    }

	    this.context = context;
	}

	Promise.all = function (iterable, context) {
	    return new Promise(PromiseObj.all(iterable), context);
	};

	Promise.resolve = function (value, context) {
	    return new Promise(PromiseObj.resolve(value), context);
	};

	Promise.reject = function (reason, context) {
	    return new Promise(PromiseObj.reject(reason), context);
	};

	Promise.race = function (iterable, context) {
	    return new Promise(PromiseObj.race(iterable), context);
	};

	var p = Promise.prototype;

	p.bind = function (context) {
	    this.context = context;
	    return this;
	};

	p.then = function (fulfilled, rejected) {

	    if (fulfilled && fulfilled.bind && this.context) {
	        fulfilled = fulfilled.bind(this.context);
	    }

	    if (rejected && rejected.bind && this.context) {
	        rejected = rejected.bind(this.context);
	    }

	    this.promise = this.promise.then(fulfilled, rejected);

	    return this;
	};

	p.catch = function (rejected) {

	    if (rejected && rejected.bind && this.context) {
	        rejected = rejected.bind(this.context);
	    }

	    this.promise = this.promise.catch(rejected);

	    return this;
	};

	p.finally = function (callback) {

	    return this.then(function (value) {
	        callback.call(this);
	        return value;
	    }, function (reason) {
	        callback.call(this);
	        return PromiseObj.reject(reason);
	    });
	};

	p.success = function (callback) {

	    _.warn('The `success` method has been deprecated. Use the `then` method instead.');

	    return this.then(function (response) {
	        return callback.call(this, response.data, response.status, response) || response;
	    });
	};

	p.error = function (callback) {

	    _.warn('The `error` method has been deprecated. Use the `catch` method instead.');

	    return this.catch(function (response) {
	        return callback.call(this, response.data, response.status, response) || response;
	    });
	};

	p.always = function (callback) {

	    _.warn('The `always` method has been deprecated. Use the `finally` method instead.');

	    var cb = function cb(response) {
	        return callback.call(this, response.data, response.status, response) || response;
	    };

	    return this.then(cb, cb);
	};

	module.exports = Promise;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * Promises/A+ polyfill v1.1.4 (https://github.com/bramstein/promis)
	 */

	var _ = __webpack_require__(1);

	var RESOLVED = 0;
	var REJECTED = 1;
	var PENDING = 2;

	function Promise(executor) {

	    this.state = PENDING;
	    this.value = undefined;
	    this.deferred = [];

	    var promise = this;

	    try {
	        executor(function (x) {
	            promise.resolve(x);
	        }, function (r) {
	            promise.reject(r);
	        });
	    } catch (e) {
	        promise.reject(e);
	    }
	}

	Promise.reject = function (r) {
	    return new Promise(function (resolve, reject) {
	        reject(r);
	    });
	};

	Promise.resolve = function (x) {
	    return new Promise(function (resolve, reject) {
	        resolve(x);
	    });
	};

	Promise.all = function all(iterable) {
	    return new Promise(function (resolve, reject) {
	        var count = 0,
	            result = [];

	        if (iterable.length === 0) {
	            resolve(result);
	        }

	        function resolver(i) {
	            return function (x) {
	                result[i] = x;
	                count += 1;

	                if (count === iterable.length) {
	                    resolve(result);
	                }
	            };
	        }

	        for (var i = 0; i < iterable.length; i += 1) {
	            Promise.resolve(iterable[i]).then(resolver(i), reject);
	        }
	    });
	};

	Promise.race = function race(iterable) {
	    return new Promise(function (resolve, reject) {
	        for (var i = 0; i < iterable.length; i += 1) {
	            Promise.resolve(iterable[i]).then(resolve, reject);
	        }
	    });
	};

	var p = Promise.prototype;

	p.resolve = function resolve(x) {
	    var promise = this;

	    if (promise.state === PENDING) {
	        if (x === promise) {
	            throw new TypeError('Promise settled with itself.');
	        }

	        var called = false;

	        try {
	            var then = x && x['then'];

	            if (x !== null && (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && typeof then === 'function') {
	                then.call(x, function (x) {
	                    if (!called) {
	                        promise.resolve(x);
	                    }
	                    called = true;
	                }, function (r) {
	                    if (!called) {
	                        promise.reject(r);
	                    }
	                    called = true;
	                });
	                return;
	            }
	        } catch (e) {
	            if (!called) {
	                promise.reject(e);
	            }
	            return;
	        }

	        promise.state = RESOLVED;
	        promise.value = x;
	        promise.notify();
	    }
	};

	p.reject = function reject(reason) {
	    var promise = this;

	    if (promise.state === PENDING) {
	        if (reason === promise) {
	            throw new TypeError('Promise settled with itself.');
	        }

	        promise.state = REJECTED;
	        promise.value = reason;
	        promise.notify();
	    }
	};

	p.notify = function notify() {
	    var promise = this;

	    _.nextTick(function () {
	        if (promise.state !== PENDING) {
	            while (promise.deferred.length) {
	                var deferred = promise.deferred.shift(),
	                    onResolved = deferred[0],
	                    onRejected = deferred[1],
	                    resolve = deferred[2],
	                    reject = deferred[3];

	                try {
	                    if (promise.state === RESOLVED) {
	                        if (typeof onResolved === 'function') {
	                            resolve(onResolved.call(undefined, promise.value));
	                        } else {
	                            resolve(promise.value);
	                        }
	                    } else if (promise.state === REJECTED) {
	                        if (typeof onRejected === 'function') {
	                            resolve(onRejected.call(undefined, promise.value));
	                        } else {
	                            reject(promise.value);
	                        }
	                    }
	                } catch (e) {
	                    reject(e);
	                }
	            }
	        }
	    });
	};

	p.then = function then(onResolved, onRejected) {
	    var promise = this;

	    return new Promise(function (resolve, reject) {
	        promise.deferred.push([onResolved, onRejected, resolve, reject]);
	        promise.notify();
	    });
	};

	p.catch = function (onRejected) {
	    return this.then(undefined, onRejected);
	};

	module.exports = Promise;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * XMLHttp client.
	 */

	var _ = __webpack_require__(1);
	var Promise = __webpack_require__(10);

	module.exports = function (request) {
	    return new Promise(function (resolve) {

	        var xhr = new XMLHttpRequest(),
	            response = { request: request },
	            handler;

	        request.cancel = function () {
	            xhr.abort();
	        };

	        xhr.open(request.method, _.url(request), true);

	        handler = function handler(event) {

	            response.data = xhr.responseText;
	            response.status = xhr.status;
	            response.statusText = xhr.statusText;
	            response.headers = xhr.getAllResponseHeaders();

	            resolve(response);
	        };

	        xhr.timeout = 0;
	        xhr.onload = handler;
	        xhr.onabort = handler;
	        xhr.onerror = handler;
	        xhr.ontimeout = function () {};
	        xhr.onprogress = function () {};

	        if (_.isPlainObject(request.xhr)) {
	            _.extend(xhr, request.xhr);
	        }

	        if (_.isPlainObject(request.upload)) {
	            _.extend(xhr.upload, request.upload);
	        }

	        _.each(request.headers || {}, function (value, header) {
	            xhr.setRequestHeader(header, value);
	        });

	        xhr.send(request.data);
	    });
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Interceptor factory.
	 */

	var _ = __webpack_require__(1);
	var Promise = __webpack_require__(10);

	module.exports = function (handler, vm) {

	    return function (client) {

	        if (_.isFunction(handler)) {
	            handler = handler.call(vm, Promise);
	        }

	        return function (request) {

	            if (_.isFunction(handler.request)) {
	                request = handler.request.call(vm, request);
	            }

	            return when(request, function (request) {
	                return when(client(request), function (response) {

	                    if (_.isFunction(handler.response)) {
	                        response = handler.response.call(vm, response);
	                    }

	                    return response;
	                });
	            });
	        };
	    };
	};

	function when(value, fulfilled, rejected) {

	    var promise = Promise.resolve(value);

	    if (arguments.length < 2) {
	        return promise;
	    }

	    return promise.then(fulfilled, rejected);
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Before Interceptor.
	 */

	var _ = __webpack_require__(1);

	module.exports = {

	    request: function request(_request) {

	        if (_.isFunction(_request.beforeSend)) {
	            _request.beforeSend.call(this, _request);
	        }

	        return _request;
	    }

	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	/**
	 * Timeout Interceptor.
	 */

	module.exports = function () {

	    var timeout;

	    return {

	        request: function request(_request) {

	            if (_request.timeout) {
	                timeout = setTimeout(function () {
	                    _request.cancel();
	                }, _request.timeout);
	            }

	            return _request;
	        },

	        response: function response(_response) {

	            clearTimeout(timeout);

	            return _response;
	        }

	    };
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * JSONP Interceptor.
	 */

	var jsonpClient = __webpack_require__(17);

	module.exports = {

	    request: function request(_request) {

	        if (_request.method == 'JSONP') {
	            _request.client = jsonpClient;
	        }

	        return _request;
	    }

	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * JSONP client.
	 */

	var _ = __webpack_require__(1);
	var Promise = __webpack_require__(10);

	module.exports = function (request) {
	    return new Promise(function (resolve) {

	        var callback = '_jsonp' + Math.random().toString(36).substr(2),
	            response = { request: request, data: null },
	            handler,
	            script;

	        request.params[request.jsonp] = callback;
	        request.cancel = function () {
	            handler({ type: 'cancel' });
	        };

	        script = document.createElement('script');
	        script.src = _.url(request);
	        script.type = 'text/javascript';
	        script.async = true;

	        window[callback] = function (data) {
	            response.data = data;
	        };

	        handler = function handler(event) {

	            if (event.type === 'load' && response.data !== null) {
	                response.status = 200;
	            } else if (event.type === 'error') {
	                response.status = 404;
	            } else {
	                response.status = 0;
	            }

	            resolve(response);

	            delete window[callback];
	            document.body.removeChild(script);
	        };

	        script.onload = handler;
	        script.onerror = handler;

	        document.body.appendChild(script);
	    });
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	/**
	 * HTTP method override Interceptor.
	 */

	module.exports = {

	    request: function request(_request) {

	        if (_request.emulateHTTP && /^(PUT|PATCH|DELETE)$/i.test(_request.method)) {
	            _request.headers['X-HTTP-Method-Override'] = _request.method;
	            _request.method = 'POST';
	        }

	        return _request;
	    }

	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Mime Interceptor.
	 */

	var _ = __webpack_require__(1);

	module.exports = {

	    request: function request(_request) {

	        if (_request.emulateJSON && _.isPlainObject(_request.data)) {
	            _request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
	            _request.data = _.url.params(_request.data);
	        }

	        if (_.isObject(_request.data) && /FormData/i.test(_request.data.toString())) {
	            delete _request.headers['Content-Type'];
	        }

	        if (_.isPlainObject(_request.data)) {
	            _request.data = JSON.stringify(_request.data);
	        }

	        return _request;
	    },

	    response: function response(_response) {

	        try {
	            _response.data = JSON.parse(_response.data);
	        } catch (e) {}

	        return _response;
	    }

	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Header Interceptor.
	 */

	var _ = __webpack_require__(1);

	module.exports = {

	    request: function request(_request) {

	        _request.method = _request.method.toUpperCase();
	        _request.headers = _.extend({}, _.http.headers.common, !_request.crossOrigin ? _.http.headers.custom : {}, _.http.headers[_request.method.toLowerCase()], _request.headers);

	        if (_.isPlainObject(_request.data) && /^(GET|JSONP)$/i.test(_request.method)) {
	            _.extend(_request.params, _request.data);
	            delete _request.data;
	        }

	        return _request;
	    }

	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * CORS Interceptor.
	 */

	var _ = __webpack_require__(1);
	var xdrClient = __webpack_require__(22);
	var xhrCors = 'withCredentials' in new XMLHttpRequest();
	var originUrl = _.url.parse(location.href);

	module.exports = {

	    request: function request(_request) {

	        if (_request.crossOrigin === null) {
	            _request.crossOrigin = crossOrigin(_request);
	        }

	        if (_request.crossOrigin) {

	            if (!xhrCors) {
	                _request.client = xdrClient;
	            }

	            _request.emulateHTTP = false;
	        }

	        return _request;
	    }

	};

	function crossOrigin(request) {

	    var requestUrl = _.url.parse(_.url(request));

	    return requestUrl.protocol !== originUrl.protocol || requestUrl.host !== originUrl.host;
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * XDomain client (Internet Explorer).
	 */

	var _ = __webpack_require__(1);
	var Promise = __webpack_require__(10);

	module.exports = function (request) {
	    return new Promise(function (resolve) {

	        var xdr = new XDomainRequest(),
	            response = { request: request },
	            handler;

	        request.cancel = function () {
	            xdr.abort();
	        };

	        xdr.open(request.method, _.url(request), true);

	        handler = function handler(event) {

	            response.data = xdr.responseText;
	            response.status = xdr.status;
	            response.statusText = xdr.statusText;

	            resolve(response);
	        };

	        xdr.timeout = 0;
	        xdr.onload = handler;
	        xdr.onabort = handler;
	        xdr.onerror = handler;
	        xdr.ontimeout = function () {};
	        xdr.onprogress = function () {};

	        xdr.send(request.data);
	    });
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Service for interacting with RESTful services.
	 */

	var _ = __webpack_require__(1);

	function Resource(url, params, actions, options) {

	    var self = this,
	        resource = {};

	    actions = _.extend({}, Resource.actions, actions);

	    _.each(actions, function (action, name) {

	        action = _.merge({ url: url, params: params || {} }, options, action);

	        resource[name] = function () {
	            return (self.$http || _.http)(opts(action, arguments));
	        };
	    });

	    return resource;
	}

	function opts(action, args) {

	    var options = _.extend({}, action),
	        params = {},
	        data,
	        success,
	        error;

	    switch (args.length) {

	        case 4:

	            error = args[3];
	            success = args[2];

	        case 3:
	        case 2:

	            if (_.isFunction(args[1])) {

	                if (_.isFunction(args[0])) {

	                    success = args[0];
	                    error = args[1];

	                    break;
	                }

	                success = args[1];
	                error = args[2];
	            } else {

	                params = args[0];
	                data = args[1];
	                success = args[2];

	                break;
	            }

	        case 1:

	            if (_.isFunction(args[0])) {
	                success = args[0];
	            } else if (/^(POST|PUT|PATCH)$/i.test(options.method)) {
	                data = args[0];
	            } else {
	                params = args[0];
	            }

	            break;

	        case 0:

	            break;

	        default:

	            throw 'Expected up to 4 arguments [params, data, success, error], got ' + args.length + ' arguments';
	    }

	    options.data = data;
	    options.params = _.extend({}, options.params, params);

	    if (success) {
	        options.success = success;
	    }

	    if (error) {
	        options.error = error;
	    }

	    return options;
	}

	Resource.actions = {

	    get: { method: 'GET' },
	    save: { method: 'POST' },
	    query: { method: 'GET' },
	    update: { method: 'PUT' },
	    remove: { method: 'DELETE' },
	    delete: { method: 'DELETE' }

	};

	module.exports = _.resource = Resource;

/***/ }
/******/ ]);
},{}],5:[function(require,module,exports){
/*!
 * vue-router v0.7.13
 * (c) 2016 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  global.VueRouter = factory();
}(this, function () { 'use strict';

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  function Target(path, matcher, delegate) {
    this.path = path;
    this.matcher = matcher;
    this.delegate = delegate;
  }

  Target.prototype = {
    to: function to(target, callback) {
      var delegate = this.delegate;

      if (delegate && delegate.willAddRoute) {
        target = delegate.willAddRoute(this.matcher.target, target);
      }

      this.matcher.add(this.path, target);

      if (callback) {
        if (callback.length === 0) {
          throw new Error("You must have an argument in the function passed to `to`");
        }
        this.matcher.addChild(this.path, target, callback, this.delegate);
      }
      return this;
    }
  };

  function Matcher(target) {
    this.routes = {};
    this.children = {};
    this.target = target;
  }

  Matcher.prototype = {
    add: function add(path, handler) {
      this.routes[path] = handler;
    },

    addChild: function addChild(path, target, callback, delegate) {
      var matcher = new Matcher(target);
      this.children[path] = matcher;

      var match = generateMatch(path, matcher, delegate);

      if (delegate && delegate.contextEntered) {
        delegate.contextEntered(target, match);
      }

      callback(match);
    }
  };

  function generateMatch(startingPath, matcher, delegate) {
    return function (path, nestedCallback) {
      var fullPath = startingPath + path;

      if (nestedCallback) {
        nestedCallback(generateMatch(fullPath, matcher, delegate));
      } else {
        return new Target(startingPath + path, matcher, delegate);
      }
    };
  }

  function addRoute(routeArray, path, handler) {
    var len = 0;
    for (var i = 0, l = routeArray.length; i < l; i++) {
      len += routeArray[i].path.length;
    }

    path = path.substr(len);
    var route = { path: path, handler: handler };
    routeArray.push(route);
  }

  function eachRoute(baseRoute, matcher, callback, binding) {
    var routes = matcher.routes;

    for (var path in routes) {
      if (routes.hasOwnProperty(path)) {
        var routeArray = baseRoute.slice();
        addRoute(routeArray, path, routes[path]);

        if (matcher.children[path]) {
          eachRoute(routeArray, matcher.children[path], callback, binding);
        } else {
          callback.call(binding, routeArray);
        }
      }
    }
  }

  function map (callback, addRouteCallback) {
    var matcher = new Matcher();

    callback(generateMatch("", matcher, this.delegate));

    eachRoute([], matcher, function (route) {
      if (addRouteCallback) {
        addRouteCallback(this, route);
      } else {
        this.add(route);
      }
    }, this);
  }

  var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];

  var escapeRegex = new RegExp('(\\' + specials.join('|\\') + ')', 'g');

  var noWarning = false;
  function warn(msg) {
    if (!noWarning && typeof console !== 'undefined') {
      console.error('[vue-router] ' + msg);
    }
  }

  function tryDecode(uri, asComponent) {
    try {
      return asComponent ? decodeURIComponent(uri) : decodeURI(uri);
    } catch (e) {
      warn('malformed URI' + (asComponent ? ' component: ' : ': ') + uri);
    }
  }

  function isArray(test) {
    return Object.prototype.toString.call(test) === "[object Array]";
  }

  // A Segment represents a segment in the original route description.
  // Each Segment type provides an `eachChar` and `regex` method.
  //
  // The `eachChar` method invokes the callback with one or more character
  // specifications. A character specification consumes one or more input
  // characters.
  //
  // The `regex` method returns a regex fragment for the segment. If the
  // segment is a dynamic of star segment, the regex fragment also includes
  // a capture.
  //
  // A character specification contains:
  //
  // * `validChars`: a String with a list of all valid characters, or
  // * `invalidChars`: a String with a list of all invalid characters
  // * `repeat`: true if the character specification can repeat

  function StaticSegment(string) {
    this.string = string;
  }
  StaticSegment.prototype = {
    eachChar: function eachChar(callback) {
      var string = this.string,
          ch;

      for (var i = 0, l = string.length; i < l; i++) {
        ch = string.charAt(i);
        callback({ validChars: ch });
      }
    },

    regex: function regex() {
      return this.string.replace(escapeRegex, '\\$1');
    },

    generate: function generate() {
      return this.string;
    }
  };

  function DynamicSegment(name) {
    this.name = name;
  }
  DynamicSegment.prototype = {
    eachChar: function eachChar(callback) {
      callback({ invalidChars: "/", repeat: true });
    },

    regex: function regex() {
      return "([^/]+)";
    },

    generate: function generate(params) {
      var val = params[this.name];
      return val == null ? ":" + this.name : val;
    }
  };

  function StarSegment(name) {
    this.name = name;
  }
  StarSegment.prototype = {
    eachChar: function eachChar(callback) {
      callback({ invalidChars: "", repeat: true });
    },

    regex: function regex() {
      return "(.+)";
    },

    generate: function generate(params) {
      var val = params[this.name];
      return val == null ? ":" + this.name : val;
    }
  };

  function EpsilonSegment() {}
  EpsilonSegment.prototype = {
    eachChar: function eachChar() {},
    regex: function regex() {
      return "";
    },
    generate: function generate() {
      return "";
    }
  };

  function parse(route, names, specificity) {
    // normalize route as not starting with a "/". Recognition will
    // also normalize.
    if (route.charAt(0) === "/") {
      route = route.substr(1);
    }

    var segments = route.split("/"),
        results = [];

    // A routes has specificity determined by the order that its different segments
    // appear in. This system mirrors how the magnitude of numbers written as strings
    // works.
    // Consider a number written as: "abc". An example would be "200". Any other number written
    // "xyz" will be smaller than "abc" so long as `a > z`. For instance, "199" is smaller
    // then "200", even though "y" and "z" (which are both 9) are larger than "0" (the value
    // of (`b` and `c`). This is because the leading symbol, "2", is larger than the other
    // leading symbol, "1".
    // The rule is that symbols to the left carry more weight than symbols to the right
    // when a number is written out as a string. In the above strings, the leading digit
    // represents how many 100's are in the number, and it carries more weight than the middle
    // number which represents how many 10's are in the number.
    // This system of number magnitude works well for route specificity, too. A route written as
    // `a/b/c` will be more specific than `x/y/z` as long as `a` is more specific than
    // `x`, irrespective of the other parts.
    // Because of this similarity, we assign each type of segment a number value written as a
    // string. We can find the specificity of compound routes by concatenating these strings
    // together, from left to right. After we have looped through all of the segments,
    // we convert the string to a number.
    specificity.val = '';

    for (var i = 0, l = segments.length; i < l; i++) {
      var segment = segments[i],
          match;

      if (match = segment.match(/^:([^\/]+)$/)) {
        results.push(new DynamicSegment(match[1]));
        names.push(match[1]);
        specificity.val += '3';
      } else if (match = segment.match(/^\*([^\/]+)$/)) {
        results.push(new StarSegment(match[1]));
        specificity.val += '2';
        names.push(match[1]);
      } else if (segment === "") {
        results.push(new EpsilonSegment());
        specificity.val += '1';
      } else {
        results.push(new StaticSegment(segment));
        specificity.val += '4';
      }
    }

    specificity.val = +specificity.val;

    return results;
  }

  // A State has a character specification and (`charSpec`) and a list of possible
  // subsequent states (`nextStates`).
  //
  // If a State is an accepting state, it will also have several additional
  // properties:
  //
  // * `regex`: A regular expression that is used to extract parameters from paths
  //   that reached this accepting state.
  // * `handlers`: Information on how to convert the list of captures into calls
  //   to registered handlers with the specified parameters
  // * `types`: How many static, dynamic or star segments in this route. Used to
  //   decide which route to use if multiple registered routes match a path.
  //
  // Currently, State is implemented naively by looping over `nextStates` and
  // comparing a character specification against a character. A more efficient
  // implementation would use a hash of keys pointing at one or more next states.

  function State(charSpec) {
    this.charSpec = charSpec;
    this.nextStates = [];
  }

  State.prototype = {
    get: function get(charSpec) {
      var nextStates = this.nextStates;

      for (var i = 0, l = nextStates.length; i < l; i++) {
        var child = nextStates[i];

        var isEqual = child.charSpec.validChars === charSpec.validChars;
        isEqual = isEqual && child.charSpec.invalidChars === charSpec.invalidChars;

        if (isEqual) {
          return child;
        }
      }
    },

    put: function put(charSpec) {
      var state;

      // If the character specification already exists in a child of the current
      // state, just return that state.
      if (state = this.get(charSpec)) {
        return state;
      }

      // Make a new state for the character spec
      state = new State(charSpec);

      // Insert the new state as a child of the current state
      this.nextStates.push(state);

      // If this character specification repeats, insert the new state as a child
      // of itself. Note that this will not trigger an infinite loop because each
      // transition during recognition consumes a character.
      if (charSpec.repeat) {
        state.nextStates.push(state);
      }

      // Return the new state
      return state;
    },

    // Find a list of child states matching the next character
    match: function match(ch) {
      // DEBUG "Processing `" + ch + "`:"
      var nextStates = this.nextStates,
          child,
          charSpec,
          chars;

      // DEBUG "  " + debugState(this)
      var returned = [];

      for (var i = 0, l = nextStates.length; i < l; i++) {
        child = nextStates[i];

        charSpec = child.charSpec;

        if (typeof (chars = charSpec.validChars) !== 'undefined') {
          if (chars.indexOf(ch) !== -1) {
            returned.push(child);
          }
        } else if (typeof (chars = charSpec.invalidChars) !== 'undefined') {
          if (chars.indexOf(ch) === -1) {
            returned.push(child);
          }
        }
      }

      return returned;
    }

    /** IF DEBUG
    , debug: function() {
      var charSpec = this.charSpec,
          debug = "[",
          chars = charSpec.validChars || charSpec.invalidChars;
       if (charSpec.invalidChars) { debug += "^"; }
      debug += chars;
      debug += "]";
       if (charSpec.repeat) { debug += "+"; }
       return debug;
    }
    END IF **/
  };

  /** IF DEBUG
  function debug(log) {
    console.log(log);
  }

  function debugState(state) {
    return state.nextStates.map(function(n) {
      if (n.nextStates.length === 0) { return "( " + n.debug() + " [accepting] )"; }
      return "( " + n.debug() + " <then> " + n.nextStates.map(function(s) { return s.debug() }).join(" or ") + " )";
    }).join(", ")
  }
  END IF **/

  // Sort the routes by specificity
  function sortSolutions(states) {
    return states.sort(function (a, b) {
      return b.specificity.val - a.specificity.val;
    });
  }

  function recognizeChar(states, ch) {
    var nextStates = [];

    for (var i = 0, l = states.length; i < l; i++) {
      var state = states[i];

      nextStates = nextStates.concat(state.match(ch));
    }

    return nextStates;
  }

  var oCreate = Object.create || function (proto) {
    function F() {}
    F.prototype = proto;
    return new F();
  };

  function RecognizeResults(queryParams) {
    this.queryParams = queryParams || {};
  }
  RecognizeResults.prototype = oCreate({
    splice: Array.prototype.splice,
    slice: Array.prototype.slice,
    push: Array.prototype.push,
    length: 0,
    queryParams: null
  });

  function findHandler(state, path, queryParams) {
    var handlers = state.handlers,
        regex = state.regex;
    var captures = path.match(regex),
        currentCapture = 1;
    var result = new RecognizeResults(queryParams);

    for (var i = 0, l = handlers.length; i < l; i++) {
      var handler = handlers[i],
          names = handler.names,
          params = {};

      for (var j = 0, m = names.length; j < m; j++) {
        params[names[j]] = captures[currentCapture++];
      }

      result.push({ handler: handler.handler, params: params, isDynamic: !!names.length });
    }

    return result;
  }

  function addSegment(currentState, segment) {
    segment.eachChar(function (ch) {
      var state;

      currentState = currentState.put(ch);
    });

    return currentState;
  }

  function decodeQueryParamPart(part) {
    // http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
    part = part.replace(/\+/gm, '%20');
    return tryDecode(part, true);
  }

  // The main interface

  var RouteRecognizer = function RouteRecognizer() {
    this.rootState = new State();
    this.names = {};
  };

  RouteRecognizer.prototype = {
    add: function add(routes, options) {
      var currentState = this.rootState,
          regex = "^",
          specificity = {},
          handlers = [],
          allSegments = [],
          name;

      var isEmpty = true;

      for (var i = 0, l = routes.length; i < l; i++) {
        var route = routes[i],
            names = [];

        var segments = parse(route.path, names, specificity);

        allSegments = allSegments.concat(segments);

        for (var j = 0, m = segments.length; j < m; j++) {
          var segment = segments[j];

          if (segment instanceof EpsilonSegment) {
            continue;
          }

          isEmpty = false;

          // Add a "/" for the new segment
          currentState = currentState.put({ validChars: "/" });
          regex += "/";

          // Add a representation of the segment to the NFA and regex
          currentState = addSegment(currentState, segment);
          regex += segment.regex();
        }

        var handler = { handler: route.handler, names: names };
        handlers.push(handler);
      }

      if (isEmpty) {
        currentState = currentState.put({ validChars: "/" });
        regex += "/";
      }

      currentState.handlers = handlers;
      currentState.regex = new RegExp(regex + "$");
      currentState.specificity = specificity;

      if (name = options && options.as) {
        this.names[name] = {
          segments: allSegments,
          handlers: handlers
        };
      }
    },

    handlersFor: function handlersFor(name) {
      var route = this.names[name],
          result = [];
      if (!route) {
        throw new Error("There is no route named " + name);
      }

      for (var i = 0, l = route.handlers.length; i < l; i++) {
        result.push(route.handlers[i]);
      }

      return result;
    },

    hasRoute: function hasRoute(name) {
      return !!this.names[name];
    },

    generate: function generate(name, params) {
      var route = this.names[name],
          output = "";
      if (!route) {
        throw new Error("There is no route named " + name);
      }

      var segments = route.segments;

      for (var i = 0, l = segments.length; i < l; i++) {
        var segment = segments[i];

        if (segment instanceof EpsilonSegment) {
          continue;
        }

        output += "/";
        output += segment.generate(params);
      }

      if (output.charAt(0) !== '/') {
        output = '/' + output;
      }

      if (params && params.queryParams) {
        output += this.generateQueryString(params.queryParams);
      }

      return output;
    },

    generateQueryString: function generateQueryString(params) {
      var pairs = [];
      var keys = [];
      for (var key in params) {
        if (params.hasOwnProperty(key)) {
          keys.push(key);
        }
      }
      keys.sort();
      for (var i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        var value = params[key];
        if (value == null) {
          continue;
        }
        var pair = encodeURIComponent(key);
        if (isArray(value)) {
          for (var j = 0, l = value.length; j < l; j++) {
            var arrayPair = key + '[]' + '=' + encodeURIComponent(value[j]);
            pairs.push(arrayPair);
          }
        } else {
          pair += "=" + encodeURIComponent(value);
          pairs.push(pair);
        }
      }

      if (pairs.length === 0) {
        return '';
      }

      return "?" + pairs.join("&");
    },

    parseQueryString: function parseQueryString(queryString) {
      var pairs = queryString.split("&"),
          queryParams = {};
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('='),
            key = decodeQueryParamPart(pair[0]),
            keyLength = key.length,
            isArray = false,
            value;
        if (pair.length === 1) {
          value = 'true';
        } else {
          //Handle arrays
          if (keyLength > 2 && key.slice(keyLength - 2) === '[]') {
            isArray = true;
            key = key.slice(0, keyLength - 2);
            if (!queryParams[key]) {
              queryParams[key] = [];
            }
          }
          value = pair[1] ? decodeQueryParamPart(pair[1]) : '';
        }
        if (isArray) {
          queryParams[key].push(value);
        } else {
          queryParams[key] = value;
        }
      }
      return queryParams;
    },

    recognize: function recognize(path, silent) {
      noWarning = silent;
      var states = [this.rootState],
          pathLen,
          i,
          l,
          queryStart,
          queryParams = {},
          isSlashDropped = false;

      queryStart = path.indexOf('?');
      if (queryStart !== -1) {
        var queryString = path.substr(queryStart + 1, path.length);
        path = path.substr(0, queryStart);
        if (queryString) {
          queryParams = this.parseQueryString(queryString);
        }
      }

      path = tryDecode(path);
      if (!path) return;

      // DEBUG GROUP path

      if (path.charAt(0) !== "/") {
        path = "/" + path;
      }

      pathLen = path.length;
      if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
        path = path.substr(0, pathLen - 1);
        isSlashDropped = true;
      }

      for (i = 0, l = path.length; i < l; i++) {
        states = recognizeChar(states, path.charAt(i));
        if (!states.length) {
          break;
        }
      }

      // END DEBUG GROUP

      var solutions = [];
      for (i = 0, l = states.length; i < l; i++) {
        if (states[i].handlers) {
          solutions.push(states[i]);
        }
      }

      states = sortSolutions(solutions);

      var state = solutions[0];

      if (state && state.handlers) {
        // if a trailing slash was dropped and a star segment is the last segment
        // specified, put the trailing slash back
        if (isSlashDropped && state.regex.source.slice(-5) === "(.+)$") {
          path = path + "/";
        }
        return findHandler(state, path, queryParams);
      }
    }
  };

  RouteRecognizer.prototype.map = map;

  var genQuery = RouteRecognizer.prototype.generateQueryString;

  // export default for holding the Vue reference
  var exports$1 = {};
  /**
   * Warn stuff.
   *
   * @param {String} msg
   */

  function warn$1(msg) {
    /* istanbul ignore next */
    if (typeof console !== 'undefined') {
      console.error('[vue-router] ' + msg);
    }
  }

  /**
   * Resolve a relative path.
   *
   * @param {String} base
   * @param {String} relative
   * @param {Boolean} append
   * @return {String}
   */

  function resolvePath(base, relative, append) {
    var query = base.match(/(\?.*)$/);
    if (query) {
      query = query[1];
      base = base.slice(0, -query.length);
    }
    // a query!
    if (relative.charAt(0) === '?') {
      return base + relative;
    }
    var stack = base.split('/');
    // remove trailing segment if:
    // - not appending
    // - appending to trailing slash (last segment is empty)
    if (!append || !stack[stack.length - 1]) {
      stack.pop();
    }
    // resolve relative path
    var segments = relative.replace(/^\//, '').split('/');
    for (var i = 0; i < segments.length; i++) {
      var segment = segments[i];
      if (segment === '.') {
        continue;
      } else if (segment === '..') {
        stack.pop();
      } else {
        stack.push(segment);
      }
    }
    // ensure leading slash
    if (stack[0] !== '') {
      stack.unshift('');
    }
    return stack.join('/');
  }

  /**
   * Forgiving check for a promise
   *
   * @param {Object} p
   * @return {Boolean}
   */

  function isPromise(p) {
    return p && typeof p.then === 'function';
  }

  /**
   * Retrive a route config field from a component instance
   * OR a component contructor.
   *
   * @param {Function|Vue} component
   * @param {String} name
   * @return {*}
   */

  function getRouteConfig(component, name) {
    var options = component && (component.$options || component.options);
    return options && options.route && options.route[name];
  }

  /**
   * Resolve an async component factory. Have to do a dirty
   * mock here because of Vue core's internal API depends on
   * an ID check.
   *
   * @param {Object} handler
   * @param {Function} cb
   */

  var resolver = undefined;

  function resolveAsyncComponent(handler, cb) {
    if (!resolver) {
      resolver = {
        resolve: exports$1.Vue.prototype._resolveComponent,
        $options: {
          components: {
            _: handler.component
          }
        }
      };
    } else {
      resolver.$options.components._ = handler.component;
    }
    resolver.resolve('_', function (Component) {
      handler.component = Component;
      cb(Component);
    });
  }

  /**
   * Map the dynamic segments in a path to params.
   *
   * @param {String} path
   * @param {Object} params
   * @param {Object} query
   */

  function mapParams(path, params, query) {
    if (params === undefined) params = {};

    path = path.replace(/:([^\/]+)/g, function (_, key) {
      var val = params[key];
      /* istanbul ignore if */
      if (!val) {
        warn$1('param "' + key + '" not found when generating ' + 'path for "' + path + '" with params ' + JSON.stringify(params));
      }
      return val || '';
    });
    if (query) {
      path += genQuery(query);
    }
    return path;
  }

  var hashRE = /#.*$/;

  var HTML5History = (function () {
    function HTML5History(_ref) {
      var root = _ref.root;
      var onChange = _ref.onChange;
      babelHelpers.classCallCheck(this, HTML5History);

      if (root && root !== '/') {
        // make sure there's the starting slash
        if (root.charAt(0) !== '/') {
          root = '/' + root;
        }
        // remove trailing slash
        this.root = root.replace(/\/$/, '');
        this.rootRE = new RegExp('^\\' + this.root);
      } else {
        this.root = null;
      }
      this.onChange = onChange;
      // check base tag
      var baseEl = document.querySelector('base');
      this.base = baseEl && baseEl.getAttribute('href');
    }

    HTML5History.prototype.start = function start() {
      var _this = this;

      this.listener = function (e) {
        var url = location.pathname + location.search;
        if (_this.root) {
          url = url.replace(_this.rootRE, '');
        }
        _this.onChange(url, e && e.state, location.hash);
      };
      window.addEventListener('popstate', this.listener);
      this.listener();
    };

    HTML5History.prototype.stop = function stop() {
      window.removeEventListener('popstate', this.listener);
    };

    HTML5History.prototype.go = function go(path, replace, append) {
      var url = this.formatPath(path, append);
      if (replace) {
        history.replaceState({}, '', url);
      } else {
        // record scroll position by replacing current state
        history.replaceState({
          pos: {
            x: window.pageXOffset,
            y: window.pageYOffset
          }
        }, '', location.href);
        // then push new state
        history.pushState({}, '', url);
      }
      var hashMatch = path.match(hashRE);
      var hash = hashMatch && hashMatch[0];
      path = url
      // strip hash so it doesn't mess up params
      .replace(hashRE, '')
      // remove root before matching
      .replace(this.rootRE, '');
      this.onChange(path, null, hash);
    };

    HTML5History.prototype.formatPath = function formatPath(path, append) {
      return path.charAt(0) === '/'
      // absolute path
      ? this.root ? this.root + '/' + path.replace(/^\//, '') : path : resolvePath(this.base || location.pathname, path, append);
    };

    return HTML5History;
  })();

  var HashHistory = (function () {
    function HashHistory(_ref) {
      var hashbang = _ref.hashbang;
      var onChange = _ref.onChange;
      babelHelpers.classCallCheck(this, HashHistory);

      this.hashbang = hashbang;
      this.onChange = onChange;
    }

    HashHistory.prototype.start = function start() {
      var self = this;
      this.listener = function () {
        var path = location.hash;
        var raw = path.replace(/^#!?/, '');
        // always
        if (raw.charAt(0) !== '/') {
          raw = '/' + raw;
        }
        var formattedPath = self.formatPath(raw);
        if (formattedPath !== path) {
          location.replace(formattedPath);
          return;
        }
        // determine query
        // note it's possible to have queries in both the actual URL
        // and the hash fragment itself.
        var query = location.search && path.indexOf('?') > -1 ? '&' + location.search.slice(1) : location.search;
        self.onChange(path.replace(/^#!?/, '') + query);
      };
      window.addEventListener('hashchange', this.listener);
      this.listener();
    };

    HashHistory.prototype.stop = function stop() {
      window.removeEventListener('hashchange', this.listener);
    };

    HashHistory.prototype.go = function go(path, replace, append) {
      path = this.formatPath(path, append);
      if (replace) {
        location.replace(path);
      } else {
        location.hash = path;
      }
    };

    HashHistory.prototype.formatPath = function formatPath(path, append) {
      var isAbsoloute = path.charAt(0) === '/';
      var prefix = '#' + (this.hashbang ? '!' : '');
      return isAbsoloute ? prefix + path : prefix + resolvePath(location.hash.replace(/^#!?/, ''), path, append);
    };

    return HashHistory;
  })();

  var AbstractHistory = (function () {
    function AbstractHistory(_ref) {
      var onChange = _ref.onChange;
      babelHelpers.classCallCheck(this, AbstractHistory);

      this.onChange = onChange;
      this.currentPath = '/';
    }

    AbstractHistory.prototype.start = function start() {
      this.onChange('/');
    };

    AbstractHistory.prototype.stop = function stop() {
      // noop
    };

    AbstractHistory.prototype.go = function go(path, replace, append) {
      path = this.currentPath = this.formatPath(path, append);
      this.onChange(path);
    };

    AbstractHistory.prototype.formatPath = function formatPath(path, append) {
      return path.charAt(0) === '/' ? path : resolvePath(this.currentPath, path, append);
    };

    return AbstractHistory;
  })();

  /**
   * Determine the reusability of an existing router view.
   *
   * @param {Directive} view
   * @param {Object} handler
   * @param {Transition} transition
   */

  function canReuse(view, handler, transition) {
    var component = view.childVM;
    if (!component || !handler) {
      return false;
    }
    // important: check view.Component here because it may
    // have been changed in activate hook
    if (view.Component !== handler.component) {
      return false;
    }
    var canReuseFn = getRouteConfig(component, 'canReuse');
    return typeof canReuseFn === 'boolean' ? canReuseFn : canReuseFn ? canReuseFn.call(component, {
      to: transition.to,
      from: transition.from
    }) : true; // defaults to true
  }

  /**
   * Check if a component can deactivate.
   *
   * @param {Directive} view
   * @param {Transition} transition
   * @param {Function} next
   */

  function canDeactivate(view, transition, next) {
    var fromComponent = view.childVM;
    var hook = getRouteConfig(fromComponent, 'canDeactivate');
    if (!hook) {
      next();
    } else {
      transition.callHook(hook, fromComponent, next, {
        expectBoolean: true
      });
    }
  }

  /**
   * Check if a component can activate.
   *
   * @param {Object} handler
   * @param {Transition} transition
   * @param {Function} next
   */

  function canActivate(handler, transition, next) {
    resolveAsyncComponent(handler, function (Component) {
      // have to check due to async-ness
      if (transition.aborted) {
        return;
      }
      // determine if this component can be activated
      var hook = getRouteConfig(Component, 'canActivate');
      if (!hook) {
        next();
      } else {
        transition.callHook(hook, null, next, {
          expectBoolean: true
        });
      }
    });
  }

  /**
   * Call deactivate hooks for existing router-views.
   *
   * @param {Directive} view
   * @param {Transition} transition
   * @param {Function} next
   */

  function deactivate(view, transition, next) {
    var component = view.childVM;
    var hook = getRouteConfig(component, 'deactivate');
    if (!hook) {
      next();
    } else {
      transition.callHooks(hook, component, next);
    }
  }

  /**
   * Activate / switch component for a router-view.
   *
   * @param {Directive} view
   * @param {Transition} transition
   * @param {Number} depth
   * @param {Function} [cb]
   */

  function activate(view, transition, depth, cb, reuse) {
    var handler = transition.activateQueue[depth];
    if (!handler) {
      saveChildView(view);
      if (view._bound) {
        view.setComponent(null);
      }
      cb && cb();
      return;
    }

    var Component = view.Component = handler.component;
    var activateHook = getRouteConfig(Component, 'activate');
    var dataHook = getRouteConfig(Component, 'data');
    var waitForData = getRouteConfig(Component, 'waitForData');

    view.depth = depth;
    view.activated = false;

    var component = undefined;
    var loading = !!(dataHook && !waitForData);

    // "reuse" is a flag passed down when the parent view is
    // either reused via keep-alive or as a child of a kept-alive view.
    // of course we can only reuse if the current kept-alive instance
    // is of the correct type.
    reuse = reuse && view.childVM && view.childVM.constructor === Component;

    if (reuse) {
      // just reuse
      component = view.childVM;
      component.$loadingRouteData = loading;
    } else {
      saveChildView(view);

      // unbuild current component. this step also destroys
      // and removes all nested child views.
      view.unbuild(true);

      // build the new component. this will also create the
      // direct child view of the current one. it will register
      // itself as view.childView.
      component = view.build({
        _meta: {
          $loadingRouteData: loading
        },
        created: function created() {
          this._routerView = view;
        }
      });

      // handle keep-alive.
      // when a kept-alive child vm is restored, we need to
      // add its cached child views into the router's view list,
      // and also properly update current view's child view.
      if (view.keepAlive) {
        component.$loadingRouteData = loading;
        var cachedChildView = component._keepAliveRouterView;
        if (cachedChildView) {
          view.childView = cachedChildView;
          component._keepAliveRouterView = null;
        }
      }
    }

    // cleanup the component in case the transition is aborted
    // before the component is ever inserted.
    var cleanup = function cleanup() {
      component.$destroy();
    };

    // actually insert the component and trigger transition
    var insert = function insert() {
      if (reuse) {
        cb && cb();
        return;
      }
      var router = transition.router;
      if (router._rendered || router._transitionOnLoad) {
        view.transition(component);
      } else {
        // no transition on first render, manual transition
        /* istanbul ignore if */
        if (view.setCurrent) {
          // 0.12 compat
          view.setCurrent(component);
        } else {
          // 1.0
          view.childVM = component;
        }
        component.$before(view.anchor, null, false);
      }
      cb && cb();
    };

    var afterData = function afterData() {
      // activate the child view
      if (view.childView) {
        activate(view.childView, transition, depth + 1, null, reuse || view.keepAlive);
      }
      insert();
    };

    // called after activation hook is resolved
    var afterActivate = function afterActivate() {
      view.activated = true;
      if (dataHook && waitForData) {
        // wait until data loaded to insert
        loadData(component, transition, dataHook, afterData, cleanup);
      } else {
        // load data and insert at the same time
        if (dataHook) {
          loadData(component, transition, dataHook);
        }
        afterData();
      }
    };

    if (activateHook) {
      transition.callHooks(activateHook, component, afterActivate, {
        cleanup: cleanup,
        postActivate: true
      });
    } else {
      afterActivate();
    }
  }

  /**
   * Reuse a view, just reload data if necessary.
   *
   * @param {Directive} view
   * @param {Transition} transition
   */

  function reuse(view, transition) {
    var component = view.childVM;
    var dataHook = getRouteConfig(component, 'data');
    if (dataHook) {
      loadData(component, transition, dataHook);
    }
  }

  /**
   * Asynchronously load and apply data to component.
   *
   * @param {Vue} component
   * @param {Transition} transition
   * @param {Function} hook
   * @param {Function} cb
   * @param {Function} cleanup
   */

  function loadData(component, transition, hook, cb, cleanup) {
    component.$loadingRouteData = true;
    transition.callHooks(hook, component, function () {
      component.$loadingRouteData = false;
      component.$emit('route-data-loaded', component);
      cb && cb();
    }, {
      cleanup: cleanup,
      postActivate: true,
      processData: function processData(data) {
        // handle promise sugar syntax
        var promises = [];
        if (isPlainObject(data)) {
          Object.keys(data).forEach(function (key) {
            var val = data[key];
            if (isPromise(val)) {
              promises.push(val.then(function (resolvedVal) {
                component.$set(key, resolvedVal);
              }));
            } else {
              component.$set(key, val);
            }
          });
        }
        if (promises.length) {
          return promises[0].constructor.all(promises);
        }
      }
    });
  }

  /**
   * Save the child view for a kept-alive view so that
   * we can restore it when it is switched back to.
   *
   * @param {Directive} view
   */

  function saveChildView(view) {
    if (view.keepAlive && view.childVM && view.childView) {
      view.childVM._keepAliveRouterView = view.childView;
    }
    view.childView = null;
  }

  /**
   * Check plain object.
   *
   * @param {*} val
   */

  function isPlainObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
  }

  /**
   * A RouteTransition object manages the pipeline of a
   * router-view switching process. This is also the object
   * passed into user route hooks.
   *
   * @param {Router} router
   * @param {Route} to
   * @param {Route} from
   */

  var RouteTransition = (function () {
    function RouteTransition(router, to, from) {
      babelHelpers.classCallCheck(this, RouteTransition);

      this.router = router;
      this.to = to;
      this.from = from;
      this.next = null;
      this.aborted = false;
      this.done = false;
    }

    /**
     * Abort current transition and return to previous location.
     */

    RouteTransition.prototype.abort = function abort() {
      if (!this.aborted) {
        this.aborted = true;
        // if the root path throws an error during validation
        // on initial load, it gets caught in an infinite loop.
        var abortingOnLoad = !this.from.path && this.to.path === '/';
        if (!abortingOnLoad) {
          this.router.replace(this.from.path || '/');
        }
      }
    };

    /**
     * Abort current transition and redirect to a new location.
     *
     * @param {String} path
     */

    RouteTransition.prototype.redirect = function redirect(path) {
      if (!this.aborted) {
        this.aborted = true;
        if (typeof path === 'string') {
          path = mapParams(path, this.to.params, this.to.query);
        } else {
          path.params = path.params || this.to.params;
          path.query = path.query || this.to.query;
        }
        this.router.replace(path);
      }
    };

    /**
     * A router view transition's pipeline can be described as
     * follows, assuming we are transitioning from an existing
     * <router-view> chain [Component A, Component B] to a new
     * chain [Component A, Component C]:
     *
     *  A    A
     *  | => |
     *  B    C
     *
     * 1. Reusablity phase:
     *   -> canReuse(A, A)
     *   -> canReuse(B, C)
     *   -> determine new queues:
     *      - deactivation: [B]
     *      - activation: [C]
     *
     * 2. Validation phase:
     *   -> canDeactivate(B)
     *   -> canActivate(C)
     *
     * 3. Activation phase:
     *   -> deactivate(B)
     *   -> activate(C)
     *
     * Each of these steps can be asynchronous, and any
     * step can potentially abort the transition.
     *
     * @param {Function} cb
     */

    RouteTransition.prototype.start = function start(cb) {
      var transition = this;

      // determine the queue of views to deactivate
      var deactivateQueue = [];
      var view = this.router._rootView;
      while (view) {
        deactivateQueue.unshift(view);
        view = view.childView;
      }
      var reverseDeactivateQueue = deactivateQueue.slice().reverse();

      // determine the queue of route handlers to activate
      var activateQueue = this.activateQueue = toArray(this.to.matched).map(function (match) {
        return match.handler;
      });

      // 1. Reusability phase
      var i = undefined,
          reuseQueue = undefined;
      for (i = 0; i < reverseDeactivateQueue.length; i++) {
        if (!canReuse(reverseDeactivateQueue[i], activateQueue[i], transition)) {
          break;
        }
      }
      if (i > 0) {
        reuseQueue = reverseDeactivateQueue.slice(0, i);
        deactivateQueue = reverseDeactivateQueue.slice(i).reverse();
        activateQueue = activateQueue.slice(i);
      }

      // 2. Validation phase
      transition.runQueue(deactivateQueue, canDeactivate, function () {
        transition.runQueue(activateQueue, canActivate, function () {
          transition.runQueue(deactivateQueue, deactivate, function () {
            // 3. Activation phase

            // Update router current route
            transition.router._onTransitionValidated(transition);

            // trigger reuse for all reused views
            reuseQueue && reuseQueue.forEach(function (view) {
              return reuse(view, transition);
            });

            // the root of the chain that needs to be replaced
            // is the top-most non-reusable view.
            if (deactivateQueue.length) {
              var _view = deactivateQueue[deactivateQueue.length - 1];
              var depth = reuseQueue ? reuseQueue.length : 0;
              activate(_view, transition, depth, cb);
            } else {
              cb();
            }
          });
        });
      });
    };

    /**
     * Asynchronously and sequentially apply a function to a
     * queue.
     *
     * @param {Array} queue
     * @param {Function} fn
     * @param {Function} cb
     */

    RouteTransition.prototype.runQueue = function runQueue(queue, fn, cb) {
      var transition = this;
      step(0);
      function step(index) {
        if (index >= queue.length) {
          cb();
        } else {
          fn(queue[index], transition, function () {
            step(index + 1);
          });
        }
      }
    };

    /**
     * Call a user provided route transition hook and handle
     * the response (e.g. if the user returns a promise).
     *
     * If the user neither expects an argument nor returns a
     * promise, the hook is assumed to be synchronous.
     *
     * @param {Function} hook
     * @param {*} [context]
     * @param {Function} [cb]
     * @param {Object} [options]
     *                 - {Boolean} expectBoolean
     *                 - {Boolean} postActive
     *                 - {Function} processData
     *                 - {Function} cleanup
     */

    RouteTransition.prototype.callHook = function callHook(hook, context, cb) {
      var _ref = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

      var _ref$expectBoolean = _ref.expectBoolean;
      var expectBoolean = _ref$expectBoolean === undefined ? false : _ref$expectBoolean;
      var _ref$postActivate = _ref.postActivate;
      var postActivate = _ref$postActivate === undefined ? false : _ref$postActivate;
      var processData = _ref.processData;
      var cleanup = _ref.cleanup;

      var transition = this;
      var nextCalled = false;

      // abort the transition
      var abort = function abort() {
        cleanup && cleanup();
        transition.abort();
      };

      // handle errors
      var onError = function onError(err) {
        postActivate ? next() : abort();
        if (err && !transition.router._suppress) {
          warn$1('Uncaught error during transition: ');
          throw err instanceof Error ? err : new Error(err);
        }
      };

      // since promise swallows errors, we have to
      // throw it in the next tick...
      var onPromiseError = function onPromiseError(err) {
        try {
          onError(err);
        } catch (e) {
          setTimeout(function () {
            throw e;
          }, 0);
        }
      };

      // advance the transition to the next step
      var next = function next() {
        if (nextCalled) {
          warn$1('transition.next() should be called only once.');
          return;
        }
        nextCalled = true;
        if (transition.aborted) {
          cleanup && cleanup();
          return;
        }
        cb && cb();
      };

      var nextWithBoolean = function nextWithBoolean(res) {
        if (typeof res === 'boolean') {
          res ? next() : abort();
        } else if (isPromise(res)) {
          res.then(function (ok) {
            ok ? next() : abort();
          }, onPromiseError);
        } else if (!hook.length) {
          next();
        }
      };

      var nextWithData = function nextWithData(data) {
        var res = undefined;
        try {
          res = processData(data);
        } catch (err) {
          return onError(err);
        }
        if (isPromise(res)) {
          res.then(next, onPromiseError);
        } else {
          next();
        }
      };

      // expose a clone of the transition object, so that each
      // hook gets a clean copy and prevent the user from
      // messing with the internals.
      var exposed = {
        to: transition.to,
        from: transition.from,
        abort: abort,
        next: processData ? nextWithData : next,
        redirect: function redirect() {
          transition.redirect.apply(transition, arguments);
        }
      };

      // actually call the hook
      var res = undefined;
      try {
        res = hook.call(context, exposed);
      } catch (err) {
        return onError(err);
      }

      if (expectBoolean) {
        // boolean hooks
        nextWithBoolean(res);
      } else if (isPromise(res)) {
        // promise
        if (processData) {
          res.then(nextWithData, onPromiseError);
        } else {
          res.then(next, onPromiseError);
        }
      } else if (processData && isPlainOjbect(res)) {
        // data promise sugar
        nextWithData(res);
      } else if (!hook.length) {
        next();
      }
    };

    /**
     * Call a single hook or an array of async hooks in series.
     *
     * @param {Array} hooks
     * @param {*} context
     * @param {Function} cb
     * @param {Object} [options]
     */

    RouteTransition.prototype.callHooks = function callHooks(hooks, context, cb, options) {
      var _this = this;

      if (Array.isArray(hooks)) {
        this.runQueue(hooks, function (hook, _, next) {
          if (!_this.aborted) {
            _this.callHook(hook, context, next, options);
          }
        }, cb);
      } else {
        this.callHook(hooks, context, cb, options);
      }
    };

    return RouteTransition;
  })();

  function isPlainOjbect(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
  }

  function toArray(val) {
    return val ? Array.prototype.slice.call(val) : [];
  }

  var internalKeysRE = /^(component|subRoutes|fullPath)$/;

  /**
   * Route Context Object
   *
   * @param {String} path
   * @param {Router} router
   */

  var Route = function Route(path, router) {
    var _this = this;

    babelHelpers.classCallCheck(this, Route);

    var matched = router._recognizer.recognize(path);
    if (matched) {
      // copy all custom fields from route configs
      [].forEach.call(matched, function (match) {
        for (var key in match.handler) {
          if (!internalKeysRE.test(key)) {
            _this[key] = match.handler[key];
          }
        }
      });
      // set query and params
      this.query = matched.queryParams;
      this.params = [].reduce.call(matched, function (prev, cur) {
        if (cur.params) {
          for (var key in cur.params) {
            prev[key] = cur.params[key];
          }
        }
        return prev;
      }, {});
    }
    // expose path and router
    this.path = path;
    // for internal use
    this.matched = matched || router._notFoundHandler;
    // internal reference to router
    Object.defineProperty(this, 'router', {
      enumerable: false,
      value: router
    });
    // Important: freeze self to prevent observation
    Object.freeze(this);
  };

  function applyOverride (Vue) {
    var _Vue$util = Vue.util;
    var extend = _Vue$util.extend;
    var isArray = _Vue$util.isArray;
    var defineReactive = _Vue$util.defineReactive;

    // override Vue's init and destroy process to keep track of router instances
    var init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      options = options || {};
      var root = options._parent || options.parent || this;
      var router = root.$router;
      var route = root.$route;
      if (router) {
        // expose router
        this.$router = router;
        router._children.push(this);
        /* istanbul ignore if */
        if (this._defineMeta) {
          // 0.12
          this._defineMeta('$route', route);
        } else {
          // 1.0
          defineReactive(this, '$route', route);
        }
      }
      init.call(this, options);
    };

    var destroy = Vue.prototype._destroy;
    Vue.prototype._destroy = function () {
      if (!this._isBeingDestroyed && this.$router) {
        this.$router._children.$remove(this);
      }
      destroy.apply(this, arguments);
    };

    // 1.0 only: enable route mixins
    var strats = Vue.config.optionMergeStrategies;
    var hooksToMergeRE = /^(data|activate|deactivate)$/;

    if (strats) {
      strats.route = function (parentVal, childVal) {
        if (!childVal) return parentVal;
        if (!parentVal) return childVal;
        var ret = {};
        extend(ret, parentVal);
        for (var key in childVal) {
          var a = ret[key];
          var b = childVal[key];
          // for data, activate and deactivate, we need to merge them into
          // arrays similar to lifecycle hooks.
          if (a && hooksToMergeRE.test(key)) {
            ret[key] = (isArray(a) ? a : [a]).concat(b);
          } else {
            ret[key] = b;
          }
        }
        return ret;
      };
    }
  }

  function View (Vue) {

    var _ = Vue.util;
    var componentDef =
    // 0.12
    Vue.directive('_component') ||
    // 1.0
    Vue.internalDirectives.component;
    // <router-view> extends the internal component directive
    var viewDef = _.extend({}, componentDef);

    // with some overrides
    _.extend(viewDef, {

      _isRouterView: true,

      bind: function bind() {
        var route = this.vm.$route;
        /* istanbul ignore if */
        if (!route) {
          warn$1('<router-view> can only be used inside a ' + 'router-enabled app.');
          return;
        }
        // force dynamic directive so v-component doesn't
        // attempt to build right now
        this._isDynamicLiteral = true;
        // finally, init by delegating to v-component
        componentDef.bind.call(this);

        // locate the parent view
        var parentView = undefined;
        var parent = this.vm;
        while (parent) {
          if (parent._routerView) {
            parentView = parent._routerView;
            break;
          }
          parent = parent.$parent;
        }
        if (parentView) {
          // register self as a child of the parent view,
          // instead of activating now. This is so that the
          // child's activate hook is called after the
          // parent's has resolved.
          this.parentView = parentView;
          parentView.childView = this;
        } else {
          // this is the root view!
          var router = route.router;
          router._rootView = this;
        }

        // handle late-rendered view
        // two possibilities:
        // 1. root view rendered after transition has been
        //    validated;
        // 2. child view rendered after parent view has been
        //    activated.
        var transition = route.router._currentTransition;
        if (!parentView && transition.done || parentView && parentView.activated) {
          var depth = parentView ? parentView.depth + 1 : 0;
          activate(this, transition, depth);
        }
      },

      unbind: function unbind() {
        if (this.parentView) {
          this.parentView.childView = null;
        }
        componentDef.unbind.call(this);
      }
    });

    Vue.elementDirective('router-view', viewDef);
  }

  var trailingSlashRE = /\/$/;
  var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
  var queryStringRE = /\?.*$/;

  // install v-link, which provides navigation support for
  // HTML5 history mode
  function Link (Vue) {
    var _Vue$util = Vue.util;
    var _bind = _Vue$util.bind;
    var isObject = _Vue$util.isObject;
    var addClass = _Vue$util.addClass;
    var removeClass = _Vue$util.removeClass;

    var onPriority = Vue.directive('on').priority;
    var LINK_UPDATE = '__vue-router-link-update__';

    var activeId = 0;

    Vue.directive('link-active', {
      priority: 9999,
      bind: function bind() {
        var _this = this;

        var id = String(activeId++);
        // collect v-links contained within this element.
        // we need do this here before the parent-child relationship
        // gets messed up by terminal directives (if, for, components)
        var childLinks = this.el.querySelectorAll('[v-link]');
        for (var i = 0, l = childLinks.length; i < l; i++) {
          var link = childLinks[i];
          var existingId = link.getAttribute(LINK_UPDATE);
          var value = existingId ? existingId + ',' + id : id;
          // leave a mark on the link element which can be persisted
          // through fragment clones.
          link.setAttribute(LINK_UPDATE, value);
        }
        this.vm.$on(LINK_UPDATE, this.cb = function (link, path) {
          if (link.activeIds.indexOf(id) > -1) {
            link.updateClasses(path, _this.el);
          }
        });
      },
      unbind: function unbind() {
        this.vm.$off(LINK_UPDATE, this.cb);
      }
    });

    Vue.directive('link', {
      priority: onPriority - 2,

      bind: function bind() {
        var vm = this.vm;
        /* istanbul ignore if */
        if (!vm.$route) {
          warn$1('v-link can only be used inside a router-enabled app.');
          return;
        }
        this.router = vm.$route.router;
        // update things when the route changes
        this.unwatch = vm.$watch('$route', _bind(this.onRouteUpdate, this));
        // check v-link-active ids
        var activeIds = this.el.getAttribute(LINK_UPDATE);
        if (activeIds) {
          this.el.removeAttribute(LINK_UPDATE);
          this.activeIds = activeIds.split(',');
        }
        // no need to handle click if link expects to be opened
        // in a new window/tab.
        /* istanbul ignore if */
        if (this.el.tagName === 'A' && this.el.getAttribute('target') === '_blank') {
          return;
        }
        // handle click
        this.handler = _bind(this.onClick, this);
        this.el.addEventListener('click', this.handler);
      },

      update: function update(target) {
        this.target = target;
        if (isObject(target)) {
          this.append = target.append;
          this.exact = target.exact;
          this.prevActiveClass = this.activeClass;
          this.activeClass = target.activeClass;
        }
        this.onRouteUpdate(this.vm.$route);
      },

      onClick: function onClick(e) {
        // don't redirect with control keys
        /* istanbul ignore if */
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        // don't redirect when preventDefault called
        /* istanbul ignore if */
        if (e.defaultPrevented) return;
        // don't redirect on right click
        /* istanbul ignore if */
        if (e.button !== 0) return;

        var target = this.target;
        if (target) {
          // v-link with expression, just go
          e.preventDefault();
          this.router.go(target);
        } else {
          // no expression, delegate for an <a> inside
          var el = e.target;
          while (el.tagName !== 'A' && el !== this.el) {
            el = el.parentNode;
          }
          if (el.tagName === 'A' && sameOrigin(el)) {
            e.preventDefault();
            var path = el.pathname;
            if (this.router.history.root) {
              path = path.replace(this.router.history.rootRE, '');
            }
            this.router.go({
              path: path,
              replace: target && target.replace,
              append: target && target.append
            });
          }
        }
      },

      onRouteUpdate: function onRouteUpdate(route) {
        // router.stringifyPath is dependent on current route
        // and needs to be called again whenver route changes.
        var newPath = this.router.stringifyPath(this.target);
        if (this.path !== newPath) {
          this.path = newPath;
          this.updateActiveMatch();
          this.updateHref();
        }
        if (this.activeIds) {
          this.vm.$emit(LINK_UPDATE, this, route.path);
        } else {
          this.updateClasses(route.path, this.el);
        }
      },

      updateActiveMatch: function updateActiveMatch() {
        this.activeRE = this.path && !this.exact ? new RegExp('^' + this.path.replace(/\/$/, '').replace(queryStringRE, '').replace(regexEscapeRE, '\\$&') + '(\\/|$)') : null;
      },

      updateHref: function updateHref() {
        if (this.el.tagName !== 'A') {
          return;
        }
        var path = this.path;
        var router = this.router;
        var isAbsolute = path.charAt(0) === '/';
        // do not format non-hash relative paths
        var href = path && (router.mode === 'hash' || isAbsolute) ? router.history.formatPath(path, this.append) : path;
        if (href) {
          this.el.href = href;
        } else {
          this.el.removeAttribute('href');
        }
      },

      updateClasses: function updateClasses(path, el) {
        var activeClass = this.activeClass || this.router._linkActiveClass;
        // clear old class
        if (this.prevActiveClass && this.prevActiveClass !== activeClass) {
          toggleClasses(el, this.prevActiveClass, removeClass);
        }
        // remove query string before matching
        var dest = this.path.replace(queryStringRE, '');
        path = path.replace(queryStringRE, '');
        // add new class
        if (this.exact) {
          if (dest === path ||
          // also allow additional trailing slash
          dest.charAt(dest.length - 1) !== '/' && dest === path.replace(trailingSlashRE, '')) {
            toggleClasses(el, activeClass, addClass);
          } else {
            toggleClasses(el, activeClass, removeClass);
          }
        } else {
          if (this.activeRE && this.activeRE.test(path)) {
            toggleClasses(el, activeClass, addClass);
          } else {
            toggleClasses(el, activeClass, removeClass);
          }
        }
      },

      unbind: function unbind() {
        this.el.removeEventListener('click', this.handler);
        this.unwatch && this.unwatch();
      }
    });

    function sameOrigin(link) {
      return link.protocol === location.protocol && link.hostname === location.hostname && link.port === location.port;
    }

    // this function is copied from v-bind:class implementation until
    // we properly expose it...
    function toggleClasses(el, key, fn) {
      key = key.trim();
      if (key.indexOf(' ') === -1) {
        fn(el, key);
        return;
      }
      var keys = key.split(/\s+/);
      for (var i = 0, l = keys.length; i < l; i++) {
        fn(el, keys[i]);
      }
    }
  }

  var historyBackends = {
    abstract: AbstractHistory,
    hash: HashHistory,
    html5: HTML5History
  };

  // late bind during install
  var Vue = undefined;

  /**
   * Router constructor
   *
   * @param {Object} [options]
   */

  var Router = (function () {
    function Router() {
      var _this = this;

      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref$hashbang = _ref.hashbang;
      var hashbang = _ref$hashbang === undefined ? true : _ref$hashbang;
      var _ref$abstract = _ref.abstract;
      var abstract = _ref$abstract === undefined ? false : _ref$abstract;
      var _ref$history = _ref.history;
      var history = _ref$history === undefined ? false : _ref$history;
      var _ref$saveScrollPosition = _ref.saveScrollPosition;
      var saveScrollPosition = _ref$saveScrollPosition === undefined ? false : _ref$saveScrollPosition;
      var _ref$transitionOnLoad = _ref.transitionOnLoad;
      var transitionOnLoad = _ref$transitionOnLoad === undefined ? false : _ref$transitionOnLoad;
      var _ref$suppressTransitionError = _ref.suppressTransitionError;
      var suppressTransitionError = _ref$suppressTransitionError === undefined ? false : _ref$suppressTransitionError;
      var _ref$root = _ref.root;
      var root = _ref$root === undefined ? null : _ref$root;
      var _ref$linkActiveClass = _ref.linkActiveClass;
      var linkActiveClass = _ref$linkActiveClass === undefined ? 'v-link-active' : _ref$linkActiveClass;
      babelHelpers.classCallCheck(this, Router);

      /* istanbul ignore if */
      if (!Router.installed) {
        throw new Error('Please install the Router with Vue.use() before ' + 'creating an instance.');
      }

      // Vue instances
      this.app = null;
      this._children = [];

      // route recognizer
      this._recognizer = new RouteRecognizer();
      this._guardRecognizer = new RouteRecognizer();

      // state
      this._started = false;
      this._startCb = null;
      this._currentRoute = {};
      this._currentTransition = null;
      this._previousTransition = null;
      this._notFoundHandler = null;
      this._notFoundRedirect = null;
      this._beforeEachHooks = [];
      this._afterEachHooks = [];

      // trigger transition on initial render?
      this._rendered = false;
      this._transitionOnLoad = transitionOnLoad;

      // history mode
      this._root = root;
      this._abstract = abstract;
      this._hashbang = hashbang;

      // check if HTML5 history is available
      var hasPushState = typeof window !== 'undefined' && window.history && window.history.pushState;
      this._history = history && hasPushState;
      this._historyFallback = history && !hasPushState;

      // create history object
      var inBrowser = Vue.util.inBrowser;
      this.mode = !inBrowser || this._abstract ? 'abstract' : this._history ? 'html5' : 'hash';

      var History = historyBackends[this.mode];
      this.history = new History({
        root: root,
        hashbang: this._hashbang,
        onChange: function onChange(path, state, anchor) {
          _this._match(path, state, anchor);
        }
      });

      // other options
      this._saveScrollPosition = saveScrollPosition;
      this._linkActiveClass = linkActiveClass;
      this._suppress = suppressTransitionError;
    }

    /**
     * Allow directly passing components to a route
     * definition.
     *
     * @param {String} path
     * @param {Object} handler
     */

    // API ===================================================

    /**
    * Register a map of top-level paths.
    *
    * @param {Object} map
    */

    Router.prototype.map = function map(_map) {
      for (var route in _map) {
        this.on(route, _map[route]);
      }
      return this;
    };

    /**
     * Register a single root-level path
     *
     * @param {String} rootPath
     * @param {Object} handler
     *                 - {String} component
     *                 - {Object} [subRoutes]
     *                 - {Boolean} [forceRefresh]
     *                 - {Function} [before]
     *                 - {Function} [after]
     */

    Router.prototype.on = function on(rootPath, handler) {
      if (rootPath === '*') {
        this._notFound(handler);
      } else {
        this._addRoute(rootPath, handler, []);
      }
      return this;
    };

    /**
     * Set redirects.
     *
     * @param {Object} map
     */

    Router.prototype.redirect = function redirect(map) {
      for (var path in map) {
        this._addRedirect(path, map[path]);
      }
      return this;
    };

    /**
     * Set aliases.
     *
     * @param {Object} map
     */

    Router.prototype.alias = function alias(map) {
      for (var path in map) {
        this._addAlias(path, map[path]);
      }
      return this;
    };

    /**
     * Set global before hook.
     *
     * @param {Function} fn
     */

    Router.prototype.beforeEach = function beforeEach(fn) {
      this._beforeEachHooks.push(fn);
      return this;
    };

    /**
     * Set global after hook.
     *
     * @param {Function} fn
     */

    Router.prototype.afterEach = function afterEach(fn) {
      this._afterEachHooks.push(fn);
      return this;
    };

    /**
     * Navigate to a given path.
     * The path can be an object describing a named path in
     * the format of { name: '...', params: {}, query: {}}
     * The path is assumed to be already decoded, and will
     * be resolved against root (if provided)
     *
     * @param {String|Object} path
     * @param {Boolean} [replace]
     */

    Router.prototype.go = function go(path) {
      var replace = false;
      var append = false;
      if (Vue.util.isObject(path)) {
        replace = path.replace;
        append = path.append;
      }
      path = this.stringifyPath(path);
      if (path) {
        this.history.go(path, replace, append);
      }
    };

    /**
     * Short hand for replacing current path
     *
     * @param {String} path
     */

    Router.prototype.replace = function replace(path) {
      if (typeof path === 'string') {
        path = { path: path };
      }
      path.replace = true;
      this.go(path);
    };

    /**
     * Start the router.
     *
     * @param {VueConstructor} App
     * @param {String|Element} container
     * @param {Function} [cb]
     */

    Router.prototype.start = function start(App, container, cb) {
      /* istanbul ignore if */
      if (this._started) {
        warn$1('already started.');
        return;
      }
      this._started = true;
      this._startCb = cb;
      if (!this.app) {
        /* istanbul ignore if */
        if (!App || !container) {
          throw new Error('Must start vue-router with a component and a ' + 'root container.');
        }
        /* istanbul ignore if */
        if (App instanceof Vue) {
          throw new Error('Must start vue-router with a component, not a ' + 'Vue instance.');
        }
        this._appContainer = container;
        var Ctor = this._appConstructor = typeof App === 'function' ? App : Vue.extend(App);
        // give it a name for better debugging
        Ctor.options.name = Ctor.options.name || 'RouterApp';
      }

      // handle history fallback in browsers that do not
      // support HTML5 history API
      if (this._historyFallback) {
        var _location = window.location;
        var _history = new HTML5History({ root: this._root });
        var path = _history.root ? _location.pathname.replace(_history.rootRE, '') : _location.pathname;
        if (path && path !== '/') {
          _location.assign((_history.root || '') + '/' + this.history.formatPath(path) + _location.search);
          return;
        }
      }

      this.history.start();
    };

    /**
     * Stop listening to route changes.
     */

    Router.prototype.stop = function stop() {
      this.history.stop();
      this._started = false;
    };

    /**
     * Normalize named route object / string paths into
     * a string.
     *
     * @param {Object|String|Number} path
     * @return {String}
     */

    Router.prototype.stringifyPath = function stringifyPath(path) {
      var generatedPath = '';
      if (path && typeof path === 'object') {
        if (path.name) {
          var extend = Vue.util.extend;
          var currentParams = this._currentTransition && this._currentTransition.to.params;
          var targetParams = path.params || {};
          var params = currentParams ? extend(extend({}, currentParams), targetParams) : targetParams;
          generatedPath = encodeURI(this._recognizer.generate(path.name, params));
        } else if (path.path) {
          generatedPath = encodeURI(path.path);
        }
        if (path.query) {
          // note: the generated query string is pre-URL-encoded by the recognizer
          var query = this._recognizer.generateQueryString(path.query);
          if (generatedPath.indexOf('?') > -1) {
            generatedPath += '&' + query.slice(1);
          } else {
            generatedPath += query;
          }
        }
      } else {
        generatedPath = encodeURI(path ? path + '' : '');
      }
      return generatedPath;
    };

    // Internal methods ======================================

    /**
    * Add a route containing a list of segments to the internal
    * route recognizer. Will be called recursively to add all
    * possible sub-routes.
    *
    * @param {String} path
    * @param {Object} handler
    * @param {Array} segments
    */

    Router.prototype._addRoute = function _addRoute(path, handler, segments) {
      guardComponent(path, handler);
      handler.path = path;
      handler.fullPath = (segments.reduce(function (path, segment) {
        return path + segment.path;
      }, '') + path).replace('//', '/');
      segments.push({
        path: path,
        handler: handler
      });
      this._recognizer.add(segments, {
        as: handler.name
      });
      // add sub routes
      if (handler.subRoutes) {
        for (var subPath in handler.subRoutes) {
          // recursively walk all sub routes
          this._addRoute(subPath, handler.subRoutes[subPath],
          // pass a copy in recursion to avoid mutating
          // across branches
          segments.slice());
        }
      }
    };

    /**
     * Set the notFound route handler.
     *
     * @param {Object} handler
     */

    Router.prototype._notFound = function _notFound(handler) {
      guardComponent('*', handler);
      this._notFoundHandler = [{ handler: handler }];
    };

    /**
     * Add a redirect record.
     *
     * @param {String} path
     * @param {String} redirectPath
     */

    Router.prototype._addRedirect = function _addRedirect(path, redirectPath) {
      if (path === '*') {
        this._notFoundRedirect = redirectPath;
      } else {
        this._addGuard(path, redirectPath, this.replace);
      }
    };

    /**
     * Add an alias record.
     *
     * @param {String} path
     * @param {String} aliasPath
     */

    Router.prototype._addAlias = function _addAlias(path, aliasPath) {
      this._addGuard(path, aliasPath, this._match);
    };

    /**
     * Add a path guard.
     *
     * @param {String} path
     * @param {String} mappedPath
     * @param {Function} handler
     */

    Router.prototype._addGuard = function _addGuard(path, mappedPath, _handler) {
      var _this2 = this;

      this._guardRecognizer.add([{
        path: path,
        handler: function handler(match, query) {
          var realPath = mapParams(mappedPath, match.params, query);
          _handler.call(_this2, realPath);
        }
      }]);
    };

    /**
     * Check if a path matches any redirect records.
     *
     * @param {String} path
     * @return {Boolean} - if true, will skip normal match.
     */

    Router.prototype._checkGuard = function _checkGuard(path) {
      var matched = this._guardRecognizer.recognize(path, true);
      if (matched) {
        matched[0].handler(matched[0], matched.queryParams);
        return true;
      } else if (this._notFoundRedirect) {
        matched = this._recognizer.recognize(path);
        if (!matched) {
          this.replace(this._notFoundRedirect);
          return true;
        }
      }
    };

    /**
     * Match a URL path and set the route context on vm,
     * triggering view updates.
     *
     * @param {String} path
     * @param {Object} [state]
     * @param {String} [anchor]
     */

    Router.prototype._match = function _match(path, state, anchor) {
      var _this3 = this;

      if (this._checkGuard(path)) {
        return;
      }

      var currentRoute = this._currentRoute;
      var currentTransition = this._currentTransition;

      if (currentTransition) {
        if (currentTransition.to.path === path) {
          // do nothing if we have an active transition going to the same path
          return;
        } else if (currentRoute.path === path) {
          // We are going to the same path, but we also have an ongoing but
          // not-yet-validated transition. Abort that transition and reset to
          // prev transition.
          currentTransition.aborted = true;
          this._currentTransition = this._prevTransition;
          return;
        } else {
          // going to a totally different path. abort ongoing transition.
          currentTransition.aborted = true;
        }
      }

      // construct new route and transition context
      var route = new Route(path, this);
      var transition = new RouteTransition(this, route, currentRoute);

      // current transition is updated right now.
      // however, current route will only be updated after the transition has
      // been validated.
      this._prevTransition = currentTransition;
      this._currentTransition = transition;

      if (!this.app) {
        (function () {
          // initial render
          var router = _this3;
          _this3.app = new _this3._appConstructor({
            el: _this3._appContainer,
            created: function created() {
              this.$router = router;
            },
            _meta: {
              $route: route
            }
          });
        })();
      }

      // check global before hook
      var beforeHooks = this._beforeEachHooks;
      var startTransition = function startTransition() {
        transition.start(function () {
          _this3._postTransition(route, state, anchor);
        });
      };

      if (beforeHooks.length) {
        transition.runQueue(beforeHooks, function (hook, _, next) {
          if (transition === _this3._currentTransition) {
            transition.callHook(hook, null, next, {
              expectBoolean: true
            });
          }
        }, startTransition);
      } else {
        startTransition();
      }

      if (!this._rendered && this._startCb) {
        this._startCb.call(null);
      }

      // HACK:
      // set rendered to true after the transition start, so
      // that components that are acitvated synchronously know
      // whether it is the initial render.
      this._rendered = true;
    };

    /**
     * Set current to the new transition.
     * This is called by the transition object when the
     * validation of a route has succeeded.
     *
     * @param {Transition} transition
     */

    Router.prototype._onTransitionValidated = function _onTransitionValidated(transition) {
      // set current route
      var route = this._currentRoute = transition.to;
      // update route context for all children
      if (this.app.$route !== route) {
        this.app.$route = route;
        this._children.forEach(function (child) {
          child.$route = route;
        });
      }
      // call global after hook
      if (this._afterEachHooks.length) {
        this._afterEachHooks.forEach(function (hook) {
          return hook.call(null, {
            to: transition.to,
            from: transition.from
          });
        });
      }
      this._currentTransition.done = true;
    };

    /**
     * Handle stuff after the transition.
     *
     * @param {Route} route
     * @param {Object} [state]
     * @param {String} [anchor]
     */

    Router.prototype._postTransition = function _postTransition(route, state, anchor) {
      // handle scroll positions
      // saved scroll positions take priority
      // then we check if the path has an anchor
      var pos = state && state.pos;
      if (pos && this._saveScrollPosition) {
        Vue.nextTick(function () {
          window.scrollTo(pos.x, pos.y);
        });
      } else if (anchor) {
        Vue.nextTick(function () {
          var el = document.getElementById(anchor.slice(1));
          if (el) {
            window.scrollTo(window.scrollX, el.offsetTop);
          }
        });
      }
    };

    return Router;
  })();

  function guardComponent(path, handler) {
    var comp = handler.component;
    if (Vue.util.isPlainObject(comp)) {
      comp = handler.component = Vue.extend(comp);
    }
    /* istanbul ignore if */
    if (typeof comp !== 'function') {
      handler.component = null;
      warn$1('invalid component for route "' + path + '".');
    }
  }

  /* Installation */

  Router.installed = false;

  /**
   * Installation interface.
   * Install the necessary directives.
   */

  Router.install = function (externalVue) {
    /* istanbul ignore if */
    if (Router.installed) {
      warn$1('already installed.');
      return;
    }
    Vue = externalVue;
    applyOverride(Vue);
    View(Vue);
    Link(Vue);
    exports$1.Vue = Vue;
    Router.installed = true;
  };

  // auto install
  /* istanbul ignore if */
  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(Router);
  }

  return Router;

}));
},{}],6:[function(require,module,exports){
(function (process,global){
/*!
 * Vue.js v1.0.24
 * (c) 2016 Evan You
 * Released under the MIT License.
 */
'use strict';

function set(obj, key, val) {
  if (hasOwn(obj, key)) {
    obj[key] = val;
    return;
  }
  if (obj._isVue) {
    set(obj._data, key, val);
    return;
  }
  var ob = obj.__ob__;
  if (!ob) {
    obj[key] = val;
    return;
  }
  ob.convert(key, val);
  ob.dep.notify();
  if (ob.vms) {
    var i = ob.vms.length;
    while (i--) {
      var vm = ob.vms[i];
      vm._proxy(key);
      vm._digest();
    }
  }
  return val;
}

/**
 * Delete a property and trigger change if necessary.
 *
 * @param {Object} obj
 * @param {String} key
 */

function del(obj, key) {
  if (!hasOwn(obj, key)) {
    return;
  }
  delete obj[key];
  var ob = obj.__ob__;
  if (!ob) {
    if (obj._isVue) {
      delete obj._data[key];
      obj._digest();
    }
    return;
  }
  ob.dep.notify();
  if (ob.vms) {
    var i = ob.vms.length;
    while (i--) {
      var vm = ob.vms[i];
      vm._unproxy(key);
      vm._digest();
    }
  }
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * Check whether the object has the property.
 *
 * @param {Object} obj
 * @param {String} key
 * @return {Boolean}
 */

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

/**
 * Check if an expression is a literal value.
 *
 * @param {String} exp
 * @return {Boolean}
 */

var literalValueRE = /^\s?(true|false|-?[\d\.]+|'[^']*'|"[^"]*")\s?$/;

function isLiteral(exp) {
  return literalValueRE.test(exp);
}

/**
 * Check if a string starts with $ or _
 *
 * @param {String} str
 * @return {Boolean}
 */

function isReserved(str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F;
}

/**
 * Guard text output, make sure undefined outputs
 * empty string
 *
 * @param {*} value
 * @return {String}
 */

function _toString(value) {
  return value == null ? '' : value.toString();
}

/**
 * Check and convert possible numeric strings to numbers
 * before setting back to data
 *
 * @param {*} value
 * @return {*|Number}
 */

function toNumber(value) {
  if (typeof value !== 'string') {
    return value;
  } else {
    var parsed = Number(value);
    return isNaN(parsed) ? value : parsed;
  }
}

/**
 * Convert string boolean literals into real booleans.
 *
 * @param {*} value
 * @return {*|Boolean}
 */

function toBoolean(value) {
  return value === 'true' ? true : value === 'false' ? false : value;
}

/**
 * Strip quotes from a string
 *
 * @param {String} str
 * @return {String | false}
 */

function stripQuotes(str) {
  var a = str.charCodeAt(0);
  var b = str.charCodeAt(str.length - 1);
  return a === b && (a === 0x22 || a === 0x27) ? str.slice(1, -1) : str;
}

/**
 * Camelize a hyphen-delmited string.
 *
 * @param {String} str
 * @return {String}
 */

var camelizeRE = /-(\w)/g;

function camelize(str) {
  return str.replace(camelizeRE, toUpper);
}

function toUpper(_, c) {
  return c ? c.toUpperCase() : '';
}

/**
 * Hyphenate a camelCase string.
 *
 * @param {String} str
 * @return {String}
 */

var hyphenateRE = /([a-z\d])([A-Z])/g;

function hyphenate(str) {
  return str.replace(hyphenateRE, '$1-$2').toLowerCase();
}

/**
 * Converts hyphen/underscore/slash delimitered names into
 * camelized classNames.
 *
 * e.g. my-component => MyComponent
 *      some_else    => SomeElse
 *      some/comp    => SomeComp
 *
 * @param {String} str
 * @return {String}
 */

var classifyRE = /(?:^|[-_\/])(\w)/g;

function classify(str) {
  return str.replace(classifyRE, toUpper);
}

/**
 * Simple bind, faster than native
 *
 * @param {Function} fn
 * @param {Object} ctx
 * @return {Function}
 */

function bind(fn, ctx) {
  return function (a) {
    var l = arguments.length;
    return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
  };
}

/**
 * Convert an Array-like object to a real Array.
 *
 * @param {Array-like} list
 * @param {Number} [start] - start index
 * @return {Array}
 */

function toArray(list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret;
}

/**
 * Mix properties into target object.
 *
 * @param {Object} to
 * @param {Object} from
 */

function extend(to, from) {
  var keys = Object.keys(from);
  var i = keys.length;
  while (i--) {
    to[keys[i]] = from[keys[i]];
  }
  return to;
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 *
 * @param {*} obj
 * @return {Boolean}
 */

function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 *
 * @param {*} obj
 * @return {Boolean}
 */

var toString = Object.prototype.toString;
var OBJECT_STRING = '[object Object]';

function isPlainObject(obj) {
  return toString.call(obj) === OBJECT_STRING;
}

/**
 * Array type check.
 *
 * @param {*} obj
 * @return {Boolean}
 */

var isArray = Array.isArray;

/**
 * Define a property.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 * @param {Boolean} [enumerable]
 */

function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Debounce a function so it only gets called after the
 * input stops arriving after the given wait period.
 *
 * @param {Function} func
 * @param {Number} wait
 * @return {Function} - the debounced function
 */

function _debounce(func, wait) {
  var timeout, args, context, timestamp, result;
  var later = function later() {
    var last = Date.now() - timestamp;
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    }
  };
  return function () {
    context = this;
    args = arguments;
    timestamp = Date.now();
    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
    return result;
  };
}

/**
 * Manual indexOf because it's slightly faster than
 * native.
 *
 * @param {Array} arr
 * @param {*} obj
 */

function indexOf(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) return i;
  }
  return -1;
}

/**
 * Make a cancellable version of an async callback.
 *
 * @param {Function} fn
 * @return {Function}
 */

function cancellable(fn) {
  var cb = function cb() {
    if (!cb.cancelled) {
      return fn.apply(this, arguments);
    }
  };
  cb.cancel = function () {
    cb.cancelled = true;
  };
  return cb;
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 *
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 */

function looseEqual(a, b) {
  /* eslint-disable eqeqeq */
  return a == b || (isObject(a) && isObject(b) ? JSON.stringify(a) === JSON.stringify(b) : false);
  /* eslint-enable eqeqeq */
}

var hasProto = ('__proto__' in {});

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

// UA sniffing for working around browser-specific quirks
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIos = UA && /(iphone|ipad|ipod|ios)/i.test(UA);
var isWechat = UA && UA.indexOf('micromessenger') > 0;

var transitionProp = undefined;
var transitionEndEvent = undefined;
var animationProp = undefined;
var animationEndEvent = undefined;

// Transition property/event sniffing
if (inBrowser && !isIE9) {
  var isWebkitTrans = window.ontransitionend === undefined && window.onwebkittransitionend !== undefined;
  var isWebkitAnim = window.onanimationend === undefined && window.onwebkitanimationend !== undefined;
  transitionProp = isWebkitTrans ? 'WebkitTransition' : 'transition';
  transitionEndEvent = isWebkitTrans ? 'webkitTransitionEnd' : 'transitionend';
  animationProp = isWebkitAnim ? 'WebkitAnimation' : 'animation';
  animationEndEvent = isWebkitAnim ? 'webkitAnimationEnd' : 'animationend';
}

/**
 * Defer a task to execute it asynchronously. Ideally this
 * should be executed as a microtask, so we leverage
 * MutationObserver if it's available, and fallback to
 * setTimeout(0).
 *
 * @param {Function} cb
 * @param {Object} ctx
 */

var nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;
  function nextTickHandler() {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks = [];
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  /* istanbul ignore if */
  if (typeof MutationObserver !== 'undefined' && !(isWechat && isIos)) {
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(counter);
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = counter;
    };
  } else {
    // webpack attempts to inject a shim for setImmediate
    // if it is used as a global, so we have to work around that to
    // avoid bundling unnecessary code.
    var context = inBrowser ? window : typeof global !== 'undefined' ? global : {};
    timerFunc = context.setImmediate || setTimeout;
  }
  return function (cb, ctx) {
    var func = ctx ? function () {
      cb.call(ctx);
    } : cb;
    callbacks.push(func);
    if (pending) return;
    pending = true;
    timerFunc(nextTickHandler, 0);
  };
})();

var _Set = undefined;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && Set.toString().match(/native code/)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = function () {
    this.set = Object.create(null);
  };
  _Set.prototype.has = function (key) {
    return this.set[key] !== undefined;
  };
  _Set.prototype.add = function (key) {
    this.set[key] = 1;
  };
  _Set.prototype.clear = function () {
    this.set = Object.create(null);
  };
}

function Cache(limit) {
  this.size = 0;
  this.limit = limit;
  this.head = this.tail = undefined;
  this._keymap = Object.create(null);
}

var p = Cache.prototype;

/**
 * Put <value> into the cache associated with <key>.
 * Returns the entry which was removed to make room for
 * the new entry. Otherwise undefined is returned.
 * (i.e. if there was enough room already).
 *
 * @param {String} key
 * @param {*} value
 * @return {Entry|undefined}
 */

p.put = function (key, value) {
  var removed;
  if (this.size === this.limit) {
    removed = this.shift();
  }

  var entry = this.get(key, true);
  if (!entry) {
    entry = {
      key: key
    };
    this._keymap[key] = entry;
    if (this.tail) {
      this.tail.newer = entry;
      entry.older = this.tail;
    } else {
      this.head = entry;
    }
    this.tail = entry;
    this.size++;
  }
  entry.value = value;

  return removed;
};

/**
 * Purge the least recently used (oldest) entry from the
 * cache. Returns the removed entry or undefined if the
 * cache was empty.
 */

p.shift = function () {
  var entry = this.head;
  if (entry) {
    this.head = this.head.newer;
    this.head.older = undefined;
    entry.newer = entry.older = undefined;
    this._keymap[entry.key] = undefined;
    this.size--;
  }
  return entry;
};

/**
 * Get and register recent use of <key>. Returns the value
 * associated with <key> or undefined if not in cache.
 *
 * @param {String} key
 * @param {Boolean} returnEntry
 * @return {Entry|*}
 */

p.get = function (key, returnEntry) {
  var entry = this._keymap[key];
  if (entry === undefined) return;
  if (entry === this.tail) {
    return returnEntry ? entry : entry.value;
  }
  // HEAD--------------TAIL
  //   <.older   .newer>
  //  <--- add direction --
  //   A  B  C  <D>  E
  if (entry.newer) {
    if (entry === this.head) {
      this.head = entry.newer;
    }
    entry.newer.older = entry.older; // C <-- E.
  }
  if (entry.older) {
    entry.older.newer = entry.newer; // C. --> E
  }
  entry.newer = undefined; // D --x
  entry.older = this.tail; // D. --> E
  if (this.tail) {
    this.tail.newer = entry; // E. <-- D
  }
  this.tail = entry;
  return returnEntry ? entry : entry.value;
};

var cache$1 = new Cache(1000);
var filterTokenRE = /[^\s'"]+|'[^']*'|"[^"]*"/g;
var reservedArgRE = /^in$|^-?\d+/;

/**
 * Parser state
 */

var str;
var dir;
var c;
var prev;
var i;
var l;
var lastFilterIndex;
var inSingle;
var inDouble;
var curly;
var square;
var paren;
/**
 * Push a filter to the current directive object
 */

function pushFilter() {
  var exp = str.slice(lastFilterIndex, i).trim();
  var filter;
  if (exp) {
    filter = {};
    var tokens = exp.match(filterTokenRE);
    filter.name = tokens[0];
    if (tokens.length > 1) {
      filter.args = tokens.slice(1).map(processFilterArg);
    }
  }
  if (filter) {
    (dir.filters = dir.filters || []).push(filter);
  }
  lastFilterIndex = i + 1;
}

/**
 * Check if an argument is dynamic and strip quotes.
 *
 * @param {String} arg
 * @return {Object}
 */

function processFilterArg(arg) {
  if (reservedArgRE.test(arg)) {
    return {
      value: toNumber(arg),
      dynamic: false
    };
  } else {
    var stripped = stripQuotes(arg);
    var dynamic = stripped === arg;
    return {
      value: dynamic ? arg : stripped,
      dynamic: dynamic
    };
  }
}

/**
 * Parse a directive value and extract the expression
 * and its filters into a descriptor.
 *
 * Example:
 *
 * "a + 1 | uppercase" will yield:
 * {
 *   expression: 'a + 1',
 *   filters: [
 *     { name: 'uppercase', args: null }
 *   ]
 * }
 *
 * @param {String} s
 * @return {Object}
 */

function parseDirective(s) {
  var hit = cache$1.get(s);
  if (hit) {
    return hit;
  }

  // reset parser state
  str = s;
  inSingle = inDouble = false;
  curly = square = paren = 0;
  lastFilterIndex = 0;
  dir = {};

  for (i = 0, l = str.length; i < l; i++) {
    prev = c;
    c = str.charCodeAt(i);
    if (inSingle) {
      // check single quote
      if (c === 0x27 && prev !== 0x5C) inSingle = !inSingle;
    } else if (inDouble) {
      // check double quote
      if (c === 0x22 && prev !== 0x5C) inDouble = !inDouble;
    } else if (c === 0x7C && // pipe
    str.charCodeAt(i + 1) !== 0x7C && str.charCodeAt(i - 1) !== 0x7C) {
      if (dir.expression == null) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        dir.expression = str.slice(0, i).trim();
      } else {
        // already has filter
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22:
          inDouble = true;break; // "
        case 0x27:
          inSingle = true;break; // '
        case 0x28:
          paren++;break; // (
        case 0x29:
          paren--;break; // )
        case 0x5B:
          square++;break; // [
        case 0x5D:
          square--;break; // ]
        case 0x7B:
          curly++;break; // {
        case 0x7D:
          curly--;break; // }
      }
    }
  }

  if (dir.expression == null) {
    dir.expression = str.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  cache$1.put(s, dir);
  return dir;
}

var directive = Object.freeze({
  parseDirective: parseDirective
});

var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
var cache = undefined;
var tagRE = undefined;
var htmlRE = undefined;
/**
 * Escape a string so it can be used in a RegExp
 * constructor.
 *
 * @param {String} str
 */

function escapeRegex(str) {
  return str.replace(regexEscapeRE, '\\$&');
}

function compileRegex() {
  var open = escapeRegex(config.delimiters[0]);
  var close = escapeRegex(config.delimiters[1]);
  var unsafeOpen = escapeRegex(config.unsafeDelimiters[0]);
  var unsafeClose = escapeRegex(config.unsafeDelimiters[1]);
  tagRE = new RegExp(unsafeOpen + '((?:.|\\n)+?)' + unsafeClose + '|' + open + '((?:.|\\n)+?)' + close, 'g');
  htmlRE = new RegExp('^' + unsafeOpen + '.*' + unsafeClose + '$');
  // reset cache
  cache = new Cache(1000);
}

/**
 * Parse a template text string into an array of tokens.
 *
 * @param {String} text
 * @return {Array<Object> | null}
 *               - {String} type
 *               - {String} value
 *               - {Boolean} [html]
 *               - {Boolean} [oneTime]
 */

function parseText(text) {
  if (!cache) {
    compileRegex();
  }
  var hit = cache.get(text);
  if (hit) {
    return hit;
  }
  if (!tagRE.test(text)) {
    return null;
  }
  var tokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index, html, value, first, oneTime;
  /* eslint-disable no-cond-assign */
  while (match = tagRE.exec(text)) {
    /* eslint-enable no-cond-assign */
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokens.push({
        value: text.slice(lastIndex, index)
      });
    }
    // tag token
    html = htmlRE.test(match[0]);
    value = html ? match[1] : match[2];
    first = value.charCodeAt(0);
    oneTime = first === 42; // *
    value = oneTime ? value.slice(1) : value;
    tokens.push({
      tag: true,
      value: value.trim(),
      html: html,
      oneTime: oneTime
    });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push({
      value: text.slice(lastIndex)
    });
  }
  cache.put(text, tokens);
  return tokens;
}

/**
 * Format a list of tokens into an expression.
 * e.g. tokens parsed from 'a {{b}} c' can be serialized
 * into one single expression as '"a " + b + " c"'.
 *
 * @param {Array} tokens
 * @param {Vue} [vm]
 * @return {String}
 */

function tokensToExp(tokens, vm) {
  if (tokens.length > 1) {
    return tokens.map(function (token) {
      return formatToken(token, vm);
    }).join('+');
  } else {
    return formatToken(tokens[0], vm, true);
  }
}

/**
 * Format a single token.
 *
 * @param {Object} token
 * @param {Vue} [vm]
 * @param {Boolean} [single]
 * @return {String}
 */

function formatToken(token, vm, single) {
  return token.tag ? token.oneTime && vm ? '"' + vm.$eval(token.value) + '"' : inlineFilters(token.value, single) : '"' + token.value + '"';
}

/**
 * For an attribute with multiple interpolation tags,
 * e.g. attr="some-{{thing | filter}}", in order to combine
 * the whole thing into a single watchable expression, we
 * have to inline those filters. This function does exactly
 * that. This is a bit hacky but it avoids heavy changes
 * to directive parser and watcher mechanism.
 *
 * @param {String} exp
 * @param {Boolean} single
 * @return {String}
 */

var filterRE = /[^|]\|[^|]/;
function inlineFilters(exp, single) {
  if (!filterRE.test(exp)) {
    return single ? exp : '(' + exp + ')';
  } else {
    var dir = parseDirective(exp);
    if (!dir.filters) {
      return '(' + exp + ')';
    } else {
      return 'this._applyFilters(' + dir.expression + // value
      ',null,' + // oldValue (null for read)
      JSON.stringify(dir.filters) + // filter descriptors
      ',false)'; // write?
    }
  }
}

var text = Object.freeze({
  compileRegex: compileRegex,
  parseText: parseText,
  tokensToExp: tokensToExp
});

var delimiters = ['{{', '}}'];
var unsafeDelimiters = ['{{{', '}}}'];

var config = Object.defineProperties({

  /**
   * Whether to print debug messages.
   * Also enables stack trace for warnings.
   *
   * @type {Boolean}
   */

  debug: false,

  /**
   * Whether to suppress warnings.
   *
   * @type {Boolean}
   */

  silent: false,

  /**
   * Whether to use async rendering.
   */

  async: true,

  /**
   * Whether to warn against errors caught when evaluating
   * expressions.
   */

  warnExpressionErrors: true,

  /**
   * Whether to allow devtools inspection.
   * Disabled by default in production builds.
   */

  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Internal flag to indicate the delimiters have been
   * changed.
   *
   * @type {Boolean}
   */

  _delimitersChanged: true,

  /**
   * List of asset types that a component can own.
   *
   * @type {Array}
   */

  _assetTypes: ['component', 'directive', 'elementDirective', 'filter', 'transition', 'partial'],

  /**
   * prop binding modes
   */

  _propBindingModes: {
    ONE_WAY: 0,
    TWO_WAY: 1,
    ONE_TIME: 2
  },

  /**
   * Max circular updates allowed in a batcher flush cycle.
   */

  _maxUpdateCount: 100

}, {
  delimiters: { /**
                 * Interpolation delimiters. Changing these would trigger
                 * the text parser to re-compile the regular expressions.
                 *
                 * @type {Array<String>}
                 */

    get: function get() {
      return delimiters;
    },
    set: function set(val) {
      delimiters = val;
      compileRegex();
    },
    configurable: true,
    enumerable: true
  },
  unsafeDelimiters: {
    get: function get() {
      return unsafeDelimiters;
    },
    set: function set(val) {
      unsafeDelimiters = val;
      compileRegex();
    },
    configurable: true,
    enumerable: true
  }
});

var warn = undefined;
var formatComponentName = undefined;

if (process.env.NODE_ENV !== 'production') {
  (function () {
    var hasConsole = typeof console !== 'undefined';

    warn = function (msg, vm) {
      if (hasConsole && !config.silent) {
        console.error('[Vue warn]: ' + msg + (vm ? formatComponentName(vm) : ''));
      }
    };

    formatComponentName = function (vm) {
      var name = vm._isVue ? vm.$options.name : vm.name;
      return name ? ' (found in component: <' + hyphenate(name) + '>)' : '';
    };
  })();
}

/**
 * Append with transition.
 *
 * @param {Element} el
 * @param {Element} target
 * @param {Vue} vm
 * @param {Function} [cb]
 */

function appendWithTransition(el, target, vm, cb) {
  applyTransition(el, 1, function () {
    target.appendChild(el);
  }, vm, cb);
}

/**
 * InsertBefore with transition.
 *
 * @param {Element} el
 * @param {Element} target
 * @param {Vue} vm
 * @param {Function} [cb]
 */

function beforeWithTransition(el, target, vm, cb) {
  applyTransition(el, 1, function () {
    before(el, target);
  }, vm, cb);
}

/**
 * Remove with transition.
 *
 * @param {Element} el
 * @param {Vue} vm
 * @param {Function} [cb]
 */

function removeWithTransition(el, vm, cb) {
  applyTransition(el, -1, function () {
    remove(el);
  }, vm, cb);
}

/**
 * Apply transitions with an operation callback.
 *
 * @param {Element} el
 * @param {Number} direction
 *                  1: enter
 *                 -1: leave
 * @param {Function} op - the actual DOM operation
 * @param {Vue} vm
 * @param {Function} [cb]
 */

function applyTransition(el, direction, op, vm, cb) {
  var transition = el.__v_trans;
  if (!transition ||
  // skip if there are no js hooks and CSS transition is
  // not supported
  !transition.hooks && !transitionEndEvent ||
  // skip transitions for initial compile
  !vm._isCompiled ||
  // if the vm is being manipulated by a parent directive
  // during the parent's compilation phase, skip the
  // animation.
  vm.$parent && !vm.$parent._isCompiled) {
    op();
    if (cb) cb();
    return;
  }
  var action = direction > 0 ? 'enter' : 'leave';
  transition[action](op, cb);
}

var transition = Object.freeze({
  appendWithTransition: appendWithTransition,
  beforeWithTransition: beforeWithTransition,
  removeWithTransition: removeWithTransition,
  applyTransition: applyTransition
});

/**
 * Query an element selector if it's not an element already.
 *
 * @param {String|Element} el
 * @return {Element}
 */

function query(el) {
  if (typeof el === 'string') {
    var selector = el;
    el = document.querySelector(el);
    if (!el) {
      process.env.NODE_ENV !== 'production' && warn('Cannot find element: ' + selector);
    }
  }
  return el;
}

/**
 * Check if a node is in the document.
 * Note: document.documentElement.contains should work here
 * but always returns false for comment nodes in phantomjs,
 * making unit tests difficult. This is fixed by doing the
 * contains() check on the node's parentNode instead of
 * the node itself.
 *
 * @param {Node} node
 * @return {Boolean}
 */

function inDoc(node) {
  if (!node) return false;
  var doc = node.ownerDocument.documentElement;
  var parent = node.parentNode;
  return doc === node || doc === parent || !!(parent && parent.nodeType === 1 && doc.contains(parent));
}

/**
 * Get and remove an attribute from a node.
 *
 * @param {Node} node
 * @param {String} _attr
 */

function getAttr(node, _attr) {
  var val = node.getAttribute(_attr);
  if (val !== null) {
    node.removeAttribute(_attr);
  }
  return val;
}

/**
 * Get an attribute with colon or v-bind: prefix.
 *
 * @param {Node} node
 * @param {String} name
 * @return {String|null}
 */

function getBindAttr(node, name) {
  var val = getAttr(node, ':' + name);
  if (val === null) {
    val = getAttr(node, 'v-bind:' + name);
  }
  return val;
}

/**
 * Check the presence of a bind attribute.
 *
 * @param {Node} node
 * @param {String} name
 * @return {Boolean}
 */

function hasBindAttr(node, name) {
  return node.hasAttribute(name) || node.hasAttribute(':' + name) || node.hasAttribute('v-bind:' + name);
}

/**
 * Insert el before target
 *
 * @param {Element} el
 * @param {Element} target
 */

function before(el, target) {
  target.parentNode.insertBefore(el, target);
}

/**
 * Insert el after target
 *
 * @param {Element} el
 * @param {Element} target
 */

function after(el, target) {
  if (target.nextSibling) {
    before(el, target.nextSibling);
  } else {
    target.parentNode.appendChild(el);
  }
}

/**
 * Remove el from DOM
 *
 * @param {Element} el
 */

function remove(el) {
  el.parentNode.removeChild(el);
}

/**
 * Prepend el to target
 *
 * @param {Element} el
 * @param {Element} target
 */

function prepend(el, target) {
  if (target.firstChild) {
    before(el, target.firstChild);
  } else {
    target.appendChild(el);
  }
}

/**
 * Replace target with el
 *
 * @param {Element} target
 * @param {Element} el
 */

function replace(target, el) {
  var parent = target.parentNode;
  if (parent) {
    parent.replaceChild(el, target);
  }
}

/**
 * Add event listener shorthand.
 *
 * @param {Element} el
 * @param {String} event
 * @param {Function} cb
 * @param {Boolean} [useCapture]
 */

function on(el, event, cb, useCapture) {
  el.addEventListener(event, cb, useCapture);
}

/**
 * Remove event listener shorthand.
 *
 * @param {Element} el
 * @param {String} event
 * @param {Function} cb
 */

function off(el, event, cb) {
  el.removeEventListener(event, cb);
}

/**
 * For IE9 compat: when both class and :class are present
 * getAttribute('class') returns wrong value...
 *
 * @param {Element} el
 * @return {String}
 */

function getClass(el) {
  var classname = el.className;
  if (typeof classname === 'object') {
    classname = classname.baseVal || '';
  }
  return classname;
}

/**
 * In IE9, setAttribute('class') will result in empty class
 * if the element also has the :class attribute; However in
 * PhantomJS, setting `className` does not work on SVG elements...
 * So we have to do a conditional check here.
 *
 * @param {Element} el
 * @param {String} cls
 */

function setClass(el, cls) {
  /* istanbul ignore if */
  if (isIE9 && !/svg$/.test(el.namespaceURI)) {
    el.className = cls;
  } else {
    el.setAttribute('class', cls);
  }
}

/**
 * Add class with compatibility for IE & SVG
 *
 * @param {Element} el
 * @param {String} cls
 */

function addClass(el, cls) {
  if (el.classList) {
    el.classList.add(cls);
  } else {
    var cur = ' ' + getClass(el) + ' ';
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      setClass(el, (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for IE & SVG
 *
 * @param {Element} el
 * @param {String} cls
 */

function removeClass(el, cls) {
  if (el.classList) {
    el.classList.remove(cls);
  } else {
    var cur = ' ' + getClass(el) + ' ';
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    setClass(el, cur.trim());
  }
  if (!el.className) {
    el.removeAttribute('class');
  }
}

/**
 * Extract raw content inside an element into a temporary
 * container div
 *
 * @param {Element} el
 * @param {Boolean} asFragment
 * @return {Element|DocumentFragment}
 */

function extractContent(el, asFragment) {
  var child;
  var rawContent;
  /* istanbul ignore if */
  if (isTemplate(el) && isFragment(el.content)) {
    el = el.content;
  }
  if (el.hasChildNodes()) {
    trimNode(el);
    rawContent = asFragment ? document.createDocumentFragment() : document.createElement('div');
    /* eslint-disable no-cond-assign */
    while (child = el.firstChild) {
      /* eslint-enable no-cond-assign */
      rawContent.appendChild(child);
    }
  }
  return rawContent;
}

/**
 * Trim possible empty head/tail text and comment
 * nodes inside a parent.
 *
 * @param {Node} node
 */

function trimNode(node) {
  var child;
  /* eslint-disable no-sequences */
  while ((child = node.firstChild, isTrimmable(child))) {
    node.removeChild(child);
  }
  while ((child = node.lastChild, isTrimmable(child))) {
    node.removeChild(child);
  }
  /* eslint-enable no-sequences */
}

function isTrimmable(node) {
  return node && (node.nodeType === 3 && !node.data.trim() || node.nodeType === 8);
}

/**
 * Check if an element is a template tag.
 * Note if the template appears inside an SVG its tagName
 * will be in lowercase.
 *
 * @param {Element} el
 */

function isTemplate(el) {
  return el.tagName && el.tagName.toLowerCase() === 'template';
}

/**
 * Create an "anchor" for performing dom insertion/removals.
 * This is used in a number of scenarios:
 * - fragment instance
 * - v-html
 * - v-if
 * - v-for
 * - component
 *
 * @param {String} content
 * @param {Boolean} persist - IE trashes empty textNodes on
 *                            cloneNode(true), so in certain
 *                            cases the anchor needs to be
 *                            non-empty to be persisted in
 *                            templates.
 * @return {Comment|Text}
 */

function createAnchor(content, persist) {
  var anchor = config.debug ? document.createComment(content) : document.createTextNode(persist ? ' ' : '');
  anchor.__v_anchor = true;
  return anchor;
}

/**
 * Find a component ref attribute that starts with $.
 *
 * @param {Element} node
 * @return {String|undefined}
 */

var refRE = /^v-ref:/;

function findRef(node) {
  if (node.hasAttributes()) {
    var attrs = node.attributes;
    for (var i = 0, l = attrs.length; i < l; i++) {
      var name = attrs[i].name;
      if (refRE.test(name)) {
        return camelize(name.replace(refRE, ''));
      }
    }
  }
}

/**
 * Map a function to a range of nodes .
 *
 * @param {Node} node
 * @param {Node} end
 * @param {Function} op
 */

function mapNodeRange(node, end, op) {
  var next;
  while (node !== end) {
    next = node.nextSibling;
    op(node);
    node = next;
  }
  op(end);
}

/**
 * Remove a range of nodes with transition, store
 * the nodes in a fragment with correct ordering,
 * and call callback when done.
 *
 * @param {Node} start
 * @param {Node} end
 * @param {Vue} vm
 * @param {DocumentFragment} frag
 * @param {Function} cb
 */

function removeNodeRange(start, end, vm, frag, cb) {
  var done = false;
  var removed = 0;
  var nodes = [];
  mapNodeRange(start, end, function (node) {
    if (node === end) done = true;
    nodes.push(node);
    removeWithTransition(node, vm, onRemoved);
  });
  function onRemoved() {
    removed++;
    if (done && removed >= nodes.length) {
      for (var i = 0; i < nodes.length; i++) {
        frag.appendChild(nodes[i]);
      }
      cb && cb();
    }
  }
}

/**
 * Check if a node is a DocumentFragment.
 *
 * @param {Node} node
 * @return {Boolean}
 */

function isFragment(node) {
  return node && node.nodeType === 11;
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 *
 * @param {Element} el
 * @return {String}
 */

function getOuterHTML(el) {
  if (el.outerHTML) {
    return el.outerHTML;
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML;
  }
}

var commonTagRE = /^(div|p|span|img|a|b|i|br|ul|ol|li|h1|h2|h3|h4|h5|h6|code|pre|table|th|td|tr|form|label|input|select|option|nav|article|section|header|footer)$/i;
var reservedTagRE = /^(slot|partial|component)$/i;

var isUnknownElement = undefined;
if (process.env.NODE_ENV !== 'production') {
  isUnknownElement = function (el, tag) {
    if (tag.indexOf('-') > -1) {
      // http://stackoverflow.com/a/28210364/1070244
      return el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement;
    } else {
      return (/HTMLUnknownElement/.test(el.toString()) &&
        // Chrome returns unknown for several HTML5 elements.
        // https://code.google.com/p/chromium/issues/detail?id=540526
        !/^(data|time|rtc|rb)$/.test(tag)
      );
    }
  };
}

/**
 * Check if an element is a component, if yes return its
 * component id.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Object|undefined}
 */

function checkComponentAttr(el, options) {
  var tag = el.tagName.toLowerCase();
  var hasAttrs = el.hasAttributes();
  if (!commonTagRE.test(tag) && !reservedTagRE.test(tag)) {
    if (resolveAsset(options, 'components', tag)) {
      return { id: tag };
    } else {
      var is = hasAttrs && getIsBinding(el, options);
      if (is) {
        return is;
      } else if (process.env.NODE_ENV !== 'production') {
        var expectedTag = options._componentNameMap && options._componentNameMap[tag];
        if (expectedTag) {
          warn('Unknown custom element: <' + tag + '> - ' + 'did you mean <' + expectedTag + '>? ' + 'HTML is case-insensitive, remember to use kebab-case in templates.');
        } else if (isUnknownElement(el, tag)) {
          warn('Unknown custom element: <' + tag + '> - did you ' + 'register the component correctly? For recursive components, ' + 'make sure to provide the "name" option.');
        }
      }
    }
  } else if (hasAttrs) {
    return getIsBinding(el, options);
  }
}

/**
 * Get "is" binding from an element.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Object|undefined}
 */

function getIsBinding(el, options) {
  // dynamic syntax
  var exp = el.getAttribute('is');
  if (exp != null) {
    if (resolveAsset(options, 'components', exp)) {
      el.removeAttribute('is');
      return { id: exp };
    }
  } else {
    exp = getBindAttr(el, 'is');
    if (exp != null) {
      return { id: exp, dynamic: true };
    }
  }
}

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 *
 * All strategy functions follow the same signature:
 *
 * @param {*} parentVal
 * @param {*} childVal
 * @param {Vue} [vm]
 */

var strats = config.optionMergeStrategies = Object.create(null);

/**
 * Helper that recursively merges two data objects together.
 */

function mergeData(to, from) {
  var key, toVal, fromVal;
  for (key in from) {
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isObject(toVal) && isObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to;
}

/**
 * Data
 */

strats.data = function (parentVal, childVal, vm) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal;
    }
    if (typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
      return parentVal;
    }
    if (!parentVal) {
      return childVal;
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn() {
      return mergeData(childVal.call(this), parentVal.call(this));
    };
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn() {
      // instance merge
      var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
      var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData);
      } else {
        return defaultData;
      }
    };
  }
};

/**
 * El
 */

strats.el = function (parentVal, childVal, vm) {
  if (!vm && childVal && typeof childVal !== 'function') {
    process.env.NODE_ENV !== 'production' && warn('The "el" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
    return;
  }
  var ret = childVal || parentVal;
  // invoke the element factory if this is instance merge
  return vm && typeof ret === 'function' ? ret.call(vm) : ret;
};

/**
 * Hooks and param attributes are merged as arrays.
 */

strats.init = strats.created = strats.ready = strats.attached = strats.detached = strats.beforeCompile = strats.compiled = strats.beforeDestroy = strats.destroyed = strats.activate = function (parentVal, childVal) {
  return childVal ? parentVal ? parentVal.concat(childVal) : isArray(childVal) ? childVal : [childVal] : parentVal;
};

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */

function mergeAssets(parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal ? extend(res, guardArrayAssets(childVal)) : res;
}

config._assetTypes.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Events & Watchers.
 *
 * Events & watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */

strats.watch = strats.events = function (parentVal, childVal) {
  if (!childVal) return parentVal;
  if (!parentVal) return childVal;
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent ? parent.concat(child) : [child];
  }
  return ret;
};

/**
 * Other object hashes.
 */

strats.props = strats.methods = strats.computed = function (parentVal, childVal) {
  if (!childVal) return parentVal;
  if (!parentVal) return childVal;
  var ret = Object.create(null);
  extend(ret, parentVal);
  extend(ret, childVal);
  return ret;
};

/**
 * Default strategy.
 */

var defaultStrat = function defaultStrat(parentVal, childVal) {
  return childVal === undefined ? parentVal : childVal;
};

/**
 * Make sure component options get converted to actual
 * constructors.
 *
 * @param {Object} options
 */

function guardComponents(options) {
  if (options.components) {
    var components = options.components = guardArrayAssets(options.components);
    var ids = Object.keys(components);
    var def;
    if (process.env.NODE_ENV !== 'production') {
      var map = options._componentNameMap = {};
    }
    for (var i = 0, l = ids.length; i < l; i++) {
      var key = ids[i];
      if (commonTagRE.test(key) || reservedTagRE.test(key)) {
        process.env.NODE_ENV !== 'production' && warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + key);
        continue;
      }
      // record a all lowercase <-> kebab-case mapping for
      // possible custom element case error warning
      if (process.env.NODE_ENV !== 'production') {
        map[key.replace(/-/g, '').toLowerCase()] = hyphenate(key);
      }
      def = components[key];
      if (isPlainObject(def)) {
        components[key] = Vue.extend(def);
      }
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 *
 * @param {Object} options
 */

function guardProps(options) {
  var props = options.props;
  var i, val;
  if (isArray(props)) {
    options.props = {};
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        options.props[val] = null;
      } else if (val.name) {
        options.props[val.name] = val;
      }
    }
  } else if (isPlainObject(props)) {
    var keys = Object.keys(props);
    i = keys.length;
    while (i--) {
      val = props[keys[i]];
      if (typeof val === 'function') {
        props[keys[i]] = { type: val };
      }
    }
  }
}

/**
 * Guard an Array-format assets option and converted it
 * into the key-value Object format.
 *
 * @param {Object|Array} assets
 * @return {Object}
 */

function guardArrayAssets(assets) {
  if (isArray(assets)) {
    var res = {};
    var i = assets.length;
    var asset;
    while (i--) {
      asset = assets[i];
      var id = typeof asset === 'function' ? asset.options && asset.options.name || asset.id : asset.name || asset.id;
      if (!id) {
        process.env.NODE_ENV !== 'production' && warn('Array-syntax assets must provide a "name" or "id" field.');
      } else {
        res[id] = asset;
      }
    }
    return res;
  }
  return assets;
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 *
 * @param {Object} parent
 * @param {Object} child
 * @param {Vue} [vm] - if vm is present, indicates this is
 *                     an instantiation merge.
 */

function mergeOptions(parent, child, vm) {
  guardComponents(child);
  guardProps(child);
  if (process.env.NODE_ENV !== 'production') {
    if (child.propsData && !vm) {
      warn('propsData can only be used as an instantiation option.');
    }
  }
  var options = {};
  var key;
  if (child['extends']) {
    parent = typeof child['extends'] === 'function' ? mergeOptions(parent, child['extends'].options, vm) : mergeOptions(parent, child['extends'], vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField(key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options;
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 *
 * @param {Object} options
 * @param {String} type
 * @param {String} id
 * @param {Boolean} warnMissing
 * @return {Object|Function}
 */

function resolveAsset(options, type, id, warnMissing) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return;
  }
  var assets = options[type];
  var camelizedId;
  var res = assets[id] ||
  // camelCase ID
  assets[camelizedId = camelize(id)] ||
  // Pascal Case ID
  assets[camelizedId.charAt(0).toUpperCase() + camelizedId.slice(1)];
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options);
  }
  return res;
}

var uid$1 = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 *
 * @constructor
 */
function Dep() {
  this.id = uid$1++;
  this.subs = [];
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;

/**
 * Add a directive subscriber.
 *
 * @param {Directive} sub
 */

Dep.prototype.addSub = function (sub) {
  this.subs.push(sub);
};

/**
 * Remove a directive subscriber.
 *
 * @param {Directive} sub
 */

Dep.prototype.removeSub = function (sub) {
  this.subs.$remove(sub);
};

/**
 * Add self as a dependency to the target watcher.
 */

Dep.prototype.depend = function () {
  Dep.target.addDep(this);
};

/**
 * Notify all subscribers of a new value.
 */

Dep.prototype.notify = function () {
  // stablize the subscriber list first
  var subs = toArray(this.subs);
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto)

/**
 * Intercept mutating methods and emit events
 */

;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator() {
    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length;
    var args = new Array(i);
    while (i--) {
      args[i] = arguments[i];
    }
    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
        inserted = args;
        break;
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) ob.observeArray(inserted);
    // notify change
    ob.dep.notify();
    return result;
  });
});

/**
 * Swap the element at the given index with a new value
 * and emits corresponding event.
 *
 * @param {Number} index
 * @param {*} val
 * @return {*} - replaced element
 */

def(arrayProto, '$set', function $set(index, val) {
  if (index >= this.length) {
    this.length = Number(index) + 1;
  }
  return this.splice(index, 1, val)[0];
});

/**
 * Convenience method to remove the element at given index or target element reference.
 *
 * @param {*} item
 */

def(arrayProto, '$remove', function $remove(item) {
  /* istanbul ignore if */
  if (!this.length) return;
  var index = indexOf(this, item);
  if (index > -1) {
    return this.splice(index, 1);
  }
});

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However in certain cases, e.g.
 * v-for scope alias and props, we don't want to force conversion
 * because the value may be a nested value under a frozen data structure.
 *
 * So whenever we want to set a reactive property without forcing
 * conversion on the new value, we wrap that call inside this function.
 */

var shouldConvert = true;

function withoutConversion(fn) {
  shouldConvert = false;
  fn();
  shouldConvert = true;
}

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 *
 * @param {Array|Object} value
 * @constructor
 */

function Observer(value) {
  this.value = value;
  this.dep = new Dep();
  def(value, '__ob__', this);
  if (isArray(value)) {
    var augment = hasProto ? protoAugment : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
}

// Instance methods

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 *
 * @param {Object} obj
 */

Observer.prototype.walk = function (obj) {
  var keys = Object.keys(obj);
  for (var i = 0, l = keys.length; i < l; i++) {
    this.convert(keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 *
 * @param {Array} items
 */

Observer.prototype.observeArray = function (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

/**
 * Convert a property into getter/setter so we can emit
 * the events when the property is accessed/changed.
 *
 * @param {String} key
 * @param {*} val
 */

Observer.prototype.convert = function (key, val) {
  defineReactive(this.value, key, val);
};

/**
 * Add an owner vm, so that when $set/$delete mutations
 * happen we can notify owner vms to proxy the keys and
 * digest the watchers. This is only called when the object
 * is observed as an instance's root $data.
 *
 * @param {Vue} vm
 */

Observer.prototype.addVm = function (vm) {
  (this.vms || (this.vms = [])).push(vm);
};

/**
 * Remove an owner vm. This is called when the object is
 * swapped out as an instance's $data object.
 *
 * @param {Vue} vm
 */

Observer.prototype.removeVm = function (vm) {
  this.vms.$remove(vm);
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 *
 * @param {Object|Array} target
 * @param {Object} src
 */

function protoAugment(target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 *
 * @param {Object|Array} target
 * @param {Object} proto
 */

function copyAugment(target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 *
 * @param {*} value
 * @param {Vue} [vm]
 * @return {Observer|undefined}
 * @static
 */

function observe(value, vm) {
  if (!value || typeof value !== 'object') {
    return;
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (shouldConvert && (isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
    ob = new Observer(value);
  }
  if (ob && vm) {
    ob.addVm(vm);
  }
  return ob;
}

/**
 * Define a reactive property on an Object.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 */

function defineReactive(obj, key, val) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (isArray(value)) {
          for (var e, i = 0, l = value.length; i < l; i++) {
            e = value[i];
            e && e.__ob__ && e.__ob__.dep.depend();
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      var value = getter ? getter.call(obj) : val;
      if (newVal === value) {
        return;
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = observe(newVal);
      dep.notify();
    }
  });
}



var util = Object.freeze({
	defineReactive: defineReactive,
	set: set,
	del: del,
	hasOwn: hasOwn,
	isLiteral: isLiteral,
	isReserved: isReserved,
	_toString: _toString,
	toNumber: toNumber,
	toBoolean: toBoolean,
	stripQuotes: stripQuotes,
	camelize: camelize,
	hyphenate: hyphenate,
	classify: classify,
	bind: bind,
	toArray: toArray,
	extend: extend,
	isObject: isObject,
	isPlainObject: isPlainObject,
	def: def,
	debounce: _debounce,
	indexOf: indexOf,
	cancellable: cancellable,
	looseEqual: looseEqual,
	isArray: isArray,
	hasProto: hasProto,
	inBrowser: inBrowser,
	devtools: devtools,
	isIE9: isIE9,
	isAndroid: isAndroid,
	isIos: isIos,
	isWechat: isWechat,
	get transitionProp () { return transitionProp; },
	get transitionEndEvent () { return transitionEndEvent; },
	get animationProp () { return animationProp; },
	get animationEndEvent () { return animationEndEvent; },
	nextTick: nextTick,
	get _Set () { return _Set; },
	query: query,
	inDoc: inDoc,
	getAttr: getAttr,
	getBindAttr: getBindAttr,
	hasBindAttr: hasBindAttr,
	before: before,
	after: after,
	remove: remove,
	prepend: prepend,
	replace: replace,
	on: on,
	off: off,
	setClass: setClass,
	addClass: addClass,
	removeClass: removeClass,
	extractContent: extractContent,
	trimNode: trimNode,
	isTemplate: isTemplate,
	createAnchor: createAnchor,
	findRef: findRef,
	mapNodeRange: mapNodeRange,
	removeNodeRange: removeNodeRange,
	isFragment: isFragment,
	getOuterHTML: getOuterHTML,
	mergeOptions: mergeOptions,
	resolveAsset: resolveAsset,
	checkComponentAttr: checkComponentAttr,
	commonTagRE: commonTagRE,
	reservedTagRE: reservedTagRE,
	get warn () { return warn; }
});

var uid = 0;

function initMixin (Vue) {
  /**
   * The main init sequence. This is called for every
   * instance, including ones that are created from extended
   * constructors.
   *
   * @param {Object} options - this options object should be
   *                           the result of merging class
   *                           options and the options passed
   *                           in to the constructor.
   */

  Vue.prototype._init = function (options) {
    options = options || {};

    this.$el = null;
    this.$parent = options.parent;
    this.$root = this.$parent ? this.$parent.$root : this;
    this.$children = [];
    this.$refs = {}; // child vm references
    this.$els = {}; // element references
    this._watchers = []; // all watchers as an array
    this._directives = []; // all directives

    // a uid
    this._uid = uid++;

    // a flag to avoid this being observed
    this._isVue = true;

    // events bookkeeping
    this._events = {}; // registered callbacks
    this._eventsCount = {}; // for $broadcast optimization

    // fragment instance properties
    this._isFragment = false;
    this._fragment = // @type {DocumentFragment}
    this._fragmentStart = // @type {Text|Comment}
    this._fragmentEnd = null; // @type {Text|Comment}

    // lifecycle state
    this._isCompiled = this._isDestroyed = this._isReady = this._isAttached = this._isBeingDestroyed = this._vForRemoving = false;
    this._unlinkFn = null;

    // context:
    // if this is a transcluded component, context
    // will be the common parent vm of this instance
    // and its host.
    this._context = options._context || this.$parent;

    // scope:
    // if this is inside an inline v-for, the scope
    // will be the intermediate scope created for this
    // repeat fragment. this is used for linking props
    // and container directives.
    this._scope = options._scope;

    // fragment:
    // if this instance is compiled inside a Fragment, it
    // needs to reigster itself as a child of that fragment
    // for attach/detach to work properly.
    this._frag = options._frag;
    if (this._frag) {
      this._frag.children.push(this);
    }

    // push self into parent / transclusion host
    if (this.$parent) {
      this.$parent.$children.push(this);
    }

    // merge options.
    options = this.$options = mergeOptions(this.constructor.options, options, this);

    // set ref
    this._updateRef();

    // initialize data as empty object.
    // it will be filled up in _initData().
    this._data = {};

    // call init hook
    this._callHook('init');

    // initialize data observation and scope inheritance.
    this._initState();

    // setup event system and option events.
    this._initEvents();

    // call created hook
    this._callHook('created');

    // if `el` option is passed, start compilation.
    if (options.el) {
      this.$mount(options.el);
    }
  };
}

var pathCache = new Cache(1000);

// actions
var APPEND = 0;
var PUSH = 1;
var INC_SUB_PATH_DEPTH = 2;
var PUSH_SUB_PATH = 3;

// states
var BEFORE_PATH = 0;
var IN_PATH = 1;
var BEFORE_IDENT = 2;
var IN_IDENT = 3;
var IN_SUB_PATH = 4;
var IN_SINGLE_QUOTE = 5;
var IN_DOUBLE_QUOTE = 6;
var AFTER_PATH = 7;
var ERROR = 8;

var pathStateMachine = [];

pathStateMachine[BEFORE_PATH] = {
  'ws': [BEFORE_PATH],
  'ident': [IN_IDENT, APPEND],
  '[': [IN_SUB_PATH],
  'eof': [AFTER_PATH]
};

pathStateMachine[IN_PATH] = {
  'ws': [IN_PATH],
  '.': [BEFORE_IDENT],
  '[': [IN_SUB_PATH],
  'eof': [AFTER_PATH]
};

pathStateMachine[BEFORE_IDENT] = {
  'ws': [BEFORE_IDENT],
  'ident': [IN_IDENT, APPEND]
};

pathStateMachine[IN_IDENT] = {
  'ident': [IN_IDENT, APPEND],
  '0': [IN_IDENT, APPEND],
  'number': [IN_IDENT, APPEND],
  'ws': [IN_PATH, PUSH],
  '.': [BEFORE_IDENT, PUSH],
  '[': [IN_SUB_PATH, PUSH],
  'eof': [AFTER_PATH, PUSH]
};

pathStateMachine[IN_SUB_PATH] = {
  "'": [IN_SINGLE_QUOTE, APPEND],
  '"': [IN_DOUBLE_QUOTE, APPEND],
  '[': [IN_SUB_PATH, INC_SUB_PATH_DEPTH],
  ']': [IN_PATH, PUSH_SUB_PATH],
  'eof': ERROR,
  'else': [IN_SUB_PATH, APPEND]
};

pathStateMachine[IN_SINGLE_QUOTE] = {
  "'": [IN_SUB_PATH, APPEND],
  'eof': ERROR,
  'else': [IN_SINGLE_QUOTE, APPEND]
};

pathStateMachine[IN_DOUBLE_QUOTE] = {
  '"': [IN_SUB_PATH, APPEND],
  'eof': ERROR,
  'else': [IN_DOUBLE_QUOTE, APPEND]
};

/**
 * Determine the type of a character in a keypath.
 *
 * @param {Char} ch
 * @return {String} type
 */

function getPathCharType(ch) {
  if (ch === undefined) {
    return 'eof';
  }

  var code = ch.charCodeAt(0);

  switch (code) {
    case 0x5B: // [
    case 0x5D: // ]
    case 0x2E: // .
    case 0x22: // "
    case 0x27: // '
    case 0x30:
      // 0
      return ch;

    case 0x5F: // _
    case 0x24:
      // $
      return 'ident';

    case 0x20: // Space
    case 0x09: // Tab
    case 0x0A: // Newline
    case 0x0D: // Return
    case 0xA0: // No-break space
    case 0xFEFF: // Byte Order Mark
    case 0x2028: // Line Separator
    case 0x2029:
      // Paragraph Separator
      return 'ws';
  }

  // a-z, A-Z
  if (code >= 0x61 && code <= 0x7A || code >= 0x41 && code <= 0x5A) {
    return 'ident';
  }

  // 1-9
  if (code >= 0x31 && code <= 0x39) {
    return 'number';
  }

  return 'else';
}

/**
 * Format a subPath, return its plain form if it is
 * a literal string or number. Otherwise prepend the
 * dynamic indicator (*).
 *
 * @param {String} path
 * @return {String}
 */

function formatSubPath(path) {
  var trimmed = path.trim();
  // invalid leading 0
  if (path.charAt(0) === '0' && isNaN(path)) {
    return false;
  }
  return isLiteral(trimmed) ? stripQuotes(trimmed) : '*' + trimmed;
}

/**
 * Parse a string path into an array of segments
 *
 * @param {String} path
 * @return {Array|undefined}
 */

function parse(path) {
  var keys = [];
  var index = -1;
  var mode = BEFORE_PATH;
  var subPathDepth = 0;
  var c, newChar, key, type, transition, action, typeMap;

  var actions = [];

  actions[PUSH] = function () {
    if (key !== undefined) {
      keys.push(key);
      key = undefined;
    }
  };

  actions[APPEND] = function () {
    if (key === undefined) {
      key = newChar;
    } else {
      key += newChar;
    }
  };

  actions[INC_SUB_PATH_DEPTH] = function () {
    actions[APPEND]();
    subPathDepth++;
  };

  actions[PUSH_SUB_PATH] = function () {
    if (subPathDepth > 0) {
      subPathDepth--;
      mode = IN_SUB_PATH;
      actions[APPEND]();
    } else {
      subPathDepth = 0;
      key = formatSubPath(key);
      if (key === false) {
        return false;
      } else {
        actions[PUSH]();
      }
    }
  };

  function maybeUnescapeQuote() {
    var nextChar = path[index + 1];
    if (mode === IN_SINGLE_QUOTE && nextChar === "'" || mode === IN_DOUBLE_QUOTE && nextChar === '"') {
      index++;
      newChar = '\\' + nextChar;
      actions[APPEND]();
      return true;
    }
  }

  while (mode != null) {
    index++;
    c = path[index];

    if (c === '\\' && maybeUnescapeQuote()) {
      continue;
    }

    type = getPathCharType(c);
    typeMap = pathStateMachine[mode];
    transition = typeMap[type] || typeMap['else'] || ERROR;

    if (transition === ERROR) {
      return; // parse error
    }

    mode = transition[0];
    action = actions[transition[1]];
    if (action) {
      newChar = transition[2];
      newChar = newChar === undefined ? c : newChar;
      if (action() === false) {
        return;
      }
    }

    if (mode === AFTER_PATH) {
      keys.raw = path;
      return keys;
    }
  }
}

/**
 * External parse that check for a cache hit first
 *
 * @param {String} path
 * @return {Array|undefined}
 */

function parsePath(path) {
  var hit = pathCache.get(path);
  if (!hit) {
    hit = parse(path);
    if (hit) {
      pathCache.put(path, hit);
    }
  }
  return hit;
}

/**
 * Get from an object from a path string
 *
 * @param {Object} obj
 * @param {String} path
 */

function getPath(obj, path) {
  return parseExpression(path).get(obj);
}

/**
 * Warn against setting non-existent root path on a vm.
 */

var warnNonExistent;
if (process.env.NODE_ENV !== 'production') {
  warnNonExistent = function (path, vm) {
    warn('You are setting a non-existent path "' + path.raw + '" ' + 'on a vm instance. Consider pre-initializing the property ' + 'with the "data" option for more reliable reactivity ' + 'and better performance.', vm);
  };
}

/**
 * Set on an object from a path
 *
 * @param {Object} obj
 * @param {String | Array} path
 * @param {*} val
 */

function setPath(obj, path, val) {
  var original = obj;
  if (typeof path === 'string') {
    path = parse(path);
  }
  if (!path || !isObject(obj)) {
    return false;
  }
  var last, key;
  for (var i = 0, l = path.length; i < l; i++) {
    last = obj;
    key = path[i];
    if (key.charAt(0) === '*') {
      key = parseExpression(key.slice(1)).get.call(original, original);
    }
    if (i < l - 1) {
      obj = obj[key];
      if (!isObject(obj)) {
        obj = {};
        if (process.env.NODE_ENV !== 'production' && last._isVue) {
          warnNonExistent(path, last);
        }
        set(last, key, obj);
      }
    } else {
      if (isArray(obj)) {
        obj.$set(key, val);
      } else if (key in obj) {
        obj[key] = val;
      } else {
        if (process.env.NODE_ENV !== 'production' && obj._isVue) {
          warnNonExistent(path, obj);
        }
        set(obj, key, val);
      }
    }
  }
  return true;
}

var path = Object.freeze({
  parsePath: parsePath,
  getPath: getPath,
  setPath: setPath
});

var expressionCache = new Cache(1000);

var allowedKeywords = 'Math,Date,this,true,false,null,undefined,Infinity,NaN,' + 'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' + 'encodeURIComponent,parseInt,parseFloat';
var allowedKeywordsRE = new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)');

// keywords that don't make sense inside expressions
var improperKeywords = 'break,case,class,catch,const,continue,debugger,default,' + 'delete,do,else,export,extends,finally,for,function,if,' + 'import,in,instanceof,let,return,super,switch,throw,try,' + 'var,while,with,yield,enum,await,implements,package,' + 'protected,static,interface,private,public';
var improperKeywordsRE = new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)');

var wsRE = /\s/g;
var newlineRE = /\n/g;
var saveRE = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g;
var restoreRE = /"(\d+)"/g;
var pathTestRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
var identRE = /[^\w$\.](?:[A-Za-z_$][\w$]*)/g;
var booleanLiteralRE = /^(?:true|false)$/;

/**
 * Save / Rewrite / Restore
 *
 * When rewriting paths found in an expression, it is
 * possible for the same letter sequences to be found in
 * strings and Object literal property keys. Therefore we
 * remove and store these parts in a temporary array, and
 * restore them after the path rewrite.
 */

var saved = [];

/**
 * Save replacer
 *
 * The save regex can match two possible cases:
 * 1. An opening object literal
 * 2. A string
 * If matched as a plain string, we need to escape its
 * newlines, since the string needs to be preserved when
 * generating the function body.
 *
 * @param {String} str
 * @param {String} isString - str if matched as a string
 * @return {String} - placeholder with index
 */

function save(str, isString) {
  var i = saved.length;
  saved[i] = isString ? str.replace(newlineRE, '\\n') : str;
  return '"' + i + '"';
}

/**
 * Path rewrite replacer
 *
 * @param {String} raw
 * @return {String}
 */

function rewrite(raw) {
  var c = raw.charAt(0);
  var path = raw.slice(1);
  if (allowedKeywordsRE.test(path)) {
    return raw;
  } else {
    path = path.indexOf('"') > -1 ? path.replace(restoreRE, restore) : path;
    return c + 'scope.' + path;
  }
}

/**
 * Restore replacer
 *
 * @param {String} str
 * @param {String} i - matched save index
 * @return {String}
 */

function restore(str, i) {
  return saved[i];
}

/**
 * Rewrite an expression, prefixing all path accessors with
 * `scope.` and generate getter/setter functions.
 *
 * @param {String} exp
 * @return {Function}
 */

function compileGetter(exp) {
  if (improperKeywordsRE.test(exp)) {
    process.env.NODE_ENV !== 'production' && warn('Avoid using reserved keywords in expression: ' + exp);
  }
  // reset state
  saved.length = 0;
  // save strings and object literal keys
  var body = exp.replace(saveRE, save).replace(wsRE, '');
  // rewrite all paths
  // pad 1 space here becaue the regex matches 1 extra char
  body = (' ' + body).replace(identRE, rewrite).replace(restoreRE, restore);
  return makeGetterFn(body);
}

/**
 * Build a getter function. Requires eval.
 *
 * We isolate the try/catch so it doesn't affect the
 * optimization of the parse function when it is not called.
 *
 * @param {String} body
 * @return {Function|undefined}
 */

function makeGetterFn(body) {
  try {
    /* eslint-disable no-new-func */
    return new Function('scope', 'return ' + body + ';');
    /* eslint-enable no-new-func */
  } catch (e) {
    process.env.NODE_ENV !== 'production' && warn('Invalid expression. ' + 'Generated function body: ' + body);
  }
}

/**
 * Compile a setter function for the expression.
 *
 * @param {String} exp
 * @return {Function|undefined}
 */

function compileSetter(exp) {
  var path = parsePath(exp);
  if (path) {
    return function (scope, val) {
      setPath(scope, path, val);
    };
  } else {
    process.env.NODE_ENV !== 'production' && warn('Invalid setter expression: ' + exp);
  }
}

/**
 * Parse an expression into re-written getter/setters.
 *
 * @param {String} exp
 * @param {Boolean} needSet
 * @return {Function}
 */

function parseExpression(exp, needSet) {
  exp = exp.trim();
  // try cache
  var hit = expressionCache.get(exp);
  if (hit) {
    if (needSet && !hit.set) {
      hit.set = compileSetter(hit.exp);
    }
    return hit;
  }
  var res = { exp: exp };
  res.get = isSimplePath(exp) && exp.indexOf('[') < 0
  // optimized super simple getter
  ? makeGetterFn('scope.' + exp)
  // dynamic getter
  : compileGetter(exp);
  if (needSet) {
    res.set = compileSetter(exp);
  }
  expressionCache.put(exp, res);
  return res;
}

/**
 * Check if an expression is a simple path.
 *
 * @param {String} exp
 * @return {Boolean}
 */

function isSimplePath(exp) {
  return pathTestRE.test(exp) &&
  // don't treat true/false as paths
  !booleanLiteralRE.test(exp) &&
  // Math constants e.g. Math.PI, Math.E etc.
  exp.slice(0, 5) !== 'Math.';
}

var expression = Object.freeze({
  parseExpression: parseExpression,
  isSimplePath: isSimplePath
});

// we have two separate queues: one for directive updates
// and one for user watcher registered via $watch().
// we want to guarantee directive updates to be called
// before user watchers so that when user watchers are
// triggered, the DOM would have already been in updated
// state.

var queue = [];
var userQueue = [];
var has = {};
var circular = {};
var waiting = false;

/**
 * Reset the batcher's state.
 */

function resetBatcherState() {
  queue.length = 0;
  userQueue.length = 0;
  has = {};
  circular = {};
  waiting = false;
}

/**
 * Flush both queues and run the watchers.
 */

function flushBatcherQueue() {
  var _again = true;

  _function: while (_again) {
    _again = false;

    runBatcherQueue(queue);
    runBatcherQueue(userQueue);
    // user watchers triggered more watchers,
    // keep flushing until it depletes
    if (queue.length) {
      _again = true;
      continue _function;
    }
    // dev tool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
      devtools.emit('flush');
    }
    resetBatcherState();
  }
}

/**
 * Run the watchers in a single queue.
 *
 * @param {Array} queue
 */

function runBatcherQueue(queue) {
  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (var i = 0; i < queue.length; i++) {
    var watcher = queue[i];
    var id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > config._maxUpdateCount) {
        warn('You may have an infinite update loop for watcher ' + 'with expression "' + watcher.expression + '"', watcher.vm);
        break;
      }
    }
  }
  queue.length = 0;
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 *
 * @param {Watcher} watcher
 *   properties:
 *   - {Number} id
 *   - {Function} run
 */

function pushWatcher(watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    // push watcher into appropriate queue
    var q = watcher.user ? userQueue : queue;
    has[id] = q.length;
    q.push(watcher);
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushBatcherQueue);
    }
  }
}

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 *
 * @param {Vue} vm
 * @param {String|Function} expOrFn
 * @param {Function} cb
 * @param {Object} options
 *                 - {Array} filters
 *                 - {Boolean} twoWay
 *                 - {Boolean} deep
 *                 - {Boolean} user
 *                 - {Boolean} sync
 *                 - {Boolean} lazy
 *                 - {Function} [preProcess]
 *                 - {Function} [postProcess]
 * @constructor
 */
function Watcher(vm, expOrFn, cb, options) {
  // mix in options
  if (options) {
    extend(this, options);
  }
  var isFn = typeof expOrFn === 'function';
  this.vm = vm;
  vm._watchers.push(this);
  this.expression = expOrFn;
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.prevError = null; // for async error stacks
  // parse expression for getter/setter
  if (isFn) {
    this.getter = expOrFn;
    this.setter = undefined;
  } else {
    var res = parseExpression(expOrFn, this.twoWay);
    this.getter = res.get;
    this.setter = res.set;
  }
  this.value = this.lazy ? undefined : this.get();
  // state for avoiding false triggers for deep and Array
  // watchers during vm._digest()
  this.queued = this.shallow = false;
}

/**
 * Evaluate the getter, and re-collect dependencies.
 */

Watcher.prototype.get = function () {
  this.beforeGet();
  var scope = this.scope || this.vm;
  var value;
  try {
    value = this.getter.call(scope, scope);
  } catch (e) {
    if (process.env.NODE_ENV !== 'production' && config.warnExpressionErrors) {
      warn('Error when evaluating expression ' + '"' + this.expression + '": ' + e.toString(), this.vm);
    }
  }
  // "touch" every property so they are all tracked as
  // dependencies for deep watching
  if (this.deep) {
    traverse(value);
  }
  if (this.preProcess) {
    value = this.preProcess(value);
  }
  if (this.filters) {
    value = scope._applyFilters(value, null, this.filters, false);
  }
  if (this.postProcess) {
    value = this.postProcess(value);
  }
  this.afterGet();
  return value;
};

/**
 * Set the corresponding value with the setter.
 *
 * @param {*} value
 */

Watcher.prototype.set = function (value) {
  var scope = this.scope || this.vm;
  if (this.filters) {
    value = scope._applyFilters(value, this.value, this.filters, true);
  }
  try {
    this.setter.call(scope, scope, value);
  } catch (e) {
    if (process.env.NODE_ENV !== 'production' && config.warnExpressionErrors) {
      warn('Error when evaluating setter ' + '"' + this.expression + '": ' + e.toString(), this.vm);
    }
  }
  // two-way sync for v-for alias
  var forContext = scope.$forContext;
  if (forContext && forContext.alias === this.expression) {
    if (forContext.filters) {
      process.env.NODE_ENV !== 'production' && warn('It seems you are using two-way binding on ' + 'a v-for alias (' + this.expression + '), and the ' + 'v-for has filters. This will not work properly. ' + 'Either remove the filters or use an array of ' + 'objects and bind to object properties instead.', this.vm);
      return;
    }
    forContext._withLock(function () {
      if (scope.$key) {
        // original is an object
        forContext.rawValue[scope.$key] = value;
      } else {
        forContext.rawValue.$set(scope.$index, value);
      }
    });
  }
};

/**
 * Prepare for dependency collection.
 */

Watcher.prototype.beforeGet = function () {
  Dep.target = this;
};

/**
 * Add a dependency to this directive.
 *
 * @param {Dep} dep
 */

Watcher.prototype.addDep = function (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */

Watcher.prototype.afterGet = function () {
  Dep.target = null;
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 *
 * @param {Boolean} shallow
 */

Watcher.prototype.update = function (shallow) {
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync || !config.async) {
    this.run();
  } else {
    // if queued, only overwrite shallow with non-shallow,
    // but not the other way around.
    this.shallow = this.queued ? shallow ? this.shallow : false : !!shallow;
    this.queued = true;
    // record before-push error stack in debug mode
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.debug) {
      this.prevError = new Error('[vue] async stack trace');
    }
    pushWatcher(this);
  }
};

/**
 * Batcher job interface.
 * Will be called by the batcher.
 */

Watcher.prototype.run = function () {
  if (this.active) {
    var value = this.get();
    if (value !== this.value ||
    // Deep watchers and watchers on Object/Arrays should fire even
    // when the value is the same, because the value may
    // have mutated; but only do so if this is a
    // non-shallow update (caused by a vm digest).
    (isObject(value) || this.deep) && !this.shallow) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      // in debug + async mode, when a watcher callbacks
      // throws, we also throw the saved before-push error
      // so the full cross-tick stack trace is available.
      var prevError = this.prevError;
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.debug && prevError) {
        this.prevError = null;
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          nextTick(function () {
            throw prevError;
          }, 0);
          throw e;
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
    this.queued = this.shallow = false;
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */

Watcher.prototype.evaluate = function () {
  // avoid overwriting another watcher that is being
  // collected.
  var current = Dep.target;
  this.value = this.get();
  this.dirty = false;
  Dep.target = current;
};

/**
 * Depend on all deps collected by this watcher.
 */

Watcher.prototype.depend = function () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subcriber list.
 */

Watcher.prototype.teardown = function () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed or is performing a v-for
    // re-render (the watcher list is then filtered by v-for).
    if (!this.vm._isBeingDestroyed && !this.vm._vForRemoving) {
      this.vm._watchers.$remove(this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
    this.vm = this.cb = this.value = null;
  }
};

/**
 * Recrusively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 *
 * @param {*} val
 */

var seenObjects = new _Set();
function traverse(val, seen) {
  var i = undefined,
      keys = undefined;
  if (!seen) {
    seen = seenObjects;
    seen.clear();
  }
  var isA = isArray(val);
  var isO = isObject(val);
  if (isA || isO) {
    if (val.__ob__) {
      var depId = val.__ob__.dep.id;
      if (seen.has(depId)) {
        return;
      } else {
        seen.add(depId);
      }
    }
    if (isA) {
      i = val.length;
      while (i--) traverse(val[i], seen);
    } else if (isO) {
      keys = Object.keys(val);
      i = keys.length;
      while (i--) traverse(val[keys[i]], seen);
    }
  }
}

var text$1 = {

  bind: function bind() {
    this.attr = this.el.nodeType === 3 ? 'data' : 'textContent';
  },

  update: function update(value) {
    this.el[this.attr] = _toString(value);
  }
};

var templateCache = new Cache(1000);
var idSelectorCache = new Cache(1000);

var map = {
  efault: [0, '', ''],
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>']
};

map.td = map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option = map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead = map.tbody = map.colgroup = map.caption = map.tfoot = [1, '<table>', '</table>'];

map.g = map.defs = map.symbol = map.use = map.image = map.text = map.circle = map.ellipse = map.line = map.path = map.polygon = map.polyline = map.rect = [1, '<svg ' + 'xmlns="http://www.w3.org/2000/svg" ' + 'xmlns:xlink="http://www.w3.org/1999/xlink" ' + 'xmlns:ev="http://www.w3.org/2001/xml-events"' + 'version="1.1">', '</svg>'];

/**
 * Check if a node is a supported template node with a
 * DocumentFragment content.
 *
 * @param {Node} node
 * @return {Boolean}
 */

function isRealTemplate(node) {
  return isTemplate(node) && isFragment(node.content);
}

var tagRE$1 = /<([\w:-]+)/;
var entityRE = /&#?\w+?;/;

/**
 * Convert a string template to a DocumentFragment.
 * Determines correct wrapping by tag types. Wrapping
 * strategy found in jQuery & component/domify.
 *
 * @param {String} templateString
 * @param {Boolean} raw
 * @return {DocumentFragment}
 */

function stringToFragment(templateString, raw) {
  // try a cache hit first
  var cacheKey = raw ? templateString : templateString.trim();
  var hit = templateCache.get(cacheKey);
  if (hit) {
    return hit;
  }

  var frag = document.createDocumentFragment();
  var tagMatch = templateString.match(tagRE$1);
  var entityMatch = entityRE.test(templateString);

  if (!tagMatch && !entityMatch) {
    // text only, return a single text node.
    frag.appendChild(document.createTextNode(templateString));
  } else {
    var tag = tagMatch && tagMatch[1];
    var wrap = map[tag] || map.efault;
    var depth = wrap[0];
    var prefix = wrap[1];
    var suffix = wrap[2];
    var node = document.createElement('div');

    node.innerHTML = prefix + templateString + suffix;
    while (depth--) {
      node = node.lastChild;
    }

    var child;
    /* eslint-disable no-cond-assign */
    while (child = node.firstChild) {
      /* eslint-enable no-cond-assign */
      frag.appendChild(child);
    }
  }
  if (!raw) {
    trimNode(frag);
  }
  templateCache.put(cacheKey, frag);
  return frag;
}

/**
 * Convert a template node to a DocumentFragment.
 *
 * @param {Node} node
 * @return {DocumentFragment}
 */

function nodeToFragment(node) {
  // if its a template tag and the browser supports it,
  // its content is already a document fragment. However, iOS Safari has
  // bug when using directly cloned template content with touch
  // events and can cause crashes when the nodes are removed from DOM, so we
  // have to treat template elements as string templates. (#2805)
  /* istanbul ignore if */
  if (isRealTemplate(node)) {
    return stringToFragment(node.innerHTML);
  }
  // script template
  if (node.tagName === 'SCRIPT') {
    return stringToFragment(node.textContent);
  }
  // normal node, clone it to avoid mutating the original
  var clonedNode = cloneNode(node);
  var frag = document.createDocumentFragment();
  var child;
  /* eslint-disable no-cond-assign */
  while (child = clonedNode.firstChild) {
    /* eslint-enable no-cond-assign */
    frag.appendChild(child);
  }
  trimNode(frag);
  return frag;
}

// Test for the presence of the Safari template cloning bug
// https://bugs.webkit.org/showug.cgi?id=137755
var hasBrokenTemplate = (function () {
  /* istanbul ignore else */
  if (inBrowser) {
    var a = document.createElement('div');
    a.innerHTML = '<template>1</template>';
    return !a.cloneNode(true).firstChild.innerHTML;
  } else {
    return false;
  }
})();

// Test for IE10/11 textarea placeholder clone bug
var hasTextareaCloneBug = (function () {
  /* istanbul ignore else */
  if (inBrowser) {
    var t = document.createElement('textarea');
    t.placeholder = 't';
    return t.cloneNode(true).value === 't';
  } else {
    return false;
  }
})();

/**
 * 1. Deal with Safari cloning nested <template> bug by
 *    manually cloning all template instances.
 * 2. Deal with IE10/11 textarea placeholder bug by setting
 *    the correct value after cloning.
 *
 * @param {Element|DocumentFragment} node
 * @return {Element|DocumentFragment}
 */

function cloneNode(node) {
  /* istanbul ignore if */
  if (!node.querySelectorAll) {
    return node.cloneNode();
  }
  var res = node.cloneNode(true);
  var i, original, cloned;
  /* istanbul ignore if */
  if (hasBrokenTemplate) {
    var tempClone = res;
    if (isRealTemplate(node)) {
      node = node.content;
      tempClone = res.content;
    }
    original = node.querySelectorAll('template');
    if (original.length) {
      cloned = tempClone.querySelectorAll('template');
      i = cloned.length;
      while (i--) {
        cloned[i].parentNode.replaceChild(cloneNode(original[i]), cloned[i]);
      }
    }
  }
  /* istanbul ignore if */
  if (hasTextareaCloneBug) {
    if (node.tagName === 'TEXTAREA') {
      res.value = node.value;
    } else {
      original = node.querySelectorAll('textarea');
      if (original.length) {
        cloned = res.querySelectorAll('textarea');
        i = cloned.length;
        while (i--) {
          cloned[i].value = original[i].value;
        }
      }
    }
  }
  return res;
}

/**
 * Process the template option and normalizes it into a
 * a DocumentFragment that can be used as a partial or a
 * instance template.
 *
 * @param {*} template
 *        Possible values include:
 *        - DocumentFragment object
 *        - Node object of type Template
 *        - id selector: '#some-template-id'
 *        - template string: '<div><span>{{msg}}</span></div>'
 * @param {Boolean} shouldClone
 * @param {Boolean} raw
 *        inline HTML interpolation. Do not check for id
 *        selector and keep whitespace in the string.
 * @return {DocumentFragment|undefined}
 */

function parseTemplate(template, shouldClone, raw) {
  var node, frag;

  // if the template is already a document fragment,
  // do nothing
  if (isFragment(template)) {
    trimNode(template);
    return shouldClone ? cloneNode(template) : template;
  }

  if (typeof template === 'string') {
    // id selector
    if (!raw && template.charAt(0) === '#') {
      // id selector can be cached too
      frag = idSelectorCache.get(template);
      if (!frag) {
        node = document.getElementById(template.slice(1));
        if (node) {
          frag = nodeToFragment(node);
          // save selector to cache
          idSelectorCache.put(template, frag);
        }
      }
    } else {
      // normal string template
      frag = stringToFragment(template, raw);
    }
  } else if (template.nodeType) {
    // a direct node
    frag = nodeToFragment(template);
  }

  return frag && shouldClone ? cloneNode(frag) : frag;
}

var template = Object.freeze({
  cloneNode: cloneNode,
  parseTemplate: parseTemplate
});

var html = {

  bind: function bind() {
    // a comment node means this is a binding for
    // {{{ inline unescaped html }}}
    if (this.el.nodeType === 8) {
      // hold nodes
      this.nodes = [];
      // replace the placeholder with proper anchor
      this.anchor = createAnchor('v-html');
      replace(this.el, this.anchor);
    }
  },

  update: function update(value) {
    value = _toString(value);
    if (this.nodes) {
      this.swap(value);
    } else {
      this.el.innerHTML = value;
    }
  },

  swap: function swap(value) {
    // remove old nodes
    var i = this.nodes.length;
    while (i--) {
      remove(this.nodes[i]);
    }
    // convert new value to a fragment
    // do not attempt to retrieve from id selector
    var frag = parseTemplate(value, true, true);
    // save a reference to these nodes so we can remove later
    this.nodes = toArray(frag.childNodes);
    before(frag, this.anchor);
  }
};

/**
 * Abstraction for a partially-compiled fragment.
 * Can optionally compile content with a child scope.
 *
 * @param {Function} linker
 * @param {Vue} vm
 * @param {DocumentFragment} frag
 * @param {Vue} [host]
 * @param {Object} [scope]
 * @param {Fragment} [parentFrag]
 */
function Fragment(linker, vm, frag, host, scope, parentFrag) {
  this.children = [];
  this.childFrags = [];
  this.vm = vm;
  this.scope = scope;
  this.inserted = false;
  this.parentFrag = parentFrag;
  if (parentFrag) {
    parentFrag.childFrags.push(this);
  }
  this.unlink = linker(vm, frag, host, scope, this);
  var single = this.single = frag.childNodes.length === 1 &&
  // do not go single mode if the only node is an anchor
  !frag.childNodes[0].__v_anchor;
  if (single) {
    this.node = frag.childNodes[0];
    this.before = singleBefore;
    this.remove = singleRemove;
  } else {
    this.node = createAnchor('fragment-start');
    this.end = createAnchor('fragment-end');
    this.frag = frag;
    prepend(this.node, frag);
    frag.appendChild(this.end);
    this.before = multiBefore;
    this.remove = multiRemove;
  }
  this.node.__v_frag = this;
}

/**
 * Call attach/detach for all components contained within
 * this fragment. Also do so recursively for all child
 * fragments.
 *
 * @param {Function} hook
 */

Fragment.prototype.callHook = function (hook) {
  var i, l;
  for (i = 0, l = this.childFrags.length; i < l; i++) {
    this.childFrags[i].callHook(hook);
  }
  for (i = 0, l = this.children.length; i < l; i++) {
    hook(this.children[i]);
  }
};

/**
 * Insert fragment before target, single node version
 *
 * @param {Node} target
 * @param {Boolean} withTransition
 */

function singleBefore(target, withTransition) {
  this.inserted = true;
  var method = withTransition !== false ? beforeWithTransition : before;
  method(this.node, target, this.vm);
  if (inDoc(this.node)) {
    this.callHook(attach);
  }
}

/**
 * Remove fragment, single node version
 */

function singleRemove() {
  this.inserted = false;
  var shouldCallRemove = inDoc(this.node);
  var self = this;
  this.beforeRemove();
  removeWithTransition(this.node, this.vm, function () {
    if (shouldCallRemove) {
      self.callHook(detach);
    }
    self.destroy();
  });
}

/**
 * Insert fragment before target, multi-nodes version
 *
 * @param {Node} target
 * @param {Boolean} withTransition
 */

function multiBefore(target, withTransition) {
  this.inserted = true;
  var vm = this.vm;
  var method = withTransition !== false ? beforeWithTransition : before;
  mapNodeRange(this.node, this.end, function (node) {
    method(node, target, vm);
  });
  if (inDoc(this.node)) {
    this.callHook(attach);
  }
}

/**
 * Remove fragment, multi-nodes version
 */

function multiRemove() {
  this.inserted = false;
  var self = this;
  var shouldCallRemove = inDoc(this.node);
  this.beforeRemove();
  removeNodeRange(this.node, this.end, this.vm, this.frag, function () {
    if (shouldCallRemove) {
      self.callHook(detach);
    }
    self.destroy();
  });
}

/**
 * Prepare the fragment for removal.
 */

Fragment.prototype.beforeRemove = function () {
  var i, l;
  for (i = 0, l = this.childFrags.length; i < l; i++) {
    // call the same method recursively on child
    // fragments, depth-first
    this.childFrags[i].beforeRemove(false);
  }
  for (i = 0, l = this.children.length; i < l; i++) {
    // Call destroy for all contained instances,
    // with remove:false and defer:true.
    // Defer is necessary because we need to
    // keep the children to call detach hooks
    // on them.
    this.children[i].$destroy(false, true);
  }
  var dirs = this.unlink.dirs;
  for (i = 0, l = dirs.length; i < l; i++) {
    // disable the watchers on all the directives
    // so that the rendered content stays the same
    // during removal.
    dirs[i]._watcher && dirs[i]._watcher.teardown();
  }
};

/**
 * Destroy the fragment.
 */

Fragment.prototype.destroy = function () {
  if (this.parentFrag) {
    this.parentFrag.childFrags.$remove(this);
  }
  this.node.__v_frag = null;
  this.unlink();
};

/**
 * Call attach hook for a Vue instance.
 *
 * @param {Vue} child
 */

function attach(child) {
  if (!child._isAttached && inDoc(child.$el)) {
    child._callHook('attached');
  }
}

/**
 * Call detach hook for a Vue instance.
 *
 * @param {Vue} child
 */

function detach(child) {
  if (child._isAttached && !inDoc(child.$el)) {
    child._callHook('detached');
  }
}

var linkerCache = new Cache(5000);

/**
 * A factory that can be used to create instances of a
 * fragment. Caches the compiled linker if possible.
 *
 * @param {Vue} vm
 * @param {Element|String} el
 */
function FragmentFactory(vm, el) {
  this.vm = vm;
  var template;
  var isString = typeof el === 'string';
  if (isString || isTemplate(el) && !el.hasAttribute('v-if')) {
    template = parseTemplate(el, true);
  } else {
    template = document.createDocumentFragment();
    template.appendChild(el);
  }
  this.template = template;
  // linker can be cached, but only for components
  var linker;
  var cid = vm.constructor.cid;
  if (cid > 0) {
    var cacheId = cid + (isString ? el : getOuterHTML(el));
    linker = linkerCache.get(cacheId);
    if (!linker) {
      linker = compile(template, vm.$options, true);
      linkerCache.put(cacheId, linker);
    }
  } else {
    linker = compile(template, vm.$options, true);
  }
  this.linker = linker;
}

/**
 * Create a fragment instance with given host and scope.
 *
 * @param {Vue} host
 * @param {Object} scope
 * @param {Fragment} parentFrag
 */

FragmentFactory.prototype.create = function (host, scope, parentFrag) {
  var frag = cloneNode(this.template);
  return new Fragment(this.linker, this.vm, frag, host, scope, parentFrag);
};

var ON = 700;
var MODEL = 800;
var BIND = 850;
var TRANSITION = 1100;
var EL = 1500;
var COMPONENT = 1500;
var PARTIAL = 1750;
var IF = 2100;
var FOR = 2200;
var SLOT = 2300;

var uid$3 = 0;

var vFor = {

  priority: FOR,
  terminal: true,

  params: ['track-by', 'stagger', 'enter-stagger', 'leave-stagger'],

  bind: function bind() {
    // support "item in/of items" syntax
    var inMatch = this.expression.match(/(.*) (?:in|of) (.*)/);
    if (inMatch) {
      var itMatch = inMatch[1].match(/\((.*),(.*)\)/);
      if (itMatch) {
        this.iterator = itMatch[1].trim();
        this.alias = itMatch[2].trim();
      } else {
        this.alias = inMatch[1].trim();
      }
      this.expression = inMatch[2];
    }

    if (!this.alias) {
      process.env.NODE_ENV !== 'production' && warn('Invalid v-for expression "' + this.descriptor.raw + '": ' + 'alias is required.', this.vm);
      return;
    }

    // uid as a cache identifier
    this.id = '__v-for__' + ++uid$3;

    // check if this is an option list,
    // so that we know if we need to update the <select>'s
    // v-model when the option list has changed.
    // because v-model has a lower priority than v-for,
    // the v-model is not bound here yet, so we have to
    // retrive it in the actual updateModel() function.
    var tag = this.el.tagName;
    this.isOption = (tag === 'OPTION' || tag === 'OPTGROUP') && this.el.parentNode.tagName === 'SELECT';

    // setup anchor nodes
    this.start = createAnchor('v-for-start');
    this.end = createAnchor('v-for-end');
    replace(this.el, this.end);
    before(this.start, this.end);

    // cache
    this.cache = Object.create(null);

    // fragment factory
    this.factory = new FragmentFactory(this.vm, this.el);
  },

  update: function update(data) {
    this.diff(data);
    this.updateRef();
    this.updateModel();
  },

  /**
   * Diff, based on new data and old data, determine the
   * minimum amount of DOM manipulations needed to make the
   * DOM reflect the new data Array.
   *
   * The algorithm diffs the new data Array by storing a
   * hidden reference to an owner vm instance on previously
   * seen data. This allows us to achieve O(n) which is
   * better than a levenshtein distance based algorithm,
   * which is O(m * n).
   *
   * @param {Array} data
   */

  diff: function diff(data) {
    // check if the Array was converted from an Object
    var item = data[0];
    var convertedFromObject = this.fromObject = isObject(item) && hasOwn(item, '$key') && hasOwn(item, '$value');

    var trackByKey = this.params.trackBy;
    var oldFrags = this.frags;
    var frags = this.frags = new Array(data.length);
    var alias = this.alias;
    var iterator = this.iterator;
    var start = this.start;
    var end = this.end;
    var inDocument = inDoc(start);
    var init = !oldFrags;
    var i, l, frag, key, value, primitive;

    // First pass, go through the new Array and fill up
    // the new frags array. If a piece of data has a cached
    // instance for it, we reuse it. Otherwise build a new
    // instance.
    for (i = 0, l = data.length; i < l; i++) {
      item = data[i];
      key = convertedFromObject ? item.$key : null;
      value = convertedFromObject ? item.$value : item;
      primitive = !isObject(value);
      frag = !init && this.getCachedFrag(value, i, key);
      if (frag) {
        // reusable fragment
        frag.reused = true;
        // update $index
        frag.scope.$index = i;
        // update $key
        if (key) {
          frag.scope.$key = key;
        }
        // update iterator
        if (iterator) {
          frag.scope[iterator] = key !== null ? key : i;
        }
        // update data for track-by, object repeat &
        // primitive values.
        if (trackByKey || convertedFromObject || primitive) {
          withoutConversion(function () {
            frag.scope[alias] = value;
          });
        }
      } else {
        // new isntance
        frag = this.create(value, alias, i, key);
        frag.fresh = !init;
      }
      frags[i] = frag;
      if (init) {
        frag.before(end);
      }
    }

    // we're done for the initial render.
    if (init) {
      return;
    }

    // Second pass, go through the old fragments and
    // destroy those who are not reused (and remove them
    // from cache)
    var removalIndex = 0;
    var totalRemoved = oldFrags.length - frags.length;
    // when removing a large number of fragments, watcher removal
    // turns out to be a perf bottleneck, so we batch the watcher
    // removals into a single filter call!
    this.vm._vForRemoving = true;
    for (i = 0, l = oldFrags.length; i < l; i++) {
      frag = oldFrags[i];
      if (!frag.reused) {
        this.deleteCachedFrag(frag);
        this.remove(frag, removalIndex++, totalRemoved, inDocument);
      }
    }
    this.vm._vForRemoving = false;
    if (removalIndex) {
      this.vm._watchers = this.vm._watchers.filter(function (w) {
        return w.active;
      });
    }

    // Final pass, move/insert new fragments into the
    // right place.
    var targetPrev, prevEl, currentPrev;
    var insertionIndex = 0;
    for (i = 0, l = frags.length; i < l; i++) {
      frag = frags[i];
      // this is the frag that we should be after
      targetPrev = frags[i - 1];
      prevEl = targetPrev ? targetPrev.staggerCb ? targetPrev.staggerAnchor : targetPrev.end || targetPrev.node : start;
      if (frag.reused && !frag.staggerCb) {
        currentPrev = findPrevFrag(frag, start, this.id);
        if (currentPrev !== targetPrev && (!currentPrev ||
        // optimization for moving a single item.
        // thanks to suggestions by @livoras in #1807
        findPrevFrag(currentPrev, start, this.id) !== targetPrev)) {
          this.move(frag, prevEl);
        }
      } else {
        // new instance, or still in stagger.
        // insert with updated stagger index.
        this.insert(frag, insertionIndex++, prevEl, inDocument);
      }
      frag.reused = frag.fresh = false;
    }
  },

  /**
   * Create a new fragment instance.
   *
   * @param {*} value
   * @param {String} alias
   * @param {Number} index
   * @param {String} [key]
   * @return {Fragment}
   */

  create: function create(value, alias, index, key) {
    var host = this._host;
    // create iteration scope
    var parentScope = this._scope || this.vm;
    var scope = Object.create(parentScope);
    // ref holder for the scope
    scope.$refs = Object.create(parentScope.$refs);
    scope.$els = Object.create(parentScope.$els);
    // make sure point $parent to parent scope
    scope.$parent = parentScope;
    // for two-way binding on alias
    scope.$forContext = this;
    // define scope properties
    // important: define the scope alias without forced conversion
    // so that frozen data structures remain non-reactive.
    withoutConversion(function () {
      defineReactive(scope, alias, value);
    });
    defineReactive(scope, '$index', index);
    if (key) {
      defineReactive(scope, '$key', key);
    } else if (scope.$key) {
      // avoid accidental fallback
      def(scope, '$key', null);
    }
    if (this.iterator) {
      defineReactive(scope, this.iterator, key !== null ? key : index);
    }
    var frag = this.factory.create(host, scope, this._frag);
    frag.forId = this.id;
    this.cacheFrag(value, frag, index, key);
    return frag;
  },

  /**
   * Update the v-ref on owner vm.
   */

  updateRef: function updateRef() {
    var ref = this.descriptor.ref;
    if (!ref) return;
    var hash = (this._scope || this.vm).$refs;
    var refs;
    if (!this.fromObject) {
      refs = this.frags.map(findVmFromFrag);
    } else {
      refs = {};
      this.frags.forEach(function (frag) {
        refs[frag.scope.$key] = findVmFromFrag(frag);
      });
    }
    hash[ref] = refs;
  },

  /**
   * For option lists, update the containing v-model on
   * parent <select>.
   */

  updateModel: function updateModel() {
    if (this.isOption) {
      var parent = this.start.parentNode;
      var model = parent && parent.__v_model;
      if (model) {
        model.forceUpdate();
      }
    }
  },

  /**
   * Insert a fragment. Handles staggering.
   *
   * @param {Fragment} frag
   * @param {Number} index
   * @param {Node} prevEl
   * @param {Boolean} inDocument
   */

  insert: function insert(frag, index, prevEl, inDocument) {
    if (frag.staggerCb) {
      frag.staggerCb.cancel();
      frag.staggerCb = null;
    }
    var staggerAmount = this.getStagger(frag, index, null, 'enter');
    if (inDocument && staggerAmount) {
      // create an anchor and insert it synchronously,
      // so that we can resolve the correct order without
      // worrying about some elements not inserted yet
      var anchor = frag.staggerAnchor;
      if (!anchor) {
        anchor = frag.staggerAnchor = createAnchor('stagger-anchor');
        anchor.__v_frag = frag;
      }
      after(anchor, prevEl);
      var op = frag.staggerCb = cancellable(function () {
        frag.staggerCb = null;
        frag.before(anchor);
        remove(anchor);
      });
      setTimeout(op, staggerAmount);
    } else {
      var target = prevEl.nextSibling;
      /* istanbul ignore if */
      if (!target) {
        // reset end anchor position in case the position was messed up
        // by an external drag-n-drop library.
        after(this.end, prevEl);
        target = this.end;
      }
      frag.before(target);
    }
  },

  /**
   * Remove a fragment. Handles staggering.
   *
   * @param {Fragment} frag
   * @param {Number} index
   * @param {Number} total
   * @param {Boolean} inDocument
   */

  remove: function remove(frag, index, total, inDocument) {
    if (frag.staggerCb) {
      frag.staggerCb.cancel();
      frag.staggerCb = null;
      // it's not possible for the same frag to be removed
      // twice, so if we have a pending stagger callback,
      // it means this frag is queued for enter but removed
      // before its transition started. Since it is already
      // destroyed, we can just leave it in detached state.
      return;
    }
    var staggerAmount = this.getStagger(frag, index, total, 'leave');
    if (inDocument && staggerAmount) {
      var op = frag.staggerCb = cancellable(function () {
        frag.staggerCb = null;
        frag.remove();
      });
      setTimeout(op, staggerAmount);
    } else {
      frag.remove();
    }
  },

  /**
   * Move a fragment to a new position.
   * Force no transition.
   *
   * @param {Fragment} frag
   * @param {Node} prevEl
   */

  move: function move(frag, prevEl) {
    // fix a common issue with Sortable:
    // if prevEl doesn't have nextSibling, this means it's
    // been dragged after the end anchor. Just re-position
    // the end anchor to the end of the container.
    /* istanbul ignore if */
    if (!prevEl.nextSibling) {
      this.end.parentNode.appendChild(this.end);
    }
    frag.before(prevEl.nextSibling, false);
  },

  /**
   * Cache a fragment using track-by or the object key.
   *
   * @param {*} value
   * @param {Fragment} frag
   * @param {Number} index
   * @param {String} [key]
   */

  cacheFrag: function cacheFrag(value, frag, index, key) {
    var trackByKey = this.params.trackBy;
    var cache = this.cache;
    var primitive = !isObject(value);
    var id;
    if (key || trackByKey || primitive) {
      id = getTrackByKey(index, key, value, trackByKey);
      if (!cache[id]) {
        cache[id] = frag;
      } else if (trackByKey !== '$index') {
        process.env.NODE_ENV !== 'production' && this.warnDuplicate(value);
      }
    } else {
      id = this.id;
      if (hasOwn(value, id)) {
        if (value[id] === null) {
          value[id] = frag;
        } else {
          process.env.NODE_ENV !== 'production' && this.warnDuplicate(value);
        }
      } else if (Object.isExtensible(value)) {
        def(value, id, frag);
      } else if (process.env.NODE_ENV !== 'production') {
        warn('Frozen v-for objects cannot be automatically tracked, make sure to ' + 'provide a track-by key.');
      }
    }
    frag.raw = value;
  },

  /**
   * Get a cached fragment from the value/index/key
   *
   * @param {*} value
   * @param {Number} index
   * @param {String} key
   * @return {Fragment}
   */

  getCachedFrag: function getCachedFrag(value, index, key) {
    var trackByKey = this.params.trackBy;
    var primitive = !isObject(value);
    var frag;
    if (key || trackByKey || primitive) {
      var id = getTrackByKey(index, key, value, trackByKey);
      frag = this.cache[id];
    } else {
      frag = value[this.id];
    }
    if (frag && (frag.reused || frag.fresh)) {
      process.env.NODE_ENV !== 'production' && this.warnDuplicate(value);
    }
    return frag;
  },

  /**
   * Delete a fragment from cache.
   *
   * @param {Fragment} frag
   */

  deleteCachedFrag: function deleteCachedFrag(frag) {
    var value = frag.raw;
    var trackByKey = this.params.trackBy;
    var scope = frag.scope;
    var index = scope.$index;
    // fix #948: avoid accidentally fall through to
    // a parent repeater which happens to have $key.
    var key = hasOwn(scope, '$key') && scope.$key;
    var primitive = !isObject(value);
    if (trackByKey || key || primitive) {
      var id = getTrackByKey(index, key, value, trackByKey);
      this.cache[id] = null;
    } else {
      value[this.id] = null;
      frag.raw = null;
    }
  },

  /**
   * Get the stagger amount for an insertion/removal.
   *
   * @param {Fragment} frag
   * @param {Number} index
   * @param {Number} total
   * @param {String} type
   */

  getStagger: function getStagger(frag, index, total, type) {
    type = type + 'Stagger';
    var trans = frag.node.__v_trans;
    var hooks = trans && trans.hooks;
    var hook = hooks && (hooks[type] || hooks.stagger);
    return hook ? hook.call(frag, index, total) : index * parseInt(this.params[type] || this.params.stagger, 10);
  },

  /**
   * Pre-process the value before piping it through the
   * filters. This is passed to and called by the watcher.
   */

  _preProcess: function _preProcess(value) {
    // regardless of type, store the un-filtered raw value.
    this.rawValue = value;
    return value;
  },

  /**
   * Post-process the value after it has been piped through
   * the filters. This is passed to and called by the watcher.
   *
   * It is necessary for this to be called during the
   * wathcer's dependency collection phase because we want
   * the v-for to update when the source Object is mutated.
   */

  _postProcess: function _postProcess(value) {
    if (isArray(value)) {
      return value;
    } else if (isPlainObject(value)) {
      // convert plain object to array.
      var keys = Object.keys(value);
      var i = keys.length;
      var res = new Array(i);
      var key;
      while (i--) {
        key = keys[i];
        res[i] = {
          $key: key,
          $value: value[key]
        };
      }
      return res;
    } else {
      if (typeof value === 'number' && !isNaN(value)) {
        value = range(value);
      }
      return value || [];
    }
  },

  unbind: function unbind() {
    if (this.descriptor.ref) {
      (this._scope || this.vm).$refs[this.descriptor.ref] = null;
    }
    if (this.frags) {
      var i = this.frags.length;
      var frag;
      while (i--) {
        frag = this.frags[i];
        this.deleteCachedFrag(frag);
        frag.destroy();
      }
    }
  }
};

/**
 * Helper to find the previous element that is a fragment
 * anchor. This is necessary because a destroyed frag's
 * element could still be lingering in the DOM before its
 * leaving transition finishes, but its inserted flag
 * should have been set to false so we can skip them.
 *
 * If this is a block repeat, we want to make sure we only
 * return frag that is bound to this v-for. (see #929)
 *
 * @param {Fragment} frag
 * @param {Comment|Text} anchor
 * @param {String} id
 * @return {Fragment}
 */

function findPrevFrag(frag, anchor, id) {
  var el = frag.node.previousSibling;
  /* istanbul ignore if */
  if (!el) return;
  frag = el.__v_frag;
  while ((!frag || frag.forId !== id || !frag.inserted) && el !== anchor) {
    el = el.previousSibling;
    /* istanbul ignore if */
    if (!el) return;
    frag = el.__v_frag;
  }
  return frag;
}

/**
 * Find a vm from a fragment.
 *
 * @param {Fragment} frag
 * @return {Vue|undefined}
 */

function findVmFromFrag(frag) {
  var node = frag.node;
  // handle multi-node frag
  if (frag.end) {
    while (!node.__vue__ && node !== frag.end && node.nextSibling) {
      node = node.nextSibling;
    }
  }
  return node.__vue__;
}

/**
 * Create a range array from given number.
 *
 * @param {Number} n
 * @return {Array}
 */

function range(n) {
  var i = -1;
  var ret = new Array(Math.floor(n));
  while (++i < n) {
    ret[i] = i;
  }
  return ret;
}

/**
 * Get the track by key for an item.
 *
 * @param {Number} index
 * @param {String} key
 * @param {*} value
 * @param {String} [trackByKey]
 */

function getTrackByKey(index, key, value, trackByKey) {
  return trackByKey ? trackByKey === '$index' ? index : trackByKey.charAt(0).match(/\w/) ? getPath(value, trackByKey) : value[trackByKey] : key || value;
}

if (process.env.NODE_ENV !== 'production') {
  vFor.warnDuplicate = function (value) {
    warn('Duplicate value found in v-for="' + this.descriptor.raw + '": ' + JSON.stringify(value) + '. Use track-by="$index" if ' + 'you are expecting duplicate values.', this.vm);
  };
}

var vIf = {

  priority: IF,
  terminal: true,

  bind: function bind() {
    var el = this.el;
    if (!el.__vue__) {
      // check else block
      var next = el.nextElementSibling;
      if (next && getAttr(next, 'v-else') !== null) {
        remove(next);
        this.elseEl = next;
      }
      // check main block
      this.anchor = createAnchor('v-if');
      replace(el, this.anchor);
    } else {
      process.env.NODE_ENV !== 'production' && warn('v-if="' + this.expression + '" cannot be ' + 'used on an instance root element.', this.vm);
      this.invalid = true;
    }
  },

  update: function update(value) {
    if (this.invalid) return;
    if (value) {
      if (!this.frag) {
        this.insert();
      }
    } else {
      this.remove();
    }
  },

  insert: function insert() {
    if (this.elseFrag) {
      this.elseFrag.remove();
      this.elseFrag = null;
    }
    // lazy init factory
    if (!this.factory) {
      this.factory = new FragmentFactory(this.vm, this.el);
    }
    this.frag = this.factory.create(this._host, this._scope, this._frag);
    this.frag.before(this.anchor);
  },

  remove: function remove() {
    if (this.frag) {
      this.frag.remove();
      this.frag = null;
    }
    if (this.elseEl && !this.elseFrag) {
      if (!this.elseFactory) {
        this.elseFactory = new FragmentFactory(this.elseEl._context || this.vm, this.elseEl);
      }
      this.elseFrag = this.elseFactory.create(this._host, this._scope, this._frag);
      this.elseFrag.before(this.anchor);
    }
  },

  unbind: function unbind() {
    if (this.frag) {
      this.frag.destroy();
    }
    if (this.elseFrag) {
      this.elseFrag.destroy();
    }
  }
};

var show = {

  bind: function bind() {
    // check else block
    var next = this.el.nextElementSibling;
    if (next && getAttr(next, 'v-else') !== null) {
      this.elseEl = next;
    }
  },

  update: function update(value) {
    this.apply(this.el, value);
    if (this.elseEl) {
      this.apply(this.elseEl, !value);
    }
  },

  apply: function apply(el, value) {
    if (inDoc(el)) {
      applyTransition(el, value ? 1 : -1, toggle, this.vm);
    } else {
      toggle();
    }
    function toggle() {
      el.style.display = value ? '' : 'none';
    }
  }
};

var text$2 = {

  bind: function bind() {
    var self = this;
    var el = this.el;
    var isRange = el.type === 'range';
    var lazy = this.params.lazy;
    var number = this.params.number;
    var debounce = this.params.debounce;

    // handle composition events.
    //   http://blog.evanyou.me/2014/01/03/composition-event/
    // skip this for Android because it handles composition
    // events quite differently. Android doesn't trigger
    // composition events for language input methods e.g.
    // Chinese, but instead triggers them for spelling
    // suggestions... (see Discussion/#162)
    var composing = false;
    if (!isAndroid && !isRange) {
      this.on('compositionstart', function () {
        composing = true;
      });
      this.on('compositionend', function () {
        composing = false;
        // in IE11 the "compositionend" event fires AFTER
        // the "input" event, so the input handler is blocked
        // at the end... have to call it here.
        //
        // #1327: in lazy mode this is unecessary.
        if (!lazy) {
          self.listener();
        }
      });
    }

    // prevent messing with the input when user is typing,
    // and force update on blur.
    this.focused = false;
    if (!isRange && !lazy) {
      this.on('focus', function () {
        self.focused = true;
      });
      this.on('blur', function () {
        self.focused = false;
        // do not sync value after fragment removal (#2017)
        if (!self._frag || self._frag.inserted) {
          self.rawListener();
        }
      });
    }

    // Now attach the main listener
    this.listener = this.rawListener = function () {
      if (composing || !self._bound) {
        return;
      }
      var val = number || isRange ? toNumber(el.value) : el.value;
      self.set(val);
      // force update on next tick to avoid lock & same value
      // also only update when user is not typing
      nextTick(function () {
        if (self._bound && !self.focused) {
          self.update(self._watcher.value);
        }
      });
    };

    // apply debounce
    if (debounce) {
      this.listener = _debounce(this.listener, debounce);
    }

    // Support jQuery events, since jQuery.trigger() doesn't
    // trigger native events in some cases and some plugins
    // rely on $.trigger()
    //
    // We want to make sure if a listener is attached using
    // jQuery, it is also removed with jQuery, that's why
    // we do the check for each directive instance and
    // store that check result on itself. This also allows
    // easier test coverage control by unsetting the global
    // jQuery variable in tests.
    this.hasjQuery = typeof jQuery === 'function';
    if (this.hasjQuery) {
      var method = jQuery.fn.on ? 'on' : 'bind';
      jQuery(el)[method]('change', this.rawListener);
      if (!lazy) {
        jQuery(el)[method]('input', this.listener);
      }
    } else {
      this.on('change', this.rawListener);
      if (!lazy) {
        this.on('input', this.listener);
      }
    }

    // IE9 doesn't fire input event on backspace/del/cut
    if (!lazy && isIE9) {
      this.on('cut', function () {
        nextTick(self.listener);
      });
      this.on('keyup', function (e) {
        if (e.keyCode === 46 || e.keyCode === 8) {
          self.listener();
        }
      });
    }

    // set initial value if present
    if (el.hasAttribute('value') || el.tagName === 'TEXTAREA' && el.value.trim()) {
      this.afterBind = this.listener;
    }
  },

  update: function update(value) {
    this.el.value = _toString(value);
  },

  unbind: function unbind() {
    var el = this.el;
    if (this.hasjQuery) {
      var method = jQuery.fn.off ? 'off' : 'unbind';
      jQuery(el)[method]('change', this.listener);
      jQuery(el)[method]('input', this.listener);
    }
  }
};

var radio = {

  bind: function bind() {
    var self = this;
    var el = this.el;

    this.getValue = function () {
      // value overwrite via v-bind:value
      if (el.hasOwnProperty('_value')) {
        return el._value;
      }
      var val = el.value;
      if (self.params.number) {
        val = toNumber(val);
      }
      return val;
    };

    this.listener = function () {
      self.set(self.getValue());
    };
    this.on('change', this.listener);

    if (el.hasAttribute('checked')) {
      this.afterBind = this.listener;
    }
  },

  update: function update(value) {
    this.el.checked = looseEqual(value, this.getValue());
  }
};

var select = {

  bind: function bind() {
    var self = this;
    var el = this.el;

    // method to force update DOM using latest value.
    this.forceUpdate = function () {
      if (self._watcher) {
        self.update(self._watcher.get());
      }
    };

    // check if this is a multiple select
    var multiple = this.multiple = el.hasAttribute('multiple');

    // attach listener
    this.listener = function () {
      var value = getValue(el, multiple);
      value = self.params.number ? isArray(value) ? value.map(toNumber) : toNumber(value) : value;
      self.set(value);
    };
    this.on('change', this.listener);

    // if has initial value, set afterBind
    var initValue = getValue(el, multiple, true);
    if (multiple && initValue.length || !multiple && initValue !== null) {
      this.afterBind = this.listener;
    }

    // All major browsers except Firefox resets
    // selectedIndex with value -1 to 0 when the element
    // is appended to a new parent, therefore we have to
    // force a DOM update whenever that happens...
    this.vm.$on('hook:attached', this.forceUpdate);
  },

  update: function update(value) {
    var el = this.el;
    el.selectedIndex = -1;
    var multi = this.multiple && isArray(value);
    var options = el.options;
    var i = options.length;
    var op, val;
    while (i--) {
      op = options[i];
      val = op.hasOwnProperty('_value') ? op._value : op.value;
      /* eslint-disable eqeqeq */
      op.selected = multi ? indexOf$1(value, val) > -1 : looseEqual(value, val);
      /* eslint-enable eqeqeq */
    }
  },

  unbind: function unbind() {
    /* istanbul ignore next */
    this.vm.$off('hook:attached', this.forceUpdate);
  }
};

/**
 * Get select value
 *
 * @param {SelectElement} el
 * @param {Boolean} multi
 * @param {Boolean} init
 * @return {Array|*}
 */

function getValue(el, multi, init) {
  var res = multi ? [] : null;
  var op, val, selected;
  for (var i = 0, l = el.options.length; i < l; i++) {
    op = el.options[i];
    selected = init ? op.hasAttribute('selected') : op.selected;
    if (selected) {
      val = op.hasOwnProperty('_value') ? op._value : op.value;
      if (multi) {
        res.push(val);
      } else {
        return val;
      }
    }
  }
  return res;
}

/**
 * Native Array.indexOf uses strict equal, but in this
 * case we need to match string/numbers with custom equal.
 *
 * @param {Array} arr
 * @param {*} val
 */

function indexOf$1(arr, val) {
  var i = arr.length;
  while (i--) {
    if (looseEqual(arr[i], val)) {
      return i;
    }
  }
  return -1;
}

var checkbox = {

  bind: function bind() {
    var self = this;
    var el = this.el;

    this.getValue = function () {
      return el.hasOwnProperty('_value') ? el._value : self.params.number ? toNumber(el.value) : el.value;
    };

    function getBooleanValue() {
      var val = el.checked;
      if (val && el.hasOwnProperty('_trueValue')) {
        return el._trueValue;
      }
      if (!val && el.hasOwnProperty('_falseValue')) {
        return el._falseValue;
      }
      return val;
    }

    this.listener = function () {
      var model = self._watcher.value;
      if (isArray(model)) {
        var val = self.getValue();
        if (el.checked) {
          if (indexOf(model, val) < 0) {
            model.push(val);
          }
        } else {
          model.$remove(val);
        }
      } else {
        self.set(getBooleanValue());
      }
    };

    this.on('change', this.listener);
    if (el.hasAttribute('checked')) {
      this.afterBind = this.listener;
    }
  },

  update: function update(value) {
    var el = this.el;
    if (isArray(value)) {
      el.checked = indexOf(value, this.getValue()) > -1;
    } else {
      if (el.hasOwnProperty('_trueValue')) {
        el.checked = looseEqual(value, el._trueValue);
      } else {
        el.checked = !!value;
      }
    }
  }
};

var handlers = {
  text: text$2,
  radio: radio,
  select: select,
  checkbox: checkbox
};

var model = {

  priority: MODEL,
  twoWay: true,
  handlers: handlers,
  params: ['lazy', 'number', 'debounce'],

  /**
   * Possible elements:
   *   <select>
   *   <textarea>
   *   <input type="*">
   *     - text
   *     - checkbox
   *     - radio
   *     - number
   */

  bind: function bind() {
    // friendly warning...
    this.checkFilters();
    if (this.hasRead && !this.hasWrite) {
      process.env.NODE_ENV !== 'production' && warn('It seems you are using a read-only filter with ' + 'v-model="' + this.descriptor.raw + '". ' + 'You might want to use a two-way filter to ensure correct behavior.', this.vm);
    }
    var el = this.el;
    var tag = el.tagName;
    var handler;
    if (tag === 'INPUT') {
      handler = handlers[el.type] || handlers.text;
    } else if (tag === 'SELECT') {
      handler = handlers.select;
    } else if (tag === 'TEXTAREA') {
      handler = handlers.text;
    } else {
      process.env.NODE_ENV !== 'production' && warn('v-model does not support element type: ' + tag, this.vm);
      return;
    }
    el.__v_model = this;
    handler.bind.call(this);
    this.update = handler.update;
    this._unbind = handler.unbind;
  },

  /**
   * Check read/write filter stats.
   */

  checkFilters: function checkFilters() {
    var filters = this.filters;
    if (!filters) return;
    var i = filters.length;
    while (i--) {
      var filter = resolveAsset(this.vm.$options, 'filters', filters[i].name);
      if (typeof filter === 'function' || filter.read) {
        this.hasRead = true;
      }
      if (filter.write) {
        this.hasWrite = true;
      }
    }
  },

  unbind: function unbind() {
    this.el.__v_model = null;
    this._unbind && this._unbind();
  }
};

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  'delete': [8, 46],
  up: 38,
  left: 37,
  right: 39,
  down: 40
};

function keyFilter(handler, keys) {
  var codes = keys.map(function (key) {
    var charCode = key.charCodeAt(0);
    if (charCode > 47 && charCode < 58) {
      return parseInt(key, 10);
    }
    if (key.length === 1) {
      charCode = key.toUpperCase().charCodeAt(0);
      if (charCode > 64 && charCode < 91) {
        return charCode;
      }
    }
    return keyCodes[key];
  });
  codes = [].concat.apply([], codes);
  return function keyHandler(e) {
    if (codes.indexOf(e.keyCode) > -1) {
      return handler.call(this, e);
    }
  };
}

function stopFilter(handler) {
  return function stopHandler(e) {
    e.stopPropagation();
    return handler.call(this, e);
  };
}

function preventFilter(handler) {
  return function preventHandler(e) {
    e.preventDefault();
    return handler.call(this, e);
  };
}

function selfFilter(handler) {
  return function selfHandler(e) {
    if (e.target === e.currentTarget) {
      return handler.call(this, e);
    }
  };
}

var on$1 = {

  priority: ON,
  acceptStatement: true,
  keyCodes: keyCodes,

  bind: function bind() {
    // deal with iframes
    if (this.el.tagName === 'IFRAME' && this.arg !== 'load') {
      var self = this;
      this.iframeBind = function () {
        on(self.el.contentWindow, self.arg, self.handler, self.modifiers.capture);
      };
      this.on('load', this.iframeBind);
    }
  },

  update: function update(handler) {
    // stub a noop for v-on with no value,
    // e.g. @mousedown.prevent
    if (!this.descriptor.raw) {
      handler = function () {};
    }

    if (typeof handler !== 'function') {
      process.env.NODE_ENV !== 'production' && warn('v-on:' + this.arg + '="' + this.expression + '" expects a function value, ' + 'got ' + handler, this.vm);
      return;
    }

    // apply modifiers
    if (this.modifiers.stop) {
      handler = stopFilter(handler);
    }
    if (this.modifiers.prevent) {
      handler = preventFilter(handler);
    }
    if (this.modifiers.self) {
      handler = selfFilter(handler);
    }
    // key filter
    var keys = Object.keys(this.modifiers).filter(function (key) {
      return key !== 'stop' && key !== 'prevent' && key !== 'self' && key !== 'capture';
    });
    if (keys.length) {
      handler = keyFilter(handler, keys);
    }

    this.reset();
    this.handler = handler;

    if (this.iframeBind) {
      this.iframeBind();
    } else {
      on(this.el, this.arg, this.handler, this.modifiers.capture);
    }
  },

  reset: function reset() {
    var el = this.iframeBind ? this.el.contentWindow : this.el;
    if (this.handler) {
      off(el, this.arg, this.handler);
    }
  },

  unbind: function unbind() {
    this.reset();
  }
};

var prefixes = ['-webkit-', '-moz-', '-ms-'];
var camelPrefixes = ['Webkit', 'Moz', 'ms'];
var importantRE = /!important;?$/;
var propCache = Object.create(null);

var testEl = null;

var style = {

  deep: true,

  update: function update(value) {
    if (typeof value === 'string') {
      this.el.style.cssText = value;
    } else if (isArray(value)) {
      this.handleObject(value.reduce(extend, {}));
    } else {
      this.handleObject(value || {});
    }
  },

  handleObject: function handleObject(value) {
    // cache object styles so that only changed props
    // are actually updated.
    var cache = this.cache || (this.cache = {});
    var name, val;
    for (name in cache) {
      if (!(name in value)) {
        this.handleSingle(name, null);
        delete cache[name];
      }
    }
    for (name in value) {
      val = value[name];
      if (val !== cache[name]) {
        cache[name] = val;
        this.handleSingle(name, val);
      }
    }
  },

  handleSingle: function handleSingle(prop, value) {
    prop = normalize(prop);
    if (!prop) return; // unsupported prop
    // cast possible numbers/booleans into strings
    if (value != null) value += '';
    if (value) {
      var isImportant = importantRE.test(value) ? 'important' : '';
      if (isImportant) {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
          warn('It\'s probably a bad idea to use !important with inline rules. ' + 'This feature will be deprecated in a future version of Vue.');
        }
        value = value.replace(importantRE, '').trim();
        this.el.style.setProperty(prop.kebab, value, isImportant);
      } else {
        this.el.style[prop.camel] = value;
      }
    } else {
      this.el.style[prop.camel] = '';
    }
  }

};

/**
 * Normalize a CSS property name.
 * - cache result
 * - auto prefix
 * - camelCase -> dash-case
 *
 * @param {String} prop
 * @return {String}
 */

function normalize(prop) {
  if (propCache[prop]) {
    return propCache[prop];
  }
  var res = prefix(prop);
  propCache[prop] = propCache[res] = res;
  return res;
}

/**
 * Auto detect the appropriate prefix for a CSS property.
 * https://gist.github.com/paulirish/523692
 *
 * @param {String} prop
 * @return {String}
 */

function prefix(prop) {
  prop = hyphenate(prop);
  var camel = camelize(prop);
  var upper = camel.charAt(0).toUpperCase() + camel.slice(1);
  if (!testEl) {
    testEl = document.createElement('div');
  }
  var i = prefixes.length;
  var prefixed;
  if (camel !== 'filter' && camel in testEl.style) {
    return {
      kebab: prop,
      camel: camel
    };
  }
  while (i--) {
    prefixed = camelPrefixes[i] + upper;
    if (prefixed in testEl.style) {
      return {
        kebab: prefixes[i] + prop,
        camel: prefixed
      };
    }
  }
}

// xlink
var xlinkNS = 'http://www.w3.org/1999/xlink';
var xlinkRE = /^xlink:/;

// check for attributes that prohibit interpolations
var disallowedInterpAttrRE = /^v-|^:|^@|^(?:is|transition|transition-mode|debounce|track-by|stagger|enter-stagger|leave-stagger)$/;
// these attributes should also set their corresponding properties
// because they only affect the initial state of the element
var attrWithPropsRE = /^(?:value|checked|selected|muted)$/;
// these attributes expect enumrated values of "true" or "false"
// but are not boolean attributes
var enumeratedAttrRE = /^(?:draggable|contenteditable|spellcheck)$/;

// these attributes should set a hidden property for
// binding v-model to object values
var modelProps = {
  value: '_value',
  'true-value': '_trueValue',
  'false-value': '_falseValue'
};

var bind$1 = {

  priority: BIND,

  bind: function bind() {
    var attr = this.arg;
    var tag = this.el.tagName;
    // should be deep watch on object mode
    if (!attr) {
      this.deep = true;
    }
    // handle interpolation bindings
    var descriptor = this.descriptor;
    var tokens = descriptor.interp;
    if (tokens) {
      // handle interpolations with one-time tokens
      if (descriptor.hasOneTime) {
        this.expression = tokensToExp(tokens, this._scope || this.vm);
      }

      // only allow binding on native attributes
      if (disallowedInterpAttrRE.test(attr) || attr === 'name' && (tag === 'PARTIAL' || tag === 'SLOT')) {
        process.env.NODE_ENV !== 'production' && warn(attr + '="' + descriptor.raw + '": ' + 'attribute interpolation is not allowed in Vue.js ' + 'directives and special attributes.', this.vm);
        this.el.removeAttribute(attr);
        this.invalid = true;
      }

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production') {
        var raw = attr + '="' + descriptor.raw + '": ';
        // warn src
        if (attr === 'src') {
          warn(raw + 'interpolation in "src" attribute will cause ' + 'a 404 request. Use v-bind:src instead.', this.vm);
        }

        // warn style
        if (attr === 'style') {
          warn(raw + 'interpolation in "style" attribute will cause ' + 'the attribute to be discarded in Internet Explorer. ' + 'Use v-bind:style instead.', this.vm);
        }
      }
    }
  },

  update: function update(value) {
    if (this.invalid) {
      return;
    }
    var attr = this.arg;
    if (this.arg) {
      this.handleSingle(attr, value);
    } else {
      this.handleObject(value || {});
    }
  },

  // share object handler with v-bind:class
  handleObject: style.handleObject,

  handleSingle: function handleSingle(attr, value) {
    var el = this.el;
    var interp = this.descriptor.interp;
    if (this.modifiers.camel) {
      attr = camelize(attr);
    }
    if (!interp && attrWithPropsRE.test(attr) && attr in el) {
      var attrValue = attr === 'value' ? value == null // IE9 will set input.value to "null" for null...
      ? '' : value : value;

      if (el[attr] !== attrValue) {
        el[attr] = attrValue;
      }
    }
    // set model props
    var modelProp = modelProps[attr];
    if (!interp && modelProp) {
      el[modelProp] = value;
      // update v-model if present
      var model = el.__v_model;
      if (model) {
        model.listener();
      }
    }
    // do not set value attribute for textarea
    if (attr === 'value' && el.tagName === 'TEXTAREA') {
      el.removeAttribute(attr);
      return;
    }
    // update attribute
    if (enumeratedAttrRE.test(attr)) {
      el.setAttribute(attr, value ? 'true' : 'false');
    } else if (value != null && value !== false) {
      if (attr === 'class') {
        // handle edge case #1960:
        // class interpolation should not overwrite Vue transition class
        if (el.__v_trans) {
          value += ' ' + el.__v_trans.id + '-transition';
        }
        setClass(el, value);
      } else if (xlinkRE.test(attr)) {
        el.setAttributeNS(xlinkNS, attr, value === true ? '' : value);
      } else {
        el.setAttribute(attr, value === true ? '' : value);
      }
    } else {
      el.removeAttribute(attr);
    }
  }
};

var el = {

  priority: EL,

  bind: function bind() {
    /* istanbul ignore if */
    if (!this.arg) {
      return;
    }
    var id = this.id = camelize(this.arg);
    var refs = (this._scope || this.vm).$els;
    if (hasOwn(refs, id)) {
      refs[id] = this.el;
    } else {
      defineReactive(refs, id, this.el);
    }
  },

  unbind: function unbind() {
    var refs = (this._scope || this.vm).$els;
    if (refs[this.id] === this.el) {
      refs[this.id] = null;
    }
  }
};

var ref = {
  bind: function bind() {
    process.env.NODE_ENV !== 'production' && warn('v-ref:' + this.arg + ' must be used on a child ' + 'component. Found on <' + this.el.tagName.toLowerCase() + '>.', this.vm);
  }
};

var cloak = {
  bind: function bind() {
    var el = this.el;
    this.vm.$once('pre-hook:compiled', function () {
      el.removeAttribute('v-cloak');
    });
  }
};

// must export plain object
var directives = {
  text: text$1,
  html: html,
  'for': vFor,
  'if': vIf,
  show: show,
  model: model,
  on: on$1,
  bind: bind$1,
  el: el,
  ref: ref,
  cloak: cloak
};

var vClass = {

  deep: true,

  update: function update(value) {
    if (!value) {
      this.cleanup();
    } else if (typeof value === 'string') {
      this.setClass(value.trim().split(/\s+/));
    } else {
      this.setClass(normalize$1(value));
    }
  },

  setClass: function setClass(value) {
    this.cleanup(value);
    for (var i = 0, l = value.length; i < l; i++) {
      var val = value[i];
      if (val) {
        apply(this.el, val, addClass);
      }
    }
    this.prevKeys = value;
  },

  cleanup: function cleanup(value) {
    var prevKeys = this.prevKeys;
    if (!prevKeys) return;
    var i = prevKeys.length;
    while (i--) {
      var key = prevKeys[i];
      if (!value || value.indexOf(key) < 0) {
        apply(this.el, key, removeClass);
      }
    }
  }
};

/**
 * Normalize objects and arrays (potentially containing objects)
 * into array of strings.
 *
 * @param {Object|Array<String|Object>} value
 * @return {Array<String>}
 */

function normalize$1(value) {
  var res = [];
  if (isArray(value)) {
    for (var i = 0, l = value.length; i < l; i++) {
      var _key = value[i];
      if (_key) {
        if (typeof _key === 'string') {
          res.push(_key);
        } else {
          for (var k in _key) {
            if (_key[k]) res.push(k);
          }
        }
      }
    }
  } else if (isObject(value)) {
    for (var key in value) {
      if (value[key]) res.push(key);
    }
  }
  return res;
}

/**
 * Add or remove a class/classes on an element
 *
 * @param {Element} el
 * @param {String} key The class name. This may or may not
 *                     contain a space character, in such a
 *                     case we'll deal with multiple class
 *                     names at once.
 * @param {Function} fn
 */

function apply(el, key, fn) {
  key = key.trim();
  if (key.indexOf(' ') === -1) {
    fn(el, key);
    return;
  }
  // The key contains one or more space characters.
  // Since a class name doesn't accept such characters, we
  // treat it as multiple classes.
  var keys = key.split(/\s+/);
  for (var i = 0, l = keys.length; i < l; i++) {
    fn(el, keys[i]);
  }
}

var component = {

  priority: COMPONENT,

  params: ['keep-alive', 'transition-mode', 'inline-template'],

  /**
   * Setup. Two possible usages:
   *
   * - static:
   *   <comp> or <div v-component="comp">
   *
   * - dynamic:
   *   <component :is="view">
   */

  bind: function bind() {
    if (!this.el.__vue__) {
      // keep-alive cache
      this.keepAlive = this.params.keepAlive;
      if (this.keepAlive) {
        this.cache = {};
      }
      // check inline-template
      if (this.params.inlineTemplate) {
        // extract inline template as a DocumentFragment
        this.inlineTemplate = extractContent(this.el, true);
      }
      // component resolution related state
      this.pendingComponentCb = this.Component = null;
      // transition related state
      this.pendingRemovals = 0;
      this.pendingRemovalCb = null;
      // create a ref anchor
      this.anchor = createAnchor('v-component');
      replace(this.el, this.anchor);
      // remove is attribute.
      // this is removed during compilation, but because compilation is
      // cached, when the component is used elsewhere this attribute
      // will remain at link time.
      this.el.removeAttribute('is');
      this.el.removeAttribute(':is');
      // remove ref, same as above
      if (this.descriptor.ref) {
        this.el.removeAttribute('v-ref:' + hyphenate(this.descriptor.ref));
      }
      // if static, build right now.
      if (this.literal) {
        this.setComponent(this.expression);
      }
    } else {
      process.env.NODE_ENV !== 'production' && warn('cannot mount component "' + this.expression + '" ' + 'on already mounted element: ' + this.el);
    }
  },

  /**
   * Public update, called by the watcher in the dynamic
   * literal scenario, e.g. <component :is="view">
   */

  update: function update(value) {
    if (!this.literal) {
      this.setComponent(value);
    }
  },

  /**
   * Switch dynamic components. May resolve the component
   * asynchronously, and perform transition based on
   * specified transition mode. Accepts a few additional
   * arguments specifically for vue-router.
   *
   * The callback is called when the full transition is
   * finished.
   *
   * @param {String} value
   * @param {Function} [cb]
   */

  setComponent: function setComponent(value, cb) {
    this.invalidatePending();
    if (!value) {
      // just remove current
      this.unbuild(true);
      this.remove(this.childVM, cb);
      this.childVM = null;
    } else {
      var self = this;
      this.resolveComponent(value, function () {
        self.mountComponent(cb);
      });
    }
  },

  /**
   * Resolve the component constructor to use when creating
   * the child vm.
   *
   * @param {String|Function} value
   * @param {Function} cb
   */

  resolveComponent: function resolveComponent(value, cb) {
    var self = this;
    this.pendingComponentCb = cancellable(function (Component) {
      self.ComponentName = Component.options.name || (typeof value === 'string' ? value : null);
      self.Component = Component;
      cb();
    });
    this.vm._resolveComponent(value, this.pendingComponentCb);
  },

  /**
   * Create a new instance using the current constructor and
   * replace the existing instance. This method doesn't care
   * whether the new component and the old one are actually
   * the same.
   *
   * @param {Function} [cb]
   */

  mountComponent: function mountComponent(cb) {
    // actual mount
    this.unbuild(true);
    var self = this;
    var activateHooks = this.Component.options.activate;
    var cached = this.getCached();
    var newComponent = this.build();
    if (activateHooks && !cached) {
      this.waitingFor = newComponent;
      callActivateHooks(activateHooks, newComponent, function () {
        if (self.waitingFor !== newComponent) {
          return;
        }
        self.waitingFor = null;
        self.transition(newComponent, cb);
      });
    } else {
      // update ref for kept-alive component
      if (cached) {
        newComponent._updateRef();
      }
      this.transition(newComponent, cb);
    }
  },

  /**
   * When the component changes or unbinds before an async
   * constructor is resolved, we need to invalidate its
   * pending callback.
   */

  invalidatePending: function invalidatePending() {
    if (this.pendingComponentCb) {
      this.pendingComponentCb.cancel();
      this.pendingComponentCb = null;
    }
  },

  /**
   * Instantiate/insert a new child vm.
   * If keep alive and has cached instance, insert that
   * instance; otherwise build a new one and cache it.
   *
   * @param {Object} [extraOptions]
   * @return {Vue} - the created instance
   */

  build: function build(extraOptions) {
    var cached = this.getCached();
    if (cached) {
      return cached;
    }
    if (this.Component) {
      // default options
      var options = {
        name: this.ComponentName,
        el: cloneNode(this.el),
        template: this.inlineTemplate,
        // make sure to add the child with correct parent
        // if this is a transcluded component, its parent
        // should be the transclusion host.
        parent: this._host || this.vm,
        // if no inline-template, then the compiled
        // linker can be cached for better performance.
        _linkerCachable: !this.inlineTemplate,
        _ref: this.descriptor.ref,
        _asComponent: true,
        _isRouterView: this._isRouterView,
        // if this is a transcluded component, context
        // will be the common parent vm of this instance
        // and its host.
        _context: this.vm,
        // if this is inside an inline v-for, the scope
        // will be the intermediate scope created for this
        // repeat fragment. this is used for linking props
        // and container directives.
        _scope: this._scope,
        // pass in the owner fragment of this component.
        // this is necessary so that the fragment can keep
        // track of its contained components in order to
        // call attach/detach hooks for them.
        _frag: this._frag
      };
      // extra options
      // in 1.0.0 this is used by vue-router only
      /* istanbul ignore if */
      if (extraOptions) {
        extend(options, extraOptions);
      }
      var child = new this.Component(options);
      if (this.keepAlive) {
        this.cache[this.Component.cid] = child;
      }
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && this.el.hasAttribute('transition') && child._isFragment) {
        warn('Transitions will not work on a fragment instance. ' + 'Template: ' + child.$options.template, child);
      }
      return child;
    }
  },

  /**
   * Try to get a cached instance of the current component.
   *
   * @return {Vue|undefined}
   */

  getCached: function getCached() {
    return this.keepAlive && this.cache[this.Component.cid];
  },

  /**
   * Teardown the current child, but defers cleanup so
   * that we can separate the destroy and removal steps.
   *
   * @param {Boolean} defer
   */

  unbuild: function unbuild(defer) {
    if (this.waitingFor) {
      if (!this.keepAlive) {
        this.waitingFor.$destroy();
      }
      this.waitingFor = null;
    }
    var child = this.childVM;
    if (!child || this.keepAlive) {
      if (child) {
        // remove ref
        child._inactive = true;
        child._updateRef(true);
      }
      return;
    }
    // the sole purpose of `deferCleanup` is so that we can
    // "deactivate" the vm right now and perform DOM removal
    // later.
    child.$destroy(false, defer);
  },

  /**
   * Remove current destroyed child and manually do
   * the cleanup after removal.
   *
   * @param {Function} cb
   */

  remove: function remove(child, cb) {
    var keepAlive = this.keepAlive;
    if (child) {
      // we may have a component switch when a previous
      // component is still being transitioned out.
      // we want to trigger only one lastest insertion cb
      // when the existing transition finishes. (#1119)
      this.pendingRemovals++;
      this.pendingRemovalCb = cb;
      var self = this;
      child.$remove(function () {
        self.pendingRemovals--;
        if (!keepAlive) child._cleanup();
        if (!self.pendingRemovals && self.pendingRemovalCb) {
          self.pendingRemovalCb();
          self.pendingRemovalCb = null;
        }
      });
    } else if (cb) {
      cb();
    }
  },

  /**
   * Actually swap the components, depending on the
   * transition mode. Defaults to simultaneous.
   *
   * @param {Vue} target
   * @param {Function} [cb]
   */

  transition: function transition(target, cb) {
    var self = this;
    var current = this.childVM;
    // for devtool inspection
    if (current) current._inactive = true;
    target._inactive = false;
    this.childVM = target;
    switch (self.params.transitionMode) {
      case 'in-out':
        target.$before(self.anchor, function () {
          self.remove(current, cb);
        });
        break;
      case 'out-in':
        self.remove(current, function () {
          target.$before(self.anchor, cb);
        });
        break;
      default:
        self.remove(current);
        target.$before(self.anchor, cb);
    }
  },

  /**
   * Unbind.
   */

  unbind: function unbind() {
    this.invalidatePending();
    // Do not defer cleanup when unbinding
    this.unbuild();
    // destroy all keep-alive cached instances
    if (this.cache) {
      for (var key in this.cache) {
        this.cache[key].$destroy();
      }
      this.cache = null;
    }
  }
};

/**
 * Call activate hooks in order (asynchronous)
 *
 * @param {Array} hooks
 * @param {Vue} vm
 * @param {Function} cb
 */

function callActivateHooks(hooks, vm, cb) {
  var total = hooks.length;
  var called = 0;
  hooks[0].call(vm, next);
  function next() {
    if (++called >= total) {
      cb();
    } else {
      hooks[called].call(vm, next);
    }
  }
}

var propBindingModes = config._propBindingModes;
var empty = {};

// regexes
var identRE$1 = /^[$_a-zA-Z]+[\w$]*$/;
var settablePathRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\[[^\[\]]+\])*$/;

/**
 * Compile props on a root element and return
 * a props link function.
 *
 * @param {Element|DocumentFragment} el
 * @param {Array} propOptions
 * @param {Vue} vm
 * @return {Function} propsLinkFn
 */

function compileProps(el, propOptions, vm) {
  var props = [];
  var names = Object.keys(propOptions);
  var i = names.length;
  var options, name, attr, value, path, parsed, prop;
  while (i--) {
    name = names[i];
    options = propOptions[name] || empty;

    if (process.env.NODE_ENV !== 'production' && name === '$data') {
      warn('Do not use $data as prop.', vm);
      continue;
    }

    // props could contain dashes, which will be
    // interpreted as minus calculations by the parser
    // so we need to camelize the path here
    path = camelize(name);
    if (!identRE$1.test(path)) {
      process.env.NODE_ENV !== 'production' && warn('Invalid prop key: "' + name + '". Prop keys ' + 'must be valid identifiers.', vm);
      continue;
    }

    prop = {
      name: name,
      path: path,
      options: options,
      mode: propBindingModes.ONE_WAY,
      raw: null
    };

    attr = hyphenate(name);
    // first check dynamic version
    if ((value = getBindAttr(el, attr)) === null) {
      if ((value = getBindAttr(el, attr + '.sync')) !== null) {
        prop.mode = propBindingModes.TWO_WAY;
      } else if ((value = getBindAttr(el, attr + '.once')) !== null) {
        prop.mode = propBindingModes.ONE_TIME;
      }
    }
    if (value !== null) {
      // has dynamic binding!
      prop.raw = value;
      parsed = parseDirective(value);
      value = parsed.expression;
      prop.filters = parsed.filters;
      // check binding type
      if (isLiteral(value) && !parsed.filters) {
        // for expressions containing literal numbers and
        // booleans, there's no need to setup a prop binding,
        // so we can optimize them as a one-time set.
        prop.optimizedLiteral = true;
      } else {
        prop.dynamic = true;
        // check non-settable path for two-way bindings
        if (process.env.NODE_ENV !== 'production' && prop.mode === propBindingModes.TWO_WAY && !settablePathRE.test(value)) {
          prop.mode = propBindingModes.ONE_WAY;
          warn('Cannot bind two-way prop with non-settable ' + 'parent path: ' + value, vm);
        }
      }
      prop.parentPath = value;

      // warn required two-way
      if (process.env.NODE_ENV !== 'production' && options.twoWay && prop.mode !== propBindingModes.TWO_WAY) {
        warn('Prop "' + name + '" expects a two-way binding type.', vm);
      }
    } else if ((value = getAttr(el, attr)) !== null) {
      // has literal binding!
      prop.raw = value;
    } else if (process.env.NODE_ENV !== 'production') {
      // check possible camelCase prop usage
      var lowerCaseName = path.toLowerCase();
      value = /[A-Z\-]/.test(name) && (el.getAttribute(lowerCaseName) || el.getAttribute(':' + lowerCaseName) || el.getAttribute('v-bind:' + lowerCaseName) || el.getAttribute(':' + lowerCaseName + '.once') || el.getAttribute('v-bind:' + lowerCaseName + '.once') || el.getAttribute(':' + lowerCaseName + '.sync') || el.getAttribute('v-bind:' + lowerCaseName + '.sync'));
      if (value) {
        warn('Possible usage error for prop `' + lowerCaseName + '` - ' + 'did you mean `' + attr + '`? HTML is case-insensitive, remember to use ' + 'kebab-case for props in templates.', vm);
      } else if (options.required) {
        // warn missing required
        warn('Missing required prop: ' + name, vm);
      }
    }
    // push prop
    props.push(prop);
  }
  return makePropsLinkFn(props);
}

/**
 * Build a function that applies props to a vm.
 *
 * @param {Array} props
 * @return {Function} propsLinkFn
 */

function makePropsLinkFn(props) {
  return function propsLinkFn(vm, scope) {
    // store resolved props info
    vm._props = {};
    var inlineProps = vm.$options.propsData;
    var i = props.length;
    var prop, path, options, value, raw;
    while (i--) {
      prop = props[i];
      raw = prop.raw;
      path = prop.path;
      options = prop.options;
      vm._props[path] = prop;
      if (inlineProps && hasOwn(inlineProps, path)) {
        initProp(vm, prop, inlineProps[path]);
      }if (raw === null) {
        // initialize absent prop
        initProp(vm, prop, undefined);
      } else if (prop.dynamic) {
        // dynamic prop
        if (prop.mode === propBindingModes.ONE_TIME) {
          // one time binding
          value = (scope || vm._context || vm).$get(prop.parentPath);
          initProp(vm, prop, value);
        } else {
          if (vm._context) {
            // dynamic binding
            vm._bindDir({
              name: 'prop',
              def: propDef,
              prop: prop
            }, null, null, scope); // el, host, scope
          } else {
              // root instance
              initProp(vm, prop, vm.$get(prop.parentPath));
            }
        }
      } else if (prop.optimizedLiteral) {
        // optimized literal, cast it and just set once
        var stripped = stripQuotes(raw);
        value = stripped === raw ? toBoolean(toNumber(raw)) : stripped;
        initProp(vm, prop, value);
      } else {
        // string literal, but we need to cater for
        // Boolean props with no value, or with same
        // literal value (e.g. disabled="disabled")
        // see https://github.com/vuejs/vue-loader/issues/182
        value = options.type === Boolean && (raw === '' || raw === hyphenate(prop.name)) ? true : raw;
        initProp(vm, prop, value);
      }
    }
  };
}

/**
 * Process a prop with a rawValue, applying necessary coersions,
 * default values & assertions and call the given callback with
 * processed value.
 *
 * @param {Vue} vm
 * @param {Object} prop
 * @param {*} rawValue
 * @param {Function} fn
 */

function processPropValue(vm, prop, rawValue, fn) {
  var isSimple = prop.dynamic && isSimplePath(prop.parentPath);
  var value = rawValue;
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop);
  }
  value = coerceProp(prop, value);
  var coerced = value !== rawValue;
  if (!assertProp(prop, value, vm)) {
    value = undefined;
  }
  if (isSimple && !coerced) {
    withoutConversion(function () {
      fn(value);
    });
  } else {
    fn(value);
  }
}

/**
 * Set a prop's initial value on a vm and its data object.
 *
 * @param {Vue} vm
 * @param {Object} prop
 * @param {*} value
 */

function initProp(vm, prop, value) {
  processPropValue(vm, prop, value, function (value) {
    defineReactive(vm, prop.path, value);
  });
}

/**
 * Update a prop's value on a vm.
 *
 * @param {Vue} vm
 * @param {Object} prop
 * @param {*} value
 */

function updateProp(vm, prop, value) {
  processPropValue(vm, prop, value, function (value) {
    vm[prop.path] = value;
  });
}

/**
 * Get the default value of a prop.
 *
 * @param {Vue} vm
 * @param {Object} prop
 * @return {*}
 */

function getPropDefaultValue(vm, prop) {
  // no default, return undefined
  var options = prop.options;
  if (!hasOwn(options, 'default')) {
    // absent boolean value defaults to false
    return options.type === Boolean ? false : undefined;
  }
  var def = options['default'];
  // warn against non-factory defaults for Object & Array
  if (isObject(def)) {
    process.env.NODE_ENV !== 'production' && warn('Invalid default value for prop "' + prop.name + '": ' + 'Props with type Object/Array must use a factory function ' + 'to return the default value.', vm);
  }
  // call factory function for non-Function types
  return typeof def === 'function' && options.type !== Function ? def.call(vm) : def;
}

/**
 * Assert whether a prop is valid.
 *
 * @param {Object} prop
 * @param {*} value
 * @param {Vue} vm
 */

function assertProp(prop, value, vm) {
  if (!prop.options.required && ( // non-required
  prop.raw === null || // abscent
  value == null) // null or undefined
  ) {
      return true;
    }
  var options = prop.options;
  var type = options.type;
  var valid = !type;
  var expectedTypes = [];
  if (type) {
    if (!isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType);
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    if (process.env.NODE_ENV !== 'production') {
      warn('Invalid prop: type check failed for prop "' + prop.name + '".' + ' Expected ' + expectedTypes.map(formatType).join(', ') + ', got ' + formatValue(value) + '.', vm);
    }
    return false;
  }
  var validator = options.validator;
  if (validator) {
    if (!validator(value)) {
      process.env.NODE_ENV !== 'production' && warn('Invalid prop: custom validator check failed for prop "' + prop.name + '".', vm);
      return false;
    }
  }
  return true;
}

/**
 * Force parsing value with coerce option.
 *
 * @param {*} value
 * @param {Object} options
 * @return {*}
 */

function coerceProp(prop, value) {
  var coerce = prop.options.coerce;
  if (!coerce) {
    return value;
  }
  // coerce is a function
  return coerce(value);
}

/**
 * Assert the type of a value
 *
 * @param {*} value
 * @param {Function} type
 * @return {Object}
 */

function assertType(value, type) {
  var valid;
  var expectedType;
  if (type === String) {
    expectedType = 'string';
    valid = typeof value === expectedType;
  } else if (type === Number) {
    expectedType = 'number';
    valid = typeof value === expectedType;
  } else if (type === Boolean) {
    expectedType = 'boolean';
    valid = typeof value === expectedType;
  } else if (type === Function) {
    expectedType = 'function';
    valid = typeof value === expectedType;
  } else if (type === Object) {
    expectedType = 'object';
    valid = isPlainObject(value);
  } else if (type === Array) {
    expectedType = 'array';
    valid = isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  };
}

/**
 * Format type for output
 *
 * @param {String} type
 * @return {String}
 */

function formatType(type) {
  return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'custom type';
}

/**
 * Format value
 *
 * @param {*} value
 * @return {String}
 */

function formatValue(val) {
  return Object.prototype.toString.call(val).slice(8, -1);
}

var bindingModes = config._propBindingModes;

var propDef = {

  bind: function bind() {
    var child = this.vm;
    var parent = child._context;
    // passed in from compiler directly
    var prop = this.descriptor.prop;
    var childKey = prop.path;
    var parentKey = prop.parentPath;
    var twoWay = prop.mode === bindingModes.TWO_WAY;

    var parentWatcher = this.parentWatcher = new Watcher(parent, parentKey, function (val) {
      updateProp(child, prop, val);
    }, {
      twoWay: twoWay,
      filters: prop.filters,
      // important: props need to be observed on the
      // v-for scope if present
      scope: this._scope
    });

    // set the child initial value.
    initProp(child, prop, parentWatcher.value);

    // setup two-way binding
    if (twoWay) {
      // important: defer the child watcher creation until
      // the created hook (after data observation)
      var self = this;
      child.$once('pre-hook:created', function () {
        self.childWatcher = new Watcher(child, childKey, function (val) {
          parentWatcher.set(val);
        }, {
          // ensure sync upward before parent sync down.
          // this is necessary in cases e.g. the child
          // mutates a prop array, then replaces it. (#1683)
          sync: true
        });
      });
    }
  },

  unbind: function unbind() {
    this.parentWatcher.teardown();
    if (this.childWatcher) {
      this.childWatcher.teardown();
    }
  }
};

var queue$1 = [];
var queued = false;

/**
 * Push a job into the queue.
 *
 * @param {Function} job
 */

function pushJob(job) {
  queue$1.push(job);
  if (!queued) {
    queued = true;
    nextTick(flush);
  }
}

/**
 * Flush the queue, and do one forced reflow before
 * triggering transitions.
 */

function flush() {
  // Force layout
  var f = document.documentElement.offsetHeight;
  for (var i = 0; i < queue$1.length; i++) {
    queue$1[i]();
  }
  queue$1 = [];
  queued = false;
  // dummy return, so js linters don't complain about
  // unused variable f
  return f;
}

var TYPE_TRANSITION = 'transition';
var TYPE_ANIMATION = 'animation';
var transDurationProp = transitionProp + 'Duration';
var animDurationProp = animationProp + 'Duration';

/**
 * If a just-entered element is applied the
 * leave class while its enter transition hasn't started yet,
 * and the transitioned property has the same value for both
 * enter/leave, then the leave transition will be skipped and
 * the transitionend event never fires. This function ensures
 * its callback to be called after a transition has started
 * by waiting for double raf.
 *
 * It falls back to setTimeout on devices that support CSS
 * transitions but not raf (e.g. Android 4.2 browser) - since
 * these environments are usually slow, we are giving it a
 * relatively large timeout.
 */

var raf = inBrowser && window.requestAnimationFrame;
var waitForTransitionStart = raf
/* istanbul ignore next */
? function (fn) {
  raf(function () {
    raf(fn);
  });
} : function (fn) {
  setTimeout(fn, 50);
};

/**
 * A Transition object that encapsulates the state and logic
 * of the transition.
 *
 * @param {Element} el
 * @param {String} id
 * @param {Object} hooks
 * @param {Vue} vm
 */
function Transition(el, id, hooks, vm) {
  this.id = id;
  this.el = el;
  this.enterClass = hooks && hooks.enterClass || id + '-enter';
  this.leaveClass = hooks && hooks.leaveClass || id + '-leave';
  this.hooks = hooks;
  this.vm = vm;
  // async state
  this.pendingCssEvent = this.pendingCssCb = this.cancel = this.pendingJsCb = this.op = this.cb = null;
  this.justEntered = false;
  this.entered = this.left = false;
  this.typeCache = {};
  // check css transition type
  this.type = hooks && hooks.type;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production') {
    if (this.type && this.type !== TYPE_TRANSITION && this.type !== TYPE_ANIMATION) {
      warn('invalid CSS transition type for transition="' + this.id + '": ' + this.type, vm);
    }
  }
  // bind
  var self = this;['enterNextTick', 'enterDone', 'leaveNextTick', 'leaveDone'].forEach(function (m) {
    self[m] = bind(self[m], self);
  });
}

var p$1 = Transition.prototype;

/**
 * Start an entering transition.
 *
 * 1. enter transition triggered
 * 2. call beforeEnter hook
 * 3. add enter class
 * 4. insert/show element
 * 5. call enter hook (with possible explicit js callback)
 * 6. reflow
 * 7. based on transition type:
 *    - transition:
 *        remove class now, wait for transitionend,
 *        then done if there's no explicit js callback.
 *    - animation:
 *        wait for animationend, remove class,
 *        then done if there's no explicit js callback.
 *    - no css transition:
 *        done now if there's no explicit js callback.
 * 8. wait for either done or js callback, then call
 *    afterEnter hook.
 *
 * @param {Function} op - insert/show the element
 * @param {Function} [cb]
 */

p$1.enter = function (op, cb) {
  this.cancelPending();
  this.callHook('beforeEnter');
  this.cb = cb;
  addClass(this.el, this.enterClass);
  op();
  this.entered = false;
  this.callHookWithCb('enter');
  if (this.entered) {
    return; // user called done synchronously.
  }
  this.cancel = this.hooks && this.hooks.enterCancelled;
  pushJob(this.enterNextTick);
};

/**
 * The "nextTick" phase of an entering transition, which is
 * to be pushed into a queue and executed after a reflow so
 * that removing the class can trigger a CSS transition.
 */

p$1.enterNextTick = function () {
  var _this = this;

  // prevent transition skipping
  this.justEntered = true;
  waitForTransitionStart(function () {
    _this.justEntered = false;
  });
  var enterDone = this.enterDone;
  var type = this.getCssTransitionType(this.enterClass);
  if (!this.pendingJsCb) {
    if (type === TYPE_TRANSITION) {
      // trigger transition by removing enter class now
      removeClass(this.el, this.enterClass);
      this.setupCssCb(transitionEndEvent, enterDone);
    } else if (type === TYPE_ANIMATION) {
      this.setupCssCb(animationEndEvent, enterDone);
    } else {
      enterDone();
    }
  } else if (type === TYPE_TRANSITION) {
    removeClass(this.el, this.enterClass);
  }
};

/**
 * The "cleanup" phase of an entering transition.
 */

p$1.enterDone = function () {
  this.entered = true;
  this.cancel = this.pendingJsCb = null;
  removeClass(this.el, this.enterClass);
  this.callHook('afterEnter');
  if (this.cb) this.cb();
};

/**
 * Start a leaving transition.
 *
 * 1. leave transition triggered.
 * 2. call beforeLeave hook
 * 3. add leave class (trigger css transition)
 * 4. call leave hook (with possible explicit js callback)
 * 5. reflow if no explicit js callback is provided
 * 6. based on transition type:
 *    - transition or animation:
 *        wait for end event, remove class, then done if
 *        there's no explicit js callback.
 *    - no css transition:
 *        done if there's no explicit js callback.
 * 7. wait for either done or js callback, then call
 *    afterLeave hook.
 *
 * @param {Function} op - remove/hide the element
 * @param {Function} [cb]
 */

p$1.leave = function (op, cb) {
  this.cancelPending();
  this.callHook('beforeLeave');
  this.op = op;
  this.cb = cb;
  addClass(this.el, this.leaveClass);
  this.left = false;
  this.callHookWithCb('leave');
  if (this.left) {
    return; // user called done synchronously.
  }
  this.cancel = this.hooks && this.hooks.leaveCancelled;
  // only need to handle leaveDone if
  // 1. the transition is already done (synchronously called
  //    by the user, which causes this.op set to null)
  // 2. there's no explicit js callback
  if (this.op && !this.pendingJsCb) {
    // if a CSS transition leaves immediately after enter,
    // the transitionend event never fires. therefore we
    // detect such cases and end the leave immediately.
    if (this.justEntered) {
      this.leaveDone();
    } else {
      pushJob(this.leaveNextTick);
    }
  }
};

/**
 * The "nextTick" phase of a leaving transition.
 */

p$1.leaveNextTick = function () {
  var type = this.getCssTransitionType(this.leaveClass);
  if (type) {
    var event = type === TYPE_TRANSITION ? transitionEndEvent : animationEndEvent;
    this.setupCssCb(event, this.leaveDone);
  } else {
    this.leaveDone();
  }
};

/**
 * The "cleanup" phase of a leaving transition.
 */

p$1.leaveDone = function () {
  this.left = true;
  this.cancel = this.pendingJsCb = null;
  this.op();
  removeClass(this.el, this.leaveClass);
  this.callHook('afterLeave');
  if (this.cb) this.cb();
  this.op = null;
};

/**
 * Cancel any pending callbacks from a previously running
 * but not finished transition.
 */

p$1.cancelPending = function () {
  this.op = this.cb = null;
  var hasPending = false;
  if (this.pendingCssCb) {
    hasPending = true;
    off(this.el, this.pendingCssEvent, this.pendingCssCb);
    this.pendingCssEvent = this.pendingCssCb = null;
  }
  if (this.pendingJsCb) {
    hasPending = true;
    this.pendingJsCb.cancel();
    this.pendingJsCb = null;
  }
  if (hasPending) {
    removeClass(this.el, this.enterClass);
    removeClass(this.el, this.leaveClass);
  }
  if (this.cancel) {
    this.cancel.call(this.vm, this.el);
    this.cancel = null;
  }
};

/**
 * Call a user-provided synchronous hook function.
 *
 * @param {String} type
 */

p$1.callHook = function (type) {
  if (this.hooks && this.hooks[type]) {
    this.hooks[type].call(this.vm, this.el);
  }
};

/**
 * Call a user-provided, potentially-async hook function.
 * We check for the length of arguments to see if the hook
 * expects a `done` callback. If true, the transition's end
 * will be determined by when the user calls that callback;
 * otherwise, the end is determined by the CSS transition or
 * animation.
 *
 * @param {String} type
 */

p$1.callHookWithCb = function (type) {
  var hook = this.hooks && this.hooks[type];
  if (hook) {
    if (hook.length > 1) {
      this.pendingJsCb = cancellable(this[type + 'Done']);
    }
    hook.call(this.vm, this.el, this.pendingJsCb);
  }
};

/**
 * Get an element's transition type based on the
 * calculated styles.
 *
 * @param {String} className
 * @return {Number}
 */

p$1.getCssTransitionType = function (className) {
  /* istanbul ignore if */
  if (!transitionEndEvent ||
  // skip CSS transitions if page is not visible -
  // this solves the issue of transitionend events not
  // firing until the page is visible again.
  // pageVisibility API is supported in IE10+, same as
  // CSS transitions.
  document.hidden ||
  // explicit js-only transition
  this.hooks && this.hooks.css === false ||
  // element is hidden
  isHidden(this.el)) {
    return;
  }
  var type = this.type || this.typeCache[className];
  if (type) return type;
  var inlineStyles = this.el.style;
  var computedStyles = window.getComputedStyle(this.el);
  var transDuration = inlineStyles[transDurationProp] || computedStyles[transDurationProp];
  if (transDuration && transDuration !== '0s') {
    type = TYPE_TRANSITION;
  } else {
    var animDuration = inlineStyles[animDurationProp] || computedStyles[animDurationProp];
    if (animDuration && animDuration !== '0s') {
      type = TYPE_ANIMATION;
    }
  }
  if (type) {
    this.typeCache[className] = type;
  }
  return type;
};

/**
 * Setup a CSS transitionend/animationend callback.
 *
 * @param {String} event
 * @param {Function} cb
 */

p$1.setupCssCb = function (event, cb) {
  this.pendingCssEvent = event;
  var self = this;
  var el = this.el;
  var onEnd = this.pendingCssCb = function (e) {
    if (e.target === el) {
      off(el, event, onEnd);
      self.pendingCssEvent = self.pendingCssCb = null;
      if (!self.pendingJsCb && cb) {
        cb();
      }
    }
  };
  on(el, event, onEnd);
};

/**
 * Check if an element is hidden - in that case we can just
 * skip the transition alltogether.
 *
 * @param {Element} el
 * @return {Boolean}
 */

function isHidden(el) {
  if (/svg$/.test(el.namespaceURI)) {
    // SVG elements do not have offset(Width|Height)
    // so we need to check the client rect
    var rect = el.getBoundingClientRect();
    return !(rect.width || rect.height);
  } else {
    return !(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }
}

var transition$1 = {

  priority: TRANSITION,

  update: function update(id, oldId) {
    var el = this.el;
    // resolve on owner vm
    var hooks = resolveAsset(this.vm.$options, 'transitions', id);
    id = id || 'v';
    el.__v_trans = new Transition(el, id, hooks, this.vm);
    if (oldId) {
      removeClass(el, oldId + '-transition');
    }
    addClass(el, id + '-transition');
  }
};

var internalDirectives = {
  style: style,
  'class': vClass,
  component: component,
  prop: propDef,
  transition: transition$1
};

// special binding prefixes
var bindRE = /^v-bind:|^:/;
var onRE = /^v-on:|^@/;
var dirAttrRE = /^v-([^:]+)(?:$|:(.*)$)/;
var modifierRE = /\.[^\.]+/g;
var transitionRE = /^(v-bind:|:)?transition$/;

// default directive priority
var DEFAULT_PRIORITY = 1000;
var DEFAULT_TERMINAL_PRIORITY = 2000;

/**
 * Compile a template and return a reusable composite link
 * function, which recursively contains more link functions
 * inside. This top level compile function would normally
 * be called on instance root nodes, but can also be used
 * for partial compilation if the partial argument is true.
 *
 * The returned composite link function, when called, will
 * return an unlink function that tearsdown all directives
 * created during the linking phase.
 *
 * @param {Element|DocumentFragment} el
 * @param {Object} options
 * @param {Boolean} partial
 * @return {Function}
 */

function compile(el, options, partial) {
  // link function for the node itself.
  var nodeLinkFn = partial || !options._asComponent ? compileNode(el, options) : null;
  // link function for the childNodes
  var childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && !isScript(el) && el.hasChildNodes() ? compileNodeList(el.childNodes, options) : null;

  /**
   * A composite linker function to be called on a already
   * compiled piece of DOM, which instantiates all directive
   * instances.
   *
   * @param {Vue} vm
   * @param {Element|DocumentFragment} el
   * @param {Vue} [host] - host vm of transcluded content
   * @param {Object} [scope] - v-for scope
   * @param {Fragment} [frag] - link context fragment
   * @return {Function|undefined}
   */

  return function compositeLinkFn(vm, el, host, scope, frag) {
    // cache childNodes before linking parent, fix #657
    var childNodes = toArray(el.childNodes);
    // link
    var dirs = linkAndCapture(function compositeLinkCapturer() {
      if (nodeLinkFn) nodeLinkFn(vm, el, host, scope, frag);
      if (childLinkFn) childLinkFn(vm, childNodes, host, scope, frag);
    }, vm);
    return makeUnlinkFn(vm, dirs);
  };
}

/**
 * Apply a linker to a vm/element pair and capture the
 * directives created during the process.
 *
 * @param {Function} linker
 * @param {Vue} vm
 */

function linkAndCapture(linker, vm) {
  /* istanbul ignore if */
  if (process.env.NODE_ENV === 'production') {
    // reset directives before every capture in production
    // mode, so that when unlinking we don't need to splice
    // them out (which turns out to be a perf hit).
    // they are kept in development mode because they are
    // useful for Vue's own tests.
    vm._directives = [];
  }
  var originalDirCount = vm._directives.length;
  linker();
  var dirs = vm._directives.slice(originalDirCount);
  dirs.sort(directiveComparator);
  for (var i = 0, l = dirs.length; i < l; i++) {
    dirs[i]._bind();
  }
  return dirs;
}

/**
 * Directive priority sort comparator
 *
 * @param {Object} a
 * @param {Object} b
 */

function directiveComparator(a, b) {
  a = a.descriptor.def.priority || DEFAULT_PRIORITY;
  b = b.descriptor.def.priority || DEFAULT_PRIORITY;
  return a > b ? -1 : a === b ? 0 : 1;
}

/**
 * Linker functions return an unlink function that
 * tearsdown all directives instances generated during
 * the process.
 *
 * We create unlink functions with only the necessary
 * information to avoid retaining additional closures.
 *
 * @param {Vue} vm
 * @param {Array} dirs
 * @param {Vue} [context]
 * @param {Array} [contextDirs]
 * @return {Function}
 */

function makeUnlinkFn(vm, dirs, context, contextDirs) {
  function unlink(destroying) {
    teardownDirs(vm, dirs, destroying);
    if (context && contextDirs) {
      teardownDirs(context, contextDirs);
    }
  }
  // expose linked directives
  unlink.dirs = dirs;
  return unlink;
}

/**
 * Teardown partial linked directives.
 *
 * @param {Vue} vm
 * @param {Array} dirs
 * @param {Boolean} destroying
 */

function teardownDirs(vm, dirs, destroying) {
  var i = dirs.length;
  while (i--) {
    dirs[i]._teardown();
    if (process.env.NODE_ENV !== 'production' && !destroying) {
      vm._directives.$remove(dirs[i]);
    }
  }
}

/**
 * Compile link props on an instance.
 *
 * @param {Vue} vm
 * @param {Element} el
 * @param {Object} props
 * @param {Object} [scope]
 * @return {Function}
 */

function compileAndLinkProps(vm, el, props, scope) {
  var propsLinkFn = compileProps(el, props, vm);
  var propDirs = linkAndCapture(function () {
    propsLinkFn(vm, scope);
  }, vm);
  return makeUnlinkFn(vm, propDirs);
}

/**
 * Compile the root element of an instance.
 *
 * 1. attrs on context container (context scope)
 * 2. attrs on the component template root node, if
 *    replace:true (child scope)
 *
 * If this is a fragment instance, we only need to compile 1.
 *
 * @param {Element} el
 * @param {Object} options
 * @param {Object} contextOptions
 * @return {Function}
 */

function compileRoot(el, options, contextOptions) {
  var containerAttrs = options._containerAttrs;
  var replacerAttrs = options._replacerAttrs;
  var contextLinkFn, replacerLinkFn;

  // only need to compile other attributes for
  // non-fragment instances
  if (el.nodeType !== 11) {
    // for components, container and replacer need to be
    // compiled separately and linked in different scopes.
    if (options._asComponent) {
      // 2. container attributes
      if (containerAttrs && contextOptions) {
        contextLinkFn = compileDirectives(containerAttrs, contextOptions);
      }
      if (replacerAttrs) {
        // 3. replacer attributes
        replacerLinkFn = compileDirectives(replacerAttrs, options);
      }
    } else {
      // non-component, just compile as a normal element.
      replacerLinkFn = compileDirectives(el.attributes, options);
    }
  } else if (process.env.NODE_ENV !== 'production' && containerAttrs) {
    // warn container directives for fragment instances
    var names = containerAttrs.filter(function (attr) {
      // allow vue-loader/vueify scoped css attributes
      return attr.name.indexOf('_v-') < 0 &&
      // allow event listeners
      !onRE.test(attr.name) &&
      // allow slots
      attr.name !== 'slot';
    }).map(function (attr) {
      return '"' + attr.name + '"';
    });
    if (names.length) {
      var plural = names.length > 1;
      warn('Attribute' + (plural ? 's ' : ' ') + names.join(', ') + (plural ? ' are' : ' is') + ' ignored on component ' + '<' + options.el.tagName.toLowerCase() + '> because ' + 'the component is a fragment instance: ' + 'http://vuejs.org/guide/components.html#Fragment-Instance');
    }
  }

  options._containerAttrs = options._replacerAttrs = null;
  return function rootLinkFn(vm, el, scope) {
    // link context scope dirs
    var context = vm._context;
    var contextDirs;
    if (context && contextLinkFn) {
      contextDirs = linkAndCapture(function () {
        contextLinkFn(context, el, null, scope);
      }, context);
    }

    // link self
    var selfDirs = linkAndCapture(function () {
      if (replacerLinkFn) replacerLinkFn(vm, el);
    }, vm);

    // return the unlink function that tearsdown context
    // container directives.
    return makeUnlinkFn(vm, selfDirs, context, contextDirs);
  };
}

/**
 * Compile a node and return a nodeLinkFn based on the
 * node type.
 *
 * @param {Node} node
 * @param {Object} options
 * @return {Function|null}
 */

function compileNode(node, options) {
  var type = node.nodeType;
  if (type === 1 && !isScript(node)) {
    return compileElement(node, options);
  } else if (type === 3 && node.data.trim()) {
    return compileTextNode(node, options);
  } else {
    return null;
  }
}

/**
 * Compile an element and return a nodeLinkFn.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Function|null}
 */

function compileElement(el, options) {
  // preprocess textareas.
  // textarea treats its text content as the initial value.
  // just bind it as an attr directive for value.
  if (el.tagName === 'TEXTAREA') {
    var tokens = parseText(el.value);
    if (tokens) {
      el.setAttribute(':value', tokensToExp(tokens));
      el.value = '';
    }
  }
  var linkFn;
  var hasAttrs = el.hasAttributes();
  var attrs = hasAttrs && toArray(el.attributes);
  // check terminal directives (for & if)
  if (hasAttrs) {
    linkFn = checkTerminalDirectives(el, attrs, options);
  }
  // check element directives
  if (!linkFn) {
    linkFn = checkElementDirectives(el, options);
  }
  // check component
  if (!linkFn) {
    linkFn = checkComponent(el, options);
  }
  // normal directives
  if (!linkFn && hasAttrs) {
    linkFn = compileDirectives(attrs, options);
  }
  return linkFn;
}

/**
 * Compile a textNode and return a nodeLinkFn.
 *
 * @param {TextNode} node
 * @param {Object} options
 * @return {Function|null} textNodeLinkFn
 */

function compileTextNode(node, options) {
  // skip marked text nodes
  if (node._skip) {
    return removeText;
  }

  var tokens = parseText(node.wholeText);
  if (!tokens) {
    return null;
  }

  // mark adjacent text nodes as skipped,
  // because we are using node.wholeText to compile
  // all adjacent text nodes together. This fixes
  // issues in IE where sometimes it splits up a single
  // text node into multiple ones.
  var next = node.nextSibling;
  while (next && next.nodeType === 3) {
    next._skip = true;
    next = next.nextSibling;
  }

  var frag = document.createDocumentFragment();
  var el, token;
  for (var i = 0, l = tokens.length; i < l; i++) {
    token = tokens[i];
    el = token.tag ? processTextToken(token, options) : document.createTextNode(token.value);
    frag.appendChild(el);
  }
  return makeTextNodeLinkFn(tokens, frag, options);
}

/**
 * Linker for an skipped text node.
 *
 * @param {Vue} vm
 * @param {Text} node
 */

function removeText(vm, node) {
  remove(node);
}

/**
 * Process a single text token.
 *
 * @param {Object} token
 * @param {Object} options
 * @return {Node}
 */

function processTextToken(token, options) {
  var el;
  if (token.oneTime) {
    el = document.createTextNode(token.value);
  } else {
    if (token.html) {
      el = document.createComment('v-html');
      setTokenType('html');
    } else {
      // IE will clean up empty textNodes during
      // frag.cloneNode(true), so we have to give it
      // something here...
      el = document.createTextNode(' ');
      setTokenType('text');
    }
  }
  function setTokenType(type) {
    if (token.descriptor) return;
    var parsed = parseDirective(token.value);
    token.descriptor = {
      name: type,
      def: directives[type],
      expression: parsed.expression,
      filters: parsed.filters
    };
  }
  return el;
}

/**
 * Build a function that processes a textNode.
 *
 * @param {Array<Object>} tokens
 * @param {DocumentFragment} frag
 */

function makeTextNodeLinkFn(tokens, frag) {
  return function textNodeLinkFn(vm, el, host, scope) {
    var fragClone = frag.cloneNode(true);
    var childNodes = toArray(fragClone.childNodes);
    var token, value, node;
    for (var i = 0, l = tokens.length; i < l; i++) {
      token = tokens[i];
      value = token.value;
      if (token.tag) {
        node = childNodes[i];
        if (token.oneTime) {
          value = (scope || vm).$eval(value);
          if (token.html) {
            replace(node, parseTemplate(value, true));
          } else {
            node.data = value;
          }
        } else {
          vm._bindDir(token.descriptor, node, host, scope);
        }
      }
    }
    replace(el, fragClone);
  };
}

/**
 * Compile a node list and return a childLinkFn.
 *
 * @param {NodeList} nodeList
 * @param {Object} options
 * @return {Function|undefined}
 */

function compileNodeList(nodeList, options) {
  var linkFns = [];
  var nodeLinkFn, childLinkFn, node;
  for (var i = 0, l = nodeList.length; i < l; i++) {
    node = nodeList[i];
    nodeLinkFn = compileNode(node, options);
    childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && node.tagName !== 'SCRIPT' && node.hasChildNodes() ? compileNodeList(node.childNodes, options) : null;
    linkFns.push(nodeLinkFn, childLinkFn);
  }
  return linkFns.length ? makeChildLinkFn(linkFns) : null;
}

/**
 * Make a child link function for a node's childNodes.
 *
 * @param {Array<Function>} linkFns
 * @return {Function} childLinkFn
 */

function makeChildLinkFn(linkFns) {
  return function childLinkFn(vm, nodes, host, scope, frag) {
    var node, nodeLinkFn, childrenLinkFn;
    for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
      node = nodes[n];
      nodeLinkFn = linkFns[i++];
      childrenLinkFn = linkFns[i++];
      // cache childNodes before linking parent, fix #657
      var childNodes = toArray(node.childNodes);
      if (nodeLinkFn) {
        nodeLinkFn(vm, node, host, scope, frag);
      }
      if (childrenLinkFn) {
        childrenLinkFn(vm, childNodes, host, scope, frag);
      }
    }
  };
}

/**
 * Check for element directives (custom elements that should
 * be resovled as terminal directives).
 *
 * @param {Element} el
 * @param {Object} options
 */

function checkElementDirectives(el, options) {
  var tag = el.tagName.toLowerCase();
  if (commonTagRE.test(tag)) {
    return;
  }
  var def = resolveAsset(options, 'elementDirectives', tag);
  if (def) {
    return makeTerminalNodeLinkFn(el, tag, '', options, def);
  }
}

/**
 * Check if an element is a component. If yes, return
 * a component link function.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Function|undefined}
 */

function checkComponent(el, options) {
  var component = checkComponentAttr(el, options);
  if (component) {
    var ref = findRef(el);
    var descriptor = {
      name: 'component',
      ref: ref,
      expression: component.id,
      def: internalDirectives.component,
      modifiers: {
        literal: !component.dynamic
      }
    };
    var componentLinkFn = function componentLinkFn(vm, el, host, scope, frag) {
      if (ref) {
        defineReactive((scope || vm).$refs, ref, null);
      }
      vm._bindDir(descriptor, el, host, scope, frag);
    };
    componentLinkFn.terminal = true;
    return componentLinkFn;
  }
}

/**
 * Check an element for terminal directives in fixed order.
 * If it finds one, return a terminal link function.
 *
 * @param {Element} el
 * @param {Array} attrs
 * @param {Object} options
 * @return {Function} terminalLinkFn
 */

function checkTerminalDirectives(el, attrs, options) {
  // skip v-pre
  if (getAttr(el, 'v-pre') !== null) {
    return skip;
  }
  // skip v-else block, but only if following v-if
  if (el.hasAttribute('v-else')) {
    var prev = el.previousElementSibling;
    if (prev && prev.hasAttribute('v-if')) {
      return skip;
    }
  }

  var attr, name, value, modifiers, matched, dirName, rawName, arg, def, termDef;
  for (var i = 0, j = attrs.length; i < j; i++) {
    attr = attrs[i];
    name = attr.name.replace(modifierRE, '');
    if (matched = name.match(dirAttrRE)) {
      def = resolveAsset(options, 'directives', matched[1]);
      if (def && def.terminal) {
        if (!termDef || (def.priority || DEFAULT_TERMINAL_PRIORITY) > termDef.priority) {
          termDef = def;
          rawName = attr.name;
          modifiers = parseModifiers(attr.name);
          value = attr.value;
          dirName = matched[1];
          arg = matched[2];
        }
      }
    }
  }

  if (termDef) {
    return makeTerminalNodeLinkFn(el, dirName, value, options, termDef, rawName, arg, modifiers);
  }
}

function skip() {}
skip.terminal = true;

/**
 * Build a node link function for a terminal directive.
 * A terminal link function terminates the current
 * compilation recursion and handles compilation of the
 * subtree in the directive.
 *
 * @param {Element} el
 * @param {String} dirName
 * @param {String} value
 * @param {Object} options
 * @param {Object} def
 * @param {String} [rawName]
 * @param {String} [arg]
 * @param {Object} [modifiers]
 * @return {Function} terminalLinkFn
 */

function makeTerminalNodeLinkFn(el, dirName, value, options, def, rawName, arg, modifiers) {
  var parsed = parseDirective(value);
  var descriptor = {
    name: dirName,
    arg: arg,
    expression: parsed.expression,
    filters: parsed.filters,
    raw: value,
    attr: rawName,
    modifiers: modifiers,
    def: def
  };
  // check ref for v-for and router-view
  if (dirName === 'for' || dirName === 'router-view') {
    descriptor.ref = findRef(el);
  }
  var fn = function terminalNodeLinkFn(vm, el, host, scope, frag) {
    if (descriptor.ref) {
      defineReactive((scope || vm).$refs, descriptor.ref, null);
    }
    vm._bindDir(descriptor, el, host, scope, frag);
  };
  fn.terminal = true;
  return fn;
}

/**
 * Compile the directives on an element and return a linker.
 *
 * @param {Array|NamedNodeMap} attrs
 * @param {Object} options
 * @return {Function}
 */

function compileDirectives(attrs, options) {
  var i = attrs.length;
  var dirs = [];
  var attr, name, value, rawName, rawValue, dirName, arg, modifiers, dirDef, tokens, matched;
  while (i--) {
    attr = attrs[i];
    name = rawName = attr.name;
    value = rawValue = attr.value;
    tokens = parseText(value);
    // reset arg
    arg = null;
    // check modifiers
    modifiers = parseModifiers(name);
    name = name.replace(modifierRE, '');

    // attribute interpolations
    if (tokens) {
      value = tokensToExp(tokens);
      arg = name;
      pushDir('bind', directives.bind, tokens);
      // warn against mixing mustaches with v-bind
      if (process.env.NODE_ENV !== 'production') {
        if (name === 'class' && Array.prototype.some.call(attrs, function (attr) {
          return attr.name === ':class' || attr.name === 'v-bind:class';
        })) {
          warn('class="' + rawValue + '": Do not mix mustache interpolation ' + 'and v-bind for "class" on the same element. Use one or the other.', options);
        }
      }
    } else

      // special attribute: transition
      if (transitionRE.test(name)) {
        modifiers.literal = !bindRE.test(name);
        pushDir('transition', internalDirectives.transition);
      } else

        // event handlers
        if (onRE.test(name)) {
          arg = name.replace(onRE, '');
          pushDir('on', directives.on);
        } else

          // attribute bindings
          if (bindRE.test(name)) {
            dirName = name.replace(bindRE, '');
            if (dirName === 'style' || dirName === 'class') {
              pushDir(dirName, internalDirectives[dirName]);
            } else {
              arg = dirName;
              pushDir('bind', directives.bind);
            }
          } else

            // normal directives
            if (matched = name.match(dirAttrRE)) {
              dirName = matched[1];
              arg = matched[2];

              // skip v-else (when used with v-show)
              if (dirName === 'else') {
                continue;
              }

              dirDef = resolveAsset(options, 'directives', dirName, true);
              if (dirDef) {
                pushDir(dirName, dirDef);
              }
            }
  }

  /**
   * Push a directive.
   *
   * @param {String} dirName
   * @param {Object|Function} def
   * @param {Array} [interpTokens]
   */

  function pushDir(dirName, def, interpTokens) {
    var hasOneTimeToken = interpTokens && hasOneTime(interpTokens);
    var parsed = !hasOneTimeToken && parseDirective(value);
    dirs.push({
      name: dirName,
      attr: rawName,
      raw: rawValue,
      def: def,
      arg: arg,
      modifiers: modifiers,
      // conversion from interpolation strings with one-time token
      // to expression is differed until directive bind time so that we
      // have access to the actual vm context for one-time bindings.
      expression: parsed && parsed.expression,
      filters: parsed && parsed.filters,
      interp: interpTokens,
      hasOneTime: hasOneTimeToken
    });
  }

  if (dirs.length) {
    return makeNodeLinkFn(dirs);
  }
}

/**
 * Parse modifiers from directive attribute name.
 *
 * @param {String} name
 * @return {Object}
 */

function parseModifiers(name) {
  var res = Object.create(null);
  var match = name.match(modifierRE);
  if (match) {
    var i = match.length;
    while (i--) {
      res[match[i].slice(1)] = true;
    }
  }
  return res;
}

/**
 * Build a link function for all directives on a single node.
 *
 * @param {Array} directives
 * @return {Function} directivesLinkFn
 */

function makeNodeLinkFn(directives) {
  return function nodeLinkFn(vm, el, host, scope, frag) {
    // reverse apply because it's sorted low to high
    var i = directives.length;
    while (i--) {
      vm._bindDir(directives[i], el, host, scope, frag);
    }
  };
}

/**
 * Check if an interpolation string contains one-time tokens.
 *
 * @param {Array} tokens
 * @return {Boolean}
 */

function hasOneTime(tokens) {
  var i = tokens.length;
  while (i--) {
    if (tokens[i].oneTime) return true;
  }
}

function isScript(el) {
  return el.tagName === 'SCRIPT' && (!el.hasAttribute('type') || el.getAttribute('type') === 'text/javascript');
}

var specialCharRE = /[^\w\-:\.]/;

/**
 * Process an element or a DocumentFragment based on a
 * instance option object. This allows us to transclude
 * a template node/fragment before the instance is created,
 * so the processed fragment can then be cloned and reused
 * in v-for.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Element|DocumentFragment}
 */

function transclude(el, options) {
  // extract container attributes to pass them down
  // to compiler, because they need to be compiled in
  // parent scope. we are mutating the options object here
  // assuming the same object will be used for compile
  // right after this.
  if (options) {
    options._containerAttrs = extractAttrs(el);
  }
  // for template tags, what we want is its content as
  // a documentFragment (for fragment instances)
  if (isTemplate(el)) {
    el = parseTemplate(el);
  }
  if (options) {
    if (options._asComponent && !options.template) {
      options.template = '<slot></slot>';
    }
    if (options.template) {
      options._content = extractContent(el);
      el = transcludeTemplate(el, options);
    }
  }
  if (isFragment(el)) {
    // anchors for fragment instance
    // passing in `persist: true` to avoid them being
    // discarded by IE during template cloning
    prepend(createAnchor('v-start', true), el);
    el.appendChild(createAnchor('v-end', true));
  }
  return el;
}

/**
 * Process the template option.
 * If the replace option is true this will swap the $el.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Element|DocumentFragment}
 */

function transcludeTemplate(el, options) {
  var template = options.template;
  var frag = parseTemplate(template, true);
  if (frag) {
    var replacer = frag.firstChild;
    var tag = replacer.tagName && replacer.tagName.toLowerCase();
    if (options.replace) {
      /* istanbul ignore if */
      if (el === document.body) {
        process.env.NODE_ENV !== 'production' && warn('You are mounting an instance with a template to ' + '<body>. This will replace <body> entirely. You ' + 'should probably use `replace: false` here.');
      }
      // there are many cases where the instance must
      // become a fragment instance: basically anything that
      // can create more than 1 root nodes.
      if (
      // multi-children template
      frag.childNodes.length > 1 ||
      // non-element template
      replacer.nodeType !== 1 ||
      // single nested component
      tag === 'component' || resolveAsset(options, 'components', tag) || hasBindAttr(replacer, 'is') ||
      // element directive
      resolveAsset(options, 'elementDirectives', tag) ||
      // for block
      replacer.hasAttribute('v-for') ||
      // if block
      replacer.hasAttribute('v-if')) {
        return frag;
      } else {
        options._replacerAttrs = extractAttrs(replacer);
        mergeAttrs(el, replacer);
        return replacer;
      }
    } else {
      el.appendChild(frag);
      return el;
    }
  } else {
    process.env.NODE_ENV !== 'production' && warn('Invalid template option: ' + template);
  }
}

/**
 * Helper to extract a component container's attributes
 * into a plain object array.
 *
 * @param {Element} el
 * @return {Array}
 */

function extractAttrs(el) {
  if (el.nodeType === 1 && el.hasAttributes()) {
    return toArray(el.attributes);
  }
}

/**
 * Merge the attributes of two elements, and make sure
 * the class names are merged properly.
 *
 * @param {Element} from
 * @param {Element} to
 */

function mergeAttrs(from, to) {
  var attrs = from.attributes;
  var i = attrs.length;
  var name, value;
  while (i--) {
    name = attrs[i].name;
    value = attrs[i].value;
    if (!to.hasAttribute(name) && !specialCharRE.test(name)) {
      to.setAttribute(name, value);
    } else if (name === 'class' && !parseText(value) && (value = value.trim())) {
      value.split(/\s+/).forEach(function (cls) {
        addClass(to, cls);
      });
    }
  }
}

/**
 * Scan and determine slot content distribution.
 * We do this during transclusion instead at compile time so that
 * the distribution is decoupled from the compilation order of
 * the slots.
 *
 * @param {Element|DocumentFragment} template
 * @param {Element} content
 * @param {Vue} vm
 */

function resolveSlots(vm, content) {
  if (!content) {
    return;
  }
  var contents = vm._slotContents = Object.create(null);
  var el, name;
  for (var i = 0, l = content.children.length; i < l; i++) {
    el = content.children[i];
    /* eslint-disable no-cond-assign */
    if (name = el.getAttribute('slot')) {
      (contents[name] || (contents[name] = [])).push(el);
    }
    /* eslint-enable no-cond-assign */
    if (process.env.NODE_ENV !== 'production' && getBindAttr(el, 'slot')) {
      warn('The "slot" attribute must be static.', vm.$parent);
    }
  }
  for (name in contents) {
    contents[name] = extractFragment(contents[name], content);
  }
  if (content.hasChildNodes()) {
    var nodes = content.childNodes;
    if (nodes.length === 1 && nodes[0].nodeType === 3 && !nodes[0].data.trim()) {
      return;
    }
    contents['default'] = extractFragment(content.childNodes, content);
  }
}

/**
 * Extract qualified content nodes from a node list.
 *
 * @param {NodeList} nodes
 * @return {DocumentFragment}
 */

function extractFragment(nodes, parent) {
  var frag = document.createDocumentFragment();
  nodes = toArray(nodes);
  for (var i = 0, l = nodes.length; i < l; i++) {
    var node = nodes[i];
    if (isTemplate(node) && !node.hasAttribute('v-if') && !node.hasAttribute('v-for')) {
      parent.removeChild(node);
      node = parseTemplate(node, true);
    }
    frag.appendChild(node);
  }
  return frag;
}



var compiler = Object.freeze({
	compile: compile,
	compileAndLinkProps: compileAndLinkProps,
	compileRoot: compileRoot,
	transclude: transclude,
	resolveSlots: resolveSlots
});

function stateMixin (Vue) {
  /**
   * Accessor for `$data` property, since setting $data
   * requires observing the new object and updating
   * proxied properties.
   */

  Object.defineProperty(Vue.prototype, '$data', {
    get: function get() {
      return this._data;
    },
    set: function set(newData) {
      if (newData !== this._data) {
        this._setData(newData);
      }
    }
  });

  /**
   * Setup the scope of an instance, which contains:
   * - observed data
   * - computed properties
   * - user methods
   * - meta properties
   */

  Vue.prototype._initState = function () {
    this._initProps();
    this._initMeta();
    this._initMethods();
    this._initData();
    this._initComputed();
  };

  /**
   * Initialize props.
   */

  Vue.prototype._initProps = function () {
    var options = this.$options;
    var el = options.el;
    var props = options.props;
    if (props && !el) {
      process.env.NODE_ENV !== 'production' && warn('Props will not be compiled if no `el` option is ' + 'provided at instantiation.', this);
    }
    // make sure to convert string selectors into element now
    el = options.el = query(el);
    this._propsUnlinkFn = el && el.nodeType === 1 && props
    // props must be linked in proper scope if inside v-for
    ? compileAndLinkProps(this, el, props, this._scope) : null;
  };

  /**
   * Initialize the data.
   */

  Vue.prototype._initData = function () {
    var dataFn = this.$options.data;
    var data = this._data = dataFn ? dataFn() : {};
    if (!isPlainObject(data)) {
      data = {};
      process.env.NODE_ENV !== 'production' && warn('data functions should return an object.', this);
    }
    var props = this._props;
    // proxy data on instance
    var keys = Object.keys(data);
    var i, key;
    i = keys.length;
    while (i--) {
      key = keys[i];
      // there are two scenarios where we can proxy a data key:
      // 1. it's not already defined as a prop
      // 2. it's provided via a instantiation option AND there are no
      //    template prop present
      if (!props || !hasOwn(props, key)) {
        this._proxy(key);
      } else if (process.env.NODE_ENV !== 'production') {
        warn('Data field "' + key + '" is already defined ' + 'as a prop. To provide default value for a prop, use the "default" ' + 'prop option; if you want to pass prop values to an instantiation ' + 'call, use the "propsData" option.', this);
      }
    }
    // observe data
    observe(data, this);
  };

  /**
   * Swap the instance's $data. Called in $data's setter.
   *
   * @param {Object} newData
   */

  Vue.prototype._setData = function (newData) {
    newData = newData || {};
    var oldData = this._data;
    this._data = newData;
    var keys, key, i;
    // unproxy keys not present in new data
    keys = Object.keys(oldData);
    i = keys.length;
    while (i--) {
      key = keys[i];
      if (!(key in newData)) {
        this._unproxy(key);
      }
    }
    // proxy keys not already proxied,
    // and trigger change for changed values
    keys = Object.keys(newData);
    i = keys.length;
    while (i--) {
      key = keys[i];
      if (!hasOwn(this, key)) {
        // new property
        this._proxy(key);
      }
    }
    oldData.__ob__.removeVm(this);
    observe(newData, this);
    this._digest();
  };

  /**
   * Proxy a property, so that
   * vm.prop === vm._data.prop
   *
   * @param {String} key
   */

  Vue.prototype._proxy = function (key) {
    if (!isReserved(key)) {
      // need to store ref to self here
      // because these getter/setters might
      // be called by child scopes via
      // prototype inheritance.
      var self = this;
      Object.defineProperty(self, key, {
        configurable: true,
        enumerable: true,
        get: function proxyGetter() {
          return self._data[key];
        },
        set: function proxySetter(val) {
          self._data[key] = val;
        }
      });
    }
  };

  /**
   * Unproxy a property.
   *
   * @param {String} key
   */

  Vue.prototype._unproxy = function (key) {
    if (!isReserved(key)) {
      delete this[key];
    }
  };

  /**
   * Force update on every watcher in scope.
   */

  Vue.prototype._digest = function () {
    for (var i = 0, l = this._watchers.length; i < l; i++) {
      this._watchers[i].update(true); // shallow updates
    }
  };

  /**
   * Setup computed properties. They are essentially
   * special getter/setters
   */

  function noop() {}
  Vue.prototype._initComputed = function () {
    var computed = this.$options.computed;
    if (computed) {
      for (var key in computed) {
        var userDef = computed[key];
        var def = {
          enumerable: true,
          configurable: true
        };
        if (typeof userDef === 'function') {
          def.get = makeComputedGetter(userDef, this);
          def.set = noop;
        } else {
          def.get = userDef.get ? userDef.cache !== false ? makeComputedGetter(userDef.get, this) : bind(userDef.get, this) : noop;
          def.set = userDef.set ? bind(userDef.set, this) : noop;
        }
        Object.defineProperty(this, key, def);
      }
    }
  };

  function makeComputedGetter(getter, owner) {
    var watcher = new Watcher(owner, getter, null, {
      lazy: true
    });
    return function computedGetter() {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    };
  }

  /**
   * Setup instance methods. Methods must be bound to the
   * instance since they might be passed down as a prop to
   * child components.
   */

  Vue.prototype._initMethods = function () {
    var methods = this.$options.methods;
    if (methods) {
      for (var key in methods) {
        this[key] = bind(methods[key], this);
      }
    }
  };

  /**
   * Initialize meta information like $index, $key & $value.
   */

  Vue.prototype._initMeta = function () {
    var metas = this.$options._meta;
    if (metas) {
      for (var key in metas) {
        defineReactive(this, key, metas[key]);
      }
    }
  };
}

var eventRE = /^v-on:|^@/;

function eventsMixin (Vue) {
  /**
   * Setup the instance's option events & watchers.
   * If the value is a string, we pull it from the
   * instance's methods by name.
   */

  Vue.prototype._initEvents = function () {
    var options = this.$options;
    if (options._asComponent) {
      registerComponentEvents(this, options.el);
    }
    registerCallbacks(this, '$on', options.events);
    registerCallbacks(this, '$watch', options.watch);
  };

  /**
   * Register v-on events on a child component
   *
   * @param {Vue} vm
   * @param {Element} el
   */

  function registerComponentEvents(vm, el) {
    var attrs = el.attributes;
    var name, value, handler;
    for (var i = 0, l = attrs.length; i < l; i++) {
      name = attrs[i].name;
      if (eventRE.test(name)) {
        name = name.replace(eventRE, '');
        // force the expression into a statement so that
        // it always dynamically resolves the method to call (#2670)
        // kinda ugly hack, but does the job.
        value = attrs[i].value;
        if (isSimplePath(value)) {
          value += '.apply(this, $arguments)';
        }
        handler = (vm._scope || vm._context).$eval(value, true);
        handler._fromParent = true;
        vm.$on(name.replace(eventRE), handler);
      }
    }
  }

  /**
   * Register callbacks for option events and watchers.
   *
   * @param {Vue} vm
   * @param {String} action
   * @param {Object} hash
   */

  function registerCallbacks(vm, action, hash) {
    if (!hash) return;
    var handlers, key, i, j;
    for (key in hash) {
      handlers = hash[key];
      if (isArray(handlers)) {
        for (i = 0, j = handlers.length; i < j; i++) {
          register(vm, action, key, handlers[i]);
        }
      } else {
        register(vm, action, key, handlers);
      }
    }
  }

  /**
   * Helper to register an event/watch callback.
   *
   * @param {Vue} vm
   * @param {String} action
   * @param {String} key
   * @param {Function|String|Object} handler
   * @param {Object} [options]
   */

  function register(vm, action, key, handler, options) {
    var type = typeof handler;
    if (type === 'function') {
      vm[action](key, handler, options);
    } else if (type === 'string') {
      var methods = vm.$options.methods;
      var method = methods && methods[handler];
      if (method) {
        vm[action](key, method, options);
      } else {
        process.env.NODE_ENV !== 'production' && warn('Unknown method: "' + handler + '" when ' + 'registering callback for ' + action + ': "' + key + '".', vm);
      }
    } else if (handler && type === 'object') {
      register(vm, action, key, handler.handler, handler);
    }
  }

  /**
   * Setup recursive attached/detached calls
   */

  Vue.prototype._initDOMHooks = function () {
    this.$on('hook:attached', onAttached);
    this.$on('hook:detached', onDetached);
  };

  /**
   * Callback to recursively call attached hook on children
   */

  function onAttached() {
    if (!this._isAttached) {
      this._isAttached = true;
      this.$children.forEach(callAttach);
    }
  }

  /**
   * Iterator to call attached hook
   *
   * @param {Vue} child
   */

  function callAttach(child) {
    if (!child._isAttached && inDoc(child.$el)) {
      child._callHook('attached');
    }
  }

  /**
   * Callback to recursively call detached hook on children
   */

  function onDetached() {
    if (this._isAttached) {
      this._isAttached = false;
      this.$children.forEach(callDetach);
    }
  }

  /**
   * Iterator to call detached hook
   *
   * @param {Vue} child
   */

  function callDetach(child) {
    if (child._isAttached && !inDoc(child.$el)) {
      child._callHook('detached');
    }
  }

  /**
   * Trigger all handlers for a hook
   *
   * @param {String} hook
   */

  Vue.prototype._callHook = function (hook) {
    this.$emit('pre-hook:' + hook);
    var handlers = this.$options[hook];
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        handlers[i].call(this);
      }
    }
    this.$emit('hook:' + hook);
  };
}

function noop() {}

/**
 * A directive links a DOM element with a piece of data,
 * which is the result of evaluating an expression.
 * It registers a watcher with the expression and calls
 * the DOM update function when a change is triggered.
 *
 * @param {Object} descriptor
 *                 - {String} name
 *                 - {Object} def
 *                 - {String} expression
 *                 - {Array<Object>} [filters]
 *                 - {Object} [modifiers]
 *                 - {Boolean} literal
 *                 - {String} attr
 *                 - {String} arg
 *                 - {String} raw
 *                 - {String} [ref]
 *                 - {Array<Object>} [interp]
 *                 - {Boolean} [hasOneTime]
 * @param {Vue} vm
 * @param {Node} el
 * @param {Vue} [host] - transclusion host component
 * @param {Object} [scope] - v-for scope
 * @param {Fragment} [frag] - owner fragment
 * @constructor
 */
function Directive(descriptor, vm, el, host, scope, frag) {
  this.vm = vm;
  this.el = el;
  // copy descriptor properties
  this.descriptor = descriptor;
  this.name = descriptor.name;
  this.expression = descriptor.expression;
  this.arg = descriptor.arg;
  this.modifiers = descriptor.modifiers;
  this.filters = descriptor.filters;
  this.literal = this.modifiers && this.modifiers.literal;
  // private
  this._locked = false;
  this._bound = false;
  this._listeners = null;
  // link context
  this._host = host;
  this._scope = scope;
  this._frag = frag;
  // store directives on node in dev mode
  if (process.env.NODE_ENV !== 'production' && this.el) {
    this.el._vue_directives = this.el._vue_directives || [];
    this.el._vue_directives.push(this);
  }
}

/**
 * Initialize the directive, mixin definition properties,
 * setup the watcher, call definition bind() and update()
 * if present.
 */

Directive.prototype._bind = function () {
  var name = this.name;
  var descriptor = this.descriptor;

  // remove attribute
  if ((name !== 'cloak' || this.vm._isCompiled) && this.el && this.el.removeAttribute) {
    var attr = descriptor.attr || 'v-' + name;
    this.el.removeAttribute(attr);
  }

  // copy def properties
  var def = descriptor.def;
  if (typeof def === 'function') {
    this.update = def;
  } else {
    extend(this, def);
  }

  // setup directive params
  this._setupParams();

  // initial bind
  if (this.bind) {
    this.bind();
  }
  this._bound = true;

  if (this.literal) {
    this.update && this.update(descriptor.raw);
  } else if ((this.expression || this.modifiers) && (this.update || this.twoWay) && !this._checkStatement()) {
    // wrapped updater for context
    var dir = this;
    if (this.update) {
      this._update = function (val, oldVal) {
        if (!dir._locked) {
          dir.update(val, oldVal);
        }
      };
    } else {
      this._update = noop;
    }
    var preProcess = this._preProcess ? bind(this._preProcess, this) : null;
    var postProcess = this._postProcess ? bind(this._postProcess, this) : null;
    var watcher = this._watcher = new Watcher(this.vm, this.expression, this._update, // callback
    {
      filters: this.filters,
      twoWay: this.twoWay,
      deep: this.deep,
      preProcess: preProcess,
      postProcess: postProcess,
      scope: this._scope
    });
    // v-model with inital inline value need to sync back to
    // model instead of update to DOM on init. They would
    // set the afterBind hook to indicate that.
    if (this.afterBind) {
      this.afterBind();
    } else if (this.update) {
      this.update(watcher.value);
    }
  }
};

/**
 * Setup all param attributes, e.g. track-by,
 * transition-mode, etc...
 */

Directive.prototype._setupParams = function () {
  if (!this.params) {
    return;
  }
  var params = this.params;
  // swap the params array with a fresh object.
  this.params = Object.create(null);
  var i = params.length;
  var key, val, mappedKey;
  while (i--) {
    key = hyphenate(params[i]);
    mappedKey = camelize(key);
    val = getBindAttr(this.el, key);
    if (val != null) {
      // dynamic
      this._setupParamWatcher(mappedKey, val);
    } else {
      // static
      val = getAttr(this.el, key);
      if (val != null) {
        this.params[mappedKey] = val === '' ? true : val;
      }
    }
  }
};

/**
 * Setup a watcher for a dynamic param.
 *
 * @param {String} key
 * @param {String} expression
 */

Directive.prototype._setupParamWatcher = function (key, expression) {
  var self = this;
  var called = false;
  var unwatch = (this._scope || this.vm).$watch(expression, function (val, oldVal) {
    self.params[key] = val;
    // since we are in immediate mode,
    // only call the param change callbacks if this is not the first update.
    if (called) {
      var cb = self.paramWatchers && self.paramWatchers[key];
      if (cb) {
        cb.call(self, val, oldVal);
      }
    } else {
      called = true;
    }
  }, {
    immediate: true,
    user: false
  });(this._paramUnwatchFns || (this._paramUnwatchFns = [])).push(unwatch);
};

/**
 * Check if the directive is a function caller
 * and if the expression is a callable one. If both true,
 * we wrap up the expression and use it as the event
 * handler.
 *
 * e.g. on-click="a++"
 *
 * @return {Boolean}
 */

Directive.prototype._checkStatement = function () {
  var expression = this.expression;
  if (expression && this.acceptStatement && !isSimplePath(expression)) {
    var fn = parseExpression(expression).get;
    var scope = this._scope || this.vm;
    var handler = function handler(e) {
      scope.$event = e;
      fn.call(scope, scope);
      scope.$event = null;
    };
    if (this.filters) {
      handler = scope._applyFilters(handler, null, this.filters);
    }
    this.update(handler);
    return true;
  }
};

/**
 * Set the corresponding value with the setter.
 * This should only be used in two-way directives
 * e.g. v-model.
 *
 * @param {*} value
 * @public
 */

Directive.prototype.set = function (value) {
  /* istanbul ignore else */
  if (this.twoWay) {
    this._withLock(function () {
      this._watcher.set(value);
    });
  } else if (process.env.NODE_ENV !== 'production') {
    warn('Directive.set() can only be used inside twoWay' + 'directives.');
  }
};

/**
 * Execute a function while preventing that function from
 * triggering updates on this directive instance.
 *
 * @param {Function} fn
 */

Directive.prototype._withLock = function (fn) {
  var self = this;
  self._locked = true;
  fn.call(self);
  nextTick(function () {
    self._locked = false;
  });
};

/**
 * Convenience method that attaches a DOM event listener
 * to the directive element and autometically tears it down
 * during unbind.
 *
 * @param {String} event
 * @param {Function} handler
 * @param {Boolean} [useCapture]
 */

Directive.prototype.on = function (event, handler, useCapture) {
  on(this.el, event, handler, useCapture);(this._listeners || (this._listeners = [])).push([event, handler]);
};

/**
 * Teardown the watcher and call unbind.
 */

Directive.prototype._teardown = function () {
  if (this._bound) {
    this._bound = false;
    if (this.unbind) {
      this.unbind();
    }
    if (this._watcher) {
      this._watcher.teardown();
    }
    var listeners = this._listeners;
    var i;
    if (listeners) {
      i = listeners.length;
      while (i--) {
        off(this.el, listeners[i][0], listeners[i][1]);
      }
    }
    var unwatchFns = this._paramUnwatchFns;
    if (unwatchFns) {
      i = unwatchFns.length;
      while (i--) {
        unwatchFns[i]();
      }
    }
    if (process.env.NODE_ENV !== 'production' && this.el) {
      this.el._vue_directives.$remove(this);
    }
    this.vm = this.el = this._watcher = this._listeners = null;
  }
};

function lifecycleMixin (Vue) {
  /**
   * Update v-ref for component.
   *
   * @param {Boolean} remove
   */

  Vue.prototype._updateRef = function (remove) {
    var ref = this.$options._ref;
    if (ref) {
      var refs = (this._scope || this._context).$refs;
      if (remove) {
        if (refs[ref] === this) {
          refs[ref] = null;
        }
      } else {
        refs[ref] = this;
      }
    }
  };

  /**
   * Transclude, compile and link element.
   *
   * If a pre-compiled linker is available, that means the
   * passed in element will be pre-transcluded and compiled
   * as well - all we need to do is to call the linker.
   *
   * Otherwise we need to call transclude/compile/link here.
   *
   * @param {Element} el
   */

  Vue.prototype._compile = function (el) {
    var options = this.$options;

    // transclude and init element
    // transclude can potentially replace original
    // so we need to keep reference; this step also injects
    // the template and caches the original attributes
    // on the container node and replacer node.
    var original = el;
    el = transclude(el, options);
    this._initElement(el);

    // handle v-pre on root node (#2026)
    if (el.nodeType === 1 && getAttr(el, 'v-pre') !== null) {
      return;
    }

    // root is always compiled per-instance, because
    // container attrs and props can be different every time.
    var contextOptions = this._context && this._context.$options;
    var rootLinker = compileRoot(el, options, contextOptions);

    // resolve slot distribution
    resolveSlots(this, options._content);

    // compile and link the rest
    var contentLinkFn;
    var ctor = this.constructor;
    // component compilation can be cached
    // as long as it's not using inline-template
    if (options._linkerCachable) {
      contentLinkFn = ctor.linker;
      if (!contentLinkFn) {
        contentLinkFn = ctor.linker = compile(el, options);
      }
    }

    // link phase
    // make sure to link root with prop scope!
    var rootUnlinkFn = rootLinker(this, el, this._scope);
    var contentUnlinkFn = contentLinkFn ? contentLinkFn(this, el) : compile(el, options)(this, el);

    // register composite unlink function
    // to be called during instance destruction
    this._unlinkFn = function () {
      rootUnlinkFn();
      // passing destroying: true to avoid searching and
      // splicing the directives
      contentUnlinkFn(true);
    };

    // finally replace original
    if (options.replace) {
      replace(original, el);
    }

    this._isCompiled = true;
    this._callHook('compiled');
  };

  /**
   * Initialize instance element. Called in the public
   * $mount() method.
   *
   * @param {Element} el
   */

  Vue.prototype._initElement = function (el) {
    if (isFragment(el)) {
      this._isFragment = true;
      this.$el = this._fragmentStart = el.firstChild;
      this._fragmentEnd = el.lastChild;
      // set persisted text anchors to empty
      if (this._fragmentStart.nodeType === 3) {
        this._fragmentStart.data = this._fragmentEnd.data = '';
      }
      this._fragment = el;
    } else {
      this.$el = el;
    }
    this.$el.__vue__ = this;
    this._callHook('beforeCompile');
  };

  /**
   * Create and bind a directive to an element.
   *
   * @param {Object} descriptor - parsed directive descriptor
   * @param {Node} node   - target node
   * @param {Vue} [host] - transclusion host component
   * @param {Object} [scope] - v-for scope
   * @param {Fragment} [frag] - owner fragment
   */

  Vue.prototype._bindDir = function (descriptor, node, host, scope, frag) {
    this._directives.push(new Directive(descriptor, this, node, host, scope, frag));
  };

  /**
   * Teardown an instance, unobserves the data, unbind all the
   * directives, turn off all the event listeners, etc.
   *
   * @param {Boolean} remove - whether to remove the DOM node.
   * @param {Boolean} deferCleanup - if true, defer cleanup to
   *                                 be called later
   */

  Vue.prototype._destroy = function (remove, deferCleanup) {
    if (this._isBeingDestroyed) {
      if (!deferCleanup) {
        this._cleanup();
      }
      return;
    }

    var destroyReady;
    var pendingRemoval;

    var self = this;
    // Cleanup should be called either synchronously or asynchronoysly as
    // callback of this.$remove(), or if remove and deferCleanup are false.
    // In any case it should be called after all other removing, unbinding and
    // turning of is done
    var cleanupIfPossible = function cleanupIfPossible() {
      if (destroyReady && !pendingRemoval && !deferCleanup) {
        self._cleanup();
      }
    };

    // remove DOM element
    if (remove && this.$el) {
      pendingRemoval = true;
      this.$remove(function () {
        pendingRemoval = false;
        cleanupIfPossible();
      });
    }

    this._callHook('beforeDestroy');
    this._isBeingDestroyed = true;
    var i;
    // remove self from parent. only necessary
    // if parent is not being destroyed as well.
    var parent = this.$parent;
    if (parent && !parent._isBeingDestroyed) {
      parent.$children.$remove(this);
      // unregister ref (remove: true)
      this._updateRef(true);
    }
    // destroy all children.
    i = this.$children.length;
    while (i--) {
      this.$children[i].$destroy();
    }
    // teardown props
    if (this._propsUnlinkFn) {
      this._propsUnlinkFn();
    }
    // teardown all directives. this also tearsdown all
    // directive-owned watchers.
    if (this._unlinkFn) {
      this._unlinkFn();
    }
    i = this._watchers.length;
    while (i--) {
      this._watchers[i].teardown();
    }
    // remove reference to self on $el
    if (this.$el) {
      this.$el.__vue__ = null;
    }

    destroyReady = true;
    cleanupIfPossible();
  };

  /**
   * Clean up to ensure garbage collection.
   * This is called after the leave transition if there
   * is any.
   */

  Vue.prototype._cleanup = function () {
    if (this._isDestroyed) {
      return;
    }
    // remove self from owner fragment
    // do it in cleanup so that we can call $destroy with
    // defer right when a fragment is about to be removed.
    if (this._frag) {
      this._frag.children.$remove(this);
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (this._data && this._data.__ob__) {
      this._data.__ob__.removeVm(this);
    }
    // Clean up references to private properties and other
    // instances. preserve reference to _data so that proxy
    // accessors still work. The only potential side effect
    // here is that mutating the instance after it's destroyed
    // may affect the state of other components that are still
    // observing the same object, but that seems to be a
    // reasonable responsibility for the user rather than
    // always throwing an error on them.
    this.$el = this.$parent = this.$root = this.$children = this._watchers = this._context = this._scope = this._directives = null;
    // call the last hook...
    this._isDestroyed = true;
    this._callHook('destroyed');
    // turn off all instance listeners.
    this.$off();
  };
}

function miscMixin (Vue) {
  /**
   * Apply a list of filter (descriptors) to a value.
   * Using plain for loops here because this will be called in
   * the getter of any watcher with filters so it is very
   * performance sensitive.
   *
   * @param {*} value
   * @param {*} [oldValue]
   * @param {Array} filters
   * @param {Boolean} write
   * @return {*}
   */

  Vue.prototype._applyFilters = function (value, oldValue, filters, write) {
    var filter, fn, args, arg, offset, i, l, j, k;
    for (i = 0, l = filters.length; i < l; i++) {
      filter = filters[write ? l - i - 1 : i];
      fn = resolveAsset(this.$options, 'filters', filter.name, true);
      if (!fn) continue;
      fn = write ? fn.write : fn.read || fn;
      if (typeof fn !== 'function') continue;
      args = write ? [value, oldValue] : [value];
      offset = write ? 2 : 1;
      if (filter.args) {
        for (j = 0, k = filter.args.length; j < k; j++) {
          arg = filter.args[j];
          args[j + offset] = arg.dynamic ? this.$get(arg.value) : arg.value;
        }
      }
      value = fn.apply(this, args);
    }
    return value;
  };

  /**
   * Resolve a component, depending on whether the component
   * is defined normally or using an async factory function.
   * Resolves synchronously if already resolved, otherwise
   * resolves asynchronously and caches the resolved
   * constructor on the factory.
   *
   * @param {String|Function} value
   * @param {Function} cb
   */

  Vue.prototype._resolveComponent = function (value, cb) {
    var factory;
    if (typeof value === 'function') {
      factory = value;
    } else {
      factory = resolveAsset(this.$options, 'components', value, true);
    }
    /* istanbul ignore if */
    if (!factory) {
      return;
    }
    // async component factory
    if (!factory.options) {
      if (factory.resolved) {
        // cached
        cb(factory.resolved);
      } else if (factory.requested) {
        // pool callbacks
        factory.pendingCallbacks.push(cb);
      } else {
        factory.requested = true;
        var cbs = factory.pendingCallbacks = [cb];
        factory.call(this, function resolve(res) {
          if (isPlainObject(res)) {
            res = Vue.extend(res);
          }
          // cache resolved
          factory.resolved = res;
          // invoke callbacks
          for (var i = 0, l = cbs.length; i < l; i++) {
            cbs[i](res);
          }
        }, function reject(reason) {
          process.env.NODE_ENV !== 'production' && warn('Failed to resolve async component' + (typeof value === 'string' ? ': ' + value : '') + '. ' + (reason ? '\nReason: ' + reason : ''));
        });
      }
    } else {
      // normal component
      cb(factory);
    }
  };
}

var filterRE$1 = /[^|]\|[^|]/;

function dataAPI (Vue) {
  /**
   * Get the value from an expression on this vm.
   *
   * @param {String} exp
   * @param {Boolean} [asStatement]
   * @return {*}
   */

  Vue.prototype.$get = function (exp, asStatement) {
    var res = parseExpression(exp);
    if (res) {
      if (asStatement) {
        var self = this;
        return function statementHandler() {
          self.$arguments = toArray(arguments);
          var result = res.get.call(self, self);
          self.$arguments = null;
          return result;
        };
      } else {
        try {
          return res.get.call(this, this);
        } catch (e) {}
      }
    }
  };

  /**
   * Set the value from an expression on this vm.
   * The expression must be a valid left-hand
   * expression in an assignment.
   *
   * @param {String} exp
   * @param {*} val
   */

  Vue.prototype.$set = function (exp, val) {
    var res = parseExpression(exp, true);
    if (res && res.set) {
      res.set.call(this, this, val);
    }
  };

  /**
   * Delete a property on the VM
   *
   * @param {String} key
   */

  Vue.prototype.$delete = function (key) {
    del(this._data, key);
  };

  /**
   * Watch an expression, trigger callback when its
   * value changes.
   *
   * @param {String|Function} expOrFn
   * @param {Function} cb
   * @param {Object} [options]
   *                 - {Boolean} deep
   *                 - {Boolean} immediate
   * @return {Function} - unwatchFn
   */

  Vue.prototype.$watch = function (expOrFn, cb, options) {
    var vm = this;
    var parsed;
    if (typeof expOrFn === 'string') {
      parsed = parseDirective(expOrFn);
      expOrFn = parsed.expression;
    }
    var watcher = new Watcher(vm, expOrFn, cb, {
      deep: options && options.deep,
      sync: options && options.sync,
      filters: parsed && parsed.filters,
      user: !options || options.user !== false
    });
    if (options && options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn() {
      watcher.teardown();
    };
  };

  /**
   * Evaluate a text directive, including filters.
   *
   * @param {String} text
   * @param {Boolean} [asStatement]
   * @return {String}
   */

  Vue.prototype.$eval = function (text, asStatement) {
    // check for filters.
    if (filterRE$1.test(text)) {
      var dir = parseDirective(text);
      // the filter regex check might give false positive
      // for pipes inside strings, so it's possible that
      // we don't get any filters here
      var val = this.$get(dir.expression, asStatement);
      return dir.filters ? this._applyFilters(val, null, dir.filters) : val;
    } else {
      // no filter
      return this.$get(text, asStatement);
    }
  };

  /**
   * Interpolate a piece of template text.
   *
   * @param {String} text
   * @return {String}
   */

  Vue.prototype.$interpolate = function (text) {
    var tokens = parseText(text);
    var vm = this;
    if (tokens) {
      if (tokens.length === 1) {
        return vm.$eval(tokens[0].value) + '';
      } else {
        return tokens.map(function (token) {
          return token.tag ? vm.$eval(token.value) : token.value;
        }).join('');
      }
    } else {
      return text;
    }
  };

  /**
   * Log instance data as a plain JS object
   * so that it is easier to inspect in console.
   * This method assumes console is available.
   *
   * @param {String} [path]
   */

  Vue.prototype.$log = function (path) {
    var data = path ? getPath(this._data, path) : this._data;
    if (data) {
      data = clean(data);
    }
    // include computed fields
    if (!path) {
      var key;
      for (key in this.$options.computed) {
        data[key] = clean(this[key]);
      }
      if (this._props) {
        for (key in this._props) {
          data[key] = clean(this[key]);
        }
      }
    }
    console.log(data);
  };

  /**
   * "clean" a getter/setter converted object into a plain
   * object copy.
   *
   * @param {Object} - obj
   * @return {Object}
   */

  function clean(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
}

function domAPI (Vue) {
  /**
   * Convenience on-instance nextTick. The callback is
   * auto-bound to the instance, and this avoids component
   * modules having to rely on the global Vue.
   *
   * @param {Function} fn
   */

  Vue.prototype.$nextTick = function (fn) {
    nextTick(fn, this);
  };

  /**
   * Append instance to target
   *
   * @param {Node} target
   * @param {Function} [cb]
   * @param {Boolean} [withTransition] - defaults to true
   */

  Vue.prototype.$appendTo = function (target, cb, withTransition) {
    return insert(this, target, cb, withTransition, append, appendWithTransition);
  };

  /**
   * Prepend instance to target
   *
   * @param {Node} target
   * @param {Function} [cb]
   * @param {Boolean} [withTransition] - defaults to true
   */

  Vue.prototype.$prependTo = function (target, cb, withTransition) {
    target = query(target);
    if (target.hasChildNodes()) {
      this.$before(target.firstChild, cb, withTransition);
    } else {
      this.$appendTo(target, cb, withTransition);
    }
    return this;
  };

  /**
   * Insert instance before target
   *
   * @param {Node} target
   * @param {Function} [cb]
   * @param {Boolean} [withTransition] - defaults to true
   */

  Vue.prototype.$before = function (target, cb, withTransition) {
    return insert(this, target, cb, withTransition, beforeWithCb, beforeWithTransition);
  };

  /**
   * Insert instance after target
   *
   * @param {Node} target
   * @param {Function} [cb]
   * @param {Boolean} [withTransition] - defaults to true
   */

  Vue.prototype.$after = function (target, cb, withTransition) {
    target = query(target);
    if (target.nextSibling) {
      this.$before(target.nextSibling, cb, withTransition);
    } else {
      this.$appendTo(target.parentNode, cb, withTransition);
    }
    return this;
  };

  /**
   * Remove instance from DOM
   *
   * @param {Function} [cb]
   * @param {Boolean} [withTransition] - defaults to true
   */

  Vue.prototype.$remove = function (cb, withTransition) {
    if (!this.$el.parentNode) {
      return cb && cb();
    }
    var inDocument = this._isAttached && inDoc(this.$el);
    // if we are not in document, no need to check
    // for transitions
    if (!inDocument) withTransition = false;
    var self = this;
    var realCb = function realCb() {
      if (inDocument) self._callHook('detached');
      if (cb) cb();
    };
    if (this._isFragment) {
      removeNodeRange(this._fragmentStart, this._fragmentEnd, this, this._fragment, realCb);
    } else {
      var op = withTransition === false ? removeWithCb : removeWithTransition;
      op(this.$el, this, realCb);
    }
    return this;
  };

  /**
   * Shared DOM insertion function.
   *
   * @param {Vue} vm
   * @param {Element} target
   * @param {Function} [cb]
   * @param {Boolean} [withTransition]
   * @param {Function} op1 - op for non-transition insert
   * @param {Function} op2 - op for transition insert
   * @return vm
   */

  function insert(vm, target, cb, withTransition, op1, op2) {
    target = query(target);
    var targetIsDetached = !inDoc(target);
    var op = withTransition === false || targetIsDetached ? op1 : op2;
    var shouldCallHook = !targetIsDetached && !vm._isAttached && !inDoc(vm.$el);
    if (vm._isFragment) {
      mapNodeRange(vm._fragmentStart, vm._fragmentEnd, function (node) {
        op(node, target, vm);
      });
      cb && cb();
    } else {
      op(vm.$el, target, vm, cb);
    }
    if (shouldCallHook) {
      vm._callHook('attached');
    }
    return vm;
  }

  /**
   * Check for selectors
   *
   * @param {String|Element} el
   */

  function query(el) {
    return typeof el === 'string' ? document.querySelector(el) : el;
  }

  /**
   * Append operation that takes a callback.
   *
   * @param {Node} el
   * @param {Node} target
   * @param {Vue} vm - unused
   * @param {Function} [cb]
   */

  function append(el, target, vm, cb) {
    target.appendChild(el);
    if (cb) cb();
  }

  /**
   * InsertBefore operation that takes a callback.
   *
   * @param {Node} el
   * @param {Node} target
   * @param {Vue} vm - unused
   * @param {Function} [cb]
   */

  function beforeWithCb(el, target, vm, cb) {
    before(el, target);
    if (cb) cb();
  }

  /**
   * Remove operation that takes a callback.
   *
   * @param {Node} el
   * @param {Vue} vm - unused
   * @param {Function} [cb]
   */

  function removeWithCb(el, vm, cb) {
    remove(el);
    if (cb) cb();
  }
}

function eventsAPI (Vue) {
  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   */

  Vue.prototype.$on = function (event, fn) {
    (this._events[event] || (this._events[event] = [])).push(fn);
    modifyListenerCount(this, event, 1);
    return this;
  };

  /**
   * Adds an `event` listener that will be invoked a single
   * time then automatically removed.
   *
   * @param {String} event
   * @param {Function} fn
   */

  Vue.prototype.$once = function (event, fn) {
    var self = this;
    function on() {
      self.$off(event, on);
      fn.apply(this, arguments);
    }
    on.fn = fn;
    this.$on(event, on);
    return this;
  };

  /**
   * Remove the given callback for `event` or all
   * registered callbacks.
   *
   * @param {String} event
   * @param {Function} fn
   */

  Vue.prototype.$off = function (event, fn) {
    var cbs;
    // all
    if (!arguments.length) {
      if (this.$parent) {
        for (event in this._events) {
          cbs = this._events[event];
          if (cbs) {
            modifyListenerCount(this, event, -cbs.length);
          }
        }
      }
      this._events = {};
      return this;
    }
    // specific event
    cbs = this._events[event];
    if (!cbs) {
      return this;
    }
    if (arguments.length === 1) {
      modifyListenerCount(this, event, -cbs.length);
      this._events[event] = null;
      return this;
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        modifyListenerCount(this, event, -1);
        cbs.splice(i, 1);
        break;
      }
    }
    return this;
  };

  /**
   * Trigger an event on self.
   *
   * @param {String|Object} event
   * @return {Boolean} shouldPropagate
   */

  Vue.prototype.$emit = function (event) {
    var isSource = typeof event === 'string';
    event = isSource ? event : event.name;
    var cbs = this._events[event];
    var shouldPropagate = isSource || !cbs;
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      // this is a somewhat hacky solution to the question raised
      // in #2102: for an inline component listener like <comp @test="doThis">,
      // the propagation handling is somewhat broken. Therefore we
      // need to treat these inline callbacks differently.
      var hasParentCbs = isSource && cbs.some(function (cb) {
        return cb._fromParent;
      });
      if (hasParentCbs) {
        shouldPropagate = false;
      }
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        var cb = cbs[i];
        var res = cb.apply(this, args);
        if (res === true && (!hasParentCbs || cb._fromParent)) {
          shouldPropagate = true;
        }
      }
    }
    return shouldPropagate;
  };

  /**
   * Recursively broadcast an event to all children instances.
   *
   * @param {String|Object} event
   * @param {...*} additional arguments
   */

  Vue.prototype.$broadcast = function (event) {
    var isSource = typeof event === 'string';
    event = isSource ? event : event.name;
    // if no child has registered for this event,
    // then there's no need to broadcast.
    if (!this._eventsCount[event]) return;
    var children = this.$children;
    var args = toArray(arguments);
    if (isSource) {
      // use object event to indicate non-source emit
      // on children
      args[0] = { name: event, source: this };
    }
    for (var i = 0, l = children.length; i < l; i++) {
      var child = children[i];
      var shouldPropagate = child.$emit.apply(child, args);
      if (shouldPropagate) {
        child.$broadcast.apply(child, args);
      }
    }
    return this;
  };

  /**
   * Recursively propagate an event up the parent chain.
   *
   * @param {String} event
   * @param {...*} additional arguments
   */

  Vue.prototype.$dispatch = function (event) {
    var shouldPropagate = this.$emit.apply(this, arguments);
    if (!shouldPropagate) return;
    var parent = this.$parent;
    var args = toArray(arguments);
    // use object event to indicate non-source emit
    // on parents
    args[0] = { name: event, source: this };
    while (parent) {
      shouldPropagate = parent.$emit.apply(parent, args);
      parent = shouldPropagate ? parent.$parent : null;
    }
    return this;
  };

  /**
   * Modify the listener counts on all parents.
   * This bookkeeping allows $broadcast to return early when
   * no child has listened to a certain event.
   *
   * @param {Vue} vm
   * @param {String} event
   * @param {Number} count
   */

  var hookRE = /^hook:/;
  function modifyListenerCount(vm, event, count) {
    var parent = vm.$parent;
    // hooks do not get broadcasted so no need
    // to do bookkeeping for them
    if (!parent || !count || hookRE.test(event)) return;
    while (parent) {
      parent._eventsCount[event] = (parent._eventsCount[event] || 0) + count;
      parent = parent.$parent;
    }
  }
}

function lifecycleAPI (Vue) {
  /**
   * Set instance target element and kick off the compilation
   * process. The passed in `el` can be a selector string, an
   * existing Element, or a DocumentFragment (for block
   * instances).
   *
   * @param {Element|DocumentFragment|string} el
   * @public
   */

  Vue.prototype.$mount = function (el) {
    if (this._isCompiled) {
      process.env.NODE_ENV !== 'production' && warn('$mount() should be called only once.', this);
      return;
    }
    el = query(el);
    if (!el) {
      el = document.createElement('div');
    }
    this._compile(el);
    this._initDOMHooks();
    if (inDoc(this.$el)) {
      this._callHook('attached');
      ready.call(this);
    } else {
      this.$once('hook:attached', ready);
    }
    return this;
  };

  /**
   * Mark an instance as ready.
   */

  function ready() {
    this._isAttached = true;
    this._isReady = true;
    this._callHook('ready');
  }

  /**
   * Teardown the instance, simply delegate to the internal
   * _destroy.
   *
   * @param {Boolean} remove
   * @param {Boolean} deferCleanup
   */

  Vue.prototype.$destroy = function (remove, deferCleanup) {
    this._destroy(remove, deferCleanup);
  };

  /**
   * Partially compile a piece of DOM and return a
   * decompile function.
   *
   * @param {Element|DocumentFragment} el
   * @param {Vue} [host]
   * @param {Object} [scope]
   * @param {Fragment} [frag]
   * @return {Function}
   */

  Vue.prototype.$compile = function (el, host, scope, frag) {
    return compile(el, this.$options, true)(this, el, host, scope, frag);
  };
}

/**
 * The exposed Vue constructor.
 *
 * API conventions:
 * - public API methods/properties are prefixed with `$`
 * - internal methods/properties are prefixed with `_`
 * - non-prefixed properties are assumed to be proxied user
 *   data.
 *
 * @constructor
 * @param {Object} [options]
 * @public
 */

function Vue(options) {
  this._init(options);
}

// install internals
initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
miscMixin(Vue);

// install instance APIs
dataAPI(Vue);
domAPI(Vue);
eventsAPI(Vue);
lifecycleAPI(Vue);

var slot = {

  priority: SLOT,
  params: ['name'],

  bind: function bind() {
    // this was resolved during component transclusion
    var name = this.params.name || 'default';
    var content = this.vm._slotContents && this.vm._slotContents[name];
    if (!content || !content.hasChildNodes()) {
      this.fallback();
    } else {
      this.compile(content.cloneNode(true), this.vm._context, this.vm);
    }
  },

  compile: function compile(content, context, host) {
    if (content && context) {
      if (this.el.hasChildNodes() && content.childNodes.length === 1 && content.childNodes[0].nodeType === 1 && content.childNodes[0].hasAttribute('v-if')) {
        // if the inserted slot has v-if
        // inject fallback content as the v-else
        var elseBlock = document.createElement('template');
        elseBlock.setAttribute('v-else', '');
        elseBlock.innerHTML = this.el.innerHTML;
        // the else block should be compiled in child scope
        elseBlock._context = this.vm;
        content.appendChild(elseBlock);
      }
      var scope = host ? host._scope : this._scope;
      this.unlink = context.$compile(content, host, scope, this._frag);
    }
    if (content) {
      replace(this.el, content);
    } else {
      remove(this.el);
    }
  },

  fallback: function fallback() {
    this.compile(extractContent(this.el, true), this.vm);
  },

  unbind: function unbind() {
    if (this.unlink) {
      this.unlink();
    }
  }
};

var partial = {

  priority: PARTIAL,

  params: ['name'],

  // watch changes to name for dynamic partials
  paramWatchers: {
    name: function name(value) {
      vIf.remove.call(this);
      if (value) {
        this.insert(value);
      }
    }
  },

  bind: function bind() {
    this.anchor = createAnchor('v-partial');
    replace(this.el, this.anchor);
    this.insert(this.params.name);
  },

  insert: function insert(id) {
    var partial = resolveAsset(this.vm.$options, 'partials', id, true);
    if (partial) {
      this.factory = new FragmentFactory(this.vm, partial);
      vIf.insert.call(this);
    }
  },

  unbind: function unbind() {
    if (this.frag) {
      this.frag.destroy();
    }
  }
};

var elementDirectives = {
  slot: slot,
  partial: partial
};

var convertArray = vFor._postProcess;

/**
 * Limit filter for arrays
 *
 * @param {Number} n
 * @param {Number} offset (Decimal expected)
 */

function limitBy(arr, n, offset) {
  offset = offset ? parseInt(offset, 10) : 0;
  n = toNumber(n);
  return typeof n === 'number' ? arr.slice(offset, offset + n) : arr;
}

/**
 * Filter filter for arrays
 *
 * @param {String} search
 * @param {String} [delimiter]
 * @param {String} ...dataKeys
 */

function filterBy(arr, search, delimiter) {
  arr = convertArray(arr);
  if (search == null) {
    return arr;
  }
  if (typeof search === 'function') {
    return arr.filter(search);
  }
  // cast to lowercase string
  search = ('' + search).toLowerCase();
  // allow optional `in` delimiter
  // because why not
  var n = delimiter === 'in' ? 3 : 2;
  // extract and flatten keys
  var keys = Array.prototype.concat.apply([], toArray(arguments, n));
  var res = [];
  var item, key, val, j;
  for (var i = 0, l = arr.length; i < l; i++) {
    item = arr[i];
    val = item && item.$value || item;
    j = keys.length;
    if (j) {
      while (j--) {
        key = keys[j];
        if (key === '$key' && contains(item.$key, search) || contains(getPath(val, key), search)) {
          res.push(item);
          break;
        }
      }
    } else if (contains(item, search)) {
      res.push(item);
    }
  }
  return res;
}

/**
 * Filter filter for arrays
 *
 * @param {String|Array<String>|Function} ...sortKeys
 * @param {Number} [order]
 */

function orderBy(arr) {
  var comparator = null;
  var sortKeys = undefined;
  arr = convertArray(arr);

  // determine order (last argument)
  var args = toArray(arguments, 1);
  var order = args[args.length - 1];
  if (typeof order === 'number') {
    order = order < 0 ? -1 : 1;
    args = args.length > 1 ? args.slice(0, -1) : args;
  } else {
    order = 1;
  }

  // determine sortKeys & comparator
  var firstArg = args[0];
  if (!firstArg) {
    return arr;
  } else if (typeof firstArg === 'function') {
    // custom comparator
    comparator = function (a, b) {
      return firstArg(a, b) * order;
    };
  } else {
    // string keys. flatten first
    sortKeys = Array.prototype.concat.apply([], args);
    comparator = function (a, b, i) {
      i = i || 0;
      return i >= sortKeys.length - 1 ? baseCompare(a, b, i) : baseCompare(a, b, i) || comparator(a, b, i + 1);
    };
  }

  function baseCompare(a, b, sortKeyIndex) {
    var sortKey = sortKeys[sortKeyIndex];
    if (sortKey) {
      if (sortKey !== '$key') {
        if (isObject(a) && '$value' in a) a = a.$value;
        if (isObject(b) && '$value' in b) b = b.$value;
      }
      a = isObject(a) ? getPath(a, sortKey) : a;
      b = isObject(b) ? getPath(b, sortKey) : b;
    }
    return a === b ? 0 : a > b ? order : -order;
  }

  // sort on a copy to avoid mutating original array
  return arr.slice().sort(comparator);
}

/**
 * String contain helper
 *
 * @param {*} val
 * @param {String} search
 */

function contains(val, search) {
  var i;
  if (isPlainObject(val)) {
    var keys = Object.keys(val);
    i = keys.length;
    while (i--) {
      if (contains(val[keys[i]], search)) {
        return true;
      }
    }
  } else if (isArray(val)) {
    i = val.length;
    while (i--) {
      if (contains(val[i], search)) {
        return true;
      }
    }
  } else if (val != null) {
    return val.toString().toLowerCase().indexOf(search) > -1;
  }
}

var digitsRE = /(\d{3})(?=\d)/g;

// asset collections must be a plain object.
var filters = {

  orderBy: orderBy,
  filterBy: filterBy,
  limitBy: limitBy,

  /**
   * Stringify value.
   *
   * @param {Number} indent
   */

  json: {
    read: function read(value, indent) {
      return typeof value === 'string' ? value : JSON.stringify(value, null, Number(indent) || 2);
    },
    write: function write(value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
  },

  /**
   * 'abc' => 'Abc'
   */

  capitalize: function capitalize(value) {
    if (!value && value !== 0) return '';
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1);
  },

  /**
   * 'abc' => 'ABC'
   */

  uppercase: function uppercase(value) {
    return value || value === 0 ? value.toString().toUpperCase() : '';
  },

  /**
   * 'AbC' => 'abc'
   */

  lowercase: function lowercase(value) {
    return value || value === 0 ? value.toString().toLowerCase() : '';
  },

  /**
   * 12345 => $12,345.00
   *
   * @param {String} sign
   * @param {Number} decimals Decimal places
   */

  currency: function currency(value, _currency, decimals) {
    value = parseFloat(value);
    if (!isFinite(value) || !value && value !== 0) return '';
    _currency = _currency != null ? _currency : '$';
    decimals = decimals != null ? decimals : 2;
    var stringified = Math.abs(value).toFixed(decimals);
    var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
    var i = _int.length % 3;
    var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
    var _float = decimals ? stringified.slice(-1 - decimals) : '';
    var sign = value < 0 ? '-' : '';
    return sign + _currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float;
  },

  /**
   * 'item' => 'items'
   *
   * @params
   *  an array of strings corresponding to
   *  the single, double, triple ... forms of the word to
   *  be pluralized. When the number to be pluralized
   *  exceeds the length of the args, it will use the last
   *  entry in the array.
   *
   *  e.g. ['single', 'double', 'triple', 'multiple']
   */

  pluralize: function pluralize(value) {
    var args = toArray(arguments, 1);
    return args.length > 1 ? args[value % 10 - 1] || args[args.length - 1] : args[0] + (value === 1 ? '' : 's');
  },

  /**
   * Debounce a handler function.
   *
   * @param {Function} handler
   * @param {Number} delay = 300
   * @return {Function}
   */

  debounce: function debounce(handler, delay) {
    if (!handler) return;
    if (!delay) {
      delay = 300;
    }
    return _debounce(handler, delay);
  }
};

function installGlobalAPI (Vue) {
  /**
   * Vue and every constructor that extends Vue has an
   * associated options object, which can be accessed during
   * compilation steps as `this.constructor.options`.
   *
   * These can be seen as the default options of every
   * Vue instance.
   */

  Vue.options = {
    directives: directives,
    elementDirectives: elementDirectives,
    filters: filters,
    transitions: {},
    components: {},
    partials: {},
    replace: true
  };

  /**
   * Expose useful internals
   */

  Vue.util = util;
  Vue.config = config;
  Vue.set = set;
  Vue['delete'] = del;
  Vue.nextTick = nextTick;

  /**
   * The following are exposed for advanced usage / plugins
   */

  Vue.compiler = compiler;
  Vue.FragmentFactory = FragmentFactory;
  Vue.internalDirectives = internalDirectives;
  Vue.parsers = {
    path: path,
    text: text,
    template: template,
    directive: directive,
    expression: expression
  };

  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */

  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   *
   * @param {Object} extendOptions
   */

  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var isFirstExtend = Super.cid === 0;
    if (isFirstExtend && extendOptions._Ctor) {
      return extendOptions._Ctor;
    }
    var name = extendOptions.name || Super.options.name;
    if (process.env.NODE_ENV !== 'production') {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn('Invalid component name: "' + name + '". Component names ' + 'can only contain alphanumeric characaters and the hyphen.');
        name = null;
      }
    }
    var Sub = createClass(name || 'VueComponent');
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(Super.options, extendOptions);
    Sub['super'] = Super;
    // allow further extension
    Sub.extend = Super.extend;
    // create asset registers, so extended classes
    // can have their private assets too.
    config._assetTypes.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }
    // cache constructor
    if (isFirstExtend) {
      extendOptions._Ctor = Sub;
    }
    return Sub;
  };

  /**
   * A function that returns a sub-class constructor with the
   * given name. This gives us much nicer output when
   * logging instances in the console.
   *
   * @param {String} name
   * @return {Function}
   */

  function createClass(name) {
    /* eslint-disable no-new-func */
    return new Function('return function ' + classify(name) + ' (options) { this._init(options) }')();
    /* eslint-enable no-new-func */
  }

  /**
   * Plugin system
   *
   * @param {Object} plugin
   */

  Vue.use = function (plugin) {
    /* istanbul ignore if */
    if (plugin.installed) {
      return;
    }
    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else {
      plugin.apply(null, args);
    }
    plugin.installed = true;
    return this;
  };

  /**
   * Apply a global mixin by merging it into the default
   * options.
   */

  Vue.mixin = function (mixin) {
    Vue.options = mergeOptions(Vue.options, mixin);
  };

  /**
   * Create asset registration methods with the following
   * signature:
   *
   * @param {String} id
   * @param {*} definition
   */

  config._assetTypes.forEach(function (type) {
    Vue[type] = function (id, definition) {
      if (!definition) {
        return this.options[type + 's'][id];
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
          if (type === 'component' && (commonTagRE.test(id) || reservedTagRE.test(id))) {
            warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + id);
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = id;
          definition = Vue.extend(definition);
        }
        this.options[type + 's'][id] = definition;
        return definition;
      }
    };
  });

  // expose internal transition API
  extend(Vue.transition, transition);
}

installGlobalAPI(Vue);

Vue.version = '1.0.24';

// devtools global hook
/* istanbul ignore next */
setTimeout(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue);
    } else if (process.env.NODE_ENV !== 'production' && inBrowser && /Chrome\/\d+/.test(window.navigator.userAgent)) {
      console.log('Download the Vue Devtools for a better development experience:\n' + 'https://github.com/vuejs/vue-devtools');
    }
  }
}, 0);

module.exports = Vue;
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":2}],7:[function(require,module,exports){
'use strict';

var chartist = require('chartist');

Vue.component('dashboard', {
    ready: function ready() {
        this.pageViewChart();
    },
    data: function data() {
        return {
            pages: []
        };
    },


    methods: {
        pageViewChart: function pageViewChart() {
            this.$http.get('/pages/top').then(function (response) {
                this.pages = response.data.pages;

                var labels = [];
                var series = [];

                for (var i = 0; i < this.pages.length; i++) {
                    if (i == 5) {
                        break;
                    }

                    labels.push(this.pages[i].name);
                    series.push(this.pages[i].views);
                }

                new chartist.Bar('#pageViewChart', {
                    labels: labels,
                    series: series
                }, {
                    distributeSeries: true
                });
            });
        }
    }
});

},{"chartist":1}],8:[function(require,module,exports){
'use strict';

Vue.component('pages', {
    ready: function ready() {
        this.prepareHash();
        this.getPages();

        window.onhashchange = this.handleHash;
    },
    data: function data() {
        return {
            pages: [],
            templates: [],
            errors: [],
            model: {
                name: '',
                template: ''
            },

            active: {},

            templateVariables: {},

            tvs: {},

            pageErrors: [],

            activeOriginal: {}
        };
    },


    computed: {
        parentPages: function parentPages() {
            return this.pages.filter(function (item) {
                return !item.child;
            });
        }
    },

    methods: {
        prepareHash: function prepareHash() {
            if (window.location.hash) {
                this.active.id = window.location.hash.substr(2);
            } else {
                window.location.href += "#/";
            }
        },
        isArray: function isArray(item) {
            return Array.isArray(item);
        },
        getPages: function getPages() {
            this.$http.get('/pages').then(function (response) {
                this.pages = response.data.pages;
                if (typeof this.active.id != 'undefined') {
                    this.setActive(this.active.id);
                }
                this.getTemplateVariableFields();
                this.getTemplates();
            }.bind(this));
        },
        getTemplates: function getTemplates() {
            this.$http.get('/templates').then(function (response) {
                this.templates = response.data.templates;
            }.bind(this));
        },
        newPage: function newPage() {
            this.$http.post('/pages/new', this.model).then(function (response) {
                if (response.data.status == 'error') {
                    this.errors = response.data.errors;
                } else {
                    this.getPages();
                    $('#newPage').modal('toggle');
                }
            }.bind(this));
        },
        deletePage: function deletePage() {
            if (confirm('Really delete this page and ALL of its children?')) {
                this.$http.post('/pages/' + this.active.id + '/delete').then(function (response) {
                    this.active = {};
                    this.getPages();
                }.bind(this));
            }
        },
        setActive: function setActive(id) {

            //TODO: Check for changes

            for (var i = 0; i < this.pages.length; i++) {
                if (this.pages[i].id == id) {
                    this.active = Vue.util.extend({}, this.pages[i]);
                    this.storeOriginal(this.active);
                    window.location.href = '#/' + this.pages[i].id;
                    this.getTemplateVariableFields();
                    break;
                }
            }
        },
        storeOriginal: function storeOriginal(obj) {
            this.activeOriginal = Vue.util.extend({}, obj);
        },
        handleHash: function handleHash() {

            //TODO: Check for changes

            //for (var i = 0; i < this.pages.length; i++) {
            //    if (this.pages[i].id == window.location.hash.substr(2)) {
            //        this.active = this.pages[i];
            //        this.getTemplateVariableFields();
            //        break;
            //    }
            //}

            this.setActive(window.location.hash.substr(2));

            if (window.location.hash == '#/') {
                this.active = {};
            }
        },
        getTemplateVariableFields: function getTemplateVariableFields() {
            this.$http.post('/template-variables', { 'template': this.active.template }).then(function (response) {
                this.templateVariables = response.data.categories;

                this.$http.get('/pages/' + this.active.id + '/tvs').then(function (response) {

                    var tv = response.data.tvs;

                    if (Array.isArray(tv) && tv.length == 0) {
                        tv = {};
                    }

                    for (var category in this.templateVariables) {
                        if (this.templateVariables.hasOwnProperty(category)) {
                            if (typeof tv[category] === 'undefined') {
                                tv[category] = {};

                                for (var field in this.templateVariables[category]) {
                                    if (this.templateVariables[category].hasOwnProperty(field)) {
                                        if (typeof tv[category][field] === 'undefined') {
                                            tv[category][field] = '';
                                        }
                                    }
                                }
                            }
                        }
                    }

                    this.$set('tvs', tv);
                }.bind(this));
            }.bind(this));
        },
        savePage: function savePage() {

            var proceed = true;
            var changed = false;

            if (this.activeOriginal.template != this.active.template) {
                changed = true;
                if (!confirm('Changing the template will erase all previous TV values, continue?')) {
                    proceed = false;
                }
            }

            if (proceed) {
                this.$http.post('/pages/' + this.active.id + '/update', this.active).then(function (response) {
                    if (response.data.status == 'error') {
                        this.pageErrors = response.data.errors;
                    } else {
                        this.pageErrors = {};
                        this.getPages();
                        if (changed) {
                            this.getTemplateVariableFields();
                        } else {
                            this.$http.post('/template-variables/save', { tvs: this.tvs, pageId: this.active.id });
                        }

                        this.storeOriginal(this.active);
                    }
                }.bind(this));
            }
        },
        makeIndex: function makeIndex() {
            this.$http.post('/option/update', { 'option': 'indexPage', 'value': this.active.id }).then(function (response) {
                this.active.isIndex = true;
                this.getPages();
            }.bind(this));
        }
    }
});

},{}],9:[function(require,module,exports){
'use strict';

Vue.component('themes', {
    ready: function ready() {
        this.getThemeFolders();
        this.getActiveTheme();
    },
    data: function data() {
        return {
            folders: [],
            activeTheme: ''
        };
    },


    methods: {
        getThemeFolders: function getThemeFolders() {
            this.$http.get('/list-themes').then(function (response) {
                this.folders = response.data.folders;
            }.bind(this));
        },
        getActiveTheme: function getActiveTheme() {
            this.$http.post('/option', { 'option': 'activeTheme' }).then(function (response) {
                this.activeTheme = response.data.option;
            }.bind(this));
        },
        setActiveTheme: function setActiveTheme() {
            this.$http.post('/option/update', { 'option': 'activeTheme', 'value': this.activeTheme }).then(function (response) {
                this.getActiveTheme();
            }.bind(this));
        }
    }
});

},{}],10:[function(require,module,exports){
'use strict';

Vue.component('users', {
    ready: function ready() {
        this.getLoggedInUser();
        this.getUsers();

        this.prepareHash();

        window.onhashchange = this.handleHash;
    },
    data: function data() {
        return {
            users: [],
            loggedInUser: {},
            active: {},
            userErrors: {},
            newUser: {},
            modalErrors: {}
        };
    },


    methods: {
        prepareHash: function prepareHash() {
            if (window.location.hash) {
                this.active.id = window.location.hash.substr(2);
            } else {
                window.location.href += "#/";
            }
        },
        handleHash: function handleHash() {

            this.setActive(window.location.hash.substr(2));

            if (window.location.hash == '#/') {
                this.active = {};
            }
        },
        getUsers: function getUsers() {
            this.$http.get('/users').then(function (response) {
                this.users = response.data.users;
                if (typeof this.active.id != 'undefined') {
                    this.setActive(this.active.id);
                }
            }.bind(this));
        },
        saveNewUser: function saveNewUser() {
            this.$http.post('/users/new', this.newUser).then(function (response) {
                if (response.data.status == 'error') {
                    this.modalErrors = response.data.errors;
                } else {
                    this.getUsers();
                    $('#newUser').modal('toggle');
                }
            }.bind(this));
        },
        save: function save() {
            this.$http.post('/users/update', this.active).then(function (response) {
                if (response.data.status == 'error') {
                    this.userErrors = response.data.errors;
                } else {
                    this.getUsers();
                    this.userErrors = {};
                }
            }.bind(this));
        },
        deleteUser: function deleteUser() {
            if (confirm('Really delete this user?')) {
                this.$http.post('/users/delete', this.active).then(function (response) {
                    this.active = {};
                    this.getUsers();
                }.bind(this));
            }
        },
        getLoggedInUser: function getLoggedInUser(user) {
            this.$http.get('/user').then(function (response) {
                this.loggedInUser = response.data.user;
            }.bind(this));
        },
        setActive: function setActive(id) {
            for (var i = 0; i < this.users.length; i++) {
                if (this.users[i].id == id) {
                    this.active = Vue.util.extend({}, this.users[i]);
                    window.location.href = '#/' + this.users[i].id;
                    break;
                }
            }
        }
    }
});

},{}],11:[function(require,module,exports){
'use strict';

var Vue = require('vue');
var VueRouter = require('vue-router');
Vue.use(require('vue-resource'));
Vue.use(VueRouter);

Vue.http.headers.common['X-CSRF-TOKEN'] = document.querySelector('[name="token"]').getAttribute("content");

window.Vue = Vue || require('vue');

require('./directives/trix');

require('./login');
require('./register');

require('./admin/dashboard');
require('./admin/pages');
require('./admin/themes');
require('./admin/users');

new Vue({
    el: 'body'
});

},{"./admin/dashboard":7,"./admin/pages":8,"./admin/themes":9,"./admin/users":10,"./directives/trix":12,"./login":13,"./register":14,"vue":6,"vue-resource":4,"vue-router":5}],12:[function(require,module,exports){
"use strict";

var _ = require('underscore');

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }return text;
}

/**
 * _ is underscore.js
 * Handles displaying of the Trix widget and data flow between textarea/vue.js model and widget.
 * @example <textarea v-model="message" v-trix></textarea>
 *          Trix widget display value will be changed if "message" is changed and vice versa.
 */
Vue.directive('trix', {
    unwatch: function unwatch() {},
    bind: function bind() {
        var _this = this;

        do {
            this.el.id = makeid();
        } while ($('#id').length);

        var $el = $(this.el);

        $el.css({ display: 'none' });

        var path = _.result(_.findWhere(this.el._vue_directives, { name: 'model' }), 'expression');

        this.$trix = $("<trix-editor class=\"trix-content\" input=\"" + this.el.id + "\"></trix-editor>");
        this.$trix.insertAfter($el);

        this.$trix.on('trix-change', function (e) {
            _this._updateModel(path, e.currentTarget.innerHTML);
        });

        this.unwatch = this.vm.$watch(path, function (value) {
            value = value == undefined ? '' : value;
            if (_this.$trix[0].innerHTML != value) {
                _this.$trix[0].editor.loadHTML(value);
            }
        });
    },
    unbind: function unbind() {
        this.unwatch();
    },
    _updateModel: function _updateModel(path, value) {
        this.vm.$set(path, value);
    }
});

},{"underscore":3}],13:[function(require,module,exports){
'use strict';

Vue.component('login', {
    data: function data() {
        return {
            model: {
                username: '',
                password: ''
            },
            errors: []
        };
    },


    methods: {
        submit: function submit() {
            this.$http.post('/login', this.model).then(function (response) {
                if (response.data.status == 'error') {
                    this.errors = response.data.errors;
                } else {
                    window.location.href = '/admin';
                }
            }.bind(this));
        }
    }
});

},{}],14:[function(require,module,exports){
'use strict';

Vue.component('register', {
    data: function data() {
        return {
            model: {
                username: '',
                password: '',
                password_confirmation: ''
            },
            errors: []
        };
    },


    methods: {
        submit: function submit() {
            this.$http.post('/register', this.model).then(function (response) {
                if (response.data.status == 'error') {
                    this.errors = response.data.errors;
                } else {
                    window.location.href = '/admin';
                }
            }.bind(this)).catch(function (error) {
                console.log(error);
            });
        }
    }
});

},{}]},{},[11]);

//# sourceMappingURL=bootstrap.js.map
