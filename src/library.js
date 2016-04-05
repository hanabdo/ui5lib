/*!
 * This file is part of Flocking UI5 Playground
 * Copyright (C) 2016 Aleksey Krasnobaev <alekseykrasnobaev@gmail.com>
 *
 * You should have received a copy of the GNU General Public License
 * version 3 along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 */
sap.ui.define([
], function () {
  'use strict';

  sap.ui.getCore().initLibrary({
    name: 'zlib',
    version: '0.0.1',
    dependencies: ['sap.m'],
    noLibraryCSS: true,
  });

  return zlib;

}, /* bExport= */ true);
