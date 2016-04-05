/*!
 * OpenUI5 wrapper for Flocking
 * Copyright (C) 2016 Aleksey Krasnobaev <alekseykrasnobaev@gmail.com>
 *
 * This module is licensed under GNU General Public License version 3.
 * You should have received a copy of the License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @requires sap.ui.base.ManagedObject
 * @requires Flocking
 */
sap.ui.define([
  'sap/ui/base/ManagedObject',
  'zlib/Flocking/native/dist/flocking-no-jquery',
], function (ManagedObject) {
  'use strict';

  /**
   * OpenUI5 wrapper for Flocking
   * {@link http://flockingjs.org/}
   *
   * @class zlib.Flocking
   * @extends sap.ui.base.ManagedObject
   */
  var FlockingUI5 = ManagedObject.extend('zlib.Flocking', /** @lends sap.ui.base.ManagedObject.prototype */ {
    metadata: {
      properties: {},
      aggregations: {},
      events: {},
    },

    /* events */

    /* mutators */

    /* public */

    /* private */

  });

  return FlockingUI5;

});
