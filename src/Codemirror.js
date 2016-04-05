/*!
 * OpenUI5 wrapper for CodeMirror
 * Copyright (C) 2016 Aleksey Krasnobaev <alekseykrasnobaev@gmail.com>
 *
 * This module is licensed under GNU General Public License version 3.
 * You should have received a copy of the License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @requires sap.m.TextArea
 * @requires CodeMirror
 */
sap.ui.define([
  'sap/m/TextArea',
  'zlib/CodeMirror/native/lib/codemirror',
], function (TextArea) {
  'use strict';

  // native css
  jQuery.sap.includeStyleSheet(
      jQuery.sap.getModulePath('zlib.CodeMirror.native.lib.codemirror', '.css')
  );

  // custom css
  jQuery.sap.includeStyleSheet(
      jQuery.sap.getModulePath('zlib.Codemirror', '.css')
  );

  /**
   * OpenUI5 wrapper for CodeMirror
   *
   * this module use `Codemirror` case while native application is `CodeMirror`
   *
   * CodemirrorConfig group properties are derived from Codemirror configuration
   * https://codemirror.net/doc/manual.html#config
   *
   * @property {sap.ui.core.CSSSize} [height='auto']
   *
   * @property {string} [mode=undefined]
   * @property {string} [theme=undefined]
   * @property {boolean} [lineNumbers=true]
   * @property {boolean} [lineWrapping=true]
   * @property {boolean} [readOnly=false]
   * @property {boolean} [autoCloseBrackets=true]
   * @property {boolean} [matchBrackets=true]
   * @property {object} [highlightSelectionMatches={
            showToken: /\w/,
            annotateScrollbar: false, // disabled due to bug
     }]
   * @property {boolean} [foldGutter=true]
   *
   * @class zlib.Codemirror
   * @extends sap.m.TextArea
   */
  var CodemirrorUI5 = TextArea.extend('zlib.Codemirror', /** @lends sap.m.TextArea.prototype */ {
    metadata: {
      properties: {
        height: {
          type: 'sap.ui.core.CSSSize',
          group: 'Dimension',
          defaultValue: 'auto',
        },

        /* CodemirrorConfig */

        mode: {
          type: 'string',
          group: 'CodemirrorConfig',
          defaultValue: undefined,
        },
        theme: {
          type: 'string',
          group: 'CodemirrorConfig',
          defaultValue: undefined,
        },
        lineNumbers: {
          type: 'boolean',
          group: 'CodemirrorConfig',
          defaultValue: true,
        },
        lineWrapping: {
          type: 'boolean',
          group: 'CodemirrorConfig',
          defaultValue: true,
        },
        readOnly: {
          type: 'boolean',
          group: 'CodemirrorConfig',
          defaultValue: false,
        },
        autoCloseBrackets: {
          type: 'boolean',
          group: 'CodemirrorConfig',
          defaultValue: true,
        },
        matchBrackets: {
          type: 'boolean',
          group: 'CodemirrorConfig',
          defaultValue: true,
        },
        highlightSelectionMatches: {
          type: 'object',
          group: 'CodemirrorConfig',
          defaultValue: {
            showToken: /\w/,
            annotateScrollbar: false, // disabled due to bug
          },
        },
        foldGutter: {
          type: 'boolean',
          group: 'CodemirrorConfig',
          defaultValue: false,
        },

        gutters: {
          type: 'string[]',
          group: 'CodemirrorConfig',
          defaultValue: [],
          private: true,
        },
      },
      aggregations: {},
      events: {
        liveChange: {
          parameters: {
            value: 'string',
          },
        },
      },
    },

    _editor: null,
    dfdAfterRendering: null,

    constructor: function () {
      // always init private variables before call parent
      this.dfdAfterRendering = jQuery.Deferred();

      TextArea.apply(this, arguments);
    },

    /**
     * sapui5 is unable to focus on codemirror
     * by overriding sap.ui.Element.prototype.getFocusDomRef
     */
    focus: function () {
      this._editor.focus();
    },

    /* events */

    /**
     * @param {sap.ui.base.Event} oEvent
     */
    onAfterRendering: function (oEvent) {
      if (!this._editor) {
        this._editor = CodeMirror.fromTextArea(
            this._getCodemirrorDomRef(),
            {
              mode: this.getMode(),
              theme: this.getTheme(),
              lineNumbers: this.getLineNumbers(),
              lineWrapping: this.getLineWrapping(),
              readOnly: this.getReadOnly(),
              autoCloseBrackets: this.getAutoCloseBrackets(),
              matchBrackets: this.getMatchBrackets(),
              highlightSelectionMatches: this.getHighlightSelectionMatches(),
              foldGutter: this.getFoldGutter(),
              gutters: this.getGutters(),
            }
        );
        this._editor.on('changes', this._setValue.bind(this));

        // this can be changed in future
        // this._editor.setOption('viewportMargin', 'Infinity');
      }
      this.dfdAfterRendering.resolve();
    },

    /* mutators */

    /**
     * ui5 -> CodeMirror
     * @param      {string}  sValue
     */
    setValue: function (sValue) {
      jQuery.when(this.dfdAfterRendering).then(function () {
        if (sValue) {
          this.setProperty('value', sValue);
          this._editor.setValue(sValue);
        }
      }.bind(this));
    },

    /**
     * codemirror -> ui5
     * @param      {Codemirror}  oCodemirror Codemirror instance
     */
    _setValue: function (oCodemirror) {
      var sNewValue = oCodemirror.getValue();

      this.setProperty('value', sNewValue);
      this.fireLiveChange({
        id: '', // id should present by some reason
        formula: sNewValue,
      });
    },

    /**
     * @param      {boolean}  bVisible
     */
    setVisible: function (bVisible) {
      this.setProperty('visible', bVisible);
      this.rerender();
    },

    /**
     * @param      {boolean}  bVisible
     */
    setLineNumbers: function (val) {
      this.setProperty('lineNumbers', val);
      if (val) {
        this.insertGutter('CodeMirror-linenumbers');
      } else {
        this.removeGutter('CodeMirror-linenumbers');
      }
    },

    /**
     * @param {[type]} val [description]
     */
    setTheme: function (val) {
      this.setProperty('theme', val);
      jQuery.sap.includeStyleSheet(
          jQuery.sap.getModulePath(
              'zlib.CodeMirror.native.theme.' + val, '.css'
          )
      );
    },

    /**
     * @param {string} val [description]
     */
    setMode: function (val) {
      this.setProperty('mode', val);
      jQuery.sap.require(
          'zlib.CodeMirror.native.mode.' + val + '.' + val
      );
    },

    /**
     * @param {boolean} val [description]
     */
    setAutoCloseBrackets: function (val) {
      this.setProperty('autoCloseBrackets', val);
      jQuery.sap.require(
          'zlib.CodeMirror.native.addon.edit.closebrackets'
      );
    },

    /**
     * @param {boolean} val [description]
     */
    setMatchBrackets: function (val) {
      this.setProperty('matchBrackets', val);
      jQuery.sap.require(
          'zlib.CodeMirror.native.addon.edit.matchbrackets'
      );
    },

    /**
     * @param {object} val [description]
     */
    setHighlightSelectionMatches: function (val) {
      this.setProperty('highlightSelectionMatches', val);

      jQuery.sap.require(
          'zlib.CodeMirror.native.addon.scroll.annotatescrollbar'
      );
      jQuery.sap.require(
          'zlib.CodeMirror.native.addon.scroll.matchesonscrollbar'
      );
      jQuery.sap.require(
          'zlib.CodeMirror.native.addon.scroll.searchcursor'
      );
      jQuery.sap.require(
          'zlib.CodeMirror.native.addon.scroll.match-highlighter'
      );
    },

    /**
     * @param {object} val [description]
     */
    setFoldGutter: function (val) {
      this.setProperty('foldGutter', val);

      if (val) {
        jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(
            'zlib.CodeMirror.native.addon.fold.foldgutter',  '.css'
        ));
        jQuery.sap.require(
            'zlib.CodeMirror.native.addon.fold.foldcode'
        );
        jQuery.sap.require(
            'zlib.CodeMirror.native.addon.fold.foldgutter'
        );
        jQuery.sap.require(
            'zlib.CodeMirror.native.addon.fold.brace-fold'
        );
        jQuery.sap.require(
            'zlib.CodeMirror.native.addon.fold.comment-fold'
        );

        this.insertGutter('CodeMirror-foldgutter');
      } else {
        this.removeGutter('CodeMirror-foldgutter');
      }

    },

    /**
     * return copy
     * @return {string[]}
     */
    getGutters: function () {
      return jQuery.extend([], this.getProperty('gutters'));
    },

    /**
     * @param  {string} sGutter
     */
    insertGutter: function (sGutter) {
      jQuery.sap.assert(
        typeof sGutter === 'string',
        'gutter should be type of string'
      );

      if (this.getProperty('gutters').indexOf(sGutter) === -1) {
        this.setProperty(
          'gutters',
          [sGutter].concat(this.getProperty('gutters'))
        );
      }
    },

    /**
     * @param  {string} sGutter
     */
    removeGutter: function (sGutter) {
      jQuery.sap.assert(
        typeof sGutter === 'string',
        'gutter should be type of string'
      );

      var i = this.getProperty('gutters').indexOf(sGutter);
      if (i !== -1) {
        this.getProperty('gutters').splice(i, 1);
      }
    },

    /**
     *
     */
    removeAllGutters: function () {
      this.setProperty('gutters', []);
    },

    /* public */

    /**
     * insert operator on Codemirror's current position
     *
     * @param {string) text to insert
     */
    insertTextInCurrentCursorPosition: function (str) {
      try {
        this._editor.replaceRange(str, this._editor.getCursor());
      } catch (e) {
        jQuery.sap.log.error(
            this.getMetadata().getName(),
            'Unable to insert string into CodeMirror',
            e
        );
      }
    },

    /* private */

    _getCodemirrorDomRef: function () {
      return this.getDomRef().children[0];
    },

    /* renderer */

    renderer: {
      /**
       * @param {sap.ui.core.RenderManager} oRM The RenderManager that can be used for writing to the Render-Output-Buffer
       * @param {sap.m.TextArea} oCodemirror
       */
      render: function (oRM, oCodemirror) {
        oRM.write('<div');
        oRM.writeControlData(oCodemirror);

        // classes
        oRM.addClass('zCodemirror');
        oRM.writeClasses();

        oRM.write('>');

        oRM.write('<textarea');
        oRM.writeAttribute('id', oCodemirror.getId() + '--cm');
        oRM.writeAttribute('name', 'codemirror');
        oRM.write('></textarea>');

        oRM.write('</div>');
      },

      updateVisibility: function (oRM, oCodemirror) {
        jQuery(oCodemirror._getCodemirrorDomRef().nextSibling)
          .css('display', oCodemirror.getVisible() ? '' : 'none');
      },

    },

    /**
     * sapui5 rerender is unnecessary due to codemirror
     */
    rerender: function () {
      var oRM = sap.ui.getCore().getRenderManager();
      // sap.ui.core.UIArea.rerenderControl(this);

      this.getRenderer().updateVisibility(oRM, this);
      this._editor.refresh();
    },

  });

  return CodemirrorUI5;

});
