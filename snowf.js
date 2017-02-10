/*!
 * snowf.js v0.0.1
 * 2016-2017 (c) - Fuxy526
 * Released under the MIT License.
 */
;(function(root, factory) {

	// CommonJS support
	if (typeof module === 'object' && module.exports) module.exports = factory();
	// AMD support
	else if (typeof define === 'function' && define.amd) define(factory);
	// Browser global
	else root.snowf = factory();

})(this, function() {

	var PLUGIN_NAME = 'snowf';
	var VERSION = '0.0.1';
	var config = {};

	// default options
	var defaults = {
		dom: document.body,   // HTMLDomElement or String
		amount: 50,           // Number
		size: 5,              // Numebr
		speed: 1.5,           // Number
		wind: 0,              // Number
		color: '#fff',        // String
		opacity: 0.8,         // Number
		swing: true,          // Boolean
		swingOffset: 1,       // Number
		image: null,          // String
		zIndex: null,         // Number
		pointerEvents: false, // Boolean
	};

	function Snowf(opt) {
		this.options = extend({}, defaults, config, opt);
	}

	/**
	 * Set propertys,create elements and init snow effect.
	 * @public
	 */
	Snowf.prototype.init = function() {
		if (this.canvas) return this;

		var o = this.options;
		this.dom = type(o.dom) === 'string' ? document.querySelector(o.dom) : o.dom;
		this.height = this.dom.offsetHeight;
		this.width = this.dom.offsetWidth;
		this.canvas = createEl('canvas', {
			className: PLUGIN_NAME + '-canvas',
			height: this.height,
			width: this.width
		});
		css(this.canvas, { position: 'absolute',	top: 0,	left: 0,	right: 0,	bottom: 0});
		if (o.zIndex) css(this.canvas, { zIndex: o.zIndex});
		if (!o.pointerEvents) css(this.canvas, { pointerEvents: 'none'});
		this.context = this.canvas.getContext('2d');
		this.flakes = [];
		this.animationFrame = null;
		this.dom.appendChild(this.canvas);

		return this.reset();
	};

	/**
	 * Reset the snow effect.
	 * @public
	 */
	Snowf.prototype.reset = function() {

		var self      = this,
				o         = self.options,
				dom       = self.dom,
				canvas    = self.canvas,
				ctx       = self.context,
				flakes    = self.flakes = [];

		function _init() {
			for (var i = 0; i < o.amount; i++) {
				flakes.push({
					x: random(0, self.width),
					y: random(0, self.height),
					r: random(o.size, o.size * 2) / 2,
					velX: 0,
					velY: random(o.speed, o.speed * 2),
					swing: random(0, 2*Math.PI),
					opacity: random(0, o.opacity)
				});
			}
			_snow();
		}

		function _snow() {
			var img;
			ctx.clearRect(0, 0, self.width, self.height);
			for (var i = 0; i < o.amount; i++) {
				var flake = flakes[i];

				if (!o.image) {
					ctx.beginPath();
					ctx.fillStyle = 'rgba(' + getRgb(o.color) + ',' + flake.opacity + ')';
					ctx.arc(flake.x, flake.y, flake.r, 2*Math.PI, false);
					ctx.fill();
					ctx.closePath();
				}
				else {
					if (!img) {
						img = new Image();
						img.src = o.image;
					}
					ctx.drawImage(img, flake.x - flake.r, flake.y - flake.r, 2 * flake.r, 2 * flake.r);
				}

				flake.velX = Math.abs(flake.velX) < Math.abs(o.wind) ? flake.velX + o.wind / 20 : o.wind;
				flake.y = flake.y + flake.velY * 0.5;
				flake.x = flake.x + (o.swing ? 0.4 * Math.cos(flake.swing += 0.03) * flake.opacity * o.swingOffset : 0) + flake.velX * 0.5;
				if (flake.x > self.width + flake.r || flake.x < -flake.r || flake.y > self.height + flake.r || flake.y < -flake.r) {
					_reset(flake);
				}
			}
			self.animationFrame = requestAnimationFrame(_snow);
		}

		function _reset(flake) {
			var prevR = flake.r;
			flake.r = random(o.size, o.size * 2) / 2;
			if (flake.x > self.width + prevR) {
				flake.x = -flake.r;
				flake.y = random(0, self.height);
			}
			else if (flake.x < -prevR) {
				flake.x = self.width + flake.r;
				flake.y = random(0, self.height);
			}
			else {
				flake.x = random(0, self.width);
				flake.y = -flake.r;
			}
			flake.velX = 0;
			flake.velY = random(o.speed, o.speed * 2);
			flake.swing = random(0, 2*Math.PI);
			flake.opacity = random(0, o.opacity);
		}

		cancelAnimationFrame(self.animationFrame);
		_init();
		return this;
	};

	/**
	 * Set options and reset snowflakes.
	 * @public
	 * @param {Object} opt
	 */
	Snowf.prototype.setOptions = function(opt) {
		extend(this.options, opt);
		return this.reset();
	};

	/**
	 * Change the wind level of snow
	 * @public
	 * @param {Number} wind: require
	 * @param {Number} time: optional, it will turn to the previous after this time
	 */
	Snowf.prototype.wind = function(wind, time) {
		var o = this.options, prevWind = o.wind;
		o.wind = wind;
		if (time) {
			setTimeout(function(){
				o.wind = prevWind;
			}, time);
		}
		return this;
	};

	/**
	 * Change the speed of snow
	 * @public
	 * @param {Number} speed
	 */
	Snowf.prototype.speed = function(speed) {
		var o = this.options, prevSpeed = o.speed;
		o.speed = speed;
		for (var i = 0; i < o.amount; i++) {
			this.flakes[i].velY *= speed / prevSpeed;
		}
		return this;
	};

	/**
	 * Adjust window size (use with window.onresize)
	 * @public
	 */
	Snowf.prototype.resize = function() {
		var o  = this.options,
				H0 = this.canvas.height,
				W0 = this.canvas.width,
				H1 = this.dom.offsetHeight,
				W1 = this.dom.offsetWidth;

		this.canvas.height = this.height = H1;
		this.canvas.width = this.width = W1;
		for (var i = 0; i < o.amount; i++) {
			var flake = this.flakes[i];
			flake.x = flake.x / W0 * W1;
			flake.y = flake.y / H0 * H1;
		}
		return this;
	};

	// Utility functions

	/**
	 * Extend an object.
	 * @private
	 */
	function extend() {
		var a = arguments;
		for (var i = 1, l = a.length; i < l; i++) {
			for (var p in a[i]) a[0][p] = a[i][p];
		}
		return a[0];
	}

	/**
	 * Get type of an object.
	 * @param {Any} o
	 * @private
	 */
	function type(o) {
		return Object.prototype.toString.call(o).toLowerCase().match(/\[object (\S*)\]/)[1];
	}

	/**
	 * Create an element.
	 * @param {String} tag
	 * @param {Object} props
	 * @private
	 */
	function createEl(tag, props) {
		var el = document.createElement(tag);
		for (var prop in props) {
			el[prop] = props[prop];
		}
		return el;
	}

	/**
	 * Set styles.
	 * @param {HTMLDomElement} el
	 * @param {Object} style
	 * @private
	 */
	function css(el, style) {
		return extend(el.style, style);
	}

	/**
	 * Get a random number in a range.
	 * @param {Number} min
	 * @param {Number} max
	 * @private
	 */
	function random(min, max) {
		var delta = max - min;
		return max === min ? min : Math.random() * delta + min;
	}

	/**
	 * Get rgb color.
	 * @param {String} str
	 * @private
	 */
	function getRgb(str) {
		var rgb = '';
		if (str.indexOf('#') === 0) {
			rgb = str.length === 4 ? str.substr(1).split('').map(function(n) {return parseInt(n.concat(n), 16);}).join(',') :
						str.length === 7 ? [str.substr(1,2), str.substr(3,2), str.substr(5,2)].map(function(n) {return parseInt(n, 16);}).join(',') :
						'255,255,255';
		}
		else if (str.indexOf('rgb(') === 0) {
			rgb = str.substring(4, str.length - 1);
		}
		else {
			rgb = '255,255,255';
		}
		return rgb;
	}

	var snowf = {
		version: VERSION,
		init: function(opt) {
			return new Snowf(opt).init();
		},
		config: function(conf) {
			config = conf;
		}
	};

	return snowf;

});