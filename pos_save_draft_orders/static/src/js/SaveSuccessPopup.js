/** @odoo-module **/

import { AbstractAwaitablePopup } from "@point_of_sale/app/popup/abstract_awaitable_popup";
import { xml } from "@odoo/owl";

export class SaveSuccessPopup extends AbstractAwaitablePopup {
    static template = xml/* xml */`
        <div class="popup shadow p-4 bg-white rounded" style="min-width: 400px;">
            <h3 class="mb-3 fw-bold">Successfully!</h3>
            <p class="mb-4 text-dark" style="font-size: 15px;">
                Order has been saved to the backend in draft state. <br/>
                Order can be restored by selecting the <strong>Import draft POS order</strong> option.
            </p>
            <div class="text-end">
                <button class="btn btn-primary me-2" t-on-click="onClickOk">Ok</button>
                <button class="btn btn-light" t-on-click="cancel">Cancel</button>
            </div>
        </div>
    `;

        onClickOk() {
        if (this.props.onSuccessOk) {
            this.props.onSuccessOk();
        }
        this.confirm();
    }
}