/*
    Description: API to sign the data for esewa signature
    Input: String (total_amount=100,transaction_uuid=11-201-13,product_code=EPAYTEST)
    Output: Signed string | Error
*/
import CryptoJS from 'crypto-js'
import { esewaSchema } from '~/shared/schemas/esewa';

const ESEWA_SECRET = process.env.ESEWA_SECRET
const messageCheck = /^(?=.*\btotal_amount=[^,]+)(?=.*\btransaction_uuid=[^,]+)(?=.*\bproduct_code=[^,]+)[^,]+(,[^,]+)*$/

export default defineEventHandler(async(event)=>{

    const body = await readBody(event);
    const {totalAmount, productCode} = body;

    //generate uuid 
    let uuid="___123" //temp uuid

    const message = `total_amount=${totalAmount},transaction_uuid=${uuid},product_code=${productCode}`
    const ismessageValid = messageCheck.test(message);

    if(!ismessageValid){
        setResponseStatus(event, 400);
        return {
            success: false,
            message: 'Body must be in the correct Format'
        }
    }

    if(!ESEWA_SECRET){
        setResponseStatus(event, 400);
        return {
            success: false,
            message: 'Esewa Secret Key is missing'
        }
    }

    const hash = CryptoJS.HmacSHA256(message, ESEWA_SECRET);
    const signature = CryptoJS.enc.Base64.stringify(hash);

    setResponseStatus(event, 200);
    return{
        success: true,
        message: {
            totalAmount, 
            productCode,
            transactionUuid: uuid,
            signature
        }
    }
})
