import request from '@/utils/request'

export function getProductList(params) {
    return request({
        url: 'web/product/list',
        method: 'post',
        data: params
    })
}

export function addProduct(params) {
    return request({
        url: 'web/product/add',
        method: 'post',
        data: params
    })
}

export function getClassList() {
    return request({
        url: 'web/productClass/list',
        method: 'post'
    })
}

export function addClass(params) {
    return request({
        url: 'web/productClass/add',
        method: 'post',
        data: params
    })
}
