/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { SaveResumePopup } from "./SaveResumePopup";
import { SaveSuccessPopup } from "./SaveSuccessPopup";
import { ErrorFallbackPopup } from "./ErrorFallbackPopup";
import { useService } from "@web/core/utils/hooks";
import { DraftOrderListPopup } from "./DraftOrderListPopup";


patch(ProductScreen.prototype, {
    setup() {
        super.setup();
        this.rpc = useService("rpc");
        this.popup = useService("popup");
        this.pos = useService("pos");
    },

    async onClickSaveResume() {
        const { confirmed, payload } = await this.popup.add(SaveResumePopup);
        if (!confirmed) return;

        // SAVE current order as draft
        if (payload === 'save') {
            const currentOrder = this.pos.get_order();

            try {
                const result = await this.rpc("/pos/save_draft_order", {
                    ui_order: currentOrder.export_as_JSON(),
                });

                if (result && result.success) {
                    await this.popup.add(SaveSuccessPopup, {
                        onSuccessOk: () => {
                            this.pos.removeOrder(currentOrder);
                            const newOrder = this.pos.add_new_order();
                            this.pos.set_order(newOrder);
                            this.pos.resetProductScreenSearch();

                            this.pos.showScreen("TicketScreen");
                            setTimeout(() => {
                                this.pos.showScreen("ProductScreen");
                            }, 50);
                        },
                    });
                } else {
                    throw new Error("Backend did not confirm success.");
                }
            } catch (error) {
                console.error("❌ Error creating draft order:", error);
                this.popup.add(ErrorFallbackPopup, {
                    title: "Draft Save Failed",
                    body: "The order could not be saved as a draft. Please try again.",
                });
            }
        }

        // IMPORT and load selected draft order
        else if (payload === 'import') {
            try {
                console.log("🟡 [IMPORT] Fetching draft orders...");

                const orders = await this.rpc("/pos/get_draft_orders", {});

                if (!orders || orders.length === 0) {
                    console.warn("⚠️ [IMPORT] No draft orders found.");
                    await this.popup.add(ErrorFallbackPopup, {
                        title: "No Draft Orders",
                        body: "There are no draft POS orders available.",
                    });
                    return;
                }

                console.log("🟢 [IMPORT] Received draft orders:", orders);

                const { confirmed, payload: selectedOrder } = await this.popup.add(DraftOrderListPopup, {
                    orders,
                });

                if (!confirmed || !selectedOrder) {
                    console.warn("🟠 [IMPORT] No draft order selected.");
                    return;
                }

                console.log("✅ [IMPORT] User selected draft order:", selectedOrder);

                if (!selectedOrder.order_data_json) {
                    throw new Error("Selected order missing order_data_json");
                }

                // Load the selected draft order into POS
                const restoredOrder = this.pos.add_new_order();
                restoredOrder.init_from_JSON(
                    JSON.parse(selectedOrder.order_data_json)
                );
                this.pos.set_order(restoredOrder);

                // Redirect to TicketScreen after import
                this.pos.showScreen("TicketScreen");

                console.log("🟢 [IMPORT] Order fully loaded into POS:", restoredOrder);


            } catch (error) {
                console.error("❌ [IMPORT] Failed to import draft orders:", error);
                this.popup.add(ErrorFallbackPopup, {
                    title: "Import Failed",
                    body: "Could not load draft POS orders.",
                });
            }
        }
    },
});
