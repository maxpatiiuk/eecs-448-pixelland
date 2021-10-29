'use strict';

/**
 * Base class for components
 * @class Component
 * @constructor
 * @param {renderOptions}
 * @extends View
 * @public
 */
class Component extends View {
  constructor(renderOptions) {
    super({
      ...renderOptions,
      templateDirectory: 'components',
    });
  }
}
