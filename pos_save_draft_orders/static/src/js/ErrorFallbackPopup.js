/** @odoo-module **/

import { AbstractAwaitablePopup } from "@point_of_sale/app/popup/abstract_awaitable_popup";
import { xml } from "@odoo/owl";

export class ErrorFallbackPopup extends AbstractAwaitablePopup {
    static template = xml/* xml */ `
        <div class="popup shadow p-4 bg-white rounded" style="min-width: 400px;">
            <h3 class="mb-3 fw-bold text-danger">Error</h3>
            <p class="mb-4 text-dark" style="font-size: 15px;">
                <t t-esc="props.body"/>
            </p>
            <div class="text-end">
                <button class="btn btn-danger me-2" t-on-click="confirm">Ok</button>
            </div>
        </div>
    `;
}
