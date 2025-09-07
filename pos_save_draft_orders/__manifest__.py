# -*- coding: utf-8 -*-
{
    'name': "pos_save_draft_orders",

    'summary': "Save POS orders as draft and resume later until payment is completed.",

    'description': """
    
POS Save & Resume Orders
========================

This module allows POS users to save the current order as a draft and later
resume it to continue and complete the payment process.

    """,

    'author': "Apurva Wanjari",
    'category': 'point of sale',
    'website': 'https://apps.odoo.com/apps/modules/browse?search=apurva+wanjari',
    'version': '0.17',

    
    'depends': ['base','account','point_of_sale'],

   
    'data': [
       
    ],
    
    
    'assets': {
    'point_of_sale._assets_pos': [
        'pos_save_draft_orders/static/src/js/ErrorFallbackPopup.js',
        'pos_save_draft_orders/static/src/js/SaveResumePopup.js',
        'pos_save_draft_orders/static/src/js/DraftOrderListPopup.js',
        'pos_save_draft_orders/static/src/js/main.js',
        'pos_save_draft_orders/static/src/js/SaveSuccessPopup.js',
        'pos_save_draft_orders/static/src/xml/control_button_pos.xml',
        'pos_save_draft_orders/static/src/xml/draft_order_list_popup.xml',
        'pos_save_draft_orders/static/src/css/popup_styles.css',
        
    ],
},
    
    "images": ["static/description/banner.png"],
    "license": "LGPL-3",
    "installable": True,
    "application": False,
    "auto_install": False,
    
}

