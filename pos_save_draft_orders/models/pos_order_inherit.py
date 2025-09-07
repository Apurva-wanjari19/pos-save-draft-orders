# pos_order_draft.py
from odoo import models, fields, api
import logging

_logger = logging.getLogger(__name__)

class PosOrder(models.Model):
    _inherit = 'pos.order'

    draft_order_json = fields.Text("Draft Order JSON")