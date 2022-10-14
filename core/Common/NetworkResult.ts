import {Complex} from "./Complex/Complex";
import {ErrorCodeMapper} from "./ErrorCodeMapper/ErrorCodeMapper";
import {Response} from "express";

export class NetworkResult {
    public static send(complex: Complex<any>, res: Response<any, any>) {
        res.status(complex.isError ? ErrorCodeMapper.getCode(complex.COMPLEX_TYPE, complex.errorCode) : 200)
            .send({
                message: complex.errorMessage,
                data: complex.data
            });
    }
}
