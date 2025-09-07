/** @odoo-module **/
import { AbstractAwaitablePopup } from "@point_of_sale/app/popup/abstract_awaitable_popup";
import { useState } from "@odoo/owl";

export class DraftOrderListPopup extends AbstractAwaitablePopup {
    static template = "DraftOrderListPopup";  
    
    setup() {
        super.setup();
        this.state = useState({
            selectedIndex: null,
            orders: this.props.orders || []  
        });
        console.log("[POPUP] Initialized with orders:", this.state.orders);
    }

    select(index) {
    console.log("[POPUP] select() called with index:", index);
    console.log("[POPUP] Current state.orders:", this.state.orders);
    console.log("[POPUP] Current selectedIndex:", this.state.selectedIndex);
    this.state.selectedIndex = index;
}

    getPayload() {
        if (this.state.selectedIndex === null) return null;
        return this.state.orders[this.state.selectedIndex];
    }

    async confirm() {
    console.log("[POPUP] Confirm clicked, selected index:", this.state.selectedIndex);
    if (this.state.selectedIndex === null) {
        console.warn("[POPUP] No draft order selected.");
        return false;
    }
    const selectedOrder = this.state.orders[this.state.selectedIndex];
    console.log("[POPUP] Selected order payload:", selectedOrder);
    return super.confirm();
}

}
DraftOrderListPopup.template = 'DraftOrderListPopup';
