// Generated by IcedCoffeeScript 1.3.3f
(function() {
  var Client, iced, __iced_k, __iced_k_noop;

  iced = require('iced-coffee-script').iced;
  __iced_k = __iced_k_noop = function() {};

  exports.Client = Client = (function() {

    function Client(transport, program) {
      this.transport = transport;
      this.program = program != null ? program : null;
      this.debug_hook = null;
    }

    Client.prototype.invoke = function(method, args, cb) {
      var arg, err, res, ___iced_passed_deferral, __iced_deferrals, __iced_k,
        _this = this;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      arg = {
        program: this.program,
        method: method,
        args: args,
        debug_hook: this.debug_hook
      };
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "src/cli.iced",
          funcname: "Client.invoke"
        });
        _this.transport.invoke(arg, __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              err = arguments[0];
              return res = arguments[1];
            };
          })(),
          lineno: 16
        }));
        __iced_deferrals._fulfill();
      })(function() {
        return cb(err, res);
      });
    };

    Client.prototype.notify = function(method, args) {
      var debug_hook, program;
      method = this.make_method(method);
      debug_hook = this._debug_hook;
      program = this._program;
      return this.transport.notify({
        program: this.program,
        method: method,
        args: args,
        debug_hook: this.debug_hook
      });
    };

    return Client;

  })();

}).call(this);