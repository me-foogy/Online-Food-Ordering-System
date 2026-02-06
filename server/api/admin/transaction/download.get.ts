import { eq } from "drizzle-orm";
import ExcelJs from "exceljs";
import { db } from "~/server/drizzle";
import { paymentTable, usersTable } from "~/server/drizzle/schema";


export default defineEventHandler(async(event)=>{
    //get date from params
    const params = getQuery(event);
    const days = Number(params.date);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate()-days);

    //set up workbook for excel
    const workbook = new ExcelJs.Workbook();
    workbook.creator = 'The Restaurant Food Ordering App';
    const sheet = workbook.addWorksheet('Transactions');

    sheet.columns=[
        {header: 'Payment UUID', key: "paymentId",width: 36},
        { header: "Phone No", key: "phoneNo", width: 18},
        { header: "Product Code", key: "productCode",width: 20},
        { header: "Order ID", key: "ordersId", width: 12},
        { header: "Amount", key: "amount", width: 12},
        { header: "Status", key: "status", width: 18},
        { header: "Paid At", key: "paidAt", width: 22}
    ];

    const data = await db.select({
        paymentId: paymentTable.paymentId,
        amount: paymentTable.amount,
        productCode: paymentTable.productCode,
        ordersId: paymentTable.ordersId,
        status: paymentTable.status,
        paidAt: paymentTable.paidAt,
        remarks: paymentTable.remarks,
        phoneNo: usersTable.phoneNo
    }).from(paymentTable).leftJoin(usersTable, eq(usersTable.id, paymentTable.userId));

    const excelReadyData = data.map(payment=>({
        ...payment,
        amount: Number(payment.amount),
        phoneNo: Number(payment.phoneNo)
    }))

    excelReadyData.forEach(row => sheet.addRow(row));

    //define the type of response being sent back. ie Spreadsheet File
    setHeader(
        event, 
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    //trigger download after receiving response
    setHeader(event, 
        "content-deposition",
        "attachment; filename=transactions.xlsx"
    )

    
    return workbook.xlsx.writeBuffer();
})