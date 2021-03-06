// Generated by IcedCoffeeScript 1.3.3g
(function() {
  var ContextualServer, Handler, Listener, Server, SimpleServer, collect_hooks,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Listener = require('./listener').Listener;

  exports.collect_hooks = collect_hooks = function(proto) {
    var hooks, k, m, re, v;
    re = /^h_(.*)$/;
    hooks = {};
    for (k in proto) {
      v = proto[k];
      if ((m = k.match(re)) != null) hooks[m[1]] = v;
    }
    return hooks;
  };

  exports.Server = Server = (function(_super) {

    __extends(Server, _super);

    "This server is connection-centric. When the handlers of the\npassed programs are invoked, the 'this' object to the handler will\nbe the Transport that's handling that client. This server is available\nvia this.parent.\n\nNote you can pass a TransportClass to use instead of the Transport.\nIt should be a subclass of Transport.";


    function Server(d) {
      Server.__super__.constructor.call(this, d);
      this.programs = d.programs;
    }

    Server.prototype.got_new_connection = function(c) {
      return c.add_programs(this.programs);
    };

    return Server;

  })(Listener);

  exports.SimpleServer = SimpleServer = (function(_super) {

    __extends(SimpleServer, _super);

    function SimpleServer(d) {
      SimpleServer.__super__.constructor.call(this, d);
      this._program = d.program;
    }

    SimpleServer.prototype.got_new_connection = function(c) {
      this._hooks = collect_hooks(this);
      return c.add_program(this.get_program_name(), this._hooks);
    };

    SimpleServer.prototype.set_program_name = function(p) {
      return this._program = p;
    };

    SimpleServer.prototype.get_program_name = function() {
      var r;
      r = this._program;
      if (r == null) throw new Error("No 'program' given");
      return r;
    };

    SimpleServer.prototype.make_new_transport = function(c) {
      var x,
        _this = this;
      x = SimpleServer.__super__.make_new_transport.call(this, c);
      x.get_handler_this = function(m) {
        return _this;
      };
      return x;
    };

    return SimpleServer;

  })(Listener);

  exports.Handler = Handler = (function() {

    function Handler(_arg) {
      this.transport = _arg.transport, this.server = _arg.server;
    }

    Handler.collect_hooks = function() {
      return collect_hooks(this.prototype);
    };

    return Handler;

  })();

  exports.ContextualServer = ContextualServer = (function(_super) {

    __extends(ContextualServer, _super);

    "This exposes a slightly different object as `this` to RPC\nhandlers -- in this case, it a Handler object that points to be both\nthe parent server, and also the child transport.  So both are accessible\nvia 'has-a' rather than 'is-a' relationships.";


    function ContextualServer(d) {
      var klass, n, _ref;
      ContextualServer.__super__.constructor.call(this, d);
      this.programs = {};
      this.classes = d.classes;
      _ref = this.classes;
      for (n in _ref) {
        klass = _ref[n];
        this.programs[n] = klass.collect_hooks();
      }
    }

    ContextualServer.prototype.got_new_connection = function(c) {
      return c.add_programs(this.programs);
    };

    ContextualServer.prototype.make_new_transport = function(c) {
      var ctx, klass, n, x, _ref;
      x = ContextualServer.__super__.make_new_transport.call(this, c);
      ctx = {};
      _ref = this.classes;
      for (n in _ref) {
        klass = _ref[n];
        ctx[n] = new klass({
          transport: x,
          server: this
        });
      }
      x.get_handler_this = function(m) {
        var obj, pn;
        pn = m.split(".").slice(0, -1).join(".");
        if ((obj = ctx[pn]) == null) throw new Error("Couldn't find prog " + pn);
        return obj;
      };
      return x;
    };

    return ContextualServer;

  })(Listener);

}).call(this);
