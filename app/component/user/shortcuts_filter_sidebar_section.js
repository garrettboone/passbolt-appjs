/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) Passbolt SARL (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Passbolt SARL (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         2.0.0
 */
import Action from 'passbolt-mad/model/map/action';
import Filter from 'app/model/map/filter';
import MadBus from 'passbolt-mad/control/bus';
import MenuComponent from 'passbolt-mad/component/menu';
import PrimarySidebarSectionComponent from 'app/component/workspace/primary_sidebar_section';

import template from 'app/view/template/component/user/shortcuts_filter_sidebar_section.stache!';

const ShortcutsFilterSidebarSectionComponent = PrimarySidebarSectionComponent.extend('passbolt.component.user.ShortcutsFilterSidebarSection', /** @static */ {

  defaults: {
    allFilter: null,
    template: template
  }

}, /** @prototype */ {

  /**
   * @inheritdoc
   */
  afterStart: function() {
    this.options.menu = this._initShortcutsList();
    this._super();
  },

  /**
   * Init the shortcuts list.
   */
  _initShortcutsList: function() {
    const menu = new MenuComponent($('ul', this.element)[0]);
    menu.start();

    // All
    const allItem = new Action({
      id: 'js_users_wsp_filter_all',
      label: __('All users'),
      filter: this.options.allFilter
    });
    menu.insertItem(allItem);
    menu.selectItem(allItem);

    // Modified
    const modifiedItem = new Action({
      id: 'js_users_wsp_filter_recently_modified',
      label: __('Recently modified'),
      filter: new Filter({
        id: 'workspace_filter_modified',
        label: __('Recently modified'),
        order: ['User.modified DESC']
      })
    });
    menu.insertItem(modifiedItem);

    return menu;
  },

  /* ************************************************************** */
  /* LISTEN TO THE VIEW EVENTS */
  /* ************************************************************** */

  /**
   * An item has been selected
   * @parent mad.component.Menu.view_events
   * @param {HTMLElement} el The element the event occured on
   * @param {HTMLEvent} ev The event which occured
   */
  '{element} item_selected': function(el, ev) {
    const item = ev.data.item;
    // If this item is not disabled, try to execute the item action.
    if (!item.state.is('disabled')) {
      MadBus.trigger('filter_workspace', {filter: item.filter});
    }
  },

  /* ************************************************************** */
  /* LISTEN TO THE APP EVENTS */
  /* ************************************************************** */

  /**
   * Listen to the workspace is filtered
   * @param {HTMLElement} el The element the event occured on
   * @param {HTMLEvent} ev The event which occured
   */
  '{mad.bus.element} filter_workspace': function(el, ev) {
    const filter = ev.data.filter;
    const menu = this.options.menu;
    menu.unselectAll();

    // If the filter is relative to a filter registered in this component, select it.
    menu.options.items.forEach(item => {
      if (item.filter.id == filter.id) {
        menu.selectItem(item);
      }
    });
  }
});

export default ShortcutsFilterSidebarSectionComponent;
