import Request from 'superagent';
import { CONSTANT } from '../constants/index';

class DataService {
    static post(url, data, header, next) {
        Request
            .post(url)
            .send(data)
            .set(header)
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

    static generateUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

export default DataService;