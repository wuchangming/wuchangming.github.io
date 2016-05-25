(function() {
	var track = function(userId) {
		var beaconGif = "//beacon.woqu.com/track/beacon.gif";
		var domain = "woqu.com";

		var _extend = function(target, options) {
	        for (var name in options) {
	            target[name] = options[name];
	        }
	        return target;
	    }
		var _param = function(obj){
			var rtn = '';
			for(var name in obj){
				rtn += name + '=' + encodeURIComponent(obj[name]||'') + '&';
			}
			rtn = rtn.length > 0 ? rtn.substr(0, rtn.length -1) : rtn;
			return rtn;
		}
		var beaconCreator = function(userId) {
			this.setUserId(userId);
			plantCookie("_woqu_guid", getCookie("_woqu_guid") || randomGuid(), 365 * 2 * 24 * 60);
			this.guid = getCookie("_woqu_guid");
			var n = getCookie("_woqu_session");
			if (!n) {
				n = new Date().getTime();
			}
			plantCookie("_woqu_session", n, 30);
			this.session = getCookie("_woqu_session");
			this.referr = location.href;
		}
		beaconCreator.prototype.setUserId = function(n) {
			this.user_id = n == undefined ? 0 : n;
		};
		beaconCreator.prototype.visit = function(n) {
			return this._send(_extend({
				_type: "visit"
			}, n || {}));
		};
		beaconCreator.prototype._send = function(q) {
			if (q == undefined || q._type == undefined) {
				return false
			}
			if (document.referrer != "" && typeof(document.referrer) != "undefined") {
				var p = document.referrer
			} else {
				var p = ""
			}
			var o = "";
			var r = {
				type: q._type,
				url: location.href,
				referer: p,
				guid: this.guid,
				user_ac: this.user_id,
				token: getCookie("tk"),
				session: this.session,
				timestamp: new Date().getTime()
			};
			delete(q._type);
			delete(q._url);
			r.others = _param(q);
			var n = new Image();
			n.src = beaconGif + "?" + decodeURIComponent(_param(r));
			return true
		};
		this.beacon = new beaconCreator(userId);
		this.beacon.visit();

		function randomGuid() {
			var n = function() {
				return (((1 + Math.random()) * 65536) | 0).toString(16)
					.substring(1)
			};
			return (n() + n() + "-" + n() + "-" + n() + "-" + n() + "-" + n() + n() + n())
		}

		function plantCookie(p, r, q) {
			if (q) {
				var o = new Date();
				o.setTime(o.getTime() + (q * 60 * 1000));
				var n = "; expires=" + o.toGMTString()
			} else {
				var n = ""
			}
			document.cookie = p + "=" + r + n + "; path=/; domain=" + domain
		}
	}
	function getCookie(o) {
		var q = o + "=";
		var n = document.cookie.split(";");
		for (var p = 0; p < n.length; p++) {
			var r = n[p];
			while (r.charAt(0) == " ") {
				r = r.substring(1, r.length)
			}
			if (r.indexOf(q) == 0) {
				return r.substring(q.length, r.length)
			}
		}
		return null
	}
	var userId = getCookie("ac");
	new track(userId);
})();//
