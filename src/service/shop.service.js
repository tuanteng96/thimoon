import http from "../service/http-common";

class ShopDataService {
    getCate(id, stockid) {
        return http.get(`/app/index.aspx?cmd=cate_parentid&id=${id}&stockid=${stockid}`);
    }
    getList(id, pi, ps, tags, keys, stockid, status) {
        return http.get(`/app/index.aspx?cmd=search_prods&key=${keys}&cates=${id}&pi=${pi}&ps=${ps}&tags=${tags}&stockid=${stockid}&status=${status ? status : ""}`);
    }
    getListProduct(id, stockid, count) {
        return http.get(`/app/index.aspx?cmd=search_prods&key=&cates=${id}&pi=1&ps=${count}&tags=&stockid=${stockid}`);
    }
    getTitleCate(id) {
        return http.get(`/api/v3/content?cmd=id&id=${id}&tb=categories`);
    }
    getDetail(id) {
        return http.get(`/app/index.aspx?id=${id}&cmd=prodid`);
    }
    getDetailFull(id, userId) {
        return http.get(`/api/v3/prod?cmd=getid&id=${id}&mid=${userId}`);
    }
    getServiceParent(id, stock) {
        return http.get(`/api/v3/app2?get=sv&cid=${id}&stockid=${stock}&takes=detail,desc`);
    }
    getServiceParentID(id, stockid) {
        return http.get(`/app/index.aspx?cmd=service_parentid&id=${id}&stockid=${stockid}`);
    }
    getServiceOriginal() {
        return http.get(`/api/v3/prod?cmd=roots`);
    }
    getServiceProdID(id, stockid) {
        return http.get(`/app/index.aspx?cmd=service_prodsid&id=${id}&stockid=${stockid}`);
    }
    getSearchService(keys, cateId) {
        return http.get(`/app/index.aspx?cmd=search_prods&key=${keys}&cates=${cateId}&pi=1&ps=1000`);
    }
    getProd() {
        return http.get(`/app/index.aspx?cmd=ProdService`);
    }
    getUpdateOrder(data) {
        return http.post(`/api/v3/orderclient?cmd=get`, data);
    }
    searchVoucher(data) {
        return http.get(`/api/v3/VoucherClient?cmd=precheck&orderid=${data.orderId}&vcode=${data.vcode}`);
    }
    searchProd(data) {
        return http.get(`/app/index.aspx?cmd=search_prods&key=${data.key}&cates=&pi=1&ps=${data.count}&tags=&stockid=${data.stockid}`);
    }
}

export default new ShopDataService();