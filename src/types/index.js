const FLASHSALE_STATUS = {
    'inactive': 'inactive',
    'active': 'active',
    'pending': 'pending'
}

const CART_STATE = {
    'active': 'active',
    'completed': 'completed',
    'failed': 'failed',
    'pending': 'pending'
}

const VOUCHER_STATE = {
    'fixed_amount': 'fixed_amount',
    'percent_amount': 'percent_amount'
}

const VOUCHER_APPLY_TYPE = {
    't_all': 'all',
    't_001': 'book',
    't_002': 'clothing',
    't_003': 'electronic',
}

const VOUCHER_APPLY_TO = {
    'all': 'all',
    'specific': 'specific'
}

const ORDER_STATUS = {
    'pending': 'pending',
    'confirm': 'confirm',
    'shipped': 'shipped',
    'cancelled': 'cancelled',
    'delivered': 'delivered'
}

module.exports = {
    FLASHSALE_STATUS,
    CART_STATE,
    VOUCHER_STATE,
    VOUCHER_APPLY_TO,
    ORDER_STATUS,
    VOUCHER_APPLY_TYPE
}