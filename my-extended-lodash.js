/* -- Known Issues, Suggested Updates/Improvements, and Notices --
  NONE
*/

// dependencies
var lodash = require('lodash');
var _ = lodash;



_.mixin({
  evaluatePredicateDescriptor: function (context, descriptor) {
    // A predicate descriptor must be an object with a valid 'op' String property, an appropriate 'arg' property value, and can optionally have a 'path' property.
    // e.g.
    // var egContext = [ [1, 2, 3], [2, 4, 6], [3, 6, 9, 12, 15] ];
    // var egDescriptor = { op: 'any', arg: { path: 'length', op: 'gt', arg: 6 } };
    // var result = _.evaluatePredicateDescriptor(egContext, egDescriptor); // false
    // egDescriptor = { op: 'any', arg: { op: 'any', arg: { op: 'equals', arg: 15 } } };
    // result = _.evaluatePredicateDescriptor(egContext, egDescriptor); // true
    if (!_.isEmpty(descriptor.path)) {
      context = _.get(context, descriptor.path)
    }
    switch (descriptor.op) {
      case 'and':
        return _.every(descriptor.arg, function (childDescriptor) {
          return _.evaluatePredicateDescriptor(context, childDescriptor);
        });
        break;
      case 'or':
        return _.some(descriptor.arg, function (childDescriptor) {
          return _.evaluatePredicateDescriptor(context, childDescriptor);
        });
      case 'not':
        return !_.evaluatePredicateDescriptor(context, descriptor.arg);
        break;
      case 'all':
        return _.every(context, function (contextArrayElement) {
          return _.evaluatePredicateDescriptor(contextArrayElement, descriptor.arg);
        });
        break;
      case 'any':
        return _.some(context, function (contextArrayElement) {
          return _.evaluatePredicateDescriptor(contextArrayElement, descriptor.arg);
        });
        break;
      case 'every':
        return _.every(context, descriptor.arg);
        break;
      case 'some':
        return _.some(context, descriptor.arg);
        break;
      case 'lt':
        return _.lt(context, descriptor.arg);
        break;
      case 'lte':
        return _.lte(context, descriptor.arg);
        break;
      case 'equals':
        return _.isEqual(context, descriptor.arg);
        break;
      case 'gte':
        return _.gte(context, descriptor.arg);
        break;
      case 'gt':
        return _.gt(context, descriptor.arg);
        break;
      case 'matches':
        return _.isMatch(context, descriptor.arg);
        break;
      case 'regex':
        var i = descriptor.arg.lastIndexOf('/');
        var pattern = descriptor.arg.substring(1, i);
        var flags = descriptor.arg.substring(i + 1);
        var regex = new RegExp(pattern, flags);
        return regex.test(context);
        break;
      default:
        console.warn('_.evaluatePredicateDescriptor() processed a descriptor without a valid operation.');
        break;
    }
    return false;
  }
});



module.exports = lodash;
