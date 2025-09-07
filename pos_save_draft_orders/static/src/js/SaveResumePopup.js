/** @odoo-module **/

import { AbstractAwaitablePopup } from "@point_of_sale/app/popup/abstract_awaitable_popup";
import { xml } from "@odoo/owl";

console.log("popup is working")

export class SaveResumePopup extends AbstractAwaitablePopup {
    static template = xml/* xml */`
        <div class="popup popup--save-resume shadow p-4 bg-white rounded" style="min-width: 400px;">
            <div class="mb-4">
                <h3 class="fw-bold fs-5 mb-3">Select Pre-Order Option</h3>

                <div class="border d-flex justify-content-between align-items-center p-3 rounded mb-2 cursor-pointer"
                     t-on-click="() => this.confirm('save')"
                     style="border-color: #ccc;">
                    <span>Save a POS order to be drafted.</span>
                    <span class="text-muted">&gt;</span>
                </div>

                <div class="border d-flex justify-content-between align-items-center p-3 rounded mb-3 cursor-pointer"
                     t-on-click="() => this.confirm('import')"
                     style="border-color: #ccc;">
                    <span>Import draft POS order.</span>
                    <span class="text-muted">&gt;</span>
                </div>
            </div>

            <div class="text-end">
                <button class="btn btn-light" t-on-click="cancel">Cancel</button>
            </div>
        </div>
    `;

    async getPayload() {
        return this.choice;
    }

    confirm(choice) {
        this.choice = choice;
        super.confirm();
    }
}
