import Request from 'superagent';
import { CONSTANT } from '../constants/index';

class DataService {
    static post(url, data, next) {
        Request
            .post(url)
            .send(data)
            .end(function (err, res) {
                if (err || !res.ok) {
                    next({ status: res.status, data: res.body });
                } else {
                    if (res.status && res.status === CONSTANT.STATUS_SUCCESS) {
                        next({ status: res.status, data: res.body });
                    } else {
                        next({ status: res.status, data: res.body });
                    }
                }
            });
    }
}

export default DataService;