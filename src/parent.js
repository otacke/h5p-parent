const Child = require('./child.js');
const EventDispatcher = H5P.EventDispatcher;

/**
 * @class
 */
function Parent(constructor, parameters) {
  const self = this;
  EventDispatcher.call(self);

  self.children = [];

  /**
   * Update the internal indexes of the children.
   *
   * @private
   * @param {number} from Where to start
   */
  var updateIndexes = function (from) {
    for (let i = from; i < self.children.length; i++) {
      self.children[i].index = i;
    }
  };

  /**
   * Give a new child to this parent.
   *
   * @param {*} childParameters Launch parameters
   */
  self.addChild = function (childParameters, index) {
    if (index === undefined) {
      index = self.children.length
    }

    // Create a new child with the current instance as its parent
    const instance = new Child(index, self);

    if (index === self.children.length) {
      // Added at the end
      self.children.push(instance);
    }
    else {
      // Inserted at a specific location
      self.children.splice(index, 0, instance);
      updateIndexes(index);
    }

    // Run original constructor
    constructor.call(instance, childParameters);

    return instance;
  };

  /**
   * Remova a new child from its parent.
   *
   * @param {number} index
   */
  self.removeChild = function (index) {
    // Remove from array
    self.children.splice(index, 1);

    // Update internal indexes
    updateIndexes(index);
  };

  /**
   * Move the child into a new position
   *
   * @param {number} oldIndex
   * @param {number} newIndex
   */
  self.moveChild = function (oldIndex, newIndex) {
    const child = self.children.splice(oldIndex, 1)[0];
    self.children.splice(newIndex, 0, child);

    updateIndexes(newIndex < oldIndex ? newIndex : oldIndex);
  };

  if (parameters) {
    for (let i = 0; i < parameters.length; i++) {
      self.addChild(parameters[i]);
    }
  }
}

Parent.prototype = Object.create(EventDispatcher.prototype);
Parent.prototype.constructor = Parent;

module.exports = Parent;
