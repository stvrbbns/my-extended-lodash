/* -- Known Issues, Suggested Updates/Improvements, and Notices --
  NONE
*/

// dependencies
var lodash = require('lodash');
var _ = lodash;



_.mixin({
  evaluatePredicateDescriptor: function (context, descriptor) {
    'use strict';
    // A predicate descriptor must be an object with a valid 'op' String property, an appropriate 'arg' property value, and can optionally have a 'path' property.
    // e.g.
    // var egContext = [ [1, 2, 3], [2, 4, 6], [3, 6, 9, 12, 15] ];
    // var egDescriptor = { op: 'any', arg: { path: 'length', op: 'gt', arg: 6 } };
    // var result = _.evaluatePredicateDescriptor(egContext, egDescriptor); // false
    // egDescriptor = { op: 'any', arg: { op: 'any', arg: { op: 'equals', arg: 15 } } };
    // result = _.evaluatePredicateDescriptor(egContext, egDescriptor); // true
    if (descriptor === 'true' || descriptor === true) { return true; }
    if (descriptor === 'false' || descriptor === false) { return false; }
    if (!_.isEmpty(descriptor.path)) {
      context = _.get(context, descriptor.path)
    }
    switch (descriptor.op) {
      case 'true':
        return true;
        break;
      case 'false':
        return false;
        break;
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
        let regex = null;
        if (_.isRegExp(descriptor.arg)) {
          regex = descriptor.arg;
        } else {
          let i = descriptor.arg.lastIndexOf('/');
          let pattern = descriptor.arg.substring(1, i);
          let flags = descriptor.arg.substring(i + 1);
          regex = new RegExp(pattern, flags);
        }
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
