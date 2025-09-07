from odoo import http
from odoo.http import request
import json
import logging

_logger = logging.getLogger(__name__)

class PosDraftOrderController(http.Controller):

    @http.route('/pos/save_draft_order', type='json', auth='user')
    def save_draft_order(self, ui_order):
        try:
            _logger.info("📝 Received order to draft: %s", ui_order)

            # Wrap in {'data': ...}
            results = request.env['pos.order'].with_context(
                skip_paid_check=True,
                pos_draft_order=True
            ).create_from_ui([{'data': ui_order}])

            if not results or not isinstance(results, list):
                raise Exception("No response from POS order creation.")

            first_result = results[0]
            order_id = first_result.get("id")
            pos_reference = first_result.get("pos_reference")

            if not order_id or not pos_reference:
                raise Exception("POS Order was not created properly.")

            order = request.env['pos.order'].sudo().browse(order_id)
            if not order.exists():
                raise Exception("Order does not exist after creation.")

            order.write({
                'state': 'draft',
                'draft_order_json': json.dumps(ui_order),
            })

            _logger.info("✅ Draft order saved with ID %s and reference %s", order_id, pos_reference)
            return {"success": True, "order_id": order_id, "pos_reference": pos_reference}

        except Exception as e:
            _logger.error("❌ Failed to create draft order: %s", str(e))
            import traceback
            _logger.error("❌ Traceback:\n%s", traceback.format_exc())
            return {"success": False, "error": str(e)}





#get in import
    @http.route('/pos/get_draft_orders', type='json', auth='user')
    def get_draft_orders(self):
        try:
            _logger.info("📥 Fetching draft POS orders...")
            orders = request.env['pos.order'].sudo().search([('state', '=', 'draft')])

            result = []
            for order in orders:
                if not order.draft_order_json:
                    _logger.warning("⚠️ Order ID %s missing draft_order_json", order.id)
                    continue  # ❗ Skip corrupted draft
                result.append({
                    'id': order.id,
                    'uid': order.pos_reference,
                    'pos_reference': order.pos_reference,
                    'customer_name': order.partner_id.name or "Guest",
                    'order_data_json': order.draft_order_json,
                })

            _logger.info("✅ Returning %d valid draft orders.", len(result))
            return result

        except Exception as e:
            _logger.error("❌ Failed to fetch draft orders: %s", str(e))
            return []
