/*!
 * This file is part of zlib library
 * Copyright (C) 2016 Aleksey Krasnobaev <alekseykrasnobaev@gmail.com>
 *
 * You should have received a copy of the GNU General Public License
 * version 3 along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @requires sap.m.Popover
 */
sap.ui.define([
  'sap/m/Popover',
], function (Popover) {
  'use strict';

  /**
   * @class zlib.Tooltip
   * @extends sap.ui.core.Popover
   * @author Aleksey Krasnobaev <alekseykrasnobaev@gmail.com>
   */
  var Tooltip = Popover.extend('zlib.Tooltip', /** @lends sap.ui.core.Popover.prototype */ {
    metadata: {
      properties: {},
      aggregations: {},
      events: {},
    },

    /* events */

    attachTo: function (oControl) {
      oControl.addEventDelegate({
        onmouseover: function (oEvent) {
          this.openBy(oControl);
          setTimeout(function () {
            this.close();
          }.bind(this), 2000);
        }.bind(this),
        onmouseout: function (oEvent) {
          this.close();
        }.bind(this),
      });
    },

    /* mutators */

    /* public */

    /* private */

    /* renderer */

    renderer: {
      render: function (oRM, oControl) {
      oRM.write('<div');
        oRM.writeAttributeEscaped('data-tooltip', oControl.getTitle());
      oRM.writeControlData(oControl);

      oRM.write('>');
      oRM.write('<div style="display:hodden"');

      this.renderContent(oRM, oControl);
      oRM.write('</div>');
      oRM.write('</div>');
      },
    },

  });

  return Tooltip;

});
